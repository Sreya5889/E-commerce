import React from 'react';
import { CheckCircle2, XCircle, Clock, Cpu, AlertTriangle } from 'lucide-react';

export const TestResultPanel = ({ result, loading }) => {
  if (loading) {
    return (
      <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 flex flex-col items-center justify-center space-y-3 min-h-[160px]">
        <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-slate-400 font-mono">Running test cases in isolated sandbox...</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="p-6 bg-slate-900/60 rounded-2xl border border-slate-800/80 text-center text-xs text-slate-500 min-h-[140px] flex items-center justify-center">
        Click "Run Code" or "Submit" to test your solution against test cases.
      </div>
    );
  }

  const isAccepted = result.status === 'Accepted';

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 space-y-4">
      {/* Result Status Banner */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          {isAccepted ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          ) : (
            <XCircle className="w-5 h-5 text-rose-400" />
          )}
          <span className={`text-base font-black ${isAccepted ? 'text-emerald-400' : 'text-rose-400'}`}>
            {result.status}
          </span>
        </div>

        {/* Runtime & Memory Stats */}
        <div className="flex items-center space-x-4 text-xs text-slate-400 font-mono">
          <div className="flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>{result.runtimeMs || 35} ms</span>
          </div>
          <div className="flex items-center space-x-1">
            <Cpu className="w-3.5 h-3.5 text-slate-500" />
            <span>{result.memoryKb || 1420} KB</span>
          </div>
          <div className="px-2 py-0.5 rounded-md bg-slate-800 font-bold text-slate-200">
            {result.passedCount} / {result.totalCount} Passed
          </div>
        </div>
      </div>

      {/* Test Case Cards */}
      <div className="space-y-2.5">
        {result.results?.map((tc, idx) => (
          <div
            key={idx}
            className={`p-3.5 rounded-xl border text-xs font-mono space-y-2 ${
              tc.passed
                ? 'bg-emerald-950/20 border-emerald-900/40'
                : 'bg-rose-950/20 border-rose-900/40'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-300">Case {tc.testCaseIndex}</span>
              <span className={`text-[11px] font-bold ${tc.passed ? 'text-emerald-400' : 'text-rose-400'}`}>
                {tc.passed ? 'PASSED' : 'FAILED'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-slate-500 block">Input:</span>
                <code className="text-slate-200 bg-slate-950/60 px-2 py-1 rounded block mt-0.5 truncate">
                  {tc.input}
                </code>
              </div>
              <div>
                <span className="text-slate-500 block">Expected:</span>
                <code className="text-emerald-400 bg-slate-950/60 px-2 py-1 rounded block mt-0.5 truncate">
                  {tc.expectedOutput}
                </code>
              </div>
            </div>

            {!tc.passed && (
              <div>
                <span className="text-rose-400 block text-[11px]">Actual Output:</span>
                <code className="text-rose-300 bg-slate-950/80 px-2 py-1 rounded block mt-0.5 truncate">
                  {tc.actualOutput || 'Empty or error'}
                </code>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
