import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { db } from '../../services/db';
import { CATEGORIES, INSTRUCTORS } from '../../constants/mockData';
import { Search, SlidersHorizontal, Star, Heart, ShoppingCart, Check, X, ArrowUpDown } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { PageTransition } from '../../components/layout/PageTransition';

export const Courses = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart, isInCart, addToWishlist, isInWishlist } = useCart();
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all'); // 'all', 'free', 'paid'
  const [selectedRating, setSelectedRating] = useState('all'); // 'all', '4.5', '4.0'
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [sortBy, setSortBy] = useState('popular'); // 'popular', 'latest', 'price-low', 'price-high'
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const data = await db.getCourses();
        setCourses(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Update query state if search params change
  useEffect(() => {
    const search = searchParams.get('search');
    const cat = searchParams.get('category');
    if (search !== null) setSearchQuery(search);
    if (cat !== null) setSelectedCategory(cat);
  }, [searchParams]);

  // Apply filters
  useEffect(() => {
    let result = [...courses];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(c => c.title.toLowerCase().includes(q) || c.subtitle.toLowerCase().includes(q) || c.description.toLowerCase().includes(q));
    }

    // Category
    if (selectedCategory && selectedCategory !== 'all') {
      result = result.filter(c => c.category.toLowerCase().replace(/\s+/g, '-') === selectedCategory.toLowerCase().replace(/\s+/g, '-'));
    }

    // Level
    if (selectedLevel !== 'all') {
      result = result.filter(c => c.level.toLowerCase() === selectedLevel.toLowerCase());
    }

    // Price
    if (priceFilter === 'free') {
      result = result.filter(c => (c.discountPrice || c.price) === 0);
    } else if (priceFilter === 'paid') {
      result = result.filter(c => (c.discountPrice || c.price) > 0);
    }

    // Rating
    if (selectedRating !== 'all') {
      const minRating = parseFloat(selectedRating);
      result = result.filter(c => c.rating >= minRating);
    }

    // Language
    if (selectedLanguage !== 'all') {
      result = result.filter(c => c.language.toLowerCase() === selectedLanguage.toLowerCase());
    }

    // Sort By
    if (sortBy === 'popular') {
      result.sort((a, b) => b.studentCount - a.studentCount);
    } else if (sortBy === 'latest') {
      result.sort((a, b) => new Date(b.created_at || b.id) - new Date(a.created_at || a.id));
    } else if (sortBy === 'price-low') {
      result.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
    }

    setFilteredCourses(result);
  }, [courses, searchQuery, selectedCategory, selectedLevel, priceFilter, selectedRating, selectedLanguage, sortBy]);

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedLevel('all');
    setPriceFilter('all');
    setSelectedRating('all');
    setSelectedLanguage('all');
    setSortBy('popular');
    setSearchParams({});
  };

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Top Header */}
        <div className="mb-8 space-y-4">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Explore Tech Courses</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Showing {filteredCourses.length} results matching your search criteria.
          </p>
        </div>

        {/* Filters Top Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-premium mb-8 shadow-sm">
          {/* Search Input inside Courses */}
          <div className="relative flex-grow max-w-md">
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-premium text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 text-slate-800 dark:text-slate-200"
            />
            <Search className="absolute left-3 top-2.5 w-4.5 h-4.5 text-slate-400" />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center space-x-3 justify-between md:justify-end">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="lg:hidden flex items-center space-x-1.5 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-premium text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
            </button>

            <div className="flex items-center space-x-2">
              <ArrowUpDown className="w-4 h-4 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-premium text-sm py-2 px-3 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="popular">Most Popular</option>
                <option value="latest">Latest Releases</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Sidebar Filter Section (Desktop) */}
          <aside className="hidden lg:block space-y-6">
            
            {/* Clear All Option */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Filter By</h3>
              <button onClick={clearAllFilters} className="text-xs text-primary-600 dark:text-primary-400 hover:underline">
                Clear All
              </button>
            </div>

            {/* Category Filter */}
            <div className="space-y-2.5">
              <h4 className="font-semibold text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider">Category</h4>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-premium text-sm p-2 text-slate-700 dark:text-slate-300 focus:ring-primary-500 focus:outline-none"
              >
                <option value="all">All Categories</option>
                {CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.slug}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Difficulty Level Filter */}
            <div className="space-y-2.5 pt-2">
              <h4 className="font-semibold text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider">Level</h4>
              <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                {['all', 'Beginner', 'Intermediate', 'Expert', 'All Levels'].map((lvl) => (
                  <label key={lvl} className="flex items-center space-x-2.5 cursor-pointer">
                    <input
                      type="radio"
                      name="level"
                      checked={selectedLevel === lvl}
                      onChange={() => setSelectedLevel(lvl)}
                      className="w-4 h-4 text-primary-600 border-slate-300 focus:ring-primary-500"
                    />
                    <span className="capitalize">{lvl === 'all' ? 'All Difficulty Levels' : lvl}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="space-y-2.5 pt-2">
              <h4 className="font-semibold text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider">Price</h4>
              <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                {[
                  { value: 'all', label: 'All Courses' },
                  { value: 'free', label: 'Free' },
                  { value: 'paid', label: 'Paid / Premium' }
                ].map((prc) => (
                  <label key={prc.value} className="flex items-center space-x-2.5 cursor-pointer">
                    <input
                      type="radio"
                      name="price"
                      checked={priceFilter === prc.value}
                      onChange={() => setPriceFilter(prc.value)}
                      className="w-4 h-4 text-primary-600 border-slate-300 focus:ring-primary-500"
                    />
                    <span>{prc.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Rating Filter */}
            <div className="space-y-2.5 pt-2">
              <h4 className="font-semibold text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider">Rating</h4>
              <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                {[
                  { value: 'all', label: 'All Ratings' },
                  { value: '4.5', label: '4.5 ★ & Above' },
                  { value: '4.0', label: '4.0 ★ & Above' }
                ].map((rtg) => (
                  <label key={rtg.value} className="flex items-center space-x-2.5 cursor-pointer">
                    <input
                      type="radio"
                      name="rating"
                      checked={selectedRating === rtg.value}
                      onChange={() => setSelectedRating(rtg.value)}
                      className="w-4 h-4 text-primary-600 border-slate-300 focus:ring-primary-500"
                    />
                    <span>{rtg.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Language Filter */}
            <div className="space-y-2.5 pt-2">
              <h4 className="font-semibold text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider">Language</h4>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-premium text-sm p-2 text-slate-700 dark:text-slate-300 focus:ring-primary-500 focus:outline-none"
              >
                <option value="all">All Languages</option>
                <option value="english">English</option>
                <option value="spanish">Spanish</option>
                <option value="french">French</option>
              </select>
            </div>

          </aside>

          {/* Grid Layout of Courses */}
          <main className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="animate-pulse bg-white dark:bg-slate-900 rounded-premium border border-slate-100 dark:border-slate-800 p-4 space-y-4">
                    <div className="w-full aspect-video bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
                    <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : filteredCourses.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-premium space-y-4">
                <SlidersHorizontal className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No courses match your filters</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Try adjusting your checkboxes or click clear filters.</p>
                <button
                  onClick={clearAllFilters}
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-premium text-xs font-semibold"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredCourses.map((course) => {
                  const teacher = INSTRUCTORS.find(t => t.id === course.teacherId);
                  const isAlreadyInCart = isInCart(course.id);
                  const isWishlisted = isInWishlist(course.id);
                  return (
                    <div
                      key={course.id}
                      className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-premium overflow-hidden shadow-sm hover:shadow-premium hover:-translate-y-1 transition-all duration-300 flex flex-col group"
                    >
                      <Link to={`/course/${course.id}`} className="relative block overflow-hidden aspect-video">
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {course.badge && (
                          <span className={`absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[9px] font-bold text-white shadow-sm uppercase ${
                            course.badge === 'Bestseller' ? 'bg-amber-500' : 'bg-primary-600'
                          }`}>
                            {course.badge}
                          </span>
                        )}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            isWishlisted ? () => {} : addToWishlist(course.id);
                          }}
                          className={`absolute top-3 right-3 p-2 rounded-full shadow-md backdrop-blur-md border ${
                            isWishlisted
                              ? 'bg-red-550 border-red-500 text-red-500'
                              : 'bg-white/80 dark:bg-slate-900/80 border-slate-200/50 dark:border-slate-800/50 text-slate-600 hover:text-red-500'
                          } transition-all`}
                        >
                          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                        </button>
                      </Link>
                      
                      <div className="p-6 flex flex-col flex-grow">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400 mb-2">
                          {course.category}
                        </span>
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2 leading-snug mb-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                          <Link to={`/course/${course.id}`}>{course.title}</Link>
                        </h3>

                        <div className="flex items-center space-x-2 text-xs text-slate-500 mb-3">
                          <img src={teacher?.avatar} alt={teacher?.name} className="w-5 h-5 rounded-full object-cover" />
                          <span className="font-medium">{teacher?.name}</span>
                        </div>

                        <div className="flex items-center space-x-1.5 mb-4 text-xs text-slate-500">
                          <span className="flex items-center text-amber-500 font-bold">
                            <Star className="w-3.5 h-3.5 fill-current mr-0.5" />
                            {course.rating}
                          </span>
                          <span>•</span>
                          <span>{course.durationHours} hrs</span>
                          <span>•</span>
                          <span className="capitalize">{course.level}</span>
                        </div>

                        <div className="border-t border-slate-100 dark:border-slate-800 pt-4 mt-auto flex items-center justify-between">
                          <div className="flex items-baseline space-x-1.5">
                            <span className="text-base font-extrabold text-slate-900 dark:text-white">
                              ${course.discountPrice || course.price}
                            </span>
                            {course.discountPrice && (
                              <span className="text-xs text-slate-400 line-through">
                                ${course.price}
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => !isAlreadyInCart && addToCart(course.id)}
                            disabled={isAlreadyInCart}
                            className={`p-2.5 rounded-premium flex items-center justify-center transition-all ${
                              isAlreadyInCart
                                ? 'bg-green-50 dark:bg-green-950/20 text-green-600 border border-green-200'
                                : 'bg-primary-600 hover:bg-primary-700 text-white shadow-sm'
                            }`}
                          >
                            {isAlreadyInCart ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Drawer Filters Modal */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden flex justify-end">
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" onClick={() => setShowMobileFilters(false)}></div>
          <div className="relative w-full max-w-xs bg-white dark:bg-slate-900 shadow-2xl flex flex-col p-6 overflow-y-auto h-full text-slate-800 dark:text-slate-100">
            <div className="flex items-center justify-between border-b pb-4 mb-6">
              <h3 className="font-bold text-sm">Filters</h3>
              <button onClick={() => setShowMobileFilters(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sidebar content copy */}
            <div className="space-y-6">
              {/* Category */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Category</h4>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border rounded-premium p-2 text-xs"
                >
                  <option value="all">All Categories</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.slug}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Levels */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Level</h4>
                {['all', 'Beginner', 'Intermediate', 'Expert', 'All Levels'].map((lvl) => (
                  <label key={lvl} className="flex items-center space-x-2 text-xs">
                    <input
                      type="radio"
                      name="mobile-level"
                      checked={selectedLevel === lvl}
                      onChange={() => setSelectedLevel(lvl)}
                    />
                    <span className="capitalize">{lvl === 'all' ? 'All Difficulty Levels' : lvl}</span>
                  </label>
                ))}
              </div>

              {/* Price */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Price</h4>
                {[
                  { value: 'all', label: 'All' },
                  { value: 'free', label: 'Free' },
                  { value: 'paid', label: 'Paid' }
                ].map((prc) => (
                  <label key={prc.value} className="flex items-center space-x-2 text-xs">
                    <input
                      type="radio"
                      name="mobile-price"
                      checked={priceFilter === prc.value}
                      onChange={() => setPriceFilter(prc.value)}
                    />
                    <span>{prc.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                clearAllFilters();
                setShowMobileFilters(false);
              }}
              className="mt-8 w-full py-2.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-premium font-semibold text-xs hover:bg-slate-50"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      )}
    </PageTransition>
  );
};
