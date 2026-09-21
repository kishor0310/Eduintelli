import { Router } from 'express';
import { TeacherController } from '../controllers/teacherController';
import { authenticate, authorizeTeacher } from '../middleware/auth';
import { csrfProtection } from '../middleware/csrf';

const router = Router();

router.get('/dashboard', authenticate, authorizeTeacher, TeacherController.getDashboard);
router.get('/:id/dashboard', authenticate, authorizeTeacher, TeacherController.getDashboard);
// Anti-CSRF protection on faculty intervention POST endpoint (CWE-352)
router.post('/intervene', authenticate, authorizeTeacher, csrfProtection, TeacherController.triggerIntervention);

export default router;
