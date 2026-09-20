import { Router } from 'express';
import { AIController } from '../controllers/aiController';
import { authenticate, authorizeTeacher } from '../middleware/auth';

const router = Router();

// Student self-service endpoints (IDOR-safe, uses JWT session identity)
router.get('/risk', authenticate, AIController.getStudentRisk);
router.get('/recommendations', authenticate, AIController.getStudentRecommendations);
router.get('/insights', authenticate, AIController.getStudentInsights);

// Teacher/Admin privileged endpoints to inspect a specific student
router.get('/risk/:studentId', authenticate, authorizeTeacher, AIController.getStudentRisk);
router.get('/recommendations/:studentId', authenticate, authorizeTeacher, AIController.getStudentRecommendations);
router.get('/insights/:studentId', authenticate, authorizeTeacher, AIController.getStudentInsights);

router.get('/institutional-insights', authenticate, AIController.getInstitutionalInsights);
router.post('/ask-coach', authenticate, AIController.askCoach);

export default router;
