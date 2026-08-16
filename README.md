# EduIntelli — AI-Powered Academic Intelligence Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React_18-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Recharts](https://img.shields.io/badge/Recharts-22b5bf?style=flat&logo=d3.js&logoColor=white)](https://recharts.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **"Turn Academic Data Into Better Decisions."**  
> EduIntelli is an enterprise-grade Academic Intelligence and Early-Intervention Platform that converts raw, fragmented academic data (attendance, assignments, examinations, course metrics, and historical velocity) into a continuous predictive intelligence layer: **Data → Analysis → Risk Detection → Explainable Insights → Personalized Action**.

---

## 1. The Core Problem
In traditional institutions, critical academic signals are fragmented across disconnected systems:
- Attendance registers
- Assignment submission portals
- Midterm / examination gradebooks
- Course management systems
- Faculty feedback logs

Because this data remains siloed, students often realize they are in danger of failing only **after** semester exams occur. Teachers and deans lack a unified predictive early-warning layer to identify at-risk students before irreversible dropouts or debarments happen.

---

## 2. Our Solution
EduIntelli replaces passive record-keeping with an **Active Academic Intelligence Layer**:
- **What is happening with this student?** $\rightarrow$ Real-time Multi-Factor Risk Index ($0 - 100$).
- **Why is it happening?** $\rightarrow$ Fully explainable causal reasons (e.g. *Attendance dropped to 62% in Mathematics + 2 overdue assignments*).
- **What should the student do next?** $\rightarrow$ Time-bounded 7-day personalized micro-action plans.
- **Which students require faculty intervention?** $\rightarrow$ 1-click teacher mentoring and academic alert dispatch.

---

## 3. AI Academic Intelligence Architecture

```
Academic Ingestion (Attendance, Assignments, Exams, Trajectory)
                       │
                       ▼
       ┌───────────────────────────────┐
       │     Normalization Engine      │
       └───────────────┬───────────────┘
                       │
                       ▼
       ┌───────────────────────────────┐
       │   Multi-Factor Risk Engine    │
       │   - Attendance Risk (25%)     │
       │   - Assignment Risk (20%)     │
       │   - Examination Risk (35%)    │
       │   - Velocity Trajectory (20%) │
       └───────────────┬───────────────┘
                       │
                       ▼
       ┌───────────────────────────────┐
       │ Weak Subject Detection Matrix │
       │ (High Priority / Medium / OK) │
       └───────────────┬───────────────┘
                       │
                       ▼
       ┌───────────────────────────────┐
       │  Explainable Insight & Action │
       │  - "Why am I at risk?"        │
       │  - 7-Day Study Priorities     │
       │  - Faculty Intervention Alert │
       └───────────────────────────────┘
```

### Transparent Scoring Formulation
$$\text{Risk Score} = (R_{\text{att}} \times 0.25) + (R_{\text{asgn}} \times 0.20) + (R_{\text{exam}} \times 0.35) + (R_{\text{trend}} \times 0.20) + P_{\text{compound}}$$

- **$0 - 30$ (Low Risk / On Track)**: Demonstrates consistent mastery, attendance $>85\%$, and positive momentum.
- **$31 - 60$ (Medium Risk / Action Needed)**: Shows subject-specific deficits or attendance warning signals.
- **$61 - 100$ (High Risk / Critical Intervention)**: Severe compounding deficits requiring immediate faculty intervention.

*Notice: Configurable heuristic engine designed as an academic-support indicator.*

---

## 4. Key Differentiators & Features

### 🎓 Student Portal
- **Interactive Risk Score Circular Gauge** with 4-factor contribution breakdown.
- **"Why Am I At Risk?" Modal** with complete causal reasoning and mathematical formula.
- **5-Month Longitudinal Trajectory Line Chart** tracking attendance vs mastery.
- **Course Mastery vs Cohort Radar Chart** benchmarked against class percentiles.
- **Personalized 7-Day Action Roadmap** with interactive completion checkboxes & confetti celebrations.
- **Official Printable & PDF Performance Dossier** with institutional watermarks and cryptographic verification hashes.

### 👩‍🏫 Faculty & Teacher Portal
- **Class Health KPI Matrix**: Total enrolled, average attendance %, class average marks %, students at risk count.
- **Student Risk Distribution Donut Chart** (Low, Medium, High).
- **Actionable At-Risk Student Roster** with 1-click **"Intervene"** modal (triggers Academic Alerts, Study Plans, or 1-on-1 Office Hour Meetings).
- **1-Click Bulk Attendance Marker** with live Present/Late/Absent counters.
- **Assignment Grading Workbench** with scoring criteria and pedagogical feedback.

### 🏛️ Administrator & Institutional Governance
- **Campus Executive Analytics**: Total students, faculty, active courses, average GPA, retention success rate.
- **Cross-Department Comparative Bar Chart** (Computer Science vs AI & Data Science vs IT).
- **Course Failure Probability Benchmark Table** identifying curriculums requiring supplemental TA support.
- **AI Institutional Directives & Policy Alerts**.

---

## 5. Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide React, Recharts, Canvas Confetti.
- **Backend**: Node.js, Express, TypeScript, Zod, JWT, Bcryptjs.
- **Database**: PostgreSQL & embedded zero-dependency SQLite adapter (automatic schema creation and seeding).
- **AI Engine**: Modular statistical heuristic engine + Google Gemini 1.5 LLM hybrid synthesis.

---

## 6. Project Folder Structure

```
edu-intelli/
├── README.md
├── .gitignore
├── .env.example
├── package.json
├── docker-compose.yml
├── docs/
│   ├── architecture.md
│   ├── api-documentation.md
│   ├── database-schema.md
│   └── ai-engine.md
├── frontend/
│   ├── package.json
│   ├── vite.config.ts
│   └── src/
│       ├── components/ (ui, charts, ai, forms, common)
│       ├── pages/ (Home, Student, Teacher, Admin, Courses, Attendance, Assignments, Exams, Reports, Auth)
│       ├── layouts/
│       ├── context/
│       ├── services/
│       └── types/
├── backend/
│   ├── package.json
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── routes/
│       ├── services/ai/ (riskEngine.ts, performanceAnalyzer.ts, recommendationEngine.ts, insightGenerator.ts, aiService.ts)
│       └── database/ (db.ts, seedRunner.ts)
├── database/
│   ├── schema.sql
│   ├── seed.sql
│   └── migrations/
└── tests/
    ├── backend/
    └── ai/
```

---

## 7. Quick Start & Installation

### Prerequisites
- Node.js (v18+) and npm (v9+)

### Installation
```bash
# 1. Clone repository
git clone https://github.com/your-org/edu-intelli.git
cd edu-intelli

# 2. Install dependencies across monorepo
npm install
cd backend && npm install
cd ../frontend && npm install
cd ..

# 3. Seed database (Initializes 21 realistic students, 5 teachers, 8 courses, attendance, & grades)
npm run seed --workspace=backend

# 4. Start Full-Stack Application (Backend on :5000 + Frontend on :5173)
npm run dev
```

Visit **`http://localhost:5173`** in your browser!

---

## 8. Demo Accounts & 1-Click Judge Switcher

EduIntelli comes pre-loaded with realistic academic datasets and a **Persistent Top Demo Switcher Bar**:

| Role | Persona | Email | Password | Academic Profile |
| :--- | :--- | :--- | :--- | :--- |
| **Student (Low Risk)** | Alex Rivera | `student@demo.com` | `Demo@123` | CGPA 3.85 • 94% Att • Risk 12/100 (On Track) |
| **Student (At-Risk)** | Jordan Hayes | `jordan.hayes@demo.com` | `Demo@123` | CGPA 2.45 • 62% Att • Risk 69/100 (Critical Intervention) |
| **Student (Medium Risk)** | Priya Sharma | `priya.sharma@demo.com` | `Demo@123` | CGPA 3.20 • 88% Att • Risk 46/100 (Math Deficit) |
| **Teacher / Faculty** | Prof. Alan Turing | `teacher@demo.com` | `Demo@123` | HOD CS • Discrete Mathematics & Graph Theory |
| **Administrator** | Dr. Sarah Jenkins | `admin@demo.com` | `Demo@123` | Dean of Academic Affairs & QA |

---

## 9. 3-Minute Hackathon Judge Presentation Flow

1. **Step 1 — Landing Page (`/`)**: Show hero banner *"Turn Academic Data Into Better Decisions"*, the 5-stage continuous intelligence pipeline, and platform visibility metrics.
2. **Step 2 — Student Dashboard (`/student/dashboard`)**: Click **"Student: Jordan (High Risk)"** in the top demo bar $\rightarrow$ Point out the radial Risk Gauge ($69/100$), attendance warning ($62\%$), and weak subject flags in Discrete Mathematics.
3. **Step 3 — Explainable AI Diagnostic**: Click **"Why am I at risk?"** $\rightarrow$ Show the exact causal diagnostic reasons and transparent mathematical formula breakdown.
4. **Step 4 — 7-Day Action Plan**: Show the prescribed micro-action items $\rightarrow$ Click checkbox to complete a study goal with confetti celebration.
5. **Step 5 — Teacher Command Center (`/teacher/dashboard`)**: Switch to **"Teacher Portal"** $\rightarrow$ Inspect the **"Students Requiring Attention"** table $\rightarrow$ Click **"Intervene"** for Jordan Hayes $\rightarrow$ Dispatch a 1-on-1 mentoring alert.
6. **Step 6 — Institutional Analytics (`/admin/dashboard`)**: Switch to **"Admin Portal"** $\rightarrow$ Inspect cross-department comparative bar charts and course failure risk indexes.
7. **Step 7 — Performance Dossier (`/reports`)**: Click **"Report"** $\rightarrow$ Display the official verifiable academic transcript ready for print / PDF download.

---

## 10. Future Scope

- **LMS & SIS Integrations**: Native bi-directional sync with Canvas, Moodle, and Google Classroom.
- **Multimodal Early Dropout Predictor**: Ingesting library access swipes and digital campus engagement logs.
- **Parent & Guardian Companion Portal**: Opt-in SMS/WhatsApp alerts for attendance threshold warnings.
- **Cross-Institution Benchmarking**: Anonymized accreditation percentile scoring.

---

## License
Distributed under the MIT License. See `LICENSE` for more information.
