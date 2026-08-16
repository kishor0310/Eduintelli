import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  BookOpen,
  CalendarCheck,
  FileCheck2,
  GraduationCap,
  FileSpreadsheet,
  Clock,
  Users,
  Shield,
  Sparkles,
  BarChart3,
  AlertTriangle,
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const role = user?.role || 'STUDENT';

  // Navigation Links definition per role
  const navItems = {
    STUDENT: [
      { to: '/student/dashboard', label: 'Overview & Risk', icon: <LayoutDashboard className="w-4 h-4" /> },
      { to: '/courses', label: 'My Courses', icon: <BookOpen className="w-4 h-4" /> },
      { to: '/attendance', label: 'Attendance Tracker', icon: <CalendarCheck className="w-4 h-4" /> },
      { to: '/assignments', label: 'Assignments', icon: <FileCheck2 className="w-4 h-4" /> },
      { to: '/examinations', label: 'Exams & Grades', icon: <GraduationCap className="w-4 h-4" /> },
      { to: '/reports', label: 'Performance Report', icon: <FileSpreadsheet className="w-4 h-4" /> },
    ],
    TEACHER: [
      { to: '/teacher/dashboard', label: 'Teacher Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
      { to: '/attendance', label: 'Mark Attendance', icon: <CalendarCheck className="w-4 h-4" /> },
      { to: '/assignments', label: 'Assignments & Grading', icon: <FileCheck2 className="w-4 h-4" /> },
      { to: '/examinations', label: 'Exams & Gradebook', icon: <GraduationCap className="w-4 h-4" /> },
      { to: '/courses', label: 'Course Catalog', icon: <BookOpen className="w-4 h-4" /> },
      { to: '/reports', label: 'Student Dossiers', icon: <FileSpreadsheet className="w-4 h-4" /> },
    ],
    ADMIN: [
      { to: '/admin/dashboard', label: 'Executive Analytics', icon: <LayoutDashboard className="w-4 h-4" /> },
      { to: '/courses', label: 'Manage Courses', icon: <BookOpen className="w-4 h-4" /> },
      { to: '/attendance', label: 'Attendance Audits', icon: <CalendarCheck className="w-4 h-4" /> },
      { to: '/examinations', label: 'Exam Benchmark', icon: <GraduationCap className="w-4 h-4" /> },
      { to: '/reports', label: 'Institutional Reports', icon: <FileSpreadsheet className="w-4 h-4" /> },
    ],
  };

  const currentNav = navItems[role] || navItems.STUDENT;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Aside */}
      <aside
        className={cn(
          'fixed lg:sticky top-16 left-0 z-30 w-64 h-[calc(100vh-4rem)] bg-slate-950/90 border-r border-slate-800/80 flex flex-col justify-between p-4 transition-transform duration-200 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="space-y-6">
          {/* Active Portal Badge */}
          <div className="p-3 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-900/60 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Current Portal</div>
              <div className="font-extrabold text-sm text-white flex items-center gap-1.5 mt-0.5">
                {role === 'STUDENT' && <GraduationCap className="w-4 h-4 text-emerald-400" />}
                {role === 'TEACHER' && <Users className="w-4 h-4 text-sky-400" />}
                {role === 'ADMIN' && <Shield className="w-4 h-4 text-purple-400" />}
                <span>{role === 'STUDENT' ? 'Student Intelligence' : role === 'TEACHER' ? 'Faculty Command' : 'Admin Executive'}</span>
              </div>
            </div>
          </div>

          {/* Nav List */}
          <nav className="space-y-1">
            <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
              Navigation
            </div>
            {currentNav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150',
                    isActive
                      ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  )
                }
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Bottom AI Status Badge */}
        <div className="p-3 rounded-2xl bg-purple-950/20 border border-purple-500/25 text-xs text-slate-300">
          <div className="flex items-center gap-2 text-purple-300 font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>AI Diagnostic Online</span>
          </div>
          <p className="text-[10px] text-slate-400 leading-tight">
            Early intervention heuristics & predictive modeling active.
          </p>
        </div>
      </aside>
    </>
  );
};
