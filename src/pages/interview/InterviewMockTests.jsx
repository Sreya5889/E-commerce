import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  PlayCircle, Clock, CheckCircle2, ArrowLeft, RotateCcw, 
  Trophy, AlertCircle, HelpCircle, Sparkles 
} from 'lucide-react';
import { interviewService } from '../../services/interview.service';
import { gamificationService } from '../../services/gamification.service';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const InterviewMockTests = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealedAnswers, setRevealedAnswers] = useState({});
  const [ratings, setRatings] = useState({});
  const [isFinished, setIsFinished] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(900); // 15 mins

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const all = await interviewService.getQuestions();
        // pick 5 random questions for a rapid mock test
        const shuffled = [...all].sort(() => 0.5 - Math.random()).slice(0, 5);
        setQuestions(shuffled);
      } catch (err) {
        console.error('Failed to load mock interview test:', err);
      } finally {
        setLoading(false);
      }
    };
    loadQuestions();
  }, []);

  useEffect(() => {
    if (isFinished || secondsLeft <= 0) return;
    const timer = setInterval(() => {
      setSecondsLeft(s => s - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isFinished, secondsLeft]);

  const handleToggleReveal = (idx) => {
    setRevealedAnswers(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleRate = (idx, rating) => {
    setRatings(prev => ({ ...prev, [idx]: rating }));
  };

  const handleFinish = async () => {
    setIsFinished(true);
    await gamificationService.awardXP('mock_interview_completed', {
      totalQuestions: questions.length
    }).catch(() => {});
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-16 px-4 max-w-3xl mx-auto space-y-4">
        <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse"></div>
        <div className="h-72 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse"></div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <Link to="/interview" className="hover:text-primary-600 transition-colors flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" /> Interview Hub
            </Link>
            <span>/</span>
            <span className="text-slate-800 dark:text-slate-200 font-medium">Timed Mock Simulator</span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400 px-3 py-1.5 rounded-xl">
            <Clock className="w-4 h-4" />
            <span>Time Left: {formatTime(secondsLeft)}</span>
          </div>
        </div>

        {isFinished ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-12 text-center shadow-lg space-y-6">
            <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center mx-auto">
              <Trophy className="w-10 h-10" />
            </div>

            <h2 className="text-3xl font-black text-slate-900 dark:text-white">
              Mock Simulation Completed!
            </h2>

            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Great job practicing under interview pressure. You earned <strong className="text-emerald-600">+150 XP</strong> towards your Career Readiness badge.
            </p>

            <div className="flex justify-center gap-4 pt-4">
              <Link to="/interview">
                <Button variant="outline">Return to Interview Hub</Button>
              </Link>
              <Button onClick={() => window.location.reload()} icon={RotateCcw}>
                Take Another Mock Test
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
            {/* Progress Bar */}
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
              <span>Question {currentIndex + 1} of {questions.length}</span>
              <span>{Math.round(((currentIndex + 1) / questions.length) * 100)}% Complete</span>
            </div>

            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-primary-600 h-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              ></div>
            </div>

            {/* Question Text */}
            <div className="space-y-3 pt-2">
              <Badge variant={currentQ?.difficulty === 'easy' ? 'success' : currentQ?.difficulty === 'medium' ? 'accent' : 'danger'}>
                {currentQ?.difficulty}
              </Badge>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                {currentQ?.title}
              </h2>
            </div>

            {/* Answer Reveal Toggle */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Practice your answer out loud, then compare:</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleReveal(currentIndex)}
                >
                  {revealedAnswers[currentIndex] ? 'Hide Model Answer' : 'Show Model Answer'}
                </Button>
              </div>

              {revealedAnswers[currentIndex] && (
                <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold text-primary-600 uppercase tracking-wider">
                    Model Response
                  </h4>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                    {currentQ?.suggested_answer}
                  </p>
                </div>
              )}
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
              <Button
                variant="outline"
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex(i => i - 1)}
              >
                Previous
              </Button>

              {currentIndex < questions.length - 1 ? (
                <Button onClick={() => setCurrentIndex(i => i + 1)}>
                  Next Question
                </Button>
              ) : (
                <Button variant="primary" onClick={handleFinish} icon={CheckCircle2}>
                  Finish Simulation
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewMockTests;
