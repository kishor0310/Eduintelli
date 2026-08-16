import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { StatCard } from '../../components/ui/StatCard';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { DepartmentBarChart } from '../../components/charts/DepartmentBarChart';
import { AIInsightCard } from '../../components/ai/AIInsightCard';
import {
  Shield,
  GraduationCap,
  Users,
  BookOpen,
  CalendarCheck,
  Award,
  AlertTriangle,
  Sparkles,
  TrendingUp,
  FileSpreadsheet,
  Building,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, [user]);

  const loadDashboard = async () => {
    setIsLoading(true);
    try {
      const res = await api.getAdminDashboard();
      if (res.success && res.data) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Failed to load admin dashboard:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !data) {
    return <LoadingSpinner message="Generating institution-wide intelligence diagnostics and KPI benchmarks..." />;
  }

  const { kpis, departmentAnalytics, courseBenchmarks, institutionalRiskTrends, aiInstitutionalInsights } = data;

  return (
    <div className="space-y-6">
      {/* 1. TOP HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-400 font-mono">
              Institutional Governance • Quality Assurance
            </span>
            <Badge variant="ai" size="sm">
              Executive Analytics
            </Badge>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Building className="w-7 h-7 text-purple-400" />
            <span>EduIntelli Institutional Intelligence Center</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Monitoring 3 Engineering Departments, 8 Core Curriculums, and 21 Enrolled Cohorts.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link to="/reports">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Generate Institutional Audit Report</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. EXECUTIVE MACRO STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Student Body"
          value={kpis.totalStudents}
          subtitle="Enrolled active students"
          icon={<GraduationCap className="w-4 h-4" />}
          variant="primary"
        />

        <StatCard
          title="Faculty Members"
          value={kpis.totalTeachers}
          subtitle="Teaching & Research staff"
          icon={<Users className="w-4 h-4" />}
          variant="ai"
        />

        <StatCard
          title="Average CGPA"
          value={kpis.averageGpa}
          subtitle="Cohort grade average"
          icon={<Award className="w-4 h-4" />}
          variant="success"
        />

        <StatCard
          title="Active At-Risk Students"
          value={kpis.totalAtRisk}
          subtitle={`${kpis.highRiskCount} critical interventions`}
          icon={<AlertTriangle className="w-4 h-4" />}
          variant="danger"
        />
      </div>

      {/* 3. SECONDARY KPIS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Campus-Wide Attendance Rate"
          value={`${kpis.averageAttendance}%`}
          subtitle="Institution target: >80%"
          icon={<CalendarCheck className="w-4 h-4" />}
          variant="primary"
        />

        <StatCard
          title="Registered Courses"
          value={kpis.totalCourses}
          subtitle={`${kpis.totalClasses} scheduled lecture sections`}
          icon={<BookOpen className="w-4 h-4" />}
          variant="default"
        />

        <StatCard
          title="Early Intervention Success"
          value={kpis.interventionSuccessRate}
          subtitle="Resolved within 14 days"
          icon={<Sparkles className="w-4 h-4" />}
          variant="success"
        />
      </div>

      {/* 4. DEPARTMENT COMPARATIVE CHARTS & INSTITUTIONAL INSIGHTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Bar Chart */}
        <Card className="lg:col-span-2 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-bold text-white">Department Performance & Attendance Comparison</h3>
              <p className="text-xs text-slate-400">Comparing Computer Science, AI, and Information Technology</p>
            </div>
            <Badge variant="info" size="sm">Cross-Department</Badge>
          </div>
          <DepartmentBarChart data={departmentAnalytics} />
        </Card>

        {/* AI Institutional Diagnostic Insights */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>AI Institutional Directives</span>
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">
              {aiInstitutionalInsights.length} Policy Alerts
            </span>
          </div>

          <div className="space-y-3">
            {aiInstitutionalInsights.map((insight: any, i: number) => (
              <AIInsightCard key={i} insight={insight} />
            ))}
          </div>
        </div>
      </div>

      {/* 5. COURSE FAILURE RISK & PASS PROBABILITY BENCHMARK TABLE */}
      <Card className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white">Course Risk Benchmarks & Academic Health</h3>
            <p className="text-xs text-slate-400">
              Evaluates course-level pass probabilities and identifies subjects requiring additional Teaching Assistants.
            </p>
          </div>
          <Badge variant="default" size="sm">8 Active Courses</Badge>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-3">Course</th>
                <th className="py-3 px-3">Department</th>
                <th className="py-3 px-3">Lead Faculty</th>
                <th className="py-3 px-3 text-center">Enrolled</th>
                <th className="py-3 px-3 text-center">Average Score</th>
                <th className="py-3 px-3 text-center">Risk Index</th>
                <th className="py-3 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {courseBenchmarks.map((cb: any) => (
                <tr key={cb.courseId} className="hover:bg-slate-900/60 transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-bold text-white">{cb.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{cb.code}</div>
                  </td>
                  <td className="py-3 px-3 text-slate-300">{cb.department}</td>
                  <td className="py-3 px-3 text-slate-300">{cb.teacherName}</td>
                  <td className="py-3 px-3 text-center font-bold text-white">{cb.enrolledCount}</td>
                  <td className="py-3 px-3 text-center">
                    <span className={cb.averageScore < 70 ? 'text-rose-400 font-bold' : 'text-slate-200'}>
                      {cb.averageScore}%
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <Badge
                      variant={cb.riskIndex > 50 ? 'danger' : cb.riskIndex > 30 ? 'warning' : 'success'}
                      size="sm"
                    >
                      {cb.riskIndex}/100
                    </Badge>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        cb.status === 'Requires Support'
                          ? 'bg-rose-500/15 text-rose-400'
                          : cb.status === 'Moderate Risk'
                          ? 'bg-amber-500/15 text-amber-400'
                          : 'bg-emerald-500/15 text-emerald-400'
                      }`}
                    >
                      {cb.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
