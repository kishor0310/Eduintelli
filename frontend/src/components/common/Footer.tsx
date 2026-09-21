import React from 'react';
import { Link } from 'react-router-dom';
import { Brain } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-950/90 text-slate-500 dark:text-slate-400 text-xs py-8 px-4 lg:px-8 no-print transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md">
            <Brain className="w-4 h-4" />
          </div>
          <div>
            <span className="font-extrabold text-slate-900 dark:text-slate-200 text-sm">EduIntelli</span>
            <span className="block text-[10px] text-slate-500 dark:text-slate-400">AI Academic Intelligence Platform</span>
          </div>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center justify-center gap-5 text-xs text-slate-600 dark:text-slate-300">
          <Link to="/" className="hover:text-brand-600 dark:hover:text-white transition-colors">Home</Link>
          <Link to="/courses" className="hover:text-brand-600 dark:hover:text-white transition-colors">Course Catalog</Link>
          <Link to="/contact" className="hover:text-brand-600 dark:hover:text-white transition-colors">Contact & Advisory</Link>
          <Link to="/reports" className="hover:text-brand-600 dark:hover:text-white transition-colors">Performance Dossier</Link>
          <Link to="/login" className="hover:text-brand-600 dark:hover:text-white transition-colors">Demo Login</Link>
        </div>

        {/* Disclaimer & Engine Status */}
        <div className="text-center md:text-right space-y-1">
          <div className="flex items-center justify-center md:justify-end gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>AI Risk Engine v1.0 Operational</span>
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400">
            Explainable Academic Early-Intervention & Student Retention
          </p>
        </div>
      </div>
    </footer>
  );
};
