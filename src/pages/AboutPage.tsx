import React from 'react';
import { useApp } from '../context/AppContext';
import {
  GraduationCap,
  BookOpen,
  Code2,
  Database,
  Scale,
  Sparkles,
  ShieldCheck,
  Cpu,
  Layers,
  CheckCircle2,
  FileText
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { setActivePage } = useApp();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Title & FYP Info Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider">
          <GraduationCap className="w-4 h-4" />
          <span>BSCS Final Year Project (Session 2023–2027)</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Smart E-Commerce Product Comparison Website
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mx-auto leading-relaxed">
          Comprehensive project documentation, system architecture breakdown, and algorithm specification for academic demonstration and viva examination.
        </p>
      </div>

      {/* 1. Problem Statement & Motivation */}
      <section className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
          <BookOpen className="w-4 h-4" />
          <span>1. Problem Statement</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
          Why We Built This Platform
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          In contemporary online shopping, consumer product listings are heavily fragmented across platforms such as Amazon, eBay, Shopify storefronts, BestBuy, and Walmart. Shoppers face several critical pain points:
        </p>
        <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 list-disc list-inside">
          <li><strong>Price Disparities:</strong> Identical tech gadgets vary by up to 25% across different marketplaces without consumer awareness.</li>
          <li><strong>Deceptive Marketing:</strong> Artificial discounts where original MSRPs are inflated to simulate sales.</li>
          <li><strong>Inconsistent Specifications:</strong> Technical attributes are labeled differently across merchants, making direct comparison tedious.</li>
          <li><strong>Cognitive Overload:</strong> Navigating multiple tabs to manually compare prices, shipping charges, and seller ratings leads to decision fatigue.</li>
        </ul>
      </section>

      {/* 2. Proposed Solution & System Architecture */}
      <section className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-6">
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
          <Layers className="w-4 h-4" />
          <span>2. Proposed Technical Solution</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
          Architectural Overview & Integration Stack
        </h2>
        
        {/* Architecture Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
              <Code2 className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Presentation Layer</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              React 19 with TypeScript, Tailwind CSS v4, Lucide Icons, dynamic state store, and persistent Light/Dark theming.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
              <Cpu className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Application & API Layer</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Full RESTful API endpoints for comparison, URL parsing, image feature matching, and Gemini 3.8 Flash AI integration with rule-based fallback.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold">
              <Database className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Relational Data Layer</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              MySQL schema (<code className="font-mono text-[10px]">smart_ecommerce.sql</code>) containing 16 relational tables with foreign keys and indexes. Also portable to XAMPP/WAMP.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Mathematical Formulation of the Smart Score */}
      <section className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
          <Scale className="w-4 h-4" />
          <span>3. Mathematical Formulation</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
          The Smart Recommendation Scoring Algorithm
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          Rather than relying on opaque or sponsored "best" badges, our platform computes a normalized composite score $S \in [0, 100]$ using a multi-criteria utility function:
        </p>

        {/* Formula Box */}
        <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 font-mono text-xs text-blue-700 dark:text-blue-300 overflow-x-auto">
          SmartScore = (0.35 × S_price) + (0.25 × S_rating) + (0.15 × S_reviews) + (0.10 × S_discount) + (0.10 × S_shipping) + (0.05 × S_stock)
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
            <span className="font-bold text-slate-900 dark:text-white block">Price Competitiveness (35%)</span>
            <span className="text-[11px] text-slate-500">Evaluates current price relative to category benchmark and competing store offers.</span>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
            <span className="font-bold text-slate-900 dark:text-white block">Customer Rating (25%)</span>
            <span className="text-[11px] text-slate-500">Normalized 5-star rating converted into an objective satisfaction factor.</span>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
            <span className="font-bold text-slate-900 dark:text-white block">Review Volume Confidence (15%)</span>
            <span className="text-[11px] text-slate-500">Bayesian-inspired damping so products with thousands of reviews outrank 1-review 5-star items.</span>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
            <span className="font-bold text-slate-900 dark:text-white block">Discounts & Shipping (20%)</span>
            <span className="text-[11px] text-slate-500">Penalizes hidden shipping charges and rewards verified promotional price drops.</span>
          </div>
        </div>
      </section>

      {/* 4. Viva Examination Checklist */}
      <section className="p-8 bg-blue-50 dark:bg-slate-900/60 border border-blue-200 dark:border-slate-800 rounded-3xl space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-blue-600" />
          <span>BSCS Final Evaluation Deliverables Checklist</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 dark:text-slate-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Multi-store price extraction & comparison</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Side-by-side spec differential highlighter</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Trained Gemini AI + Rule-based fallback bot</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>URL link analyzer & image visual search</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Complete MySQL database (<code className="font-mono">smart_ecommerce.sql</code>)</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>XAMPP / WAMP PHP backend integration</span>
          </div>
        </div>

        <div className="pt-3">
          <button
            onClick={() => setActivePage('products')}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
          >
            Test Live Application Now
          </button>
        </div>
      </section>

    </div>
  );
};
