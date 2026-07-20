import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff, AlertCircle, CheckCircle2, User, GraduationCap } from 'lucide-react';
import { PageTransition } from '../../components/layout/PageTransition';

export const Register = () => {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    agreeTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (isAuthenticated) {
    navigate('/dashboard');
    return null;
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) return 'Full name is required';
    if (!formData.email.includes('@')) return 'Enter a valid email address';
    if (formData.password.length < 8) return 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword) return 'Passwords do not match';
    if (!formData.agreeTerms) return 'Please agree to our Terms of Service';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');
    try {
      await register(formData.email, formData.password, formData.fullName, formData.role);
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-bgLight dark:bg-bgDark py-12 px-4">
        <div className="w-full max-w-md space-y-8">

          {/* Brand */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-premium bg-gradient-to-tr from-primary-600 to-secondary-600 flex items-center justify-center mx-auto shadow-lg text-white font-extrabold text-2xl">
              E
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Join EduAcademy</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Create your free account and start learning today</p>
          </div>

          {/* Success State */}
          {success && (
            <div className="p-4 bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 border border-green-200 rounded-premium flex items-center space-x-2 text-xs">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>Account created! Redirecting to your dashboard...</span>
            </div>
          )}

          {/* Error Alert */}
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border border-red-200 rounded-premium flex items-center space-x-2 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-premium p-8 shadow-premium space-y-5">

            {/* Role Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">I am signing up as a...</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData(p => ({ ...p, role: 'student' }))}
                  className={`flex items-center space-x-2.5 px-4 py-3 rounded-premium border text-xs font-semibold transition-all ${
                    formData.role === 'student'
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/20 text-primary-700 dark:text-primary-300'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Student Learner</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(p => ({ ...p, role: 'teacher' }))}
                  className={`flex items-center space-x-2.5 px-4 py-3 rounded-premium border text-xs font-semibold transition-all ${
                    formData.role === 'teacher'
                      ? 'border-secondary-500 bg-secondary-50 dark:bg-secondary-950/20 text-secondary-700 dark:text-secondary-300'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Instructor</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  placeholder="Jane Doe"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-premium text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-slate-900 dark:text-slate-100 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="jane@example.com"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-premium text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-slate-900 dark:text-slate-100 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder="Min. 8 chars"
                      className="w-full px-4 py-3 pr-10 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-premium text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-900 dark:text-slate-100 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder="Repeat password"
                    className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border rounded-premium text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-900 dark:text-slate-100 transition-all ${
                      formData.confirmPassword && formData.confirmPassword !== formData.password
                        ? 'border-red-400 focus:ring-red-400'
                        : 'border-slate-200 dark:border-slate-700'
                    }`}
                  />
                </div>
              </div>

              {/* Password strength */}
              {formData.password && (
                <div className="space-y-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((_, i) => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${
                        formData.password.length >= (i + 1) * 2
                          ? i < 2 ? 'bg-red-400' : i === 2 ? 'bg-amber-400' : 'bg-green-500'
                          : 'bg-slate-200 dark:bg-slate-700'
                      }`}></div>
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-400">
                    {formData.password.length < 4 ? 'Too weak' : formData.password.length < 8 ? 'Moderate' : 'Strong password'}
                  </p>
                </div>
              )}

              <label className="flex items-start space-x-2.5 text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  className="mt-0.5 w-4 h-4 rounded text-primary-600 border-slate-300 focus:ring-primary-500"
                />
                <span>
                  I agree to EduAcademy&apos;s{' '}
                  <a href="#" className="text-primary-600 hover:underline">Terms of Service</a>{' '}
                  and{' '}
                  <a href="#" className="text-primary-600 hover:underline">Privacy Policy</a>
                </span>
              </label>

              <button
                type="submit"
                disabled={loading || success}
                className="w-full py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm rounded-premium shadow-md shadow-primary-500/15 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center space-x-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block"></span>
                    <span>Creating Account...</span>
                  </span>
                ) : 'Create Free Account'}
              </button>
            </form>

            <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">
                Sign in instead
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};
