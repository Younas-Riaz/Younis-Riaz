import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  Scale,
  Sparkles,
  Link as LinkIcon,
  Image as ImageIcon,
  ShieldCheck,
  TrendingDown,
  ArrowRight,
  Star,
  CheckCircle,
  Zap,
  ShoppingBag,
  ExternalLink,
  Laptop,
  Smartphone,
  Headphones,
  Watch,
  Gamepad2,
  Camera
} from 'lucide-react';

const CATEGORIES = [
  { name: 'Smartphones', icon: Smartphone, count: '140+ Deals', color: 'from-blue-500 to-cyan-500' },
  { name: 'Laptops', icon: Laptop, count: '95+ Deals', color: 'from-indigo-500 to-blue-600' },
  { name: 'Headphones', icon: Headphones, count: '120+ Deals', color: 'from-purple-500 to-pink-500' },
  { name: 'Smart Watches', icon: Watch, count: '60+ Deals', color: 'from-amber-500 to-orange-500' },
  { name: 'Gaming & Accessories', icon: Gamepad2, count: '180+ Deals', color: 'from-emerald-500 to-teal-500' },
  { name: 'Cameras', icon: Camera, count: '45+ Deals', color: 'from-rose-500 to-red-500' },
];

export const HomePage: React.FC = () => {
  const {
    products,
    setActivePage,
    setSelectedProductId,
    addToCompare,
    setIsUrlModalOpen,
    setIsImageModalOpen,
    setSearchKeyword,
    setSelectedCategory,
  } = useApp();

  const [query, setQuery] = useState('');

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim().startsWith('http')) {
      setIsUrlModalOpen(true);
    } else {
      setSearchKeyword(query.trim());
      setActivePage('products');
    }
  };

  const featured = products.filter(p => p.featured);

  return (
    <div className="w-full space-y-16 sm:space-y-24 pb-16">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-8 sm:pt-14 pb-12 sm:pb-20 border-b border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-b from-blue-50/50 via-slate-50 to-white dark:from-slate-950 dark:via-slate-900/40 dark:to-slate-950">
        
        {/* Decorative background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-500/10 dark:bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[350px] h-[250px] bg-purple-500/10 dark:bg-purple-600/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs font-bold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>BSCS Final Year Project • Session 2023–2027</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1] max-w-4xl mx-auto">
            Compare Products.{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">
              Discover Better Deals.
            </span>{' '}
            Shop Smarter.
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            Find, compare, and analyze products across Amazon, eBay, Shopify, BestBuy, and Walmart in one intelligent platform with transparent Smart Scoring.
          </p>

          {/* Large Dual-Mode Search Box */}
          <div className="max-w-3xl mx-auto pt-2">
            <form
              onSubmit={handleHeroSearch}
              className="p-2 sm:p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl shadow-blue-500/10 flex flex-col sm:flex-row items-center gap-2"
            >
              <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search by product name, keywords, or paste product URL..."
                  className="w-full pl-12 pr-4 py-3 text-sm bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end">
                {/* Visual Image Search Trigger */}
                <button
                  type="button"
                  onClick={() => setIsImageModalOpen(true)}
                  title="Search by Product Image"
                  className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  <ImageIcon className="w-4 h-4" />
                </button>

                {/* Paste URL Trigger */}
                <button
                  type="button"
                  onClick={() => setIsUrlModalOpen(true)}
                  title="Paste E-commerce URL"
                  className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  <LinkIcon className="w-4 h-4" />
                </button>

                {/* Search / Compare CTA */}
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2 shrink-0"
                >
                  <span>Search Deals</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Quick search tags */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Popular:</span>
              {['iPhone 16 Pro', 'MacBook M4', 'Galaxy S25', 'Sony WH-1000XM5', 'Logitech MX Master 3S'].map((tag, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setSearchKeyword(tag);
                    setActivePage('products');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/40 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 border border-slate-200/80 dark:border-slate-800 transition-colors shadow-2xs"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Key Metric Stats */}
          <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 backdrop-blur-sm">
              <div className="text-2xl font-black text-blue-600 dark:text-blue-400">5+</div>
              <div className="text-xs font-semibold text-slate-600 dark:text-slate-400">Supported Platforms</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 backdrop-blur-sm">
              <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">$180 Avg</div>
              <div className="text-xs font-semibold text-slate-600 dark:text-slate-400">User Savings / Purchase</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 backdrop-blur-sm">
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">100%</div>
              <div className="text-xs font-semibold text-slate-600 dark:text-slate-400">Transparent Scoring</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 backdrop-blur-sm">
              <div className="text-2xl font-black text-purple-600 dark:text-purple-400">AI Powered</div>
              <div className="text-xs font-semibold text-slate-600 dark:text-slate-400">Shopping Assistant</div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. POPULAR CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Browse By Segment</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
              Popular Product Categories
            </h2>
          </div>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setActivePage('products');
            }}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {CATEGORIES.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div
                key={idx}
                onClick={() => {
                  setSelectedCategory(cat.name);
                  setActivePage('products');
                }}
                className="group p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/10 cursor-pointer transition-all flex flex-col items-center text-center"
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${cat.color} text-white flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-md`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {cat.name}
                </h3>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {cat.count}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. FEATURED DEALS & CROSS-PLATFORM PRICE PREVIEWS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              <TrendingDown className="w-3.5 h-3.5" />
              <span>Real-Time Arbitrage & Savings</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
              Top Deals Across Retailers
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Identified by our engine with price variations between Amazon, eBay, BestBuy, and Shopify
            </p>
          </div>

          <button
            onClick={() => setActivePage('products')}
            className="px-4 py-2 text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 rounded-xl transition-colors shrink-0"
          >
            Explore All 20+ Items
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map(prod => {
            const lowest = [...prod.platforms].sort((a, b) => a.price - b.price)[0];
            const highest = [...prod.platforms].sort((a, b) => b.price - a.price)[0];
            const maxSavings = highest.price - lowest.price;

            return (
              <div
                key={prod.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-blue-500/10 transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Card Header & Image */}
                  <div className="relative p-4 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800">
                    {/* Savings badge */}
                    {maxSavings > 0 && (
                      <span className="absolute top-4 left-4 z-10 px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-500 text-white shadow-md shadow-emerald-500/30 flex items-center gap-1">
                        <TrendingDown className="w-3 h-3" />
                        Save ${maxSavings.toFixed(0)}
                      </span>
                    )}

                    {/* Smart score pill */}
                    <span className="absolute top-4 right-4 z-10 px-2.5 py-1 rounded-full text-xs font-black bg-blue-600 text-white shadow-md shadow-blue-500/30">
                      Smart: {prod.smartScore.totalScore}/100
                    </span>

                    <img
                      src={prod.image}
                      alt={prod.title}
                      className="w-full h-48 object-cover rounded-2xl group-hover:scale-103 transition-transform duration-300"
                    />
                  </div>

                  {/* Body Info */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider text-[11px]">
                        {prod.brand} • {prod.category}
                      </span>
                      <div className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{prod.averageRating}</span>
                        <span className="text-slate-400 text-[10px]">({prod.totalReviews})</span>
                      </div>
                    </div>

                    <h3
                      onClick={() => {
                        setSelectedProductId(prod.id);
                        setActivePage('product-detail');
                      }}
                      className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 cursor-pointer line-clamp-2 transition-colors"
                    >
                      {prod.title}
                    </h3>

                    {/* Multi-Store Comparison Rows */}
                    <div className="space-y-1.5 pt-1">
                      <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                        Multi-Store Live Prices:
                      </div>
                      <div className="grid grid-cols-3 gap-1.5">
                        {prod.platforms.slice(0, 3).map((pl, idx) => (
                          <div
                            key={idx}
                            className={`p-2 rounded-xl border text-center text-xs flex flex-col justify-between ${
                              pl.price === prod.lowestPrice
                                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800'
                                : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
                            }`}
                          >
                            <span className="font-bold text-[10px] text-slate-700 dark:text-slate-300 truncate">
                              {pl.platform}
                            </span>
                            <span className="font-extrabold text-xs text-slate-900 dark:text-white mt-0.5">
                              ${pl.price.toFixed(0)}
                            </span>
                            <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-medium truncate">
                              {pl.price === prod.lowestPrice ? 'Lowest' : pl.shipping}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>

                {/* Footer Action buttons */}
                <div className="px-5 pb-5 pt-2 flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedProductId(prod.id);
                      setActivePage('product-detail');
                    }}
                    className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl transition-colors text-center"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => addToCompare(prod)}
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
                  >
                    <Scale className="w-3.5 h-3.5" />
                    <span>Compare</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      </section>

      {/* 4. HOW IT WORKS 4-STEP DIAGRAM */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl mb-10">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
              Intelligent Pipeline Architecture
            </span>
            <h2 className="text-2xl sm:text-4xl font-black mt-1">
              How the Smart Comparison System Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2">
              Our 4-stage pipeline standardizes heterogeneous product data across major stores into a normalized, objective comparison matrix.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center font-black text-sm">
                01
              </div>
              <h3 className="text-sm font-bold">Search or URL Ingestion</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Shoppers enter product keywords, paste direct retailer URLs, or upload a gadget photo for visual matching.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500 text-white flex items-center justify-center font-black text-sm">
                02
              </div>
              <h3 className="text-sm font-bold">Multi-Store Extraction</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Scans pricing, delivery fees, merchant ratings, review volume, and technical specifications across stores.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500 text-white flex items-center justify-center font-black text-sm">
                03
              </div>
              <h3 className="text-sm font-bold">Smart Score Engine</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Applies weighted algorithms (Price 35%, Rating 25%, Reviews 15%, Discount 10%, Shipping 10%, Stock 5%) to output a 0–100 score.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-black text-sm">
                04
              </div>
              <h3 className="text-sm font-bold">Decision & Purchase</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Users view side-by-side matrices, differential highlights, and buy at the lowest verified market price.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. AI CHATBOT CALLOUT BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-3xl bg-blue-50 dark:bg-slate-900 border border-blue-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 shrink-0">
              <Sparkles className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  Meet Your AI Shopping Assistant
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-600 text-white">
                  Gemini 3.8
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-xl">
                Need advice on programming laptops, sub-$500 phones, or comparing technical differences? Click the floating AI button anytime to chat with our catalog-grounded advisor.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              // Open chatbot by clicking or triggering state
              const botBtn = document.querySelector('[title="Ask Smart AI Shopping Assistant"]') as HTMLButtonElement;
              if (botBtn) botBtn.click();
            }}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/25 shrink-0 transition-all"
          >
            Launch AI Chatbot
          </button>
        </div>
      </section>

    </div>
  );
};
