import { Request, Response, NextFunction } from 'express';
import { AIService } from '../services/ai/aiService';
import { AuthRequest } from '../middleware/auth';
import { InsightGenerator } from '../services/ai/insightGenerator';

export class AIController {
  private static resolveStudentId(req: AuthRequest): { studentId?: string; error?: string } {
    if (req.user?.role === 'STUDENT') {
      if (req.params.studentId && req.params.studentId !== req.user.studentId) {
        return { error: 'Forbidden: Students can only access their own AI risk analysis.' };
      }
      return { studentId: req.user.studentId || 'std-01' };
    }
    if (req.user?.role === 'TEACHER') {
      // Teachers must not request arbitrary student data; enforce relationship check or deny
      if (req.params.studentId) {
        return { error: 'Forbidden: Teachers cannot access arbitrary student AI analysis.' };
      }
    }
    const studentId = req.params.studentId || req.user?.studentId || 'std-01';
    return { studentId };
  }

  public static async getStudentRisk(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { studentId, error } = AIController.resolveStudentId(req);
      if (error) {
        return res.status(403).json({ success: false, message: error });
      }

      const analysis = await AIService.analyzeStudent(studentId!);

      return res.status(200).json({
        success: true,
        data: {
          studentId,
          risk: analysis.risk,
          weakSubjects: analysis.weakSubjects,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getStudentRecommendations(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { studentId, error } = AIController.resolveStudentId(req);
      if (error) {
        return res.status(403).json({ success: false, message: error });
      }

      const analysis = await AIService.analyzeStudent(studentId!);

      return res.status(200).json({
        success: true,
        count: analysis.recommendations.length,
        data: analysis.recommendations,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getStudentInsights(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { studentId, error } = AIController.resolveStudentId(req);
      if (error) {
        return res.status(403).json({ success: false, message: error });
      }

      const analysis = await AIService.analyzeStudent(studentId!);

      return res.status(200).json({
        success: true,
        count: analysis.insights.length,
        data: analysis.insights,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getInstitutionalInsights(req: Request, res: Response, next: NextFunction) {
    try {
      const insights = InsightGenerator.generateAdminInsights();

      return res.status(200).json({
        success: true,
        count: insights.length,
        data: insights,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async askCoach(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { question } = req.body;
      const studentId = req.user?.studentId || 'std-01';

      const analysis = await AIService.analyzeStudent(studentId);
      const promptContext = `Student Risk Score: ${analysis.risk.riskScore}/100.
Attendance: ${analysis.risk.metrics.attendancePercentage}%.
Weak Subjects: ${analysis.weakSubjects.map(s => `${s.courseCode} (${s.scorePercentage}%)`).join(', ')}.
Question: ${question || 'What should I prioritize today?'}`;

      let responseText = await AIService.generateGeminiCoaching(promptContext);

      if (!responseText) {
        // Deterministic intelligent fallback
        if (analysis.risk.riskLevel === 'HIGH') {
          responseText = `Based on your academic profile, your top priority should be raising your attendance in ${analysis.weakSubjects[0]?.courseName || 'core classes'} and completing past problem sets in ${analysis.weakSubjects[0]?.courseCode || 'weak areas'} before the upcoming assessment.`;
        } else if (analysis.risk.riskLevel === 'MEDIUM') {
          responseText = `You are maintaining good pace! Focus on strengthening ${analysis.weakSubjects[0]?.courseName || 'Discrete Mathematics'} with 30 minutes of daily practice to elevate your overall GPA above 3.5.`;
        } else {
          responseText = `Great momentum! Your attendance is high (${analysis.risk.metrics.attendancePercentage}%) and assignment scores are strong. Keep following your study schedule and review honor electives.`;
        }
      }

      return res.status(200).json({
        success: true,
        response: responseText,
      });
    } catch (error) {
      next(error);
    }
  }
}
