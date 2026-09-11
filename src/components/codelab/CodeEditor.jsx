import React, { useState, useRef, useEffect } from 'react';
import { Play, RotateCcw, Copy, Check, Terminal, Code2, Sparkles, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/Button';

export const CodeEditor = ({
  code,
  onChange,
  language,
  onLanguageChange,
  languages = [],
  onRun,
  onSubmit,
  isRunning = false,
  isSubmitting = false
}) => {
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const newCode = code.substring(0, start) + '  ' + code.substring(end);
      onChange(newCode);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
    } else if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      onRun();
    }
  };

  const lines = code.split('\n');

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Editor Header Bar */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2.5 bg-slate-950/80 border-b border-slate-800/80 gap-3">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>

          <div className="h-4 w-px bg-slate-800" />

          {/* Language Selector */}
          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-700/60 focus:outline-none focus:ring-1 focus:ring-primary-500 cursor-pointer"
          >
            {languages.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.name} {lang.version ? `(${lang.version})` : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Action buttons */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleCopy}
            className="p-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs transition-colors flex items-center space-x-1"
            title="Copy Code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <Button
            size="sm"
            variant="secondary"
            onClick={onRun}
            disabled={isRunning || isSubmitting}
            className="text-xs py-1 px-3 bg-slate-800 hover:bg-slate-700 text-white border-slate-700 flex items-center space-x-1.5"
          >
            <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
            <span>{isRunning ? 'Running...' : 'Run Code'}</span>
          </Button>

          <Button
            size="sm"
            onClick={onSubmit}
            disabled={isSubmitting || isRunning}
            className="text-xs py-1 px-3 shadow-md shadow-primary-500/20 flex items-center space-x-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Submitting...' : 'Submit'}</span>
          </Button>
        </div>
      </div>

      {/* Editor Body with line numbers */}
      <div className="relative flex-1 flex overflow-hidden font-mono text-xs sm:text-sm bg-slate-900">
        {/* Line Numbers gutter */}
        <div className="w-10 sm:w-12 py-3 bg-slate-950/40 text-slate-600 text-right pr-2 select-none border-r border-slate-800/60 leading-6 font-mono">
          {lines.map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        {/* Code input textarea */}
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck="false"
          placeholder="// Write your solution here..."
          className="flex-1 p-3 bg-transparent text-slate-100 placeholder-slate-600 resize-none focus:outline-none leading-6 font-mono whitespace-pre overflow-auto"
        />
      </div>

      {/* Bottom status bar */}
      <div className="px-4 py-1.5 bg-slate-950 text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-800/60">
        <div className="flex items-center space-x-2">
          <span>{lines.length} lines</span>
          <span>•</span>
          <span>{code.length} chars</span>
        </div>
        <span className="text-[10px] text-slate-600">Press Ctrl+Enter to Run</span>
      </div>
    </div>
  );
};
