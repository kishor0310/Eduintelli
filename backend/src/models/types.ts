export type UserRole = 'STUDENT' | 'TEACHER' | 'ADMIN';
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';
export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE';
export type SubmissionStatus = 'SUBMITTED' | 'GRADED' | 'LATE' | 'RESUBMISSION_REQUIRED';
export type ExamType = 'MIDTERM' | 'FINAL' | 'INTERNAL_ASSESSMENT' | 'QUIZ';
export type PriorityLevel = 'HIGH' | 'MEDIUM' | 'LOW';
export type SeverityLevel = 'INFO' | 'WARNING' | 'CRITICAL' | 'POSITIVE';

export interface User {
  id: string;
  name: string;
  email: string;
  password_hash?: string;
  role: UserRole;
  avatar_url?: string;
  phone?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Student {
  id: string;
  user_id: string;
  roll_number: string;
  department: string;
  semester: number;
  batch: string;
  cgpa: number;
  academic_risk_score: number;
  risk_level: RiskLevel;
  // Joined fields
  name?: string;
  email?: string;
  avatar_url?: string;
}

export interface Teacher {
  id: string;
  user_id: string;
  employee_id: string;
  department: string;
  designation: string;
  specialization: string;
  office_room: string;
  name?: string;
  email?: string;
  avatar_url?: string;
}

export interface Admin {
  id: string;
  user_id: string;
  department: string;
  admin_level: string;
  name?: string;
  email?: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  description: string;
  credits: number;
  department: string;
  semester: number;
  teacher_id: string;
  rating: number;
  thumbnail_url?: string;
  syllabus?: string;
  teacher_name?: string;
  enrolled_count?: number;
}

export interface ClassSchedule {
  id: string;
  course_id: string;
  section: string;
  room_number: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  course_name?: string;
  course_code?: string;
}

export interface AttendanceRecord {
  id: string;
  student_id: string;
  course_id: string;
  date: string;
  status: AttendanceStatus;
  remarks?: string;
  created_at: string;
  student_name?: string;
  course_name?: string;
  course_code?: string;
}

export interface Assignment {
  id: string;
  course_id: string;
  title: string;
  description: string;
  max_score: number;
  due_date: string;
  weightage: number;
  attachment_url?: string;
  created_at: string;
  course_name?: string;
  course_code?: string;
  submission_count?: number;
  user_submission?: Submission;
}

export interface Submission {
  id: string;
  assignment_id: string;
  student_id: string;
  submitted_at: string;
  file_url?: string;
  submission_text?: string;
  score?: number;
  feedback?: string;
  status: SubmissionStatus;
  student_name?: string;
  roll_number?: string;
  assignment_title?: string;
  max_score?: number;
}

export interface Examination {
  id: string;
  course_id: string;
  name: string;
  exam_type: ExamType;
  exam_date: string;
  max_score: number;
  weightage: number;
  room?: string;
  course_name?: string;
  course_code?: string;
  average_score?: number;
}

export interface ExamResult {
  id: string;
  examination_id: string;
  student_id: string;
  marks_obtained: number;
  grade: string;
  remarks?: string;
  exam_name?: string;
  max_score?: number;
  course_name?: string;
  course_code?: string;
}

export interface AIInsight {
  id: string;
  student_id?: string | null;
  course_id?: string | null;
  category: 'PERFORMANCE' | 'RISK' | 'WEAK_SUBJECT' | 'ATTENDANCE' | 'STRENGTH' | 'INSTITUTIONAL';
  title: string;
  description: string;
  confidence_score: number;
  severity: SeverityLevel;
  created_at: string;
  course_name?: string;
}

export interface Recommendation {
  id: string;
  student_id: string;
  course_id?: string | null;
  title: string;
  action_item: string;
  priority: PriorityLevel;
  target_days: number;
  is_completed: boolean;
  created_at: string;
  course_name?: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'ALERT' | 'RECOMMENDATION' | 'INTERVENTION' | 'SYSTEM' | 'GRADE';
  is_read: boolean;
  link?: string;
  created_at: string;
}

export interface RiskAnalysis {
  riskScore: number;
  riskLevel: RiskLevel;
  factors: {
    attendanceRisk: number;
    assignmentRisk: number;
    examRisk: number;
    trendRisk: number;
  };
  metrics: {
    attendancePercentage: number;
    assignmentAverage: number;
    examAverage: number;
    performanceTrendDelta: number;
    missedClasses: number;
    lateSubmissions: number;
  };
  reasons: string[];
  recommendedActions: string[];
}

export interface WeakSubjectAnalysis {
  courseId: string;
  courseCode: string;
  courseName: string;
  scorePercentage: number;
  attendancePercentage: number;
  priority: PriorityLevel;
  status: 'Critical Attention' | 'Needs Improvement' | 'Satisfactory' | 'Strong';
  trendDelta: number;
  notes: string;
}
