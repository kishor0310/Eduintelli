import { Request, Response, NextFunction } from 'express';
import { db } from '../database/db';
import { AuthRequest } from '../middleware/auth';

export class CourseController {
  public static async getAllCourses(req: Request, res: Response, next: NextFunction) {
    try {
      const { search, department, semester } = req.query;

      let sql = `
        SELECT c.*, u.name as teacher_name, t.specialization,
               COUNT(DISTINCT e.student_id) as enrolled_count
        FROM courses c
        LEFT JOIN teachers t ON c.teacher_id = t.id
        LEFT JOIN users u ON t.user_id = u.id
        LEFT JOIN enrollments e ON c.id = e.course_id
        WHERE 1=1
      `;
      const params: any[] = [];

      if (search) {
        params.push(`%${search}%`);
        sql += ` AND (c.name LIKE $${params.length} OR c.code LIKE $${params.length} OR c.description LIKE $${params.length})`;
      }

      if (department && department !== 'ALL') {
        params.push(department);
        sql += ` AND c.department = $${params.length}`;
      }

      if (semester && semester !== 'ALL') {
        params.push(Number(semester));
        sql += ` AND c.semester = $${params.length}`;
      }

      sql += ` GROUP BY c.id ORDER BY c.code ASC`;

      const courses = await db.query<any>(sql, params);

      return res.status(200).json({
        success: true,
        count: courses.length,
        data: courses,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getCourseById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const course = await db.get<any>(
        `SELECT c.*, u.name as teacher_name, u.email as teacher_email, u.avatar_url as teacher_avatar,
                t.designation, t.specialization, t.office_room
         FROM courses c
         LEFT JOIN teachers t ON c.teacher_id = t.id
         LEFT JOIN users u ON t.user_id = u.id
         WHERE c.id = $1`,
        [id]
      );

      if (!course) {
        return res.status(404).json({ success: false, message: 'Course not found' });
      }

      // Fetch Schedules
      const classes = await db.query<any>(
        `SELECT * FROM classes WHERE course_id = $1 ORDER BY day_of_week, start_time`,
        [id]
      );

      // Fetch Assignments
      const assignments = await db.query<any>(
        `SELECT * FROM assignments WHERE course_id = $1 ORDER BY due_date ASC`,
        [id]
      );

      // Fetch Exams
      const exams = await db.query<any>(
        `SELECT * FROM examinations WHERE course_id = $1 ORDER BY exam_date ASC`,
        [id]
      );

      // Enrolled Count
      const enrolledRes = await db.get<any>(
        `SELECT COUNT(*) as count FROM enrollments WHERE course_id = $1`,
        [id]
      );

      return res.status(200).json({
        success: true,
        data: {
          ...course,
          classes,
          assignments,
          examinations: exams,
          enrolledCount: Number(enrolledRes?.count || 0),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async enrollInCourse(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const studentId = req.user?.studentId;

      if (!studentId) {
        return res.status(403).json({ success: false, message: 'Only students can enroll in courses.' });
      }

      const existing = await db.get<any>(
        'SELECT id FROM enrollments WHERE student_id = $1 AND course_id = $2',
        [studentId, id]
      );

      if (existing) {
        return res.status(400).json({ success: false, message: 'Already enrolled in this course.' });
      }

      const enrollmentId = `enr-${Date.now()}`;
      await db.run(
        `INSERT INTO enrollments (id, student_id, course_id, status, current_grade, grade_points)
         VALUES ($1, $2, $3, 'ENROLLED', 'A', 4.0)`,
        [enrollmentId, studentId, id]
      );

      return res.status(201).json({
        success: true,
        message: 'Successfully enrolled in course!',
        enrollmentId,
      });
    } catch (error) {
      next(error);
    }
  }
}
