import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { codelabService } from '../../services/codelab.service';
import { CodeEditor } from '../../components/codelab/CodeEditor';
import { TestResultPanel } from '../../components/codelab/TestResultPanel';
import { PageTransition } from '../../components/layout/PageTransition';
import { ArrowLeft, CheckCircle2, BookOpen, Lightbulb, Sparkles } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const ProblemDetail = () => {
  const { slug } = useParams();
  const toast = useToast();

  const [problem, setProblem] = useState(null);
  const [languages, setLanguages] = useState([]);
  const [selectedLang, setSelectedLang] = useState('javascript');
  const [code, setCode] = useState('');
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    const load = async () => {
      const [p, langs] = await Promise.all([
        codelabService.getProblemBySlug(slug),
        codelabService.getLanguages()
      ]);
      setProblem(p);
      setLanguages(langs);
      if (p) {
        const initialTemplate = p.starter_templates?.[selectedLang] || langs.find(l => l.id === selectedLang)?.defaultTemplate || '// Write code here';
        setCode(initialTemplate);
      }
    };
    load();
  }, [slug]);

  const handleLanguageChange = (newLang) => {
    setSelectedLang(newLang);
    const tmpl = problem?.starter_templates?.[newLang] || languages.find(l => l.id === newLang)?.defaultTemplate || '';
    setCode(tmpl);
  };

  const handleRun = async () => {
    if (!problem) return;
    setRunning(true);
    try {
      const res = await codelabService.runCode({
        language: selectedLang,
        code,
        testCases: problem.test_cases || []
      });
      setTestResult(res);
      if (res.allPassed) toast.success('All sample test cases passed!');
      else toast.warning('Some test cases failed. Check output.');
    } catch (err) {
      toast.error('Execution failed');
    } finally {
      setRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!problem) return;
    setSubmitting(true);
    try {
      const res = await codelabService.submitCode({
        problemId: problem.id,
        problemTitle: problem.title,
        problemSlug: problem.slug,
        language: selectedLang,
        code,
        testCases: problem.test_cases || []
      });
      setTestResult(res.execution);
      if (res.execution?.status === 'Accepted') {
        toast.success('Accepted! +30 XP awarded to your profile!');
      } else {
        toast.error(`Submission ${res.execution?.status || 'Failed'}`);
      }
    } catch (err) {
      toast.error('Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (!problem) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const diffColor = problem.difficulty === 'easy' ? 'text-emerald-500 bg-emerald-500/10' : problem.difficulty === 'medium' ? 'text-amber-500 bg-amber-500/10' : 'text-rose-500 bg-rose-500/10';

  return (
    <PageTransition>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        {/* Top Breadcrumb Nav */}
        <div className="px-4 sm:px-6 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link to="/codelab" className="text-xs font-semibold text-slate-400 hover:text-white flex items-center space-x-1">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to CodeLab</span>
            </Link>
            <span className="text-slate-700">|</span>
            <span className="text-xs font-bold text-slate-200 line-clamp-1">{problem.title}</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${diffColor}`}>
              {problem.difficulty}
            </span>
          </div>
        </div>

        {/* 2-Column Split: Problem Description (Left) + Code Editor (Right) */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 max-w-[1700px] w-full mx-auto">
          {/* Left Column: Problem Details */}
          <div className="space-y-6 overflow-y-auto max-h-[85vh] p-6 bg-slate-900 rounded-2xl border border-slate-800 shadow-xl">
            <div className="space-y-2">
              <div className="text-xs font-bold text-primary-400 uppercase tracking-wider">{problem.category_name}</div>
              <h1 className="text-2xl font-black text-white">{problem.title}</h1>
            </div>

            <div className="prose prose-invert max-w-none text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {problem.description}
            </div>

            {/* Examples */}
            {problem.examples?.length > 0 && (
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Examples</h3>
                {problem.examples.map((ex, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1.5 font-mono text-xs">
                    <div><span className="text-slate-500">Input: </span><span className="text-slate-200">{ex.input}</span></div>
                    <div><span className="text-slate-500">Output: </span><span className="text-emerald-400">{ex.output}</span></div>
                    {ex.explanation && (
                      <div className="text-[11px] text-slate-400 font-sans mt-1">
                        <span className="font-semibold text-slate-300">Explanation: </span>{ex.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Constraints */}
            {problem.constraints && (
              <div className="space-y-1.5 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Constraints</h3>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 whitespace-pre-line">
                  {problem.constraints}
                </div>
              </div>
            )}

            {/* Hints Accordion */}
            {problem.hints?.length > 0 && (
              <div className="space-y-2 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                  <span>Hints</span>
                </h3>
                <ul className="space-y-1.5">
                  {problem.hints.map((h, i) => (
                    <li key={i} className="text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/60">
                      💡 {h}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right Column: Code Editor & Test Results */}
          <div className="flex flex-col space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex-1 min-h-[420px]">
              <CodeEditor
                code={code}
                onChange={setCode}
                language={selectedLang}
                onLanguageChange={handleLanguageChange}
                languages={languages}
                onRun={handleRun}
                onSubmit={handleSubmit}
                isRunning={running}
                isSubmitting={submitting}
              />
            </div>

            {/* Test Results */}
            <TestResultPanel result={testResult} loading={running || submitting} />
          </div>
        </div>
      </div>
    </PageTransition>
  );
};
