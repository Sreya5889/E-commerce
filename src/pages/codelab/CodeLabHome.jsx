import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { codelabService } from '../../services/codelab.service';
import { PageTransition } from '../../components/layout/PageTransition';
import { Code, Flame, Target, Trophy, Sparkles, ArrowRight, CheckCircle2, Search } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const CodeLabHome = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [problems, setProblems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [daily, setDaily] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const selectedCat = searchParams.get('category') || 'all';
  const selectedDiff = searchParams.get('difficulty') || 'all';
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [probs, cats, d, stats] = await Promise.all([
          codelabService.getProblems({ category: selectedCat, difficulty: selectedDiff, search: searchQuery }),
          codelabService.getCategories(),
          codelabService.getDailyChallenge(),
          codelabService.getUserStats().catch(() => null)
        ]);
        setProblems(probs);
        setCategories(cats);
        setDaily(d);
        setUserStats(stats);
      } catch (err) {
        console.error('Failed to load CodeLab data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [selectedCat, selectedDiff, searchQuery]);

  const updateParam = (key, val) => {
    const next = new URLSearchParams(searchParams);
    if (val && val !== 'all') next.set(key, val);
    else next.delete(key);
    setSearchParams(next);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 pb-20">
        {/* 1. Hero Section */}
        <section className="bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 text-white py-14 sm:py-20 border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary-500/20 text-primary-300 text-xs font-semibold border border-primary-500/30">
                <Code className="w-3.5 h-3.5" />
                <span>EduAcademy CodeLab</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                Code. Practice. Improve.
              </h1>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Master programming fundamentals, Data Structures & Algorithms, and SQL queries through hands-on coding challenges with multi-language execution.
              </p>

              {/* Stats pill bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800/80">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-xl font-bold text-white">{userStats?.totalSolved ?? 8}</div>
                  <div className="text-[11px] text-slate-400">Problems Solved</div>
                </div>
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-xl font-bold text-amber-400 flex items-center space-x-1">
                    <Flame className="w-4 h-4 fill-amber-400" />
                    <span>4 Days</span>
                  </div>
                  <div className="text-[11px] text-slate-400">Coding Streak</div>
                </div>
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-xl font-bold text-emerald-400">{userStats?.acceptanceRate ?? 92}%</div>
                  <div className="text-[11px] text-slate-400">Acceptance Rate</div>
                </div>
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-xl font-bold text-indigo-400">Level 3</div>
                  <div className="text-[11px] text-slate-400">650 XP Earned</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Main Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20 space-y-8">
          {/* Difficulty Progression Banner (Feature 3) */}
          {userStats?.difficultyStats && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
                    <Target className="w-4 h-4 text-primary-600" />
                    DSA Difficulty Progression & Next Recommended Challenge
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Track your solved problems across Easy fundamentals to Medium/Hard placement vectors.
                  </p>
                </div>

                {userStats.nextRecommendedProblem && (
                  <Link to={`/codelab/problems/${userStats.nextRecommendedProblem.slug || userStats.nextRecommendedProblem.id}`}>
                    <Button size="sm" variant="outline" className="text-xs">
                      <span>Solve Next: {userStats.nextRecommendedProblem.title}</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </Link>
                )}
              </div>

              {/* Progress bars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-emerald-600 dark:text-emerald-400">Easy Fundamentals</span>
                    <span className="text-slate-500">{userStats.difficultyStats.easy.solved} / {userStats.difficultyStats.easy.total}</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${userStats.difficultyStats.easy.progress}%` }} />
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-amber-600 dark:text-amber-400">Medium Placement</span>
                    <span className="text-slate-500">{userStats.difficultyStats.medium.solved} / {userStats.difficultyStats.medium.total}</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: `${userStats.difficultyStats.medium.progress}%` }} />
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-rose-600 dark:text-rose-400">Hard Advanced</span>
                    <span className="text-slate-500">{userStats.difficultyStats.hard.solved} / {userStats.difficultyStats.hard.total}</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div className="bg-rose-500 h-full rounded-full transition-all duration-500" style={{ width: `${userStats.difficultyStats.hard.progress}%` }} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Daily Challenge Card */}
          {daily?.problem && (
            <div className="bg-gradient-to-r from-primary-900/90 via-indigo-900/80 to-slate-900 text-white rounded-3xl p-6 border border-primary-500/30 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-amber-300 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  <span>Daily Coding Challenge • +30 Bonus XP</span>
                </div>
                <h3 className="text-xl font-extrabold text-white">{daily.problem.title}</h3>
                <p className="text-xs text-slate-300 line-clamp-1">{daily.problem.description}</p>
              </div>
              <Link to={`/codelab/problems/${daily.problem.slug}`}>
                <Button className="shadow-lg shadow-primary-500/20 whitespace-nowrap">
                  Solve Daily Challenge
                </Button>
              </Link>
            </div>
          )}

          {/* Filter and Search Bar */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => updateParam('search', e.target.value)}
                placeholder="Search coding problems by name or tag (e.g. Array, Stack, SQL)..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800/80 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </div>

            {/* Difficulty Selector */}
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-slate-400">Difficulty:</span>
              <select
                value={selectedDiff}
                onChange={(e) => updateParam('difficulty', e.target.value)}
                className="px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
              >
                <option value="all">All Levels</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          {/* Problems List */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Coding Problems ({problems.length})
              </h2>
              <Link to="/codelab/leaderboard" className="text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline flex items-center space-x-1">
                <Trophy className="w-3.5 h-3.5" />
                <span>Leaderboard</span>
              </Link>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {problems.map((prob) => {
                const diffColor = prob.difficulty === 'easy' ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' : prob.difficulty === 'medium' ? 'text-amber-500 bg-amber-500/10 border-amber-500/20' : 'text-rose-500 bg-rose-500/10 border-rose-500/20';

                return (
                  <Link
                    key={prob.id}
                    to={`/codelab/problems/${prob.slug}`}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-1">
                          {prob.title}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border capitalize ${diffColor}`}>
                          {prob.difficulty}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                        {prob.description}
                      </p>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {prob.tags?.map((t, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-medium text-slate-600 dark:text-slate-400">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 self-end sm:self-center">
                      <span className="text-xs font-bold text-primary-600 dark:text-primary-400 group-hover:translate-x-1 transition-transform flex items-center space-x-1">
                        <span>Solve</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};
