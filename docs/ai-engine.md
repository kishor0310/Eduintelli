# EduIntelli AI Academic Intelligence Engine

## Philosophy
The AI Academic Intelligence Engine is designed to solve the critical "early intervention" bottleneck in higher education. Rather than being a simple conversational bot, the AI is deeply integrated into the analytical pipeline:

$$\text{Data Ingestion} \longrightarrow \text{Normalization} \longrightarrow \text{Multi-Factor Risk Engine} \longrightarrow \text{Explainable Diagnostics} \longrightarrow \text{Prescriptive Action Roadmap}$$

---

## 1. Transparent Risk Score Formulation

The core risk index is computed using a multi-factor formula that mirrors academic retention metrics:

$$\text{Risk Score} = (R_{\text{att}} \times 0.25) + (R_{\text{asgn}} \times 0.20) + (R_{\text{exam}} \times 0.35) + (R_{\text{trend}} \times 0.20)$$

Where:
- **$R_{\text{att}}$ (Attendance Risk)**:
  - If Attendance $\ge 85\% \implies 0$
  - If Attendance between $75\% - 85\% \implies (85 - \text{Att}) \times 3.0$
  - If Attendance $< 75\% \implies 30 + (75 - \text{Att}) \times 2.8$ (Capped at 100)
- **$R_{\text{asgn}}$ (Assignment Risk)**:
  - Based on submission completion rate, average score, and late submission penalty.
  - Formula: $(100 - \text{Avg Score}) \times 0.7 + (\text{Late Count} \times 10) + (\text{Missing Count} \times 20)$
- **$R_{\text{exam}}$ (Exam Risk)**:
  - Direct assessment mastery risk: $\max(0, 100 - \text{Exam Average Score})$
- **$R_{\text{trend}}$ (Performance Trajectory Risk)**:
  - Evaluates slope across sequential assessments:
  - Positive trend (improving $> 5\%$) $\implies 0 - 15$ (risk reduction bonus)
  - Neutral / stable $(\pm 5\%) \implies 20$
  - Declining trend (dropped $> 10\%$) $\implies 60 - 90$

### Risk Classification Thresholds
- **$0 - 30$**: **Low Risk (On Track)** — Demonstrates consistent engagement and academic resilience.
- **$31 - 60$**: **Medium Risk (Needs Attention)** — Shows early warning signals in specific subjects or attendance lapses.
- **$61 - 100$**: **High Risk (Critical Intervention)** — Severe multi-factor risk warranting immediate faculty intervention.

---

## 2. Weak Subject Detection

Evaluates course-wise scores against both the student's personal baseline and the cohort benchmark:
- **High Priority Attention**: Score $< 60\%$ or decline $\ge 15\%$ across past 2 assessments.
- **Medium Priority Attention**: Score between $60\% - 72\%$ or attendance $< 75\%$ for that specific course.
- **Good / Strengths**: Score $\ge 75\%$ with positive velocity.

---

## 3. Explainability Engine: "Why am I at risk?"

Judges and students require complete causal transparency. EduIntelli produces structured diagnostic reasons:
1. "Attendance dropped to 62% in Mathematics (below institutional 75% requirement)."
2. "2 consecutive assignments submitted late in Operating Systems."
3. "Midterm examination score decreased by 18% compared to continuous assessments."

---

## 4. Personalized 7-Day Micro-Action Roadmaps

Generates prioritized, concrete, and achievable study tasks:
- *"Prioritize Mathematics for the next 7 days: Complete 15 calculus practice problems."*
- *"Attend the next 3 Database Systems lectures to raise course attendance above the 75% threshold."*
- *"Submit Operating Systems Assignment 3 by Thursday to avoid late penalty deductions."*

---

## 5. Dual-Mode Architecture (Deterministic + LLM Hybrid)
- **Deterministic Heuristic Engine**: 100% reliable, zero-latency, works offline with seeded metrics for hackathon demos.
- **LLM Synthesis Layer**: When `GEMINI_API_KEY` is provided, integrates with Google Gemini 1.5/2.0 API to generate rich, contextual coaching narratives and customized institutional diagnostic summaries.
