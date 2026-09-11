import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  MessageSquareCode, Search, HelpCircle, CheckCircle2, 
  ArrowRight, Sparkles, BookOpen, Clock, PlayCircle, ShieldCheck, Bookmark 
} from 'lucide-react';
import { interviewService } from '../../services/interview.service';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const InterviewHome = () => {
  const [categories, setCategories] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [cats, qs] = await Promise.all([
          interviewService.getCategories(),
          interviewService.getQuestions({
            category: selectedCategory,
            difficulty: selectedDifficulty,
            search: searchQuery
          })
        ]);
        setCategories(cats || []);
        setQuestions(qs || []);
      } catch (err) {
        console.error('Failed to load interview hub data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [selectedCategory, selectedDifficulty, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Hero Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 via-purple-700 to-indigo-900 p-8 sm:p-12 text-white shadow-2xl">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider">
              <MessageSquareCode className="w-3.5 h-3.5" />
              <span>EduAcademy Interview Hub</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
              Ace Your Technical & HR Interviews
            </h1>
            <p className="text-purple-100 text-base sm:text-lg">
              Master the exact interview questions asked by top tech firms. Complete with recruiter-approved model answers, key talking points, and timed mock simulations.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link to="/interview/mock-tests">
                <Button variant="secondary" icon={PlayCircle}>
                  Take Timed Mock Test
                </Button>
              </Link>
              <Link to="/interview/preparation">
                <Button variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                  Prep Roadmaps (7-30 Days)
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="absolute right-6 bottom-0 opacity-10 pointer-events-none hidden md:block">
            <HelpCircle className="w-96 h-96 text-white" />
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search questions (e.g., event loop, indexing, behavioral, star method)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex items-center gap-2">
              {['all', 'easy', 'medium', 'hard'].map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-3.5 py-2 text-xs font-semibold rounded-xl capitalize transition-all ${
                    selectedDifficulty === diff
                      ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {diff === 'all' ? 'All Levels' : diff}
                </button>
              ))}
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All Topics
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {cat.name} ({cat.count})
              </button>
            ))}
          </div>
        </div>

        {/* Questions List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-28 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 animate-pulse"></div>
            ))}
          </div>
        ) : questions.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
              <HelpCircle className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No Questions Found</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Try adjusting your search criteria or selecting a different category filter.
            </p>
            <Button onClick={() => { setSearchQuery(''); setSelectedCategory('all'); setSelectedDifficulty('all'); }}>
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {questions.map((q) => (
              <div
                key={q.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={q.difficulty === 'easy' ? 'success' : q.difficulty === 'medium' ? 'accent' : 'danger'}>
                      {q.difficulty}
                    </Badge>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                      {q.category_name || q.category_id}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    {q.title}
                  </h3>

                  {q.key_points && q.key_points.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {q.key_points.slice(0, 3).map((kp, idx) => (
                        <span key={idx} className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 px-2.5 py-1 rounded-md border border-slate-100 dark:border-slate-800">
                          • {kp}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="shrink-0">
                  <Link to={`/interview/question/${q.id}`}>
                    <Button variant="outline" size="sm" icon={ArrowRight} iconPosition="right">
                      View Model Answer
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewHome;
