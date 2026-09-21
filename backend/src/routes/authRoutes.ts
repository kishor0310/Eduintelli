import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { authLimiter, profileLimiter } from '../middleware/rateLimiter';
import { csrfProtection } from '../middleware/csrf';

const router = Router();

router.post('/login', authLimiter, csrfProtection, AuthController.login);
router.post('/register', authLimiter, csrfProtection, AuthController.register);
// Rate-limited user profile endpoint (prevents resource exhaustion - CWE-400)
router.get('/me', authenticate, profileLimiter, AuthController.getMe);

export default router;
