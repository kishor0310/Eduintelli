-- EduIntelli Comprehensive Seed Data
-- Seeded for Demo & Hackathon Presentation
-- Password for all demo accounts: Demo@123
-- Hash: $2b$10$u8L71n5BfvGkUaP9v1f1k.c4gU1D5dY7tX2qN0eK9gR8h6yK5i6lW

-- 1. Insert Users (Admin, Teachers, Students)
INSERT INTO users (id, name, email, password_hash, role, avatar_url, phone, status) VALUES
-- Admin
('usr-admin-01', 'Dr. Sarah Jenkins', 'admin@demo.com', '$2b$10$u8L71n5BfvGkUaP9v1f1k.c4gU1D5dY7tX2qN0eK9gR8h6yK5i6lW', 'ADMIN', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150', '+1 555-0100', 'ACTIVE'),

-- Teachers
('usr-teach-01', 'Prof. Alan Turing', 'teacher@demo.com', '$2b$10$u8L71n5BfvGkUaP9v1f1k.c4gU1D5dY7tX2qN0eK9gR8h6yK5i6lW', 'TEACHER', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', '+1 555-0101', 'ACTIVE'),
('usr-teach-02', 'Dr. Evelyn Reed', 'evelyn.reed@demo.com', '$2b$10$u8L71n5BfvGkUaP9v1f1k.c4gU1D5dY7tX2qN0eK9gR8h6yK5i6lW', 'TEACHER', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150', '+1 555-0102', 'ACTIVE'),
('usr-teach-03', 'Prof. Marcus Vance', 'marcus.vance@demo.com', '$2b$10$u8L71n5BfvGkUaP9v1f1k.c4gU1D5dY7tX2qN0eK9gR8h6yK5i6lW', 'TEACHER', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', '+1 555-0103', 'ACTIVE'),
('usr-teach-04', 'Dr. Clara Oswald', 'clara.oswald@demo.com', '$2b$10$u8L71n5BfvGkUaP9v1f1k.c4gU1D5dY7tX2qN0eK9gR8h6yK5i6lW', 'TEACHER', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150', '+1 555-0104', 'ACTIVE'),
('usr-teach-05', 'Prof. Robert Langdon', 'robert.langdon@demo.com', '$2b$10$u8L71n5BfvGkUaP9v1f1k.c4gU1D5dY7tX2qN0eK9gR8h6yK5i6lW', 'TEACHER', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', '+1 555-0105', 'ACTIVE'),

-- Students (Alex Rivera = Default Student Demo, Jordan Hayes = High Risk, Priya = Medium Risk, + 18 more)
('usr-stud-01', 'Alex Rivera', 'student@demo.com', '$2b$10$u8L71n5BfvGkUaP9v1f1k.c4gU1D5dY7tX2qN0eK9gR8h6yK5i6lW', 'STUDENT', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150', '+1 555-0201', 'ACTIVE'),
('usr-stud-02', 'Jordan Hayes', 'jordan.hayes@demo.com', '$2b$10$u8L71n5BfvGkUaP9v1f1k.c4gU1D5dY7tX2qN0eK9gR8h6yK5i6lW', 'STUDENT', 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150', '+1 555-0202', 'ACTIVE'),
('usr-stud-03', 'Priya Sharma', 'priya.sharma@demo.com', '$2b$10$u8L71n5BfvGkUaP9v1f1k.c4gU1D5dY7tX2qN0eK9gR8h6yK5i6lW', 'STUDENT', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', '+1 555-0203', 'ACTIVE'),
('usr-stud-04', 'Liam Chen', 'liam.chen@demo.com', '$2b$10$u8L71n5BfvGkUaP9v1f1k.c4gU1D5dY7tX2qN0eK9gR8h6yK5i6lW', 'STUDENT', 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150', '+1 555-0204', 'ACTIVE'),
('usr-stud-05', 'Emma Watson', 'emma.watson@demo.com', '$2b$10$u8L71n5BfvGkUaP9v1f1k.c4gU1D5dY7tX2qN0eK9gR8h6yK5i6lW', 'STUDENT', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', '+1 555-0205', 'ACTIVE'),
('usr-stud-06', 'Noah Davis', 'noah.davis@demo.com', '$2b$10$u8L71n5BfvGkUaP9v1f1k.c4gU1D5dY7tX2qN0eK9gR8h6yK5i6lW', 'STUDENT', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150', '+1 555-0206', 'ACTIVE'),
('usr-stud-07', 'Sophia Rodriguez', 'sophia.rodriguez@demo.com', '$2b$10$u8L71n5BfvGkUaP9v1f1k.c4gU1D5dY7tX2qN0eK9gR8h6yK5i6lW', 'STUDENT', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150', '+1 555-0207', 'ACTIVE'),
('usr-stud-08', 'Ethan Taylor', 'ethan.taylor@demo.com', '$2b$10$u8L71n5BfvGkUaP9v1f1k.c4gU1D5dY7tX2qN0eK9gR8h6yK5i6lW', 'STUDENT', 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150', '+1 555-0208', 'ACTIVE'),
('usr-stud-09', 'Olivia Martinez', 'olivia.martinez@demo.com', '$2b$10$u8L71n5BfvGkUaP9v1f1k.c4gU1D5dY7tX2qN0eK9gR8h6yK5i6lW', 'STUDENT', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150', '+1 555-0209', 'ACTIVE'),
('usr-stud-10', 'Lucas Anderson', 'lucas.anderson@demo.com', '$2b$10$u8L71n5BfvGkUaP9v1f1k.c4gU1D5dY7tX2qN0eK9gR8h6yK5i6lW', 'STUDENT', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', '+1 555-0210', 'ACTIVE'),
('usr-stud-11', 'Ava Thomas', 'ava.thomas@demo.com', '$2b$10$u8L71n5BfvGkUaP9v1f1k.c4gU1D5dY7tX2qN0eK9gR8h6yK5i6lW', 'STUDENT', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', '+1 555-0211', 'ACTIVE'),
('usr-stud-12', 'Mason Jackson', 'mason.jackson@demo.com', '$2b$10$u8L71n5BfvGkUaP9v1f1k.c4gU1D5dY7tX2qN0eK9gR8h6yK5i6lW', 'STUDENT', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150', '+1 555-0212', 'ACTIVE'),
('usr-stud-13', 'Isabella White', 'isabella.white@demo.com', '$2b$10$u8L71n5BfvGkUaP9v1f1k.c4gU1D5dY7tX2qN0eK9gR8h6yK5i6lW', 'STUDENT', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150', '+1 555-0213', 'ACTIVE'),
('usr-stud-14', 'James Harris', 'james.harris@demo.com', '$2b$10$u8L71n5BfvGkUaP9v1f1k.c4gU1D5dY7tX2qN0eK9gR8h6yK5i6lW', 'STUDENT', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150', '+1 555-0214', 'ACTIVE'),
('usr-stud-15', 'Mia Martin', 'mia.martin@demo.com', '$2b$10$u8L71n5BfvGkUaP9v1f1k.c4gU1D5dY7tX2qN0eK9gR8h6yK5i6lW', 'STUDENT', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', '+1 555-0215', 'ACTIVE'),
('usr-stud-16', 'Benjamin Clark', 'benjamin.clark@demo.com', '$2b$10$u8L71n5BfvGkUaP9v1f1k.c4gU1D5dY7tX2qN0eK9gR8h6yK5i6lW', 'STUDENT', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', '+1 555-0216', 'ACTIVE'),
('usr-stud-17', 'Charlotte Lewis', 'charlotte.lewis@demo.com', '$2b$10$u8L71n5BfvGkUaP9v1f1k.c4gU1D5dY7tX2qN0eK9gR8h6yK5i6lW', 'STUDENT', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150', '+1 555-0217', 'ACTIVE'),
('usr-stud-18', 'Elijah Robinson', 'elijah.robinson@demo.com', '$2b$10$u8L71n5BfvGkUaP9v1f1k.c4gU1D5dY7tX2qN0eK9gR8h6yK5i6lW', 'STUDENT', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', '+1 555-0218', 'ACTIVE'),
('usr-stud-19', 'Amelia Walker', 'amelia.walker@demo.com', '$2b$10$u8L71n5BfvGkUaP9v1f1k.c4gU1D5dY7tX2qN0eK9gR8h6yK5i6lW', 'STUDENT', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', '+1 555-0219', 'ACTIVE'),
('usr-stud-20', 'William Hall', 'william.hall@demo.com', '$2b$10$u8L71n5BfvGkUaP9v1f1k.c4gU1D5dY7tX2qN0eK9gR8h6yK5i6lW', 'STUDENT', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', '+1 555-0220', 'ACTIVE'),
('usr-stud-21', 'Harper Allen', 'harper.allen@demo.com', '$2b$10$u8L71n5BfvGkUaP9v1f1k.c4gU1D5dY7tX2qN0eK9gR8h6yK5i6lW', 'STUDENT', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150', '+1 555-0221', 'ACTIVE');

-- 2. Insert Admins
INSERT INTO admins (id, user_id, department, admin_level) VALUES
('adm-01', 'usr-admin-01', 'Academic Affairs & Quality Assurance', 'SUPER_ADMIN');

-- 3. Insert Teachers
INSERT INTO teachers (id, user_id, employee_id, department, designation, specialization, office_room) VALUES
('tch-01', 'usr-teach-01', 'FAC-CS-101', 'Computer Science & Engineering', 'Professor & HOD', 'Algorithms, AI, Discrete Mathematics', 'Tech Tower 401'),
('tch-02', 'usr-teach-02', 'FAC-CS-102', 'Computer Science & Engineering', 'Associate Professor', 'Operating Systems, Distributed Systems', 'Tech Tower 408'),
('tch-03', 'usr-teach-03', 'FAC-IT-103', 'Information Technology', 'Assistant Professor', 'Database Systems, Cloud Computing', 'IT Block 204'),
('tch-04', 'usr-teach-04', 'FAC-AI-104', 'Artificial Intelligence & Data Science', 'Associate Professor', 'Machine Learning, Neural Networks', 'AI Lab 301'),
('tch-05', 'usr-teach-05', 'FAC-CS-105', 'Computer Science & Engineering', 'Assistant Professor', 'Object Oriented Programming (Java/C++)', 'Tech Tower 312');

-- 4. Insert Students (with realistic academic risk distribution)
INSERT INTO students (id, user_id, roll_number, department, semester, batch, cgpa, academic_risk_score, risk_level) VALUES
('std-01', 'usr-stud-01', 'CS2023-001', 'Computer Science', 4, '2023-2027', 3.85, 14, 'LOW'),
('std-02', 'usr-stud-02', 'CS2023-002', 'Computer Science', 4, '2023-2027', 2.45, 78, 'HIGH'),
('std-03', 'usr-stud-03', 'CS2023-003', 'Computer Science', 4, '2023-2027', 3.20, 46, 'MEDIUM'),
('std-04', 'usr-stud-04', 'AI2023-004', 'AI & Data Science', 4, '2023-2027', 3.92, 9, 'LOW'),
('std-05', 'usr-stud-05', 'IT2023-005', 'Information Technology', 4, '2023-2027', 3.65, 18, 'LOW'),
('std-06', 'usr-stud-06', 'CS2023-006', 'Computer Science', 4, '2023-2027', 2.20, 84, 'HIGH'),
('std-07', 'usr-stud-07', 'AI2023-007', 'AI & Data Science', 4, '2023-2027', 3.10, 52, 'MEDIUM'),
('std-08', 'usr-stud-08', 'IT2023-008', 'Information Technology', 4, '2023-2027', 2.60, 69, 'HIGH'),
('std-09', 'usr-stud-09', 'CS2023-009', 'Computer Science', 4, '2023-2027', 3.75, 16, 'LOW'),
('std-10', 'usr-stud-10', 'AI2023-010', 'AI & Data Science', 4, '2023-2027', 2.80, 58, 'MEDIUM'),
('std-11', 'usr-stud-11', 'CS2023-011', 'Computer Science', 4, '2023-2027', 3.95, 8, 'LOW'),
('std-12', 'usr-stud-12', 'IT2023-012', 'Information Technology', 4, '2023-2027', 2.30, 81, 'HIGH'),
('std-13', 'usr-stud-13', 'CS2023-013', 'Computer Science', 4, '2023-2027', 3.40, 32, 'MEDIUM'),
('std-14', 'usr-stud-14', 'AI2023-014', 'AI & Data Science', 4, '2023-2027', 3.80, 15, 'LOW'),
('std-15', 'usr-stud-15', 'IT2023-015', 'Information Technology', 4, '2023-2027', 3.05, 49, 'MEDIUM'),
('std-16', 'usr-stud-16', 'CS2023-016', 'Computer Science', 4, '2023-2027', 2.15, 88, 'HIGH'),
('std-17', 'usr-stud-17', 'AI2023-017', 'AI & Data Science', 4, '2023-2027', 3.60, 22, 'LOW'),
('std-18', 'usr-stud-18', 'CS2023-018', 'Computer Science', 4, '2023-2027', 2.50, 72, 'HIGH'),
('std-19', 'usr-stud-19', 'IT2023-019', 'Information Technology', 4, '2023-2027', 3.50, 26, 'LOW'),
('std-20', 'usr-stud-20', 'AI2023-020', 'AI & Data Science', 4, '2023-2027', 2.90, 54, 'MEDIUM'),
('std-21', 'usr-stud-21', 'CS2023-021', 'Computer Science', 4, '2023-2027', 3.88, 12, 'LOW');

-- 5. Insert Courses (8 Comprehensive Core & Elective Courses)
INSERT INTO courses (id, code, name, description, credits, department, semester, teacher_id, rating, thumbnail_url, syllabus) VALUES
('crs-01', 'CS401', 'Discrete Mathematics & Graph Theory', 'Fundamental discrete structures, propositional logic, graph theory algorithms, combinatorics, and proof techniques.', 4, 'Computer Science', 4, 'tch-01', 4.9, 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400', 'Module 1: Set Theory & Logic; Module 2: Relations & Functions; Module 3: Graph Traversal Algorithms; Module 4: Combinatorics & Recurrence Relations'),
('crs-02', 'CS402', 'Operating Systems & Concurrency', 'Process management, thread synchronization, memory allocation paging, virtual memory, file systems, and scheduling algorithms.', 4, 'Computer Science', 4, 'tch-02', 4.7, 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400', 'Module 1: OS Kernel Architectures; Module 2: Deadlocks & Semaphores; Module 3: Virtual Memory & Page Faults; Module 4: File Systems & I/O Subsystems'),
('crs-03', 'IT403', 'Database Management Systems', 'Relational data modeling, SQL optimization, ACID transactions, indexing B-trees, concurrency control, and NoSQL fundamentals.', 4, 'Information Technology', 4, 'tch-03', 4.8, 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400', 'Module 1: Relational Algebra & ER Modeling; Module 2: Advanced SQL & Query Plans; Module 3: Transaction Isolation Levels; Module 4: Distributed DBs & Sharding'),
('crs-04', 'AI404', 'Machine Learning & Predictive Modeling', 'Supervised regression, classification, support vector machines, decision tree ensembles, unsupervised clustering, and model validation.', 4, 'AI & Data Science', 4, 'tch-04', 4.9, 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400', 'Module 1: Linear & Logistic Regression; Module 2: Tree-Based Methods & XGBoost; Module 3: Neural Networks & Backprop; Module 4: PCA & Unsupervised Clustering'),
('crs-05', 'CS405', 'Advanced Java & Object Design Patterns', 'Enterprise Java paradigms, concurrency threads, Spring Boot microservices, Gang of Four design patterns, and JVM memory tuning.', 3, 'Computer Science', 4, 'tch-05', 4.6, 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400', 'Module 1: OOP & SOLID Principles; Module 2: Multithreading & Executors; Module 3: Spring Boot REST Architecture; Module 4: Microservice Patterns'),
('crs-06', 'CS406', 'Computer Networks & Security', 'OSI reference model, TCP/IP congestion control, routing protocols (BGP/OSPF), cryptographic fundamentals, and network defense.', 3, 'Computer Science', 4, 'tch-01', 4.8, 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400', 'Module 1: Network Layers & Framing; Module 2: TCP Flow Control; Module 3: Network Security & TLS; Module 4: Firewalling & Intrusion Detection'),
('crs-07', 'AI407', 'Deep Learning & Neural Architectures', 'Convolutional neural networks, recurrent LSTM networks, transformer attention mechanisms, and computer vision / NLP tasks.', 4, 'AI & Data Science', 4, 'tch-04', 4.9, 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400', 'Module 1: PyTorch Tensors & Autograd; Module 2: CNNs for Image Recognition; Module 3: Transformers & Self-Attention; Module 4: Generative Adversarial Networks'),
('crs-08', 'IT408', 'Cloud Computing & DevOps Pipelines', 'Infrastructure as Code (Terraform), Docker containers, Kubernetes orchestration, CI/CD automated deployment, and AWS/GCP architecture.', 3, 'Information Technology', 4, 'tch-03', 4.7, 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400', 'Module 1: Cloud Service Models (IaaS/PaaS); Module 2: Docker Containerization; Module 3: Kubernetes Pods & Deployments; Module 4: Automated CI/CD Pipelines');

-- 6. Insert Classes / Schedules
INSERT INTO classes (id, course_id, section, room_number, day_of_week, start_time, end_time) VALUES
('cls-01', 'crs-01', 'A', 'Room 301', 'Monday', '09:00', '10:30'),
('cls-02', 'crs-01', 'A', 'Room 301', 'Wednesday', '09:00', '10:30'),
('cls-03', 'crs-02', 'A', 'Room 402', 'Tuesday', '11:00', '12:30'),
('cls-04', 'crs-02', 'A', 'Room 402', 'Thursday', '11:00', '12:30'),
('cls-05', 'crs-03', 'A', 'Lab 2', 'Monday', '14:00', '15:30'),
('cls-06', 'crs-03', 'A', 'Lab 2', 'Friday', '14:00', '15:30'),
('cls-07', 'crs-04', 'A', 'AI Lab', 'Tuesday', '14:00', '15:30'),
('cls-08', 'crs-04', 'A', 'AI Lab', 'Thursday', '14:00', '15:30'),
('cls-09', 'crs-05', 'A', 'Room 205', 'Wednesday', '11:00', '12:30'),
('cls-10', 'crs-05', 'A', 'Room 205', 'Friday', '11:00', '12:30');

-- 7. Enroll Students in Courses
-- Student 1 (Alex Rivera)
INSERT INTO enrollments (id, student_id, course_id, status, current_grade, grade_points) VALUES
('enr-01', 'std-01', 'crs-01', 'ENROLLED', 'A', 4.0),
('enr-02', 'std-01', 'crs-02', 'ENROLLED', 'A-', 3.7),
('enr-03', 'std-01', 'crs-03', 'ENROLLED', 'A', 4.0),
('enr-04', 'std-01', 'crs-04', 'ENROLLED', 'A', 4.0),
('enr-05', 'std-01', 'crs-05', 'ENROLLED', 'A+', 4.0);

-- Student 2 (Jordan Hayes - High Risk)
INSERT INTO enrollments (id, student_id, course_id, status, current_grade, grade_points) VALUES
('enr-06', 'std-02', 'crs-01', 'ENROLLED', 'D', 1.0),
('enr-07', 'std-02', 'crs-02', 'ENROLLED', 'C-', 1.7),
('enr-08', 'std-02', 'crs-03', 'ENROLLED', 'C', 2.0),
('enr-09', 'std-02', 'crs-04', 'ENROLLED', 'D+', 1.3),
('enr-10', 'std-02', 'crs-05', 'ENROLLED', 'B-', 2.7);

-- Student 3 (Priya Sharma - Medium Risk)
INSERT INTO enrollments (id, student_id, course_id, status, current_grade, grade_points) VALUES
('enr-11', 'std-03', 'crs-01', 'ENROLLED', 'C+', 2.3),
('enr-12', 'std-03', 'crs-02', 'ENROLLED', 'B', 3.0),
('enr-13', 'std-03', 'crs-03', 'ENROLLED', 'A-', 3.7),
('enr-14', 'std-03', 'crs-04', 'ENROLLED', 'B+', 3.3),
('enr-15', 'std-03', 'crs-05', 'ENROLLED', 'A', 4.0);

-- Enroll remaining students across courses
INSERT INTO enrollments (id, student_id, course_id, status, current_grade, grade_points) VALUES
('enr-16', 'std-04', 'crs-04', 'ENROLLED', 'A+', 4.0),
('enr-17', 'std-04', 'crs-07', 'ENROLLED', 'A', 4.0),
('enr-18', 'std-04', 'crs-01', 'ENROLLED', 'A', 4.0),
('enr-19', 'std-05', 'crs-03', 'ENROLLED', 'A', 4.0),
('enr-20', 'std-05', 'crs-08', 'ENROLLED', 'A-', 3.7),
('enr-21', 'std-06', 'crs-01', 'ENROLLED', 'F', 0.0),
('enr-22', 'std-06', 'crs-02', 'ENROLLED', 'D', 1.0),
('enr-23', 'std-06', 'crs-05', 'ENROLLED', 'C-', 1.7),
('enr-24', 'std-07', 'crs-04', 'ENROLLED', 'B', 3.0),
('enr-25', 'std-07', 'crs-01', 'ENROLLED', 'C', 2.0),
('enr-26', 'std-08', 'crs-03', 'ENROLLED', 'D+', 1.3),
('enr-27', 'std-08', 'crs-08', 'ENROLLED', 'C', 2.0),
('enr-28', 'std-09', 'crs-01', 'ENROLLED', 'A', 4.0),
('enr-29', 'std-09', 'crs-02', 'ENROLLED', 'A-', 3.7),
('enr-30', 'std-10', 'crs-04', 'ENROLLED', 'C+', 2.3),
('enr-31', 'std-11', 'crs-01', 'ENROLLED', 'A+', 4.0),
('enr-32', 'std-12', 'crs-03', 'ENROLLED', 'D', 1.0),
('enr-33', 'std-13', 'crs-02', 'ENROLLED', 'B-', 2.7),
('enr-34', 'std-14', 'crs-04', 'ENROLLED', 'A', 4.0),
('enr-35', 'std-15', 'crs-08', 'ENROLLED', 'B', 3.0),
('enr-36', 'std-16', 'crs-01', 'ENROLLED', 'F', 0.0),
('enr-37', 'std-17', 'crs-04', 'ENROLLED', 'A-', 3.7),
('enr-38', 'std-18', 'crs-02', 'ENROLLED', 'D+', 1.3),
('enr-39', 'std-19', 'crs-03', 'ENROLLED', 'B+', 3.3),
('enr-40', 'std-20', 'crs-07', 'ENROLLED', 'C+', 2.3);

-- 8. Attendance Records (Last 10 sessions per course)
-- Alex Rivera (High attendance ~94%)
INSERT INTO attendance (id, student_id, course_id, date, status, remarks) VALUES
('att-01', 'std-01', 'crs-01', '2025-02-03', 'PRESENT', 'On time'),
('att-02', 'std-01', 'crs-01', '2025-02-05', 'PRESENT', 'Active participation'),
('att-03', 'std-01', 'crs-01', '2025-02-10', 'PRESENT', 'On time'),
('att-04', 'std-01', 'crs-01', '2025-02-12', 'PRESENT', 'On time'),
('att-05', 'std-01', 'crs-01', '2025-02-17', 'ABSENT', 'Informed medical'),
('att-06', 'std-01', 'crs-01', '2025-02-19', 'PRESENT', 'On time'),
('att-07', 'std-01', 'crs-01', '2025-02-24', 'PRESENT', 'Solved whiteboard problem'),
('att-08', 'std-01', 'crs-01', '2025-02-26', 'PRESENT', 'On time'),
('att-09', 'std-01', 'crs-02', '2025-02-04', 'PRESENT', 'On time'),
('att-10', 'std-01', 'crs-02', '2025-02-06', 'PRESENT', 'On time'),
('att-11', 'std-01', 'crs-02', '2025-02-11', 'PRESENT', 'On time'),
('att-12', 'std-01', 'crs-02', '2025-02-13', 'PRESENT', 'Lab completed early'),
('att-13', 'std-01', 'crs-02', '2025-02-18', 'PRESENT', 'On time'),
('att-14', 'std-01', 'crs-03', '2025-02-03', 'PRESENT', 'On time'),
('att-15', 'std-01', 'crs-03', '2025-02-07', 'PRESENT', 'On time');

-- Jordan Hayes (Low Attendance ~62% - Triggering AI Attendance Risk Alert)
INSERT INTO attendance (id, student_id, course_id, date, status, remarks) VALUES
('att-16', 'std-02', 'crs-01', '2025-02-03', 'ABSENT', 'Unexcused absence'),
('att-17', 'std-02', 'crs-01', '2025-02-05', 'PRESENT', 'Late entry 15 mins'),
('att-18', 'std-02', 'crs-01', '2025-02-10', 'ABSENT', 'Unexcused absence'),
('att-19', 'std-02', 'crs-01', '2025-02-12', 'LATE', 'Late entry 20 mins'),
('att-20', 'std-02', 'crs-01', '2025-02-17', 'ABSENT', 'Unexcused absence'),
('att-21', 'std-02', 'crs-01', '2025-02-19', 'PRESENT', 'On time'),
('att-22', 'std-02', 'crs-01', '2025-02-24', 'ABSENT', 'Unexcused absence'),
('att-23', 'std-02', 'crs-01', '2025-02-26', 'PRESENT', 'On time'),
('att-24', 'std-02', 'crs-02', '2025-02-04', 'ABSENT', 'Unexcused absence'),
('att-25', 'std-02', 'crs-02', '2025-02-06', 'PRESENT', 'On time'),
('att-26', 'std-02', 'crs-02', '2025-02-11', 'ABSENT', 'Unexcused absence'),
('att-27', 'std-02', 'crs-02', '2025-02-13', 'LATE', 'Late 10 mins'),
('att-28', 'std-02', 'crs-02', '2025-02-18', 'ABSENT', 'Unexcused absence');

-- Priya Sharma (Attendance ~88%)
INSERT INTO attendance (id, student_id, course_id, date, status, remarks) VALUES
('att-29', 'std-03', 'crs-01', '2025-02-03', 'PRESENT', 'On time'),
('att-30', 'std-03', 'crs-01', '2025-02-05', 'PRESENT', 'On time'),
('att-31', 'std-03', 'crs-01', '2025-02-10', 'ABSENT', 'Informed leave'),
('att-32', 'std-03', 'crs-01', '2025-02-12', 'PRESENT', 'On time'),
('att-33', 'std-03', 'crs-01', '2025-02-17', 'PRESENT', 'On time'),
('att-34', 'std-03', 'crs-01', '2025-02-19', 'PRESENT', 'On time');

-- 9. Assignments
INSERT INTO assignments (id, course_id, title, description, max_score, due_date, weightage, attachment_url) VALUES
('asg-01', 'crs-01', 'Assignment 1: Graph Theory & Shortest Paths', 'Implement Dijkstra and Bellman-Ford algorithms in Python/Java with complexity analysis.', 100, '2025-02-10 23:59:59', 10.00, 'https://docs.eduintelli.com/asg1-graphs.pdf'),
('asg-02', 'crs-01', 'Assignment 2: Recurrence Relations & Induction', 'Prove closed form solutions for 5 algorithmic recurrence relations with formal induction steps.', 100, '2025-02-24 23:59:59', 10.00, 'https://docs.eduintelli.com/asg2-recurrence.pdf'),
('asg-03', 'crs-02', 'Assignment 1: Process Scheduling Simulator', 'Simulate Round Robin, Shortest Job First, and Multi-Level Feedback Queue schedulers.', 100, '2025-02-12 23:59:59', 10.00, 'https://docs.eduintelli.com/asg1-scheduling.pdf'),
('asg-04', 'crs-02', 'Assignment 2: Semaphore Concurrency & Dining Philosophers', 'Solve the Dining Philosophers deadlock problem using POSIX semaphores and mutex locks.', 100, '2025-03-01 23:59:59', 15.00, 'https://docs.eduintelli.com/asg2-semaphores.pdf'),
('asg-05', 'crs-03', 'Assignment 1: Complex SQL Queries & Index Tuning', 'Write complex nested SQL queries for e-commerce analytics and analyze EXPLAIN query execution plans.', 100, '2025-02-15 23:59:59', 10.00, 'https://docs.eduintelli.com/asg1-sql.pdf'),
('asg-06', 'crs-04', 'Assignment 1: Supervised Regression & Gradient Descent', 'Build linear regression from scratch with L2 regularization on real estate pricing dataset.', 100, '2025-02-20 23:59:59', 15.00, 'https://docs.eduintelli.com/asg1-regression.pdf'),
('asg-07', 'crs-05', 'Assignment 1: Spring Boot Microservice Design', 'Build a RESTful microservice with JWT authentication and H2 in-memory caching.', 100, '2025-02-22 23:59:59', 15.00, 'https://docs.eduintelli.com/asg1-springboot.pdf');

-- 10. Submissions
-- Alex Rivera (High scores: 95, 92, 94, 98)
INSERT INTO submissions (id, assignment_id, student_id, submitted_at, file_url, score, feedback, status) VALUES
('sub-01', 'asg-01', 'std-01', '2025-02-09 18:30:00', 'https://uploads.eduintelli.com/alex-asg1.pdf', 96.00, 'Excellent code implementation with clear asymptotic runtime analysis.', 'GRADED'),
('sub-02', 'asg-02', 'std-01', '2025-02-23 20:15:00', 'https://uploads.eduintelli.com/alex-asg2.pdf', 94.00, 'Flawless mathematical induction steps.', 'GRADED'),
('sub-03', 'asg-03', 'std-01', '2025-02-11 14:00:00', 'https://uploads.eduintelli.com/alex-asg3.pdf', 92.00, 'Well structured concurrency loops.', 'GRADED'),
('sub-04', 'asg-05', 'std-01', '2025-02-14 22:00:00', 'https://uploads.eduintelli.com/alex-asg5.pdf', 98.00, 'Outstanding SQL query optimization with covering index.', 'GRADED');

-- Jordan Hayes (Low & Late submissions: 54, 48, missing asg-05)
INSERT INTO submissions (id, assignment_id, student_id, submitted_at, file_url, score, feedback, status) VALUES
('sub-05', 'asg-01', 'std-02', '2025-02-11 02:40:00', 'https://uploads.eduintelli.com/jordan-asg1.pdf', 54.00, 'Submitted late. Implementation contains infinite loops for negative cycle graphs.', 'GRADED'),
('sub-06', 'asg-02', 'std-02', '2025-02-25 08:20:00', 'https://uploads.eduintelli.com/jordan-asg2.pdf', 48.00, 'Submitted 8 hours late. Missing induction base case proofs for questions 3 and 4.', 'GRADED'),
('sub-07', 'asg-03', 'std-02', '2025-02-13 01:10:00', 'https://uploads.eduintelli.com/jordan-asg3.pdf', 58.00, 'Submitted late. Thread synchronization race condition causes starvation.', 'GRADED');

-- Priya Sharma (Scores: 72, 70, 88, 92)
INSERT INTO submissions (id, assignment_id, student_id, submitted_at, file_url, score, feedback, status) VALUES
('sub-08', 'asg-01', 'std-03', '2025-02-10 21:00:00', 'https://uploads.eduintelli.com/priya-asg1.pdf', 72.00, 'Good graph implementation, minor error in Dijkstra heap priority comparator.', 'GRADED'),
('sub-09', 'asg-02', 'std-03', '2025-02-24 19:40:00', 'https://uploads.eduintelli.com/priya-asg2.pdf', 68.00, 'Algebraic simplifications need refinement.', 'GRADED'),
('sub-10', 'asg-05', 'std-03', '2025-02-15 16:30:00', 'https://uploads.eduintelli.com/priya-asg5.pdf', 92.00, 'Very strong understanding of query execution plans.', 'GRADED'),
('sub-11', 'asg-07', 'std-03', '2025-02-22 18:00:00', 'https://uploads.eduintelli.com/priya-asg7.pdf', 95.00, 'Clean Spring Boot architecture with comprehensive unit tests.', 'GRADED');

-- 11. Examinations
INSERT INTO examinations (id, course_id, name, exam_type, exam_date, max_score, weightage, room) VALUES
('exm-01', 'crs-01', 'Midterm Examination: Discrete Mathematics', 'MIDTERM', '2025-02-18', 100.00, 30.00, 'Auditorium A'),
('exm-02', 'crs-02', 'Midterm Examination: Operating Systems', 'MIDTERM', '2025-02-20', 100.00, 30.00, 'Auditorium B'),
('exm-03', 'crs-03', 'Midterm Examination: Database Systems', 'MIDTERM', '2025-02-22', 100.00, 30.00, 'Hall 101'),
('exm-04', 'crs-04', 'Midterm Examination: Machine Learning', 'MIDTERM', '2025-02-25', 100.00, 30.00, 'AI Lab Hall'),
('exm-05', 'crs-05', 'Midterm Examination: Advanced Java', 'MIDTERM', '2025-02-27', 100.00, 30.00, 'Room 205');

-- 12. Examination Results
-- Alex Rivera (High scores)
INSERT INTO exam_results (id, examination_id, student_id, marks_obtained, grade, remarks) VALUES
('res-01', 'exm-01', 'std-01', 94.00, 'A', 'Top 5% score in cohort'),
('res-02', 'exm-02', 'std-01', 89.00, 'A-', 'Solid conceptual grasp'),
('res-03', 'exm-03', 'std-01', 95.00, 'A', 'Exceptional SQL execution'),
('res-04', 'exm-04', 'std-01', 92.00, 'A', 'Strong mathematical formulation'),
('res-05', 'exm-05', 'std-01', 98.00, 'A+', 'Highest score in class');

-- Jordan Hayes (Low exam scores with steep decline)
INSERT INTO exam_results (id, examination_id, student_id, marks_obtained, grade, remarks) VALUES
('res-06', 'exm-01', 'std-02', 48.00, 'D', 'Failed Section B graph theory proofs. 18% decline from continuous assessment.'),
('res-07', 'exm-02', 'std-02', 52.00, 'D+', 'Struggled with memory virtualization and page replacement calculations.'),
('res-08', 'exm-03', 'std-02', 61.00, 'C', 'Marginal pass on relational calculus queries.'),
('res-09', 'exm-04', 'std-02', 50.00, 'D', 'Failed gradient descent derivation.'),
('res-10', 'exm-05', 'std-02', 68.00, 'C+', 'Acceptable syntax knowledge, weak concurrency.');

-- Priya Sharma (Medium scores, weak in Discrete Math, strong in Java)
INSERT INTO exam_results (id, examination_id, student_id, marks_obtained, grade, remarks) VALUES
('res-11', 'exm-01', 'std-03', 62.00, 'C+', 'Needs reinforcement on recurrence relations and graph proofs.'),
('res-12', 'exm-02', 'std-03', 78.00, 'B', 'Good grasp of process scheduling.'),
('res-13', 'exm-03', 'std-03', 90.00, 'A-', 'Strong database indexing performance.'),
('res-14', 'exm-04', 'std-03', 82.00, 'B+', 'Good regression and classification implementation.'),
('res-15', 'exm-05', 'std-03', 94.00, 'A', 'Top-tier Spring Boot design pattern implementation.');

-- Roster results for remaining students (Cohort averages)
INSERT INTO exam_results (id, examination_id, student_id, marks_obtained, grade, remarks) VALUES
('res-16', 'exm-01', 'std-06', 42.00, 'F', 'Critical attention required'),
('res-17', 'exm-01', 'std-09', 91.00, 'A', 'Strong performance'),
('res-18', 'exm-01', 'std-11', 97.00, 'A+', 'Best in class'),
('res-19', 'exm-01', 'std-16', 38.00, 'F', 'Immediate intervention needed'),
('res-20', 'exm-01', 'std-18', 56.00, 'C-', 'Weak graph traversal scores'),
('res-21', 'exm-02', 'std-06', 46.00, 'D', 'Weak semaphore implementation'),
('res-22', 'exm-02', 'std-09', 88.00, 'A-', 'Good understanding'),
('res-23', 'exm-02', 'std-13', 74.00, 'B', 'Consistent progress'),
('res-24', 'exm-02', 'std-18', 50.00, 'D', 'At risk in OS'),
('res-25', 'exm-03', 'std-05', 92.00, 'A', 'Excellent query optimization'),
('res-26', 'exm-03', 'std-08', 58.00, 'D+', 'Struggling with normalization 3NF'),
('res-27', 'exm-03', 'std-12', 49.00, 'D', 'Requires database tutoring'),
('res-28', 'exm-03', 'std-19', 84.00, 'B+', 'Steady progress');

-- 13. AI Academic Insights
INSERT INTO ai_insights (id, student_id, course_id, category, title, description, confidence_score, severity) VALUES
-- Jordan Hayes (High Risk Alerts)
('ins-01', 'std-02', 'crs-01', 'RISK', 'High Academic Risk Detected (Score: 78/100)', 'Significant compound risk: 62% attendance, 2 consecutive late assignments, and an 18% decline in Midterm Discrete Mathematics compared to internal baseline.', 0.96, 'CRITICAL'),
('ins-02', 'std-02', 'crs-01', 'WEAK_SUBJECT', 'Weak Subject: Discrete Mathematics Requires Immediate Focus', 'Average score is 51% (cohort average is 78%). Primary knowledge gaps detected in Graph Proofs and Asymptotic Induction.', 0.94, 'WARNING'),
('ins-03', 'std-02', 'crs-02', 'ATTENDANCE', 'Attendance Threshold Warning: Operating Systems (65%)', 'Course attendance has fallen below the mandatory 75% institutional threshold. 3 consecutive classes missed in February.', 0.98, 'CRITICAL'),

-- Priya Sharma (Medium Risk & Strengths)
('ins-04', 'std-03', 'crs-05', 'STRENGTH', 'Exceptional Mastery: Java Design Patterns (+18% Velocity)', 'Your Java performance improved by 18% this month, ranking in the top 10th percentile of the department.', 0.95, 'POSITIVE'),
('ins-05', 'std-03', 'crs-01', 'WEAK_SUBJECT', 'Attention Recommended: Discrete Mathematics (65% Avg)', 'Discrete Mathematics shows a 12% gap compared to your other technical subjects. Strengthening graph recurrence will boost overall GPA to 3.5+.', 0.91, 'WARNING'),

-- Alex Rivera (High Performer)
('ins-06', 'std-01', NULL, 'PERFORMANCE', 'Sustained Academic Excellence (CGPA: 3.85)', 'Performance trajectory is positive with 94% attendance and 95.8% assessment average across all 5 registered courses.', 0.99, 'POSITIVE'),

-- Institutional / Admin Insights
('ins-07', NULL, 'crs-01', 'INSTITUTIONAL', 'Cohort Alert: Discrete Mathematics Has Lowest Class Average (66.4%)', 'Analysis of 21 student records reveals a 14% higher failure rate in Module 3 Graph Traversal algorithms compared to previous semesters.', 0.93, 'WARNING'),
('ins-08', NULL, NULL, 'INSTITUTIONAL', 'Correlation Detected: Attendance Drop Predicts Exam Failure with 87% Accuracy', 'Students with attendance below 75% exhibit a 3.2x higher probability of scoring below passing marks in Midterm assessments.', 0.97, 'INFO'),
('ins-09', NULL, 'crs-05', 'INSTITUTIONAL', 'Computer Science Department Shows Highest Overall Mastery (84.2%)', 'Java and Database Systems modules demonstrate strong adoption of modern development workflows.', 0.95, 'POSITIVE');

-- 14. Personalized Recommendations
INSERT INTO recommendations (id, student_id, course_id, title, action_item, priority, target_days, is_completed) VALUES
-- Jordan Hayes Action Roadmap
('rec-01', 'std-02', 'crs-01', 'Prioritize Discrete Mathematics Graph Theory', 'Complete 15 practice problems on Dijkstra and Bellman-Ford algorithms before the upcoming Quiz.', 'HIGH', 7, FALSE),
('rec-02', 'std-02', 'crs-01', 'Attend Next 3 Mathematics Lectures', 'Attend classes on Monday and Wednesday without absence to raise attendance from 62% towards 70%.', 'HIGH', 10, FALSE),
('rec-03', 'std-02', 'crs-02', 'Complete OS Assignment 2 Before Deadline', 'Submit the Dining Philosophers semaphore assignment before Friday to prevent late deduction penalties.', 'HIGH', 4, FALSE),
('rec-04', 'std-02', 'crs-03', 'Practice 20 Database SQL Queries', 'Complete module exercises on 3NF Normalization and Nested Aggregation.', 'MEDIUM', 14, FALSE),

-- Priya Sharma Action Roadmap
('rec-05', 'std-03', 'crs-01', 'Focus on Recurrence Proofs for 5 Days', 'Review inductive step proofs in Chapter 4 of Discrete Mathematics syllabus.', 'MEDIUM', 5, FALSE),
('rec-06', 'std-03', 'crs-04', 'Machine Learning Ensemble Workshop', 'Review Random Forest hyperparameter tuning exercises to push grade from B+ to A.', 'LOW', 10, TRUE),

-- Alex Rivera Roadmap
('rec-07', 'std-01', 'crs-04', 'Explore Research Paper on Transformer Attention', 'Read Vaswani et al. Attention Is All You Need as elective preparation for AI honors.', 'LOW', 14, FALSE);

-- 15. System & Intervention Notifications
INSERT INTO notifications (id, user_id, title, message, type, is_read, link) VALUES
('notif-01', 'usr-stud-02', 'Early Academic Risk Alert', 'Your academic risk score has reached 78/100. Review your 7-day personalized improvement plan.', 'ALERT', FALSE, '/student/dashboard'),
('notif-02', 'usr-stud-02', 'Teacher Intervention Triggered', 'Prof. Alan Turing has scheduled an academic mentoring session regarding Discrete Mathematics.', 'INTERVENTION', FALSE, '/student/dashboard'),
('notif-03', 'usr-teach-01', '7 Students Require Immediate Intervention', 'Discrete Mathematics (CS401) has 7 students with high/medium academic risk following the Midterm Exam.', 'ALERT', FALSE, '/teacher/dashboard'),
('notif-04', 'usr-stud-03', 'AI Insight: Java Performance Milestone', 'Congratulations! Your Java assessment score was in the top 10% of the class.', 'GRADE', TRUE, '/student/dashboard'),
('notif-05', 'usr-admin-01', 'Monthly Academic Intelligence Audit Ready', 'Institutional health report ready: 87% early risk detection rate achieved across 21 enrolled students.', 'SYSTEM', FALSE, '/admin/dashboard');
