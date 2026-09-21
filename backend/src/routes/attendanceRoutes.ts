import { Router } from 'express';
import { AttendanceController } from '../controllers/attendanceController';
import { authenticate, authorizeTeacher } from '../middleware/auth';
import { attendanceLimiter } from '../middleware/rateLimiter';
import { csrfProtection } from '../middleware/csrf';

const router = Router();

// Rate-limited attendance GET endpoints (CWE-770 rate limiting & CWE-639 IDOR protection)
router.get('/student', authenticate, attendanceLimiter, AttendanceController.getStudentAttendance);
router.get('/student/:studentId', authenticate, authorizeTeacher, attendanceLimiter, AttendanceController.getStudentAttendance);
router.get('/course/:courseId', authenticate, authorizeTeacher, attendanceLimiter, AttendanceController.getCourseAttendance);
// Authorized attendance list endpoint for teachers & administrators (CWE-639)
router.get('/', authenticate, authorizeTeacher, attendanceLimiter, AttendanceController.getAttendanceList);

// Rate-limited & CSRF-protected attendance POST endpoints (CWE-352 & CWE-770)
router.post('/mark', authenticate, authorizeTeacher, csrfProtection, attendanceLimiter, AttendanceController.markAttendanceBatch);
router.post('/', authenticate, authorizeTeacher, csrfProtection, attendanceLimiter, AttendanceController.markAttendanceBatch);

export default router;
