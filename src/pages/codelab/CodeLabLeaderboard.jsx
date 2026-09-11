import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { codelabService } from '../../services/codelab.service';
import { PageTransition } from '../../components/layout/PageTransition';
import { Trophy, ArrowLeft, Medal, Flame, Target } from 'lucide-react';

export const CodeLabLeaderboard = () => {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    codelabService.getLeaderboard('weekly').then(setLeaders);
  }, []);

  return (
    <PageTransition>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
          <Link to="/codelab" className="text-xs font-semibold text-slate-400 hover:text-slate-600 flex items-center space-x-1">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to CodeLab</span>
          </Link>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-900 dark:text-white">CodeLab Leaderboard</h1>
                <p className="text-xs text-slate-500">Weekly rankings based on verified problem solutions and accuracy.</p>
              </div>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {leaders.map((item) => (
                <div key={item.rank} className="py-3.5 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className={`w-6 text-center font-bold text-sm ${item.rank === 1 ? 'text-amber-500' : item.rank === 2 ? 'text-slate-400' : item.rank === 3 ? 'text-amber-700' : 'text-slate-500'}`}>
                      #{item.rank}
                    </span>
                    <img src={item.avatar} alt={item.name} className="w-9 h-9 rounded-full object-cover" />
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white">{item.name}</div>
                      <div className="text-[11px] text-slate-400">{item.solved} Problems Solved</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-extrabold text-primary-600 dark:text-primary-400">{item.xp} XP</div>
                    <div className="text-[10px] text-emerald-500 font-semibold">{item.accuracy}% Accuracy</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};
