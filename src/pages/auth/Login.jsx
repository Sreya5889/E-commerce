import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Mail, Lock, AlertCircle, Sparkles, ArrowRight } from 'lucide-react';
import { PageTransition } from '../../components/layout/PageTransition';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export const Login = () => {
  const { login, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const [formData, setFormData] = useState({ email: '', password: '', rememberMe: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/dashboard';

  // Redirect if already logged in
  if (isAuthenticated) {
    navigate(isAdmin ? '/admin/dashboard' : '/dashboard');
    return null;
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(formData.email, formData.password);
      if (formData.rememberMe) {
        localStorage.setItem('edu_remember', formData.email);
      }
      toast.success('Welcome back to EduAcademy!');
      navigate(isAdmin ? '/admin/dashboard' : from);
    } catch (err) {
      setError(err.message || 'Invalid email or password. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoStudent = () => setFormData(p => ({ ...p, email: 'student@eduacademy.com', password: 'password123' }));
  const fillDemoAdmin = () => setFormData(p => ({ ...p, email: 'admin@eduacademy.com', password: 'password123' }));

  return (
    <PageTransition>
      <div className="w-full min-h-[calc(100vh-80px)] flex flex-col justify-center items-center py-12 px-4 sm:px-6 bg-slate-50 dark:bg-slate-950">
        <div className="w-full max-w-md space-y-6">

          {/* Brand Header */}
          <div className="text-center space-y-2">
            <Link to="/" className="inline-flex items-center space-x-2 group">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary-600 to-indigo-600 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-primary-500/25">
                E
              </div>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Welcome back
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Sign in to continue your personalized learning journey
            </p>
          </div>

          {/* Dev-Only Demo Accounts Box */}
          {import.meta.env.DEV && (
            <div className="p-4 bg-primary-50/80 dark:bg-primary-950/30 border border-primary-100 dark:border-primary-900/50 rounded-2xl text-xs space-y-2.5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="font-bold text-primary-700 dark:text-primary-400 flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Demo Credentials (Dev Mode)</span>
                </span>
                <span className="text-[10px] font-mono text-primary-500 bg-primary-100/50 dark:bg-primary-900/50 px-1.5 py-0.5 rounded">
                  auto-fill
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={fillDemoStudent}
                  className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-primary-500 text-left transition-colors"
                >
                  <p className="font-bold text-slate-800 dark:text-slate-200 text-xs">Student Account</p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">student@eduacademy.com</p>
                </button>
                <button
                  type="button"
                  onClick={fillDemoAdmin}
                  className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-indigo-500 text-left transition-colors"
                >
                  <p className="font-bold text-indigo-600 dark:text-indigo-400 text-xs">Admin Portal</p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">admin@eduacademy.com</p>
                </button>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="p-4 bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 rounded-2xl flex items-center space-x-2 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Login Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-5">
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <Input
                label="Email Address"
                name="email"
                type="email"
                required
                icon={Mail}
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
              />

              <Input
                label="Password"
                name="password"
                type="password"
                required
                icon={Lock}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center space-x-2 cursor-pointer text-slate-600 dark:text-slate-400 select-none">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500 border-slate-300"
                  />
                  <span>Remember me</span>
                </label>

                <Link
                  to="/forgot-password"
                  className="font-bold text-primary-600 dark:text-primary-400 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  size="lg"
                  loading={loading}
                  disabled={loading || !formData.email || !formData.password}
                  className="w-full font-bold shadow-md shadow-primary-500/25"
                >
                  Sign In
                </Button>
              </div>

            </form>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
              Don't have an account yet?{' '}
              <Link to="/register" className="font-bold text-primary-600 dark:text-primary-400 hover:underline">
                Create free account
              </Link>
            </div>
          </div>

        </div>
      </div>
    </PageTransition>
  );
};
