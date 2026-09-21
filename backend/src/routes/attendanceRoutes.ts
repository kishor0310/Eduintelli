import { Router } from 'express';
import { AttendanceController } from '../controllers/attendanceController';
import { authenticate, authorizeTeacher } from '../middleware/auth';
import { attendanceLimiter } from '../middleware/rateLimiter';

const router = Router();

// Rate-limited attendance GET endpoints (CWE-770 rate limiting & CWE-639 IDOR protection)
router.get('/student', authenticate, attendanceLimiter, AttendanceController.getStudentAttendance);
router.get('/student/:studentId', authenticate, authorizeTeacher, attendanceLimiter, AttendanceController.getStudentAttendance);
router.get('/course/:courseId', authenticate, authorizeTeacher, attendanceLimiter, AttendanceController.getCourseAttendance);
router.get('/', authenticate, attendanceLimiter, AttendanceController.getStudentAttendance);

// Rate-limited attendance POST endpoints
router.post('/mark', authenticate, authorizeTeacher, attendanceLimiter, AttendanceController.markAttendanceBatch);
router.post('/', authenticate, authorizeTeacher, attendanceLimiter, AttendanceController.markAttendanceBatch);

export default router;
