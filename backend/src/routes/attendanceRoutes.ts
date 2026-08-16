import { Router } from 'express';
import { AttendanceController } from '../controllers/attendanceController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/student', authenticate, AttendanceController.getStudentAttendance);
router.get('/student/:studentId', authenticate, AttendanceController.getStudentAttendance);
router.get('/course/:courseId', authenticate, AttendanceController.getCourseAttendance);
router.post('/mark', authenticate, AttendanceController.markAttendanceBatch);
router.post('/', authenticate, AttendanceController.markAttendanceBatch);
router.get('/', authenticate, AttendanceController.getStudentAttendance);

export default router;
