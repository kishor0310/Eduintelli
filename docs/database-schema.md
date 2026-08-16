# EduIntelli Database Schema Specification

## Entity Relationship Overview

The database uses a clean, relational 3NF normalized schema designed for PostgreSQL with foreign keys, cascading constraints, and indexed performance lookup queries.

```
 +----------------+          +----------------+          +----------------+
 |     users      | 1------1 |    students    | 1------N |  enrollments   |
 +----------------+          +----------------+          +----------------+
         | 1                         | 1                         | N
         | 1                         |                           | 1
         v                           v                           v
 +----------------+          +----------------+          +----------------+
 |    teachers    | 1------N |   attendance   |          |    courses     |
 +----------------+          +----------------+          +----------------+
         | 1                         | 1                         | 1
         |                           v                           |
         +-----------------N->+----------------+                 |
                              |  assignments   | 1-------------N |
                              +----------------+                 |
                                     | 1                         |
                                     v                           v
                              +----------------+          +----------------+
                              |  submissions   |          |  examinations  |
                              +----------------+          +----------------+
                                     ^                           | 1
                                     | 1                         v
                              +----------------+          +----------------+
                              |  exam_results  | N------1 |  grades        |
                              +----------------+          +----------------+
```

## Primary Entities

1. **`users`**: Core authentication credentials, email, password hash, role (`STUDENT`, `TEACHER`, `ADMIN`), avatar, status, timestamps.
2. **`students`**: Student ID, roll number, department, semester, CGPA, target graduation year, user_id (FK).
3. **`teachers`**: Teacher ID, employee ID, department, specialization, designation, user_id (FK).
4. **`admins`**: Administrator ID, department, user_id (FK).
5. **`courses`**: Code, name, description, credits, department, semester, syllabus JSON, teacher_id (FK), thumbnail.
6. **`classes`**: Class schedule, room, days of week, time slots, course_id (FK).
7. **`enrollments`**: Enrollment ID, student_id (FK), course_id (FK), status, enrolled_at.
8. **`attendance`**: Attendance ID, student_id (FK), course_id (FK), date, status (`PRESENT`, `ABSENT`, `LATE`), remarks.
9. **`assignments`**: Assignment ID, course_id (FK), title, description, max_score, due_date, weightage, attachments.
10. **`submissions`**: Submission ID, assignment_id (FK), student_id (FK), submitted_at, file_url, score, feedback, status (`SUBMITTED`, `GRADED`, `LATE`).
11. **`examinations`**: Examination ID, course_id (FK), name, exam_type (`MIDTERM`, `FINAL`, `QUIZ`), date, max_score, weightage.
12. **`exam_results`**: Result ID, examination_id (FK), student_id (FK), marks_obtained, grade_letter, remarks.
13. **`ai_insights`**: Insight ID, student_id (FK), category, title, description, confidence_score, created_at.
14. **`recommendations`**: Recommendation ID, student_id (FK), course_id (FK), title, action_item, priority (`HIGH`, `MEDIUM`, `LOW`), deadline_days, is_completed.
15. **`notifications`**: Notification ID, user_id (FK), title, message, type (`ALERT`, `RECOMMENDATION`, `SYSTEM`), is_read, created_at.
