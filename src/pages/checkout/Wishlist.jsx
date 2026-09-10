import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { Heart, BookOpen, Trash2, ShoppingCart } from 'lucide-react';
import { PageTransition } from '../../components/layout/PageTransition';
import { CourseCard } from '../../components/ui/CourseCard';
import { EmptyState } from '../../components/ui/EmptyState';

export const Wishlist = () => {
  const { wishlistItems } = useCart();

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center space-x-3">
              <Heart className="w-8 h-8 text-rose-500 fill-current" />
              <span>My Wishlist</span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {wishlistItems.length} {wishlistItems.length === 1 ? 'course' : 'courses'} saved for future learning
            </p>
          </div>
          {wishlistItems.length > 0 && (
            <Link to="/courses" className="text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline">
              Explore More Courses →
            </Link>
          )}
        </div>

        {wishlistItems.length === 0 ? (
          <EmptyState
            icon={Heart}
            title="Your wishlist is waiting for your next great course"
            description="Explore our catalog of 500+ masterclasses and bookmark the skills you want to master."
            actionText="Explore Courses"
            actionLink="/courses"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}

      </div>
    </PageTransition>
  );
};
