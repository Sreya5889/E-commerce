import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, Award, Target, CheckCircle2, ArrowRight, 
  Sparkles, Code2, BookOpen, Layers, Briefcase, 
  HelpCircle, Compass, Zap, ShieldCheck 
} from 'lucide-react';
import { careerService } from '../../services/career.service';
import { gamificationService } from '../../services/gamification.service';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const CareerDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await careerService.getReadiness();
        setData(res);
      } catch (err) {
        console.error('Failed to load career readiness:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 max-w-7xl mx-auto space-y-8 animate-pulse">
        <div className="h-48 bg-slate-200 dark:bg-slate-800 rounded-3xl"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
          <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
          <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  const score = data?.readinessScore ?? 68;
  const breakdown = data?.breakdown || {};
  const skills = data?.skillsMatrix || [];
  const recommendations = data?.recommendations || [];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Hero Banner: Career Readiness Score */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-800 to-purple-900 p-8 sm:p-12 text-white shadow-2xl">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider">
                <Compass className="w-3.5 h-3.5" />
                <span>EduAcademy Career Command Center</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
                Your Career Readiness Score
              </h1>
              <p className="text-indigo-100 text-base sm:text-lg">
                Calculated in real-time across your Course completions, CodeLab DSA accuracy, Project blueprints built, Aptitude screenings, and Mock interview drills.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link to="/career/achievements">
                  <Button variant="secondary" icon={Award}>
                    View Badges & XP
                  </Button>
                </Link>
                <Link to="/jobs">
                  <Button variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                    Explore Matching Jobs
                  </Button>
                </Link>
              </div>
            </div>

            {/* Score Ring / Gauge */}
            <div className="flex flex-col items-center justify-center p-6 sm:p-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shrink-0">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-white/20"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-emerald-400"
                    strokeDasharray={`${score}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-4xl font-black">{score}</span>
                  <span className="text-[10px] uppercase font-bold text-white/70 tracking-wider">Out of 100</span>
                </div>
              </div>
              <div className="mt-3 text-center">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/30 text-emerald-200 border border-emerald-400/30">
                  {score >= 75 ? 'Job Ready Candidate' : score >= 50 ? 'Strong Contender' : 'Developing Foundations'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Stage Career Roadmap Progression */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-primary-600" />
              The EduAcademy Path to Getting Hired
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Follow our 4-pillar methodology designed to take students from foundational concepts to placed engineers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Stage 1 */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider">Pillar 1</span>
                <BookOpen className="w-5 h-5 text-primary-500" />
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-base">1. Learn</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Master complete course stacks & industry curriculum paths.
              </p>
              <Link to="/courses" className="text-xs font-bold text-primary-600 hover:underline flex items-center gap-1 pt-1">
                Explore Courses <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Stage 2 */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Pillar 2</span>
                <Code2 className="w-5 h-5 text-emerald-500" />
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-base">2. Practice</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Solve DSA/SQL problems in CodeLab and sharpen speed with Aptitude.
              </p>
              <Link to="/codelab" className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1 pt-1">
                Practice in CodeLab <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Stage 3 */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">Pillar 3</span>
                <Layers className="w-5 h-5 text-purple-500" />
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-base">3. Build</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Architect real-world project blueprints to assemble a verified portfolio.
              </p>
              <Link to="/projects" className="text-xs font-bold text-purple-600 hover:underline flex items-center gap-1 pt-1">
                Browse Projects <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Stage 4 */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Pillar 4</span>
                <Briefcase className="w-5 h-5 text-amber-500" />
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-base">4. Get Hired</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Drill recruiter model answers, take mock tests, and apply to curated tech jobs.
              </p>
              <Link to="/interview" className="text-xs font-bold text-amber-600 hover:underline flex items-center gap-1 pt-1">
                Interview Hub <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* Readiness Breakdown & Skills Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 6-Part Category Breakdown */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Readiness Weighting Breakdown
            </h3>

            <div className="space-y-4">
              {Object.entries(breakdown).map(([key, item]) => {
                const pct = Math.round((item.score / item.max) * 100);
                return (
                  <div key={key} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-700 dark:text-slate-300">{item.label}</span>
                      <span className="text-slate-500 font-mono">{item.score} / {item.max} pts ({pct}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-primary-600 h-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Skills Competency Matrix */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Verified Technical Skills Matrix
            </h3>

            <div className="space-y-4">
              {skills.map((s, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800 dark:text-slate-200">{s.skill}</span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                      {s.level} ({s.progress}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full transition-all duration-300"
                      style={{ width: `${s.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Action Recommendations */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                Recommended Next Steps to Maximize Score
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                AI-curated recommendations based on your current skill gaps.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.map((rec, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant={rec.priority === 'high' ? 'danger' : 'accent'}>
                      {rec.priority} Priority
                    </Badge>
                    <span className="text-xs font-semibold text-slate-400 uppercase">
                      {rec.module}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    {rec.title}
                  </h4>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {rec.action}
                  </p>
                </div>

                <div className="pt-3">
                  <Link to={rec.link}>
                    <Button variant="outline" size="sm" className="w-full justify-between">
                      <span>Take Action</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerDashboard;
