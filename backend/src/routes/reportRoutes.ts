import { Router } from 'express';
import { ReportController } from '../controllers/reportController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/student', authenticate, ReportController.getStudentPerformanceReport);
router.get('/student/:studentId', authenticate, ReportController.getStudentPerformanceReport);
router.get('/', authenticate, ReportController.getStudentPerformanceReport);
router.get('/:studentId', authenticate, ReportController.getStudentPerformanceReport);

export default router;
