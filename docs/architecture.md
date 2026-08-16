# EduIntelli System Architecture

## Overview
**EduIntelli** is an enterprise-grade Academic Intelligence and Early Intervention platform. Unlike traditional Learning Management Systems (LMS) or Student Information Systems (SIS) that act simply as passive repositories, EduIntelli is an active intelligence layer. It transforms fragmented multi-source academic indicators into continuous risk scoring, weak area diagnostic alerts, and personalized learning interventions.

```
+-------------------------------------------------------------------------------+
|                               EduIntelli Platform                             |
+-------------------------------------------------------------------------------+
|                                                                               |
|  [ Public Portal ]      [ Student Portal ]   [ Teacher Portal ]  [ Admin ]    |
|   Landing, Courses       Risk & Study Plan     Interventions      Institutions|
|                                                                               |
+---------------------------------------+---------------------------------------+
                                        | (REST APIs / JWT RBAC)
                                        v
+-------------------------------------------------------------------------------+
|                            Backend Application Layer                          |
|                       (Node.js + Express + TypeScript)                        |
|                                                                               |
|  +------------------+  +-------------------+  +----------------------------+  |
|  | Auth & Security  |  | Academic Services |  | AI Academic Intelligence   |  |
|  | - JWT Tokens     |  | - Attendance      |  | - Risk Scoring Engine      |  |
|  | - Role Guards    |  | - Assignments     |  | - Performance Analyzer     |  |
|  | - Zod Validator  |  | - Examinations    |  | - Recommendation Engine    |  |
|  +------------------+  +-------------------+  | - Insight Generator        |  |
|                                               +----------------------------+  |
+---------------------------------------+---------------------------------------+
                                        |
                                        v
+-------------------------------------------------------------------------------+
|                            Data Persistence Layer                             |
|                                                                               |
|  PostgreSQL / SQLite Database Adapter (Transactions, Foreign Keys, Indexes)   |
|  - Users (Students, Teachers, Admins)                                         |
|  - Academic Records (Courses, Classes, Attendance, Submissions, Grades)       |
|  - Intelligence Records (Risk Scores, Recommendations, Insights, Audit Logs)  |
+-------------------------------------------------------------------------------+
```

## Data Pipeline: Data -> Analysis -> Risk Detection -> Insights -> Action

1. **Ingestion & Aggregation**: Continuous collection of attendance timestamps, assignment submission scores, deadline variances, and exam grade distribution.
2. **Normalized Performance Analyzer**: Computes standard performance percentiles, rolling GPA differentials, subject-level variances, and velocity metrics.
3. **Transparent Risk Engine**: Computes weighted risk index ($0 - 100$) combining attendance ($25\%$), assignment velocity ($20\%$), examination scores ($35\%$), and trend trajectory ($20\%$).
4. **Explainable AI Insight Synthesizer**: Unpacks the causal contributors behind each student's risk rating (e.g. "Low attendance in Mathematics + 2 overdue assignments").
5. **Actionable Roadmap Generator**: Formulates concrete, time-bounded micro-goals for students, and triggers proactive intervention notifications for teachers.
