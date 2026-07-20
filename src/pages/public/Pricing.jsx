import React from 'react';
import { PageTransition } from '../../components/layout/PageTransition';
import { Check, ShieldAlert, Award, Zap, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Pricing = () => {
  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 space-y-16">
        
        {/* Title */}
        <div className="text-center max-w-xl mx-auto space-y-3">
          <span className="px-3 py-1 bg-primary-50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400 font-bold rounded-full text-xs uppercase tracking-wider">
            Membership Plans
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Flexible Plans for Every Learner</h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs">
            Start learning with single-course purchases or unlock all courses with a Pro membership.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1: Single Purchase */}
          <div className="p-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-premium space-y-6 flex flex-col justify-between shadow-sm hover:shadow-premium transition-shadow">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Pay As You Go</h3>
              <p className="text-xs text-slate-500">Perfect for studying single target subjects.</p>
              <div className="flex items-baseline space-x-1">
                <span className="text-3xl font-extrabold">$14.99</span>
                <span className="text-xs text-slate-450">/ avg. course</span>
              </div>
              <div className="border-t border-slate-100 dark:border-slate-800 my-4"></div>
              <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-400">
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>Access to single course purchased</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>Full lifetime course access</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>Verified course certificate</span>
                </li>
                <li className="flex items-center space-x-2 text-slate-400">
                  <ShieldAlert className="w-4 h-4 text-slate-300 flex-shrink-0" />
                  <span>No offline workspace downloads</span>
                </li>
              </ul>
            </div>
            <Link
              to="/courses"
              className="w-full text-center py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold rounded-premium text-xs transition-colors mt-6 block"
            >
              Browse Courses
            </Link>
          </div>

          {/* Card 2: Monthly Pro */}
          <div className="p-8 bg-white dark:bg-slate-900 border-2 border-primary-500 rounded-premium space-y-6 flex flex-col justify-between shadow-md relative">
            <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary-600 text-white font-bold text-[10px] uppercase rounded-full tracking-wider shadow">
              RECOMMENDED
            </span>
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Monthly Pro Subscription</h3>
              <p className="text-xs text-slate-500">Unlock unlimited tech bootcamps.</p>
              <div className="flex items-baseline space-x-1">
                <span className="text-3xl font-extrabold">$29.00</span>
                <span className="text-xs text-slate-450">/ month</span>
              </div>
              <div className="border-t border-slate-100 dark:border-slate-800 my-4"></div>
              <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-400">
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-primary-550 flex-shrink-0" />
                  <span>Access to all 120+ courses</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-primary-550 flex-shrink-0" />
                  <span>Unlimited verified certifications</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-primary-550 flex-shrink-0" />
                  <span>Code assets & lesson downloads</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-primary-550 flex-shrink-0" />
                  <span>Priority Discord student support</span>
                </li>
              </ul>
            </div>
            <Link
              to="/register"
              className="w-full text-center py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-premium text-xs shadow-md shadow-primary-500/10 transition-colors mt-6 block"
            >
              Start 7-Day Free Trial
            </Link>
          </div>

          {/* Card 3: Yearly Premium */}
          <div className="p-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-premium space-y-6 flex flex-col justify-between shadow-sm hover:shadow-premium transition-shadow">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Yearly Gold Member</h3>
              <p className="text-xs text-slate-500">Best value for long-term career growth.</p>
              <div className="flex items-baseline space-x-1">
                <span className="text-3xl font-extrabold">$199.00</span>
                <span className="text-xs text-slate-450">/ year</span>
              </div>
              <div className="border-t border-slate-100 dark:border-slate-800 my-4"></div>
              <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-400">
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>Access all courses + upcoming launches</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>Priority instructor Q&A logs review</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>Save 40% compared to monthly</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>1-on-1 resume reviews (once a year)</span>
                </li>
              </ul>
            </div>
            <Link
              to="/register"
              className="w-full text-center py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-semibold rounded-premium text-xs transition-colors mt-6 block"
            >
              Get Yearly Access
            </Link>
          </div>

        </div>

      </div>
    </PageTransition>
  );
};
