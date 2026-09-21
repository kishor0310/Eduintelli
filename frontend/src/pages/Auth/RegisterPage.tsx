import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Brain, Lock, Mail, User, Building } from 'lucide-react';
import { getCsrfToken, fetchCsrfToken } from '../../services/api';

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('Demo@123');
  const [role, setRole] = useState<'STUDENT' | 'TEACHER'>('STUDENT');
  const [department, setDepartment] = useState('Computer Science');
  const [rollNumber, setRollNumber] = useState('');
  const [csrfToken, setCsrfToken] = useState<string>(getCsrfToken() || '');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  // Retrieve cryptographically signed anti-CSRF token on component mount (CWE-352)
  useEffect(() => {
    fetchCsrfToken().then((token) => {
      if (token) setCsrfToken(token);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let token = csrfToken || getCsrfToken();
      if (!token || !token.includes('.')) {
        token = await fetchCsrfToken();
        if (token) setCsrfToken(token);
      }

      // CWE-352: Include anti-CSRF token in headers and payload to prevent Cross-Site Request Forgery
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': token,
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role: 'STUDENT',
          department,
          rollNumber: rollNumber || `CS2025-${Math.floor(100 + Math.random() * 900)}`,
          csrf_token: token,
          _csrf: token,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || 'Registration failed');
      }

      toast.success('Registration Successful', 'Your academic account is now active.');
      await login(email, password);
      navigate('/student/dashboard');
    } catch (err: any) {
      toast.error('Registration Failed', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 text-slate-800 dark:text-slate-100">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-purple-600 text-white shadow-lg shadow-brand-500/20 mb-1">
            <Brain className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Create EduIntelli Account</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Join the academic intelligence network for continuous early intervention.
          </p>
        </div>

        <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            {/* Anti-CSRF Token: Protects registration form against Cross-Site Request Forgery (CWE-352) */}
            <input type="hidden" name="csrf_token" value={csrfToken} />
            <input type="hidden" name="_csrf" value={csrfToken} />
            <input type="hidden" name="csrfToken" value={csrfToken} />

            {/* Account Type */}
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Account Type</label>
              <div className="p-2.5 rounded-xl border border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-500/20 dark:text-white font-bold flex items-center justify-between">
                <span>Student Account</span>
                <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-brand-100 dark:bg-brand-900/50 text-brand-700 dark:text-brand-300">Self-Registration</span>
              </div>
              <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                Faculty & administrative accounts are provisioned by institutional administrators.
              </p>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Full Legal Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Jordan Hayes"
                  className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-brand-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Institutional Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jordan.hayes@demo.com"
                  className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-brand-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Department</label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                >
                  <option value="Computer Science">Computer Science</option>
                  <option value="AI & Data Science">AI & Data Science</option>
                  <option value="Information Technology">Information Technology</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-brand-500"
                  required
                />
              </div>
            </div>

            <Button type="submit" variant="primary" size="md" isLoading={isLoading} className="w-full mt-2 shadow-sm">
              Create Account
            </Button>
          </form>

          <div className="text-center pt-2 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800">
            Already registered?{' '}
            <Link to="/login" className="text-brand-600 dark:text-brand-400 font-bold hover:underline">
              Log In
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
