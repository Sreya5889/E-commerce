import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { ShoppingCart, Trash2, Tag, X, ArrowRight, BookOpen, AlertCircle, CheckCircle2 } from 'lucide-react';
import { PageTransition } from '../../components/layout/PageTransition';

export const Cart = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    cartItems, removeFromCart, coupon, applyCoupon, removeCoupon,
    subtotal, discount, tax, total, loading
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponError('');
    setCouponSuccess('');
    try {
      const applied = await applyCoupon(couponCode.trim().toUpperCase());
      setCouponSuccess(`Coupon "${applied.code}" applied! ${applied.discountPercent}% off.`);
      setCouponCode('');
    } catch (err) {
      setCouponError(err.message || 'Invalid coupon code');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleCheckout = () => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
      return;
    }
    navigate('/checkout');
  };

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">

        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center space-x-3">
            <ShoppingCart className="w-7 h-7 text-primary-600" />
            <span>Shopping Cart</span>
            {cartItems.length > 0 && (
              <span className="text-sm font-medium text-slate-400">({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})</span>
            )}
          </h1>
        </div>

        {cartItems.length === 0 ? (
          /* Empty Cart State */
          <div className="text-center py-24 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-premium space-y-6">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto">
              <ShoppingCart className="w-10 h-10 text-slate-300 dark:text-slate-600" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Your cart is empty</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                Browse our premium courses and add the ones you love to get started.
              </p>
            </div>
            <Link
              to="/courses"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-premium shadow-md transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              <span>Browse Courses</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* Cart Items List */}
            <div className="lg:col-span-8 space-y-4">
              {cartItems.map((course) => (
                <div
                  key={course.id}
                  className="flex flex-col sm:flex-row gap-4 p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-premium shadow-sm hover:shadow-premium transition-shadow"
                >
                  <Link to={`/course/${course.id}`} className="flex-shrink-0">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full sm:w-36 h-24 rounded-xl object-cover"
                    />
                  </Link>

                  <div className="flex-grow min-w-0 flex flex-col justify-between">
                    <div>
                      {course.badge && (
                        <span className="inline-block px-2 py-0.5 bg-amber-100 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 text-[9px] font-bold uppercase rounded mb-1">
                          {course.badge}
                        </span>
                      )}
                      <Link to={`/course/${course.id}`}>
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 line-clamp-2 leading-snug transition-colors">
                          {course.title}
                        </h3>
                      </Link>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                        {course.durationHours} hrs • {course.level} • {course.language}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-baseline space-x-2">
                        <span className="text-base font-extrabold text-slate-900 dark:text-white">
                          ${(course.discountPrice || course.price).toFixed(2)}
                        </span>
                        {course.discountPrice && (
                          <span className="text-xs text-slate-400 line-through">${course.price.toFixed(2)}</span>
                        )}
                      </div>
                      <button
                        onClick={() => removeFromCart(course.id)}
                        className="flex items-center space-x-1.5 text-xs text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors font-medium"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-4 space-y-5">
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-premium p-6 shadow-sm space-y-5 sticky top-24">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Order Summary</h3>

                {/* Coupon Code Input */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Promo / Coupon Code</label>
                  {coupon ? (
                    <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/30 rounded-xl text-xs">
                      <div className="flex items-center space-x-2 text-green-700 dark:text-green-400">
                        <Tag className="w-4 h-4" />
                        <span className="font-bold">{coupon.code}</span>
                        <span>({coupon.discountPercent}% OFF)</span>
                      </div>
                      <button onClick={removeCoupon} className="text-slate-400 hover:text-red-500 transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="e.g. UDEMY50"
                        className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary-500 text-slate-800 dark:text-slate-200 font-mono"
                      />
                      <button
                        onClick={handleApplyCoupon}
                        disabled={couponLoading || !couponCode}
                        className="px-3 py-2 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-xl transition-colors disabled:opacity-50"
                      >
                        {couponLoading ? '...' : 'Apply'}
                      </button>
                    </div>
                  )}
                  {couponError && (
                    <div className="flex items-center space-x-1.5 text-[10px] text-red-500">
                      <AlertCircle className="w-3 h-3" />
                      <span>{couponError}</span>
                    </div>
                  )}
                  {couponSuccess && (
                    <div className="flex items-center space-x-1.5 text-[10px] text-green-500">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{couponSuccess}</span>
                    </div>
                  )}
                  <p className="text-[10px] text-slate-400">Try: <span className="font-mono font-bold cursor-pointer hover:text-primary-600" onClick={() => setCouponCode('UDEMY50')}>UDEMY50</span>, <span className="font-mono font-bold cursor-pointer hover:text-primary-600" onClick={() => setCouponCode('WELCOME10')}>WELCOME10</span></p>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 text-xs border-t border-slate-100 dark:border-slate-800 pt-4">
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Subtotal ({cartItems.length} items)</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600 dark:text-green-400 font-semibold">
                      <span>Coupon Discount</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Tax (5%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-extrabold text-sm text-slate-900 dark:text-white border-t border-slate-100 dark:border-slate-800 pt-3">
                    <span>Grand Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm rounded-premium shadow-md shadow-primary-500/15 flex items-center justify-center space-x-2 transition-colors"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <p className="text-[10px] text-slate-400 text-center">
                  🔒 Secured by 256-bit SSL encryption. 30-day money-back guarantee.
                </p>
              </div>
            </div>

          </div>
        )}
      </div>
    </PageTransition>
  );
};
