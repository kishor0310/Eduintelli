import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Brain, Lock, Mail, User, Building, BookOpen } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('Demo@123');
  const [role, setRole] = useState<'STUDENT' | 'TEACHER'>('STUDENT');
  const [department, setDepartment] = useState('Computer Science');
  const [rollNumber, setRollNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
          department,
          rollNumber: rollNumber || `CS2025-${Math.floor(100 + Math.random() * 900)}`,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || 'Registration failed');
      }

      toast.success('Registration Successful', 'Your academic account is now active.');
      await login(email, password);
      if (role === 'STUDENT') navigate('/student/dashboard');
      else navigate('/teacher/dashboard');
    } catch (err: any) {
      toast.error('Registration Failed', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-purple-600 text-white shadow-xl shadow-brand-500/20 mb-1">
            <Brain className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Create EduIntelli Account</h2>
          <p className="text-xs text-slate-400">
            Join the academic intelligence network for continuous early intervention.
          </p>
        </div>

        <Card className="border border-slate-800 p-6 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            {/* Role Switcher */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Select Role</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('STUDENT')}
                  className={`p-2.5 rounded-xl border font-bold transition-all ${
                    role === 'STUDENT'
                      ? 'border-brand-500 bg-brand-500/20 text-white'
                      : 'border-slate-800 bg-slate-900 text-slate-400'
                  }`}
                >
                  Student
                </button>
                <button
                  type="button"
                  onClick={() => setRole('TEACHER')}
                  className={`p-2.5 rounded-xl border font-bold transition-all ${
                    role === 'TEACHER'
                      ? 'border-brand-500 bg-brand-500/20 text-white'
                      : 'border-slate-800 bg-slate-900 text-slate-400'
                  }`}
                >
                  Teacher / Faculty
                </button>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Full Legal Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Jordan Hayes"
                  className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Institutional Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jordan.hayes@demo.com"
                  className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Department</label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-brand-500"
                >
                  <option value="Computer Science">Computer Science</option>
                  <option value="AI & Data Science">AI & Data Science</option>
                  <option value="Information Technology">Information Technology</option>
                </select>
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
              Create Account
            </Button>
          </form>

          <div className="text-center pt-2 text-xs text-slate-400 border-t border-slate-800">
            Already registered?{' '}
            <Link to="/login" className="text-brand-400 font-bold hover:underline">
              Log In
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
