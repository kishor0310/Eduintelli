import { Router } from 'express';
import { ReportController } from '../controllers/reportController';
import { authenticate, authorizeTeacher } from '../middleware/auth';
import { attendanceLimiter } from '../middleware/rateLimiter';

const router = Router();

// Student self-service endpoints (IDOR-safe, defaults to own student ID from session)
router.get('/student', authenticate, attendanceLimiter, ReportController.getStudentPerformanceReport);
router.get('/', authenticate, attendanceLimiter, ReportController.getStudentPerformanceReport);

// Faculty & Administrator privileged endpoints with IDOR protection (CWE-639)
router.get('/student/:studentId', authenticate, authorizeTeacher, attendanceLimiter, ReportController.getStudentPerformanceReport);
router.get('/:studentId', authenticate, authorizeTeacher, attendanceLimiter, ReportController.getStudentPerformanceReport);

export default router;
