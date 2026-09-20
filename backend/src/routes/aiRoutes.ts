import { Router } from 'express';
import { AIController } from '../controllers/aiController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/risk', authenticate, AIController.getStudentRisk);
router.get('/risk/:studentId', authenticate, AIController.getStudentRisk);
router.get('/recommendations', authenticate, AIController.getStudentRecommendations);
router.get('/recommendations/:studentId', authenticate, AIController.getStudentRecommendations);
router.get('/insights', authenticate, AIController.getStudentInsights);
router.get('/insights/:studentId', authenticate, AIController.getStudentInsights);
router.get('/institutional-insights', authenticate, AIController.getInstitutionalInsights);
router.post('/ask-coach', authenticate, AIController.askCoach);

export default router;
