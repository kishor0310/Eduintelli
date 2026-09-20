import { Router } from 'express';
import { AdminController } from '../controllers/adminController';
import { authenticate, authorizeAdmin } from '../middleware/auth';

const router = Router();

router.get('/dashboard', authenticate, authorizeAdmin, AdminController.getDashboard);

export default router;
