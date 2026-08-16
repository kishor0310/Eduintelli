export type UserRole = 'STUDENT' | 'TEACHER' | 'ADMIN';
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';
export type PriorityLevel = 'HIGH' | 'MEDIUM' | 'LOW';
export type SeverityLevel = 'INFO' | 'WARNING' | 'CRITICAL' | 'POSITIVE';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  phone?: string;
  studentId?: string;
  teacherId?: string;
  adminId?: string;
}

export interface StudentProfile {
  id: string;
  user_id: string;
  name: string;
  email: string;
  avatar_url?: string;
  roll_number: string;
  department: string;
  semester: number;
  batch: string;
  cgpa: number;
  academic_risk_score: number;
  risk_level: RiskLevel;
}

export interface RiskFactors {
  attendanceRisk: number;
  assignmentRisk: number;
  examRisk: number;
  trendRisk: number;
}

export interface RiskMetrics {
  attendancePercentage: number;
  assignmentAverage: number;
  examAverage: number;
  performanceTrendDelta: number;
  missedClasses: number;
  lateSubmissions: number;
}

export interface RiskAnalysis {
  riskScore: number;
  riskLevel: RiskLevel;
  factors: RiskFactors;
  metrics: RiskMetrics;
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

export interface AIInsight {
  id?: string;
  student_id?: string | null;
  course_id?: string | null;
  category: 'PERFORMANCE' | 'RISK' | 'WEAK_SUBJECT' | 'ATTENDANCE' | 'STRENGTH' | 'INSTITUTIONAL';
  title: string;
  description: string;
  confidence_score: number;
  severity: SeverityLevel;
  created_at?: string;
}

export interface Recommendation {
  id?: string;
  student_id?: string;
  course_id?: string | null;
  title: string;
  action_item: string;
  priority: PriorityLevel;
  target_days: number;
  is_completed: boolean;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  description: string;
  credits: number;
  department: string;
  semester: number;
  teacher_id?: string;
  teacher_name?: string;
  rating: number;
  thumbnail_url?: string;
  syllabus?: string;
  enrolled_count?: number;
  current_grade?: string;
}

export interface Assignment {
  id: string;
  course_id: string;
  course_code?: string;
  course_name?: string;
  title: string;
  description: string;
  max_score: number;
  due_date: string;
  weightage: number;
  attachment_url?: string;
  submission_count?: number;
  user_submission?: {
    id: string;
    submitted_at: string;
    score?: number;
    feedback?: string;
    status: 'SUBMITTED' | 'GRADED' | 'LATE' | 'RESUBMISSION_REQUIRED';
    file_url?: string;
  } | null;
}

export interface Examination {
  id: string;
  course_id: string;
  course_code?: string;
  course_name?: string;
  name: string;
  exam_type: 'MIDTERM' | 'FINAL' | 'INTERNAL_ASSESSMENT' | 'QUIZ';
  exam_date: string;
  max_score: number;
  weightage: number;
  room?: string;
  class_average?: number;
  highest_score?: number;
  lowest_score?: number;
  student_result?: {
    marks_obtained: number;
    grade: string;
    remarks?: string;
  } | null;
}

export interface AttendanceSubject {
  courseId: string;
  courseCode: string;
  courseName: string;
  totalClasses: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  percentage: number;
  isAtRisk: boolean;
}

export interface AttendanceHistory {
  id: string;
  date: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE';
  remarks?: string;
  course_code: string;
  course_name: string;
}
