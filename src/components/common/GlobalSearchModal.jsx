import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, X, BookOpen, Code2, FolderGit2, 
  HelpCircle, Briefcase, ArrowRight, CornerDownLeft 
} from 'lucide-react';
import { courseService } from '../../services/course.service';
import { codelabService } from '../../services/codelab.service';
import { projectService } from '../../services/project.service';
import { interviewService } from '../../services/interview.service';
import { jobService } from '../../services/job.service';

export const GlobalSearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [results, setResults] = useState({
    courses: [],
    codelab: [],
    projects: [],
    interview: [],
    jobs: []
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults({ courses: [], codelab: [], projects: [], interview: [], jobs: [] });
    }
  }, [isOpen]);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Search across modules
  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setResults({ courses: [], codelab: [], projects: [], interview: [], jobs: [] });
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const [c, cl, p, i, j] = await Promise.all([
          courseService.getCourses({ search: query }).catch(() => []),
          codelabService.getProblems({ search: query }).catch(() => []),
          projectService.getAll({ search: query }).catch(() => []),
          interviewService.getQuestions({ search: query }).catch(() => []),
          jobService.getAll({ search: query }).catch(() => [])
        ]);

        setResults({
          courses: (c || []).slice(0, 4),
          codelab: (cl || []).slice(0, 4),
          projects: (p || []).slice(0, 4),
          interview: (i || []).slice(0, 4),
          jobs: (j || []).slice(0, 4)
        });
      } catch (err) {
        console.error('Global search error:', err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (url) => {
    onClose();
    navigate(url);
  };

  if (!isOpen) return null;

  const totalCount =
    results.courses.length +
    results.codelab.length +
    results.projects.length +
    results.interview.length +
    results.jobs.length;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-5 py-4 border-b border-slate-200 dark:border-slate-800 gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search courses, code problems, projects, interview, jobs..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm sm:text-base text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-lg hover:bg-slate-200"
          >
            ESC
          </button>
        </div>

        {/* Filter Tabs */}
        {query.trim().length >= 2 && (
          <div className="flex items-center gap-2 px-5 py-2.5 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 text-xs overflow-x-auto">
            {[
              { id: 'all', label: 'All Modules' },
              { id: 'courses', label: `Courses (${results.courses.length})` },
              { id: 'codelab', label: `CodeLab (${results.codelab.length})` },
              { id: 'projects', label: `Projects (${results.projects.length})` },
              { id: 'interview', label: `Interview (${results.interview.length})` },
              { id: 'jobs', label: `Jobs (${results.jobs.length})` }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary-600 text-white'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Results Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {loading ? (
            <div className="p-8 text-center text-slate-400">
              <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <span>Searching EduAcademy ecosystem...</span>
            </div>
          ) : query.trim().length < 2 ? (
            <div className="p-8 text-center text-slate-400 space-y-2">
              <Search className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Unified Global Search</p>
              <p className="text-xs text-slate-400">Type at least 2 characters to search across courses, coding problems, blueprints, and jobs.</p>
            </div>
          ) : totalCount === 0 ? (
            <div className="p-8 text-center text-slate-400">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No results found for "{query}"</p>
              <p className="text-xs text-slate-400 mt-1">Try keywords like "React", "Python", "Full Stack", or "SQL".</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Courses */}
              {(activeTab === 'all' || activeTab === 'courses') && results.courses.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider px-2">
                    <BookOpen className="w-3.5 h-3.5 text-primary-500" /> Courses
                  </div>
                  {results.courses.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => handleSelect(`/course/${c.id}`)}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 hover:bg-primary-50 dark:hover:bg-primary-950/40 cursor-pointer transition-colors flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white text-sm">{c.title}</div>
                        <div className="text-slate-500 text-[11px]">{c.level} • {c.categories?.name || 'Tech'}</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                    </div>
                  ))}
                </div>
              )}

              {/* CodeLab */}
              {(activeTab === 'all' || activeTab === 'codelab') && results.codelab.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider px-2">
                    <Code2 className="w-3.5 h-3.5 text-emerald-500" /> CodeLab Problems
                  </div>
                  {results.codelab.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => handleSelect(`/codelab/problem/${p.slug}`)}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 cursor-pointer transition-colors flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white text-sm">{p.title}</div>
                        <div className="text-slate-500 text-[11px] capitalize">{p.difficulty} • {p.category_name}</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                    </div>
                  ))}
                </div>
              )}

              {/* Projects */}
              {(activeTab === 'all' || activeTab === 'projects') && results.projects.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider px-2">
                    <FolderGit2 className="w-3.5 h-3.5 text-purple-500" /> Real-World Projects
                  </div>
                  {results.projects.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => handleSelect(`/projects/${p.slug}`)}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 hover:bg-purple-50 dark:hover:bg-purple-950/40 cursor-pointer transition-colors flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white text-sm">{p.title}</div>
                        <div className="text-slate-500 text-[11px]">{p.category} • ~{p.estimated_hours}h</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                    </div>
                  ))}
                </div>
              )}

              {/* Interview */}
              {(activeTab === 'all' || activeTab === 'interview') && results.interview.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider px-2">
                    <HelpCircle className="w-3.5 h-3.5 text-amber-500" /> Interview Hub Questions
                  </div>
                  {results.interview.map((q) => (
                    <div
                      key={q.id}
                      onClick={() => handleSelect(`/interview/question/${q.id}`)}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 hover:bg-amber-50 dark:hover:bg-amber-950/40 cursor-pointer transition-colors flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white text-sm">{q.title}</div>
                        <div className="text-slate-500 text-[11px]">{q.category_name} • {q.difficulty}</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                    </div>
                  ))}
                </div>
              )}

              {/* Jobs */}
              {(activeTab === 'all' || activeTab === 'jobs') && results.jobs.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider px-2">
                    <Briefcase className="w-3.5 h-3.5 text-blue-500" /> Tech Jobs & Openings
                  </div>
                  {results.jobs.map((j) => (
                    <div
                      key={j.id}
                      onClick={() => handleSelect(`/jobs/${j.slug}`)}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 hover:bg-blue-50 dark:hover:bg-blue-950/40 cursor-pointer transition-colors flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white text-sm">{j.title}</div>
                        <div className="text-slate-500 text-[11px]">{j.company} • {j.location} • {j.salary_range}</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Press ESC to close</span>
          <span className="flex items-center gap-1">
            <CornerDownLeft className="w-3 h-3" /> Select result
          </span>
        </div>
      </div>
    </div>
  );
};

export default GlobalSearchModal;
