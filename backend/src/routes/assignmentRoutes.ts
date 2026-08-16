import { Router } from 'express';
import { AssignmentController } from '../controllers/assignmentController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, AssignmentController.getAssignments);
router.post('/', authenticate, AssignmentController.createAssignment);
router.post('/submit', authenticate, AssignmentController.submitAssignment);
router.post('/grade', authenticate, AssignmentController.gradeSubmission);
router.get('/:assignmentId/submissions', authenticate, AssignmentController.getSubmissionsForAssignment);

export default router;
