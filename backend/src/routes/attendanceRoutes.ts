import { Router } from 'express';
import { AttendanceController } from '../controllers/attendanceController';
import { authenticate, authorizeTeacher } from '../middleware/auth';
import { attendanceLimiter } from '../middleware/rateLimiter';

const router = Router();

router.get('/student', authenticate, AttendanceController.getStudentAttendance);
router.get('/student/:studentId', authenticate, AttendanceController.getStudentAttendance);
router.get('/course/:courseId', authenticate, AttendanceController.getCourseAttendance);
router.post('/mark', authenticate, authorizeTeacher, attendanceLimiter, AttendanceController.markAttendanceBatch);
router.post('/', authenticate, authorizeTeacher, attendanceLimiter, AttendanceController.markAttendanceBatch);
router.get('/', authenticate, AttendanceController.getStudentAttendance);

export default router;
