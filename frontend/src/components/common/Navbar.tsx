import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useVoiceAssistant } from '../../context/VoiceAssistantContext';
import { Button } from '../ui/Button';
import { AICoachDrawer } from '../ai/AICoachDrawer';
import {
  Brain,
  Sparkles,
  Bell,
  LogOut,
  User,
  BookOpen,
  Calendar,
  Award,
  Menu,
  X,
  FileSpreadsheet,
  Sun,
  Moon,
  Volume2,
  Mic,
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface NavbarProps {
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { openAssistant, isSpeaking, isListening } = useVoiceAssistant();
  const [isCoachOpen, setIsCoachOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/80 backdrop-blur-md transition-colors duration-200 shadow-xs">
        <div className="flex items-center justify-between px-4 lg:px-6 h-16">
          {/* Brand / Logo */}
          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <button
                onClick={onToggleSidebar}
                className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
                  EduIntelli
                  <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 border border-purple-200 dark:bg-purple-500/20 dark:text-purple-400 dark:border-purple-500/30">
                    AI
                  </span>
                </span>
                <span className="block text-[9px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-medium">
                  Academic Intelligence
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links for Public View */}
          {!isAuthenticated && (
            <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600 dark:text-slate-300">
              <Link to="/courses" className="hover:text-brand-600 dark:hover:text-white transition-colors">Courses</Link>
              <a href="/#features" className="hover:text-brand-600 dark:hover:text-white transition-colors">Features</a>
              <a href="/#how-it-works" className="hover:text-brand-600 dark:hover:text-white transition-colors">How It Works</a>
              <a href="/#ai-engine" className="hover:text-brand-600 dark:hover:text-white transition-colors">AI Engine</a>
              <Link to="/contact" className="hover:text-brand-600 dark:hover:text-white transition-colors">Contact & FAQ</Link>
            </nav>
          )}

          {/* Right Action Controls */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle Button (Light / Dark) */}
            <button
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            {/* Voice Assistant Header Trigger Button */}
            <button
              onClick={openAssistant}
              title="Open EduIntelli Voice Assistant"
              className={cn(
                'flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition-all',
                isSpeaking || isListening
                  ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-500/25 animate-pulse'
                  : 'border-slate-200 dark:border-slate-800 bg-purple-50/70 text-purple-700 hover:bg-purple-100 dark:bg-purple-950/40 dark:text-purple-300 dark:hover:bg-purple-900/40'
              )}
            >
              {isSpeaking ? (
                <div className="flex items-center gap-0.5 h-3">
                  <span className="w-0.5 bg-white rounded-full animate-[soundWave_0.6s_ease-in-out_infinite]" />
                  <span className="w-0.5 bg-white rounded-full animate-[soundWave_0.6s_ease-in-out_0.2s_infinite]" />
                  <span className="w-0.5 bg-white rounded-full animate-[soundWave_0.6s_ease-in-out_0.4s_infinite]" />
                </div>
              ) : isListening ? (
                <Mic className="w-3.5 h-3.5 text-white animate-bounce" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              )}
              <span className="hidden sm:inline">Voice Assistant</span>
            </button>

            {isAuthenticated ? (
              <>
                {/* AI Coach Action Button */}
                <Button
                  variant="ai"
                  size="sm"
                  onClick={() => setIsCoachOpen(true)}
                  className="gap-1.5 text-xs shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">AI Coach</span>
                </Button>

                {/* Performance Report Quick Link */}
                <Link to="/reports">
                  <Button variant="outline" size="sm" className="hidden sm:flex gap-1.5 text-xs">
                    <FileSpreadsheet className="w-3.5 h-3.5 text-brand-500" />
                    <span>Report</span>
                  </Button>
                </Link>

                {/* User Avatar & Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-800"
                  >
                    <img
                      src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                      alt={user?.name || 'User'}
                      className="w-7 h-7 rounded-lg object-cover ring-1 ring-brand-500/40"
                    />
                    <span className="hidden md:inline text-xs font-semibold text-slate-700 dark:text-slate-200 pr-1">
                      {user?.name?.split(' ')[0]}
                    </span>
                  </button>

                  {/* Profile Dropdown Menu */}
                  {isProfileOpen && (
                    <div
                      className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 shadow-xl z-50 animate-in fade-in zoom-in-95 text-xs text-slate-800 dark:text-slate-100"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <div className="px-3 py-2 border-b border-slate-200 dark:border-slate-800 mb-1">
                        <div className="font-bold text-slate-900 dark:text-white truncate">{user?.name}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user?.email}</div>
                        <div className="text-[10px] text-purple-600 dark:text-purple-400 uppercase font-bold mt-1">Role: {user?.role}</div>
                      </div>

                      <Link
                        to={
                          user?.role === 'STUDENT' ? '/student/dashboard' :
                          user?.role === 'TEACHER' ? '/teacher/dashboard' : '/admin/dashboard'
                        }
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
                      >
                        <User className="w-4 h-4 text-brand-500" />
                        <span>My Dashboard</span>
                      </Link>

                      <Link
                        to="/courses"
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
                      >
                        <BookOpen className="w-4 h-4 text-sky-500" />
                        <span>Browse Courses</span>
                      </Link>

                      <Link
                        to="/reports"
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
                      >
                        <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                        <span>Performance Dossier</span>
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors mt-1 pt-2 border-t border-slate-200 dark:border-slate-800"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">Log In</Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">Get Started</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* AI Coach Drawer */}
      <AICoachDrawer
        isOpen={isCoachOpen}
        onClose={() => setIsCoachOpen(false)}
        studentName={user?.name?.split(' ')[0]}
      />
    </>
  );
};
