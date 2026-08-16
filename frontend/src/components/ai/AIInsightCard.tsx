import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { AIInsight } from '../../types';
import { Sparkles, TrendingUp, AlertTriangle, CheckCircle, ShieldAlert, Award } from 'lucide-react';
import { cn } from '../../utils/cn';

interface AIInsightCardProps {
  insight: AIInsight;
  className?: string;
}

export const AIInsightCard: React.FC<AIInsightCardProps> = ({ insight, className }) => {
  const { title, description, category, severity, confidence_score } = insight;

  const severityConfig = {
    POSITIVE: {
      border: 'border-emerald-500/30 bg-emerald-950/20',
      badge: 'success' as const,
      icon: <Award className="w-4 h-4 text-emerald-400" />,
      label: 'Achievement Milestone',
    },
    CRITICAL: {
      border: 'border-rose-500/40 bg-rose-950/20',
      badge: 'danger' as const,
      icon: <ShieldAlert className="w-4 h-4 text-rose-400" />,
      label: 'Critical Alert',
    },
    WARNING: {
      border: 'border-amber-500/30 bg-amber-950/20',
      badge: 'warning' as const,
      icon: <AlertTriangle className="w-4 h-4 text-amber-400" />,
      label: 'Attention Needed',
    },
    INFO: {
      border: 'border-purple-500/30 bg-purple-950/20',
      badge: 'ai' as const,
      icon: <Sparkles className="w-4 h-4 text-purple-400" />,
      label: 'AI Diagnostic',
    },
  };

  const config = severityConfig[severity] || severityConfig.INFO;

  return (
    <Card className={cn('relative transition-all duration-200 border', config.border, className)}>
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 shrink-0">
            {config.icon}
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
            {config.label}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-slate-400 font-mono">
            {Math.round(confidence_score * 100)}% Conf.
          </span>
          <Badge variant={config.badge} size="sm">
            {category}
          </Badge>
        </div>
      </div>

      <h4 className="text-sm font-bold text-white mb-1 leading-snug">{title}</h4>
      <p className="text-xs text-slate-300 leading-relaxed">{description}</p>
    </Card>
  );
};
