import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import { db } from '../database/db';
import { config } from '../config';
import { loginSchema, registerSchema } from '../validators';
import { AuthRequest } from '../middleware/auth';
import { authLimiter } from '../middleware/rateLimiter';
import { isValidCsrfToken } from '../middleware/csrf';

// Rate limiting on login endpoint (prevents brute force & credential stuffing - CWE-307)
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  statusCode: 429,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  validate: { xForwardedForHeader: true, default: true },
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again after 15 minutes.',
  },
});

// CWE-307: In-controller failed login attempt tracker to prevent brute force & credential stuffing attacks
const loginAttemptsMap = new Map<string, { count: number; firstAttempt: number }>();
const MAX_LOGIN_ATTEMPTS = 5;
const LOGIN_LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes

export class AuthController {
  // Rate limiter reference for login endpoint (CWE-307)
  public static readonly loginLimiter = loginLimiter;

  public static async enforceLoginRateLimit(req: Request, res: Response): Promise<boolean> {
    if ((req as any).loginRateLimitEnforced) return !res.headersSent;
    (req as any).loginRateLimitEnforced = true;
    await new Promise<void>((resolve, reject) => {
      loginLimiter(req, res, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
    return !res.headersSent;
  }

  private static recordFailedAttempt(clientIp: string): number {
    const now = Date.now();
    const record = loginAttemptsMap.get(clientIp);
    if (!record || now - record.firstAttempt >= LOGIN_LOCKOUT_MS) {
      loginAttemptsMap.set(clientIp, { count: 1, firstAttempt: now });
      return 1;
    }
    record.count += 1;
    return record.count;
  }

  public static async login(req: Request, res: Response, next: NextFunction) {
    try {
      // Enforce rate limiting on login endpoint (CWE-307)
      const isAllowed = await AuthController.enforceLoginRateLimit(req, res);
      if (!isAllowed) return;

      const rawIp = req.ip || req.socket?.remoteAddress || '127.0.0.1';
      const clientIp = Array.isArray(rawIp) ? rawIp[0] : String(rawIp).split(',')[0].trim();

      // CWE-307: Rate limiting check on login endpoint - block if brute force threshold reached
      const activeRecord = loginAttemptsMap.get(clientIp);
      if (activeRecord) {
        if (Date.now() - activeRecord.firstAttempt < LOGIN_LOCKOUT_MS) {
          if (activeRecord.count >= MAX_LOGIN_ATTEMPTS) {
            return res.status(429).json({
              success: false,
              message: 'Too many authentication attempts. Please try again after 15 minutes.',
            });
          }
        } else {
          loginAttemptsMap.delete(clientIp);
        }
      }

      const { email, password } = loginSchema.parse(req.body);

      const user = await db.get<any>('SELECT * FROM users WHERE email = $1', [email]);
      if (!user) {
        const attempts = AuthController.recordFailedAttempt(clientIp);
        if (attempts >= MAX_LOGIN_ATTEMPTS) {
          return res.status(429).json({
            success: false,
            message: 'Too many authentication attempts. Please try again after 15 minutes.',
          });
        }
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
      }

      // Remove demo back‑door; only allow bcrypt verification
      const isMatch = await bcrypt.compare(password, user.password_hash || '');
      if (!isMatch) {
        // CWE-307: Record failed attempt and enforce rate limit lockout after 5 attempts
        const attempts = AuthController.recordFailedAttempt(clientIp);
        if (attempts >= MAX_LOGIN_ATTEMPTS) {
          return res.status(429).json({
            success: false,
            message: 'Too many authentication attempts. Please try again after 15 minutes.',
          });
        }
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
      }

      // Reset failed attempts on successful login
      loginAttemptsMap.delete(clientIp);

      // Find role-specific profile ID
      let studentId = undefined;
      let teacherId = undefined;
      let adminId = undefined;

      if (user.role === 'STUDENT') {
        const student = await db.get<any>('SELECT id FROM students WHERE user_id = $1', [user.id]);
        studentId = student?.id;
      } else if (user.role === 'TEACHER') {
        const teacher = await db.get<any>('SELECT id FROM teachers WHERE user_id = $1', [user.id]);
        teacherId = teacher?.id;
      } else if (user.role === 'ADMIN') {
        const admin = await db.get<any>('SELECT id FROM admins WHERE user_id = $1', [user.id]);
        adminId = admin?.id;
      }

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
          name: user.name,
          studentId,
          teacherId,
          adminId,
        },
        config.jwtSecret,
        { expiresIn: '7d' }
      );

      return res.status(200).json({
        success: true,
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatarUrl: user.avatar_url,
          studentId,
          teacherId,
          adminId,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async register(req: Request, res: Response, next: NextFunction) {
    try {
      // CWE-352: Enforce anti-CSRF token verification on user registration
      const csrfToken =
        req.headers['x-csrf-token'] ||
        req.headers['xsrf-token'] ||
        (req.body && (req.body.csrf_token || req.body._csrf));
      if (!csrfToken || !isValidCsrfToken(csrfToken, req)) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden: CSRF validation failed. Valid anti-CSRF token required for registration.',
        });
      }

      // CWE-285: Enforce strict role authorization on registration to prevent vertical privilege escalation
      if (req.body.role && req.body.role !== 'STUDENT') {
        return res.status(403).json({
          success: false,
          message: 'Forbidden: Self-registration with elevated privileges (TEACHER, ADMIN) is prohibited. Faculty accounts must be provisioned by administrators.',
        });
      }

      const data = registerSchema.parse(req.body);
      const assignedRole: 'STUDENT' = 'STUDENT';

      const existingUser = await db.get<any>('SELECT id FROM users WHERE email = $1', [data.email]);
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(data.password, salt);
      const userId = `usr-${Date.now()}`;

      // CWE-285 Protection: Strictly enforce hardcoded STUDENT role in database insert
      await db.run(
        `INSERT INTO users (id, name, email, password_hash, role, status)
         VALUES ($1, $2, $3, $4, 'STUDENT', 'ACTIVE')`,
        [userId, data.name, data.email, passwordHash]
      );

      const studentId = `std-${Date.now()}`;
      await db.run(
        `INSERT INTO students (id, user_id, roll_number, department, semester, batch, cgpa, academic_risk_score, risk_level)
         VALUES ($1, $2, $3, $4, 1, '2024-2028', 3.5, 10, 'LOW')`,
        [studentId, userId, data.rollNumber || `CS2024-${Math.floor(100 + Math.random() * 900)}`, data.department]
      );

      const token = jwt.sign(
        {
          id: userId,
          email: data.email,
          role: assignedRole,
          name: data.name,
          studentId,
        },
        config.jwtSecret,
        { expiresIn: '7d' }
      );

      return res.status(201).json({
        success: true,
        message: 'Account registered successfully',
        token,
        user: {
          id: userId,
          name: data.name,
          email: data.email,
          role: assignedRole,
          studentId,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getMe(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const user = await db.get<any>(
        'SELECT id, name, email, role, avatar_url, phone, status, created_at FROM users WHERE id = $1',
        [req.user.id]
      );

      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      let profileData = null;
      if (user.role === 'STUDENT') {
        profileData = await db.get<any>('SELECT * FROM students WHERE user_id = $1', [user.id]);
      } else if (user.role === 'TEACHER') {
        profileData = await db.get<any>('SELECT * FROM teachers WHERE user_id = $1', [user.id]);
      } else if (user.role === 'ADMIN') {
        profileData = await db.get<any>('SELECT * FROM admins WHERE user_id = $1', [user.id]);
      }

      return res.status(200).json({
        success: true,
        user: {
          ...user,
          profile: profileData,
          studentId: profileData?.id && user.role === 'STUDENT' ? profileData.id : undefined,
          teacherId: profileData?.id && user.role === 'TEACHER' ? profileData.id : undefined,
          adminId: profileData?.id && user.role === 'ADMIN' ? profileData.id : undefined,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
