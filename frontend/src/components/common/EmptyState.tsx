import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Records Found',
  description = 'There are no active records matching your current filter criteria.',
  icon = <Inbox className="w-8 h-8 text-slate-500" />,
  actionLabel,
  onAction,
}) => {
  return (
    <Card className="p-10 flex flex-col items-center justify-center text-center max-w-md mx-auto my-6 border border-dashed border-slate-800">
      <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 mb-3">
        {icon}
      </div>
      <h4 className="text-sm font-bold text-white mb-1">{title}</h4>
      <p className="text-xs text-slate-400 mb-4">{description}</p>
      {actionLabel && onAction && (
        <Button size="sm" variant="outline" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </Card>
  );
};
