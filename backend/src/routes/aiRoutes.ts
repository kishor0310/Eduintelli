import { Router } from 'express';
import { AIController } from '../controllers/aiController';
import { authenticate, authorizeTeacher, authorizeAdmin } from '../middleware/auth';
import { aiLimiter } from '../middleware/rateLimiter';
import { csrfProtection } from '../middleware/csrf';

const router = Router();

// Student self-service endpoints (IDOR-safe, uses JWT session identity)
router.get('/risk', authenticate, aiLimiter, AIController.getStudentRisk);
router.get('/recommendations', authenticate, aiLimiter, AIController.getStudentRecommendations);
router.get('/insights', authenticate, aiLimiter, AIController.getStudentInsights);

// Teacher/Admin privileged endpoints to inspect a specific student
router.get('/risk/:studentId', authenticate, aiLimiter, authorizeTeacher, AIController.getStudentRisk);
router.get('/recommendations/:studentId', authenticate, aiLimiter, authorizeTeacher, AIController.getStudentRecommendations);
router.get('/insights/:studentId', authenticate, aiLimiter, authorizeTeacher, AIController.getStudentInsights);

// Institutional insights endpoint protected for administrators (CWE-284)
router.get('/institutional-insights', authenticate, authorizeAdmin, aiLimiter, AIController.getInstitutionalInsights);
// CSRF-protected & rate-limited AI Coach endpoint (CWE-352 & CWE-770)
router.post('/ask-coach', authenticate, csrfProtection, aiLimiter, AIController.askCoach);

export default router;
