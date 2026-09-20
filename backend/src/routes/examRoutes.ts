import { Router } from 'express';
import { ExamController } from '../controllers/examController';
import { authenticate, authorizeTeacher } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, ExamController.getExaminations);
router.post('/', authenticate, authorizeTeacher, ExamController.createExamination);
router.post('/results', authenticate, authorizeTeacher, ExamController.recordResultsBatch);

export default router;
