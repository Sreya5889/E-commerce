import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff, BookOpen, AlertCircle, CheckCircle2 } from 'lucide-react';
import { PageTransition } from '../../components/layout/PageTransition';

export const Login = () => {
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({ email: '', password: '', rememberMe: false });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/dashboard';

  // Redirect if already logged in
  if (isAuthenticated) {
    navigate(user?.role === 'admin' ? '/admin/dashboard' : '/dashboard');
    return null;
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const loggedUser = await login(formData.email, formData.password);
      if (formData.rememberMe) {
        localStorage.setItem('edu_remember', formData.email);
      }
      navigate(loggedUser?.role === 'admin' ? '/admin/dashboard' : from);
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoStudent = () => setFormData(p => ({ ...p, email: 'student@eduacademy.com', password: 'password123' }));
  const fillDemoAdmin = () => setFormData(p => ({ ...p, email: 'admin@eduacademy.com', password: 'password123' }));

  return (
    <PageTransition>
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-bgLight dark:bg-bgDark py-12 px-4">
        <div className="w-full max-w-md space-y-8">

          {/* Brand */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-premium bg-gradient-to-tr from-primary-600 to-secondary-600 flex items-center justify-center mx-auto shadow-lg text-white font-extrabold text-2xl">
              E
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Welcome back</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Sign in to continue your learning journey</p>
          </div>

          {/* Demo Credentials Box */}
          <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 rounded-premium text-xs space-y-2">
            <p className="font-bold text-blue-700 dark:text-blue-400">🔑 Demo Accounts (Mock Mode):</p>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={fillDemoStudent} className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors text-left">
                <p className="font-bold text-primary-600">Student Login</p>
                <p className="text-[10px] text-slate-400 mt-0.5">student@eduacademy.com</p>
              </button>
              <button onClick={fillDemoAdmin} className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors text-left">
                <p className="font-bold text-secondary-600">Admin Login</p>
                <p className="text-[10px] text-slate-400 mt-0.5">admin@eduacademy.com</p>
              </button>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border border-red-200 rounded-premium flex items-center space-x-2 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-premium p-8 shadow-premium space-y-5">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-premium text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-slate-900 dark:text-slate-100 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Password</label>
                  <a href="#" className="text-xs text-primary-600 dark:text-primary-400 hover:underline">Forgot Password?</a>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 pr-11 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-premium text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-slate-900 dark:text-slate-100 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <label className="flex items-center space-x-2.5 text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-primary-600 border-slate-300 focus:ring-primary-500"
                />
                <span>Keep me signed in for 30 days</span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm rounded-premium shadow-md shadow-primary-500/15 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center space-x-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block"></span>
                    <span>Signing in...</span>
                  </span>
                ) : 'Sign In to EduAcademy'}
              </button>
            </form>

            <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">
                Create a free account
              </Link>
            </div>
          </div>

          <p className="text-center text-[10px] text-slate-400 dark:text-slate-500">
            By signing in, you agree to our{' '}
            <a href="#" className="underline">Terms of Service</a>{' '}
            and{' '}
            <a href="#" className="underline">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </PageTransition>
  );
};
