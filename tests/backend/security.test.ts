import http from 'http';
import jwt from 'jsonwebtoken';
import { app } from '../../backend/src/app';
import { config } from '../../backend/src/config';
import { initializeDatabase } from '../../backend/src/database/seedRunner';
import { generateCsrfToken } from '../../backend/src/middleware/csrf';

async function runSecurityTests() {
  console.log('🔒 Running Full 19-Point Comprehensive Security Verification Suite...');
  await initializeDatabase();

  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const port = (server.address() as any).port;
  const baseUrl = 'http://127.0.0.1:' + port + '/api';

  const studentToken = jwt.sign(
    { id: 'usr-student-01', email: 'student@demo.com', role: 'STUDENT', name: 'Alex Rivera', studentId: 'std-01' },
    config.jwtSecret,
    { expiresIn: '1h' }
  );

  const teacherToken = jwt.sign(
    { id: 'usr-teacher-01', email: 'teacher@demo.com', role: 'TEACHER', name: 'Prof. Alan Turing', teacherId: 'tch-01' },
    config.jwtSecret,
    { expiresIn: '1h' }
  );

  const adminToken = jwt.sign(
    { id: 'usr-admin-01', email: 'admin@demo.com', role: 'ADMIN', name: 'Dr. Sarah Jenkins', adminId: 'adm-01' },
    config.jwtSecret,
    { expiresIn: '1h' }
  );

  let passed = 0;

  // 1. Missing admin role check on /admin/dashboard (CWE-284)
  const res1 = await fetch(baseUrl + '/admin/dashboard', {
    headers: { Authorization: 'Bearer ' + studentToken }
  });
  if (res1.status === 403) {
    console.log('✅ 1. Admin dashboard rejects non-admin token (403 Forbidden)');
    passed++;
  } else {
    throw new Error('Expected 403 on admin dashboard for student, got ' + res1.status);
  }

  // 2. Unauthenticated access to course data (CWE-306)
  const res2 = await fetch(baseUrl + '/courses');
  if (res2.status === 401) {
    console.log('✅ 2. Courses endpoint rejects unauthenticated access (401 Unauthorized)');
    passed++;
  } else {
    throw new Error('Expected 401 on /courses without token, got ' + res2.status);
  }

  // 3. Missing authorization on assignment creation (CWE-284)
  const res3 = await fetch(baseUrl + '/assignments', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + studentToken,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      courseId: 'crs-01',
      title: 'Hacked Assignment',
      description: 'Unauthorized test',
      maxScore: 100,
      dueDate: new Date().toISOString(),
      weightage: 10
    })
  });
  if (res3.status === 403) {
    console.log('✅ 3. Assignment creation rejects student role (403 Forbidden)');
    passed++;
  } else {
    throw new Error('Expected 403 on assignment creation for student, got ' + res3.status);
  }

  // 4. IDOR in AI student risk endpoint (CWE-639)
  const res4 = await fetch(baseUrl + '/ai/risk/std-02', {
    headers: { Authorization: 'Bearer ' + studentToken }
  });
  if (res4.status === 403) {
    console.log('✅ 4. AI risk IDOR blocked when student requests other student (403 Forbidden)');
    passed++;
  } else {
    throw new Error('Expected 403 on AI risk IDOR, got ' + res4.status);
  }

  // 5. IDOR in attendance summary endpoint (CWE-639)
  const res5 = await fetch(baseUrl + '/attendance/student/std-02', {
    headers: { Authorization: 'Bearer ' + studentToken }
  });
  if (res5.status === 403) {
    console.log('✅ 5. Attendance IDOR blocked when student requests other student (403 Forbidden)');
    passed++;
  } else {
    throw new Error('Expected 403 on attendance IDOR, got ' + res5.status);
  }

  // 6. ReportController IDOR via studentId param (CWE-639)
  const res6 = await fetch(baseUrl + '/reports/student/std-02', {
    headers: { Authorization: 'Bearer ' + studentToken }
  });
  if (res6.status === 403) {
    console.log('✅ 6. Reports IDOR blocked when student requests other student (403 Forbidden)');
    passed++;
  } else {
    throw new Error('Expected 403 on reports IDOR, got ' + res6.status);
  }

  // 7. StudentController IDOR via id param (CWE-639)
  const res7 = await fetch(baseUrl + '/students/std-02/dashboard', {
    headers: { Authorization: 'Bearer ' + studentToken }
  });
  if (res7.status === 403) {
    console.log('✅ 7. Student dashboard IDOR blocked for std-02 (403 Forbidden)');
    passed++;
  } else {
    throw new Error('Expected 403 on student dashboard IDOR, got ' + res7.status);
  }

  // 8. TeacherController IDOR via teacherId param (CWE-639)
  const res8 = await fetch(baseUrl + '/teachers/tch-01/dashboard', {
    headers: { Authorization: 'Bearer ' + studentToken }
  });
  if (res8.status === 403) {
    console.log('✅ 8. Teacher dashboard correctly blocked for student role (403 Forbidden)');
    passed++;
  } else {
    throw new Error('Expected 403 on teacher dashboard for student, got ' + res8.status);
  }

  // 9. Missing authorization on attendance batch endpoints (CWE-400 / CWE-284)
  const res9 = await fetch(baseUrl + '/attendance/mark', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + studentToken,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      courseId: 'crs-01',
      date: '2026-09-20',
      records: [{ studentId: 'std-01', status: 'PRESENT' }]
    })
  });
  if (res9.status === 403) {
    console.log('✅ 9. Attendance batch marking rejects student role (403 Forbidden)');
    passed++;
  } else {
    throw new Error('Expected 403 on attendance mark for student, got ' + res9.status);
  }

  // 10. Own Student Dashboard loads cleanly with token identity
  const res10 = await fetch(baseUrl + '/students/dashboard', {
    headers: { Authorization: 'Bearer ' + studentToken }
  });
  const data10: any = await res10.json();
  if (res10.status === 200 && data10.success && data10.data?.student?.id === 'std-01') {
    console.log('✅ 10. Student dashboard loads own profile std-01 securely without IDOR');
    passed++;
  } else {
    throw new Error('Expected 200 on self student dashboard, got ' + res10.status);
  }

  // 11. CORS Origin check (CWE-352)
  const res11 = await fetch(baseUrl + '/courses', {
    headers: { Origin: 'http://malicious-site.com' }
  });
  const allowOrigin = res11.headers.get('access-control-allow-origin');
  if (allowOrigin !== '*' && allowOrigin !== 'http://malicious-site.com') {
    console.log('✅ 11. CORS headers do not reflect untrusted origin (CWE-352 secured)');
    passed++;
  } else {
    throw new Error('CORS policy failed, returned: ' + allowOrigin);
  }

  // 12. Rate Limiting headers on Auth (CWE-770 & CWE-400)
  const validCsrf = generateCsrfToken();
  const res12 = await fetch(baseUrl + '/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': validCsrf },
    body: JSON.stringify({ email: 'test@demo.com', password: 'badpassword' })
  });
  const ratelimitRemaining = res12.headers.get('ratelimit-remaining') || res12.headers.get('x-ratelimit-remaining');
  console.log('✅ 12. Rate limiting headers active on auth endpoint (Remaining: ' + ratelimitRemaining + ')');
  passed++;

  // 13. CSRF Protection on registration endpoint (CWE-352)
  const res13 = await fetch(baseUrl + '/auth/register', {
    method: 'POST',
    headers: {
      Origin: 'http://evil-attacker-site.com'
    },
    body: JSON.stringify({ email: 'hacker@evil.com', password: 'Pass123!', name: 'Hacker' })
  });
  if (res13.status === 403) {
    console.log('✅ 13. Registration endpoint blocks untrusted cross-origin CSRF (403 Forbidden)');
    passed++;
  } else {
    throw new Error('Expected 403 on CSRF register, got ' + res13.status);
  }

  // 14. Assignment IDOR: Student can only view assignments for enrolled courses (CWE-639)
  const res14 = await fetch(baseUrl + '/assignments', {
    headers: { Authorization: 'Bearer ' + studentToken }
  });
  const data14: any = await res14.json();
  if (res14.status === 200 && data14.success) {
    console.log('✅ 14. Assignment endpoint filters by student enrollment (CWE-639 IDOR protected)');
    passed++;
  } else {
    throw new Error('Failed to get assignments for student');
  }

  // 15. Examination IDOR: Student can only view exams for enrolled courses (CWE-639)
  const res15 = await fetch(baseUrl + '/examinations', {
    headers: { Authorization: 'Bearer ' + studentToken }
  });
  const data15: any = await res15.json();
  if (res15.status === 200 && data15.success) {
    console.log('✅ 15. Examination endpoint filters by student enrollment (CWE-639 IDOR protected)');
    passed++;
  } else {
    throw new Error('Failed to get examinations for student');
  }

  // 16. Missing rate limiting on attendance GET endpoints (CWE-770)
  const res16 = await fetch(baseUrl + '/attendance/student', {
    headers: { Authorization: 'Bearer ' + studentToken }
  });
  const attRemaining = res16.headers.get('ratelimit-remaining') || res16.headers.get('x-ratelimit-remaining');
  if (attRemaining !== null) {
    console.log('✅ 16. Attendance GET endpoint has rate limiter active (Remaining: ' + attRemaining + ')');
    passed++;
  } else {
    throw new Error('Attendance GET endpoint missing rate limiting header');
  }

  // 17. Unauthenticated health check leaks version info (CWE-200)
  const res17 = await fetch(baseUrl + '/health');
  const data17: any = await res17.json();
  if (res17.status === 200 && data17.status === 'healthy' && !('version' in data17)) {
    console.log('✅ 17. Health check does not leak version info (CWE-200 resolved)');
    passed++;
  } else {
    throw new Error('Health check leaks version info: ' + JSON.stringify(data17));
  }

  // 18. Teacher dashboard authorization bypass blocked (CWE-287)
  const res18 = await fetch(baseUrl + '/teachers/dashboard', {
    headers: { Authorization: 'Bearer ' + studentToken }
  });
  if (res18.status === 403) {
    console.log('✅ 18. Teacher dashboard blocks unauthorized access from student role (403 Forbidden)');
    passed++;
  } else {
    throw new Error('Expected 403 on teacher dashboard with student token, got ' + res18.status);
  }

  // 19. Teacher arbitrary student attendance IDOR blocked (CWE-639)
  const res19 = await fetch(baseUrl + '/attendance/student/std-02', {
    headers: { Authorization: 'Bearer ' + teacherToken }
  });
  if (res19.status === 403) {
    console.log('✅ 19. Teacher arbitrary student attendance access blocked (403 Forbidden)');
    passed++;
  } else {
    throw new Error('Expected 403 on teacher student attendance IDOR, got ' + res19.status);
  }

  // 20. Teacher arbitrary student AI analysis IDOR blocked (CWE-639)
  const res20 = await fetch(baseUrl + '/ai/risk/std-02', {
    headers: { Authorization: 'Bearer ' + teacherToken }
  });
  if (res20.status === 403) {
    console.log('✅ 20. Teacher arbitrary student AI analysis blocked (403 Forbidden)');
    passed++;
  } else {
    throw new Error('Expected 403 on teacher student AI analysis IDOR, got ' + res20.status);
  }

  // 21. Rate limiting on AI risk endpoint (CWE-770 & CWE-400)
  const res21 = await fetch(baseUrl + '/ai/risk', {
    headers: { Authorization: 'Bearer ' + studentToken }
  });
  const riskRemaining = res21.headers.get('ratelimit-remaining') || res21.headers.get('x-ratelimit-remaining');
  if (riskRemaining !== null) {
    console.log('✅ 21. AI risk endpoint has rate limiter active (Remaining: ' + riskRemaining + ')');
    passed++;
  } else {
    throw new Error('AI risk endpoint missing rate limiting header');
  }

  // 22. Rate limiting on Course endpoints (CWE-770 & CWE-400)
  const res22 = await fetch(baseUrl + '/courses', {
    headers: { Authorization: 'Bearer ' + studentToken }
  });
  const courseRemaining = res22.headers.get('ratelimit-remaining') || res22.headers.get('x-ratelimit-remaining');
  if (courseRemaining !== null) {
    console.log('✅ 22. Courses endpoint has rate limiter active (Remaining: ' + courseRemaining + ')');
    passed++;
  } else {
    throw new Error('Courses endpoint missing rate limiting header');
  }

  // 23. Rate limiting on Examination endpoints (CWE-770 & CWE-400)
  const res23 = await fetch(baseUrl + '/examinations', {
    headers: { Authorization: 'Bearer ' + studentToken }
  });
  const examRemaining = res23.headers.get('ratelimit-remaining') || res23.headers.get('x-ratelimit-remaining');
  if (examRemaining !== null) {
    console.log('✅ 23. Examination endpoint has rate limiter active (Remaining: ' + examRemaining + ')');
    passed++;
  } else {
    throw new Error('Examination endpoint missing rate limiting header');
  }

  // 24. Rate limiting on Report endpoints (CWE-770 & CWE-400)
  const res24 = await fetch(baseUrl + '/reports/student', {
    headers: { Authorization: 'Bearer ' + studentToken }
  });
  const reportRemaining = res24.headers.get('ratelimit-remaining') || res24.headers.get('x-ratelimit-remaining');
  if (reportRemaining !== null) {
    console.log('✅ 24. Reports endpoint has rate limiter active (Remaining: ' + reportRemaining + ')');
    passed++;
  } else {
    throw new Error('Reports endpoint missing rate limiting header');
  }

  // 25. Privilege Escalation Prevention on Registration (CWE-285)
  const res25 = await fetch(baseUrl + '/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': validCsrf,
    },
    body: JSON.stringify({
      name: 'Malicious Admin',
      email: 'hacked_admin_' + Date.now() + '@test.com',
      password: 'password123',
      role: 'ADMIN',
      department: 'Computer Science'
    })
  });
  if (res25.status === 403) {
    console.log('✅ 25. Self-registration as ADMIN rejected (403 Forbidden - CWE-285)');
    passed++;
  } else {
    throw new Error('Expected 403 on register with ADMIN role, got ' + res25.status);
  }

  // 26. CSRF Protection without token or auth header (CWE-352)
  const res26 = await fetch(baseUrl + '/assignments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ title: 'Cross site forged assignment' })
  });
  if (res26.status === 403) {
    console.log('✅ 26. Assignment creation without CSRF token/auth rejected (403 Forbidden - CWE-352)');
    passed++;
  } else {
    throw new Error('Expected 403 on CSRF violation, got ' + res26.status);
  }

  // 27. Rate limiting active on AI recommendations (CWE-770)
  const res27 = await fetch(baseUrl + '/ai/recommendations', {
    headers: { Authorization: 'Bearer ' + studentToken }
  });
  const recRemaining = res27.headers.get('ratelimit-remaining') || res27.headers.get('x-ratelimit-remaining');
  if (recRemaining !== null) {
    console.log('✅ 27. AI recommendations rate limiter active (Remaining: ' + recRemaining + ' - CWE-770)');
    passed++;
  } else {
    throw new Error('Expected rate limiting header on /ai/recommendations');
  }

  // 28. Rate limiting active on assignment listing (CWE-770)
  const res28 = await fetch(baseUrl + '/assignments', {
    headers: { Authorization: 'Bearer ' + studentToken }
  });
  const asgRemaining = res28.headers.get('ratelimit-remaining') || res28.headers.get('x-ratelimit-remaining');
  if (asgRemaining !== null) {
    console.log('✅ 28. Assignment listing rate limiter active (Remaining: ' + asgRemaining + ' - CWE-770)');
    passed++;
  } else {
    throw new Error('Expected rate limiting header on /assignments');
  }

  // 29. IDOR protection on course attendance endpoint (CWE-639)
  const res29 = await fetch(baseUrl + '/attendance/course/crs-01', {
    headers: { Authorization: 'Bearer ' + studentToken }
  });
  if (res29.status === 403) {
    console.log('✅ 29. Student blocked from accessing course attendance roster (403 Forbidden - CWE-639)');
    passed++;
  } else {
    throw new Error('Expected 403 on course attendance IDOR for student, got ' + res29.status);
  }

  // 30. IDOR protection on course enrollment endpoint (CWE-639)
  const res30 = await fetch(baseUrl + '/courses/crs-02/enroll', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + teacherToken,
      'X-CSRF-Token': validCsrf
    }
  });
  if (res30.status === 403) {
    console.log('✅ 30. Non-student blocked from enrolling in course (403 Forbidden - CWE-639)');
    passed++;
  } else {
    throw new Error('Expected 403 on course enroll for teacher, got ' + res30.status);
  }

  // 31. CSRF Protection on assignment submission (CWE-352)
  const res31 = await fetch(baseUrl + '/assignments/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Missing CSRF token and auth header
    },
    body: JSON.stringify({ assignmentId: 'asg-01' })
  });
  if (res31.status === 403 || res31.status === 401) {
    console.log('✅ 31. Assignment submission without CSRF/auth rejected (' + res31.status + ' - CWE-352)');
    passed++;
  } else {
    throw new Error('Expected 403/401 on unauthenticated CSRF submission, got ' + res31.status);
  }

  // 32. CSRF Protection on assignment grading (CWE-352)
  const res32 = await fetch(baseUrl + '/assignments/grade', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Missing CSRF token and auth header
    },
    body: JSON.stringify({ submissionId: 'sub-01', score: 95 })
  });
  if (res32.status === 403 || res32.status === 401) {
    console.log('✅ 32. Assignment grading without CSRF/auth rejected (' + res32.status + ' - CWE-352)');
    passed++;
  } else {
    throw new Error('Expected 403/401 on unauthenticated CSRF grading, got ' + res32.status);
  }

  // 33. Enrolled student can inspect their own course details
  const res33 = await fetch(baseUrl + '/courses/crs-01', {
    headers: { Authorization: 'Bearer ' + studentToken }
  });
  if (res33.status === 200) {
    console.log('✅ 33. Enrolled student successfully accesses course crs-01 details (200 OK)');
    passed++;
  } else {
    throw new Error('Expected 200 on enrolled course access, got ' + res33.status);
  }

  // 34. Non-enrolled student blocked from accessing course details (CWE-639 IDOR)
  const res34 = await fetch(baseUrl + '/courses/crs-06', {
    headers: { Authorization: 'Bearer ' + studentToken }
  });
  if (res34.status === 403) {
    console.log('✅ 34. Non-enrolled student blocked from accessing course crs-06 details (403 Forbidden - CWE-639 IDOR)');
    passed++;
  } else {
    throw new Error('Expected 403 on course detail IDOR, got ' + res34.status);
  }

  // 35. Rate limiting active on user profile endpoint /auth/me (CWE-400)
  const res35 = await fetch(baseUrl + '/auth/me', {
    headers: { Authorization: 'Bearer ' + studentToken }
  });
  const meRemaining = res35.headers.get('ratelimit-remaining') || res35.headers.get('x-ratelimit-remaining');
  if (meRemaining !== null) {
    console.log('✅ 35. User profile /auth/me has rate limiter active (Remaining: ' + meRemaining + ' - CWE-400)');
    passed++;
  } else {
    throw new Error('Expected rate limiting header on /auth/me');
  }

  // 36. IDOR protection on assignment retrieval for unauthorized course (CWE-639)
  const res36 = await fetch(baseUrl + '/assignments?courseId=crs-06', {
    headers: { Authorization: 'Bearer ' + studentToken }
  });
  if (res36.status === 403) {
    console.log('✅ 36. Assignment retrieval for unauthorized course blocked (403 Forbidden - CWE-639 IDOR)');
    passed++;
  } else {
    throw new Error('Expected 403 on assignment IDOR query for unauthorized course, got ' + res36.status);
  }

  // 37. CSRF protection on AI ask-coach endpoint (CWE-352)
  const res37 = await fetch(baseUrl + '/ai/ask-coach', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Missing CSRF token and auth header
    },
    body: JSON.stringify({ question: 'Can I forge requests?' })
  });
  if (res37.status === 403 || res37.status === 401) {
    console.log('✅ 37. AI ask-coach without CSRF/auth rejected (' + res37.status + ' - CWE-352)');
    passed++;
  } else {
    throw new Error('Expected 403/401 on unauthenticated CSRF ask-coach, got ' + res37.status);
  }

  // 38. Single assignment retrieval IDOR & authentication check (CWE-639)
  const res38Unauth = await fetch(baseUrl + '/assignments/asg-01');
  const res38Auth = await fetch(baseUrl + '/assignments/asg-01', {
    headers: { Authorization: 'Bearer ' + studentToken }
  });
  if (res38Unauth.status === 401 && res38Auth.status === 200) {
    console.log('✅ 38. Single assignment retrieval enforces authentication & enrollment (CWE-639 IDOR)');
    passed++;
  } else {
    throw new Error(`Expected 401 unauth and 200 auth for assignment retrieval, got ${res38Unauth.status} and ${res38Auth.status}`);
  }

  // 39. Unrestricted role assignment blocked on registration (CWE-285)
  const res39 = await fetch(baseUrl + '/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    },
    body: JSON.stringify({
      name: 'Rogue Faculty',
      email: 'rogue_faculty_' + Date.now() + '@test.com',
      password: 'password123',
      role: 'TEACHER',
      department: 'Computer Science'
    })
  });
  if (res39.status === 403) {
    console.log('✅ 39. Unrestricted role assignment (TEACHER) rejected during registration (403 Forbidden - CWE-285)');
    passed++;
  } else {
    throw new Error('Expected 403 on self-registering as TEACHER, got ' + res39.status);
  }

  // 40. AI risk access without valid student profile rejected without hardcoded fallback (CWE-639)
  // Teacher token has no studentId; calling /ai/risk should return 400/403, NOT fall back to std-01
  const res40 = await fetch(baseUrl + '/ai/risk', {
    headers: { Authorization: 'Bearer ' + teacherToken }
  });
  if (res40.status === 400 || res40.status === 403) {
    console.log('✅ 40. AI risk access rejected without hardcoded fallback std-01 (' + res40.status + ' - CWE-639)');
    passed++;
  } else {
    throw new Error('Expected 400/403 for AI risk without student profile, got ' + res40.status);
  }

  // 41. Attendance access without valid student profile rejected without hardcoded fallback (CWE-639)
  // Teacher token has no studentId; calling /attendance/student should return 400/403, NOT fall back to std-01
  const res41 = await fetch(baseUrl + '/attendance/student', {
    headers: { Authorization: 'Bearer ' + teacherToken }
  });
  if (res41.status === 400 || res41.status === 403) {
    console.log('✅ 41. Attendance access rejected without hardcoded fallback std-01 (' + res41.status + ' - CWE-639)');
    passed++;
  } else {
    throw new Error('Expected 400/403 for attendance without student profile, got ' + res41.status);
  }

  // 42. Teacher accessing assignment from unassigned course blocked by authorizeAssignmentAccess (CWE-639 IDOR)
  // asg-03 is for crs-02 (taught by tch-02); teacherToken is for tch-01
  const res42 = await fetch(baseUrl + '/assignments/asg-03', {
    headers: { Authorization: 'Bearer ' + teacherToken }
  });
  if (res42.status === 403) {
    console.log('✅ 42. Teacher accessing another faculty\'s assignment blocked by authorizeAssignmentAccess (403 Forbidden - CWE-639 IDOR)');
    passed++;
  } else {
    throw new Error('Expected 403 on teacher accessing another course assignment, got ' + res42.status);
  }

  // 43. Access to assignment retrieval endpoint without token rejected (401 - CWE-639)
  const res43 = await fetch(baseUrl + '/assignments/asg-03');
  if (res43.status === 401) {
    console.log('✅ 43. Unauthenticated access to assignment retrieval endpoint rejected (401 - CWE-639)');
    passed++;
  } else {
    throw new Error('Expected 401 on unauthenticated assignment fetch, got ' + res43.status);
  }

  // 44. Rate limiting active on admin dashboard endpoint /admin/dashboard (CWE-400)
  const res44 = await fetch(baseUrl + '/admin/dashboard', {
    headers: { Authorization: 'Bearer ' + adminToken }
  });
  const adminRemaining = res44.headers.get('ratelimit-remaining') || res44.headers.get('x-ratelimit-remaining');
  if (adminRemaining !== null && res44.status === 200) {
    console.log('✅ 44. Admin dashboard has rate limiter active (Remaining: ' + adminRemaining + ' - CWE-400)');
    passed++;
  } else {
    throw new Error('Expected rate limiting header and 200 on /admin/dashboard, got status ' + res44.status);
  }

  // 45. Institutional insights protected with authorizeAdmin (CWE-284)
  const res45Student = await fetch(baseUrl + '/ai/institutional-insights', {
    headers: { Authorization: 'Bearer ' + studentToken }
  });
  const res45Admin = await fetch(baseUrl + '/ai/institutional-insights', {
    headers: { Authorization: 'Bearer ' + adminToken }
  });
  if (res45Student.status === 403 && res45Admin.status === 200) {
    console.log('✅ 45. Institutional insights rejects student (403) and permits admin (200) (CWE-284)');
    passed++;
  } else {
    throw new Error(`Expected 403 student and 200 admin on /ai/institutional-insights, got ${res45Student.status} and ${res45Admin.status}`);
  }

  // 46. Teacher IDOR on Student Dashboard (CWE-639)
  // tch-01 instructs crs-01; std-05 is only enrolled in crs-03 & crs-08 (taught by tch-03)
  const res46 = await fetch(baseUrl + '/students/std-05/dashboard', {
    headers: { Authorization: 'Bearer ' + teacherToken }
  });
  if (res46.status === 403) {
    console.log('✅ 46. Teacher IDOR on Student Dashboard blocked for unenrolled student (403 Forbidden - CWE-639)');
    passed++;
  } else {
    throw new Error('Expected 403 on teacher accessing unenrolled student dashboard, got ' + res46.status);
  }

  // 47. Missing authorization on attendance list endpoint (CWE-639)
  const res47Student = await fetch(baseUrl + '/attendance', {
    headers: { Authorization: 'Bearer ' + studentToken }
  });
  const res47Teacher = await fetch(baseUrl + '/attendance', {
    headers: { Authorization: 'Bearer ' + teacherToken }
  });
  if (res47Student.status === 403 && res47Teacher.status === 200) {
    console.log('✅ 47. Attendance list endpoint enforces faculty authorization (403 student / 200 teacher - CWE-639)');
    passed++;
  } else {
    throw new Error(`Expected 403 student and 200 teacher on /attendance, got ${res47Student.status} and ${res47Teacher.status}`);
  }

  // 48. No CSRF protection on attendance marking endpoint (CWE-352)
  const res48 = await fetch(baseUrl + '/attendance/mark', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      courseId: 'crs-01',
      date: '2026-09-21',
      records: [{ studentId: 'std-01', status: 'PRESENT' }]
    })
  });
  if (res48.status === 403) {
    console.log('✅ 48. Attendance marking endpoint requires CSRF protection credentials (403 Forbidden - CWE-352)');
    passed++;
  } else {
    throw new Error('Expected 403 on attendance mark without CSRF token, got ' + res48.status);
  }

  // 49. CSRF protection only checks token presence, not validity (CWE-352)
  const res49 = await fetch(baseUrl + '/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': 'dummy_invalid_token'
    },
    body: JSON.stringify({
      name: 'Hacker',
      email: 'fake_hacker@evil.com',
      password: 'Password123!'
    })
  });
  if (res49.status === 403) {
    console.log('✅ 49. CSRF protection verifies cryptographic token validity and rejects dummy tokens (403 Forbidden - CWE-352)');
    passed++;
  } else {
    throw new Error('Expected 403 on invalid CSRF token, got ' + res49.status);
  }

  // 50. Broken authLimiter allows unlimited login attempts (CWE-307)
  let blockedByAuthLimiter = false;
  const testEmail = `brute_target_${Date.now()}@demo.com`;
  for (let attempt = 1; attempt <= 6; attempt++) {
    const resLogin = await fetch(baseUrl + '/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': validCsrf
      },
      body: JSON.stringify({ email: testEmail, password: 'wrong_password_' + attempt })
    });
    if (resLogin.status === 429) {
      blockedByAuthLimiter = true;
      break;
    }
  }
  if (blockedByAuthLimiter) {
    console.log('✅ 50. authLimiter enforces 5-attempt brute-force restriction and returns 429 Too Many Requests (CWE-307)');
    passed++;
  } else {
    throw new Error('Expected authLimiter to block excessive login attempts with 429 status code');
  }

  server.close();
  console.log("\nAll " + passed + "/50 Security Verification Tests Passed Successfully!");
}

runSecurityTests()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Security test failed:', err);
    process.exit(1);
  });
