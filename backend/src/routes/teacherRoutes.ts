import { Router } from 'express';
import { TeacherController } from '../controllers/teacherController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/dashboard', authenticate, TeacherController.getDashboard);
router.get('/:id/dashboard', authenticate, TeacherController.getDashboard);
router.post('/intervene', authenticate, TeacherController.triggerIntervention);

export default router;
