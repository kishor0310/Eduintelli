import { Recommendation, PriorityLevel } from '../../models/types';
import { RiskAnalysis, WeakSubjectAnalysis } from '../../models/types';

export class RecommendationEngine {
  /**
   * Generates actionable, time-bounded recommendations for a student based on risk profile and weak areas.
   */
  public static generateRecommendations(
    studentId: string,
    risk: RiskAnalysis,
    weakSubjects: WeakSubjectAnalysis[]
  ): Partial<Recommendation>[] {
    const recommendations: Partial<Recommendation>[] = [];

    // 1. High Priority Subject Interventions
    const highPrioritySubjects = weakSubjects.filter(s => s.priority === 'HIGH');
    highPrioritySubjects.forEach(sub => {
      recommendations.push({
        student_id: studentId,
        course_id: sub.courseId,
        title: `Prioritize ${sub.courseName} for the Next 7 Days`,
        action_item: `Dedicate 45 minutes daily to review core textbook modules and practice 15 past-year problem sets in ${sub.courseCode}.`,
        priority: 'HIGH',
        target_days: 7,
        is_completed: false,
      });

      if (sub.attendancePercentage < 75) {
        recommendations.push({
          student_id: studentId,
          course_id: sub.courseId,
          title: `Attend Next 3 ${sub.courseCode} Lectures Without Absence`,
          action_item: `Current attendance is ${sub.attendancePercentage}%. Attending all upcoming lectures this week will prevent debarment risk.`,
          priority: 'HIGH',
          target_days: 10,
          is_completed: false,
        });
      }
    });

    // 2. Medium Priority Subjects
    const mediumPrioritySubjects = weakSubjects.filter(s => s.priority === 'MEDIUM');
    mediumPrioritySubjects.forEach(sub => {
      recommendations.push({
        student_id: studentId,
        course_id: sub.courseId,
        title: `Target 80%+ Benchmark in ${sub.courseCode}`,
        action_item: `Complete interactive quiz modules and schedule peer study group revision for ${sub.courseName}.`,
        priority: 'MEDIUM',
        target_days: 14,
        is_completed: false,
      });
    });

    // 3. Assignment Late / Missing Submissions
    if (risk.metrics.lateSubmissions > 0) {
      recommendations.push({
        student_id: studentId,
        course_id: null,
        title: 'Establish Pre-Deadline Submission Routine',
        action_item: `Set calendar alerts 48 hours prior to assignment deadlines to eliminate late penalties.`,
        priority: 'MEDIUM',
        target_days: 5,
        is_completed: false,
      });
    }

    // 4. Positive Honors Recommendation for High Performers
    if (risk.riskLevel === 'LOW' && recommendations.length === 0) {
      const topSubject = weakSubjects.find(s => s.status === 'Strong') || weakSubjects[0];
      recommendations.push({
        student_id: studentId,
        course_id: topSubject?.courseId || null,
        title: `Explore Advanced Research Electives in ${topSubject?.courseCode || 'AI'}`,
        action_item: `Maintain your excellent momentum by diving into extracurricular project implementations and mentorship workshops.`,
        priority: 'LOW',
        target_days: 21,
        is_completed: false,
      });
    }

    return recommendations;
  }
}
