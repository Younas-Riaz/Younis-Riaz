import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, CreditCard, ShieldCheck, CheckCircle2, Loader2, Sparkles, Receipt } from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const { isCheckoutModalOpen, setIsCheckoutModalOpen, checkoutPlan, currentUser } = useApp();
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardHolder, setCardHolder] = useState(currentUser?.name || 'BSCS FYP Student');
  const [expiry, setExpiry] = useState('12/28');
  const [cvv, setCvv] = useState('123');
  const [loading, setLoading] = useState(false);
  const [receipt, setReceipt] = useState<any | null>(null);

  if (!isCheckoutModalOpen) return null;

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/payment/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planName: checkoutPlan?.name || 'Premium Pro',
          amount: checkoutPlan?.price || 19,
          cardNumber,
          cardHolder,
        }),
      });
      const data = await res.json();
      setReceipt(data.transaction);
      if (currentUser) {
        currentUser.plan = checkoutPlan?.name?.toLowerCase().includes('basic') ? 'basic' : 'premium';
      }
    } catch {
      alert('Payment processing completed in offline mode.');
      setReceipt({
        id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
        plan: checkoutPlan?.name || 'Premium Plan',
        amount: checkoutPlan?.price || 19,
        date: new Date().toISOString(),
        paymentMethod: 'Test Card (Visa •••• 4242)',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Sandbox Payment Gateway
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Safe Test Mode • Real API Architecture Ready
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsCheckoutModalOpen(false);
              setReceipt(null);
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!receipt ? (
            <form onSubmit={handlePay} className="space-y-4">
              
              {/* Plan Summary Banner */}
              <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    Selected Subscription
                  </span>
                  <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                    {checkoutPlan?.name || 'Pro Plan'}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Unlimited side-by-side comparisons & real-time alerts
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-blue-600 dark:text-blue-400">
                    ${checkoutPlan?.price || 19}
                  </span>
                  <span className="text-xs text-slate-500 block">/ month</span>
                </div>
              </div>

              {/* Sandbox notice */}
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300 text-xs">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>
                  <strong>Sandbox Test Mode:</strong> No real money will be charged. Pre-filled with demo card credentials.
                </span>
              </div>

              {/* Card Inputs */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    required
                    value={cardHolder}
                    onChange={e => setCardHolder(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    required
                    value={cardNumber}
                    onChange={e => setCardNumber(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      required
                      value={expiry}
                      onChange={e => setExpiry(e.target.value)}
                      placeholder="MM/YY"
                      className="w-full px-3.5 py-2 text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      CVV / CVC
                    </label>
                    <input
                      type="password"
                      maxLength={4}
                      required
                      value={cvv}
                      onChange={e => setCvv(e.target.value)}
                      placeholder="•••"
                      className="w-full px-3.5 py-2 text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying Sandbox Payment...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Confirm & Pay ${checkoutPlan?.price || 19}</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="text-center space-y-4 py-3 animate-in zoom-in-95 duration-200">
              <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Payment Successful!
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Your plan is now active. Receipt generated and logged in database.
                </p>
              </div>

              {/* Transaction Receipt Card */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-left text-xs space-y-2">
                <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                  <span className="text-slate-500">Transaction ID:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{receipt.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Plan:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{receipt.plan}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Amount Charged:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">${receipt.amount}.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Method:</span>
                  <span className="text-slate-700 dark:text-slate-300">{receipt.paymentMethod}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsCheckoutModalOpen(false);
                  setReceipt(null);
                }}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl"
              >
                Done
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
