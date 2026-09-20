import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { StatCard } from '../../components/ui/StatCard';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { RiskDonutChart } from '../../components/charts/RiskDonutChart';
import { AIInsightCard } from '../../components/ai/AIInsightCard';
import { AttendanceMarkerModal } from '../../components/forms/AttendanceMarkerModal';
import { InterventionModal } from '../../components/forms/InterventionModal';
import {
  Users,
  CalendarCheck,
  Award,
  AlertTriangle,
  FileCheck2,
  Sparkles,
  Send,
  UserCheck,
  BookOpen,
  ArrowUpRight,
  ShieldAlert,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const TeacherDashboard: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [selectedCourseForAttendance, setSelectedCourseForAttendance] = useState<{ id: string; name: string; code: string }>({
    id: 'crs-01',
    name: 'Discrete Mathematics & Graph Theory',
    code: 'CS401',
  });

  const [interventionStudent, setInterventionStudent] = useState<any>(null);
  const [isInterventionModalOpen, setIsInterventionModalOpen] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, [user]);

  const loadDashboard = async () => {
    setIsLoading(true);
    try {
      // Fetch authenticated teacher dashboard via token identity to prevent auth bypass (CWE-287)
      const res = await api.getTeacherDashboard();
      if (res.success && res.data) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Failed to load teacher dashboard:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenIntervention = (student: any) => {
    setInterventionStudent(student);
    setIsInterventionModalOpen(true);
  };

  if (isLoading || !data) {
    return <LoadingSpinner message="Aggregating class performance and running at-risk cohort analytics..." />;
  }

  const { teacher, kpis, riskDistribution, coursesTaught, aiTeacherInsights, studentsRequiringAttention } = data;

  return (
    <div className="space-y-6">
      {/* 1. TOP HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-sky-400 font-mono">
              {teacher.employee_id || 'FAC-CS-101'} • {teacher.department}
            </span>
            <Badge variant="ai" size="sm">
              Faculty Command Center
            </Badge>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
            {teacher.name} — Class Health & Interventions
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Managing {coursesTaught.length} Active Courses ({kpis.totalStudents} Registered Students)
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              if (coursesTaught.length > 0) {
                setSelectedCourseForAttendance({
                  id: coursesTaught[0].id,
                  name: coursesTaught[0].name,
                  code: coursesTaught[0].code,
                });
              }
              setIsAttendanceModalOpen(true);
            }}
            className="gap-1.5 text-xs shadow-md"
          >
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>Mark Class Attendance</span>
          </Button>

          <Link to="/assignments">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <FileCheck2 className="w-3.5 h-3.5 text-purple-400" />
              <span>Review Submissions</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. TOP KPI COUNTERS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Enrolled Students"
          value={kpis.totalStudents}
          subtitle={`${coursesTaught.length} course sections`}
          icon={<Users className="w-4 h-4" />}
          variant="primary"
        />

        <StatCard
          title="Average Attendance"
          value={`${kpis.averageAttendance}%`}
          subtitle="Cohort average"
          icon={<CalendarCheck className="w-4 h-4" />}
          variant={kpis.averageAttendance < 75 ? 'danger' : 'success'}
        />

        <StatCard
          title="Class Average Marks"
          value={`${kpis.averageMarks}%`}
          subtitle="Continuous + Exams"
          icon={<Award className="w-4 h-4" />}
          variant="ai"
        />

        <StatCard
          title="Students At Risk"
          value={kpis.studentsAtRisk}
          subtitle={`${kpis.highRiskCount} High / ${kpis.mediumRiskCount} Medium`}
          icon={<AlertTriangle className="w-4 h-4" />}
          variant="danger"
        />

        <StatCard
          title="Assignment Submissions"
          value={`${kpis.assignmentCompletionRate}%`}
          subtitle="On-time completion"
          icon={<FileCheck2 className="w-4 h-4" />}
          variant="primary"
        />
      </div>

      {/* 3. RISK DISTRIBUTION & AI TEACHER INSIGHTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Distribution Donut Chart */}
        <Card className="flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-bold text-white">Student Risk Distribution</h3>
              <p className="text-xs text-slate-400">Class risk classification overview</p>
            </div>
            <Badge variant="default" size="sm">Live Model</Badge>
          </div>
          <RiskDonutChart data={riskDistribution} />
          <div className="pt-2 border-t border-slate-800 flex justify-between text-xs text-slate-400">
            <span className="text-emerald-400 font-semibold">{kpis.lowRiskCount} On Track</span>
            <span className="text-amber-400 font-semibold">{kpis.mediumRiskCount} Medium</span>
            <span className="text-rose-400 font-semibold">{kpis.highRiskCount} Critical</span>
          </div>
        </Card>

        {/* AI Teacher Insights */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>AI Cohort Diagnostic Alerts</span>
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">
              {aiTeacherInsights.length} Active Observations
            </span>
          </div>

          <div className="space-y-3">
            {aiTeacherInsights.map((insight: any, i: number) => (
              <AIInsightCard key={i} insight={insight} />
            ))}
          </div>
        </div>
      </div>

      {/* 4. ACTIONABLE AT-RISK STUDENT ROSTER TABLE */}
      <Card className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>Students Requiring Faculty Attention & Intervention</span>
            </h3>
            <p className="text-xs text-slate-400">
              Ranked by compound academic risk index. Click &quot;Intervene&quot; to trigger tailored remediation alerts.
            </p>
          </div>
          <Badge variant="danger" size="sm">
            {studentsRequiringAttention.length} Action Items
          </Badge>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-3">Student Name</th>
                <th className="py-3 px-3">Roll No</th>
                <th className="py-3 px-3">Course</th>
                <th className="py-3 px-3 text-center">Attendance</th>
                <th className="py-3 px-3 text-center">Assignments</th>
                <th className="py-3 px-3 text-center">Exams</th>
                <th className="py-3 px-3 text-center">Risk Score</th>
                <th className="py-3 px-3">Recommended Intervention</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {studentsRequiringAttention.map((st: any) => (
                <tr key={st.studentId} className="hover:bg-slate-900/60 transition-colors">
                  <td className="py-3 px-3 font-bold text-white">{st.name}</td>
                  <td className="py-3 px-3 font-mono text-slate-400 text-[11px]">{st.rollNumber}</td>
                  <td className="py-3 px-3 text-slate-300 font-semibold">{st.courseCode}</td>
                  <td className="py-3 px-3 text-center">
                    <span className={st.attendance < 75 ? 'text-rose-400 font-bold' : 'text-slate-200'}>
                      {st.attendance}%
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center text-slate-200">{st.assignmentAvg}%</td>
                  <td className="py-3 px-3 text-center text-slate-200">{st.examAvg}%</td>
                  <td className="py-3 px-3 text-center">
                    <Badge
                      variant={st.riskLevel === 'HIGH' ? 'danger' : 'warning'}
                      size="sm"
                    >
                      {st.riskScore}/100
                    </Badge>
                  </td>
                  <td className="py-3 px-3 text-slate-300 max-w-xs truncate" title={st.recommendedAction}>
                    {st.recommendedAction}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <Button
                      size="sm"
                      variant={st.riskLevel === 'HIGH' ? 'danger' : 'outline'}
                      onClick={() => handleOpenIntervention(st)}
                      className="text-xs gap-1 py-1 px-2.5"
                    >
                      <Send className="w-3 h-3" />
                      <span>Intervene</span>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 5. COURSES TAUGHT CARDS */}
      <div className="space-y-3">
        <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-sky-400" />
          <span>My Assigned Courses & Class Roster</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {coursesTaught.map((course: any) => (
            <Card key={course.id} className="p-4 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono font-bold text-sky-400">{course.code}</span>
                  <Badge variant="info" size="sm">{course.credits} Credits</Badge>
                </div>
                <h4 className="text-sm font-bold text-white mb-1">{course.name}</h4>
                <p className="text-xs text-slate-400">
                  {course.department} • {course.enrolled_students || 15} Students Enrolled
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSelectedCourseForAttendance({
                      id: course.id,
                      name: course.name,
                      code: course.code,
                    });
                    setIsAttendanceModalOpen(true);
                  }}
                  className="w-full text-xs"
                >
                  Mark Attendance
                </Button>
                <Link to={`/courses/${course.id}`} className="w-full">
                  <Button size="sm" variant="ghost" className="w-full text-xs">
                    Course Info
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* 6. MODALS */}
      <AttendanceMarkerModal
        isOpen={isAttendanceModalOpen}
        onClose={() => setIsAttendanceModalOpen(false)}
        courseId={selectedCourseForAttendance.id}
        courseName={selectedCourseForAttendance.name}
        courseCode={selectedCourseForAttendance.code}
        onSuccess={loadDashboard}
      />

      {interventionStudent && (
        <InterventionModal
          isOpen={isInterventionModalOpen}
          onClose={() => {
            setIsInterventionModalOpen(false);
            setInterventionStudent(null);
          }}
          studentId={interventionStudent.studentId}
          studentName={interventionStudent.name}
          rollNumber={interventionStudent.rollNumber}
          riskScore={interventionStudent.riskScore}
          riskLevel={interventionStudent.riskLevel}
          courseName={interventionStudent.courseName}
          onSuccess={loadDashboard}
        />
      )}
    </div>
  );
};
