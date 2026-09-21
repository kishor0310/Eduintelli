import { Router } from 'express';
import { AIController } from '../controllers/aiController';
import { authenticate, authorizeTeacher, authorizeAdmin } from '../middleware/auth';
import { riskLimiter } from '../middleware/rateLimiter';
import { csrfProtection } from '../middleware/csrf';

const router = Router();

// Student self-service endpoints (IDOR-safe, uses JWT session identity)
router.get('/risk', authenticate, riskLimiter, AIController.getStudentRisk);
router.get('/recommendations', authenticate, riskLimiter, AIController.getStudentRecommendations);
router.get('/insights', authenticate, riskLimiter, AIController.getStudentInsights);

// Teacher/Admin privileged endpoints to inspect a specific student
router.get('/risk/:studentId', authenticate, riskLimiter, authorizeTeacher, AIController.getStudentRisk);
router.get('/recommendations/:studentId', authenticate, riskLimiter, authorizeTeacher, AIController.getStudentRecommendations);
router.get('/insights/:studentId', authenticate, riskLimiter, authorizeTeacher, AIController.getStudentInsights);

// Institutional insights endpoint protected for administrators (CWE-284)
router.get('/institutional-insights', authenticate, authorizeAdmin, riskLimiter, AIController.getInstitutionalInsights);
// CSRF-protected & rate-limited AI Coach endpoint (CWE-352 & CWE-770)
router.post('/ask-coach', authenticate, csrfProtection, riskLimiter, AIController.askCoach);

export default router;
