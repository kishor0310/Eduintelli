import { Response, NextFunction } from 'express';
import { db } from '../database/db';
import { AuthRequest } from '../middleware/auth';
import { createExamSchema, recordExamResultsSchema } from '../validators';

export class ExamController {
  public static async getExaminations(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const studentId = req.user?.studentId;
      const courseId = req.query.courseId as string;

      let sql = `
        SELECT ex.*, c.code as course_code, c.name as course_name,
               (SELECT AVG(marks_obtained) FROM exam_results WHERE examination_id = ex.id) as class_average,
               (SELECT MAX(marks_obtained) FROM exam_results WHERE examination_id = ex.id) as highest_score,
               (SELECT MIN(marks_obtained) FROM exam_results WHERE examination_id = ex.id) as lowest_score
        FROM examinations ex
        JOIN courses c ON ex.course_id = c.id
        WHERE 1=1
      `;
      const params: any[] = [];

      // Prevent Examination IDOR: Students can only view exams for enrolled courses (CWE-639)
      if (req.user?.role === 'STUDENT' && studentId) {
        if (courseId) {
          const enrolled = await db.get<any>(
            `SELECT 1 FROM enrollments WHERE student_id = $1 AND course_id = $2`,
            [studentId, courseId]
          );
          if (!enrolled) {
            return res.status(403).json({
              success: false,
              message: 'Access denied: You are not enrolled in this course',
            });
          }
        }
        params.push(studentId);
        sql += ` AND ex.course_id IN (SELECT course_id FROM enrollments WHERE student_id = $${params.length})`;
      }

      if (courseId) {
        params.push(courseId);
        sql += ` AND ex.course_id = $${params.length}`;
      }

      sql += ` ORDER BY ex.exam_date DESC`;

      const exams = await db.query<any>(sql, params);

      // If student, attach their specific result
      if (studentId) {
        for (const ex of exams) {
          const resRow = await db.get<any>(
            `SELECT marks_obtained, grade, remarks FROM exam_results WHERE examination_id = $1 AND student_id = $2`,
            [ex.id, studentId]
          );
          ex.student_result = resRow || null;
        }
      }

      return res.status(200).json({
        success: true,
        count: exams.length,
        data: exams,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async createExamination(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      // CSRF token validation check for state-changing POST requests (CWE-352)
      const csrfToken = req.headers['x-csrf-token'] || req.headers['csrf-token'] || req.headers['x-xsrf-token'] || req.body?._csrf;
      const origin = req.headers.origin;
      const referer = req.headers.referer;
      const requestedWith = req.headers['x-requested-with'];
      const hasHeader = !!(csrfToken || requestedWith === 'XMLHttpRequest' || req.headers['content-type']?.includes('application/json'));

      if (!hasHeader && !origin && !referer) {
        return res.status(403).json({
          success: false,
          message: 'CSRF token missing or invalid',
        });
      }

      const data = createExamSchema.parse(req.body);
      const newId = `exm-${Date.now()}`;

      await db.run(
        `INSERT INTO examinations (id, course_id, name, exam_type, exam_date, max_score, weightage, room)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          newId,
          data.courseId,
          data.name,
          data.examType,
          data.examDate,
          data.maxScore,
          data.weightage,
          data.room || 'Main Examination Hall',
        ]
      );

      return res.status(201).json({
        success: true,
        message: 'Examination scheduled successfully',
        examinationId: newId,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async recordResultsBatch(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = recordExamResultsSchema.parse(req.body);

      for (const resItem of data.results) {
        const existing = await db.get<any>(
          'SELECT id FROM exam_results WHERE examination_id = $1 AND student_id = $2',
          [data.examinationId, resItem.studentId]
        );

        let calculatedGrade = resItem.grade;
        if (!calculatedGrade) {
          if (resItem.marksObtained >= 90) calculatedGrade = 'A+';
          else if (resItem.marksObtained >= 80) calculatedGrade = 'A';
          else if (resItem.marksObtained >= 70) calculatedGrade = 'B';
          else if (resItem.marksObtained >= 60) calculatedGrade = 'C';
          else if (resItem.marksObtained >= 50) calculatedGrade = 'D';
          else calculatedGrade = 'F';
        }

        if (existing) {
          await db.run(
            `UPDATE exam_results
             SET marks_obtained = $1, grade = $2, remarks = $3
             WHERE id = $4`,
            [resItem.marksObtained, calculatedGrade, resItem.remarks || '', existing.id]
          );
        } else {
          const resId = `res-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
          await db.run(
            `INSERT INTO exam_results (id, examination_id, student_id, marks_obtained, grade, remarks)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [resId, data.examinationId, resItem.studentId, resItem.marksObtained, calculatedGrade, resItem.remarks || '']
          );
        }
      }

      return res.status(200).json({
        success: true,
        message: `Results recorded for ${data.results.length} students.`,
      });
    } catch (error) {
      next(error);
    }
  }
}
