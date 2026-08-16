-- EduIntelli Database Schema (PostgreSQL & SQLite Compatible)
-- Created for AI-Powered Academic Intelligence Platform

-- Drop tables in reverse dependency order if exist
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS recommendations;
DROP TABLE IF EXISTS ai_insights;
DROP TABLE IF EXISTS exam_results;
DROP TABLE IF EXISTS examinations;
DROP TABLE IF EXISTS submissions;
DROP TABLE IF EXISTS assignments;
DROP TABLE IF EXISTS attendance;
DROP TABLE IF EXISTS enrollments;
DROP TABLE IF EXISTS classes;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS admins;
DROP TABLE IF EXISTS teachers;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS users;

-- 1. Users Table (Core Auth & Account Entities)
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('STUDENT', 'TEACHER', 'ADMIN')),
    avatar_url VARCHAR(255),
    phone VARCHAR(30),
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Students Table
CREATE TABLE students (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) UNIQUE NOT NULL,
    roll_number VARCHAR(50) UNIQUE NOT NULL,
    department VARCHAR(100) NOT NULL,
    semester INTEGER NOT NULL DEFAULT 1,
    batch VARCHAR(20) NOT NULL,
    cgpa NUMERIC(3, 2) DEFAULT 0.00,
    academic_risk_score INTEGER DEFAULT 0,
    risk_level VARCHAR(20) DEFAULT 'LOW' CHECK (risk_level IN ('LOW', 'MEDIUM', 'HIGH')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Teachers Table
CREATE TABLE teachers (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) UNIQUE NOT NULL,
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    department VARCHAR(100) NOT NULL,
    designation VARCHAR(100) NOT NULL,
    specialization VARCHAR(200),
    office_room VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Admins Table
CREATE TABLE admins (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) UNIQUE NOT NULL,
    department VARCHAR(100) DEFAULT 'Academic Affairs',
    admin_level VARCHAR(50) DEFAULT 'SUPER_ADMIN',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 5. Courses Table
CREATE TABLE courses (
    id VARCHAR(36) PRIMARY KEY,
    code VARCHAR(30) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    credits INTEGER NOT NULL DEFAULT 3,
    department VARCHAR(100) NOT NULL,
    semester INTEGER NOT NULL,
    teacher_id VARCHAR(36),
    rating NUMERIC(2, 1) DEFAULT 4.8,
    thumbnail_url VARCHAR(255),
    syllabus TEXT,
    FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE SET NULL
);

-- 6. Classes / Schedules Table
CREATE TABLE classes (
    id VARCHAR(36) PRIMARY KEY,
    course_id VARCHAR(36) NOT NULL,
    section VARCHAR(10) NOT NULL DEFAULT 'A',
    room_number VARCHAR(50) NOT NULL,
    day_of_week VARCHAR(20) NOT NULL,
    start_time VARCHAR(10) NOT NULL,
    end_time VARCHAR(10) NOT NULL,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- 7. Course Enrollments Table
CREATE TABLE enrollments (
    id VARCHAR(36) PRIMARY KEY,
    student_id VARCHAR(36) NOT NULL,
    course_id VARCHAR(36) NOT NULL,
    status VARCHAR(20) DEFAULT 'ENROLLED',
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    current_grade VARCHAR(5) DEFAULT 'A',
    grade_points NUMERIC(3, 2) DEFAULT 4.0,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    UNIQUE (student_id, course_id)
);

-- 8. Attendance Records Table
CREATE TABLE attendance (
    id VARCHAR(36) PRIMARY KEY,
    student_id VARCHAR(36) NOT NULL,
    course_id VARCHAR(36) NOT NULL,
    date DATE NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('PRESENT', 'ABSENT', 'LATE')),
    remarks VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- 9. Assignments Table
CREATE TABLE assignments (
    id VARCHAR(36) PRIMARY KEY,
    course_id VARCHAR(36) NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    max_score INTEGER NOT NULL DEFAULT 100,
    due_date TIMESTAMP NOT NULL,
    weightage NUMERIC(4, 2) DEFAULT 10.00,
    attachment_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- 10. Assignment Submissions Table
CREATE TABLE submissions (
    id VARCHAR(36) PRIMARY KEY,
    assignment_id VARCHAR(36) NOT NULL,
    student_id VARCHAR(36) NOT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    file_url VARCHAR(255),
    submission_text TEXT,
    score NUMERIC(5, 2),
    feedback TEXT,
    status VARCHAR(20) DEFAULT 'SUBMITTED' CHECK (status IN ('SUBMITTED', 'GRADED', 'LATE', 'RESUBMISSION_REQUIRED')),
    FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    UNIQUE (assignment_id, student_id)
);

-- 11. Examinations Table
CREATE TABLE examinations (
    id VARCHAR(36) PRIMARY KEY,
    course_id VARCHAR(36) NOT NULL,
    name VARCHAR(150) NOT NULL,
    exam_type VARCHAR(50) NOT NULL CHECK (exam_type IN ('MIDTERM', 'FINAL', 'INTERNAL_ASSESSMENT', 'QUIZ')),
    exam_date DATE NOT NULL,
    max_score NUMERIC(5, 2) NOT NULL DEFAULT 100.00,
    weightage NUMERIC(4, 2) NOT NULL DEFAULT 30.00,
    room VARCHAR(50),
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- 12. Examination Results Table
CREATE TABLE exam_results (
    id VARCHAR(36) PRIMARY KEY,
    examination_id VARCHAR(36) NOT NULL,
    student_id VARCHAR(36) NOT NULL,
    marks_obtained NUMERIC(5, 2) NOT NULL,
    grade VARCHAR(5),
    remarks VARCHAR(255),
    FOREIGN KEY (examination_id) REFERENCES examinations(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    UNIQUE (examination_id, student_id)
);

-- 13. AI Academic Insights Table
CREATE TABLE ai_insights (
    id VARCHAR(36) PRIMARY KEY,
    student_id VARCHAR(36),
    course_id VARCHAR(36),
    category VARCHAR(50) NOT NULL CHECK (category IN ('PERFORMANCE', 'RISK', 'WEAK_SUBJECT', 'ATTENDANCE', 'STRENGTH', 'INSTITUTIONAL')),
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    confidence_score NUMERIC(3, 2) DEFAULT 0.95,
    severity VARCHAR(20) DEFAULT 'INFO' CHECK (severity IN ('INFO', 'WARNING', 'CRITICAL', 'POSITIVE')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE SET NULL
);

-- 14. Personalized Recommendations Table
CREATE TABLE recommendations (
    id VARCHAR(36) PRIMARY KEY,
    student_id VARCHAR(36) NOT NULL,
    course_id VARCHAR(36),
    title VARCHAR(200) NOT NULL,
    action_item TEXT NOT NULL,
    priority VARCHAR(20) NOT NULL CHECK (priority IN ('HIGH', 'MEDIUM', 'LOW')),
    target_days INTEGER DEFAULT 7,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE SET NULL
);

-- 15. System & Intervention Notifications Table
CREATE TABLE notifications (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(30) DEFAULT 'ALERT' CHECK (type IN ('ALERT', 'RECOMMENDATION', 'INTERVENTION', 'SYSTEM', 'GRADE')),
    is_read BOOLEAN DEFAULT FALSE,
    link VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for lightning fast queries & analytics
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_students_user ON students(user_id);
CREATE INDEX idx_teachers_user ON teachers(user_id);
CREATE INDEX idx_enrollments_student ON enrollments(student_id);
CREATE INDEX idx_enrollments_course ON enrollments(course_id);
CREATE INDEX idx_attendance_student_course ON attendance(student_id, course_id, date);
CREATE INDEX idx_submissions_assignment ON submissions(assignment_id);
CREATE INDEX idx_submissions_student ON submissions(student_id);
CREATE INDEX idx_exam_results_student ON exam_results(student_id);
CREATE INDEX idx_recommendations_student ON recommendations(student_id);
CREATE INDEX idx_ai_insights_student ON ai_insights(student_id);
