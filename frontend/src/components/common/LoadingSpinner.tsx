import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';

export const LoadingSpinner: React.FC<{ message?: string }> = ({
  message = 'Analyzing Academic Records & Compiling AI Intelligence...',
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center space-y-3 min-h-[300px]">
      <div className="relative">
        <Loader2 className="w-10 h-10 animate-spin text-brand-500" />
        <Sparkles className="w-4 h-4 text-purple-400 absolute -top-1 -right-1 animate-pulse" />
      </div>
      <p className="text-xs font-semibold text-slate-300 max-w-xs">{message}</p>
    </div>
  );
};
