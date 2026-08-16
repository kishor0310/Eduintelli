import { db } from '../../database/db';
import { RiskEngine, StudentAcademicRawData } from './riskEngine';
import { PerformanceAnalyzer, CoursePerformanceInput } from './performanceAnalyzer';
import { RecommendationEngine } from './recommendationEngine';
import { InsightGenerator } from './insightGenerator';
import { RiskAnalysis, WeakSubjectAnalysis, AIInsight, Recommendation } from '../../models/types';
import { config } from '../../config';

export class AIService {
  /**
   * Fetch full student academic raw records from DB and compute complete intelligence layer.
   */
  public static async analyzeStudent(studentId: string): Promise<{
    risk: RiskAnalysis;
    weakSubjects: WeakSubjectAnalysis[];
    recommendations: Partial<Recommendation>[];
    insights: Partial<AIInsight>[];
  }> {
    // 1. Fetch Student Profile
    const student = await db.get<{
      id: string;
      name: string;
      roll_number: string;
      department: string;
      cgpa: number;
    }>(
      `SELECT s.id, u.name, s.roll_number, s.department, s.cgpa
       FROM students s
       JOIN users u ON s.user_id = u.id
       WHERE s.id = $1`,
      [studentId]
    );

    if (!student) {
      throw new Error(`Student ${studentId} not found`);
    }

    // 2. Fetch Enrolled Courses
    const courses = await db.query<{
      id: string;
      code: string;
      name: string;
    }>(
      `SELECT c.id, c.code, c.name
       FROM enrollments e
       JOIN courses c ON e.course_id = c.id
       WHERE e.student_id = $1`,
      [studentId]
    );

    // 3. Aggregate Attendance per course and overall
    const attendanceRecords = await db.query<{
      course_id: string;
      status: string;
      count: number;
    }>(
      `SELECT course_id, status, COUNT(*) as count
       FROM attendance
       WHERE student_id = $1
       GROUP BY course_id, status`,
      [studentId]
    );

    let totalAttendanceRecords = 0;
    let presentCount = 0;
    let absentCount = 0;
    let lateCount = 0;

    const courseAttendanceMap: Record<string, { present: number; total: number }> = {};

    courses.forEach(c => {
      courseAttendanceMap[c.id] = { present: 0, total: 0 };
    });

    attendanceRecords.forEach(r => {
      const cnt = Number(r.count);
      totalAttendanceRecords += cnt;
      if (r.status === 'PRESENT') {
        presentCount += cnt;
        if (courseAttendanceMap[r.course_id]) {
          courseAttendanceMap[r.course_id].present += cnt;
          courseAttendanceMap[r.course_id].total += cnt;
        }
      } else if (r.status === 'ABSENT') {
        absentCount += cnt;
        if (courseAttendanceMap[r.course_id]) {
          courseAttendanceMap[r.course_id].total += cnt;
        }
      } else if (r.status === 'LATE') {
        lateCount += cnt;
        // Late counts as 0.75 attendance
        presentCount += cnt * 0.75;
        if (courseAttendanceMap[r.course_id]) {
          courseAttendanceMap[r.course_id].present += cnt * 0.75;
          courseAttendanceMap[r.course_id].total += cnt;
        }
      }
    });

    const overallAttendancePct = totalAttendanceRecords > 0
      ? (presentCount / totalAttendanceRecords) * 100
      : 88;

    // 4. Aggregate Assignments & Submissions
    const submissions = await db.query<{
      assignment_id: string;
      course_id: string;
      score: number;
      status: string;
    }>(
      `SELECT s.assignment_id, a.course_id, s.score, s.status
       FROM submissions s
       JOIN assignments a ON s.assignment_id = a.id
       WHERE s.student_id = $1`,
      [studentId]
    );

    const totalAvailableAssignments = await db.get<{ count: number }>(
      `SELECT COUNT(*) as count FROM assignments a
       JOIN enrollments e ON a.course_id = e.course_id
       WHERE e.student_id = $1`,
      [studentId]
    );

    const totalAsgn = totalAvailableAssignments ? Number(totalAvailableAssignments.count) : submissions.length;
    const submittedAsgn = submissions.length;
    const missingAsgn = Math.max(0, totalAsgn - submittedAsgn);
    const lateSubmissions = submissions.filter(s => s.status === 'LATE').length;

    const assignmentScores = submissions.filter(s => s.score !== null).map(s => Number(s.score));
    const avgAssignmentScore = assignmentScores.length > 0
      ? assignmentScores.reduce((a, b) => a + b, 0) / assignmentScores.length
      : 75;

    // 5. Aggregate Examinations & Results
    const examResults = await db.query<{
      examination_id: string;
      course_id: string;
      marks_obtained: number;
      max_score: number;
    }>(
      `SELECT er.examination_id, ex.course_id, er.marks_obtained, ex.max_score
       FROM exam_results er
       JOIN examinations ex ON er.examination_id = ex.id
       WHERE er.student_id = $1`,
      [studentId]
    );

    const examScores = examResults.map(e => (Number(e.marks_obtained) / Number(e.max_score || 100)) * 100);
    const avgExamScore = examScores.length > 0
      ? examScores.reduce((a, b) => a + b, 0) / examScores.length
      : 72;

    // 6. Build Course Performance Inputs
    const coursePerformanceInputs: CoursePerformanceInput[] = courses.map(course => {
      const courseAsgns = submissions.filter(s => s.course_id === course.id && s.score !== null).map(s => Number(s.score));
      const courseExams = examResults.filter(e => e.course_id === course.id).map(e => (Number(e.marks_obtained) / Number(e.max_score || 100)) * 100);
      const attInfo = courseAttendanceMap[course.id] || { present: 8, total: 10 };

      return {
        courseId: course.id,
        courseCode: course.code,
        courseName: course.name,
        assignmentScores: courseAsgns.length > 0 ? courseAsgns : [75],
        examScores: courseExams.length > 0 ? courseExams : [avgExamScore],
        attendancePresent: attInfo.present,
        attendanceTotal: attInfo.total,
      };
    });

    const weakSubjects = PerformanceAnalyzer.sortWeakSubjects(
      PerformanceAnalyzer.analyzeSubjects(coursePerformanceInputs)
    );

    // 7. Assemble Raw Data for Risk Engine
    const rawData: StudentAcademicRawData = {
      studentId,
      attendancePercentage: overallAttendancePct,
      totalClasses: totalAttendanceRecords || 10,
      missedClasses: absentCount,
      lateClasses: lateCount,
      assignmentAverage: avgAssignmentScore,
      totalAssignments: totalAsgn || 4,
      submittedAssignments: submittedAsgn,
      lateSubmissions,
      missingAssignments: missingAsgn,
      examAverage: avgExamScore,
      midtermScore: examScores.length > 0 ? examScores[0] : avgExamScore,
      previousAssessmentAverage: avgAssignmentScore,
      courseScores: weakSubjects.map(s => ({
        courseCode: s.courseCode,
        courseName: s.courseName,
        score: s.scorePercentage,
        attendance: s.attendancePercentage,
      })),
    };

    // 8. Execute AI Engines
    const risk = RiskEngine.computeRisk(rawData);
    const recommendations = RecommendationEngine.generateRecommendations(studentId, risk, weakSubjects);
    const insights = InsightGenerator.generateStudentInsights(studentId, student.name, risk, weakSubjects);

    // 9. Update student record with new risk score and level in DB
    await db.run(
      `UPDATE students
       SET academic_risk_score = $1, risk_level = $2
       WHERE id = $3`,
      [risk.riskScore, risk.riskLevel, studentId]
    );

    return {
      risk,
      weakSubjects,
      recommendations,
      insights,
    };
  }

  /**
   * Optional Gemini Generative AI synthesis for richer qualitative coaching.
   */
  public static async generateGeminiCoaching(promptContext: string): Promise<string> {
    if (!config.geminiApiKey) {
      return '';
    }

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${config.aiModel}:generateContent?key=${config.geminiApiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are EduIntelli's Chief Academic Intelligence Coach. Provide concise, encouraging, and highly specific actionable guidance based on this academic record:\n${promptContext}`
            }]
          }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 300,
          }
        })
      });

      if (!response.ok) {
        return '';
      }

      const json = (await response.json()) as any;
      return json?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    } catch {
      return '';
    }
  }
}
