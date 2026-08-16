import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Brain, Sparkles, GraduationCap, Users, Shield, ArrowRight, Lock, Mail, AlertTriangle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('student@demo.com');
  const [password, setPassword] = useState('Demo@123');
  const [isLoading, setIsLoading] = useState(false);
  const { login, quickLoginAs } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/student/dashboard');
    } catch (err: any) {
      toast.error('Authentication Error', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemo = async (role: 'STUDENT' | 'TEACHER' | 'ADMIN', studentId?: string, label?: string) => {
    setIsLoading(true);
    try {
      await quickLoginAs(role, studentId);
      toast.success('Demo Access Granted', `Logged in as ${label}`);
      if (role === 'STUDENT') navigate('/student/dashboard');
      else if (role === 'TEACHER') navigate('/teacher/dashboard');
      else if (role === 'ADMIN') navigate('/admin/dashboard');
    } catch (err: any) {
      toast.error('Quick login failed', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-purple-600 text-white shadow-xl shadow-brand-500/20 mb-1">
            <Brain className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Log in to EduIntelli</h2>
          <p className="text-xs text-slate-400">
            Access your AI academic dashboard, risk analytics, and early interventions.
          </p>
        </div>

        {/* 1-Click Quick Demo Login Box */}
        <Card className="border border-purple-500/40 bg-purple-950/20 p-4 space-y-3 shadow-ai-glow">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold text-xs text-purple-300">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>1-Click Hackathon Judge Login</span>
            </div>
            <Badge variant="ai" size="sm">Demo Mode</Badge>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleQuickDemo('STUDENT', 'std-01', 'Alex Rivera (Low Risk)')}
              className="justify-start gap-1.5 text-[11px] hover:border-emerald-500"
            >
              <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
              <span className="truncate">Student (Low Risk)</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleQuickDemo('STUDENT', 'std-02', 'Jordan Hayes (High Risk)')}
              className="justify-start gap-1.5 text-[11px] hover:border-rose-500"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span className="truncate">Student (At-Risk)</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleQuickDemo('TEACHER', undefined, 'Prof. Alan Turing')}
              className="justify-start gap-1.5 text-[11px] hover:border-sky-500"
            >
              <Users className="w-3.5 h-3.5 text-sky-400" />
              <span className="truncate">Teacher Portal</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleQuickDemo('ADMIN', undefined, 'Dr. Sarah Jenkins')}
              className="justify-start gap-1.5 text-[11px] hover:border-purple-500"
            >
              <Shield className="w-3.5 h-3.5 text-purple-400" />
              <span className="truncate">Admin Portal</span>
            </Button>
          </div>
        </Card>

        {/* Standard Login Form */}
        <Card className="border border-slate-800 p-6 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@demo.com"
                  className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                  required
                />
              </div>
            </div>

            <Button type="submit" variant="primary" size="md" isLoading={isLoading} className="w-full mt-2">
              Sign In to Platform
            </Button>
          </form>

          <div className="text-center pt-2 text-xs text-slate-400 border-t border-slate-800">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-brand-400 font-bold hover:underline">
              Create an Account
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
