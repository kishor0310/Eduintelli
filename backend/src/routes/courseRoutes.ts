import { Router } from 'express';
import { CourseController } from '../controllers/courseController';
import { authenticate } from '../middleware/auth';
import { attendanceLimiter } from '../middleware/rateLimiter';

const router = Router();

router.get('/', authenticate, attendanceLimiter, CourseController.getAllCourses);
router.get('/:id', authenticate, attendanceLimiter, CourseController.getCourseById);
router.post('/:id/enroll', authenticate, attendanceLimiter, CourseController.enrollInCourse);

export default router;
