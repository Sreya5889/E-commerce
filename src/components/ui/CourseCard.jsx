import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, BookOpen, Heart, ShoppingCart, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { Badge } from './Badge';
import { formatINR } from '../../utils/currency';

export const CourseCard = ({ course, className = '' }) => {
  const { addToCart, isInCart, addToWishlist, removeFromWishlist, isInWishlist } = useCart();
  const toast = useToast();

  if (!course) return null;

  const inCart = isInCart(course.id);
  const inWishlist = isInWishlist(course.id);

  const teacher = course.teachers;
  const teacherName =
    teacher?.profiles?.display_name ||
    `${teacher?.profiles?.first_name || ''} ${teacher?.profiles?.last_name || ''}`.trim() ||
    course.instructor_name ||
    'Senior Instructor';

  const teacherAvatar =
    teacher?.profiles?.avatar_url ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(teacherName)}&background=2563eb&color=fff&size=64`;

  const categoryName = course.categories?.name || course.category || 'Development';
  const rating = Number(course.avg_rating ?? course.rating ?? 4.8).toFixed(1);
  const reviewCount = course.review_count ?? course.reviewsCount ?? 1420;
  const studentCount = Number(course.student_count ?? course.studentCount ?? 840);
  const duration = course.duration_hours ?? course.durationHours ?? 12;
  const lessonCount = course.lesson_count ?? (course.course_sections?.reduce((acc, s) => acc + (s.course_lessons?.length || 0), 0) || 24);

  const price = Number(course.price ?? 49.99);
  const discountPrice = course.discount_price !== undefined && course.discount_price !== null
    ? Number(course.discount_price)
    : course.discountPrice !== undefined && course.discountPrice !== null
    ? Number(course.discountPrice)
    : price;

  const hasDiscount = discountPrice > 0 && discountPrice < price;
  const discountPercent = hasDiscount ? Math.round(((price - discountPrice) / price) * 100) : 0;

  const handleCartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (inCart) {
      toast.info(`"${course.title}" is already in your cart.`);
      return;
    }
    addToCart(course.id);
    toast.success(`Added "${course.title}" to cart!`);
  };

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (inWishlist) {
      removeFromWishlist(course.id);
      toast.info('Removed from your wishlist.');
    } else {
      addToWishlist(course.id);
      toast.success('Saved to your wishlist!');
    }
  };

  return (
    <div
      className={`group relative bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${className}`}
    >
      {/* Thumbnail + Overlays */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <Link to={`/course/${course.id || course.slug}`}>
          <img
            src={course.thumbnail_url || course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80'}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10 pointer-events-none">
          {course.is_bestseller && (
            <Badge variant="bestseller" size="sm">Bestseller</Badge>
          )}
          {course.is_trending && (
            <Badge variant="trending" size="sm">Trending</Badge>
          )}
          {course.level && (
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-slate-900/80 backdrop-blur-md text-white border border-white/10 uppercase">
              {course.level}
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Save to wishlist'}
          className={`absolute top-3 right-3 z-10 p-2 rounded-xl backdrop-blur-md transition-all duration-200 cursor-pointer ${
            inWishlist
              ? 'bg-rose-500 text-white shadow-md'
              : 'bg-slate-900/60 hover:bg-slate-900/90 text-white'
          }`}
        >
          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          {/* Category & Meta */}
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider text-[10px]">
              {categoryName}
            </span>
            <div className="flex items-center space-x-1 font-semibold text-slate-500 dark:text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              <span>{duration} hrs</span>
            </div>
          </div>

          {/* Title */}
          <Link to={`/course/${course.id || course.slug}`} className="block">
            <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {course.title}
            </h3>
          </Link>

          {/* Instructor line */}
          <div className="flex items-center space-x-2 pt-0.5">
            <img
              src={teacherAvatar}
              alt={teacherName}
              className="w-5 h-5 rounded-full object-cover border border-slate-200 dark:border-slate-700"
            />
            <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {teacherName}
            </span>
          </div>

          {/* Ratings & Enrolled Count */}
          <div className="flex items-center space-x-2 text-xs pt-1">
            <div className="flex items-center space-x-1 font-extrabold text-amber-500">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{rating}</span>
            </div>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-slate-400 text-[11px]">
              ({studentCount.toLocaleString()} students)
            </span>
          </div>
        </div>

        {/* Price & Add to Cart Footer */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-baseline space-x-2">
            <span className="text-lg font-black text-slate-900 dark:text-white">
              {formatINR(discountPrice)}
            </span>
            {hasDiscount && (
              <>
                <span className="text-xs text-slate-400 line-through font-medium">
                  {formatINR(price)}
                </span>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                  {discountPercent}% OFF
                </span>
              </>
            )}
          </div>

          <button
            onClick={handleCartClick}
            aria-label="Add to cart"
            className={`p-2.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center space-x-1 cursor-pointer ${
              inCart
                ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                : 'bg-primary-50 hover:bg-primary-600 text-primary-600 hover:text-white dark:bg-primary-950/40 dark:text-primary-400 dark:hover:bg-primary-600 dark:hover:text-white'
            }`}
          >
            {inCart ? (
              <>
                <Check className="w-4 h-4" />
                <span className="text-[11px] hidden sm:inline">In Cart</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                <span className="text-[11px] hidden sm:inline">Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
