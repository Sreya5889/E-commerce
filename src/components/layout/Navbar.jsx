import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';
import { categoryService } from '../../services/category.service';
import {
  Search, ShoppingCart, Heart, Sun, Moon, Menu, X, ChevronDown,
  User, BookOpen, LogOut, LayoutDashboard, Settings, Award, Shield,
  Layers, PlusCircle, Route, Target
} from 'lucide-react';
import { Button } from '../ui/Button';
import { GlobalSearchModal } from '../common/GlobalSearchModal';
import { Code2, FolderGit2, MessageSquareCode, Compass, Briefcase, Bot, Sparkles } from 'lucide-react';

export const Navbar = () => {
  const { user, profile, isAuthenticated, isAdmin, isTeacher, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { cartCount, wishlistCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  const categoriesRef = useRef(null);
  const userDropdownRef = useRef(null);

  // Load categories
  useEffect(() => {
    let mounted = true;
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getCategories();
        if (mounted && data) {
          setCategories(data);
        }
      } catch (err) {
        console.warn('Navbar: failed to load categories:', err);
      }
    };
    fetchCategories();
    return () => { mounted = false; };
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (categoriesRef.current && !categoriesRef.current.contains(e.target)) {
        setCategoriesOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setCategoriesOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleCategoryClick = (slug) => {
    navigate(`/courses?category=${encodeURIComponent(slug)}`);
    setCategoriesOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const displayName =
    profile?.display_name ||
    `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() ||
    user?.user_metadata?.full_name ||
    user?.email?.split('@')[0] ||
    'My Account';

  const avatarUrl =
    profile?.avatar_url ||
    user?.user_metadata?.avatar_url ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=2563eb&color=fff&size=80`;

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* 1. Brand Logo */}
          <Link
            to="/"
            className="flex items-center space-x-3 flex-shrink-0 group focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-xl p-1"
            aria-label="EduAcademy Home"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 to-indigo-600 flex items-center justify-center shadow-md shadow-primary-500/25 text-white font-extrabold text-xl group-hover:scale-105 transition-transform duration-200">
              E
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white flex items-center">
                Edu<span className="text-primary-600 dark:text-primary-400">Academy</span>
              </span>
              <span className="text-[9px] font-bold text-slate-400 tracking-widest uppercase -mt-1 hidden sm:block">
                Marketplace
              </span>
            </div>
          </Link>

          {/* 2. Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-1">
            <Link
              to="/courses"
              className={`px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
                isActive('/courses')
                  ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/40'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              Courses
            </Link>

            <Link
              to="/learning-paths"
              className={`px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
                isActive('/learning-paths') || location.pathname.startsWith('/learning-paths')
                  ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/40'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              Paths
            </Link>

            <Link
              to="/codelab"
              className={`px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
                isActive('/codelab') || location.pathname.startsWith('/codelab')
                  ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/40'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              CodeLab
            </Link>

            <Link
              to="/aptitude"
              className={`px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
                isActive('/aptitude') || location.pathname.startsWith('/aptitude')
                  ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/40'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              Aptitude
            </Link>

            <Link
              to="/projects"
              className={`px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
                isActive('/projects') || location.pathname.startsWith('/projects')
                  ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/40'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              Projects
            </Link>

            <Link
              to="/interview"
              className={`px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
                isActive('/interview') || location.pathname.startsWith('/interview')
                  ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/40'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              Interview Hub
            </Link>

            <Link
              to="/career"
              className={`px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
                isActive('/career') || location.pathname.startsWith('/career')
                  ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/40'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              Career
            </Link>

            <Link
              to="/jobs"
              className={`px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
                isActive('/jobs') || location.pathname.startsWith('/jobs')
                  ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/40'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              Jobs
            </Link>

            <Link
              to="/ai-career"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                isActive('/ai-career')
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                  : 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60 hover:bg-purple-100'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>AI Mentor</span>
            </Link>
          </nav>

          {/* 3. Unified Global Search Bar */}
          <div className="flex-1 max-w-xs lg:max-w-sm mx-2 hidden md:block">
            <button
              type="button"
              onClick={() => setSearchModalOpen(true)}
              className="w-full flex items-center justify-between px-3.5 py-2 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 rounded-full text-xs text-slate-500 dark:text-slate-400 hover:border-primary-500 transition-all cursor-pointer shadow-sm"
            >
              <span className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate">Search platform (courses, codelab, jobs)...</span>
              </span>
              <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-semibold text-slate-400 bg-white dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* 4. Action Items & User Profile */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              className="p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Wishlist Button */}
            <Link
              to="/wishlist"
              aria-label="View saved courses in wishlist"
              className="relative p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white rounded-full text-[10px] font-extrabold flex items-center justify-center shadow-md animate-in zoom-in">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Button */}
            <Link
              to="/cart"
              aria-label="View shopping cart"
              className="relative p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-600 text-white rounded-full text-[10px] font-extrabold flex items-center justify-center shadow-md animate-in zoom-in">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Authenticated User Menu */}
            {isAuthenticated ? (
              <div className="relative" ref={userDropdownRef}>
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2.5 p-1 rounded-full hover:ring-2 hover:ring-primary-500/30 transition-all cursor-pointer"
                  aria-expanded={userDropdownOpen}
                >
                  <img
                    src={avatarUrl}
                    alt={displayName}
                    className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700 shadow-sm"
                  />
                  <ChevronDown className={`w-4 h-4 text-slate-400 hidden sm:block transition-transform duration-200 ${userDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{displayName}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/dashboard"
                        className="flex items-center space-x-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-primary-50 dark:hover:bg-primary-950/30 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        <span>Student Dashboard</span>
                      </Link>

                      <Link
                        to="/dashboard?tab=learning"
                        className="flex items-center space-x-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-primary-50 dark:hover:bg-primary-950/30 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                      >
                        <BookOpen className="w-4 h-4" />
                        <span>My Learning</span>
                      </Link>

                      <Link
                        to="/dashboard?tab=learning-paths"
                        className="flex items-center space-x-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-primary-50 dark:hover:bg-primary-950/30 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                      >
                        <Route className="w-4 h-4 text-primary-500" />
                        <span>My Learning Paths</span>
                      </Link>

                      <Link
                        to="/aptitude/analytics"
                        className="flex items-center space-x-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-primary-50 dark:hover:bg-primary-950/30 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                      >
                        <Target className="w-4 h-4 text-indigo-500" />
                        <span>Aptitude Performance</span>
                      </Link>

                      <Link
                        to="/codelab/submissions"
                        className="flex items-center space-x-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-primary-50 dark:hover:bg-primary-950/30 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                      >
                        <Code2 className="w-4 h-4 text-emerald-500" />
                        <span>CodeLab Submissions</span>
                      </Link>

                      <Link
                        to="/projects/portfolio"
                        className="flex items-center space-x-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-primary-50 dark:hover:bg-primary-950/30 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                      >
                        <FolderGit2 className="w-4 h-4 text-purple-500" />
                        <span>Project Portfolio</span>
                      </Link>

                      <Link
                        to="/career"
                        className="flex items-center space-x-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-primary-50 dark:hover:bg-primary-950/30 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                      >
                        <Compass className="w-4 h-4 text-amber-500" />
                        <span>Career Command Center</span>
                      </Link>

                      <Link
                        to="/instructor"
                        className="flex items-center space-x-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-primary-50 dark:hover:bg-primary-950/30 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                      >
                        <PlusCircle className="w-4 h-4 text-emerald-500" />
                        <span>Instructor Studio</span>
                      </Link>

                      {isAdmin && (
                        <Link
                          to="/admin/dashboard"
                          className="flex items-center space-x-2.5 px-4 py-2.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-colors"
                        >
                          <Shield className="w-4 h-4" />
                          <span>Admin Control Panel</span>
                        </Link>
                      )}
                    </div>

                    <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                      <button
                        onClick={logout}
                        className="w-full flex items-center space-x-2.5 px-4 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Guest Auth CTA */
              <div className="hidden sm:flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">Log In</Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Register</Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl xl:hidden cursor-pointer"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* 5. Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top-4 duration-200">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses..."
              className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border rounded-xl text-xs"
            />
          </form>

          {/* Links */}
          <div className="flex flex-col space-y-1 text-sm font-semibold">
            <Link to="/courses" className="px-3 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800">
              Browse Courses
            </Link>
            <Link to="/learning-paths" className="px-3 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-primary-600 dark:text-primary-400 font-semibold">
              Learning Paths
            </Link>
            <Link to="/aptitude" className="px-3 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-semibold">
              Aptitude Arena
            </Link>
            <Link to="/codelab" className="px-3 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-emerald-600 dark:text-emerald-400 font-semibold">
              CodeLab (Coding & DSA)
            </Link>
            <Link to="/projects" className="px-3 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-purple-600 dark:text-purple-400 font-semibold">
              Projects Hub
            </Link>
            <Link to="/interview" className="px-3 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-amber-600 dark:text-amber-400 font-semibold">
              Interview Hub
            </Link>
            <Link to="/career" className="px-3 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold">
              Career Readiness Score
            </Link>
            <Link to="/jobs" className="px-3 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold">
              Tech Jobs & Internships
            </Link>
            <Link to="/ai-career" className="px-3 py-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 font-semibold flex items-center gap-2">
              <Bot className="w-4 h-4" />
              <span>AI Career Mentor</span>
            </Link>
            <Link to="/teachers" className="px-3 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800">
              Instructors
            </Link>
            <Link to="/pricing" className="px-3 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800">
              Membership Pricing
            </Link>
            <Link to="/wishlist" className="px-3 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between">
              <span>Saved in Wishlist</span>
              {wishlistCount > 0 && (
                <span className="px-2 py-0.5 bg-rose-500 text-white rounded-full text-[10px] font-bold">
                  {wishlistCount}
                </span>
              )}
            </Link>
            {isAuthenticated && (
              <>
                <Link to="/dashboard" className="px-3 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800">
                  Student Dashboard
                </Link>
                <Link to="/instructor" className="px-3 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-primary-600">
                  Instructor Studio
                </Link>
              </>
            )}
          </div>

          {/* Mobile Auth Buttons */}
          {!isAuthenticated && (
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <Link to="/login" className="w-full">
                <Button variant="outline" size="sm" className="w-full">Log In</Button>
              </Link>
              <Link to="/register" className="w-full">
                <Button size="sm" className="w-full">Register</Button>
              </Link>
            </div>
          )}
        </div>
      )}
      <GlobalSearchModal isOpen={searchModalOpen} onClose={() => setSearchModalOpen(false)} />
    </header>
  );
};
