import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Flame,
  Clock,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Send,
  Trophy
} from 'lucide-react';
import { aptitudeService } from '../../services/aptitude.service';
import { QuestionCard } from '../../components/aptitude/QuestionCard';
import { TimerCountdown } from '../../components/aptitude/TimerCountdown';
import { useAuth } from '../../context/AuthContext';

export default function AptitudeDailyChallenge() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [challenge, setChallenge] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [isStarted, setIsStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [attemptId, setAttemptId] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [streak, setStreak] = useState(3); // Default sample streak
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadChallenge = async () => {
      try {
        const data = await aptitudeService.getDailyChallenge();
        setChallenge(data);
        setQuestions(data?.questions || []);
      } catch (err) {
        console.error('Failed to load daily challenge:', err);
      } finally {
        setLoading(false);
      }
    };
    loadChallenge();
  }, []);

  const handleStart = async () => {
    try {
      const attempt = await aptitudeService.startAttempt({
        mode: 'daily_challenge',
        total_questions: questions.length,
        duration_minutes: challenge?.duration_minutes || 5
      });
      setAttemptId(attempt?.id || 'att-' + Date.now());
      setStartTime(Date.now());
      setIsStarted(true);
    } catch (err) {
      console.error('Failed to start challenge attempt:', err);
      setAttemptId('att-' + Date.now());
      setStartTime(Date.now());
      setIsStarted(true);
    }
  };

  const handleSelectOption = (key) => {
    const currentQ = questions[currentIndex];
    if (!currentQ) return;
    setUserAnswers((prev) => ({
      ...prev,
      [currentQ.id]: key
    }));
  };

  const handleSubmitChallenge = async () => {
    if (submitting) return;
    setSubmitting(true);

    const timeSpentSeconds = Math.round((Date.now() - (startTime || Date.now())) / 1000);
    const answersPayload = questions.map((q) => ({
      questionId: q.id,
      selectedOption: userAnswers[q.id] || null,
      timeSpentSeconds: Math.round(timeSpentSeconds / (questions.length || 1))
    }));

    try {
      const result = await aptitudeService.submitAttempt(attemptId, {
        answers: answersPayload,
        time_spent_seconds: timeSpentSeconds
      });

      // Increment streak in local storage
      const savedStreak = parseInt(localStorage.getItem('aptitude_daily_streak') || '3', 10) + 1;
      localStorage.setItem('aptitude_daily_streak', savedStreak.toString());

      navigate(`/aptitude/results/${result.id || attemptId}`);
    } catch (err) {
      console.error('Failed to submit challenge:', err);
      navigate(`/aptitude/results/${attemptId}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-600" />
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const todayStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  // Active Runner
  if (isStarted && currentQ) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Header */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-600 flex items-center justify-center font-bold">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block">
                  Daily Challenge
                </span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Question {currentIndex + 1} of {questions.length}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <TimerCountdown
                durationMinutes={challenge?.duration_minutes || 5}
                onTimeUp={handleSubmitChallenge}
              />
              <button
                type="button"
                onClick={handleSubmitChallenge}
                disabled={submitting}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-sm transition-all"
              >
                {submitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>

          {/* Progress */}
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-amber-500 h-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>

          {/* Question Card */}
          <QuestionCard
            question={currentQ}
            index={currentIndex}
            total={questions.length}
            selectedOption={userAnswers[currentQ.id] || null}
            onSelectOption={handleSelectOption}
            showInstantFeedback={false}
          />

          {/* Controls */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 disabled:opacity-40 text-slate-700 dark:text-slate-300 font-bold text-xs shadow-sm hover:bg-slate-50 transition-all flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Previous
            </button>

            {currentIndex < questions.length - 1 ? (
              <button
                type="button"
                onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5"
              >
                Next <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmitChallenge}
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Submit Challenge
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Welcome Screen
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <Link
          to="/aptitude"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Aptitude Arena
        </Link>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-10 shadow-sm space-y-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-orange-500/20">
            <Flame className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 uppercase">
                Daily Placement Drill
              </span>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> {todayStr}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Today's 5-Minute Daily Challenge
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
              5 questions curated across Quantitative, Logical, and Verbal modules. 
              Solve them within 5 minutes to maintain your daily preparation streak.
            </p>
          </div>

          {/* Streak Box */}
          <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 max-w-sm mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Trophy className="w-5 h-5 text-amber-600" />
              <div className="text-left">
                <span className="text-xs font-bold text-slate-900 dark:text-white block">Daily Streak</span>
                <span className="text-[11px] text-slate-500">Practice every day</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xl font-black text-amber-600">{streak} Days 🔥</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleStart}
            className="w-full py-3.5 px-6 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm shadow-lg hover:shadow-amber-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" /> Start Today's 5-Minute Challenge
          </button>
        </div>
      </div>
    </div>
  );
}
