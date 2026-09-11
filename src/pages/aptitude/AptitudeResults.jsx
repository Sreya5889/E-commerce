import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Trophy,
  CheckCircle2,
  XCircle,
  Clock,
  Target,
  ArrowRight,
  RotateCcw,
  TrendingUp,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  BookOpen,
  HelpCircle,
  Share2
} from 'lucide-react';
import { aptitudeService } from '../../services/aptitude.service';

export default function AptitudeResults() {
  const { attemptId } = useParams();
  const navigate = useNavigate();

  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  useEffect(() => {
    const loadAttempt = async () => {
      try {
        const data = await aptitudeService.getAttemptById(attemptId);
        setAttempt(data);
      } catch (err) {
        console.error('Failed to load attempt result:', err);
      } finally {
        setLoading(false);
      }
    };
    loadAttempt();
  }, [attemptId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (!attempt) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Score Report Not Found</h2>
        <p className="text-xs text-slate-500">The requested assessment attempt could not be retrieved.</p>
        <Link
          to="/aptitude"
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold"
        >
          Return to Aptitude Arena
        </Link>
      </div>
    );
  }

  const accuracy = attempt.accuracy || 0;
  const minutes = Math.floor((attempt.time_spent_seconds || 0) / 60);
  const seconds = (attempt.time_spent_seconds || 0) % 60;

  let badge = {
    title: 'Placement Ready — Outstanding',
    color: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
    desc: 'You demonstrated strong conceptual mastery and fast numerical problem solving.'
  };

  if (accuracy < 60) {
    badge = {
      title: 'Foundational Review Needed',
      color: 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30',
      desc: 'Significant room for improvement. Focus on step-by-step solutions for flagged weak topics.'
    };
  } else if (accuracy < 80) {
    badge = {
      title: 'Proficient — Good Foundation',
      color: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30',
      desc: 'Solid grasp of core formulas. Consistent practice on weak topics will push you to 90%+.'
    };
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Top Header Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-10 shadow-sm text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto shadow-sm">
            <Trophy className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className={`inline-block px-3.5 py-1 rounded-full text-xs font-bold border ${badge.color}`}>
              {badge.title}
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
              Assessment Score Report
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              {badge.desc}
            </p>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl">
              <span className="text-[11px] font-bold text-slate-400 uppercase block">Score</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white">
                {attempt.score} / {attempt.total_questions}
              </span>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl">
              <span className="text-[11px] font-bold text-slate-400 uppercase block">Accuracy</span>
              <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                {accuracy}%
              </span>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl">
              <span className="text-[11px] font-bold text-slate-400 uppercase block">Time Spent</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white">
                {minutes}m {seconds}s
              </span>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl">
              <span className="text-[11px] font-bold text-slate-400 uppercase block">Avg Speed</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white">
                {attempt.average_time_seconds || 0}s / Q
              </span>
            </div>
          </div>

          {/* Correct / Incorrect / Unanswered Breakdown */}
          <div className="grid grid-cols-3 gap-2 pt-2 text-xs font-semibold">
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40 flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>{attempt.correct_count || 0} Correct</span>
            </div>
            <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800/40 flex items-center justify-center gap-1.5">
              <XCircle className="w-4 h-4" />
              <span>{attempt.incorrect_count || 0} Incorrect</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>{attempt.unanswered_count || 0} Skipped</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <Link
              to="/aptitude/practice"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5"
            >
              <Target className="w-4 h-4" /> Practice More
            </Link>
            <Link
              to="/aptitude/analytics"
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 text-slate-700 dark:text-slate-300 font-bold text-xs transition-all flex items-center gap-1.5"
            >
              <TrendingUp className="w-4 h-4 text-emerald-500" /> Full Analytics
            </Link>
            <Link
              to="/aptitude"
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 hover:text-slate-900 font-semibold text-xs transition-all"
            >
              Aptitude Home
            </Link>
          </div>
        </div>

        {/* WEAK TOPICS RECOMMENDATION ALERT */}
        {attempt.weak_topics && attempt.weak_topics.length > 0 && (
          <div className="bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold text-sm">
              <AlertTriangle className="w-5 h-5" />
              Diagnostic Insight: Actionable Weak Areas
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Your accuracy was below 60% in the following topics. Targeted practice in these areas will yield the fastest score improvement:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {attempt.weak_topics.map((wt) => (
                <div
                  key={wt.topic_id}
                  className="bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/50 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-xs"
                >
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {wt.topic_name}
                    </h4>
                    <span className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold">
                      Accuracy: {wt.accuracy}%
                    </span>
                  </div>
                  <Link
                    to={`/aptitude/practice?topic=${wt.topic_id}`}
                    className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shrink-0 flex items-center gap-1"
                  >
                    Practice <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TOPIC MASTERY BREAKDOWN */}
        {attempt.topic_performance && attempt.topic_performance.length > 0 && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Topic-by-Topic Performance
            </h3>
            <div className="space-y-3">
              {attempt.topic_performance.map((tp) => (
                <div key={tp.topic_id} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-800 dark:text-slate-200 font-semibold">{tp.topic_name}</span>
                    <span className="text-slate-500">
                      {tp.correct}/{tp.total} ({tp.accuracy}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        tp.accuracy >= 75 ? 'bg-emerald-500' : tp.accuracy >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${tp.accuracy}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DETAILED QUESTION-BY-QUESTION REVIEW */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Detailed Solutions & Explanations ({attempt.answers?.length || 0})
            </h3>
            <span className="text-xs text-slate-500">Click any question to view solution</span>
          </div>

          <div className="space-y-3">
            {(attempt.answers || []).map((ans, idx) => {
              const isExpanded = expandedQuestion === ans.question_id || expandedQuestion === idx;
              const isCorrect = ans.is_correct;
              const isAnswered = Boolean(ans.selected_option);

              return (
                <div
                  key={ans.question_id || idx}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedQuestion(isExpanded ? null : (ans.question_id || idx))}
                    className="w-full p-4 text-left flex items-start justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <div className="space-y-1">
                        <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white line-clamp-2">
                          {ans.question_text}
                        </p>
                        <div className="flex items-center gap-3 text-[11px]">
                          {isCorrect ? (
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Correct (+1)
                            </span>
                          ) : isAnswered ? (
                            <span className="text-rose-600 dark:text-rose-400 font-bold flex items-center gap-1">
                              <XCircle className="w-3.5 h-3.5" /> Incorrect (Your choice: {ans.selected_option})
                            </span>
                          ) : (
                            <span className="text-slate-400 font-medium">Skipped</span>
                          )}
                          <span className="text-slate-400">•</span>
                          <span className="text-slate-500 font-medium">
                            Correct: {ans.correct_option}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-slate-400 shrink-0">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-4 text-xs sm:text-sm">
                      {/* Options breakdown */}
                      <div className="space-y-2">
                        <span className="text-[11px] font-bold text-slate-400 uppercase">Options:</span>
                        <div className="space-y-1.5">
                          {(ans.options || []).map((opt) => {
                            const isUserPick = opt.key === ans.selected_option;
                            const isCorrectKey = opt.key === ans.correct_option;

                            let optClass = 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300';
                            if (isCorrectKey) {
                              optClass = 'border-emerald-500 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 font-bold';
                            } else if (isUserPick && !isCorrectKey) {
                              optClass = 'border-rose-500 bg-rose-500/10 text-rose-800 dark:text-rose-300 font-bold';
                            }

                            return (
                              <div
                                key={opt.key}
                                className={`p-2.5 rounded-xl border flex items-center gap-2.5 ${optClass}`}
                              >
                                <span className="w-5 h-5 rounded-md bg-white dark:bg-slate-900 border text-xs font-bold flex items-center justify-center shrink-0">
                                  {opt.key}
                                </span>
                                <span>{opt.text}</span>
                                {isCorrectKey && <span className="ml-auto text-emerald-600 font-bold text-[11px]">Correct Answer</span>}
                                {isUserPick && !isCorrectKey && <span className="ml-auto text-rose-600 font-bold text-[11px]">Your Answer</span>}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Explanation */}
                      {ans.explanation && (
                        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                          <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white text-xs">
                            <HelpCircle className="w-4 h-4 text-indigo-600" />
                            Detailed Mathematical Rationale:
                          </div>
                          <div className="whitespace-pre-line font-mono text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                            {ans.explanation}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
