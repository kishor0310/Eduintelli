import { Response, NextFunction } from 'express';
import { db } from '../database/db';
import { AuthRequest } from '../middleware/auth';
import { AIService } from '../services/ai/aiService';

export class ReportController {
  public static async getStudentPerformanceReport(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Authentication required.' });
      }

      let studentId = req.params.studentId || req.user?.studentId;

      if (req.user.role === 'STUDENT') {
        if (req.params.studentId && req.params.studentId !== req.user.studentId) {
          return res.status(403).json({
            success: false,
            message: 'Forbidden: Students can only view their own performance reports.',
          });
        }
        studentId = req.user.studentId;
      } else if (req.user.role === 'TEACHER') {
        studentId = req.params.studentId;
        if (!studentId) {
          return res.status(400).json({ success: false, message: 'Student ID required for faculty performance review.' });
        }
        // Verify teacher instructs at least one course this student is enrolled in
        if (req.user.teacherId) {
          const common = await db.get<any>(
            `SELECT 1 FROM enrollments e
             JOIN courses c ON e.course_id = c.id
             WHERE e.student_id = $1 AND c.teacher_id = $2`,
            [studentId, req.user.teacherId]
          );
          if (!common) {
            return res.status(403).json({
              success: false,
              message: 'Forbidden: Faculty can only inspect performance reports for students enrolled in their courses.',
            });
          }
        }
      }

      if (!studentId) {
        return res.status(400).json({ success: false, message: 'Student ID required.' });
      }

      // 1. Run AI analysis
      const ai = await AIService.analyzeStudent(studentId);

      // 2. Fetch Student Info
      const student = await db.get<any>(
        `SELECT s.id, u.name, u.email, u.avatar_url, s.roll_number, s.department, s.semester, s.batch, s.cgpa
         FROM students s
         JOIN users u ON s.user_id = u.id
         WHERE s.id = $1`,
        [studentId]
      );

      if (!student) {
        return res.status(404).json({ success: false, message: 'Student not found' });
      }

      // 3. Fetch Course Breakdown
      const courses = await db.query<any>(
        `SELECT c.id, c.code, c.name, c.credits, e.current_grade, e.grade_points,
                u.name as teacher_name
         FROM enrollments e
         JOIN courses c ON e.course_id = c.id
         LEFT JOIN teachers t ON c.teacher_id = t.id
         LEFT JOIN users u ON t.user_id = u.id
         WHERE e.student_id = $1`,
        [studentId]
      );

      // 4. Fetch Exam Results
      const examResults = await db.query<any>(
        `SELECT er.marks_obtained, er.grade, er.remarks, ex.name as exam_name, ex.max_score, ex.exam_type,
                c.code as course_code, c.name as course_name
         FROM exam_results er
         JOIN examinations ex ON er.examination_id = ex.id
         JOIN courses c ON ex.course_id = c.id
         WHERE er.student_id = $1`,
        [studentId]
      );

      return res.status(200).json({
        success: true,
        report: {
          reportId: `REP-${student.roll_number}-${Date.now().toString().slice(-4)}`,
          generatedAt: new Date().toISOString(),
          institution: 'EduIntelli Institute of Technology',
          accreditation: 'AI-Enhanced Academic Quality Assurance Board',
          student,
          summary: {
            cgpa: student.cgpa,
            overallAttendance: ai.risk.metrics.attendancePercentage,
            assignmentAverage: ai.risk.metrics.assignmentAverage,
            examAverage: ai.risk.metrics.examAverage,
            academicRiskScore: ai.risk.riskScore,
            riskLevel: ai.risk.riskLevel,
          },
          aiDiagnostic: {
            factors: ai.risk.factors,
            reasons: ai.risk.reasons,
            strengths: ai.insights.filter(i => i.severity === 'POSITIVE'),
            weakSubjects: ai.weakSubjects,
            actionableRecommendations: ai.recommendations,
          },
          enrolledCourses: courses,
          examinationRecords: examResults,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
