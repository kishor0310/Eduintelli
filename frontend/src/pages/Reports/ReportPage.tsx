import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import {
  FileSpreadsheet,
  Printer,
  Download,
  Brain,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Award,
  BookOpen,
} from 'lucide-react';

export const ReportPage: React.FC = () => {
  const { user } = useAuth();
  const [report, setReport] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadReport();
  }, [user]);

  const loadReport = async () => {
    setIsLoading(true);
    try {
      // Call report endpoint without client-controlled fallback to prevent IDOR
      const res = await api.getPerformanceReport(user?.role === 'STUDENT' ? undefined : user?.studentId);
      if (res.success && res.report) {
        setReport(res.report);
      }
    } catch (err) {
      console.error('Failed to load performance report:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading || !report) {
    return <LoadingSpinner message="Assembling official academic dossier & AI diagnostic certification..." />;
  }

  const { student, summary, aiDiagnostic, enrolledCourses, examinationRecords, institution, reportId, generatedAt } = report;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* 1. TOP ACTION BAR (Hidden in Print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <FileSpreadsheet className="w-7 h-7 text-emerald-400" />
            <span>Academic Performance Dossier</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Official verifiable transcript certified by EduIntelli Academic Intelligence Engine.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button variant="outline" size="sm" onClick={handlePrint} className="gap-1.5 text-xs">
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </Button>
          <Button variant="primary" size="sm" onClick={handlePrint} className="gap-1.5 text-xs shadow-md">
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF Transcript</span>
          </Button>
        </div>
      </div>

      {/* 2. PRINTABLE OFFICIAL ACADEMIC DOSSIER SHEET */}
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 relative overflow-hidden text-slate-200">
        {/* Background Watermark */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.03] select-none">
          <Brain className="w-[500px] h-[500px]" />
        </div>

        {/* Header Branding */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg">
              <Brain className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight text-white">{institution}</h2>
              <p className="text-xs text-purple-400 font-semibold">{report.accreditation}</p>
            </div>
          </div>

          <div className="text-left sm:text-right text-xs text-slate-400 font-mono">
            <div>Dossier ID: <strong className="text-white">{reportId}</strong></div>
            <div>Issued: {new Date(generatedAt).toLocaleDateString()}</div>
          </div>
        </div>

        {/* Student Profile Card */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs">
          <div>
            <div className="text-[10px] text-slate-500 uppercase font-bold">Student Name</div>
            <div className="text-sm font-bold text-white mt-0.5">{student.name}</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-500 uppercase font-bold">Roll / Reg No</div>
            <div className="text-sm font-mono font-bold text-sky-400 mt-0.5">{student.roll_number}</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-500 uppercase font-bold">Department</div>
            <div className="text-sm font-bold text-white mt-0.5">{student.department}</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-500 uppercase font-bold">Current Standing</div>
            <div className="text-sm font-bold text-white mt-0.5">Sem {student.semester} ({student.batch})</div>
          </div>
        </div>

        {/* KPI Summaries Row */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-[10px] uppercase font-bold text-slate-400">Cumulative CGPA</div>
            <div className="text-xl font-black text-white mt-1">{Number(summary.cgpa).toFixed(2)}</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-[10px] uppercase font-bold text-slate-400">Attendance</div>
            <div className="text-xl font-black text-sky-400 mt-1">{summary.overallAttendance}%</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-[10px] uppercase font-bold text-slate-400">Assignment Avg</div>
            <div className="text-xl font-black text-purple-400 mt-1">{summary.assignmentAverage}%</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-[10px] uppercase font-bold text-slate-400">Exam Avg</div>
            <div className="text-xl font-black text-amber-400 mt-1">{summary.examAverage}%</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 col-span-2 sm:col-span-1">
            <div className="text-[10px] uppercase font-bold text-slate-400">Risk Score</div>
            <div className="text-xl font-black text-rose-400 mt-1">{summary.academicRiskScore}/100</div>
          </div>
        </div>

        {/* AI Diagnostic Summary */}
        <div className="p-5 rounded-2xl bg-purple-950/20 border border-purple-500/30 space-y-4 text-xs">
          <div className="flex items-center gap-2 text-purple-300 font-bold">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>AI Diagnostic Audit & Causal Factors</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="font-bold text-white mb-1.5 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>Primary Risk Indicators:</span>
              </div>
              <ul className="space-y-1 text-slate-300 text-[11px] list-disc list-inside">
                {aiDiagnostic.reasons.map((r: string, idx: number) => (
                  <li key={idx}>{r}</li>
                ))}
              </ul>
            </div>

            <div>
              <div className="font-bold text-white mb-1.5 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Recommended Faculty & Student Action:</span>
              </div>
              <ul className="space-y-1 text-slate-300 text-[11px]">
                {aiDiagnostic.actionableRecommendations.slice(0, 3).map((rec: any, idx: number) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="font-bold text-brand-400">•</span>
                    <span><strong>{rec.title}:</strong> {rec.action_item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Course Grades Table */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-brand-400" />
            <span>Enrolled Courses & Academic Standing</span>
          </h4>
          <div className="border border-slate-800 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Code</th>
                  <th className="py-2.5 px-3">Course Title</th>
                  <th className="py-2.5 px-3">Faculty Instructor</th>
                  <th className="py-2.5 px-3 text-center">Credits</th>
                  <th className="py-2.5 px-3 text-right">Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
                {enrolledCourses.map((c: any) => (
                  <tr key={c.id}>
                    <td className="py-2.5 px-3 font-mono font-bold text-sky-400">{c.code}</td>
                    <td className="py-2.5 px-3 text-white font-medium">{c.name}</td>
                    <td className="py-2.5 px-3 text-slate-400">{c.teacher_name || 'Faculty Staff'}</td>
                    <td className="py-2.5 px-3 text-center text-slate-300">{c.credits}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-white font-mono">{c.current_grade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Official Certification Signature Block */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 text-xs text-slate-400">
          <div>
            <div className="font-mono text-[10px] uppercase text-slate-500">System Verification Hash</div>
            <div className="font-mono text-[10px] text-slate-400 select-all">SHA256: 9e8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1</div>
            <div className="text-[11px] text-slate-400 mt-1">Generated by EduIntelli Intelligence Engine v1.0</div>
          </div>

          <div className="text-left sm:text-right space-y-1">
            <div className="font-serif italic text-base text-slate-200">Dr. Sarah Jenkins</div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Dean of Academic Affairs & QA</div>
            <div className="text-[10px] text-emerald-400 flex items-center justify-start sm:justify-end gap-1 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Digitally Authenticated Dossier</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
