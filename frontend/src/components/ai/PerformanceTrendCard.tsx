import React from 'react';
import { Card } from '../ui/Card';
import { TrendingUp, TrendingDown, Activity, Sparkles } from 'lucide-react';
import { cn } from '../../utils/cn';

interface PerformanceTrendCardProps {
  trendDelta: number; // e.g. +8% or -14%
  recentTitle?: string;
  summary: string;
}

export const PerformanceTrendCard: React.FC<PerformanceTrendCardProps> = ({
  trendDelta,
  recentTitle = 'Academic Momentum & Velocity',
  summary,
}) => {
  const isPositive = trendDelta >= 0;

  return (
    <Card className="p-4 border border-slate-800 bg-slate-900/80">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-slate-800 text-slate-300">
            <Activity className="w-4 h-4 text-sky-400" />
          </div>
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">{recentTitle}</span>
        </div>
        <div
          className={cn(
            'flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full border',
            isPositive
              ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
              : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
          )}
        >
          {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
          <span>{isPositive ? `+${trendDelta}%` : `${trendDelta}%`}</span>
        </div>
      </div>

      <p className="text-xs text-slate-300 leading-relaxed mt-2">{summary}</p>
    </Card>
  );
};
