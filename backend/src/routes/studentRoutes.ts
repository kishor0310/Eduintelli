import { Router } from 'express';
import { StudentController } from '../controllers/studentController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, StudentController.getAllStudents);
router.get('/dashboard', authenticate, StudentController.getDashboard);
router.get('/:id/dashboard', authenticate, StudentController.getDashboard);
router.get('/timetable', authenticate, StudentController.getStudentTimetable);
router.get('/:id/timetable', authenticate, StudentController.getStudentTimetable);

export default router;
