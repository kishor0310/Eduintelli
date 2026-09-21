import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { SpeakButton } from '../voice/SpeakButton';
import { AIInsight } from '../../types';
import { Sparkles, AlertTriangle, ShieldAlert, Award } from 'lucide-react';
import { cn } from '../../utils/cn';

interface AIInsightCardProps {
  insight: AIInsight;
  className?: string;
}

export const AIInsightCard: React.FC<AIInsightCardProps> = ({ insight, className }) => {
  const { title, description, category, severity, confidence_score } = insight;

  const severityConfig = {
    POSITIVE: {
      border: 'border-emerald-200 dark:border-emerald-500/30 bg-emerald-50/60 dark:bg-emerald-950/20',
      badge: 'success' as const,
      icon: <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
      label: 'Achievement Milestone',
    },
    CRITICAL: {
      border: 'border-rose-200 dark:border-rose-500/40 bg-rose-50/60 dark:bg-rose-950/20',
      badge: 'danger' as const,
      icon: <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400" />,
      label: 'Critical Alert',
    },
    WARNING: {
      border: 'border-amber-200 dark:border-amber-500/30 bg-amber-50/60 dark:bg-amber-950/20',
      badge: 'warning' as const,
      icon: <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />,
      label: 'Attention Needed',
    },
    INFO: {
      border: 'border-purple-200 dark:border-purple-500/30 bg-purple-50/60 dark:bg-purple-950/20',
      badge: 'ai' as const,
      icon: <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />,
      label: 'AI Diagnostic',
    },
  };

  const config = severityConfig[severity] || severityConfig.INFO;
  const spokenText = `${title}. ${description}`;

  return (
    <Card className={cn('relative transition-all duration-200 border shadow-xs', config.border, className)}>
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shrink-0">
            {config.icon}
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            {config.label}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
            {Math.round(confidence_score * 100)}% Conf.
          </span>
          <SpeakButton text={spokenText} title={title} size="icon" />
          <Badge variant={config.badge} size="sm">
            {category}
          </Badge>
        </div>
      </div>

      <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1 leading-snug">{title}</h4>
      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{description}</p>
    </Card>
  );
};
