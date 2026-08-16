import { WeakSubjectAnalysis, PriorityLevel } from '../../models/types';

export interface CoursePerformanceInput {
  courseId: string;
  courseCode: string;
  courseName: string;
  assignmentScores: number[];
  examScores: number[];
  attendancePresent: number;
  attendanceTotal: number;
}

export class PerformanceAnalyzer {
  /**
   * Analyze subject-level strengths and weaknesses with priority classification.
   */
  public static analyzeSubjects(courses: CoursePerformanceInput[]): WeakSubjectAnalysis[] {
    return courses.map(course => {
      // 1. Calculate Average Score
      const allScores = [...course.assignmentScores, ...course.examScores];
      const avgScore = allScores.length > 0
        ? allScores.reduce((a, b) => a + b, 0) / allScores.length
        : 75;

      // 2. Calculate Attendance Percentage
      const attendancePct = course.attendanceTotal > 0
        ? (course.attendancePresent / course.attendanceTotal) * 100
        : 100;

      // 3. Calculate Trend Delta (exam vs assignment)
      const asgnAvg = course.assignmentScores.length > 0
        ? course.assignmentScores.reduce((a, b) => a + b, 0) / course.assignmentScores.length
        : avgScore;
      const examAvg = course.examScores.length > 0
        ? course.examScores.reduce((a, b) => a + b, 0) / course.examScores.length
        : avgScore;
      const trendDelta = examAvg - asgnAvg;

      // 4. Priority and Status Classification
      let priority: PriorityLevel = 'LOW';
      let status: 'Critical Attention' | 'Needs Improvement' | 'Satisfactory' | 'Strong' = 'Satisfactory';
      let notes = '';

      if (avgScore < 60 || attendancePct < 70 || trendDelta <= -15) {
        priority = 'HIGH';
        status = 'Critical Attention';
        notes = `${course.courseName} requires urgent focus. Performance is at ${avgScore.toFixed(0)}% with a ${Math.abs(trendDelta).toFixed(0)}% exam deficit.`;
      } else if (avgScore < 75 || attendancePct < 80 || trendDelta < -5) {
        priority = 'MEDIUM';
        status = 'Needs Improvement';
        notes = `Target consistent revision to elevate grade from ${avgScore.toFixed(0)}% to above 80%.`;
      } else if (avgScore >= 88) {
        priority = 'LOW';
        status = 'Strong';
        notes = `Exceptional mastery in ${course.courseCode}. Score is currently ${avgScore.toFixed(0)}%.`;
      } else {
        priority = 'LOW';
        status = 'Satisfactory';
        notes = `Steady progress in ${course.courseCode}. Attendance is solid at ${attendancePct.toFixed(0)}%.`;
      }

      return {
        courseId: course.courseId,
        courseCode: course.courseCode,
        courseName: course.courseName,
        scorePercentage: Math.round(avgScore),
        attendancePercentage: Math.round(attendancePct),
        priority,
        status,
        trendDelta: Math.round(trendDelta),
        notes,
      };
    });
  }

  /**
   * Sort weak subjects placing HIGH priority first, then MEDIUM, then LOW.
   */
  public static sortWeakSubjects(subjects: WeakSubjectAnalysis[]): WeakSubjectAnalysis[] {
    const priorityWeight: Record<PriorityLevel, number> = {
      HIGH: 3,
      MEDIUM: 2,
      LOW: 1,
    };

    return [...subjects].sort((a, b) => {
      if (priorityWeight[b.priority] !== priorityWeight[a.priority]) {
        return priorityWeight[b.priority] - priorityWeight[a.priority];
      }
      return a.scorePercentage - b.scorePercentage;
    });
  }
}
