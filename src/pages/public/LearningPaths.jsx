import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { learningPathService } from '../../services/learningPath.service';
import { useAuth } from '../../context/AuthContext';
import {
  Search,
  SlidersHorizontal,
  Star,
  BookOpen,
  Clock,
  Sparkles,
  ArrowRight,
  Route,
  CheckCircle2,
  Trophy,
  Layers,
  GraduationCap,
  Briefcase,
  Zap,
  RotateCcw
} from 'lucide-react';
import { PageTransition } from '../../components/layout/PageTransition';
import { EmptyState } from '../../components/ui/EmptyState';
import { Button } from '../../components/ui/Button';

export const LearningPaths = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();

  const [paths, setPaths] = useState([]);
  const [myPaths, setMyPaths] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const searchQuery = searchParams.get('search') || '';
  const selectedCategory = searchParams.get('category') || 'all';
  const selectedDifficulty = searchParams.get('difficulty') || 'all';
  const sortBy = searchParams.get('sort') || 'popular';

  useEffect(() => {
    let mounted = true;
    const fetchPaths = async () => {
      setLoading(true);
      try {
        const [pathsRes, studentPaths] = await Promise.all([
          learningPathService.getLearningPaths({ pageSize: 50 }),
          isAuthenticated ? learningPathService.getMyLearningPaths() : Promise.resolve([])
        ]);
        if (mounted) {
          setPaths(pathsRes.data || []);
          setMyPaths(studentPaths || []);
        }
      } catch (err) {
        console.error('Failed to load learning paths:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchPaths();
    return () => { mounted = false; };
  }, [isAuthenticated]);

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== 'all') {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setSearchParams({});
  };

  // Filtered & Sorted paths
  const filteredPaths = useMemo(() => {
    let list = [...paths];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(p => {
        const titleMatch = p.title?.toLowerCase().includes(q);
        const descMatch = p.description?.toLowerCase().includes(q);
        const catMatch = p.category?.toLowerCase().includes(q);
        const skillsMatch = Array.isArray(p.key_skills) && p.key_skills.some(s => s.toLowerCase().includes(q));
        const toolsMatch = Array.isArray(p.tools_and_technologies) && p.tools_and_technologies.some(t => t.toLowerCase().includes(q));
        const outcomeMatch = Array.isArray(p.career_outcomes) && p.career_outcomes.some(o => o.toLowerCase().includes(q));
        return titleMatch || descMatch || catMatch || skillsMatch || toolsMatch || outcomeMatch;
      });
    }

    // Category filter
    if (selectedCategory !== 'all') {
      const catNorm = selectedCategory.toLowerCase().trim();
      list = list.filter(p => {
        const pCat = (p.category || '').toLowerCase().trim();
        const pTitle = (p.title || '').toLowerCase().trim();

        if (catNorm === 'frontend') {
          return pCat.includes('frontend') || pCat.includes('react') || pTitle.includes('frontend') || pTitle.includes('react');
        }
        if (catNorm === 'backend') {
          return pCat.includes('backend') || pCat.includes('java') || pCat.includes('python') || pCat.includes('database') || pCat.includes('.net');
        }
        if (catNorm === 'data science' || catNorm === 'data' || catNorm.includes('ai')) {
          return pCat.includes('data') || pCat.includes('artificial') || pCat.includes('intelligence') || pTitle.includes('data') || pTitle.includes('ai');
        }
        if (catNorm === 'cloud computing' || catNorm === 'cloud') {
          return pCat.includes('cloud') || pTitle.includes('cloud') || pTitle.includes('devops');
        }
        if (catNorm === 'cyber security' || catNorm === 'cybersecurity') {
          return pCat.includes('cyber');
        }
        if (catNorm === 'mobile development' || catNorm === 'mobile') {
          return pCat.includes('mobile');
        }
        if (catNorm === 'software testing' || catNorm === 'testing') {
          return pCat.includes('testing') || pCat.includes('qa') || pTitle.includes('qa');
        }
        if (catNorm === 'ui/ux design' || catNorm === 'design') {
          return pCat.includes('design') || pCat.includes('ui');
        }
        if (catNorm === 'full stack') {
          return pCat.includes('full stack') || pTitle.includes('full stack');
        }

        return pCat === catNorm || pCat.includes(catNorm) || catNorm.includes(pCat);
      });
    }

    // Difficulty filter
    if (selectedDifficulty !== 'all') {
      const diffNorm = selectedDifficulty.toLowerCase().trim();
      list = list.filter(p => {
        const pDiff = (p.difficulty || '').toLowerCase().trim();
        if (diffNorm === 'beginner') return pDiff === 'beginner' || pDiff === 'all_levels';
        if (diffNorm === 'intermediate') return pDiff === 'intermediate' || pDiff === 'all_levels';
        if (diffNorm === 'advanced') return pDiff === 'advanced';
        return pDiff === diffNorm;
      });
    }

    // Sort
    if (sortBy === 'rating') {
      list.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
    } else if (sortBy === 'newest') {
      list.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    } else if (sortBy === 'courses') {
      list.sort((a, b) => Number(b.total_courses || 0) - Number(a.total_courses || 0));
    } else if (sortBy === 'duration') {
      list.sort((a, b) => Number(b.duration_weeks || 0) - Number(a.duration_weeks || 0));
    } else {
      list.sort((a, b) => Number(b.enrolled_count || 0) - Number(a.enrolled_count || 0));
    }

    return list;
  }, [paths, searchQuery, selectedCategory, selectedDifficulty, sortBy]);

  // Categories list
  const categories = [
    { id: 'all', name: 'All Specializations' },
    { id: 'Full Stack', name: 'Full Stack' },
    { id: 'Frontend', name: 'Frontend & React' },
    { id: 'Backend', name: 'Backend & APIs' },
    { id: 'Data Science', name: 'Data Science & AI' },
    { id: 'Cloud Computing', name: 'Cloud & DevOps' },
    { id: 'Cyber Security', name: 'Cyber Security' },
    { id: 'Mobile Development', name: 'Mobile App' },
    { id: 'Software Testing', name: 'Testing / QA' },
    { id: 'UI/UX Design', name: 'UI/UX Design' }
  ];

  const difficultyLevels = [
    { id: 'all', name: 'All Levels' },
    { id: 'beginner', name: 'Beginner' },
    { id: 'intermediate', name: 'Intermediate' },
    { id: 'advanced', name: 'Advanced' }
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 pb-20">
        {/* 1. Hero Header */}
        <section className="relative overflow-hidden bg-gradient-to-b from-primary-900 via-indigo-950 to-slate-950 text-white py-16 sm:py-24">
          {/* Subtle glow background */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.15),transparent_50%)] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(37,99,235,0.15),transparent_50%)] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl space-y-5">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-primary-500/10 border border-primary-400/20 text-primary-300 text-xs font-semibold backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-primary-400" />
                <span>Career-Aligned Learning Roadmaps</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                Master Top Tech Careers with Step-by-Step Learning Paths
              </h1>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Step-by-step career tracks carefully ordered from fundamentals to mastery. 
                Complete structured stages, build capstone portfolio projects, and graduate with industry-ready job skills.
              </p>

              {/* Stats Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800/80">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center text-primary-400">
                    <Route className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-white">20</div>
                    <div className="text-xs text-slate-400">IT Career Paths</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-white">100%</div>
                    <div className="text-xs text-slate-400">Curated Courses</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-white">Capstones</div>
                    <div className="text-xs text-slate-400">Portfolio Projects</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-white">Certificates</div>
                    <div className="text-xs text-slate-400">Upon Completion</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Main Content Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
          {/* User's Active Learning Paths Banner (if enrolled) */}
          {isAuthenticated && myPaths.length > 0 && (
            <div className="mb-8 p-6 bg-white dark:bg-slate-900 rounded-3xl border border-primary-200 dark:border-primary-900/50 shadow-xl shadow-primary-500/5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <GraduationCap className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Your In-Progress Career Tracks</h2>
                </div>
                <Link
                  to="/dashboard?tab=learning-paths"
                  className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline flex items-center space-x-1"
                >
                  <span>View Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {myPaths.slice(0, 3).map((item) => {
                  const p = item.learning_paths;
                  if (!p) return null;
                  return (
                    <div
                      key={item.id}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex flex-col justify-between"
                    >
                      <div>
                        <div className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider mb-1">
                          {p.category || 'Specialization'}
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                          {p.title}
                        </h4>
                        {/* Progress */}
                        <div className="mt-3 space-y-1.5">
                          <div className="flex justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
                            <span>Stage {item.current_stage || 1}</span>
                            <span className="font-bold text-slate-900 dark:text-white">{item.progress_pct || 0}% Complete</span>
                          </div>
                          <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-primary-600 to-indigo-600 rounded-full transition-all duration-500"
                              style={{ width: `${item.progress_pct || 0}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                        <span className="text-[11px] text-slate-400">
                          {item.completed_courses?.length || 0} of {p.total_courses || 3} courses completed
                        </span>
                        <Link
                          to={`/learning-paths/${p.slug || p.id}`}
                          className="text-xs font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700 flex items-center space-x-1"
                        >
                          <span>Continue</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Search & Filter Bar */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 p-4 mb-8 space-y-4">
            <div className="flex flex-col md:flex-row gap-3">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => updateFilter('search', e.target.value)}
                  placeholder="Search career paths by title, skill (e.g. React, Python, AWS), or role..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => updateFilter('search', '')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Sort Selector */}
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => updateFilter('sort', e.target.value)}
                  className="px-3 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 cursor-pointer"
                >
                  <option value="popular">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                  <option value="courses">Most Courses</option>
                  <option value="duration">Longest Duration</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
              <span className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider pr-1">Category:</span>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => updateFilter('category', cat.id)}
                  className={`px-3 py-1.5 rounded-full font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    selectedCategory === cat.id || (cat.id === 'all' && selectedCategory === 'all')
                      ? 'bg-primary-600 text-white shadow-sm shadow-primary-500/20'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Difficulty Pills */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
              <span className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider pr-1">Difficulty:</span>
              {difficultyLevels.map((lvl) => (
                <button
                  key={lvl.id}
                  onClick={() => updateFilter('difficulty', lvl.id)}
                  className={`px-3 py-1.5 rounded-full font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    selectedDifficulty === lvl.id
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {lvl.name}
                </button>
              ))}

              {(searchQuery || selectedCategory !== 'all' || selectedDifficulty !== 'all') && (
                <button
                  onClick={clearAllFilters}
                  className="ml-auto flex items-center space-x-1 text-primary-600 dark:text-primary-400 hover:text-primary-700 text-xs font-semibold underline cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset All</span>
                </button>
              )}
            </div>
          </div>

          {/* 3. Results Count Bar */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <span>Career Learning Paths</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                {filteredPaths.length} Available
              </span>
            </h2>
          </div>

          {/* 4. Paths Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-96 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 animate-pulse p-4 space-y-4">
                  <div className="h-44 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                  <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-full" />
                  <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : filteredPaths.length === 0 ? (
            <EmptyState
              icon={Route}
              title="No learning paths found"
              description={`We couldn't find any career roadmaps matching "${searchQuery}". Try searching for another skill, role, or clearing your filters.`}
              actionText="Clear Filters"
              onAction={clearAllFilters}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPaths.map((path) => (
                <Link
                  key={path.id}
                  to={`/learning-paths/${path.slug || path.id}`}
                  className="group flex flex-col bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-primary-500/40 dark:hover:border-primary-500/40 transition-all duration-300 overflow-hidden"
                >
                  {/* Banner Image */}
                  <div className="relative h-44 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={path.banner_url || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800'}
                      alt={path.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                    {/* Badges on Banner */}
                    <div className="absolute top-3 left-3 flex items-center space-x-2">
                      <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-[11px] font-bold tracking-wide">
                        {path.category}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-1 rounded-lg bg-primary-600/90 backdrop-blur-md text-white text-[11px] font-bold capitalize">
                        {path.difficulty?.replace('_', ' ') || 'All Levels'}
                      </span>
                    </div>

                    {/* Rating & Enrolled at bottom of image */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                      <div className="flex items-center space-x-1 font-bold">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span>{Number(path.rating || 4.8).toFixed(1)}</span>
                      </div>
                      <span className="text-[11px] text-slate-300 font-medium">
                        {(path.enrolled_count || 1200).toLocaleString()} enrolled
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-lg font-extrabold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-1">
                        {path.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {path.description}
                      </p>
                    </div>

                    {/* Key Skills Tags */}
                    {Array.isArray(path.key_skills) && path.key_skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {path.key_skills.slice(0, 3).map((skill, sIdx) => (
                          <span
                            key={sIdx}
                            className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                        {path.key_skills.length > 3 && (
                          <span className="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-400 text-[10px] font-medium">
                            +{path.key_skills.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Meta Stats & Action */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1" title="Number of courses in this path">
                          <BookOpen className="w-3.5 h-3.5 text-primary-500" />
                          <span className="font-semibold text-slate-700 dark:text-slate-300">{path.total_courses || 3} Courses</span>
                        </div>
                        <div className="flex items-center space-x-1" title="Estimated duration">
                          <Clock className="w-3.5 h-3.5 text-indigo-500" />
                          <span>{path.duration_weeks || 12} Wks</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1 text-primary-600 dark:text-primary-400 font-bold group-hover:translate-x-1 transition-transform">
                        <span>View Path</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};
