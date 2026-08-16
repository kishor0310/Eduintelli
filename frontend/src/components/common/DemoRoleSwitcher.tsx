import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { Sparkles, User, GraduationCap, Shield, UserCheck, AlertTriangle } from 'lucide-react';

export const DemoRoleSwitcher: React.FC = () => {
  const { user, quickLoginAs } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleSwitch = async (role: 'STUDENT' | 'TEACHER' | 'ADMIN', studentId?: string, label?: string) => {
    try {
      await quickLoginAs(role, studentId);
      toast.success(`Switched Persona`, `Now viewing platform as ${label || role}`);
      if (role === 'STUDENT') navigate('/student/dashboard');
      else if (role === 'TEACHER') navigate('/teacher/dashboard');
      else if (role === 'ADMIN') navigate('/admin/dashboard');
    } catch {
      toast.error('Failed to switch role');
    }
  };

  return (
    <div className="bg-slate-900/90 backdrop-blur-md border-b border-purple-500/30 px-3 py-1.5 flex flex-wrap items-center justify-between gap-2 text-xs z-40 sticky top-0 shadow-lg">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 font-bold text-purple-300">
          <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
          <span className="hidden sm:inline font-mono uppercase tracking-wider text-[11px]">Judge Demo Switcher:</span>
        </div>
        <span className="text-slate-400 text-[11px]">
          Current: <strong className="text-white">{user?.name || 'Guest'} ({user?.role || 'None'})</strong>
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => handleSwitch('STUDENT', 'std-01', 'Alex Rivera (Low Risk)')}
          className="px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 font-medium transition-all flex items-center gap-1 text-[11px]"
        >
          <GraduationCap className="w-3 h-3 text-emerald-400" />
          <span>Student: Alex (Low Risk)</span>
        </button>

        <button
          onClick={() => handleSwitch('STUDENT', 'std-02', 'Jordan Hayes (High Risk - At Risk)')}
          className="px-2.5 py-1 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 font-medium transition-all flex items-center gap-1 text-[11px]"
        >
          <AlertTriangle className="w-3 h-3 text-rose-400" />
          <span>Student: Jordan (High Risk)</span>
        </button>

        <button
          onClick={() => handleSwitch('TEACHER', undefined, 'Prof. Alan Turing (Teacher)')}
          className="px-2.5 py-1 rounded-lg bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 border border-sky-500/30 font-medium transition-all flex items-center gap-1 text-[11px]"
        >
          <UserCheck className="w-3 h-3 text-sky-400" />
          <span>Teacher Portal</span>
        </button>

        <button
          onClick={() => handleSwitch('ADMIN', undefined, 'Dr. Sarah Jenkins (Admin)')}
          className="px-2.5 py-1 rounded-lg bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 border border-purple-500/30 font-medium transition-all flex items-center gap-1 text-[11px]"
        >
          <Shield className="w-3 h-3 text-purple-400" />
          <span>Admin Portal</span>
        </button>
      </div>
    </div>
  );
};
