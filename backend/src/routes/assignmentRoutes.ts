import { Router } from 'express';
import { AssignmentController } from '../controllers/assignmentController';
import { authenticate, authorizeTeacher } from '../middleware/auth';
import { assignmentLimiter, submissionLimiter } from '../middleware/rateLimiter';
import { csrfProtection } from '../middleware/csrf';

const router = Router();

// Rate limited assignment listing (CWE-770)
router.get('/', authenticate, assignmentLimiter, AssignmentController.getAssignments);

// CSRF-protected assignment creation (CWE-352)
router.post('/', authenticate, authorizeTeacher, csrfProtection, AssignmentController.createAssignment);

// Rate-limited & CSRF-protected assignment submissions (CWE-770 & CWE-352)
router.post('/submit', authenticate, csrfProtection, submissionLimiter, AssignmentController.submitAssignment);
router.post('/grade', authenticate, authorizeTeacher, csrfProtection, submissionLimiter, AssignmentController.gradeSubmission);

router.get('/:assignmentId/submissions', authenticate, authorizeTeacher, assignmentLimiter, AssignmentController.getSubmissionsForAssignment);

// IDOR-protected assignment retrieval by ID (CWE-639)
router.get('/:id', authenticate, assignmentLimiter, AssignmentController.getAssignmentById);

export default router;
