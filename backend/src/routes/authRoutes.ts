import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { authLimiter, profileLimiter } from '../middleware/rateLimiter';
import { csrfProtection, generateCsrfToken } from '../middleware/csrf';

const router = Router();

// Anti-CSRF token generation endpoint (CWE-352)
router.get('/csrf-token', (req, res) => {
  const token = generateCsrfToken();
  res.cookie('XSRF-TOKEN', token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
  return res.status(200).json({ success: true, csrfToken: token });
});

router.post('/login', authLimiter, csrfProtection, AuthController.login);
router.post('/register', authLimiter, csrfProtection, AuthController.register);
// Rate-limited user profile endpoint (prevents resource exhaustion - CWE-400)
router.get('/me', authenticate, profileLimiter, AuthController.getMe);

export default router;
