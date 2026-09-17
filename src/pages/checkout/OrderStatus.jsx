import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle2, BookOpen, Award, LayoutDashboard } from 'lucide-react';
import { PageTransition } from '../../components/layout/PageTransition';
import { formatINR } from '../../utils/currency';

export const OrderSuccess = () => {
  const location = useLocation();
  const { orderId, grandTotal } = location.state || {};

  return (
    <PageTransition>
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-bgLight dark:bg-bgDark px-4 py-12">
        <div className="max-w-lg w-full text-center space-y-8">

          {/* Success Animation */}
          <div className="relative">
            <div className="w-28 h-28 rounded-full bg-green-100 dark:bg-green-950/30 flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle2 className="w-14 h-14 text-green-500" />
            </div>
            <div className="absolute inset-0 w-28 h-28 mx-auto rounded-full border-4 border-green-200 dark:border-green-900/50 animate-ping opacity-20"></div>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Payment Successful! 🎉</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mx-auto">
              Your courses are now available in your Learning Dashboard. Start your journey right now!
            </p>
            {orderId && (
              <p className="text-xs font-mono text-slate-400 dark:text-slate-500">
                Order ID: <span className="font-bold text-slate-600 dark:text-slate-300">{orderId}</span>
              </p>
            )}
            {grandTotal !== undefined && (
              <div className="inline-block px-4 py-2 bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 text-lg font-extrabold rounded-premium border border-green-200 dark:border-green-900/30">
                Total Charged: {formatINR(grandTotal)}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link to="/dashboard?tab=courses"
              className="flex flex-col items-center space-y-2 p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-premium hover:shadow-premium hover:-translate-y-1 transition-all group"
            >
              <BookOpen className="w-7 h-7 text-primary-600 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Start Learning</span>
            </Link>
            <Link to="/dashboard?tab=certificates"
              className="flex flex-col items-center space-y-2 p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-premium hover:shadow-premium hover:-translate-y-1 transition-all group"
            >
              <Award className="w-7 h-7 text-amber-500 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">My Certificates</span>
            </Link>
            <Link to="/dashboard"
              className="flex flex-col items-center space-y-2 p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-premium hover:shadow-premium hover:-translate-y-1 transition-all group"
            >
              <LayoutDashboard className="w-7 h-7 text-secondary-600 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Dashboard</span>
            </Link>
          </div>

          <Link to="/courses" className="inline-block text-xs text-primary-600 dark:text-primary-400 font-semibold hover:underline mt-2">
            Continue Browsing Courses →
          </Link>
        </div>
      </div>
    </PageTransition>
  );
};

export const OrderFailed = () => {
  const location = useLocation();
  const { error } = location.state || {};

  return (
    <PageTransition>
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-bgLight dark:bg-bgDark px-4 py-12">
        <div className="max-w-md w-full text-center space-y-8">

          <div className="w-28 h-28 rounded-full bg-red-100 dark:bg-red-950/30 flex items-center justify-center mx-auto shadow-lg">
            <svg className="w-14 h-14 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Payment Failed</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              {error || 'Your payment could not be processed. Please check your card details and try again.'}
            </p>
          </div>

          <div className="p-5 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-premium text-xs text-slate-600 dark:text-slate-400 space-y-2 text-left">
            <p className="font-bold text-red-700 dark:text-red-400">Common reasons for failure:</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>Insufficient funds in account</li>
              <li>Incorrect card number or CVV</li>
              <li>Card blocked by issuing bank</li>
              <li>Expired card details</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/checkout"
              className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm rounded-premium shadow-md transition-colors"
            >
              Try Again
            </Link>
            <Link to="/cart"
              className="px-6 py-3 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm rounded-premium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Back to Cart
            </Link>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};
