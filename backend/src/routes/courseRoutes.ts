import { Router } from 'express';
import { CourseController } from '../controllers/courseController';
import { authenticate, authorize, authorizeStudent } from '../middleware/auth';
import { attendanceLimiter } from '../middleware/rateLimiter';

const router = Router();

router.get('/', authenticate, attendanceLimiter, CourseController.getAllCourses);
// CWE-639: Authorized course detail inspection
router.get('/:id', authenticate, authorize(['STUDENT', 'TEACHER', 'ADMIN']), attendanceLimiter, CourseController.getCourseById);
// CWE-639: Strict student enrollment authorization
router.post('/:id/enroll', authenticate, authorizeStudent, attendanceLimiter, CourseController.enrollInCourse);

export default router;
