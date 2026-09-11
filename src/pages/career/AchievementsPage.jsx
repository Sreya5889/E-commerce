import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Award, Flame, Zap, Trophy, ShieldCheck, Lock, 
  CheckCircle2, ArrowLeft, Star 
} from 'lucide-react';
import { gamificationService } from '../../services/gamification.service';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const AchievementsPage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await gamificationService.getProfile();
        setProfile(data);
      } catch (err) {
        console.error('Failed to load gamification profile:', err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 max-w-5xl mx-auto space-y-6 animate-pulse">
        <div className="h-40 bg-slate-200 dark:bg-slate-800 rounded-3xl"></div>
        <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-3xl"></div>
      </div>
    );
  }

  const currentLevel = profile?.current_level || 3;
  const levelInfo = profile?.levels?.find(l => l.level === currentLevel) || {
    title: profile?.level_title || 'Learner',
    min_xp: 500,
    max_xp: 1000
  };

  const currentXP = profile?.total_xp || 650;
  const levelSpan = (levelInfo.max_xp - levelInfo.min_xp) || 500;
  const progressInLevel = Math.max(0, currentXP - levelInfo.min_xp);
  const pctToNext = Math.min(100, Math.round((progressInLevel / levelSpan) * 100));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <Link to="/career" className="hover:text-primary-600 transition-colors flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" /> Career Dashboard
            </Link>
            <span>/</span>
            <span className="text-slate-800 dark:text-slate-200 font-medium">Achievements & XP</span>
          </div>

          <Link to="/career">
            <Button variant="outline" size="sm">
              Readiness Score
            </Button>
          </Link>
        </div>

        {/* Level Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500 via-orange-600 to-rose-600 p-8 sm:p-10 text-white shadow-xl">
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-3 text-center sm:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider">
                <Trophy className="w-3.5 h-3.5" />
                <span>Level {currentLevel}: {levelInfo.title}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black">
                {currentXP.toLocaleString()} Total XP Earned
              </h1>

              <p className="text-orange-100 text-sm max-w-md">
                Earn XP by completing coding challenges, building real-world blueprints, passing aptitude quizzes, and mastering interview questions.
              </p>
            </div>

            {/* Streak & Rank Counter */}
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 shrink-0">
              <div className="text-center px-3 border-r border-white/20">
                <div className="flex items-center justify-center gap-1 text-2xl font-black">
                  <Flame className="w-6 h-6 text-amber-300" />
                  <span>{profile?.current_streak || 4}</span>
                </div>
                <div className="text-[10px] uppercase font-bold text-white/80">Day Streak</div>
              </div>

              <div className="text-center px-3">
                <div className="flex items-center justify-center gap-1 text-2xl font-black">
                  <Zap className="w-6 h-6 text-yellow-300" />
                  <span>Lvl {currentLevel}</span>
                </div>
                <div className="text-[10px] uppercase font-bold text-white/80">Current Rank</div>
              </div>
            </div>
          </div>

          {/* Level Progress Bar */}
          <div className="relative z-10 mt-6 pt-6 border-t border-white/20 space-y-2">
            <div className="flex justify-between text-xs font-bold text-orange-100">
              <span>Level {currentLevel}: {levelInfo.title}</span>
              <span>{pctToNext}% to Level {currentLevel + 1} ({levelInfo.max_xp - currentXP} XP needed)</span>
            </div>
            <div className="w-full bg-black/20 rounded-full h-3 overflow-hidden">
              <div
                className="bg-white h-full transition-all duration-500 rounded-full"
                style={{ width: `${pctToNext}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Badges Grid */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-primary-600" />
              Career Badges & Milestones
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Unlock badges as you hit coding milestones, complete project blueprints, and ace interviews.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {profile?.achievements?.map((ach) => {
              const isUnlocked = profile?.unlocked_achievements?.includes(ach.id) || profile?.unlocked_achievements?.includes(ach.code);
              return (
                <div
                  key={ach.id}
                  className={`p-5 rounded-2xl border transition-all flex items-start gap-4 ${
                    isUnlocked
                      ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/60 shadow-sm'
                      : 'bg-slate-50/50 dark:bg-slate-800/20 border-slate-200 dark:border-slate-800 opacity-60'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                    isUnlocked
                      ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                  }`}>
                    {isUnlocked ? <Award className="w-6 h-6" /> : <Lock className="w-5 h-5" />}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                        {ach.name}
                      </h4>
                      {isUnlocked && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                          Unlocked
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {ach.description}
                    </p>
                    <span className="text-xs font-mono font-semibold text-amber-600 dark:text-amber-400 inline-block pt-1">
                      +{ach.xp_reward} XP
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementsPage;
