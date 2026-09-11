import React, { useState } from 'react';
import { CheckCircle2, XCircle, HelpCircle, ChevronDown, ChevronUp, Flag, Sparkles } from 'lucide-react';

export const QuestionCard = ({
  question,
  index = 0,
  total = 0,
  selectedOption = null,
  onSelectOption,
  showInstantFeedback = false, // true for untimed practice mode
  isFlagged = false,
  onToggleFlag,
  disabled = false
}) => {
  const [showExplanation, setShowExplanation] = useState(false);
  const [hasCheckedAnswer, setHasCheckedAnswer] = useState(false);

  if (!question) return null;

  const difficultyColors = {
    easy: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800',
    medium: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800',
    hard: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-800'
  };

  const isChecked = showInstantFeedback && hasCheckedAnswer;
  const isCorrect = isChecked && selectedOption === question.correct_option;

  const handleOptionClick = (key) => {
    if (disabled) return;
    onSelectOption?.(key);
    if (showInstantFeedback) {
      setHasCheckedAnswer(false);
      setShowExplanation(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 sm:p-8 transition-all">
      {/* Header Metadata */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-100 dark:border-slate-800 mb-6">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600/10 text-indigo-600 dark:bg-indigo-400/10 dark:text-indigo-400 font-bold text-sm">
            Q{index + 1}
          </span>
          {total > 0 && (
            <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
              of {total}
            </span>
          )}
          {question.topic_name && (
            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              {question.topic_name}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {question.difficulty && (
            <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border capitalize ${difficultyColors[question.difficulty.toLowerCase()] || difficultyColors.easy}`}>
              {question.difficulty}
            </span>
          )}

          {onToggleFlag && (
            <button
              type="button"
              onClick={onToggleFlag}
              className={`p-1.5 rounded-lg border text-xs font-medium flex items-center gap-1 transition-colors ${
                isFlagged
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400'
                  : 'border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
              title="Flag for review"
            >
              <Flag className={`w-3.5 h-3.5 ${isFlagged ? 'fill-current' : ''}`} />
              <span className="hidden sm:inline">{isFlagged ? 'Flagged' : 'Review'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Question Text */}
      <div className="mb-6">
        <p className="text-base sm:text-lg font-medium text-slate-900 dark:text-white leading-relaxed select-text">
          {question.question_text}
        </p>
      </div>

      {/* Options List */}
      <div className="space-y-3 mb-6">
        {(question.options || []).map((opt) => {
          const isSelected = selectedOption === opt.key;
          let optionStyle = 'border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 bg-white dark:bg-slate-900/60 text-slate-700 dark:text-slate-200';
          let badgeStyle = 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300';

          if (isChecked) {
            if (opt.key === question.correct_option) {
              optionStyle = 'border-emerald-500 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200 font-semibold ring-1 ring-emerald-500';
              badgeStyle = 'bg-emerald-600 text-white';
            } else if (isSelected && opt.key !== question.correct_option) {
              optionStyle = 'border-rose-500 bg-rose-500/10 text-rose-900 dark:text-rose-200 font-semibold ring-1 ring-rose-500';
              badgeStyle = 'bg-rose-600 text-white';
            } else {
              optionStyle = 'opacity-50 border-slate-200 dark:border-slate-800 text-slate-400';
            }
          } else if (isSelected) {
            optionStyle = 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/30 text-indigo-950 dark:text-indigo-100 font-medium ring-1 ring-indigo-600';
            badgeStyle = 'bg-indigo-600 text-white';
          }

          return (
            <button
              key={opt.key}
              type="button"
              disabled={disabled}
              onClick={() => handleOptionClick(opt.key)}
              className={`w-full text-left p-4 rounded-xl border flex items-center gap-3.5 transition-all cursor-pointer ${optionStyle} ${disabled ? 'cursor-not-allowed opacity-80' : ''}`}
            >
              <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${badgeStyle}`}>
                {opt.key}
              </span>
              <span className="text-sm sm:text-base flex-1">{opt.text}</span>
              {isChecked && opt.key === question.correct_option && (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              )}
              {isChecked && isSelected && opt.key !== question.correct_option && (
                <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Practice Mode Instant Check Button & Feedback */}
      {showInstantFeedback && selectedOption && (
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          {!hasCheckedAnswer ? (
            <button
              type="button"
              onClick={() => {
                setHasCheckedAnswer(true);
                setShowExplanation(true);
              }}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Check Answer & Explanation
            </button>
          ) : (
            <div className="space-y-3">
              <div className={`flex items-center justify-between p-3 rounded-xl ${
                isCorrect ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300' : 'bg-rose-50 dark:bg-rose-950/30 text-rose-800 dark:text-rose-300'
              }`}>
                <div className="flex items-center gap-2 font-semibold text-sm">
                  {isCorrect ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      Correct! Well done.
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                      Incorrect. The correct option is {question.correct_option}.
                    </>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setShowExplanation(!showExplanation)}
                  className="text-xs font-bold underline flex items-center gap-1 cursor-pointer"
                >
                  {showExplanation ? 'Hide Explanation' : 'View Explanation'}
                  {showExplanation ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>

              {showExplanation && question.explanation && (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white mb-2">
                    <HelpCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    Step-by-Step Solution:
                  </div>
                  <div className="whitespace-pre-line font-mono text-xs sm:text-sm bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                    {question.explanation}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
