import { Router } from 'express';
import { CourseController } from '../controllers/courseController';
import { authenticate, authorizeStudent, authorizeCourseAccess } from '../middleware/auth';
import { attendanceLimiter } from '../middleware/rateLimiter';
import { csrfProtection } from '../middleware/csrf';

const router = Router();

router.get('/', authenticate, attendanceLimiter, CourseController.getAllCourses);
// CWE-639: Object-level authorization for course details (IDOR protected)
router.get('/:id', authenticate, authorizeCourseAccess, attendanceLimiter, CourseController.getCourseById);
// CWE-639: Strict student enrollment authorization & CWE-352: Anti-CSRF protection
router.post('/:id/enroll', authenticate, authorizeStudent, csrfProtection, attendanceLimiter, CourseController.enrollInCourse);

export default router;
