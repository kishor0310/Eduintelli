import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { UserRole } from '../models/types';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: UserRole;
    name?: string;
    studentId?: string;
    teacherId?: string;
    adminId?: string;
  };
}

export function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authentication required. No token provided.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, config.jwtSecret) as any;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
}

export function authorize(allowedRoles: UserRole[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Access restricted to [${allowedRoles.join(', ')}]. Your role is ${req.user.role}.`
      });
    }

    next();
  };
}

import { db } from '../database/db';

export const authorizeAdmin = authorize(['ADMIN']);
export const authorizeTeacher = authorize(['TEACHER', 'ADMIN']);
export const authorizeStudent = authorize(['STUDENT', 'ADMIN']);

/**
 * Authorize Course Access (CWE-639 IDOR Prevention)
 * Enforces object-level authorization for course detail endpoints.
 * Verifies that students are enrolled in the course, teachers instruct the course, or users are administrators.
 */
export async function authorizeCourseAccess(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Authentication required.' });
  }

  const courseId = req.params.id || req.params.courseId;
  if (!courseId) {
    return next();
  }

  // Administrators have universal authorization
  if (req.user.role === 'ADMIN') {
    return next();
  }

  // Verify course existence
  const course = await db.get<any>('SELECT id, teacher_id FROM courses WHERE id = $1', [courseId]);
  if (!course) {
    return res.status(404).json({ success: false, message: 'Course not found.' });
  }

  // Students must be enrolled in the course to access course details (IDOR protection - CWE-639)
  if (req.user.role === 'STUDENT') {
    const studentId = req.user.studentId;
    if (!studentId) {
      return res.status(403).json({ success: false, message: 'Forbidden: No student profile associated.' });
    }
    const enrollment = await db.get<any>(
      'SELECT id FROM enrollments WHERE student_id = $1 AND course_id = $2',
      [studentId, courseId]
    );
    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You can only access details for courses in which you are enrolled.',
      });
    }
    return next();
  }

  // Faculty must be the instructor of the course (IDOR protection - CWE-639)
  if (req.user.role === 'TEACHER') {
    const teacherId = req.user.teacherId;
    if (course.teacher_id && teacherId && course.teacher_id !== teacherId) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: Faculty can only inspect course details for courses they instruct.',
      });
    }
    return next();
  }

  next();
}

