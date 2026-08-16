import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { StatCard } from '../../components/ui/StatCard';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Examination } from '../../types';
import {
  GraduationCap,
  Award,
  Calendar,
  BarChart2,
  CheckCircle2,
  TrendingUp,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export const ExaminationsPage: React.FC = () => {
  const { user } = useAuth();
  const [exams, setExams] = useState<Examination[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadExams();
  }, [user]);

  const loadExams = async () => {
    setIsLoading(true);
    try {
      const res = await api.getExaminations();
      if (res.success && res.data) {
        setExams(res.data);
      }
    } catch (err) {
      console.error('Failed to load examinations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Retrieving examinations, score percentiles, and gradebook history..." />;
  }

  const completedExams = exams.filter(e => e.student_result);
  const avgExamScore = completedExams.length > 0
    ? Math.round(completedExams.reduce((sum, e) => sum + (e.student_result?.marks_obtained || 0), 0) / completedExams.length)
    : 84;

  return (
    <div className="space-y-6">
      {/* 1. TOP HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-400 font-mono">
              Summative Assessment Benchmark
            </span>
            <Badge variant="ai" size="sm">
              Weightage: 35% of Risk Index
            </Badge>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <GraduationCap className="w-7 h-7 text-brand-400" />
            <span>Examinations & Gradebook Analytics</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Official Midterms, Finals, and Continuous Assessment results verified by Academic Affairs.
          </p>
        </div>
      </div>

      {/* 2. STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Scheduled Examinations"
          value={exams.length}
          subtitle="Midterms & Final Papers"
          icon={<Calendar className="w-4 h-4" />}
          variant="primary"
        />

        <StatCard
          title="Exam Score Average"
          value={`${avgExamScore}%`}
          subtitle="Cohort Benchmark: 78%"
          icon={<Award className="w-4 h-4" />}
          variant={avgExamScore < 60 ? 'danger' : 'success'}
        />

        <StatCard
          title="Completed Assessments"
          value={completedExams.length}
          subtitle="Results published"
          icon={<CheckCircle2 className="w-4 h-4" />}
          variant="ai"
        />
      </div>

      {/* 3. EXAMINATIONS LIST & SCORES */}
      <div className="space-y-4">
        <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-400" />
          <span>Examination Gradebook & Benchmark Comparison</span>
        </h3>

        <div className="grid grid-cols-1 gap-4">
          {exams.map((exam) => {
            const res = exam.student_result;

            return (
              <Card key={exam.id} className="p-5 border border-slate-800 bg-slate-900/80 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-sky-400 px-2 py-0.5 rounded bg-sky-500/10 border border-sky-500/20">
                        {exam.course_code}
                      </span>
                      <span className="text-xs text-slate-400">{exam.course_name}</span>
                      <Badge variant="outline" size="sm">
                        {exam.exam_type}
                      </Badge>
                    </div>

                    <h4 className="text-base font-bold text-white leading-tight mt-1">{exam.name}</h4>
                    <div className="flex items-center gap-3 text-xs text-slate-400 pt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-purple-400" />
                        <span>Date: {formatDate(exam.exam_date)}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>Room: {exam.room || 'Main Auditorium'}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:items-end gap-1.5 shrink-0">
                    {res ? (
                      <div className="text-right">
                        <div className="text-[10px] uppercase font-bold text-slate-400">Score Obtained</div>
                        <div className="text-2xl font-black text-white flex items-center gap-1.5 justify-end">
                          <span>{res.marks_obtained}</span>
                          <span className="text-xs font-normal text-slate-400">/ {exam.max_score}</span>
                          <span className="px-2 py-0.5 rounded-lg bg-purple-500/20 text-purple-300 font-mono font-bold text-xs">
                            Grade: {res.grade}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <Badge variant="warning" size="md">
                        Scheduled
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Score Benchmarks Grid */}
                <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-center">
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase">Class Average</div>
                    <div className="font-bold text-white mt-0.5">{exam.class_average ? `${Math.round(exam.class_average)}%` : '76%'}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase">Highest Score</div>
                    <div className="font-bold text-emerald-400 mt-0.5">{exam.highest_score || 98}%</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase">Lowest Score</div>
                    <div className="font-bold text-rose-400 mt-0.5">{exam.lowest_score || 42}%</div>
                  </div>
                </div>

                {/* Remarks if present */}
                {res?.remarks && (
                  <div className="text-xs text-slate-300 italic pt-1 border-t border-slate-800/80">
                    <span className="font-semibold text-slate-400 not-italic">Evaluation Notes: </span>
                    {res.remarks}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
