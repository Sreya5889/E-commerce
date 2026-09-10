import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { orderService } from '../../services/order.service';
import { paymentService } from '../../services/payment.service';
import {
  CreditCard,
  Lock,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { PageTransition } from '../../components/layout/PageTransition';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

const COUNTRIES = [
  'United States',
  'United Kingdom',
  'Canada',
  'Australia',
  'India',
  'Germany',
  'France',
  'Other'
];

export const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();
  const { cartItems, subtotal, discount, tax, total, coupon, clearCart } = useCart();

  const [step, setStep] = useState(1); // 1 = billing, 2 = payment
  const [billing, setBilling] = useState({
    name: user?.user_metadata?.full_name || user?.fullName || '',
    email: user?.email || '',
    address: '100 Innovation Way',
    city: 'San Francisco',
    state: 'CA',
    zip: '94105',
    country: 'United States',
  });

  const [payment, setPayment] = useState({
    method: 'credit_card',
    cardNumber: '4242 •••• •••• 4242',
    cardName: user?.user_metadata?.full_name || 'Jane Doe',
    expiry: '12/28',
    cvv: '123',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleBillingChange = (e) =>
    setBilling((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handlePaymentChange = (e) =>
    setPayment((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handlePlaceOrder = async () => {
    if (!user) {
      toast.error('Please sign in to finalize purchase');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const order = await orderService.createOrderFromCart(user.id, coupon?.code || null);
      if (order?.id || order?.orderId) {
        await paymentService.processPayment(order.id || order.orderId, payment.method, {
          cardName: payment.cardName,
          cardNumberLast4: (payment.cardNumber || '4242').slice(-4)
        });
      }
      clearCart();
      toast.success('Purchase completed successfully! Welcome to your courses.');
      navigate('/checkout/success', {
        state: { orderId: order?.id || order?.orderId || 'ORD-' + Date.now().toString().slice(-6), grandTotal: total }
      });
    } catch (err) {
      setError(err.message || 'Payment processing failed. Please verify card details.');
      toast.error('Transaction failed.');
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
        
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Secure Checkout
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Complete your transaction with 256-bit encrypted security
            </p>
          </div>
          <Link to="/cart" className="inline-flex items-center space-x-1 text-xs font-bold text-slate-500 hover:text-primary-600 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Cart</span>
          </Link>
        </div>

        {/* Stepper Progress */}
        <div className="flex items-center space-x-4 mb-10 max-w-md">
          {[
            { n: 1, label: '1. Billing Details' },
            { n: 2, label: '2. Payment Method' }
          ].map(({ n, label }, idx) => (
            <React.Fragment key={n}>
              <div
                className={`flex items-center space-x-2 text-xs font-bold ${
                  step >= n ? 'text-primary-600 dark:text-primary-400' : 'text-slate-400'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-colors ${
                    step >= n
                      ? 'bg-primary-600 text-white shadow-md shadow-primary-500/25'
                      : 'border-2 border-slate-300 dark:border-slate-700 text-slate-400'
                  }`}
                >
                  {n}
                </div>
                <span>{label}</span>
              </div>
              {idx < 1 && (
                <div
                  className={`flex-1 h-0.5 rounded-full ${
                    step > 1 ? 'bg-primary-500' : 'bg-slate-200 dark:bg-slate-800'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Form: Step 1 or Step 2 */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            
            {step === 1 && (
              <div className="space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    Billing Address & Details
                  </h2>
                  <span className="text-[11px] text-slate-400">Step 1 of 2</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    name="name"
                    required
                    value={billing.name}
                    onChange={handleBillingChange}
                  />

                  <Input
                    label="Email Address"
                    name="email"
                    type="email"
                    required
                    value={billing.email}
                    onChange={handleBillingChange}
                  />

                  <div className="sm:col-span-2">
                    <Input
                      label="Street Address"
                      name="address"
                      required
                      value={billing.address}
                      onChange={handleBillingChange}
                    />
                  </div>

                  <Input
                    label="City"
                    name="city"
                    required
                    value={billing.city}
                    onChange={handleBillingChange}
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      label="State"
                      name="state"
                      value={billing.state}
                      onChange={handleBillingChange}
                    />
                    <Input
                      label="Postal Code"
                      name="zip"
                      value={billing.zip}
                      onChange={handleBillingChange}
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                      Country
                    </label>
                    <select
                      name="country"
                      value={billing.country}
                      onChange={handleBillingChange}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-900 dark:text-slate-100"
                    >
                      {COUNTRIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                  <Button
                    size="md"
                    onClick={() => {
                      if (!billing.name || !billing.email) {
                        toast.error('Please complete name and email fields');
                        return;
                      }
                      setStep(2);
                    }}
                  >
                    Continue to Payment →
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    Payment Method
                  </h2>
                  <button
                    onClick={() => setStep(1)}
                    className="text-xs text-primary-600 font-bold hover:underline"
                  >
                    Edit Billing
                  </button>
                </div>

                {/* Method Tabs */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPayment(p => ({ ...p, method: 'credit_card' }))}
                    className={`p-3.5 rounded-2xl border text-left flex items-center space-x-3 transition-all ${
                      payment.method === 'credit_card'
                        ? 'border-primary-600 bg-primary-50/50 dark:bg-primary-950/30 ring-2 ring-primary-500/20'
                        : 'border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-primary-600" />
                    <div>
                      <p className="font-bold text-xs text-slate-900 dark:text-white">Credit or Debit Card</p>
                      <p className="text-[10px] text-slate-400">Visa, Mastercard, Amex</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPayment(p => ({ ...p, method: 'paypal' }))}
                    className={`p-3.5 rounded-2xl border text-left flex items-center space-x-3 transition-all ${
                      payment.method === 'paypal'
                        ? 'border-primary-600 bg-primary-50/50 dark:bg-primary-950/30 ring-2 ring-primary-500/20'
                        : 'border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <Lock className="w-5 h-5 text-indigo-600" />
                    <div>
                      <p className="font-bold text-xs text-slate-900 dark:text-white">PayPal / Express</p>
                      <p className="text-[10px] text-slate-400">Instant digital wallet</p>
                    </div>
                  </button>
                </div>

                {/* Card Inputs */}
                <div className="space-y-4 pt-2">
                  <Input
                    label="Name on Card"
                    name="cardName"
                    required
                    value={payment.cardName}
                    onChange={handlePaymentChange}
                  />

                  <Input
                    label="Card Number"
                    name="cardNumber"
                    required
                    icon={CreditCard}
                    value={payment.cardNumber}
                    onChange={handlePaymentChange}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Expiration (MM/YY)"
                      name="expiry"
                      required
                      value={payment.expiry}
                      onChange={handlePaymentChange}
                    />

                    <Input
                      label="Security Code (CVV)"
                      name="cvv"
                      required
                      value={payment.cvv}
                      onChange={handlePaymentChange}
                    />
                  </div>
                </div>

                {/* Complete Order Button */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                  <Button
                    size="lg"
                    loading={loading}
                    className="w-full font-black shadow-lg shadow-primary-500/25"
                    onClick={handlePlaceOrder}
                  >
                    Complete Purchase (${total.toFixed(2)})
                  </Button>

                  <div className="flex items-center justify-center space-x-2 text-[11px] text-slate-400">
                    <Lock className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Your transaction is secured by end-to-end encryption.</span>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Right Summary: Items + Breakdown */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-5">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
                Order Items ({cartItems.length})
              </h3>

              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-xs space-x-3">
                    <div className="flex items-center space-x-3 min-w-0">
                      <img
                        src={item.thumbnail_url || item.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100'}
                        alt={item.title}
                        className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                      />
                      <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {item.title}
                      </span>
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white flex-shrink-0">
                      ${Number(item.discount_price ?? item.price ?? 49.99).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Calculation */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900 dark:text-white">${subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount ({coupon?.code})</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-500">
                  <span>Taxes (5%)</span>
                  <span className="font-semibold text-slate-900 dark:text-white">${tax.toFixed(2)}</span>
                </div>
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-baseline">
                  <span className="font-bold text-sm text-slate-900 dark:text-white">Total Amount</span>
                  <span className="text-xl font-black text-primary-600 dark:text-primary-400">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Trust Badge */}
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 rounded-2xl flex items-center space-x-2 text-xs text-emerald-800 dark:text-emerald-300">
                <ShieldCheck className="w-5 h-5 flex-shrink-0 text-emerald-600" />
                <span className="text-[11px] font-medium leading-tight">
                  Instant course enrollment granted upon completion. Lifetime access guaranteed.
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </PageTransition>
  );
};
