import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Recommendation } from '../../types';
import { Check, Calendar, ArrowUpRight, Flame, Clock } from 'lucide-react';
import { cn } from '../../utils/cn';
import confetti from 'canvas-confetti';

interface RecommendationCardProps {
  recommendation: Recommendation;
  onComplete?: (id?: string) => void;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  onComplete,
}) => {
  const [isDone, setIsDone] = useState(recommendation.is_completed || false);

  const handleToggle = () => {
    const nextState = !isDone;
    setIsDone(nextState);
    if (nextState) {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
      });
    }
    if (onComplete) {
      onComplete(recommendation.id);
    }
  };

  const priorityConfig = {
    HIGH: { badge: 'danger' as const, icon: <Flame className="w-3.5 h-3.5 text-rose-400" /> },
    MEDIUM: { badge: 'warning' as const, icon: <Clock className="w-3.5 h-3.5 text-amber-400" /> },
    LOW: { badge: 'info' as const, icon: <Calendar className="w-3.5 h-3.5 text-sky-400" /> },
  };

  const pConfig = priorityConfig[recommendation.priority] || priorityConfig.MEDIUM;

  return (
    <Card
      className={cn(
        'transition-all duration-200 border border-slate-800 p-4',
        isDone ? 'opacity-60 bg-slate-950/60' : 'hover:border-slate-700 bg-slate-900/80'
      )}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <Badge variant={pConfig.badge} size="sm" className="gap-1">
            {pConfig.icon}
            <span>{recommendation.priority} Priority</span>
          </Badge>
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>Target: {recommendation.target_days} Days</span>
          </span>
        </div>

        {/* Completion Checkbox Button */}
        <button
          onClick={handleToggle}
          className={cn(
            'w-6 h-6 rounded-lg flex items-center justify-center border transition-all duration-200',
            isDone
              ? 'bg-emerald-500 border-emerald-400 text-white'
              : 'border-slate-700 hover:border-slate-500 bg-slate-800/80 text-transparent'
          )}
          title={isDone ? 'Mark Incomplete' : 'Mark Completed'}
        >
          <Check className="w-3.5 h-3.5 stroke-[3]" />
        </button>
      </div>

      <h4 className={cn('text-sm font-bold text-white mb-1', isDone && 'line-through text-slate-400')}>
        {recommendation.title}
      </h4>
      <p className={cn('text-xs text-slate-300 leading-relaxed', isDone && 'line-through text-slate-500')}>
        {recommendation.action_item}
      </p>
    </Card>
  );
};
