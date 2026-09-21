import { Response, NextFunction } from 'express';
import { db } from '../database/db';
import { AuthRequest } from '../middleware/auth';
import { createAssignmentSchema, submitAssignmentSchema, gradeSubmissionSchema } from '../validators';
import { isValidCsrfToken } from '../middleware/csrf';

export class AssignmentController {
  public static async getAssignments(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      // CWE-639 IDOR Protection: Enforce authorization check on assignment retrieval
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Authentication required.' });
      }

      if (!['STUDENT', 'TEACHER', 'ADMIN'].includes(req.user.role)) {
        return res.status(403).json({ success: false, message: 'Forbidden: Access denied.' });
      }

      const studentId = req.user.studentId;
      const teacherId = req.user.teacherId;
      const courseId = req.query.courseId as string;

      // Object-level authorization check when retrieving assignments for a specific course (CWE-639 IDOR)
      if (courseId) {
        if (req.user.role === 'STUDENT' && studentId) {
          const isEnrolled = await db.get<any>(
            'SELECT id FROM enrollments WHERE student_id = $1 AND course_id = $2',
            [studentId, courseId]
          );
          if (!isEnrolled) {
            return res.status(403).json({
              success: false,
              message: 'Forbidden: You are not authorized to access assignments for this course.',
            });
          }
        } else if (req.user.role === 'TEACHER' && teacherId) {
          const course = await db.get<any>('SELECT teacher_id FROM courses WHERE id = $1', [courseId]);
          if (course && course.teacher_id && course.teacher_id !== teacherId) {
            return res.status(403).json({
              success: false,
              message: 'Forbidden: Faculty can only inspect assignments for courses they instruct.',
            });
          }
        }
      }

      let sql = `
        SELECT a.*, c.code as course_code, c.name as course_name,
               (SELECT COUNT(*) FROM submissions s WHERE s.assignment_id = a.id) as submission_count
        FROM assignments a
        JOIN courses c ON a.course_id = c.id
        WHERE 1=1
      `;
      const params: any[] = [];

      // Prevent Assignment IDOR: Students can only view assignments for enrolled courses (CWE-639)
      if (req.user.role === 'STUDENT' && studentId) {
        params.push(studentId);
        sql += ` AND a.course_id IN (SELECT course_id FROM enrollments WHERE student_id = $${params.length})`;
      } else if (req.user.role === 'TEACHER' && teacherId) {
        // Prevent Assignment IDOR: Faculty can only view assignments for their own courses (CWE-639)
        params.push(teacherId);
        sql += ` AND c.teacher_id = $${params.length}`;
      }

      if (courseId) {
        params.push(courseId);
        sql += ` AND a.course_id = $${params.length}`;
      }

      sql += ` ORDER BY a.due_date DESC`;

      const assignments = await db.query<any>(sql, params);

      // If student, attach their submission status
      if (studentId) {
        for (const asgn of assignments) {
          const sub = await db.get<any>(
            `SELECT * FROM submissions WHERE assignment_id = $1 AND student_id = $2`,
            [asgn.id, studentId]
          );
          asgn.user_submission = sub || null;
        }
      }

      return res.status(200).json({
        success: true,
        count: assignments.length,
        data: assignments,
      });
    } catch (error) {
      next(error);
    }
  }

  // CWE-639 IDOR Protection: Enforce authorization check on single assignment retrieval
  public static async getAssignmentById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Authentication required.' });
      }

      if (!['STUDENT', 'TEACHER', 'ADMIN'].includes(req.user.role)) {
        return res.status(403).json({ success: false, message: 'Forbidden: Access denied.' });
      }

      const { id } = req.params;
      const assignment = await db.get<any>(
        `SELECT a.*, c.code as course_code, c.name as course_name, c.teacher_id
         FROM assignments a
         JOIN courses c ON a.course_id = c.id
         WHERE a.id = $1`,
        [id]
      );

      if (!assignment) {
        return res.status(404).json({ success: false, message: 'Assignment not found.' });
      }

      // Prevent Assignment Retrieval IDOR (CWE-639)
      if (req.user.role === 'STUDENT' && req.user.studentId) {
        const isEnrolled = await db.get<any>(
          'SELECT id FROM enrollments WHERE student_id = $1 AND course_id = $2',
          [req.user.studentId, assignment.course_id]
        );
        if (!isEnrolled) {
          return res.status(403).json({
            success: false,
            message: 'Forbidden: You are not authorized to access this assignment (not enrolled).',
          });
        }
      } else if (req.user.role === 'TEACHER' && req.user.teacherId) {
        if (assignment.teacher_id && assignment.teacher_id !== req.user.teacherId) {
          return res.status(403).json({
            success: false,
            message: 'Forbidden: Faculty can only access assignments for courses they instruct.',
          });
        }
      }

      return res.status(200).json({
        success: true,
        data: assignment,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async createAssignment(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      // CWE-352: Validate anti-CSRF token validity / session credentials for assignment creation
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
          message: 'Forbidden: Only teachers or administrators can create assignments.',
        });
      }
      const data = createAssignmentSchema.parse(req.body);
      const newId = `asg-${Date.now()}`;

      await db.run(
        `INSERT INTO assignments (id, course_id, title, description, max_score, due_date, weightage, attachment_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          newId,
          data.courseId,
          data.title,
          data.description,
          data.maxScore,
          data.dueDate,
          data.weightage,
          data.attachmentUrl || null,
        ]
      );

      return res.status(201).json({
        success: true,
        message: 'Assignment created successfully',
        assignmentId: newId,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async submitAssignment(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      // CWE-352: Validate anti-CSRF token validity on assignment submission
      const csrfToken = req.headers['x-csrf-token'] || req.headers['xsrf-token'];
      const isCsrfValid = csrfToken ? isValidCsrfToken(csrfToken, req) : false;
      const isAuthValid = Boolean(req.user && req.headers.authorization?.startsWith('Bearer '));
      if (!isCsrfValid && !isAuthValid) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden: CSRF validation failed. Missing or invalid anti-CSRF token or authorization header.',
        });
      }

      const studentId = req.user?.studentId;
      if (!studentId) {
        return res.status(403).json({ success: false, message: 'Only students can submit assignments.' });
      }

      const data = submitAssignmentSchema.parse(req.body);
      const existing = await db.get<any>(
        'SELECT id FROM submissions WHERE assignment_id = $1 AND student_id = $2',
        [data.assignmentId, studentId]
      );

      const asgn = await db.get<any>('SELECT due_date FROM assignments WHERE id = $1', [data.assignmentId]);
      const isLate = asgn && new Date() > new Date(asgn.due_date);
      const status = isLate ? 'LATE' : 'SUBMITTED';

      if (existing) {
        await db.run(
          `UPDATE submissions
           SET file_url = $1, submission_text = $2, submitted_at = CURRENT_TIMESTAMP, status = $3
           WHERE id = $4`,
          [data.fileUrl || 'https://uploads.eduintelli.com/student-submission.pdf', data.submissionText || '', status, existing.id]
        );
      } else {
        const subId = `sub-${Date.now()}`;
        await db.run(
          `INSERT INTO submissions (id, assignment_id, student_id, file_url, submission_text, status)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [subId, data.assignmentId, studentId, data.fileUrl || 'https://uploads.eduintelli.com/student-submission.pdf', data.submissionText || '', status]
        );
      }

      return res.status(200).json({
        success: true,
        message: isLate ? 'Assignment submitted (marked Late).' : 'Assignment submitted successfully!',
      });
    } catch (error) {
      next(error);
    }
  }

  public static async gradeSubmission(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      // CWE-352: Validate anti-CSRF token validity on assignment grading
      const csrfToken = req.headers['x-csrf-token'] || req.headers['xsrf-token'];
      const isCsrfValid = csrfToken ? isValidCsrfToken(csrfToken, req) : false;
      const isAuthValid = Boolean(req.user && req.headers.authorization?.startsWith('Bearer '));
      if (!isCsrfValid && !isAuthValid) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden: CSRF validation failed. Missing or invalid anti-CSRF token or authorization header.',
        });
      }

      const data = gradeSubmissionSchema.parse(req.body);

      await db.run(
        `UPDATE submissions
         SET score = $1, feedback = $2, status = $3
         WHERE id = $4`,
        [data.score, data.feedback || '', data.status, data.submissionId]
      );

      return res.status(200).json({
        success: true,
        message: 'Submission graded successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getSubmissionsForAssignment(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user || (req.user.role !== 'TEACHER' && req.user.role !== 'ADMIN')) {
        return res.status(403).json({ success: false, message: 'Forbidden: Only faculty can view submissions.' });
      }

      const { assignmentId } = req.params;

      // Verify the teacher instructs the course for this assignment
      if (req.user.role === 'TEACHER' && req.user.teacherId) {
        const assignment = await db.get<any>(
          `SELECT c.teacher_id FROM assignments a
           JOIN courses c ON a.course_id = c.id
           WHERE a.id = $1`,
          [assignmentId]
        );
        if (assignment && assignment.teacher_id !== req.user.teacherId) {
          return res.status(403).json({
            success: false,
            message: 'Forbidden: Faculty can only inspect submissions for their own assignments.',
          });
        }
      }

      const submissions = await db.query<any>(
        `SELECT sub.*, s.roll_number, u.name as student_name, u.email as student_email, u.avatar_url
         FROM submissions sub
         JOIN students s ON sub.student_id = s.id
         JOIN users u ON s.user_id = u.id
         WHERE sub.assignment_id = $1
         ORDER BY sub.submitted_at DESC`,
        [assignmentId]
      );

      return res.status(200).json({
        success: true,
        count: submissions.length,
        data: submissions,
      });
    } catch (error) {
      next(error);
    }
  }
}
