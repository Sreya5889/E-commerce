import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calculator,
  Brain,
  BookOpen,
  BarChart2,
  Zap,
  Award,
  Target,
  Clock,
  ArrowRight,
  Flame,
  Trophy,
  Play,
  TrendingUp,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { aptitudeService } from '../../services/aptitude.service';
import { useAuth } from '../../context/AuthContext';

export default function AptitudeHome() {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [mockTests, setMockTests] = useState([]);
  const [dailyChallenge, setDailyChallenge] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [cats, tests, challenge, userAnalytics] = await Promise.all([
          aptitudeService.getCategories(),
          aptitudeService.getMockTests(),
          aptitudeService.getDailyChallenge(),
          user ? aptitudeService.getAnalytics() : Promise.resolve(null)
        ]);

        setCategories(cats || []);
        setMockTests(tests || []);
        setDailyChallenge(challenge || null);
        setAnalytics(userAnalytics || null);
      } catch (err) {
        console.error('Failed to load Aptitude Arena data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  const categoryIconMap = {
    Calculator: Calculator,
    Brain: Brain,
    BookOpen: BookOpen,
    BarChart2: BarChart2
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* HERO BANNER */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-slate-900 to-violet-950 text-white p-8 sm:p-12 shadow-xl border border-indigo-800/40">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-violet-500/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              Career Preparation & Campus Placement Hub
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              EduAcademy <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300">Aptitude Arena</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              Sharpen your Quantitative, Logical, Verbal, and Data Interpretation skills. 
              Practice with real company placement-pattern questions, timed exam environments, and automated weak topic diagnostics.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/aptitude/practice"
                className="px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg hover:shadow-indigo-500/30 transition-all flex items-center gap-2"
              >
                <Target className="w-4 h-4" />
                Start Topic Practice
              </Link>

              <Link
                to="/aptitude/mock-tests"
                className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 font-bold text-sm backdrop-blur-sm transition-all flex items-center gap-2"
              >
                <Clock className="w-4 h-4" />
                Take Placement Mock Exam
              </Link>

              <Link
                to="/aptitude/analytics"
                className="px-6 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm transition-all flex items-center gap-2"
              >
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                My Performance
              </Link>
            </div>

            {/* Platform Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-700/60 text-slate-300">
              <div>
                <div className="text-2xl font-black text-white">40+</div>
                <div className="text-xs text-slate-400">Curated Questions</div>
              </div>
              <div>
                <div className="text-2xl font-black text-white">36</div>
                <div className="text-xs text-slate-400">Topic Modules</div>
              </div>
              <div>
                <div className="text-2xl font-black text-white">5</div>
                <div className="text-xs text-slate-400">Placement Mocks</div>
              </div>
              <div>
                <div className="text-2xl font-black text-white">100%</div>
                <div className="text-xs text-slate-400">Detailed Solutions</div>
              </div>
            </div>
          </div>
        </div>

        {/* DAILY CHALLENGE BANNER */}
        {dailyChallenge && (
          <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-indigo-500/10 border border-amber-500/30 dark:border-amber-500/20 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-lg shrink-0">
                <Flame className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-bold uppercase">
                    Daily Sprint
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {dailyChallenge.challenge_date || 'Today'}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-1">
                  {dailyChallenge.title || "Today's 5-Minute Daily Challenge"}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                  5 hand-picked placement questions • {dailyChallenge.duration_minutes || 5} minutes • Build your daily consistency streak.
                </p>
              </div>
            </div>

            <Link
              to="/aptitude/daily-challenge"
              className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm shadow-md transition-all shrink-0 flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              Solve Challenge Now
            </Link>
          </div>
        )}

        {/* CORE APTITUDE CATEGORIES */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Structured Syllabus
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                Core Aptitude Categories
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Select a domain to practice individual topics, study formulas, and test your speed.
              </p>
            </div>
            <Link
              to="/aptitude/practice"
              className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 shrink-0"
            >
              Open Full Practice Arena <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => {
              const IconComponent = categoryIconMap[cat.icon] || Calculator;
              return (
                <div
                  key={cat.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <IconComponent className="w-6 h-6" />
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {cat.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-3 leading-relaxed">
                        {cat.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 pt-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                      <span>{cat.topic_count || 9} Topics</span>
                      <span>•</span>
                      <span>{cat.question_count || 10} Questions</span>
                    </div>
                  </div>

                  <div className="pt-6 mt-4 border-t border-slate-100 dark:border-slate-800">
                    <Link
                      to={`/aptitude/practice?category=${cat.id}`}
                      className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                    >
                      Practice Category <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* FEATURED PLACEMENT MOCK EXAMS */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Exam Simulations
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                Placement-Pattern Mock Tests
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Full-length timed assessments modeled after leading IT recruitment tests (TCS, Infosys, Wipro, Accenture, Cognizant).
              </p>
            </div>
            <Link
              to="/aptitude/mock-tests"
              className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 shrink-0"
            >
              View All 5 Mocks <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockTests.slice(0, 3).map((test) => (
              <div
                key={test.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 uppercase">
                      Placement Mock
                    </span>
                    <span className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      {test.duration_minutes} mins
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                    {test.title}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                    {test.description}
                  </p>

                  <div className="flex items-center gap-4 text-xs font-medium text-slate-600 dark:text-slate-400 pt-2">
                    <span>{test.question_count || (test.question_ids?.length || 20)} Questions</span>
                    <span>•</span>
                    <span className="capitalize">{test.difficulty || 'All Levels'}</span>
                  </div>
                </div>

                <div className="pt-6 mt-4 border-t border-slate-100 dark:border-slate-800">
                  <Link
                    to={`/aptitude/mock-tests/${test.slug}`}
                    className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5" /> Take This Exam
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PERFORMANCE & DIAGNOSTICS PREVIEW */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase">
                <Trophy className="w-3.5 h-3.5" />
                Adaptive Learning Diagnostics
              </div>
              <h3 className="text-2xl sm:text-3xl font-black">
                Know Exactly Where You Lose Marks Before the Real Exam
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
                Every practice and test attempt is logged. Our analytics engine flags low-accuracy topics (&lt;60%), 
                calculates your speed-accuracy tradeoff, and creates a tailored practice queue so you walk into campus interviews with total confidence.
              </p>
              <div className="pt-2 flex flex-wrap gap-4">
                <Link
                  to="/aptitude/analytics"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
                >
                  <TrendingUp className="w-4 h-4" /> View My Analytics
                </Link>
                <Link
                  to="/aptitude/history"
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition-all flex items-center gap-2"
                >
                  View Attempt History
                </Link>
              </div>
            </div>

            <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-700 text-xs text-slate-400">
                <span>Diagnostic Metrics</span>
                <span className="text-emerald-400 font-bold">Live</span>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">Quantitative Accuracy</span>
                    <span className="text-emerald-400 font-bold">{analytics?.overall_accuracy || 78}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${analytics?.overall_accuracy || 78}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">Logical Reasoning</span>
                    <span className="text-indigo-400 font-bold">84%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: '84%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">Verbal Ability</span>
                    <span className="text-purple-400 font-bold">72%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: '72%' }} />
                  </div>
                </div>
              </div>
              <div className="pt-2 text-[11px] text-slate-400 text-center">
                Automated weak-topic suggestions active
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
