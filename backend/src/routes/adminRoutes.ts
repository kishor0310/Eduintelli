import { Router } from 'express';
import { AdminController } from '../controllers/adminController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/dashboard', authenticate, AdminController.getDashboard);

export default router;
