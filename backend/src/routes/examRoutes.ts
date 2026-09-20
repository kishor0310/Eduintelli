import { Router } from 'express';
import { ExamController } from '../controllers/examController';
import { authenticate, authorizeTeacher } from '../middleware/auth';
import { attendanceLimiter } from '../middleware/rateLimiter';

const router = Router();

router.get('/', authenticate, attendanceLimiter, ExamController.getExaminations);
router.post('/', authenticate, authorizeTeacher, attendanceLimiter, ExamController.createExamination);
router.post('/results', authenticate, authorizeTeacher, attendanceLimiter, ExamController.recordResultsBatch);

export default router;
