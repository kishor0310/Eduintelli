import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useVoiceAssistant } from '../../context/VoiceAssistantContext';
import { useNavigate } from 'react-router-dom';
import { Sparkles, GraduationCap, Shield, UserCheck, AlertTriangle, Volume2 } from 'lucide-react';

export const DemoRoleSwitcher: React.FC = () => {
  const { user, quickLoginAs } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const { speak } = useVoiceAssistant();

  const handleSwitch = async (role: 'STUDENT' | 'TEACHER' | 'ADMIN', studentId?: string, label?: string) => {
    try {
      await quickLoginAs(role, studentId);
      toast.success(`Switched Persona`, `Now viewing platform as ${label || role}`);
      if (role === 'STUDENT') {
        navigate('/student/dashboard');
        if (studentId === 'std-02') {
          speak(
            'Persona switched to Jordan Hayes. Early intervention warning active: multi-factor risk score is 69 out of 100 with critical attendance and assignment deficits in Discrete Mathematics.',
            'Jordan Hayes (At-Risk)'
          );
        } else {
          speak(
            'Persona switched to Alex Rivera. All academic indicators are green with a Low risk score of 12 out of 100.',
            'Alex Rivera (Low Risk)'
          );
        }
      } else if (role === 'TEACHER') {
        navigate('/teacher/dashboard');
        speak(
          'Persona switched to Professor Alan Turing. 3 students currently flagged in your class roster requiring immediate intervention.',
          'Faculty Command Center'
        );
      } else if (role === 'ADMIN') {
        navigate('/admin/dashboard');
        speak(
          'Persona switched to Dr. Sarah Jenkins. Institutional executive analytics loaded with 94.2% overall retention.',
          'Executive Analytics'
        );
      }
    } catch {
      toast.error('Failed to switch role');
    }
  };

  return (
    <div className="bg-slate-100/95 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-purple-500/30 px-3 py-1.5 flex flex-wrap items-center justify-between gap-2 text-xs z-40 sticky top-0 shadow-xs transition-colors duration-200">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 font-bold text-purple-700 dark:text-purple-300">
          <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 animate-pulse" />
          <span className="hidden sm:inline font-mono uppercase tracking-wider text-[11px]">Judge Demo Switcher:</span>
        </div>
        <span className="text-slate-600 dark:text-slate-400 text-[11px]">
          Current: <strong className="text-slate-900 dark:text-white font-bold">{user?.name || 'Guest'} ({user?.role || 'None'})</strong>
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => handleSwitch('STUDENT', 'std-01', 'Alex Rivera (Low Risk)')}
          className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-500/15 dark:hover:bg-emerald-500/25 dark:text-emerald-300 dark:border-emerald-500/30 font-medium transition-all flex items-center gap-1 text-[11px]"
        >
          <GraduationCap className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
          <span>Student: Alex (Low Risk)</span>
        </button>

        <button
          onClick={() => handleSwitch('STUDENT', 'std-02', 'Jordan Hayes (High Risk - At Risk)')}
          className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 dark:bg-rose-500/15 dark:hover:bg-rose-500/25 dark:text-rose-300 dark:border-rose-500/30 font-medium transition-all flex items-center gap-1 text-[11px]"
        >
          <AlertTriangle className="w-3 h-3 text-rose-600 dark:text-rose-400" />
          <span>Student: Jordan (High Risk)</span>
        </button>

        <button
          onClick={() => handleSwitch('TEACHER', undefined, 'Prof. Alan Turing (Teacher)')}
          className="px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-300 dark:bg-sky-500/15 dark:hover:bg-sky-500/25 dark:text-sky-300 dark:border-sky-500/30 font-medium transition-all flex items-center gap-1 text-[11px]"
        >
          <UserCheck className="w-3 h-3 text-sky-600 dark:text-sky-400" />
          <span>Teacher Portal</span>
        </button>

        <button
          onClick={() => handleSwitch('ADMIN', undefined, 'Dr. Sarah Jenkins (Admin)')}
          className="px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-300 dark:bg-purple-500/15 dark:hover:bg-purple-500/25 dark:text-purple-300 dark:border-purple-500/30 font-medium transition-all flex items-center gap-1 text-[11px]"
        >
          <Shield className="w-3 h-3 text-purple-600 dark:text-purple-400" />
          <span>Admin Portal</span>
        </button>
      </div>
    </div>
  );
};
