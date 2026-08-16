import { RiskAnalysis, RiskLevel } from '../../models/types';
import { config } from '../../config';

export interface StudentAcademicRawData {
  studentId: string;
  attendancePercentage: number;
  totalClasses: number;
  missedClasses: number;
  lateClasses: number;
  assignmentAverage: number;
  totalAssignments: number;
  submittedAssignments: number;
  lateSubmissions: number;
  missingAssignments: number;
  examAverage: number;
  midtermScore?: number;
  previousAssessmentAverage?: number;
  courseScores: { courseCode: string; courseName: string; score: number; attendance: number }[];
}

export class RiskEngine {
  /**
   * Calculate Multi-Factor Academic Risk Score with full explainability.
   * Formula:
   * Risk = (AttendanceRisk * 25%) + (AssignmentRisk * 20%) + (ExamRisk * 35%) + (TrendRisk * 20%)
   */
  public static computeRisk(data: StudentAcademicRawData): RiskAnalysis {
    const weights = config.riskWeights;

    // 1. Attendance Risk Calculation (0 - 100)
    // Institutional threshold = 75%
    let attendanceRisk = 0;
    const att = Math.max(0, Math.min(100, data.attendancePercentage));
    if (att >= 85) {
      attendanceRisk = Math.max(0, (90 - att) * 0.5);
    } else if (att >= 75) {
      attendanceRisk = (85 - att) * 3.0; // 0 to 30
    } else {
      // Below 75% is critical attendance default
      attendanceRisk = Math.min(100, 30 + (75 - att) * 2.8);
    }

    // 2. Assignment Risk Calculation (0 - 100)
    // Factoring in assignment average score, missing submissions, and late penalties
    const asgnScoreRisk = Math.max(0, 100 - data.assignmentAverage);
    const missingPenalty = (data.missingAssignments / Math.max(1, data.totalAssignments)) * 60;
    const latePenalty = (data.lateSubmissions / Math.max(1, data.totalAssignments)) * 25;
    const assignmentRisk = Math.min(100, Math.max(0, (asgnScoreRisk * 0.6) + missingPenalty + latePenalty));

    // 3. Examination Risk Calculation (0 - 100)
    // Direct mastery score deficit
    const examAvg = Math.max(0, Math.min(100, data.examAverage));
    let examRisk = Math.max(0, 100 - examAvg);
    if (examAvg < 50) {
      examRisk = Math.min(100, examRisk * 1.15); // Compounded risk for failing exams
    }

    // 4. Performance Trend Risk Calculation (0 - 100)
    // Trajectory between previous assessments and recent exams
    const prevAvg = data.previousAssessmentAverage || data.assignmentAverage;
    const trendDelta = examAvg - prevAvg; // Negative if declining
    let trendRisk = 20; // baseline neutral

    if (trendDelta >= 5) {
      // Positive momentum (improving performance)
      trendRisk = Math.max(0, 15 - (trendDelta * 1.5));
    } else if (trendDelta <= -5) {
      // Negative momentum (declining performance)
      trendRisk = Math.min(100, 35 + (Math.abs(trendDelta) * 3.2));
    }

    // Compounding multi-factor penalty (failing both attendance and exams)
    let compoundPenalty = 0;
    if (data.attendancePercentage < 75 && data.examAverage < 60) {
      compoundPenalty = 12;
    }

    // 5. Total Weighted Academic Risk Score
    const rawRiskScore = (
      (attendanceRisk * weights.attendance) +
      (assignmentRisk * weights.assignments) +
      (examRisk * weights.examinations) +
      (trendRisk * weights.trend) +
      compoundPenalty
    );

    const riskScore = Math.round(Math.max(0, Math.min(100, rawRiskScore)));

    // Risk Classification
    let riskLevel: RiskLevel = 'LOW';
    if (riskScore > config.thresholds.riskMediumMax) {
      riskLevel = 'HIGH';
    } else if (riskScore > config.thresholds.riskLowMax) {
      riskLevel = 'MEDIUM';
    }

    // Generate Causal Reasons ("Why am I at risk?")
    const reasons: string[] = [];
    const recommendedActions: string[] = [];

    if (data.attendancePercentage < 75) {
      reasons.push(`Attendance is ${data.attendancePercentage.toFixed(1)}%, which is below the mandatory 75% institutional threshold (${data.missedClasses} missed sessions).`);
      recommendedActions.push(`Attend the next consecutive lectures to bring attendance back above 75%.`);
    } else if (data.attendancePercentage < 82) {
      reasons.push(`Attendance is currently ${data.attendancePercentage.toFixed(1)}%, near the warning threshold.`);
    }

    if (data.lateSubmissions > 0 || data.missingAssignments > 0) {
      reasons.push(`${data.lateSubmissions} late assignment(s) and ${data.missingAssignments} missing submission(s) detected.`);
      recommendedActions.push(`Submit all pending assignments to recover assignment completion metrics.`);
    }

    if (trendDelta <= -10) {
      reasons.push(`Recent examination scores declined by ${Math.abs(trendDelta).toFixed(1)}% compared to continuous assessments.`);
      recommendedActions.push(`Schedule an academic support session with your instructor.`);
    }

    // Check specific weak subjects
    const criticalCourses = data.courseScores.filter(c => c.score < 60 || c.attendance < 75);
    if (criticalCourses.length > 0) {
      const courseList = criticalCourses.map(c => c.courseName).join(' and ');
      reasons.push(`Low academic mastery identified in ${courseList}.`);
      recommendedActions.push(`Prioritize dedicated 45-minute daily study blocks for ${criticalCourses[0].courseName}.`);
    }

    if (reasons.length === 0) {
      reasons.push(`Performance is consistent with strong attendance (${data.attendancePercentage.toFixed(0)}%) and healthy exam averages.`);
      recommendedActions.push(`Maintain current study schedule and explore honors enrichment materials.`);
    }

    return {
      riskScore,
      riskLevel,
      factors: {
        attendanceRisk: Math.round(attendanceRisk),
        assignmentRisk: Math.round(assignmentRisk),
        examRisk: Math.round(examRisk),
        trendRisk: Math.round(trendRisk),
      },
      metrics: {
        attendancePercentage: Number(data.attendancePercentage.toFixed(1)),
        assignmentAverage: Number(data.assignmentAverage.toFixed(1)),
        examAverage: Number(data.examAverage.toFixed(1)),
        performanceTrendDelta: Number(trendDelta.toFixed(1)),
        missedClasses: data.missedClasses,
        lateSubmissions: data.lateSubmissions,
      },
      reasons,
      recommendedActions,
    };
  }
}
