import { Router } from 'express';
import { TeacherController } from '../controllers/teacherController';
import { authenticate, authorizeTeacher } from '../middleware/auth';

const router = Router();

router.get('/dashboard', authenticate, authorizeTeacher, TeacherController.getDashboard);
router.get('/:id/dashboard', authenticate, authorizeTeacher, TeacherController.getDashboard);
router.post('/intervene', authenticate, authorizeTeacher, TeacherController.triggerIntervention);

export default router;
