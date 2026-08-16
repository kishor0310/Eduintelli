import React from 'react';
import { Brain, Shield, Sparkles, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/80 text-slate-400 text-xs py-8 px-4 lg:px-8 no-print">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-brand-600 flex items-center justify-center text-white">
            <Brain className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-slate-200">EduIntelli Academic Intelligence Platform</span>
        </div>

        {/* Disclaimer / Notice */}
        <div className="text-center md:text-left text-[11px] text-slate-500 max-w-md">
          Risk scores and recommendations are academic-support heuristics designed for early proactive intervention.
        </div>

        {/* Status */}
        <div className="flex items-center gap-2 text-[11px]">
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            AI Engine v1.0.0 Ready
          </span>
        </div>
      </div>
    </footer>
  );
};
