import { Router } from 'express';
import { ExamController } from '../controllers/examController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, ExamController.getExaminations);
router.post('/', authenticate, ExamController.createExamination);
router.post('/results', authenticate, ExamController.recordResultsBatch);

export default router;
