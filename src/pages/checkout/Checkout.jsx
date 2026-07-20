import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../services/db';
import { CreditCard, Lock, AlertCircle, ShieldCheck } from 'lucide-react';
import { PageTransition } from '../../components/layout/PageTransition';

const COUNTRIES = ['United States', 'United Kingdom', 'Canada', 'Australia', 'India', 'Germany', 'France', 'Other'];

export const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, subtotal, discount, tax, total, coupon, clearCart } = useCart();

  const [step, setStep] = useState(1); // 1=billing, 2=payment
  const [billing, setBilling] = useState({
    name: user?.fullName || '',
    email: user?.email || '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'United States',
  });
  const [payment, setPayment] = useState({
    method: 'credit_card',
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleBillingChange = (e) => setBilling(p => ({ ...p, [e.target.name]: e.target.value }));
  const handlePaymentChange = (e) => setPayment(p => ({ ...p, [e.target.name]: e.target.value }));

  const formatCardNumber = (val) => {
    return val.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19);
  };
  const formatExpiry = (val) => {
    return val.replace(/\D/g, '').replace(/^(\d{2})/, '$1/').slice(0, 5);
  };

  const handlePlaceOrder = async () => {
    if (!user) return;
    setLoading(true);
    setError('');
    try {
      const cartIds = cartItems.map(c => c.id);
      const order = await db.createOrder(user.id, cartIds, coupon?.code || null, billing);
      await db.processPayment(order.id, payment.method, payment);
      clearCart();
      navigate('/checkout/success', { state: { orderId: order.id, grandTotal: total } });
    } catch (err) {
      setError(err.message || 'Payment failed. Please try again.');
      navigate('/checkout/failed', { state: { error: err.message } });
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">

        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-8">Secure Checkout</h1>

        {/* Progress Stepper */}
        <div className="flex items-center space-x-4 mb-10">
          {[{ n: 1, label: 'Billing Details' }, { n: 2, label: 'Payment' }].map(({ n, label }, idx) => (
            <React.Fragment key={n}>
              <div className={`flex items-center space-x-2 text-xs font-semibold ${step >= n ? 'text-primary-600 dark:text-primary-400' : 'text-slate-400'}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${step >= n ? 'bg-primary-600 border-primary-600 text-white' : 'border-slate-300 dark:border-slate-600 text-slate-400'}`}>{n}</div>
                <span className="hidden sm:inline">{label}</span>
              </div>
              {idx < 1 && <div className={`flex-1 h-0.5 rounded-full ${step > n ? 'bg-primary-500' : 'bg-slate-200 dark:bg-slate-700'}`}></div>}
            </React.Fragment>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left: Form Steps */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-premium p-8 shadow-sm space-y-6">

            {/* Step 1: Billing */}
            {step === 1 && (
              <div className="space-y-5">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Billing Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { name: 'name', label: 'Full Name', placeholder: 'Jane Doe' },
                    { name: 'email', label: 'Email Address', placeholder: 'jane@example.com', type: 'email' },
                    { name: 'address', label: 'Street Address', placeholder: '123 Main Street', full: true },
                    { name: 'city', label: 'City', placeholder: 'San Francisco' },
                    { name: 'state', label: 'State / Province', placeholder: 'CA' },
                    { name: 'zip', label: 'ZIP / Postal Code', placeholder: '94107' },
                  ].map(({ name, label, placeholder, type = 'text', full }) => (
                    <div key={name} className={`space-y-1.5 text-xs ${full ? 'sm:col-span-2' : ''}`}>
                      <label className="font-semibold text-slate-700 dark:text-slate-300">{label}</label>
                      <input
                        type={type}
                        name={name}
                        value={billing[name]}
                        onChange={handleBillingChange}
                        placeholder={placeholder}
                        required
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-premium focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-900 dark:text-slate-100 transition-all"
                      />
                    </div>
                  ))}
                  <div className="space-y-1.5 text-xs sm:col-span-2">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">Country</label>
                    <select
                      name="country"
                      value={billing.country}
                      onChange={handleBillingChange}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-premium focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-900 dark:text-slate-100 transition-all"
                    >
                      {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <button
                  onClick={() => setStep(2)}
                  disabled={!billing.name || !billing.email || !billing.address || !billing.city}
                  className="w-full py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm rounded-premium transition-colors disabled:opacity-50 mt-4"
                >
                  Continue to Payment →
                </button>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">Payment Method</h2>
                  <button onClick={() => setStep(1)} className="text-xs text-primary-600 dark:text-primary-400 hover:underline">← Edit Billing</button>
                </div>

                {/* Payment Method Selector */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'credit_card', label: 'Credit Card' },
                    { value: 'paypal', label: 'PayPal' },
                    { value: 'bank', label: 'Bank Transfer' },
                  ].map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => setPayment(p => ({ ...p, method: value }))}
                      className={`px-3 py-3 rounded-premium border text-xs font-semibold transition-all ${
                        payment.method === value
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400'
                          : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {payment.method === 'credit_card' && (
                  <div className="space-y-4 p-5 bg-slate-50 dark:bg-slate-800 rounded-premium border border-slate-200 dark:border-slate-700">
                    <div className="space-y-1.5 text-xs">
                      <label className="font-semibold text-slate-700 dark:text-slate-300">Card Number</label>
                      <input
                        name="cardNumber"
                        value={payment.cardNumber}
                        onChange={(e) => setPayment(p => ({ ...p, cardNumber: formatCardNumber(e.target.value) }))}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-premium focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-900 dark:text-slate-100 font-mono text-sm"
                      />
                    </div>
                    <div className="space-y-1.5 text-xs">
                      <label className="font-semibold text-slate-700 dark:text-slate-300">Cardholder Name</label>
                      <input
                        name="cardName"
                        value={payment.cardName}
                        onChange={handlePaymentChange}
                        placeholder="Jane Doe"
                        className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-premium focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-900 dark:text-slate-100"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5 text-xs">
                        <label className="font-semibold text-slate-700 dark:text-slate-300">Expiry (MM/YY)</label>
                        <input
                          name="expiry"
                          value={payment.expiry}
                          onChange={(e) => setPayment(p => ({ ...p, expiry: formatExpiry(e.target.value) }))}
                          placeholder="12/27"
                          maxLength={5}
                          className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-premium focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-900 dark:text-slate-100 font-mono"
                        />
                      </div>
                      <div className="space-y-1.5 text-xs">
                        <label className="font-semibold text-slate-700 dark:text-slate-300">CVV</label>
                        <input
                          name="cvv"
                          value={payment.cvv}
                          onChange={handlePaymentChange}
                          placeholder="123"
                          maxLength={4}
                          type="password"
                          className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-premium focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-900 dark:text-slate-100 font-mono"
                        />
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-400 flex items-center space-x-1">
                      <span>💡 Tip: Use card number</span>
                      <span className="font-mono font-bold">0000 0000 0000 0000</span>
                      <span>to test a payment failure scenario.</span>
                    </p>
                  </div>
                )}

                {payment.method === 'paypal' && (
                  <div className="p-6 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/30 rounded-premium text-center space-y-3">
                    <p className="text-xs font-medium text-blue-700 dark:text-blue-400">You will be redirected to PayPal to complete payment securely.</p>
                  </div>
                )}

                {error && (
                  <div className="p-4 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-200 rounded-premium flex items-center space-x-2 text-xs">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-extrabold text-sm rounded-premium shadow-lg flex items-center justify-center space-x-2.5 transition-colors disabled:opacity-60"
                >
                  <Lock className="w-4 h-4" />
                  <span>{loading ? 'Processing...' : `Complete Purchase — $${total.toFixed(2)}`}</span>
                </button>

                <p className="text-[10px] text-slate-400 text-center flex items-center justify-center space-x-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
                  <span>256-bit SSL • PCI DSS Compliant • 30-day money-back guarantee</span>
                </p>
              </div>
            )}
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-premium p-6 shadow-sm space-y-4 sticky top-24">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Order Summary</h3>

              <div className="space-y-3 max-h-64 overflow-y-auto">
                {cartItems.map(course => (
                  <div key={course.id} className="flex items-center space-x-3 py-2 border-b border-slate-50 dark:border-slate-800 last:border-0">
                    <img src={course.thumbnail} alt={course.title} className="w-12 h-8 rounded-lg object-cover flex-shrink-0" />
                    <div className="flex-grow min-w-0">
                      <p className="text-xs font-semibold text-slate-900 dark:text-white line-clamp-1">{course.title}</p>
                    </div>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex-shrink-0">
                      ${(course.discountPrice || course.price).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600 dark:text-green-400">
                    <span>Discount ({coupon?.discountPercent}%)</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Tax (5%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-extrabold text-sm text-slate-900 dark:text-white pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </PageTransition>
  );
};
