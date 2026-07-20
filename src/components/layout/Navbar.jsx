import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import {
  Menu,
  X,
  Search,
  ShoppingCart,
  Heart,
  Sun,
  Moon,
  ChevronDown,
  User,
  LogOut,
  Settings,
  BookOpen,
  LayoutDashboard,
  Award
} from 'lucide-react';
import { CATEGORIES } from '../../constants/mockData';

export const Navbar = () => {
  const { user, logout, isAdmin, isTeacher } = useAuth();
  const { cartItems, wishlistItems } = useCart();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleCategoryClick = (slug) => {
    navigate(`/courses?category=${slug}`);
    setCategoriesOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 w-full glass shadow-premium transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-premium bg-gradient-to-tr from-primary-600 to-secondary-600 flex items-center justify-center shadow-lg text-white font-extrabold text-xl">
                E
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                EduAcademy
              </span>
            </Link>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden lg:block flex-1 max-w-md mx-8">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search for courses, skills, or teachers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-premium text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-slate-800 dark:text-slate-200"
              />
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            </form>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/courses" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              Courses
            </Link>

            {/* Categories Dropdown */}
            <div className="relative">
              <button
                onClick={() => setCategoriesOpen(!categoriesOpen)}
                className="flex items-center space-x-1 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors focus:outline-none"
              >
                <span>Categories</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${categoriesOpen ? 'rotate-180' : ''}`} />
              </button>

              {categoriesOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setCategoriesOpen(false)}></div>
                  <div className="absolute left-0 mt-3 w-56 rounded-premium bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl z-20 py-2">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => handleCategoryClick(cat.slug)}
                        className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors block"
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <Link to="/teachers" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              Instructors
            </Link>
            <Link to="/pricing" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              Pricing
            </Link>
            <Link to="/about" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              Contact
            </Link>
          </div>

          {/* Action Icons & Profile */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-premium bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors focus:outline-none"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>

            {/* Wishlist */}
            <Link
              to="/dashboard?tab=wishlist"
              className="relative p-2.5 rounded-premium bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <Heart className="w-5 h-5" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-accent-500 text-white flex items-center justify-center text-[10px] font-bold">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2.5 rounded-premium bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary-600 text-white flex items-center justify-center text-[10px] font-bold">
                  {cartItems.length}
                </span>
              )}
            </Link>

            {/* Auth Dropdown or Buttons */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 border border-slate-200 dark:border-slate-700 rounded-premium p-1.5 focus:outline-none hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <img src={user.avatarUrl} alt={user.fullName} className="w-8 h-8 rounded-premium object-cover" />
                  <span className="text-sm font-medium hidden lg:inline-block text-slate-700 dark:text-slate-300 max-w-[120px] truncate">
                    {user.fullName || 'My Account'}
                  </span>
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                </button>

                {userDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setUserDropdownOpen(false)}></div>
                    <div className="absolute right-0 mt-3 w-64 rounded-premium bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl z-20 py-2 text-slate-800 dark:text-slate-200">
                      
                      <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center space-x-3">
                        <img src={user.avatarUrl} alt={user.fullName} className="w-10 h-10 rounded-premium object-cover" />
                        <div>
                          <p className="font-semibold text-sm leading-tight truncate max-w-[160px]">{user.fullName}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[160px]">{user.email}</p>
                        </div>
                      </div>

                      {/* Menu Options */}
                      <div className="p-1">
                        {isAdmin ? (
                          <Link
                            to="/admin/dashboard"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center space-x-2 px-3 py-2 text-sm rounded-premium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300"
                          >
                            <LayoutDashboard className="w-4 h-4 text-slate-400" />
                            <span>Admin Dashboard</span>
                          </Link>
                        ) : (
                          <>
                            <Link
                              to="/dashboard"
                              onClick={() => setUserDropdownOpen(false)}
                              className="flex items-center space-x-2 px-3 py-2 text-sm rounded-premium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300"
                            >
                              <LayoutDashboard className="w-4 h-4 text-slate-400" />
                              <span>My Learning Dashboard</span>
                            </Link>
                            <Link
                              to="/dashboard?tab=courses"
                              onClick={() => setUserDropdownOpen(false)}
                              className="flex items-center space-x-2 px-3 py-2 text-sm rounded-premium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300"
                            >
                              <BookOpen className="w-4 h-4 text-slate-400" />
                              <span>My Courses</span>
                            </Link>
                            <Link
                              to="/dashboard?tab=certificates"
                              onClick={() => setUserDropdownOpen(false)}
                              className="flex items-center space-x-2 px-3 py-2 text-sm rounded-premium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300"
                            >
                              <Award className="w-4 h-4 text-slate-400" />
                              <span>My Certificates</span>
                            </Link>
                            <Link
                              to="/dashboard?tab=settings"
                              onClick={() => setUserDropdownOpen(false)}
                              className="flex items-center space-x-2 px-3 py-2 text-sm rounded-premium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300"
                            >
                              <Settings className="w-4 h-4 text-slate-400" />
                              <span>Profile Settings</span>
                            </Link>
                          </>
                        )}

                        <div className="border-t border-slate-100 dark:border-slate-800 my-1"></div>

                        <button
                          onClick={() => {
                            logout();
                            setUserDropdownOpen(false);
                            navigate('/');
                          }}
                          className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-premium transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-sm font-medium rounded-premium hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-premium transition-colors shadow-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-premium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors focus:outline-none"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-premium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 px-4 pt-4 pb-6 space-y-4 shadow-lg animate-fade-in">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-premium text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-800 dark:text-slate-200"
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          </form>

          {/* Navigation Links */}
          <div className="flex flex-col space-y-3 font-medium text-slate-700 dark:text-slate-300">
            <Link to="/courses" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary-600 transition-colors">
              All Courses
            </Link>
            <Link to="/teachers" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary-600 transition-colors">
              Instructors
            </Link>
            <Link to="/pricing" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary-600 transition-colors">
              Pricing Plans
            </Link>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary-600 transition-colors">
              About Us
            </Link>
            <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary-600 transition-colors">
              Contact Support
            </Link>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800 my-2"></div>

          {/* Actions */}
          <div className="flex flex-col space-y-3">
            <Link
              to="/dashboard?tab=wishlist"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-2 py-2 text-slate-700 dark:text-slate-300 hover:text-primary-600"
            >
              <Heart className="w-5 h-5" />
              <span>Wishlist ({wishlistItems.length})</span>
            </Link>
            <Link
              to="/cart"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-2 py-2 text-slate-700 dark:text-slate-300 hover:text-primary-600"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Cart ({cartItems.length})</span>
            </Link>

            {user ? (
              <>
                <div className="flex items-center space-x-3 py-2">
                  <img src={user.avatarUrl} alt={user.fullName} className="w-10 h-10 rounded-premium object-cover" />
                  <div>
                    <p className="font-semibold text-sm">{user.fullName}</p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </div>
                </div>
                {isAdmin ? (
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2 bg-slate-100 dark:bg-slate-800 rounded-premium font-medium text-sm text-slate-800 dark:text-slate-200 block"
                  >
                    Admin Dashboard
                  </Link>
                ) : (
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2 bg-slate-100 dark:bg-slate-800 rounded-premium font-medium text-sm text-slate-800 dark:text-slate-200 block"
                  >
                    Student Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                    navigate('/');
                  }}
                  className="w-full text-center py-2 border border-red-200 text-red-600 rounded-premium font-medium text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 border border-slate-200 dark:border-slate-700 rounded-premium font-medium text-sm text-slate-700 dark:text-slate-200"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 bg-primary-600 text-white rounded-premium font-medium text-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
