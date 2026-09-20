import { Router } from 'express';
import { ReportController } from '../controllers/reportController';
import { authenticate } from '../middleware/auth';
import { attendanceLimiter } from '../middleware/rateLimiter';

const router = Router();

router.get('/student', authenticate, attendanceLimiter, ReportController.getStudentPerformanceReport);
router.get('/student/:studentId', authenticate, attendanceLimiter, ReportController.getStudentPerformanceReport);
router.get('/', authenticate, attendanceLimiter, ReportController.getStudentPerformanceReport);
router.get('/:studentId', authenticate, attendanceLimiter, ReportController.getStudentPerformanceReport);

export default router;
