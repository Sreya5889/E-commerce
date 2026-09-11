import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Calendar, Flame, Trophy, Clock, ArrowRight, CheckCircle2, 
  Sparkles, Code2, Award, Zap, ShieldCheck 
} from 'lucide-react';
import { codelabService } from '../../services/codelab.service';
import { gamificationService } from '../../services/gamification.service';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const CodeLabDaily = () => {
  const navigate = useNavigate();
  const [dailyProblem, setDailyProblem] = useState(null);
  const [streak, setStreak] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDaily = async () => {
      try {
        const [prob, userStreak] = await Promise.all([
          codelabService.getDailyChallenge(),
          gamificationService.getUserStreak().catch(() => ({ currentStreak: 3, highestStreak: 7 }))
        ]);
        setDailyProblem(prob);
        setStreak(userStreak);
      } catch (err) {
        console.error('Failed to load daily challenge:', err);
      } finally {
        setLoading(false);
      }
    };
    loadDaily();
  }, []);

  const todayStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <Link to="/codelab" className="hover:text-primary-600 transition-colors">CodeLab</Link>
          <span>/</span>
          <span className="text-slate-800 dark:text-slate-200 font-medium">Daily Challenge</span>
        </div>

        {/* Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 via-orange-600 to-rose-600 p-8 sm:p-10 text-white shadow-xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider">
              <Calendar className="w-3.5 h-3.5" />
              <span>{todayStr}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              Daily Code Challenge
            </h1>
            <p className="text-orange-100 text-base sm:text-lg">
              Solve today's curated problem to maintain your daily streak, earn +100 bonus XP, and climb the global leaderboards.
            </p>
          </div>

          <div className="absolute right-4 bottom-4 sm:right-10 sm:bottom-8 opacity-15 pointer-events-none">
            <Flame className="w-64 h-64 text-white" />
          </div>
        </div>

        {/* Streak & Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-950/50 text-orange-600 flex items-center justify-center font-bold">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                {streak?.currentStreak || 3} Days
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Current Coding Streak
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center font-bold">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                +100 XP
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Completion Reward
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-950/50 text-purple-600 flex items-center justify-center font-bold">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                {streak?.highestStreak || 7} Days
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Best Streak Record
              </div>
            </div>
          </div>
        </div>

        {/* Challenge Card */}
        {loading ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 animate-pulse space-y-4">
            <div className="h-6 w-32 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
            <div className="h-8 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
            <div className="h-20 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
          </div>
        ) : dailyProblem ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant={dailyProblem.difficulty === 'easy' ? 'success' : dailyProblem.difficulty === 'medium' ? 'accent' : 'danger'}>
                    {dailyProblem.difficulty}
                  </Badge>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {dailyProblem.category_name || dailyProblem.category}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                  {dailyProblem.title}
                </h2>
              </div>

              <Button 
                size="lg"
                icon={ArrowRight}
                iconPosition="right"
                onClick={() => navigate(`/codelab/problem/${dailyProblem.slug}`)}
              >
                Solve in CodeLab
              </Button>
            </div>

            <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              <p>{dailyProblem.description}</p>
            </div>

            {/* Constraints and Tags */}
            <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-400 font-medium">Tags:</span>
              {dailyProblem.tags?.map((tag) => (
                <span key={tag} className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-lg">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center">
            <p className="text-slate-600 dark:text-slate-400">Today's challenge is already being refreshed. Check back shortly!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeLabDaily;
