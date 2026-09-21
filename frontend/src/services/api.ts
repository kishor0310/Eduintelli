const API_BASE = '/api';

// Retrieve dynamic anti-CSRF token (prevents static token bypass - CWE-352)
function getCsrfToken(): string {
  if (typeof document !== 'undefined') {
    const cookieMatch = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]*)/);
    if (cookieMatch && cookieMatch[1]) {
      return decodeURIComponent(cookieMatch[1]);
    }
  }
  if (typeof window !== 'undefined' && window.sessionStorage) {
    let token = window.sessionStorage.getItem('eduintelli_csrf_token');
    if (!token) {
      token = (window.crypto && window.crypto.randomUUID)
        ? window.crypto.randomUUID()
        : Math.random().toString(36).substring(2) + Date.now().toString(36);
      window.sessionStorage.setItem('eduintelli_csrf_token', token);
    }
    return token;
  }
  return '';
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; [key: string]: any }> {
  const token = localStorage.getItem('eduintelli_token');
  const csrfToken = getCsrfToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    ...(csrfToken ? { 'X-CSRF-Token': csrfToken } : {}),
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
}

export const api = {
  // Auth
  login: (credentials: { email: string; password: string }) =>
    apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (payload: any) =>
    apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  getMe: () => apiRequest('/auth/me'),

  // Student
  getStudentDashboard: (studentId?: string) =>
    apiRequest(studentId ? `/students/${studentId}/dashboard` : '/students/dashboard'),
  getStudentTimetable: (studentId?: string) =>
    apiRequest(studentId ? `/students/${studentId}/timetable` : '/students/timetable'),
  getAllStudents: () => apiRequest('/students'),

  // Teacher
  getTeacherDashboard: (teacherId?: string) =>
    apiRequest(teacherId ? `/teachers/${teacherId}/dashboard` : '/teachers/dashboard'),
  triggerIntervention: (payload: { studentId: string; courseId?: string; actionType: string; notes: string }) =>
    apiRequest('/teachers/intervene', { method: 'POST', body: JSON.stringify(payload) }),

  // Admin
  getAdminDashboard: () => apiRequest('/admin/dashboard'),

  // Courses
  getCourses: (params?: { search?: string; department?: string; semester?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.append('search', params.search);
    if (params?.department) searchParams.append('department', params.department);
    if (params?.semester) searchParams.append('semester', params.semester);
    const qs = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return apiRequest(`/courses${qs}`);
  },
  getCourseById: (courseId: string) => apiRequest(`/courses/${courseId}`),
  enrollInCourse: (courseId: string) =>
    apiRequest(`/courses/${courseId}/enroll`, { method: 'POST' }),

  // Attendance
  getStudentAttendance: (studentId?: string) =>
    apiRequest(studentId ? `/attendance/student/${studentId}` : '/attendance/student'),
  getCourseAttendance: (courseId: string, date?: string) =>
    apiRequest(`/attendance/course/${courseId}${date ? `?date=${date}` : ''}`),
  markAttendanceBatch: (payload: { courseId: string; date: string; records: any[] }) =>
    apiRequest('/attendance/mark', { method: 'POST', body: JSON.stringify(payload) }),

  // Assignments
  getAssignments: (courseId?: string) =>
    apiRequest(`/assignments${courseId ? `?courseId=${courseId}` : ''}`),
  createAssignment: (payload: any) =>
    apiRequest('/assignments', { method: 'POST', body: JSON.stringify(payload) }),
  submitAssignment: (payload: { assignmentId: string; fileUrl?: string; submissionText?: string }) =>
    apiRequest('/assignments/submit', { method: 'POST', body: JSON.stringify(payload) }),
  gradeSubmission: (payload: { submissionId: string; score: number; feedback?: string; status?: string }) =>
    apiRequest('/assignments/grade', { method: 'POST', body: JSON.stringify(payload) }),
  getAssignmentSubmissions: (assignmentId: string) =>
    apiRequest(`/assignments/${assignmentId}/submissions`),

  // Examinations
  getExaminations: (courseId?: string) =>
    apiRequest(`/examinations${courseId ? `?courseId=${courseId}` : ''}`),
  createExamination: (payload: any) =>
    apiRequest('/examinations', { method: 'POST', body: JSON.stringify(payload) }),
  recordExamResults: (payload: { examinationId: string; results: any[] }) =>
    apiRequest('/examinations/results', { method: 'POST', body: JSON.stringify(payload) }),

  // AI & Intelligence
  getAIRisk: (studentId: string) => apiRequest(`/ai/risk/${studentId}`),
  getAIRecommendations: (studentId: string) => apiRequest(`/ai/recommendations/${studentId}`),
  getAIInsights: (studentId: string) => apiRequest(`/ai/insights/${studentId}`),
  getInstitutionalAIInsights: () => apiRequest('/ai/institutional-insights'),
  askAICoach: (question: string) =>
    apiRequest('/ai/ask-coach', { method: 'POST', body: JSON.stringify({ question }) }),

  // Reports
  getPerformanceReport: (studentId?: string) =>
    apiRequest(studentId ? `/reports/student/${studentId}` : '/reports/student/std-01'),
};
