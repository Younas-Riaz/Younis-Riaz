import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';
import {
  Scale,
  Sparkles,
  Check,
  X,
  Plus,
  Star,
  ExternalLink,
  Printer,
  TrendingDown,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const ComparePage: React.FC = () => {
  const {
    compareList,
    removeFromCompare,
    clearCompare,
    products,
    addToCompare,
    setSelectedProductId,
    setActivePage,
  } = useApp();

  const [highlightDifferences, setHighlightDifferences] = useState(false);
  const [selectorOpen, setSelectorOpen] = useState(false);

  if (compareList.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto shadow-md">
          <Scale className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">
          No Products Selected for Comparison
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          Add 2 or more products from the catalog to see side-by-side retailer prices, specifications, and Smart Score rankings.
        </p>
        <button
          onClick={() => setActivePage('products')}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/25 transition-all"
        >
          Browse Products to Compare
        </button>
      </div>
    );
  }

  // Find winner with highest smart score
  const winner = [...compareList].sort((a, b) => b.smartScore.totalScore - a.smartScore.totalScore)[0];
  const lowestOverallPrice = Math.min(...compareList.map(p => p.lowestPrice));
  const highestRating = Math.max(...compareList.map(p => p.averageRating));

  // Collect unique spec keys
  const specKeysSet = new Set<string>();
  compareList.forEach(p => p.specs.forEach(s => specKeysSet.add(s.name)));
  const allSpecKeys = Array.from(specKeysSet);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header & Comparison Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            <Scale className="w-3.5 h-3.5" />
            <span>Side-by-Side Evaluation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
            Product Comparison Matrix ({compareList.length}/4)
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Toggle Highlight Differences */}
          <button
            onClick={() => setHighlightDifferences(!highlightDifferences)}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl border transition-colors ${
              highlightDifferences
                ? 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border-blue-300 dark:border-blue-800'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
            }`}
          >
            {highlightDifferences ? '✓ Highlighting Differences' : 'Highlight Differences'}
          </button>

          {/* Add more button */}
          {compareList.length < 4 && (
            <div className="relative">
              <button
                onClick={() => setSelectorOpen(!selectorOpen)}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-md shadow-blue-500/20"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </button>

              {selectorOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-2 z-50 max-h-72 overflow-y-auto">
                  <div className="text-[11px] font-bold text-slate-400 px-3 py-1.5">
                    Select Product to Add:
                  </div>
                  {products
                    .filter(p => !compareList.some(cp => cp.id === p.id))
                    .map(p => (
                      <div
                        key={p.id}
                        onClick={() => {
                          addToCompare(p);
                          setSelectorOpen(false);
                        }}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer flex items-center gap-2.5 transition-colors"
                      >
                        <img src={p.image} alt={p.title} className="w-8 h-8 rounded-lg object-cover" />
                        <div className="flex-1 min-w-0 text-left">
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                            {p.title}
                          </p>
                          <span className="text-[10px] text-blue-600 font-extrabold">
                            ${p.lowestPrice}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* Clear button */}
          <button
            onClick={clearCompare}
            className="px-3 py-2 text-xs font-bold text-slate-500 hover:text-red-500 transition-colors"
          >
            Clear All
          </button>

          {/* Print summary button */}
          <button
            onClick={() => window.print()}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50"
            title="Print comparison summary"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* WINNER RECOMMENDATION CALLOUT */}
      {winner && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
              <Sparkles className="w-8 h-8 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-400 text-slate-900 uppercase">
                  Algorithm Pick
                </span>
                <h3 className="text-base sm:text-lg font-black">
                  Recommended Choice: {winner.title}
                </h3>
              </div>
              <p className="text-xs text-blue-100 mt-1 max-w-2xl leading-relaxed">
                {winner.smartScore.recommendationReason}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setSelectedProductId(winner.id);
              setActivePage('product-detail');
            }}
            className="px-5 py-2.5 bg-white text-blue-700 hover:bg-blue-50 text-xs font-extrabold rounded-xl shrink-0 shadow-md transition-all"
          >
            View Top Choice
          </button>
        </div>
      )}

      {/* COMPARISON SIDE-BY-SIDE TABLE */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            
            {/* 1. Header with Product Cards */}
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800">
                <th className="p-4 w-44 sm:w-56 font-bold text-slate-400 uppercase tracking-wider text-[11px] align-top bg-slate-50/60 dark:bg-slate-800/40">
                  Products Compared
                </th>
                {compareList.map(prod => (
                  <th key={prod.id} className="p-4 min-w-[240px] max-w-[280px] align-top">
                    <div className="relative space-y-2">
                      <button
                        onClick={() => removeFromCompare(prod.id)}
                        className="absolute top-0 right-0 p-1 rounded-full text-slate-400 hover:text-red-500 hover:bg-slate-100 transition-colors"
                        title="Remove"
                      >
                        <X className="w-4 h-4" />
                      </button>

                      <img
                        src={prod.image}
                        alt={prod.title}
                        className="w-full h-36 object-contain rounded-xl bg-slate-50 dark:bg-slate-800/40 p-2"
                      />

                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase">
                          {prod.brand}
                        </span>
                        {prod.id === winner?.id && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300">
                            ★ Winner
                          </span>
                        )}
                      </div>

                      <h4
                        onClick={() => {
                          setSelectedProductId(prod.id);
                          setActivePage('product-detail');
                        }}
                        className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2 hover:text-blue-600 cursor-pointer"
                      >
                        {prod.title}
                      </h4>

                      <div className="flex items-baseline gap-2 pt-1">
                        <span className="text-lg font-black text-slate-900 dark:text-white">
                          ${prod.lowestPrice}
                        </span>
                        {prod.lowestPrice === lowestOverallPrice && (
                          <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.5 rounded">
                            Lowest
                          </span>
                        )}
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* 2. Core Comparison Rows */}
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              
              {/* Row: Smart Score */}
              <tr className="bg-blue-50/30 dark:bg-blue-950/20 font-bold">
                <td className="p-4 font-bold text-slate-900 dark:text-white bg-slate-50/60 dark:bg-slate-800/40">
                  Smart Score (0–100)
                </td>
                {compareList.map(p => (
                  <td key={p.id} className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-black text-blue-600 dark:text-blue-400">
                        {p.smartScore.totalScore}
                      </span>
                      <div className="w-24 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full"
                          style={{ width: `${p.smartScore.totalScore}%` }}
                        />
                      </div>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Row: Customer Rating */}
              <tr>
                <td className="p-4 font-bold text-slate-700 dark:text-slate-300 bg-slate-50/60 dark:bg-slate-800/40">
                  Customer Rating
                </td>
                {compareList.map(p => (
                  <td key={p.id} className="p-4">
                    <div className="flex items-center gap-1 font-bold text-amber-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span>{p.averageRating}</span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        ({p.totalReviews.toLocaleString()} reviews)
                      </span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Row: Best Store & Pricing */}
              <tr>
                <td className="p-4 font-bold text-slate-700 dark:text-slate-300 bg-slate-50/60 dark:bg-slate-800/40">
                  Lowest Price Platform
                </td>
                {compareList.map(p => {
                  const lowest = [...p.platforms].sort((a, b) => a.price - b.price)[0];
                  return (
                    <td key={p.id} className="p-4">
                      <span className="font-extrabold text-slate-900 dark:text-white">
                        {lowest.platform}
                      </span>
                      <span className="text-[11px] text-slate-500 block">
                        ${lowest.price.toFixed(2)} ({lowest.shipping})
                      </span>
                    </td>
                  );
                })}
              </tr>

              {/* Row: Platforms Compared */}
              <tr>
                <td className="p-4 font-bold text-slate-700 dark:text-slate-300 bg-slate-50/60 dark:bg-slate-800/40">
                  Store Availability
                </td>
                {compareList.map(p => (
                  <td key={p.id} className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {p.platforms.map((pl, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                        >
                          {pl.platform}: ${pl.price.toFixed(0)}
                        </span>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>

              {/* 3. Specifications Rows */}
              {allSpecKeys.map(specName => {
                const values = compareList.map(p => {
                  const match = p.specs.find(s => s.name === specName);
                  return match ? match.value : 'N/A';
                });

                const isDifferent = new Set(values).size > 1;

                if (highlightDifferences && !isDifferent) {
                  return null; // hide identical specs in difference mode
                }

                return (
                  <tr
                    key={specName}
                    className={isDifferent && highlightDifferences ? 'bg-amber-50/40 dark:bg-amber-950/20' : ''}
                  >
                    <td className="p-4 font-bold text-slate-700 dark:text-slate-300 bg-slate-50/60 dark:bg-slate-800/40">
                      <div className="flex items-center gap-1.5">
                        <span>{specName}</span>
                        {isDifferent && (
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" title="Values differ" />
                        )}
                      </div>
                    </td>
                    {compareList.map((p, idx) => (
                      <td key={p.id} className="p-4 font-semibold text-slate-800 dark:text-slate-200">
                        {values[idx]}
                      </td>
                    ))}
                  </tr>
                );
              })}

            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
