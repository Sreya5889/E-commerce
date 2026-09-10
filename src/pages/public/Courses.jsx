import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { courseService } from '../../services/course.service';
import { categoryService } from '../../services/category.service';
import {
  Search,
  SlidersHorizontal,
  Star,
  Check,
  X,
  ArrowUpDown,
  BookOpen,
  Sparkles,
  RotateCcw,
  Clock,
  Filter
} from 'lucide-react';
import { PageTransition } from '../../components/layout/PageTransition';
import { CourseCard } from '../../components/ui/CourseCard';
import { CourseCardSkeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { Button } from '../../components/ui/Button';

export const Courses = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Filters State
  const searchQuery = searchParams.get('search') || '';
  const selectedCategory = searchParams.get('category') || 'all';
  const selectedLevel = searchParams.get('level') || 'all';
  const priceFilter = searchParams.get('price') || 'all'; // 'all', 'free', 'paid'
  const selectedRating = searchParams.get('rating') || 'all'; // 'all', '4.5', '4.0'
  const selectedDuration = searchParams.get('duration') || 'all'; // 'all', 'short', 'medium', 'long'
  const sortBy = searchParams.get('sort') || 'popular';

  // Load Initial Data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [coursesData, categoriesData] = await Promise.all([
          courseService.getCourses(),
          categoryService.getCategories(),
        ]);
        setCourses(coursesData || []);
        setCategories(categoriesData || []);
      } catch (err) {
        console.error('Failed to load courses catalog:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== 'all') {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const handleSearchChange = (e) => {
    updateFilter('search', e.target.value.trim());
  };

  const clearAllFilters = () => {
    setSearchParams({});
  };

  // Filter & Sort Logic
  const filteredCourses = useMemo(() => {
    let result = [...courses];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(c =>
        c.title?.toLowerCase().includes(q) ||
        c.subtitle?.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q)
      );
    }

    // Category
    if (selectedCategory && selectedCategory !== 'all') {
      result = result.filter(c =>
        c.categories?.slug === selectedCategory ||
        c.categories?.name?.toLowerCase().replace(/\s+/g, '-') === selectedCategory ||
        c.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Level
    if (selectedLevel !== 'all') {
      result = result.filter(c => c.level?.toLowerCase() === selectedLevel.toLowerCase());
    }

    // Price
    if (priceFilter === 'free') {
      result = result.filter(c => Number(c.discount_price ?? c.price ?? 0) === 0);
    } else if (priceFilter === 'paid') {
      result = result.filter(c => Number(c.discount_price ?? c.price ?? 0) > 0);
    }

    // Rating
    if (selectedRating !== 'all') {
      const minRating = parseFloat(selectedRating);
      result = result.filter(c => Number(c.avg_rating ?? c.rating ?? 0) >= minRating);
    }

    // Duration
    if (selectedDuration === 'short') {
      result = result.filter(c => (c.duration_hours ?? c.durationHours ?? 0) < 10);
    } else if (selectedDuration === 'medium') {
      result = result.filter(c => {
        const d = c.duration_hours ?? c.durationHours ?? 0;
        return d >= 10 && d <= 30;
      });
    } else if (selectedDuration === 'long') {
      result = result.filter(c => (c.duration_hours ?? c.durationHours ?? 0) > 30);
    }

    // Sort
    if (sortBy === 'popular') {
      result.sort((a, b) => (b.student_count ?? b.studentCount ?? 0) - (a.student_count ?? a.studentCount ?? 0));
    } else if (sortBy === 'rating') {
      result.sort((a, b) => (b.avg_rating ?? b.rating ?? 0) - (a.avg_rating ?? a.rating ?? 0));
    } else if (sortBy === 'price_low') {
      result.sort((a, b) => (Number(a.discount_price ?? a.price ?? 0)) - (Number(b.discount_price ?? b.price ?? 0)));
    } else if (sortBy === 'price_high') {
      result.sort((a, b) => (Number(b.discount_price ?? b.price ?? 0)) - (Number(a.discount_price ?? a.price ?? 0)));
    } else if (sortBy === 'latest') {
      result.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    }

    return result;
  }, [courses, searchQuery, selectedCategory, selectedLevel, priceFilter, selectedRating, selectedDuration, sortBy]);

  const activeFiltersCount = [
    selectedCategory !== 'all',
    selectedLevel !== 'all',
    priceFilter !== 'all',
    selectedRating !== 'all',
    selectedDuration !== 'all',
    Boolean(searchQuery),
  ].filter(Boolean).length;

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        
        {/* Page Header */}
        <div className="mb-10 space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-bold bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Discover Knowledge</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Explore Courses
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl">
            Advance your engineering, design, and architecture capabilities with peer-reviewed curriculum taught by senior specialists.
          </p>
        </div>

        {/* Top Control Bar: Search + Category Pills + Filter Mobile Toggle */}
        <div className="space-y-4 mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search courses by title, topic, or instructor..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-10 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-800 dark:text-slate-200 shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => updateFilter('search', '')}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Mobile Filter Button & Sort Select */}
            <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end">
              <button
                onClick={() => setShowMobileFilters(true)}
                className="lg:hidden flex items-center space-x-2 px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-sm"
              >
                <SlidersHorizontal className="w-4 h-4 text-primary-600" />
                <span>Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
              </button>

              {/* Sort Dropdown */}
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 hidden sm:inline">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => updateFilter('sort', e.target.value)}
                  className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm"
                >
                  <option value="popular">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                  <option value="latest">Newest Releases</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                </select>
              </div>
            </div>

          </div>

          {/* Quick Category Chips */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => updateFilter('category', 'all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex-shrink-0 transition-all ${
                selectedCategory === 'all'
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id || cat.slug}
                onClick={() => updateFilter('category', cat.slug)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex-shrink-0 transition-all ${
                  selectedCategory === cat.slug
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Grid: Sidebar Filters + Courses Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Desktop Left Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6 sticky top-28">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <Filter className="w-4 h-4 text-primary-600" />
                <span>Refine Search</span>
              </h3>
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="text-[11px] font-bold text-primary-600 hover:underline flex items-center space-x-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset ({activeFiltersCount})</span>
                </button>
              )}
            </div>

            {/* Level Filter */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Level</h4>
              <div className="space-y-1.5 text-xs">
                {['all', 'beginner', 'intermediate', 'expert'].map((lvl) => (
                  <label key={lvl} className="flex items-center space-x-2 cursor-pointer text-slate-700 dark:text-slate-300 hover:text-primary-600">
                    <input
                      type="radio"
                      name="level"
                      checked={selectedLevel === lvl}
                      onChange={() => updateFilter('level', lvl)}
                      className="text-primary-600 focus:ring-primary-500 rounded"
                    />
                    <span className="capitalize">{lvl === 'all' ? 'All Levels' : lvl}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Pricing</h4>
              <div className="space-y-1.5 text-xs">
                {[
                  { key: 'all', label: 'All Courses' },
                  { key: 'paid', label: 'Paid Courses' },
                  { key: 'free', label: 'Free Previews' }
                ].map((p) => (
                  <label key={p.key} className="flex items-center space-x-2 cursor-pointer text-slate-700 dark:text-slate-300 hover:text-primary-600">
                    <input
                      type="radio"
                      name="price"
                      checked={priceFilter === p.key}
                      onChange={() => updateFilter('price', p.key)}
                      className="text-primary-600 focus:ring-primary-500 rounded"
                    />
                    <span>{p.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Minimum Rating */}
            <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Rating</h4>
              <div className="space-y-1.5 text-xs">
                {[
                  { val: 'all', label: 'All Ratings' },
                  { val: '4.5', label: '4.5 & up' },
                  { val: '4.0', label: '4.0 & up' },
                  { val: '3.5', label: '3.5 & up' },
                ].map((r) => (
                  <label key={r.val} className="flex items-center space-x-2 cursor-pointer text-slate-700 dark:text-slate-300 hover:text-primary-600">
                    <input
                      type="radio"
                      name="rating"
                      checked={selectedRating === r.val}
                      onChange={() => updateFilter('rating', r.val)}
                      className="text-primary-600 focus:ring-primary-500 rounded"
                    />
                    <span className="flex items-center space-x-1">
                      {r.val !== 'all' && <Star className="w-3 h-3 text-amber-500 fill-current mr-1" />}
                      <span>{r.label}</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Duration</h4>
              <div className="space-y-1.5 text-xs">
                {[
                  { key: 'all', label: 'Any Duration' },
                  { key: 'short', label: 'Under 10 Hours' },
                  { key: 'medium', label: '10 - 30 Hours' },
                  { key: 'long', label: '30+ Hours' },
                ].map((d) => (
                  <label key={d.key} className="flex items-center space-x-2 cursor-pointer text-slate-700 dark:text-slate-300 hover:text-primary-600">
                    <input
                      type="radio"
                      name="duration"
                      checked={selectedDuration === d.key}
                      onChange={() => updateFilter('duration', d.key)}
                      className="text-primary-600 focus:ring-primary-500 rounded"
                    />
                    <span>{d.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Right Area: Course Grid & Meta */}
          <main className="lg:col-span-9 space-y-6">
            
            {/* Results Count & Active Filter Pills */}
            <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
              <p className="font-semibold text-slate-600 dark:text-slate-400">
                Showing <span className="font-bold text-slate-900 dark:text-white">{filteredCourses.length}</span> {filteredCourses.length === 1 ? 'course' : 'courses'}
                {searchQuery && <> for "<span className="text-primary-600 dark:text-primary-400 font-bold">{searchQuery}</span>"</>}
              </p>

              {activeFiltersCount > 0 && (
                <div className="flex flex-wrap items-center gap-1.5">
                  {selectedCategory !== 'all' && (
                    <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 rounded-lg text-[11px] font-bold">
                      <span>Category: {selectedCategory}</span>
                      <button onClick={() => updateFilter('category', 'all')}><X className="w-3 h-3" /></button>
                    </span>
                  )}
                  {selectedLevel !== 'all' && (
                    <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-[11px] font-bold capitalize">
                      <span>Level: {selectedLevel}</span>
                      <button onClick={() => updateFilter('level', 'all')}><X className="w-3 h-3" /></button>
                    </span>
                  )}
                  {priceFilter !== 'all' && (
                    <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-[11px] font-bold">
                      <span>Price: {priceFilter}</span>
                      <button onClick={() => updateFilter('price', 'all')}><X className="w-3 h-3" /></button>
                    </span>
                  )}
                  <button
                    onClick={clearAllFilters}
                    className="text-xs font-bold text-red-600 hover:underline ml-1"
                  >
                    Clear All
                  </button>
                </div>
              )}
            </div>

            {/* Courses Cards Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((n) => <CourseCardSkeleton key={n} />)}
              </div>
            ) : filteredCourses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={BookOpen}
                title="No courses found matching your criteria"
                description="Try adjusting your keywords, expanding your price range, or clearing active filters to view other catalog courses."
                actionText="Reset All Filters"
                onAction={clearAllFilters}
              />
            )}
          </main>
        </div>

        {/* Mobile Filter Modal / Drawer */}
        {showMobileFilters && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setShowMobileFilters(false)}
            />
            <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl z-10 max-h-[85vh] overflow-y-auto space-y-6 animate-in slide-in-from-bottom duration-200">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Filters</h3>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-1 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Level */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Level</h4>
                <div className="grid grid-cols-2 gap-2">
                  {['all', 'beginner', 'intermediate', 'expert'].map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => updateFilter('level', lvl)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold capitalize text-left border ${
                        selectedLevel === lvl
                          ? 'border-primary-600 bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400'
                          : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {lvl === 'all' ? 'All Levels' : lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Pricing</h4>
                <div className="grid grid-cols-3 gap-2">
                  {['all', 'paid', 'free'].map((p) => (
                    <button
                      key={p}
                      onClick={() => updateFilter('price', p)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold capitalize text-center border ${
                        priceFilter === p
                          ? 'border-primary-600 bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400'
                          : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center space-x-3">
                <Button
                  variant="outline"
                  className="w-1/2"
                  onClick={() => {
                    clearAllFilters();
                    setShowMobileFilters(false);
                  }}
                >
                  Reset
                </Button>
                <Button
                  variant="primary"
                  className="w-1/2"
                  onClick={() => setShowMobileFilters(false)}
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </div>
        )}

      </div>
    </PageTransition>
  );
};
