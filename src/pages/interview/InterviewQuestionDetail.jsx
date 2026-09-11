import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, CheckCircle2, AlertTriangle, HelpCircle, 
  Sparkles, Award, ExternalLink, Bookmark, MessageSquareCode 
} from 'lucide-react';
import { interviewService } from '../../services/interview.service';
import { gamificationService } from '../../services/gamification.service';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const InterviewQuestionDetail = () => {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mastered, setMastered] = useState(false);

  useEffect(() => {
    const loadQuestion = async () => {
      try {
        const q = await interviewService.getQuestionById(id);
        setQuestion(q);
        const stored = localStorage.getItem(`interview_mastered_${id}`);
        if (stored === 'true') setMastered(true);
      } catch (err) {
        console.error('Failed to load question details:', err);
      } finally {
        setLoading(false);
      }
    };
    loadQuestion();
  }, [id]);

  const handleToggleMastered = async () => {
    const next = !mastered;
    setMastered(next);
    localStorage.setItem(`interview_mastered_${id}`, String(next));
    if (next) {
      await gamificationService.awardXP('interview_mastered', {
        questionId: id,
        title: question?.title
      }).catch(() => {});
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 max-w-4xl mx-auto space-y-6">
        <div className="h-8 w-40 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse"></div>
        <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse"></div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-16 px-4 text-center">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Question Not Found</h2>
        <Link to="/interview" className="text-primary-600 font-semibold mt-4 inline-block">
          Return to Interview Hub
        </Link>
      </div>
    );
  }

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
            <span className="text-slate-800 dark:text-slate-200 font-medium">Question Detail</span>
          </div>

          <Button
            variant={mastered ? 'primary' : 'outline'}
            size="sm"
            onClick={handleToggleMastered}
            icon={CheckCircle2}
          >
            {mastered ? 'Mastered (+25 XP)' : 'Mark as Mastered'}
          </Button>
        </div>

        {/* Question Header Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={question.difficulty === 'easy' ? 'success' : question.difficulty === 'medium' ? 'accent' : 'danger'}>
              {question.difficulty}
            </Badge>
            <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
              {question.category_name || question.category_id}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-snug">
            {question.title}
          </h1>
        </div>

        {/* Model Answer */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 font-bold text-sm uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            Recruiter-Approved Model Answer
          </div>
          <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-line bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
            {question.suggested_answer}
          </div>
        </div>

        {/* Key Talking Points */}
        {question.key_points && question.key_points.length > 0 && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              Key Points You Must Hit
            </div>
            <ul className="space-y-2.5">
              {question.key_points.map((pt, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mt-2 shrink-0"></span>
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Common Mistakes */}
        {question.common_mistakes && question.common_mistakes.length > 0 && (
          <div className="bg-white dark:bg-slate-900 border border-rose-100 dark:border-rose-950/60 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4 bg-rose-50/20 dark:bg-rose-950/10">
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-sm uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4" />
              Common Red Flags & Mistakes to Avoid
            </div>
            <ul className="space-y-2.5">
              {question.common_mistakes.map((mis, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-rose-500 mt-2 shrink-0"></span>
                  <span>{mis}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Follow-up Questions */}
        {question.follow_up_questions && question.follow_up_questions.length > 0 && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-sm uppercase tracking-wider">
              <HelpCircle className="w-4 h-4" />
              Common Follow-Up Questions Asked by Interviewers
            </div>
            <div className="space-y-2">
              {question.follow_up_questions.map((fq, idx) => (
                <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl text-xs text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-800">
                  Q{idx + 1}: {fq}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewQuestionDetail;
