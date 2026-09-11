import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Clock,
  CheckCircle2,
  Calendar,
  ArrowRight,
  Target,
  Sliders,
  RotateCcw
} from 'lucide-react';
import { aptitudeService } from '../../services/aptitude.service';

export default function AptitudeHistory() {
  const [attempts, setAttempts] = useState([]);
  const [selectedMode, setSelectedMode] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      setLoading(true);
      try {
        const res = await aptitudeService.getHistory({
          mode: selectedMode !== 'all' ? selectedMode : undefined,
          limit: 20
        });
        setAttempts(res.attempts || []);
      } catch (err) {
        console.error('Failed to load attempt history:', err);
      } finally {
        setLoading(false);
      }
    };
    loadHistory();
  }, [selectedMode]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase">
              <Clock className="w-3.5 h-3.5" /> Assessment Logs
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white mt-1">
              Attempt History & Reports
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Review prior test scores, accuracy percentages, and deep diagnostic reports.
            </p>
          </div>

          <Link
            to="/aptitude/practice"
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Target className="w-4 h-4" /> Start New Practice
          </Link>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'all', label: 'All Attempts' },
            { id: 'practice', label: 'Practice Mode' },
            { id: 'timed', label: 'Timed Drills' },
            { id: 'mock_test', label: 'Placement Mocks' },
            { id: 'daily_challenge', label: 'Daily Challenges' }
          ].map((mode) => (
            <button
              key={mode.id}
              type="button"
              onClick={() => setSelectedMode(mode.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedMode === mode.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>

        {/* Attempts Table / List */}
        {loading ? (
          <div className="py-20 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
          </div>
        ) : attempts.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 flex items-center justify-center mx-auto">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No Attempts Recorded Yet
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You haven't completed any assessments under this category yet. Start a quick practice session to see your results logged here.
            </p>
            <div className="pt-2">
              <Link
                to="/aptitude/practice"
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm inline-flex items-center gap-1.5"
              >
                <Target className="w-4 h-4" /> Start Practice Set
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="py-3.5 px-6">Date</th>
                    <th className="py-3.5 px-6">Mode</th>
                    <th className="py-3.5 px-6">Score</th>
                    <th className="py-3.5 px-6">Accuracy</th>
                    <th className="py-3.5 px-6">Time Spent</th>
                    <th className="py-3.5 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  {attempts.map((att) => {
                    const dateStr = att.created_at
                      ? new Date(att.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })
                      : 'Recently';

                    const minutes = Math.floor((att.time_spent_seconds || 0) / 60);
                    const seconds = (att.time_spent_seconds || 0) % 60;

                    const modeBadges = {
                      practice: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300',
                      timed: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
                      mock_test: 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300',
                      daily_challenge: 'bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300'
                    };

                    return (
                      <tr key={att.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="py-4 px-6 font-medium text-slate-900 dark:text-white whitespace-nowrap">
                          {dateStr}
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap">
                          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold capitalize ${modeBadges[att.mode] || modeBadges.practice}`}>
                            {att.mode ? att.mode.replace('_', ' ') : 'Practice'}
                          </span>
                        </td>
                        <td className="py-4 px-6 font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                          {att.score} / {att.total_questions}
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap">
                          <span className={`font-bold ${
                            (att.accuracy || 0) >= 75 ? 'text-emerald-600' : (att.accuracy || 0) >= 50 ? 'text-indigo-600' : 'text-rose-600'
                          }`}>
                            {att.accuracy || 0}%
                          </span>
                        </td>
                        <td className="py-4 px-6 text-slate-500 whitespace-nowrap">
                          {minutes}m {seconds}s
                        </td>
                        <td className="py-4 px-6 text-right whitespace-nowrap">
                          <Link
                            to={`/aptitude/results/${att.id}`}
                            className="inline-flex items-center gap-1 font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                          >
                            View Report <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
