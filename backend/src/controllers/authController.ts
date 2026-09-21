import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 login attempts per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many login attempts, please try again later.' }
});
import { db } from '../database/db';
import { config } from '../config';
import { loginSchema, registerSchema } from '../validators';
import { AuthRequest } from '../middleware/auth';

export class AuthController {
  public static async login(req: Request, res: Response, next: NextFunction) {
    try {
      await loginLimiter(req, res, () => {}); // enforce rate limiting
      if (res.headersSent) return;
      const { email, password } = loginSchema.parse(req.body);

      const user = await db.get<any>('SELECT * FROM users WHERE email = $1', [email]);
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
      }

      // Remove demo back‑door; only allow bcrypt verification
      const isMatch = await bcrypt.compare(password, user.password_hash || '');
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
      }

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
      // CWE-285: Enforce strict role authorization check on registration to prevent vertical privilege escalation
      if (req.body.role === 'ADMIN' || (req.body.role && !['STUDENT', 'TEACHER'].includes(req.body.role))) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden: Self-registration with administrative privileges is prohibited.',
        });
      }

      const data = registerSchema.parse(req.body);
      const assignedRole: 'STUDENT' | 'TEACHER' = data.role === 'TEACHER' ? 'TEACHER' : 'STUDENT';

      const existingUser = await db.get<any>('SELECT id FROM users WHERE email = $1', [data.email]);
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(data.password, salt);
      const userId = `usr-${Date.now()}`;

      await db.run(
        `INSERT INTO users (id, name, email, password_hash, role, status)
         VALUES ($1, $2, $3, $4, $5, 'ACTIVE')`,
        [userId, data.name, data.email, passwordHash, assignedRole]
      );

      let studentId = undefined;
      let teacherId = undefined;

      if (assignedRole === 'STUDENT') {
        studentId = `std-${Date.now()}`;
        await db.run(
          `INSERT INTO students (id, user_id, roll_number, department, semester, batch, cgpa, academic_risk_score, risk_level)
           VALUES ($1, $2, $3, $4, 1, '2024-2028', 3.5, 10, 'LOW')`,
          [studentId, userId, data.rollNumber || `CS2024-${Math.floor(100 + Math.random() * 900)}`, data.department]
        );
      } else if (assignedRole === 'TEACHER') {
        teacherId = `tch-${Date.now()}`;
        await db.run(
          `INSERT INTO teachers (id, user_id, employee_id, department, designation)
           VALUES ($1, $2, $3, $4, 'Assistant Professor')`,
          [teacherId, userId, data.employeeId || `FAC-${Math.floor(100 + Math.random() * 900)}`, data.department]
        );
      }

      const token = jwt.sign(
        {
          id: userId,
          email: data.email,
          role: assignedRole,
          name: data.name,
          studentId,
          teacherId,
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
          teacherId,
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
