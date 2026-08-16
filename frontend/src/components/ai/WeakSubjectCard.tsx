import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { WeakSubjectAnalysis } from '../../types';
import { AlertCircle, CheckCircle2, TrendingDown, TrendingUp, BookOpen } from 'lucide-react';
import { cn } from '../../utils/cn';

interface WeakSubjectCardProps {
  subject: WeakSubjectAnalysis;
}

export const WeakSubjectCard: React.FC<WeakSubjectCardProps> = ({ subject }) => {
  const { courseCode, courseName, scorePercentage, attendancePercentage, priority, status, trendDelta, notes } = subject;

  const priorityVariants = {
    HIGH: {
      badge: 'danger' as const,
      border: 'border-rose-500/30',
      label: 'High Priority Attention',
      icon: <AlertCircle className="w-4 h-4 text-rose-400" />,
    },
    MEDIUM: {
      badge: 'warning' as const,
      border: 'border-amber-500/30',
      label: 'Medium Priority',
      icon: <AlertCircle className="w-4 h-4 text-amber-400" />,
    },
    LOW: {
      badge: status === 'Strong' ? ('success' as const) : ('info' as const),
      border: status === 'Strong' ? 'border-emerald-500/30' : 'border-slate-700',
      label: status === 'Strong' ? 'Mastery / Strength' : 'On Track',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
    },
  };

  const config = priorityVariants[priority] || priorityVariants.MEDIUM;

  return (
    <Card className={cn('p-4 border transition-all duration-200 bg-slate-900/80', config.border)}>
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300">
            <BookOpen className="w-4 h-4 text-brand-400" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white leading-tight">{courseName}</h4>
            <span className="text-[11px] font-mono text-slate-400">{courseCode}</span>
          </div>
        </div>
        <Badge variant={config.badge} size="sm">
          {config.label}
        </Badge>
      </div>

      {/* Progress / Scores */}
      <div className="grid grid-cols-2 gap-3 my-3 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs">
        <div>
          <div className="text-[10px] uppercase text-slate-400">Mastery Score</div>
          <div className="text-base font-extrabold text-white mt-0.5">{scorePercentage}%</div>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden mt-1">
            <div
              className={cn(
                'h-full rounded-full',
                scorePercentage < 60 ? 'bg-rose-500' : scorePercentage < 75 ? 'bg-amber-500' : 'bg-emerald-500'
              )}
              style={{ width: `${scorePercentage}%` }}
            />
          </div>
        </div>

        <div>
          <div className="text-[10px] uppercase text-slate-400">Attendance</div>
          <div className="text-base font-extrabold text-white mt-0.5">{attendancePercentage}%</div>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden mt-1">
            <div
              className={cn(
                'h-full rounded-full',
                attendancePercentage < 75 ? 'bg-rose-500' : 'bg-sky-400'
              )}
              style={{ width: `${attendancePercentage}%` }}
            />
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-300 mt-2 leading-relaxed">{notes}</p>
    </Card>
  );
};
