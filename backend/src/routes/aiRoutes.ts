import { Router } from 'express';
import { AIController, aiAnalysisLimiter } from '../controllers/aiController';
import { authenticate, authorizeTeacher, authorizeAdmin } from '../middleware/auth';
import { csrfProtection } from '../middleware/csrf';

const router = Router();

// Student self-service endpoints (IDOR-safe, uses JWT session identity)
router.get('/risk', authenticate, aiAnalysisLimiter, AIController.getStudentRisk);
router.get('/recommendations', authenticate, aiAnalysisLimiter, AIController.getStudentRecommendations);
router.get('/insights', authenticate, aiAnalysisLimiter, AIController.getStudentInsights);

// Teacher/Admin privileged endpoints to inspect a specific student
router.get('/risk/:studentId', authenticate, aiAnalysisLimiter, authorizeTeacher, AIController.getStudentRisk);
router.get('/recommendations/:studentId', authenticate, aiAnalysisLimiter, authorizeTeacher, AIController.getStudentRecommendations);
router.get('/insights/:studentId', authenticate, aiAnalysisLimiter, authorizeTeacher, AIController.getStudentInsights);

// Institutional insights endpoint protected for administrators (CWE-284)
router.get('/institutional-insights', authenticate, authorizeAdmin, aiAnalysisLimiter, AIController.getInstitutionalInsights);
// CSRF-protected & rate-limited AI Coach endpoint (CWE-352 & CWE-770)
router.post('/ask-coach', authenticate, csrfProtection, aiAnalysisLimiter, AIController.askCoach);

export default router;
