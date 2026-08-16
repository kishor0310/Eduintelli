# EduIntelli REST API Documentation

Base URL: `/api`

## Authentication & Identity

### `POST /api/auth/login`
- **Request**: `{ "email": "student@demo.com", "password": "Password@123" }`
- **Response**: `{ "success": true, "token": "jwt_token_string", "user": { "id": "uuid", "email": "student@demo.com", "role": "STUDENT", "name": "Alex Rivera" } }`

### `POST /api/auth/register`
- **Request**: `{ "name": "...", "email": "...", "password": "...", "role": "STUDENT" | "TEACHER" }`
- **Response**: `{ "success": true, "user": { ... }, "token": "..." }`

### `GET /api/auth/me`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: User profile data with role-specific associations.

---

## Student Endpoints

### `GET /api/students/:id/profile`
- Returns full student profile, department, semester, GPA, enrolled courses.

### `GET /api/students/:id/dashboard`
- Aggregates top KPIs (GPA, Attendance %, Assignment Avg, Exam Avg, Risk Score), monthly trends, weak areas, study priorities.

### `GET /api/students/:id/performance`
- Historical and course-wise marks breakdown with comparison against class averages.

### `GET /api/students/:id/report`
- Structured payload designed for performance report rendering and PDF export.

---

## Teacher Endpoints

### `GET /api/teachers/:id/dashboard`
- Class health metrics, total students, average attendance, student risk distribution, weak subject alerts.

### `GET /api/teachers/:id/students-at-risk`
- Filtered roster of high and medium risk students requiring teacher intervention.

### `POST /api/teachers/intervene`
- **Request**: `{ "studentId": "...", "courseId": "...", "actionType": "ACADEMIC_ALERT" | "STUDY_PLAN" | "MEETING_REQUEST", "notes": "..." }`
- Triggers alert notification to student and logs audit record.

---

## Academic Modules

### `GET /api/attendance` & `POST /api/attendance/mark`
- Mark roster attendance (`PRESENT`, `ABSENT`, `LATE`) for a specific date and course.

### `GET /api/assignments` & `POST /api/assignments` & `POST /api/assignments/:id/submit` & `POST /api/assignments/:id/grade`
- Manage assignments, upload submissions, review submissions, assign marks and feedback.

### `GET /api/examinations` & `POST /api/examinations` & `POST /api/examinations/:id/results`
- Schedule exams and record student scores.

---

## AI Academic Intelligence Endpoints

### `GET /api/ai/risk/:studentId`
- Calculates multi-factor risk score ($0-100$), classification (`LOW`, `MEDIUM`, `HIGH`), and factor weight breakdown.

### `GET /api/ai/insights/:studentId`
- Explainable reasons ("Why am I at risk?") + Positive reinforcement highlights.

### `GET /api/ai/recommendations/:studentId`
- Actionable prioritized 7-day study plan.

### `GET /api/ai/institutional-insights`
- Executive level macro analytics across departments, course failure risks, and trend patterns.
