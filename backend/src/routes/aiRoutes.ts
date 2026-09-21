import { Router } from 'express';
import { AIController } from '../controllers/aiController';
import { authenticate, authorizeTeacher } from '../middleware/auth';
import { riskLimiter } from '../middleware/rateLimiter';

const router = Router();

// Student self-service endpoints (IDOR-safe, uses JWT session identity)
router.get('/risk', authenticate, riskLimiter, AIController.getStudentRisk);
router.get('/recommendations', authenticate, riskLimiter, AIController.getStudentRecommendations);
router.get('/insights', authenticate, riskLimiter, AIController.getStudentInsights);

// Teacher/Admin privileged endpoints to inspect a specific student
router.get('/risk/:studentId', authenticate, riskLimiter, authorizeTeacher, AIController.getStudentRisk);
router.get('/recommendations/:studentId', authenticate, riskLimiter, authorizeTeacher, AIController.getStudentRecommendations);
router.get('/insights/:studentId', authenticate, riskLimiter, authorizeTeacher, AIController.getStudentInsights);

router.get('/institutional-insights', authenticate, riskLimiter, AIController.getInstitutionalInsights);
router.post('/ask-coach', authenticate, riskLimiter, AIController.askCoach);

export default router;
