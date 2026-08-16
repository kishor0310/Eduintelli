import React from 'react';
import { cn } from '../../utils/cn';

export interface ProgressProps {
  value: number; // 0 - 100
  max?: number;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'ai' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  variant = 'default',
  size = 'md',
  showLabel = false,
  className,
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const variants = {
    default: 'bg-brand-500',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-rose-500',
    ai: 'bg-purple-500',
    gradient: 'bg-gradient-to-r from-purple-500 to-sky-400',
  };

  const sizes = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between text-xs text-slate-400 mb-1">
          <span>Progress</span>
          <span className="font-semibold text-slate-200">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={cn('w-full bg-slate-800/80 rounded-full overflow-hidden p-0.5 border border-slate-700/50', sizes[size])}>
        <div
          className={cn('h-full rounded-full transition-all duration-500 ease-out', variants[variant])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
