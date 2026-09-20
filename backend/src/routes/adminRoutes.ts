import { Router } from 'express';
import { AdminController } from '../controllers/adminController';
import { authenticate, authorizeAdmin } from '../middleware/auth';
import { authLimiter } from '../middleware/rateLimiter';

const router = Router();

router.get('/dashboard', authLimiter, authenticate, authorizeAdmin, AdminController.getDashboard);

export default router;
