import React from 'react';
import { cn } from '../../utils/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  isGlass?: boolean;
  isHoverable?: boolean;
  aiBorder?: boolean;
}

export const Card: React.FC<CardProps> = ({
  className,
  isGlass = true,
  isHoverable = false,
  aiBorder = false,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        'rounded-2xl p-5 relative overflow-hidden',
        isGlass && 'glass-card',
        isHoverable && 'glass-card-hover',
        aiBorder && 'border border-purple-500/30 shadow-ai-glow',
        !isGlass && 'bg-slate-900 border border-slate-800',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
