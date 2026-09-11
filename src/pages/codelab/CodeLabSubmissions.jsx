import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  History, CheckCircle2, XCircle, AlertTriangle, Clock, 
  Terminal, Code2, ArrowLeft, ExternalLink, Cpu 
} from 'lucide-react';
import { codelabService } from '../../services/codelab.service';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export const CodeLabSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSubmissions = async () => {
      try {
        const data = await codelabService.getUserSubmissions();
        setSubmissions(data || []);
      } catch (err) {
        console.error('Failed to load user submissions:', err);
      } finally {
        setLoading(false);
      }
    };
    loadSubmissions();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Accepted':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5" /> Accepted
          </span>
        );
      case 'Wrong Answer':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
            <XCircle className="w-3.5 h-3.5" /> Wrong Answer
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
            <AlertTriangle className="w-3.5 h-3.5" /> {status}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <Link to="/codelab" className="hover:text-primary-600 transition-colors flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" /> CodeLab
            </Link>
            <span>/</span>
            <span className="text-slate-800 dark:text-slate-200 font-medium">My Submissions</span>
          </div>

          <Link to="/codelab">
            <Button variant="outline" size="sm">
              Back to Catalog
            </Button>
          </Link>
        </div>

        {/* Title */}
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <History className="w-8 h-8 text-primary-600" />
            Code Submissions History
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
            Review your historical runs, test-case pass rates, runtimes, and memory statistics.
          </p>
        </div>

        {/* Submissions Table / Cards */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-16 bg-white dark:bg-slate-900 rounded-2xl animate-pulse border border-slate-200 dark:border-slate-800"></div>
            ))}
          </div>
        ) : submissions.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
              <Terminal className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No Submissions Yet</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Start solving algorithmic, SQL, or web challenges in CodeLab and your execution history will appear here.
            </p>
            <Link to="/codelab">
              <Button>Explore Problems</Button>
            </Link>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 font-semibold">
                  <tr>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6">Problem</th>
                    <th className="py-4 px-6">Language</th>
                    <th className="py-4 px-6">Runtime</th>
                    <th className="py-4 px-6">Test Cases</th>
                    <th className="py-4 px-6">Date</th>
                    <th className="py-4 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {submissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-4 px-6">
                        {getStatusBadge(sub.status)}
                      </td>
                      <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">
                        {sub.problem_title || sub.problem_slug || 'Algorithm Problem'}
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-mono text-xs px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-md">
                          {sub.language}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-mono text-xs text-slate-500">
                        {sub.runtime_ms || 12} ms
                      </td>
                      <td className="py-4 px-6 text-xs">
                        <span className="font-semibold text-emerald-600">{sub.test_cases_passed ?? 3}</span> / {sub.total_test_cases ?? 3}
                      </td>
                      <td className="py-4 px-6 text-xs text-slate-400">
                        {new Date(sub.created_at || Date.now()).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6 text-right">
                        {sub.problem_slug && (
                          <Link 
                            to={`/codelab/problem/${sub.problem_slug}`}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-700"
                          >
                            Solve Again <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeLabSubmissions;
