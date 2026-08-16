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
    default: 'bg-slate-800/80 text-slate-300 border-slate-700',
    primary: 'bg-brand-500/15 text-brand-400 border-brand-500/30',
    success: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    warning: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    danger: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    ai: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  };

  return (
    <Card
      className={cn(
        'flex flex-col justify-between cursor-default transition-all duration-200',
        onClick && 'cursor-pointer hover:border-slate-600 hover:scale-[1.01]',
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</span>
        {icon && (
          <div className={cn('p-2.5 rounded-xl border', iconBackgrounds[variant])}>
            {icon}
          </div>
        )}
      </div>

      <div>
        <div className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">{value}</div>
        {(subtitle || trend) && (
          <div className="flex items-center gap-2 mt-1.5 text-xs">
            {trend && (
              <span
                className={cn(
                  'font-semibold px-1.5 py-0.5 rounded-md',
                  trend.isPositive ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'
                )}
              >
                {trend.isPositive ? '↑ +' : '↓ '}{trend.value}
              </span>
            )}
            {subtitle && <span className="text-slate-400">{subtitle}</span>}
          </div>
        )}
      </div>
    </Card>
  );
};
