import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  // CWE-285: Restrict self-registration to non-administrative roles
  role: z.enum(['STUDENT', 'TEACHER']).default('STUDENT'),
  department: z.string().min(2, 'Department is required'),
  rollNumber: z.string().optional(),
  employeeId: z.string().optional(),
});

export const markAttendanceSchema = z.object({
  courseId: z.string().min(1, 'Course ID is required'),
  date: z.string().min(1, 'Date is required'),
  records: z.array(
    z.object({
      studentId: z.string().min(1),
      status: z.enum(['PRESENT', 'ABSENT', 'LATE']),
      remarks: z.string().optional(),
    })
  ).min(1, 'At least one student record is required'),
});

export const createAssignmentSchema = z.object({
  courseId: z.string().min(1, 'Course ID is required'),
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(5, 'Description is required'),
  maxScore: z.number().int().positive().default(100),
  dueDate: z.string().min(1, 'Due date is required'),
  weightage: z.number().positive().default(10),
  attachmentUrl: z.string().optional(),
});

export const submitAssignmentSchema = z.object({
  assignmentId: z.string().min(1, 'Assignment ID is required'),
  fileUrl: z.string().optional(),
  submissionText: z.string().optional(),
});

export const gradeSubmissionSchema = z.object({
  submissionId: z.string().min(1, 'Submission ID is required'),
  score: z.number().min(0).max(100),
  feedback: z.string().optional(),
  status: z.enum(['GRADED', 'RESUBMISSION_REQUIRED']).default('GRADED'),
});

export const createExamSchema = z.object({
  courseId: z.string().min(1, 'Course ID is required'),
  name: z.string().min(3, 'Exam name is required'),
  examType: z.enum(['MIDTERM', 'FINAL', 'INTERNAL_ASSESSMENT', 'QUIZ']),
  examDate: z.string().min(1, 'Exam date is required'),
  maxScore: z.number().positive().default(100),
  weightage: z.number().positive().default(30),
  room: z.string().optional(),
});

export const recordExamResultsSchema = z.object({
  examinationId: z.string().min(1, 'Examination ID is required'),
  results: z.array(
    z.object({
      studentId: z.string().min(1),
      marksObtained: z.number().min(0),
      grade: z.string().optional(),
      remarks: z.string().optional(),
    })
  ).min(1, 'At least one result record is required'),
});

export const interventionSchema = z.object({
  studentId: z.string().min(1, 'Student ID is required'),
  courseId: z.string().optional(),
  actionType: z.enum(['ACADEMIC_ALERT', 'STUDY_PLAN', 'MEETING_REQUEST', 'PEER_TUTORING']),
  notes: z.string().min(5, 'Intervention notes are required'),
});
