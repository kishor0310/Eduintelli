import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { SpeakButton } from '../voice/SpeakButton';
import { Recommendation } from '../../types';
import { Check, Calendar, Flame, Clock } from 'lucide-react';
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
    HIGH: { badge: 'danger' as const, icon: <Flame className="w-3.5 h-3.5 text-rose-500" /> },
    MEDIUM: { badge: 'warning' as const, icon: <Clock className="w-3.5 h-3.5 text-amber-500" /> },
    LOW: { badge: 'info' as const, icon: <Calendar className="w-3.5 h-3.5 text-sky-500" /> },
  };

  const pConfig = priorityConfig[recommendation.priority] || priorityConfig.MEDIUM;
  const spokenText = `${recommendation.title}. Action item: ${recommendation.action_item}. Target completion in ${recommendation.target_days} days.`;

  return (
    <Card
      className={cn(
        'transition-all duration-200 border p-4',
        isDone
          ? 'opacity-60 bg-slate-100/60 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800'
          : 'hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-xs'
      )}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <Badge variant={pConfig.badge} size="sm" className="gap-1">
            {pConfig.icon}
            <span>{recommendation.priority} Priority</span>
          </Badge>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>Target: {recommendation.target_days} Days</span>
          </span>
        </div>

        <div className="flex items-center gap-1">
          <SpeakButton text={spokenText} title={recommendation.title} size="icon" />

          {/* Completion Checkbox Button */}
          <button
            onClick={handleToggle}
            className={cn(
              'w-6 h-6 rounded-lg flex items-center justify-center border transition-all duration-200',
              isDone
                ? 'bg-emerald-500 border-emerald-400 text-white'
                : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 bg-slate-50 dark:bg-slate-800/80 text-transparent'
            )}
            title={isDone ? 'Mark Incomplete' : 'Mark Completed'}
          >
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </button>
        </div>
      </div>

      <h4 className={cn('text-sm font-bold text-slate-900 dark:text-white mb-1', isDone && 'line-through text-slate-400 dark:text-slate-500')}>
        {recommendation.title}
      </h4>
      <p className={cn('text-xs text-slate-600 dark:text-slate-300 leading-relaxed', isDone && 'line-through text-slate-400 dark:text-slate-500')}>
        {recommendation.action_item}
      </p>
    </Card>
  );
};
