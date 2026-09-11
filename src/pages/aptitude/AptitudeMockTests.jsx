import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  Play,
  Award,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { aptitudeService } from '../../services/aptitude.service';

export default function AptitudeMockTests() {
  const [mockTests, setMockTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTests = async () => {
      try {
        const tests = await aptitudeService.getMockTests();
        setMockTests(tests || []);
      } catch (err) {
        console.error('Failed to load mock tests:', err);
      } finally {
        setLoading(false);
      }
    };
    loadTests();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase">
            <Award className="w-3.5 h-3.5" /> Full-Length Exam Simulations
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            Placement Aptitude Mock Tests
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
            Test yourself under real exam conditions. Timed countdowns, standardized scoring, section distributions, 
            and complete diagnostic scorecards modeled after top IT services and product company screening rounds.
          </p>
        </div>

        {/* Info Alert Box */}
        <div className="bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/60 rounded-2xl p-5 flex items-start gap-3.5 text-xs sm:text-sm text-indigo-950 dark:text-indigo-200">
          <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold">Exam Integrity Guarantee:</span>
            <p className="text-xs text-indigo-800 dark:text-indigo-300 leading-relaxed">
              In test mode, answers and step-by-step mathematical explanations remain hidden until full submission to accurately gauge your genuine test-taking score.
            </p>
          </div>
        </div>

        {/* Tests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockTests.map((test) => (
            <div
              key={test.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
                    Placement Standard
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-semibold">
                    <Clock className="w-3.5 h-3.5 text-indigo-600" />
                    {test.duration_minutes} Mins
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
                    {test.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                    {test.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-300">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Questions</span>
                    <span className="font-bold text-slate-900 dark:text-white text-sm">
                      {test.question_count || test.question_ids?.length || 20} Qs
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-300">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Difficulty</span>
                    <span className="font-bold text-slate-900 dark:text-white text-sm capitalize">
                      {test.difficulty || 'All Levels'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
                <Link
                  to={`/aptitude/mock-tests/${test.slug}`}
                  className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md hover:shadow-indigo-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4" /> Start Mock Examination
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
