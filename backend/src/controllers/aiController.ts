import { Request, Response, NextFunction } from 'express';
import { AIService } from '../services/ai/aiService';
import { AuthRequest } from '../middleware/auth';
import { InsightGenerator } from '../services/ai/insightGenerator';

export class AIController {
  // CWE-639: Enforce strict IDOR authorization without hardcoded fallback student identifiers
  private static resolveStudentId(req: AuthRequest): { studentId?: string; error?: string; status?: number } {
    if (!req.user) {
      return { error: 'Authentication required.', status: 401 };
    }

    if (req.user.role === 'STUDENT') {
      if (!req.user.studentId) {
        return { error: 'Forbidden: No student profile associated with this account.', status: 403 };
      }
      if (req.params.studentId && req.params.studentId !== req.user.studentId) {
        return { error: 'Forbidden: Students can only access their own AI risk analysis.', status: 403 };
      }
      return { studentId: req.user.studentId };
    }

    if (req.user.role === 'TEACHER') {
      // Teachers must not request arbitrary student data without verified course enrollment
      if (req.params.studentId) {
        return { error: 'Forbidden: Teachers cannot access arbitrary student AI analysis.', status: 403 };
      }
      if (!req.user.studentId) {
        return { error: 'Student ID required.', status: 400 };
      }
    }

    const studentId = req.params.studentId || req.user.studentId;
    if (!studentId) {
      return { error: 'Student profile identifier is required.', status: 400 };
    }
    return { studentId };
  }

  public static async getStudentRisk(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { studentId, error, status } = AIController.resolveStudentId(req);
      if (error) {
        return res.status(status || 403).json({ success: false, message: error });
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
      const { studentId, error, status } = AIController.resolveStudentId(req);
      if (error) {
        return res.status(status || 403).json({ success: false, message: error });
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
      const { studentId, error, status } = AIController.resolveStudentId(req);
      if (error) {
        return res.status(status || 403).json({ success: false, message: error });
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

  public static async getInstitutionalInsights(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      // CWE-284: Verify administrator authorization for institutional insights
      if (!req.user || req.user.role !== 'ADMIN') {
        return res.status(403).json({
          success: false,
          message: 'Forbidden: Only administrators are authorized to access institutional insights.',
        });
      }

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
      // CWE-352: Validate anti-CSRF token / session authorization on AI coaching requests
      const csrfToken = req.headers['x-csrf-token'] || req.headers['xsrf-token'] || req.headers['x-requested-with'] || req.headers.authorization;
      if (!csrfToken) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden: CSRF validation failed. Missing anti-CSRF token or authorization header.',
        });
      }

      const studentId = req.user?.studentId;
      if (!studentId) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden: Only enrolled students can consult the AI coach.',
        });
      }

      const { question } = req.body;

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
