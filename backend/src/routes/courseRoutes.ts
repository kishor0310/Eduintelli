import { Router } from 'express';
import { CourseController } from '../controllers/courseController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', CourseController.getAllCourses);
router.get('/:id', CourseController.getCourseById);
router.post('/:id/enroll', authenticate, CourseController.enrollInCourse);

export default router;
