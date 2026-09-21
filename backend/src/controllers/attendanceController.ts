import { Response, NextFunction } from 'express';
import { db } from '../database/db';
import { AuthRequest } from '../middleware/auth';
import { markAttendanceSchema } from '../validators';
import { isValidCsrfToken } from '../middleware/csrf';

export class AttendanceController {
  public static async getStudentAttendance(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      let studentId = req.params.studentId || req.user?.studentId;
      if (req.user?.role === 'STUDENT') {
        if (req.params.studentId && req.params.studentId !== req.user.studentId) {
          return res.status(403).json({
            success: false,
            message: 'Forbidden: Students can only view their own attendance records.',
          });
        }
        studentId = req.user.studentId;
      } else if (req.user?.role === 'TEACHER') {
        // Teachers must not specify arbitrary studentId; enforce relationship check or deny
        if (req.params.studentId) {
          return res.status(403).json({
            success: false,
            message: 'Forbidden: Teachers cannot access arbitrary student attendance.',
          });
        }
      }

      // CWE-639 IDOR Protection: Strictly require authenticated student profile without hardcoded fallback
      if (!studentId) {
        return res.status(400).json({
          success: false,
          message: 'Student profile identifier is required to view attendance records.',
        });
      }

      // 1. Fetch Subject-wise summary
      const subjectSummary = await db.query<any>(
        `SELECT c.id as course_id, c.code as course_code, c.name as course_name,
                COUNT(a.id) as total_classes,
                SUM(CASE WHEN a.status = 'PRESENT' THEN 1 ELSE 0 END) as present_count,
                SUM(CASE WHEN a.status = 'ABSENT' THEN 1 ELSE 0 END) as absent_count,
                SUM(CASE WHEN a.status = 'LATE' THEN 1 ELSE 0 END) as late_count
         FROM enrollments e
         JOIN courses c ON e.course_id = c.id
         LEFT JOIN attendance a ON e.student_id = a.student_id AND e.course_id = a.course_id
         WHERE e.student_id = $1
         GROUP BY c.id`,
        [studentId]
      );

      const subjects = subjectSummary.map(s => {
        const total = Number(s.total_classes || 0);
        const present = Number(s.present_count || 0) + (Number(s.late_count || 0) * 0.75);
        const percentage = total > 0 ? Math.round((present / total) * 100) : 100;
        return {
          courseId: s.course_id,
          courseCode: s.course_code,
          courseName: s.course_name,
          totalClasses: total,
          presentCount: Number(s.present_count || 0),
          absentCount: Number(s.absent_count || 0),
          lateCount: Number(s.late_count || 0),
          percentage,
          isAtRisk: percentage < 75,
        };
      });

      // 2. Fetch Detailed Log
      const detailedLog = await db.query<any>(
        `SELECT a.id, a.date, a.status, a.remarks, c.code as course_code, c.name as course_name
         FROM attendance a
         JOIN courses c ON a.course_id = c.id
         WHERE a.student_id = $1
         ORDER BY a.date DESC LIMIT 30`,
        [studentId]
      );

      // Total Overall Stats
      const totalAll = subjects.reduce((sum, s) => sum + s.totalClasses, 0);
      const presentAll = subjects.reduce((sum, s) => sum + s.presentCount + (s.lateCount * 0.75), 0);
      const overallPercentage = totalAll > 0 ? Math.round((presentAll / totalAll) * 100) : 90;

      return res.status(200).json({
        success: true,
        data: {
          overallPercentage,
          totalClasses: totalAll,
          isAttendanceRisk: overallPercentage < 75,
          subjects,
          history: detailedLog,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getAttendanceList(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user || (req.user.role !== 'TEACHER' && req.user.role !== 'ADMIN')) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden: Only faculty or administrators can inspect attendance records.',
        });
      }

      let query = `
        SELECT a.id, a.date, a.status, a.remarks,
               s.id as student_id, u.name as student_name, s.roll_number,
               c.id as course_id, c.code as course_code, c.name as course_name
        FROM attendance a
        JOIN students s ON a.student_id = s.id
        JOIN users u ON s.user_id = u.id
        JOIN courses c ON a.course_id = c.id
      `;
      const params: any[] = [];

      if (req.user.role === 'TEACHER' && req.user.teacherId) {
        query += ` WHERE c.teacher_id = $1`;
        params.push(req.user.teacherId);
      }

      query += ` ORDER BY a.date DESC LIMIT 50`;
      const records = await db.query<any>(query, params);

      return res.status(200).json({
        success: true,
        count: records.length,
        data: records,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getCourseAttendance(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      // CWE-639 IDOR protection: Verify requester is authorized faculty or admin
      if (!req.user || (req.user.role !== 'TEACHER' && req.user.role !== 'ADMIN')) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden: Only faculty or administrators can inspect course attendance rosters.',
        });
      }

      const { courseId } = req.params;
      const { date } = req.query;

      // Ensure teachers can only inspect courses assigned to them
      if (req.user.role === 'TEACHER' && req.user.teacherId) {
        const course = await db.get<any>('SELECT teacher_id FROM courses WHERE id = $1', [courseId]);
        if (course && course.teacher_id !== req.user.teacherId) {
          return res.status(403).json({
            success: false,
            message: 'Forbidden: Faculty can only inspect attendance for courses they instruct.',
          });
        }
      }

      // Fetch enrolled students for this course
      const students = await db.query<any>(
        `SELECT s.id as student_id, u.name, u.email, u.avatar_url, s.roll_number, s.academic_risk_score, s.risk_level,
                att.status as current_status, att.remarks
         FROM enrollments e
         JOIN students s ON e.student_id = s.id
         JOIN users u ON s.user_id = u.id
         LEFT JOIN attendance att ON e.student_id = att.student_id AND att.course_id = $1 AND att.date = $2
         WHERE e.course_id = $1
         ORDER BY s.roll_number ASC`,
        [courseId, date || new Date().toISOString().split('T')[0]]
      );

      return res.status(200).json({
        success: true,
        count: students.length,
        data: students,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async markAttendanceBatch(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      // CWE-352: Validate anti-CSRF token validity / session credentials on attendance marking
      const csrfToken = req.headers['x-csrf-token'] || req.headers['xsrf-token'];
      const isCsrfValid = csrfToken ? isValidCsrfToken(csrfToken, req) : false;
      const isAuthValid = Boolean(req.user && req.headers.authorization?.startsWith('Bearer '));
      if (!isCsrfValid && !isAuthValid) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden: CSRF validation failed. Missing or invalid anti-CSRF token or authorization header.',
        });
      }

      if (!req.user || (req.user.role !== 'TEACHER' && req.user.role !== 'ADMIN')) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden: Only teachers or administrators can record attendance.',
        });
      }
      const data = markAttendanceSchema.parse(req.body);

      for (const record of data.records) {
        const existing = await db.get<any>(
          'SELECT id FROM attendance WHERE student_id = $1 AND course_id = $2 AND date = $3',
          [record.studentId, data.courseId, data.date]
        );

        if (existing) {
          await db.run(
            'UPDATE attendance SET status = $1, remarks = $2 WHERE id = $3',
            [record.status, record.remarks || '', existing.id]
          );
        } else {
          const newId = `att-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
          await db.run(
            'INSERT INTO attendance (id, student_id, course_id, date, status, remarks) VALUES ($1, $2, $3, $4, $5, $6)',
            [newId, record.studentId, data.courseId, data.date, record.status, record.remarks || '']
          );
        }
      }

      return res.status(200).json({
        success: true,
        message: `Attendance marked successfully for ${data.records.length} students on ${data.date}.`,
      });
    } catch (error) {
      next(error);
    }
  }
}
