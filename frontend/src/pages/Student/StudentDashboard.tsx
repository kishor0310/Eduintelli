import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { StatCard } from '../../components/ui/StatCard';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { RiskScoreCard } from '../../components/ai/RiskScoreCard';
import { ExplainableRiskModal } from '../../components/ai/ExplainableRiskModal';
import { AIInsightCard } from '../../components/ai/AIInsightCard';
import { RecommendationCard } from '../../components/ai/RecommendationCard';
import { WeakSubjectCard } from '../../components/ai/WeakSubjectCard';
import { PerformanceLineChart } from '../../components/charts/PerformanceLineChart';
import { CourseRadarChart } from '../../components/charts/CourseRadarChart';
import {
  GraduationCap,
  CalendarCheck,
  FileCheck2,
  Award,
  Sparkles,
  ArrowRight,
  BookOpen,
  Calendar,
  AlertTriangle,
  FileSpreadsheet,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExplainModalOpen, setIsExplainModalOpen] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, [user]);

  const loadDashboard = async () => {
    setIsLoading(true);
    try {
      const studentId = user?.studentId || 'std-01';
      const res = await api.getStudentDashboard(studentId);
      if (res.success && res.data) {
        setData(res.data);
      }
    } catch (error) {
      console.error('Failed to load student dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !data) {
    return <LoadingSpinner message="Synthesizing academic trajectory and AI risk indicators..." />;
  }

  const { student, kpis, aiAnalysis, courseMetrics, monthlyTrends, upcomingActivities, enrolledCourses } = data;

  return (
    <div className="space-y-6">
      {/* 1. TOP HEADER & STUDENT GREETING */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-400 font-mono">
              {student.roll_number} • {student.department}
            </span>
            <Badge
              variant={kpis.riskLevel === 'HIGH' ? 'danger' : kpis.riskLevel === 'MEDIUM' ? 'warning' : 'success'}
              size="sm"
            >
              {kpis.riskLevel} Risk
            </Badge>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Welcome back, {student.name}!
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Academic records updated for Semester {student.semester} ({student.batch})
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link to="/reports">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Full Performance Dossier</span>
            </Button>
          </Link>
          <Button
            variant="ai"
            size="sm"
            onClick={() => setIsExplainModalOpen(true)}
            className="gap-1.5 text-xs shadow-md"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Explain Risk Score ({kpis.riskScore})</span>
          </Button>
        </div>
      </div>

      {/* 2. TOP METRICS & RISK CARD GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Cumulative CGPA"
          value={Number(kpis.gpa).toFixed(2)}
          subtitle="Target: 3.80"
          icon={<GraduationCap className="w-4 h-4" />}
          variant="primary"
        />

        <StatCard
          title="Overall Attendance"
          value={`${kpis.attendancePercentage}%`}
          subtitle={kpis.attendancePercentage < 75 ? '⚠️ Below 75% threshold' : 'Optimal participation'}
          icon={<CalendarCheck className="w-4 h-4" />}
          variant={kpis.attendancePercentage < 75 ? 'danger' : 'success'}
        />

        <StatCard
          title="Assignment Average"
          value={`${kpis.assignmentAverage}%`}
          subtitle={`${aiAnalysis.risk.metrics.lateSubmissions} late submissions`}
          icon={<FileCheck2 className="w-4 h-4" />}
          variant="ai"
        />

        <StatCard
          title="Exam Average"
          value={`${kpis.examAverage}%`}
          subtitle="Midterms & Assessments"
          icon={<Award className="w-4 h-4" />}
          variant={kpis.examAverage < 60 ? 'warning' : 'primary'}
        />

        {/* Highlighted Risk Index Card */}
        <div className="sm:col-span-2 lg:col-span-1">
          <StatCard
            title="Academic Risk Index"
            value={`${kpis.riskScore}/100`}
            subtitle={kpis.riskLevel === 'HIGH' ? 'Critical Attention' : kpis.riskLevel === 'MEDIUM' ? 'Action Recommended' : 'On Track'}
            icon={<AlertTriangle className="w-4 h-4" />}
            variant={kpis.riskLevel === 'HIGH' ? 'danger' : kpis.riskLevel === 'MEDIUM' ? 'warning' : 'success'}
            onClick={() => setIsExplainModalOpen(true)}
          />
        </div>
      </div>

      {/* 3. CORE ANALYTICS ROW: RISK BREAKDOWN & PERFORMANCE TRENDS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transparent Risk Score Gauge Card */}
        <div className="lg:col-span-1">
          <RiskScoreCard
            risk={aiAnalysis.risk}
            onExplainClick={() => setIsExplainModalOpen(true)}
          />
        </div>

        {/* Monthly Performance & Attendance Trajectory */}
        <Card className="lg:col-span-2 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Monthly Academic Mastery & Attendance Trajectory</span>
              </h3>
              <p className="text-xs text-slate-400">Continuous 5-month longitudinal tracking</p>
            </div>
            <Badge variant="ai" size="sm">Predictive Curve</Badge>
          </div>
          <PerformanceLineChart data={monthlyTrends} />
        </Card>
      </div>

      {/* 4. AI INSIGHTS & WEAK SUBJECTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: AI Academic Insights & Positives */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>AI Academic Insights & Diagnostic Highlights</span>
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">
              {aiAnalysis.insights.length} Generated
            </span>
          </div>

          <div className="space-y-3">
            {aiAnalysis.insights.map((insight: any, i: number) => (
              <AIInsightCard key={i} insight={insight} />
            ))}
          </div>
        </div>

        {/* Right Column: Weak Subjects & Priority Diagnosis */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-sky-400" />
              <span>Subject Mastery & Weak Area Priorities</span>
            </h3>
            <span className="text-[11px] text-slate-400">Ranked by Priority</span>
          </div>

          <div className="space-y-3">
            {aiAnalysis.weakSubjects.map((subject: any) => (
              <WeakSubjectCard key={subject.courseId} subject={subject} />
            ))}
          </div>
        </div>
      </div>

      {/* 5. RADAR BENCHMARK & 7-DAY ACTION ROADMAP */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Course Radar Chart */}
        <Card className="flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-bold text-white">Course Mastery vs Cohort Benchmark</h3>
              <p className="text-xs text-slate-400">Comparing your score against class percentile</p>
            </div>
            <Badge variant="default" size="sm">5 Enrolled</Badge>
          </div>
          <CourseRadarChart data={courseMetrics} />
        </Card>

        {/* 7-Day Personalized Action Tasks */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Personalized 7-Day AI Action Roadmap</span>
            </h3>
            <span className="text-[11px] text-slate-400">Click check to complete</span>
          </div>

          <div className="space-y-2.5">
            {aiAnalysis.recommendations.map((rec: any, idx: number) => (
              <RecommendationCard key={idx} recommendation={rec} />
            ))}
          </div>
        </div>
      </div>

      {/* 6. UPCOMING DEADLINES & EXAMINATIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assignments Upcoming */}
        <Card>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-slate-800 text-sky-400">
                <FileCheck2 className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-white">Upcoming Assignment Deadlines</h4>
            </div>
            <Link to="/assignments" className="text-xs text-brand-400 hover:text-brand-300">
              View All
            </Link>
          </div>

          <div className="space-y-2 text-xs">
            {upcomingActivities.assignments.length > 0 ? (
              upcomingActivities.assignments.map((asgn: any) => (
                <div
                  key={asgn.id}
                  className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-white">{asgn.title}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{asgn.course_code} • {asgn.course_name}</div>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 font-semibold text-[10px]">
                      {new Date(asgn.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-slate-400 text-xs py-4 text-center">No pending assignments due this week.</div>
            )}
          </div>
        </Card>

        {/* Examinations Upcoming */}
        <Card>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-slate-800 text-purple-400">
                <Calendar className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-white">Upcoming Examinations</h4>
            </div>
            <Link to="/examinations" className="text-xs text-brand-400 hover:text-brand-300">
              View All
            </Link>
          </div>

          <div className="space-y-2 text-xs">
            {upcomingActivities.exams.length > 0 ? (
              upcomingActivities.exams.map((ex: any) => (
                <div
                  key={ex.id}
                  className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-white">{ex.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{ex.course_code} • Room: {ex.room || 'Hall A'}</div>
                  </div>
                  <div className="text-right">
                    <Badge variant="warning" size="sm">
                      {ex.exam_date}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-slate-400 text-xs py-4 text-center">No exams scheduled in the next 14 days.</div>
            )}
          </div>
        </Card>
      </div>

      {/* 7. EXPLAINABLE RISK MODAL */}
      <ExplainableRiskModal
        isOpen={isExplainModalOpen}
        onClose={() => setIsExplainModalOpen(false)}
        risk={aiAnalysis.risk}
      />
    </div>
  );
};
