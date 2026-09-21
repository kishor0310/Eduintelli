import { Router } from 'express';
import { CourseController } from '../controllers/courseController';
import { authenticate, authorizeStudent, authorizeCourseAccess } from '../middleware/auth';
import { attendanceLimiter } from '../middleware/rateLimiter';

const router = Router();

router.get('/', authenticate, attendanceLimiter, CourseController.getAllCourses);
// CWE-639: Object-level authorization for course details (IDOR protected)
router.get('/:id', authenticate, authorizeCourseAccess, attendanceLimiter, CourseController.getCourseById);
// CWE-639: Strict student enrollment authorization
router.post('/:id/enroll', authenticate, authorizeStudent, attendanceLimiter, CourseController.enrollInCourse);

export default router;
