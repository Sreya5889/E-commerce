import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Target,
  Clock,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Sliders,
  RotateCcw,
  Zap,
  BookOpen
} from 'lucide-react';
import { aptitudeService } from '../../services/aptitude.service';
import { QuestionCard } from '../../components/aptitude/QuestionCard';
import { TimerCountdown } from '../../components/aptitude/TimerCountdown';
import { useAuth } from '../../context/AuthContext';

export default function AptitudePractice() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Configuration state
  const [categories, setCategories] = useState([]);
  const [topics, setTopics] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedTopic, setSelectedTopic] = useState(searchParams.get('topic') || 'all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [questionCount, setQuestionCount] = useState(10);
  const [practiceMode, setPracticeMode] = useState('practice'); // 'practice' (instant answer) or 'timed'

  // Active Session state
  const [isInSession, setIsInSession] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { [qId]: selectedKey }
  const [flagged, setFlagged] = useState({});
  const [attemptId, setAttemptId] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Load categories and topics
  useEffect(() => {
    const loadTaxonomy = async () => {
      try {
        const [cats, topList] = await Promise.all([
          aptitudeService.getCategories(),
          aptitudeService.getTopics(selectedCategory !== 'all' ? selectedCategory : undefined)
        ]);
        setCategories(cats || []);
        setTopics(topList || []);
      } catch (err) {
        console.error('Failed to load taxonomy:', err);
      } finally {
        setLoading(false);
      }
    };
    loadTaxonomy();
  }, [selectedCategory]);

  // When category changes in dropdown, update URL search params and filter topics
  const handleCategoryChange = (catId) => {
    setSelectedCategory(catId);
    setSelectedTopic('all');
    if (catId === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', catId);
    }
    setSearchParams(searchParams);
  };

  // Start a new practice session
  const handleStartSession = async () => {
    setLoading(true);
    try {
      const res = await aptitudeService.getQuestions({
        categoryId: selectedCategory !== 'all' ? selectedCategory : undefined,
        topicId: selectedTopic !== 'all' ? selectedTopic : undefined,
        difficulty: selectedDifficulty !== 'all' ? selectedDifficulty : undefined,
        limit: questionCount,
        shuffle: true,
        mode: practiceMode
      });

      if (!res.questions || res.questions.length === 0) {
        alert('No questions match the selected criteria. Please broaden your selection.');
        setLoading(false);
        return;
      }

      // Initialize attempt in backend
      const attempt = await aptitudeService.startAttempt({
        mode: practiceMode === 'timed' ? 'timed' : 'practice',
        category_id: selectedCategory !== 'all' ? selectedCategory : null,
        topic_id: selectedTopic !== 'all' ? selectedTopic : null,
        total_questions: res.questions.length,
        duration_minutes: practiceMode === 'timed' ? Math.ceil(res.questions.length * 1.5) : 30
      });

      setQuestions(res.questions);
      setAttemptId(attempt?.id || 'att-' + Date.now());
      setCurrentIndex(0);
      setUserAnswers({});
      setFlagged({});
      setStartTime(Date.now());
      setIsInSession(true);
    } catch (err) {
      console.error('Failed to start practice session:', err);
      alert('Could not start practice session. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Select an option
  const handleSelectOption = (key) => {
    const currentQ = questions[currentIndex];
    if (!currentQ) return;
    setUserAnswers((prev) => ({
      ...prev,
      [currentQ.id]: key
    }));
  };

  // Toggle flag for current question
  const handleToggleFlag = () => {
    const currentQ = questions[currentIndex];
    if (!currentQ) return;
    setFlagged((prev) => ({
      ...prev,
      [currentQ.id]: !prev[currentQ.id]
    }));
  };

  // Finish practice session and submit
  const handleFinishSession = async () => {
    if (submitting) return;
    setSubmitting(true);

    const timeSpentSeconds = Math.round((Date.now() - (startTime || Date.now())) / 1000);
    const answersPayload = questions.map((q) => ({
      questionId: q.id,
      selectedOption: userAnswers[q.id] || null,
      timeSpentSeconds: Math.round(timeSpentSeconds / questions.length)
    }));

    try {
      const result = await aptitudeService.submitAttempt(attemptId, {
        answers: answersPayload,
        time_spent_seconds: timeSpentSeconds
      });

      navigate(`/aptitude/results/${result.id || attemptId}`);
    } catch (err) {
      console.error('Failed to submit practice attempt:', err);
      navigate(`/aptitude/results/${attemptId}`);
    } finally {
      setSubmitting(false);
    }
  };

  const currentQ = questions[currentIndex];

  // -------------------------------------------------------------
  // ACTIVE PRACTICE RUNNER VIEW
  // -------------------------------------------------------------
  if (isInSession && currentQ) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Top Session Bar */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Are you sure you want to end this practice session?')) {
                    setIsInSession(false);
                  }
                }}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 text-xs font-semibold flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" /> Exit
              </button>

              <div className="hidden sm:block">
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                  Practice Session
                </span>
                <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  Question {currentIndex + 1} of {questions.length}
                </div>
              </div>
            </div>

            {/* Timed countdown or progress badge */}
            <div className="flex items-center gap-3">
              {practiceMode === 'timed' ? (
                <TimerCountdown
                  durationMinutes={Math.ceil(questions.length * 1.5)}
                  onTimeUp={handleFinishSession}
                />
              ) : (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300">
                  Untimed Practice
                </span>
              )}

              <button
                type="button"
                onClick={handleFinishSession}
                disabled={submitting}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                {submitting ? 'Submitting...' : 'Finish Session'}
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 h-full transition-all duration-300"
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
            showInstantFeedback={practiceMode === 'practice'}
            isFlagged={Boolean(flagged[currentQ.id])}
            onToggleFlag={handleToggleFlag}
          />

          {/* Bottom Navigation Controls */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 disabled:opacity-40 text-slate-700 dark:text-slate-300 font-bold text-xs shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Previous
            </button>

            <span className="text-xs text-slate-400 font-medium">
              {Object.keys(userAnswers).length} answered of {questions.length}
            </span>

            {currentIndex < questions.length - 1 ? (
              <button
                type="button"
                onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5"
              >
                Next <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinishSession}
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Complete Practice
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // CONFIGURATOR / LAUNCH VIEW
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase">
            <Sliders className="w-3.5 h-3.5" /> Custom Practice Session
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">
            Aptitude Practice Arena
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Configure your custom practice set by category, specific topic, difficulty level, and practice mode.
          </p>
        </div>

        {/* Configuration Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-8">
          {/* Category Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3">
              1. Select Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              <button
                type="button"
                onClick={() => handleCategoryChange('all')}
                className={`p-3 rounded-xl border text-xs font-bold text-center transition-all cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-600'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-indigo-300'
                }`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`p-3 rounded-xl border text-xs font-bold text-center transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-600'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-indigo-300'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Topic Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3">
              2. Select Topic Focus
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-48 overflow-y-auto pr-1">
              <button
                type="button"
                onClick={() => setSelectedTopic('all')}
                className={`p-2.5 rounded-xl border text-xs font-medium text-left transition-all ${
                  selectedTopic === 'all'
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-bold'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                }`}
              >
                All Topics in Selection
              </button>
              {topics.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelectedTopic(t.id)}
                  className={`p-2.5 rounded-xl border text-xs font-medium text-left transition-all truncate ${
                    selectedTopic === t.id
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-bold'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  }`}
                  title={t.name}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty & Count */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3">
                3. Difficulty Level
              </label>
              <div className="grid grid-cols-4 gap-2">
                {['all', 'easy', 'medium', 'hard'].map((diff) => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => setSelectedDifficulty(diff)}
                    className={`py-2 rounded-xl border text-xs font-bold capitalize transition-all ${
                      selectedDifficulty === diff
                        ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3">
                4. Number of Questions
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[5, 10, 15, 20].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setQuestionCount(num)}
                    className={`py-2 rounded-xl border text-xs font-bold transition-all ${
                      questionCount === num
                        ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    {num} Qs
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Practice Mode Choice */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3">
              5. Practice Format
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={() => setPracticeMode('practice')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  practiceMode === 'practice'
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 ring-1 ring-indigo-600'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  Standard Practice Mode
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Untimed session. Click "Check Answer" after every question to view step-by-step mathematical reasoning and solutions immediately.
                </p>
              </div>

              <div
                onClick={() => setPracticeMode('timed')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  practiceMode === 'timed'
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 ring-1 ring-indigo-600'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
                  <Clock className="w-4 h-4 text-amber-600" />
                  Timed Speed Drill
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Active countdown timer ({Math.ceil(questionCount * 1.5)} mins). Simulates placement time pressure. Explanations shown upon test completion.
                </p>
              </div>
            </div>
          </div>

          {/* Launch Button */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              type="button"
              onClick={handleStartSession}
              disabled={loading}
              className="px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-sm shadow-md hover:shadow-indigo-500/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              {loading ? 'Preparing Questions...' : 'Start Practice Session'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
