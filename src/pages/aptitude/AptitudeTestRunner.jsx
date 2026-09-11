import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Send,
  Flag,
  RotateCcw,
  ShieldAlert,
  Play
} from 'lucide-react';
import { aptitudeService } from '../../services/aptitude.service';
import { QuestionCard } from '../../components/aptitude/QuestionCard';
import { TimerCountdown } from '../../components/aptitude/TimerCountdown';
import { QuestionPalette } from '../../components/aptitude/QuestionPalette';
import { useAuth } from '../../context/AuthContext';

export default function AptitudeTestRunner() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [test, setTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [isExamStarted, setIsExamStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { [qId]: selectedKey }
  const [flagged, setFlagged] = useState({}); // { [qId]: boolean }
  const [attemptId, setAttemptId] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Load test by slug
  useEffect(() => {
    const loadTest = async () => {
      try {
        const data = await aptitudeService.getMockTestBySlug(slug);
        if (!data) {
          alert('Test not found.');
          navigate('/aptitude/mock-tests');
          return;
        }
        setTest(data);
        setQuestions(data.questions || []);
      } catch (err) {
        console.error('Failed to load test:', err);
      } finally {
        setLoading(false);
      }
    };
    loadTest();
  }, [slug, navigate]);

  // Start exam
  const handleStartExam = async () => {
    try {
      const attempt = await aptitudeService.startAttempt({
        mode: 'mock_test',
        test_id: test.id,
        category_id: test.category_id || null,
        total_questions: questions.length,
        duration_minutes: test.duration_minutes
      });

      setAttemptId(attempt?.id || 'att-' + Date.now());
      setStartTime(Date.now());
      setIsExamStarted(true);
    } catch (err) {
      console.error('Failed to start attempt:', err);
      setAttemptId('att-' + Date.now());
      setStartTime(Date.now());
      setIsExamStarted(true);
    }
  };

  // Select Option
  const handleSelectOption = (key) => {
    const currentQ = questions[currentIndex];
    if (!currentQ) return;
    setUserAnswers((prev) => ({
      ...prev,
      [currentQ.id]: key
    }));
  };

  // Clear current response
  const handleClearResponse = () => {
    const currentQ = questions[currentIndex];
    if (!currentQ) return;
    setUserAnswers((prev) => {
      const copy = { ...prev };
      delete copy[currentQ.id];
      return copy;
    });
  };

  // Toggle flag
  const handleToggleFlag = () => {
    const currentQ = questions[currentIndex];
    if (!currentQ) return;
    setFlagged((prev) => ({
      ...prev,
      [currentQ.id]: !prev[currentQ.id]
    }));
  };

  // Submit test
  const handleSubmitExam = async () => {
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

      navigate(`/aptitude/results/${result.id || attemptId}`);
    } catch (err) {
      console.error('Failed to submit exam attempt:', err);
      navigate(`/aptitude/results/${attemptId}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (!test) return null;

  // -------------------------------------------------------------
  // PRE-EXAM INSTRUCTIONS SCREEN
  // -------------------------------------------------------------
  if (!isExamStarted) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-8">
          <Link
            to="/aptitude/mock-tests"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Mock Tests
          </Link>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-10 shadow-sm space-y-6">
            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
                Examination Guidelines
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                {test.title}
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {test.description}
              </p>
            </div>

            {/* Test Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-y border-slate-100 dark:border-slate-800 text-center">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                <span className="text-[11px] font-bold text-slate-400 uppercase block">Duration</span>
                <span className="text-lg font-black text-slate-900 dark:text-white">{test.duration_minutes} Mins</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                <span className="text-[11px] font-bold text-slate-400 uppercase block">Questions</span>
                <span className="text-lg font-black text-slate-900 dark:text-white">{questions.length}</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                <span className="text-[11px] font-bold text-slate-400 uppercase block">Correct</span>
                <span className="text-lg font-black text-emerald-600">+1 Mark</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                <span className="text-[11px] font-bold text-slate-400 uppercase block">Negative</span>
                <span className="text-lg font-black text-slate-600 dark:text-slate-300">0 Marks</span>
              </div>
            </div>

            {/* Rules List */}
            <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">Important Instructions:</h4>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>The countdown timer starts as soon as you click <strong>Begin Assessment</strong>.</li>
                <li>You can freely navigate back and forth between questions using the Question Palette on the right.</li>
                <li>You can flag questions for later review and change your selected option at any time.</li>
                <li>When the timer reaches 00:00, your test will be automatically submitted.</li>
                <li>Complete step-by-step solutions and weak topic diagnostics will be unlocked on your score report immediately upon submission.</li>
              </ul>
            </div>

            {/* Launch Button */}
            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={handleStartExam}
                className="px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md hover:shadow-indigo-500/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4" /> Begin Assessment Now
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // ACTIVE EXAM RUNNER
  // -------------------------------------------------------------
  const currentQ = questions[currentIndex];
  const questionIds = questions.map((q) => q.id);
  const answeredCount = Object.values(userAnswers).filter(Boolean).length;
  const unansweredCount = questions.length - answeredCount;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-6 px-4 sm:px-6 lg:px-8 select-none">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Sticky Exam Top Header */}
        <div className="sticky top-2 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-md flex items-center justify-between gap-4">
          <div className="truncate max-w-md">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
              {test.title}
            </h2>
            <div className="text-xs text-slate-400">
              Question {currentIndex + 1} of {questions.length} • {answeredCount} Answered
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <TimerCountdown
              durationMinutes={test.duration_minutes}
              onTimeUp={handleSubmitExam}
            />

            <button
              type="button"
              onClick={() => setShowSubmitModal(true)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" /> Submit
            </button>
          </div>
        </div>

        {/* 2-Column Main Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Question Area (8 columns) */}
          <div className="lg:col-span-8 space-y-6">
            <QuestionCard
              question={currentQ}
              index={currentIndex}
              total={questions.length}
              selectedOption={userAnswers[currentQ?.id] || null}
              onSelectOption={handleSelectOption}
              showInstantFeedback={false} // strictly hidden in mock exam
              isFlagged={Boolean(flagged[currentQ?.id])}
              onToggleFlag={handleToggleFlag}
            />

            {/* Bottom Question Controls */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentIndex === 0}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 disabled:opacity-40 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-50 transition-all flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Previous
                </button>

                <button
                  type="button"
                  onClick={handleClearResponse}
                  disabled={!userAnswers[currentQ?.id]}
                  className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 disabled:opacity-40 text-slate-500 hover:text-rose-600 text-xs font-semibold transition-colors flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Clear
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleToggleFlag}
                  className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    flagged[currentQ?.id]
                      ? 'border-amber-500 bg-amber-500/10 text-amber-600'
                      : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Flag className="w-3 h-3" />
                  {flagged[currentQ?.id] ? 'Unflag' : 'Mark for Review'}
                </button>

                {currentIndex < questions.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5"
                  >
                    Next <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowSubmitModal(true)}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5"
                  >
                    Finish Exam <Send className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Question Palette Sidebar (4 columns) */}
          <div className="lg:col-span-4 sticky top-24">
            <QuestionPalette
              totalQuestions={questions.length}
              currentIndex={currentIndex}
              answers={userAnswers}
              questionIds={questionIds}
              flagged={flagged}
              onSelectIndex={(idx) => setCurrentIndex(idx)}
              onSubmitTest={() => setShowSubmitModal(true)}
              isSubmitting={submitting}
            />
          </div>
        </div>

        {/* Submit Confirmation Modal */}
        {showSubmitModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 flex items-center justify-center">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Submit Assessment?
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Review your status before final submission.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-center text-xs">
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl">
                  <span className="text-emerald-700 dark:text-emerald-300 font-bold text-lg block">{answeredCount}</span>
                  <span className="text-emerald-800 dark:text-emerald-400 text-[11px] font-semibold">Answered</span>
                </div>
                <div className="p-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
                  <span className="text-slate-700 dark:text-slate-300 font-bold text-lg block">{unansweredCount}</span>
                  <span className="text-slate-500 text-[11px] font-semibold">Unanswered</span>
                </div>
              </div>

              {unansweredCount > 0 && (
                <p className="text-xs text-amber-600 dark:text-amber-400 bg-amber-500/10 p-3 rounded-xl border border-amber-500/20">
                  ⚠️ You still have {unansweredCount} unanswered questions. You can return to answer them.
                </p>
              )}

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 transition-colors"
                >
                  Return to Test
                </button>
                <button
                  type="button"
                  onClick={handleSubmitExam}
                  disabled={submitting}
                  className="w-1/2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  {submitting ? 'Submitting...' : 'Confirm Submit'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
