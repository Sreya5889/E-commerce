import React from 'react';
import { PageTransition } from '../../components/layout/PageTransition';
import { Target, Eye, Users, ShieldCheck, Heart } from 'lucide-react';

export const About = () => {
  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 space-y-20">
        
        {/* Brand Mission Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <span className="px-3 py-1 bg-primary-50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400 font-bold rounded-full text-xs uppercase tracking-wider">
              Our Vision
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Democratizing World-Class Tech Education.
            </h1>
            <p className="text-base text-slate-500 dark:text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              At EduAcademy, we believe that education should be accessible, practical, and aligned with industry needs. We assemble active specialists to design hands-on curricula that help self-taught developers, designers, and systems architects transition into production roles at leading global tech organizations.
            </p>
          </div>
          <div className="lg:col-span-5 relative hidden lg:block">
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&auto=format&fit=crop&q=80"
              alt="Team collaboration"
              className="w-full h-80 rounded-premium object-cover shadow-xl border border-slate-100 dark:border-slate-800"
            />
          </div>
        </div>

        {/* Mission, Vision cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-premium space-y-4 shadow-sm hover:shadow-premium transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400 flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold">Our Mission</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Providing project-centric development courses that build confidence and produce portfolio-ready code designs.
            </p>
          </div>

          <div className="p-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-premium space-y-4 shadow-sm hover:shadow-premium transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold">Our Vision</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Bridging the gap between university theoretical paths and actual engineering environments in modern startups.
            </p>
          </div>

          <div className="p-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-premium space-y-4 shadow-sm hover:shadow-premium transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold">Our Commitment</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Updating curriculum logs continuously to capture standard updates in popular frameworks and hosting platforms.
            </p>
          </div>
        </div>

        {/* Dynamic Achievements Stats */}
        <div className="bg-slate-900 dark:bg-slate-950 text-white rounded-premium p-10 md:p-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600/10 via-secondary-600/10 to-transparent"></div>
          
          <div className="space-y-1 relative z-10">
            <h4 className="text-4xl font-extrabold text-white">6+ Years</h4>
            <p className="text-xs text-slate-400">Industry Excellence</p>
          </div>
          <div className="space-y-1 relative z-10">
            <h4 className="text-4xl font-extrabold text-white">1.2M+</h4>
            <p className="text-xs text-slate-400">Enrolled Learners</p>
          </div>
          <div className="space-y-1 relative z-10">
            <h4 className="text-4xl font-extrabold text-white">25+</h4>
            <p className="text-xs text-slate-400">Expert Instructors</p>
          </div>
          <div className="space-y-1 relative z-10">
            <h4 className="text-4xl font-extrabold text-white">96%</h4>
            <p className="text-xs text-slate-400">Satisfaction Score</p>
          </div>
        </div>

      </div>
    </PageTransition>
  );
};
