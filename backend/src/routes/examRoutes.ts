import { Router } from 'express';
import { ExamController } from '../controllers/examController';
import { authenticate, authorizeTeacher } from '../middleware/auth';
import { attendanceLimiter } from '../middleware/rateLimiter';
import { csrfProtection } from '../middleware/csrf';

const router = Router();

router.get('/', authenticate, attendanceLimiter, ExamController.getExaminations);
// Anti-CSRF protection on state-changing exam POST endpoints (CWE-352)
router.post('/', authenticate, authorizeTeacher, csrfProtection, attendanceLimiter, ExamController.createExamination);
router.post('/results', authenticate, authorizeTeacher, csrfProtection, attendanceLimiter, ExamController.recordResultsBatch);

export default router;
