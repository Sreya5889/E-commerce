import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  Mail,
  Lock,
  User,
  GraduationCap,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { PageTransition } from '../../components/layout/PageTransition';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export const Register = () => {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student', // 'student' or 'teacher'
    expertise: '',
    agreeTerms: false,
  });

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

  // Password strength calculation
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: 'None', color: 'bg-slate-200' };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-rose-500' };
    if (score <= 3) return { score: 2, label: 'Medium', color: 'bg-amber-500' };
    return { score: 3, label: 'Strong', color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength(formData.password);

  const validateForm = () => {
    if (!formData.fullName.trim()) return 'Full name is required';
    if (!formData.email.includes('@')) return 'Enter a valid email address';
    if (formData.password.length < 8) return 'Password must be at least 8 characters long';
    if (formData.password !== formData.confirmPassword) return 'Passwords do not match';
    if (!formData.agreeTerms) return 'You must agree to the Terms of Service to continue';
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
      toast.success('Account created successfully! Welcome to EduAcademy.');
      setTimeout(() => navigate('/dashboard'), 1200);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="w-full min-h-[calc(100vh-80px)] flex flex-col justify-center items-center py-12 px-4 sm:px-6 bg-slate-50 dark:bg-slate-950">
        <div className="w-full max-w-md space-y-6">

          {/* Brand Header */}
          <div className="text-center space-y-2">
            <Link to="/" className="inline-flex items-center space-x-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary-600 to-indigo-600 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-primary-500/25">
                E
              </div>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Join EduAcademy
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Create your account to unlock 500+ masterclasses and certifications
            </p>
          </div>

          {/* Success Banner */}
          {success && (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50 rounded-2xl flex items-center space-x-2 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>Account created! Redirecting to your dashboard...</span>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="p-4 bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 rounded-2xl flex items-center space-x-2 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Register Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-5">
            
            {/* Role Toggle Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                I am signing up as:
              </label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                <button
                  type="button"
                  onClick={() => setFormData(p => ({ ...p, role: 'student' }))}
                  className={`flex items-center justify-center space-x-2 py-2 rounded-lg text-xs font-bold transition-all ${
                    formData.role === 'student'
                      ? 'bg-white dark:bg-slate-900 text-primary-600 dark:text-primary-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Student Learner</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData(p => ({ ...p, role: 'teacher' }))}
                  className={`flex items-center justify-center space-x-2 py-2 rounded-lg text-xs font-bold transition-all ${
                    formData.role === 'teacher'
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Instructor / Mentor</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              <Input
                label="Full Name"
                name="fullName"
                type="text"
                required
                icon={User}
                placeholder="Jane Doe"
                value={formData.fullName}
                onChange={handleChange}
              />

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

              {formData.role === 'teacher' && (
                <Input
                  label="Area of Primary Expertise"
                  name="expertise"
                  type="text"
                  placeholder="e.g. Senior Frontend Architect, AI Engineer"
                  value={formData.expertise}
                  onChange={handleChange}
                />
              )}

              <div className="space-y-1.5">
                <Input
                  label="Password"
                  name="password"
                  type="password"
                  required
                  icon={Lock}
                  placeholder="At least 8 characters"
                  value={formData.password}
                  onChange={handleChange}
                />

                {/* Password Strength Meter */}
                {formData.password && (
                  <div className="space-y-1 pt-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Password strength:</span>
                      <span className={`font-bold ${
                        strength.label === 'Strong' ? 'text-emerald-500' :
                        strength.label === 'Medium' ? 'text-amber-500' : 'text-rose-500'
                      }`}>
                        {strength.label}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5 h-1.5">
                      <div className={`rounded-full ${strength.score >= 1 ? strength.color : 'bg-slate-200 dark:bg-slate-700'}`} />
                      <div className={`rounded-full ${strength.score >= 2 ? strength.color : 'bg-slate-200 dark:bg-slate-700'}`} />
                      <div className={`rounded-full ${strength.score >= 3 ? strength.color : 'bg-slate-200 dark:bg-slate-700'}`} />
                    </div>
                  </div>
                )}
              </div>

              <Input
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                required
                icon={Lock}
                placeholder="Repeat your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={
                  formData.confirmPassword && formData.password !== formData.confirmPassword
                    ? 'Passwords do not match'
                    : undefined
                }
              />

              {/* Terms Checkbox */}
              <div className="pt-1">
                <label className="flex items-start space-x-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500 border-slate-300 mt-0.5"
                  />
                  <span>
                    I agree to EduAcademy's{' '}
                    <a href="#" className="font-semibold text-primary-600 dark:text-primary-400 hover:underline">Terms of Service</a>
                    {' '}and{' '}
                    <a href="#" className="font-semibold text-primary-600 dark:text-primary-400 hover:underline">Privacy Policy</a>.
                  </span>
                </label>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  size="lg"
                  loading={loading}
                  disabled={loading || !formData.agreeTerms}
                  className="w-full font-bold shadow-md shadow-primary-500/25"
                >
                  Create Account
                </Button>
              </div>

            </form>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-primary-600 dark:text-primary-400 hover:underline">
                Sign In
              </Link>
            </div>
          </div>

        </div>
      </div>
    </PageTransition>
  );
};
