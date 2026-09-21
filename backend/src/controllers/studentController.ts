import { Response, NextFunction } from 'express';
import { db } from '../database/db';
import { AuthRequest } from '../middleware/auth';
import { AIService } from '../services/ai/aiService';

export class StudentController {
  public static async getDashboard(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      let studentId = req.params.id || req.user?.studentId;
      if (req.user?.role === 'STUDENT') {
        if (req.params.id && req.params.id !== req.user.studentId) {
          return res.status(403).json({
            success: false,
            message: 'Forbidden: Students can only access their own dashboard.',
          });
        }
        studentId = req.user.studentId;
      }
      if (!studentId) {
        return res.status(400).json({
          success: false,
          message: 'Student profile identifier is required.',
        });
      }

      // 1. Run AI Intelligence Pipeline
      const aiAnalysis = await AIService.analyzeStudent(studentId);

      // 2. Fetch Student Profile & CGPA
      const student = await db.get<any>(
        `SELECT s.id, u.name, u.email, u.avatar_url, s.roll_number, s.department, s.semester, s.batch, s.cgpa, s.academic_risk_score, s.risk_level
         FROM students s
         JOIN users u ON s.user_id = u.id
         WHERE s.id = $1`,
        [studentId]
      );

      if (!student) {
        return res.status(404).json({ success: false, message: 'Student record not found.' });
      }

      // 3. Fetch Enrolled Courses with Grades
      const enrolledCourses = await db.query<any>(
        `SELECT c.id, c.code, c.name, c.credits, c.department, e.current_grade, e.grade_points,
                u.name as teacher_name, c.thumbnail_url, c.rating
         FROM enrollments e
         JOIN courses c ON e.course_id = c.id
         LEFT JOIN teachers t ON c.teacher_id = t.id
         LEFT JOIN users u ON t.user_id = u.id
         WHERE e.student_id = $1`,
        [studentId]
      );

      // 4. Fetch Monthly Performance Trend (Simulated / Historical aggregation)
      const monthlyTrends = [
        { month: 'Oct', performance: Math.max(40, aiAnalysis.risk.metrics.assignmentAverage - 8), attendance: Math.min(100, aiAnalysis.risk.metrics.attendancePercentage + 4) },
        { month: 'Nov', performance: Math.max(45, aiAnalysis.risk.metrics.assignmentAverage - 3), attendance: Math.min(100, aiAnalysis.risk.metrics.attendancePercentage + 2) },
        { month: 'Dec', performance: Math.max(40, aiAnalysis.risk.metrics.assignmentAverage + 2), attendance: Math.max(50, aiAnalysis.risk.metrics.attendancePercentage - 2) },
        { month: 'Jan', performance: Math.max(35, aiAnalysis.risk.metrics.examAverage - 4), attendance: Math.max(45, aiAnalysis.risk.metrics.attendancePercentage - 6) },
        { month: 'Feb', performance: Math.round(aiAnalysis.risk.metrics.examAverage), attendance: Math.round(aiAnalysis.risk.metrics.attendancePercentage) },
      ];

      // 5. Course-wise Radar & Comparison Data
      const courseMetrics = aiAnalysis.weakSubjects.map(sub => ({
        subject: sub.courseCode,
        studentScore: sub.scorePercentage,
        classAverage: 78,
        attendance: sub.attendancePercentage,
        fullSubjectName: sub.courseName,
      }));

      // 6. Fetch Upcoming Activities (Deadlines, Exams, Classes)
      const upcomingAssignments = await db.query<any>(
        `SELECT a.id, a.title, a.due_date, c.code as course_code, c.name as course_name, a.max_score
         FROM assignments a
         JOIN enrollments e ON a.course_id = e.course_id
         JOIN courses c ON a.course_id = c.id
         WHERE e.student_id = $1 AND a.due_date >= CURRENT_DATE
         ORDER BY a.due_date ASC LIMIT 5`,
        [studentId]
      );

      const upcomingExams = await db.query<any>(
        `SELECT ex.id, ex.name, ex.exam_date, ex.exam_type, c.code as course_code, ex.room
         FROM examinations ex
         JOIN enrollments e ON ex.course_id = e.course_id
         JOIN courses c ON ex.course_id = c.id
         WHERE e.student_id = $1 AND ex.exam_date >= CURRENT_DATE
         ORDER BY ex.exam_date ASC LIMIT 4`,
        [studentId]
      );

      // 7. Fetch Notifications & Alerts
      const notifications = await db.query<any>(
        `SELECT * FROM notifications WHERE user_id = (SELECT user_id FROM students WHERE id = $1) ORDER BY created_at DESC LIMIT 5`,
        [studentId]
      );

      return res.status(200).json({
        success: true,
        data: {
          student,
          kpis: {
            gpa: student.cgpa || 3.5,
            attendancePercentage: aiAnalysis.risk.metrics.attendancePercentage,
            assignmentAverage: aiAnalysis.risk.metrics.assignmentAverage,
            examAverage: aiAnalysis.risk.metrics.examAverage,
            riskScore: aiAnalysis.risk.riskScore,
            riskLevel: aiAnalysis.risk.riskLevel,
          },
          aiAnalysis: {
            risk: aiAnalysis.risk,
            weakSubjects: aiAnalysis.weakSubjects,
            recommendations: aiAnalysis.recommendations,
            insights: aiAnalysis.insights,
          },
          enrolledCourses,
          courseMetrics,
          monthlyTrends,
          upcomingActivities: {
            assignments: upcomingAssignments,
            exams: upcomingExams,
          },
          notifications,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getAllStudents(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const students = await db.query<any>(
        `SELECT s.id, u.name, u.email, u.avatar_url, s.roll_number, s.department, s.semester, s.batch, s.cgpa, s.academic_risk_score, s.risk_level
         FROM students s
         JOIN users u ON s.user_id = u.id
         ORDER BY s.academic_risk_score DESC`
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

  public static async getStudentTimetable(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      let studentId = req.params.id || req.user?.studentId;
      if (req.user?.role === 'STUDENT') {
        if (req.params.id && req.params.id !== req.user.studentId) {
          return res.status(403).json({
            success: false,
            message: 'Forbidden: Students can only access their own timetable.',
          });
        }
        studentId = req.user.studentId;
      }
      if (!studentId) {
        return res.status(400).json({
          success: false,
          message: 'Student profile identifier is required.',
        });
      }

      const schedule = await db.query<any>(
        `SELECT cl.id, cl.section, cl.room_number, cl.day_of_week, cl.start_time, cl.end_time,
                c.code as course_code, c.name as course_name, u.name as teacher_name
         FROM classes cl
         JOIN courses c ON cl.course_id = c.id
         JOIN enrollments e ON c.id = e.course_id
         LEFT JOIN teachers t ON c.teacher_id = t.id
         LEFT JOIN users u ON t.user_id = u.id
         WHERE e.student_id = $1
         ORDER BY CASE
           WHEN cl.day_of_week = 'Monday' THEN 1
           WHEN cl.day_of_week = 'Tuesday' THEN 2
           WHEN cl.day_of_week = 'Wednesday' THEN 3
           WHEN cl.day_of_week = 'Thursday' THEN 4
           WHEN cl.day_of_week = 'Friday' THEN 5
           ELSE 6
         END, cl.start_time ASC`,
        [studentId]
      );

      return res.status(200).json({
        success: true,
        data: schedule,
      });
    } catch (error) {
      next(error);
    }
  }
}
