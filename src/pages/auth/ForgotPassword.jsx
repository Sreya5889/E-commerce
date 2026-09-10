import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { PageTransition } from '../../components/layout/PageTransition';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export const ForgotPassword = () => {
  const { resetPassword } = useAuth();
  const toast = useToast();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');
    try {
      if (resetPassword) {
        await resetPassword(email);
      }
      setSubmitted(true);
      toast.success('Password reset link sent to your inbox.');
    } catch (err) {
      setError(err.message || 'Unable to send reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="w-full min-h-[calc(100vh-80px)] flex flex-col justify-center items-center py-12 px-4 sm:px-6 bg-slate-50 dark:bg-slate-950">
        <div className="w-full max-w-md space-y-6">

          {/* Header */}
          <div className="text-center space-y-2">
            <Link to="/" className="inline-flex items-center space-x-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary-600 to-indigo-600 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-primary-500/25">
                E
              </div>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Reset your password
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Enter your verified email address to receive password recovery instructions
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-4 bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 rounded-2xl flex items-center space-x-2 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-5">
            {submitted ? (
              <div className="text-center space-y-4 py-4">
                <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Check Your Inbox</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  We have dispatched password reset instructions to <span className="font-bold text-slate-800 dark:text-slate-200">{email}</span>. Follow the link inside to set a new password.
                </p>
                <div className="pt-2">
                  <Link to="/login">
                    <Button variant="outline" className="w-full">Back to Sign In</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Account Email Address"
                  type="email"
                  required
                  icon={Mail}
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                />

                <div className="pt-2">
                  <Button
                    type="submit"
                    size="lg"
                    loading={loading}
                    disabled={loading || !email}
                    className="w-full font-bold shadow-md shadow-primary-500/25"
                  >
                    Send Reset Link
                  </Button>
                </div>
              </form>
            )}

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
              <Link
                to="/login"
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Login</span>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </PageTransition>
  );
};
