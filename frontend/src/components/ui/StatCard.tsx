import React from 'react';
import { Card } from './Card';
import { cn } from '../../utils/cn';

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: string | number;
    isPositive: boolean;
    label?: string;
  };
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'ai';
  className?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  variant = 'default',
  className,
  onClick,
}) => {
  const iconBackgrounds = {
    default: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800/80 dark:text-slate-300 dark:border-slate-700',
    primary: 'bg-brand-50 text-brand-600 border-brand-200 dark:bg-brand-500/15 dark:text-brand-400 dark:border-brand-500/30',
    success: 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/30',
    warning: 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-500/15 dark:text-amber-400 dark:border-amber-500/30',
    danger: 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-500/15 dark:text-rose-400 dark:border-rose-500/30',
    ai: 'bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-500/20 dark:text-purple-400 dark:border-purple-500/30',
  };

  return (
    <Card
      className={cn(
        'flex flex-col justify-between cursor-default transition-all duration-200',
        onClick && 'cursor-pointer hover:border-slate-400 dark:hover:border-slate-600 hover:scale-[1.01]',
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{title}</span>
        {icon && (
          <div className={cn('p-2.5 rounded-xl border', iconBackgrounds[variant])}>
            {icon}
          </div>
        )}
      </div>

      <div>
        <div className="text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{value}</div>
        {(subtitle || trend) && (
          <div className="flex items-center gap-2 mt-1.5 text-xs">
            {trend && (
              <span
                className={cn(
                  'font-semibold px-1.5 py-0.5 rounded-md border',
                  trend.isPositive
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/30'
                    : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/15 dark:text-rose-400 dark:border-rose-500/30'
                )}
              >
                {trend.isPositive ? '↑ +' : '↓ '}{trend.value}
              </span>
            )}
            {subtitle && <span className="text-slate-500 dark:text-slate-400">{subtitle}</span>}
          </div>
        )}
      </div>
    </Card>
  );
};
