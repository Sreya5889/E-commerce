import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  ShoppingCart,
  Trash2,
  Tag,
  X,
  ArrowRight,
  BookOpen,
  AlertCircle,
  CheckCircle2,
  Heart,
  ShieldCheck,
  Star
} from 'lucide-react';
import { PageTransition } from '../../components/layout/PageTransition';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { formatINR } from '../../utils/currency';

export const Cart = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();
  const {
    cartItems,
    removeFromCart,
    addToWishlist,
    coupon,
    applyCoupon,
    removeCoupon,
    subtotal,
    discount,
    tax,
    total,
    loading
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponError('');
    try {
      const code = couponCode.trim().toUpperCase();
      const applied = await applyCoupon(code);
      toast.success(`Coupon \"${code}\" applied! ${applied.discountPercent || applied.discount_percent}% off.`);
      setCouponCode('');
    } catch (err) {
      setCouponError(err.message || 'Invalid or expired coupon code');
      toast.error('Coupon code is not valid.');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleMoveToWishlist = (course) => {
    removeFromCart(course.id);
    addToWishlist(course.id);
    toast.info(`Moved \"${course.title}\" to your wishlist.`);
  };

  const handleRemove = (course) => {
    removeFromCart(course.id);
    toast.info(`Removed from your cart.`);
  };

  const handleCheckout = () => {
    if (!user) {
      toast.info('Please sign in or register to complete your order.');
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
      return;
    }
    navigate('/checkout');
  };

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center space-x-3">
              <ShoppingCart className="w-8 h-8 text-primary-600" />
              <span>Shopping Cart</span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {cartItems.length} {cartItems.length === 1 ? 'course' : 'courses'} in your cart
            </p>
          </div>
          {cartItems.length > 0 && (
            <Link to="/courses" className="text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline">
              Continue Shopping →
            </Link>
          )}
        </div>

        {cartItems.length === 0 ? (
          <EmptyState
            icon={ShoppingCart}
            title="Your cart is empty"
            description="You have no courses in your cart yet. Browse our extensive catalog to find skills that help you advance your tech career."
            actionText="Browse Courses"
            actionLink="/courses"
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Cart Items List */}
            <div className="lg:col-span-8 space-y-4">
              {cartItems.map((course) => {
                const teacherName = course.teachers?.profiles?.display_name ||
                  course.instructor_name ||
                  'Senior Instructor';
                const price = Number(course.price ?? 49.99);
                const discountPrice = course.discount_price !== undefined && course.discount_price !== null
                  ? Number(course.discount_price)
                  : course.discountPrice !== undefined && course.discountPrice !== null
                  ? Number(course.discountPrice)
                  : price;
                const hasDiscount = discountPrice > 0 && discountPrice < price;

                return (
                  <div
                    key={course.id}
                    className="flex flex-col sm:flex-row gap-4 p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
                  >
                    {/* Thumbnail */}
                    <Link to={`/course/${course.id}`} className="flex-shrink-0">
                      <img
                        src={course.thumbnail_url || course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300'}
                        alt={course.title}
                        className="w-full sm:w-40 h-24 rounded-xl object-cover"
                      />
                    </Link>

                    {/* Details */}
                    <div className="flex-grow min-w-0 flex flex-col justify-between space-y-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
                          {course.categories?.name || course.category || 'Development'}
                        </span>
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-snug line-clamp-2 hover:text-primary-600 transition-colors">
                          <Link to={`/course/${course.id}`}>{course.title}</Link>
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          By {teacherName}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-4 pt-1 text-xs">
                        <button
                          onClick={() => handleRemove(course)}
                          className="text-slate-400 hover:text-rose-600 flex items-center space-x-1 transition-colors font-medium"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                        <span className="text-slate-200 dark:text-slate-700">•</span>
                        <button
                          onClick={() => handleMoveToWishlist(course)}
                          className="text-slate-400 hover:text-primary-600 flex items-center space-x-1 transition-colors font-medium"
                        >
                          <Heart className="w-3.5 h-3.5" />
                          <span>Save for Later</span>
                        </button>
                      </div>
                    </div>

                    {/* Price Column */}
                    <div className="sm:text-right flex-shrink-0 self-start sm:self-center">
                      <p className="text-lg font-black text-slate-900 dark:text-white">
                        {formatINR(hasDiscount ? discountPrice : price)}
                      </p>
                      {hasDiscount && (
                        <p className="text-xs text-slate-400 line-through">
                          {formatINR(price)}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Summary Card */}
            <div className="lg:col-span-4 space-y-6">
              <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-6">
                <h2 className="text-base font-black text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
                  Order Summary
                </h2>

                {/* Price Breakdown */}
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Original Price:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{formatINR(subtotal)}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                      <span>Discount ({coupon?.code}):</span>
                      <span>-{formatINR(discount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Estimated Tax (5%):</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{formatINR(tax)}</span>
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex justify-between items-baseline">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">Total:</span>
                    <span className="text-2xl font-black text-primary-600 dark:text-primary-400">
                      {formatINR(total)}
                    </span>
                  </div>
                </div>

                {/* Coupon Code Input */}
                <form onSubmit={handleApplyCoupon} className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                    Promotional Coupon
                  </label>
                  {coupon ? (
                    <div className="flex items-center justify-between p-2.5 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 rounded-xl text-xs">
                      <span className="font-bold text-emerald-700 dark:text-emerald-400">
                        {coupon.code} ({coupon.discount_percent || coupon.discountPercent}% OFF)
                      </span>
                      <button
                        type="button"
                        onClick={removeCoupon}
                        className="text-slate-400 hover:text-red-500"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="e.g. UDEMY50"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs uppercase font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                      <Button
                        type="submit"
                        size="sm"
                        loading={couponLoading}
                        disabled={couponLoading || !couponCode.trim()}
                      >
                        Apply
                      </Button>
                    </div>
                  )}
                  {couponError && (
                    <p className="text-[11px] text-rose-500 font-medium">{couponError}</p>
                  )}
                </form>

                {/* Checkout Button */}
                <Button
                  size="lg"
                  className="w-full font-black shadow-lg shadow-primary-500/25"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>

                {/* Trust Points */}
                <div className="text-center space-y-1.5 pt-2">
                  <div className="flex items-center justify-center space-x-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>30-Day Money-Back Guarantee</span>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Encrypted 256-bit SSL secure checkout.
                  </p>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </PageTransition>
  );
};
