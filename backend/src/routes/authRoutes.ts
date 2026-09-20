import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { authLimiter } from '../middleware/rateLimiter';
import { csrfProtection } from '../middleware/csrf';

const router = Router();

router.post('/login', authLimiter, AuthController.login);
router.post('/register', authLimiter, csrfProtection, AuthController.register);
router.get('/me', authenticate, AuthController.getMe);

export default router;
