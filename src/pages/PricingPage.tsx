import React from 'react';
import { useApp } from '../context/AppContext';
import { Check, Sparkles, Zap, ShieldCheck, ArrowRight } from 'lucide-react';

export const PricingPage: React.FC = () => {
  const { setCheckoutPlan, setIsCheckoutModalOpen, currentUser } = useApp();

  const handleSelectPlan = (name: string, price: number) => {
    if (price === 0) {
      alert('You are already on the Free tier.');
      return;
    }
    setCheckoutPlan({ name, price });
    setIsCheckoutModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 uppercase tracking-wider">
          Transparent Membership
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Flexible Plans for Smart Shoppers
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          Start for free, or upgrade to Pro for real-time drop notifications, unrestricted side-by-side matrices, and AI shopping assistance.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
        
        {/* Free Plan */}
        <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Free Explorer
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black text-slate-900 dark:text-white">$0</span>
              <span className="text-xs text-slate-400">/ forever</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Ideal for casual shoppers looking to compare prices occasionally.
            </p>

            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Up to 3 side-by-side comparisons / day</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Access to Amazon, eBay & BestBuy listings</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Basic Smart Score calculation</span>
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <span className="w-4 h-4 rounded-full border border-slate-300 text-center leading-none text-[10px]">✕</span>
                <span>No automated price drop alerts</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => handleSelectPlan('Free Tier', 0)}
            className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl"
          >
            Current Plan
          </button>
        </div>

        {/* Basic Plan */}
        <div className="p-8 bg-white dark:bg-slate-900 border-2 border-blue-500 rounded-3xl shadow-xl shadow-blue-500/10 flex flex-col justify-between space-y-6 relative">
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-black uppercase tracking-wider shadow-md">
            Most Popular
          </div>

          <div className="space-y-4">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              Smart Shopper
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black text-slate-900 dark:text-white">$9</span>
              <span className="text-xs text-slate-400">/ month</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Designed for power consumers tracking price fluctuations on high-end gadgets.
            </p>

            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span><strong>Unlimited</strong> product comparisons</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Up to <strong>15 Active Price Alerts</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>6-Month Price Trend Charts</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>AI Chatbot Shopping Advisor access</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => handleSelectPlan('Basic Shopper', 9)}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/25 transition-all"
          >
            Upgrade to Basic ($9/mo)
          </button>
        </div>

        {/* Premium Plan */}
        <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">
              Premium Pro
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black text-slate-900 dark:text-white">$19</span>
              <span className="text-xs text-slate-400">/ month</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Full suite for professional buyers, reviewers, and enterprise teams.
            </p>

            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span><strong>Unlimited</strong> everything</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Instant SMS & Email Drop Webhooks</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Priority Gemini AI Shopping Analysis</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Exportable CSV & PDF Reports</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => handleSelectPlan('Premium Pro', 19)}
            className="w-full py-2.5 bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all"
          >
            Get Pro ($19/mo)
          </button>
        </div>

      </div>

    </div>
  );
};
