import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { StatCard } from '../../components/ui/StatCard';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { AttendanceAreaChart } from '../../components/charts/AttendanceAreaChart';
import { AttendanceMarkerModal } from '../../components/forms/AttendanceMarkerModal';
import {
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  BookOpen,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { cn } from '../../utils/cn';

export const AttendancePage: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMarkerModalOpen, setIsMarkerModalOpen] = useState(false);
  const [selectedCourseForMarker, setSelectedCourseForMarker] = useState({
    id: 'crs-01',
    name: 'Discrete Mathematics & Graph Theory',
    code: 'CS401',
  });

  useEffect(() => {
    loadAttendance();
  }, [user]);

  const loadAttendance = async () => {
    setIsLoading(true);
    try {
      const studentId = user?.studentId || 'std-01';
      const res = await api.getStudentAttendance(studentId);
      if (res.success && res.data) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Failed to load attendance:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !data) {
    return <LoadingSpinner message="Calculating subject-wise attendance percentages & risk thresholds..." />;
  }

  const { overallPercentage, totalClasses, isAttendanceRisk, subjects, history } = data;

  const chartData = subjects.map((s: any) => ({
    courseCode: s.courseCode,
    courseName: s.courseName,
    percentage: s.percentage,
  }));

  return (
    <div className="space-y-6">
      {/* 1. TOP HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-sky-400 font-mono">
              Academic Attendance Intelligence
            </span>
            <Badge variant={isAttendanceRisk ? 'danger' : 'success'} size="sm">
              {isAttendanceRisk ? 'Threshold Alert (<75%)' : 'Attendance Compliant'}
            </Badge>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <CalendarCheck className="w-7 h-7 text-brand-400" />
            <span>Attendance Tracking & Risk Analyzer</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Institutional requirement: 75% minimum attendance per course module.
          </p>
        </div>

        {user?.role === 'TEACHER' && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsMarkerModalOpen(true)}
            className="gap-1.5 text-xs shadow-md"
          >
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>Mark Today&apos;s Attendance</span>
          </Button>
        )}
      </div>

      {/* 2. TOP METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Overall Attendance"
          value={`${overallPercentage}%`}
          subtitle={overallPercentage < 75 ? '⚠️ Below institutional requirement' : 'Excellent consistency'}
          icon={<CalendarCheck className="w-4 h-4" />}
          variant={overallPercentage < 75 ? 'danger' : 'success'}
        />

        <StatCard
          title="Total Scheduled Lectures"
          value={totalClasses}
          subtitle="Across all registered courses"
          icon={<Calendar className="w-4 h-4" />}
          variant="primary"
        />

        <StatCard
          title="Courses Requiring Recovery"
          value={subjects.filter((s: any) => s.percentage < 75).length}
          subtitle="Courses below 75% threshold"
          icon={<AlertTriangle className="w-4 h-4" />}
          variant={subjects.some((s: any) => s.percentage < 75) ? 'warning' : 'success'}
        />
      </div>

      {/* 3. ATTENDANCE TREND CHART & SUBJECT CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Area Chart */}
        <Card className="lg:col-span-2 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-bold text-white">Subject-Wise Attendance Distribution</h3>
              <p className="text-xs text-slate-400">Institutional 75% compliance threshold line</p>
            </div>
            <Badge variant="default" size="sm">{subjects.length} Courses</Badge>
          </div>
          <AttendanceAreaChart data={chartData} />
        </Card>

        {/* AI Attendance Advisory Card */}
        <Card className="border border-purple-500/30 bg-purple-950/20 shadow-ai-glow flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-purple-300 font-bold mb-3">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>AI Attendance Risk Recovery</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {isAttendanceRisk
                ? 'Your attendance has dropped below 75% in one or more core courses. To avoid debarment from final examinations, attend the next 4 consecutive lectures without unexcused absence.'
                : 'Your attendance is safely above the institutional 75% benchmark. Maintaining this momentum contributes positively to your overall academic risk index.'}
            </p>
          </div>

          <div className="pt-4 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Threshold: 75%</span>
            <span className="font-mono text-emerald-400 font-bold">Rule ID: ATT-2025</span>
          </div>
        </Card>
      </div>

      {/* 4. SUBJECT-WISE BREAKDOWN CARDS */}
      <div className="space-y-3">
        <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-sky-400" />
          <span>Subject Attendance Summaries</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map((sub: any) => (
            <Card
              key={sub.courseId}
              className={cn(
                'p-4 border transition-all',
                sub.percentage < 75 ? 'border-rose-500/40 bg-rose-950/20' : 'border-slate-800 bg-slate-900/80'
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs font-bold text-sky-400">{sub.courseCode}</span>
                <Badge variant={sub.percentage < 75 ? 'danger' : 'success'} size="sm">
                  {sub.percentage}% Attendance
                </Badge>
              </div>

              <h4 className="font-bold text-white text-sm mb-3">{sub.courseName}</h4>

              <div className="grid grid-cols-3 gap-2 text-center text-xs p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                <div>
                  <div className="text-emerald-400 font-bold">{sub.presentCount}</div>
                  <div className="text-[10px] text-slate-500">Present</div>
                </div>
                <div>
                  <div className="text-amber-400 font-bold">{sub.lateCount}</div>
                  <div className="text-[10px] text-slate-500">Late</div>
                </div>
                <div>
                  <div className="text-rose-400 font-bold">{sub.absentCount}</div>
                  <div className="text-[10px] text-slate-500">Absent</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* 5. RECENT ATTENDANCE HISTORY LOG */}
      <Card className="space-y-3">
        <h3 className="text-sm font-bold text-white">Recent Attendance Sessions Log</h3>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Course</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3">Instructor Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {history.map((rec: any) => (
                <tr key={rec.id} className="hover:bg-slate-900/50">
                  <td className="py-2.5 px-3 font-mono text-slate-300">{rec.date}</td>
                  <td className="py-2.5 px-3">
                    <span className="font-bold text-white">{rec.course_code}</span> — {rec.course_name}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span
                      className={cn(
                        'px-2 py-0.5 rounded-full text-[10px] font-bold uppercase inline-block',
                        rec.status === 'PRESENT' && 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
                        rec.status === 'LATE' && 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
                        rec.status === 'ABSENT' && 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                      )}
                    >
                      {rec.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-400">{rec.remarks || 'Standard session attendance'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Marker Modal for Teachers */}
      <AttendanceMarkerModal
        isOpen={isMarkerModalOpen}
        onClose={() => setIsMarkerModalOpen(false)}
        courseId={selectedCourseForMarker.id}
        courseName={selectedCourseForMarker.name}
        courseCode={selectedCourseForMarker.code}
        onSuccess={loadAttendance}
      />
    </div>
  );
};
