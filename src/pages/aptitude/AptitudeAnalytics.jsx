import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  Target,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Award,
  ArrowRight,
  Flame,
  BookOpen,
  Zap,
  BarChart2
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { aptitudeService } from '../../services/aptitude.service';
import { useAuth } from '../../context/AuthContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function AptitudeAnalytics() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const [data, achs] = await Promise.all([
          aptitudeService.getAnalytics(),
          aptitudeService.getAchievements()
        ]);
        setAnalytics(data);
        setAchievements(achs || []);
      } catch (err) {
        console.error('Failed to load aptitude analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
      </div>
    );
  }

  // Trend Chart Data
  const trendLabels = analytics?.trend?.length > 0
    ? analytics.trend.map((t) => t.date || `Test ${t.attempt_number}`)
    : ['Attempt 1', 'Attempt 2', 'Attempt 3', 'Attempt 4', 'Attempt 5'];

  const trendScores = analytics?.trend?.length > 0
    ? analytics.trend.map((t) => t.accuracy)
    : [65, 70, 75, 80, 85];

  const trendChartData = {
    labels: trendLabels,
    datasets: [
      {
        label: 'Accuracy (%)',
        data: trendScores,
        borderColor: '#4f46e5',
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        fill: true,
        tension: 0.35,
        pointBackgroundColor: '#4f46e5',
        pointRadius: 4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `Accuracy: ${context.parsed.y}%`
        }
      }
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        ticks: {
          stepSize: 20,
          callback: (value) => `${value}%`
        },
        grid: { color: 'rgba(148, 163, 184, 0.1)' }
      },
      x: {
        grid: { display: false }
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase">
              <TrendingUp className="w-3.5 h-3.5" /> Diagnostic Intelligence
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">
              Aptitude Mastery & Analytics
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Track your longitudinal progress, category proficiencies, and targeted diagnostic recommendations.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/aptitude/practice"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5"
            >
              <Target className="w-4 h-4" /> Practice Set
            </Link>
            <Link
              to="/aptitude/history"
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-all"
            >
              History Log
            </Link>
          </div>
        </div>

        {/* Overview Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Attempts</span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {analytics?.total_attempts || 0}
            </div>
            <span className="text-[11px] text-slate-500">Practice & mock tests</span>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Questions Solved</span>
            <div className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400">
              {analytics?.total_questions_solved || 0}
            </div>
            <span className="text-[11px] text-slate-500">
              {analytics?.total_correct || 0} answered correctly
            </span>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Overall Accuracy</span>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
              {analytics?.overall_accuracy || 0}%
            </div>
            <span className="text-[11px] text-slate-500">Benchmark target: 80%+</span>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Average Speed</span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {analytics?.average_time_per_question || 0}s
            </div>
            <span className="text-[11px] text-slate-500">Per question response time</span>
          </div>
        </div>

        {/* 2-Column Section: Category Mastery & Accuracy Trend */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category Mastery */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Category Proficiencies
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Accuracy breakdown across the 4 foundational aptitude pillars.
              </p>
            </div>

            <div className="space-y-4">
              {(analytics?.category_mastery || []).map((cat) => (
                <div key={cat.id} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-800 dark:text-slate-200">{cat.name}</span>
                    <span className="text-slate-500">
                      {cat.total_attempted > 0 ? `${cat.accuracy}% (${cat.total_attempted} Qs)` : 'Not Started'}
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        cat.accuracy >= 75 ? 'bg-emerald-500' : cat.accuracy >= 50 ? 'bg-indigo-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${cat.accuracy || 10}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Accuracy Trend Chart */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4 flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Accuracy Progression Trend
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Historical score trajectory over your recent assessments.
              </p>
            </div>

            <div className="h-56 w-full pt-2">
              <Line data={trendChartData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* WEAK TOPICS RECOMMENDATIONS */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-sm">
            <AlertTriangle className="w-4 h-4" />
            Adaptive Recommendations: Focus Areas (&lt;60% Accuracy)
          </div>

          {analytics?.weak_topics && analytics.weak_topics.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {analytics.weak_topics.map((wt) => (
                <div
                  key={wt.topic_id}
                  className="p-4 rounded-2xl border border-rose-200/80 dark:border-rose-900/40 bg-rose-50/30 dark:bg-rose-950/10 flex flex-col justify-between space-y-3"
                >
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {wt.topic_name}
                    </h4>
                    <span className="text-[11px] text-rose-600 dark:text-rose-400 font-bold block mt-0.5">
                      Accuracy: {wt.accuracy}% ({wt.correct}/{wt.total} correct)
                    </span>
                  </div>
                  <Link
                    to={`/aptitude/practice?topic=${wt.topic_id}`}
                    className="w-full py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs text-center transition-all flex items-center justify-center gap-1"
                  >
                    Targeted Practice <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 dark:text-slate-400 bg-emerald-50 dark:bg-emerald-950/20 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-300 font-medium">
              🎉 Outstanding! You have no weak topics (&lt;60% accuracy) recorded. Continue regular practice to maintain your placement readiness!
            </p>
          )}
        </div>

        {/* ACHIEVEMENTS & BADGES */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Aptitude Badges & Milestones
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Earn achievements as you solve questions, maintain streaks, and score 100%.
              </p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300">
              {achievements.filter((a) => a.unlocked).length}/{achievements.length} Unlocked
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {achievements.map((ach) => (
              <div
                key={ach.id}
                className={`p-4 rounded-2xl border text-center space-y-2 transition-all ${
                  ach.unlocked
                    ? 'border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/20 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 opacity-40 grayscale'
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto text-xl font-bold">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {ach.name}
                  </h4>
                  <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">
                    {ach.description}
                  </p>
                </div>
                {ach.unlocked && (
                  <span className="inline-block text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                    Unlocked ✓
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
