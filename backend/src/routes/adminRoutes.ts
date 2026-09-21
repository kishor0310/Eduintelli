import { Router } from 'express';
import { AdminController } from '../controllers/adminController';
import { authenticate, authorizeAdmin } from '../middleware/auth';
import { adminLimiter } from '../middleware/rateLimiter';

const router = Router();

// Rate-limited admin dashboard endpoint (prevents resource exhaustion - CWE-400)
router.get('/dashboard', authenticate, authorizeAdmin, adminLimiter, AdminController.getDashboard);

export default router;
