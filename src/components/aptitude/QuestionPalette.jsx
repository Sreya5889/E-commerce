import React from 'react';
import { Send } from 'lucide-react';

export const QuestionPalette = ({
  totalQuestions = 0,
  currentIndex = 0,
  answers = {}, // { [questionId]: selectedOption }
  questionIds = [],
  flagged = {}, // { [questionId]: boolean }
  onSelectIndex,
  onSubmitTest,
  isSubmitting = false
}) => {
  const answeredCount = Object.values(answers).filter(Boolean).length;
  const unansweredCount = Math.max(0, totalQuestions - answeredCount);
  const flaggedCount = Object.values(flagged).filter(Boolean).length;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          Question Palette
        </h3>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300">
          {answeredCount}/{totalQuestions}
        </span>
      </div>

      {/* Grid Palette */}
      <div className="grid grid-cols-5 sm:grid-cols-5 gap-2 mb-6 max-h-64 overflow-y-auto pr-1">
        {Array.from({ length: totalQuestions }).map((_, idx) => {
          const qId = questionIds[idx];
          const isAnswered = Boolean(qId && answers[qId]);
          const isCurrent = idx === currentIndex;
          const isFlagged = Boolean(qId && flagged[qId]);

          let btnStyle = 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-300 hover:border-indigo-300';

          if (isCurrent) {
            btnStyle = 'border-indigo-600 bg-indigo-600 text-white font-bold ring-2 ring-indigo-400/40 shadow-sm';
          } else if (isAnswered) {
            btnStyle = 'border-emerald-500 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold';
          } else if (isFlagged) {
            btnStyle = 'border-amber-500 bg-amber-500/15 text-amber-700 dark:text-amber-300 font-bold';
          }

          return (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectIndex(idx)}
              className={`h-10 rounded-xl border flex items-center justify-center text-xs relative transition-all cursor-pointer ${btnStyle}`}
              title={`Question ${idx + 1}`}
            >
              <span>{idx + 1}</span>
              {isFlagged && !isCurrent && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 dark:text-slate-400 pb-4 border-b border-slate-100 dark:border-slate-800 mb-5">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-md bg-emerald-500/20 border border-emerald-500" />
          <span>Answered ({answeredCount})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700" />
          <span>Unanswered ({unansweredCount})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-md bg-indigo-600" />
          <span>Current</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-md bg-amber-500/20 border border-amber-500" />
          <span>Flagged ({flaggedCount})</span>
        </div>
      </div>

      {/* Submit Button */}
      {onSubmitTest && (
        <button
          type="button"
          onClick={onSubmitTest}
          disabled={isSubmitting}
          className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-xs font-bold shadow-md hover:shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
          {isSubmitting ? 'Submitting...' : 'Submit Assessment'}
        </button>
      )}
    </div>
  );
};
