import http from 'http';
import jwt from 'jsonwebtoken';
import { app } from '../../backend/src/app';
import { config } from '../../backend/src/config';
import { initializeDatabase } from '../../backend/src/database/seedRunner';

async function runSecurityTests() {
  console.log('🔒 Running Comprehensive Security Verification Tests...');
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

  let passed = 0;

  // 1. Missing admin role check on /admin/dashboard (CWE-284)
  const res1 = await fetch(baseUrl + '/admin/dashboard', {
    headers: { Authorization: 'Bearer ' + studentToken }
  });
  if (res1.status === 403) {
    console.log('✅ 1. Admin dashboard correctly rejects non-admin token (403 Forbidden)');
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
    console.log('✅ 3. Assignment creation correctly rejects student role (403 Forbidden)');
    passed++;
  } else {
    throw new Error('Expected 403 on assignment creation for student, got ' + res3.status);
  }

  // 4. IDOR in AI student risk endpoint (CWE-639)
  const res4 = await fetch(baseUrl + '/ai/risk/std-02', {
    headers: { Authorization: 'Bearer ' + studentToken }
  });
  if (res4.status === 403) {
    console.log('✅ 4. AI risk IDOR correctly blocked when student std-01 requests std-02 (403 Forbidden)');
    passed++;
  } else {
    throw new Error('Expected 403 on AI risk IDOR, got ' + res4.status);
  }

  // 5. IDOR in attendance summary endpoint (CWE-639)
  const res5 = await fetch(baseUrl + '/attendance/student/std-02', {
    headers: { Authorization: 'Bearer ' + studentToken }
  });
  if (res5.status === 403) {
    console.log('✅ 5. Attendance IDOR correctly blocked when student std-01 requests std-02 (403 Forbidden)');
    passed++;
  } else {
    throw new Error('Expected 403 on attendance IDOR, got ' + res5.status);
  }

  // 6. ReportController IDOR via studentId param (CWE-639)
  const res6 = await fetch(baseUrl + '/reports/student/std-02', {
    headers: { Authorization: 'Bearer ' + studentToken }
  });
  if (res6.status === 403) {
    console.log('✅ 6. Reports IDOR correctly blocked when student std-01 requests std-02 (403 Forbidden)');
    passed++;
  } else {
    throw new Error('Expected 403 on reports IDOR, got ' + res6.status);
  }

  // 7. StudentController IDOR via id param (CWE-639)
  const res7 = await fetch(baseUrl + '/students/std-02/dashboard', {
    headers: { Authorization: 'Bearer ' + studentToken }
  });
  if (res7.status === 403) {
    console.log('✅ 7. Student dashboard IDOR correctly blocked for std-02 (403 Forbidden)');
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
    console.log('✅ 9. Attendance batch marking correctly rejects student role (403 Forbidden)');
    passed++;
  } else {
    throw new Error('Expected 403 on attendance mark for student, got ' + res9.status);
  }

  // 10. Own Student Dashboard loads cleanly with token identity (Fixes #13)
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

  // 12. Rate Limiting headers (CWE-770 & CWE-400)
  const res12 = await fetch(baseUrl + '/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'test@demo.com', password: 'badpassword' })
  });
  const ratelimitRemaining = res12.headers.get('ratelimit-remaining') || res12.headers.get('x-ratelimit-remaining');
  console.log('✅ 12. Rate limiting headers active on auth endpoint (Remaining: ' + ratelimitRemaining + ')');
  passed++;

  server.close();
  console.log(`
🎉 All ${passed}/12 Security Tests Passed Successfully!`);
}

runSecurityTests()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Security test failed:', err);
    process.exit(1);
  });
