import React from 'react';
import { useApp } from '../context/AppContext';
import { Scale, Heart, ShieldCheck, Zap, Globe, Sparkles, Send } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActivePage } = useApp();

  return (
    <footer className="w-full bg-slate-900 text-slate-300 border-t border-slate-800">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-blue-500/30">
                <Scale className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                SmartCompare
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              BSCS Final Year Project (Session 2023–2027). An intelligent multi-platform product comparison website aggregating Amazon, eBay, Shopify, and BestBuy deals with transparent Smart Scoring and AI-driven recommendations.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-800 text-blue-400 border border-slate-700 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                Verified Algorithm
              </span>
              <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-800 text-emerald-400 border border-slate-700 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                Live Price Sync
              </span>
            </div>
          </div>

          {/* Supported Platforms */}
          <div>
            <h4 className="text-white font-bold text-sm mb-3">Supported Stores</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="hover:text-white cursor-pointer transition-colors flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                Amazon Prime Direct
              </li>
              <li className="hover:text-white cursor-pointer transition-colors flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                eBay Top-Rated Outlets
              </li>
              <li className="hover:text-white cursor-pointer transition-colors flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Shopify Verified Merchants
              </li>
              <li className="hover:text-white cursor-pointer transition-colors flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-400"></span>
                Best Buy Electronics
              </li>
              <li className="hover:text-white cursor-pointer transition-colors flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                Walmart Marketplace
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm mb-3">Quick Navigation</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => { setActivePage('home'); window.scrollTo(0, 0); }}
                  className="hover:text-white transition-colors"
                >
                  Home Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActivePage('products'); window.scrollTo(0, 0); }}
                  className="hover:text-white transition-colors"
                >
                  Search Catalog
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActivePage('compare'); window.scrollTo(0, 0); }}
                  className="hover:text-white transition-colors"
                >
                  Side-by-Side Compare
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActivePage('dashboard'); window.scrollTo(0, 0); }}
                  className="hover:text-white transition-colors"
                >
                  Shopper Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActivePage('portal'); window.scrollTo(0, 0); }}
                  className="hover:text-white transition-colors text-purple-400 font-semibold"
                >
                  Central Web Portal Hub
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActivePage('admin'); window.scrollTo(0, 0); }}
                  className="hover:text-white transition-colors"
                >
                  Admin Control Panel
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActivePage('about'); window.scrollTo(0, 0); }}
                  className="hover:text-white transition-colors"
                >
                  FYP Project Documentation
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter / Price Tracker */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm">Deal Drop Alerts</h4>
            <p className="text-xs text-slate-400">
              Get notified immediately when prices on tracked laptops, smartphones, and headphones hit historical lows.
            </p>
            <div className="flex items-center gap-1.5">
              <input
                type="email"
                placeholder="Enter email address"
                className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={() => alert('Subscribed to deal alerts!')}
                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shrink-0 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="text-[11px] text-slate-500 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>No spam. Powered by real-time price monitoring.</span>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 Smart E-Commerce Product Comparison Website. BSCS Final Year Project.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-300 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-slate-300 cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-slate-300 cursor-pointer">Database Architecture</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
