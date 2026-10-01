import React from 'react';
import { useApp } from '../context/AppContext';
import { Scale, X, ArrowRight, Sparkles } from 'lucide-react';

export const CompareFloatingBar: React.FC = () => {
  const { compareList, removeFromCompare, clearCompare, setActivePage, activePage } = useApp();

  if (compareList.length === 0 || activePage === 'compare') {
    return null;
  }

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-11/12 max-w-3xl animate-in slide-in-from-bottom-6 duration-300">
      <div className="bg-slate-900/95 dark:bg-slate-900/95 backdrop-blur-xl border border-blue-500/30 text-white rounded-2xl shadow-2xl p-3 sm:p-4 flex items-center justify-between gap-4">
        
        {/* Left: Indicator & thumbnails */}
        <div className="flex items-center gap-3 overflow-x-auto py-1">
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-blue-400 shrink-0">
            <Scale className="w-4 h-4" />
            <span>Comparing ({compareList.length}/4):</span>
          </div>

          <div className="flex items-center gap-2">
            {compareList.map(prod => (
              <div
                key={prod.id}
                className="relative group flex items-center gap-2 bg-slate-800/90 border border-slate-700 rounded-xl px-2 py-1 shrink-0"
              >
                <img
                  src={prod.image}
                  alt={prod.title}
                  className="w-7 h-7 rounded-lg object-cover bg-white"
                />
                <span className="text-xs font-semibold max-w-[100px] truncate text-slate-200">
                  {prod.title}
                </span>
                <span className="text-[11px] font-bold text-blue-400">
                  ${prod.lowestPrice}
                </span>
                <button
                  onClick={() => removeFromCompare(prod.id)}
                  className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                  title="Remove from compare"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Action buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={clearCompare}
            className="hidden sm:inline-block px-3 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            Clear
          </button>

          <button
            onClick={() => {
              setActivePage('compare');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl shadow-lg shadow-blue-500/30 transition-all hover:scale-102"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Compare Now</span>
            <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
