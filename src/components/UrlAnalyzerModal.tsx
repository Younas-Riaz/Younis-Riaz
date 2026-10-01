import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';
import { X, Sparkles, Link as LinkIcon, CheckCircle2, AlertCircle, ArrowRight, Scale, Loader2 } from 'lucide-react';

export const UrlAnalyzerModal: React.FC = () => {
  const { isUrlModalOpen, setIsUrlModalOpen, setSelectedProductId, setActivePage, addToCompare, setProducts } = useApp();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ detectedPlatform: string; product: Product } | null>(null);

  if (!isUrlModalOpen) return null;

  const handleAnalyze = async (sampleUrl?: string) => {
    const targetUrl = (sampleUrl || url).trim();
    if (!targetUrl) {
      setError('Please provide a valid product URL.');
      return;
    }
    setError('');
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/products/url-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to process URL');
      }

      setResult({
        detectedPlatform: data.detectedPlatform,
        product: data.product,
      });

      // Update local product catalog
      setProducts(prev => {
        if (!prev.some(p => p.id === data.product.id)) {
          return [data.product, ...prev];
        }
        return prev;
      });
    } catch (err: any) {
      setError(err.message || 'Error communicating with extraction engine.');
    } finally {
      setLoading(false);
    }
  };

  const sampleAmazon = 'https://www.amazon.com/dp/B0DGH7P89X/apple-iphone-16-pro';
  const sampleEbay = 'https://www.ebay.com/itm/386123456789/samsung-galaxy-s25-ultra';
  const sampleBestBuy = 'https://www.bestbuy.com/site/apple-macbook-pro-14-m4';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800/50 dark:to-indigo-950/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Live Product URL Analyzer
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Paste any Amazon, eBay, Shopify, or BestBuy link to extract normalized specs & cross-compare
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsUrlModalOpen(false);
              setResult(null);
              setError('');
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Enter E-Commerce Web Address:
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="url"
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  placeholder="https://www.amazon.com/dp/... or https://www.ebay.com/itm/..."
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <button
                onClick={() => handleAnalyze()}
                disabled={loading}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-md shadow-blue-500/25"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Parsing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Analyze URL</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Samples */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Quick Test Links:</span>
            <button
              onClick={() => {
                setUrl(sampleAmazon);
                handleAnalyze(sampleAmazon);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-semibold"
            >
              Amazon iPhone 16
            </button>
            <button
              onClick={() => {
                setUrl(sampleEbay);
                handleAnalyze(sampleEbay);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-semibold"
            >
              eBay Galaxy S25
            </button>
            <button
              onClick={() => {
                setUrl(sampleBestBuy);
                handleAnalyze(sampleBestBuy);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-semibold"
            >
              Best Buy MacBook M4
            </button>
          </div>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Result Card */}
          {result && (
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Successfully Normalized via {result.detectedPlatform} Parser
                </span>
                <span className="text-xs font-extrabold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                  Smart Score: {result.product.smartScore.totalScore}/100
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <img
                  src={result.product.image}
                  alt={result.product.title}
                  className="w-24 h-24 rounded-xl object-cover bg-white shrink-0 border border-slate-200 dark:border-slate-700"
                />
                <div className="flex-1 text-left">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {result.product.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {result.product.description}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-base font-extrabold text-blue-600 dark:text-blue-400">
                      Lowest: ${result.product.lowestPrice}
                    </span>
                    <span className="text-xs text-slate-400 line-through">
                      MSRP: ${result.product.highestPrice}
                    </span>
                  </div>
                </div>
              </div>

              {/* Multi-platform quote table */}
              <div>
                <h5 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Comparative Retailer Pricing Detected:
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {result.product.platforms.map((pl, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {pl.platform}
                        </span>
                        {pl.badge && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300">
                            {pl.badge}
                          </span>
                        )}
                      </div>
                      <div className="mt-1 font-extrabold text-sm text-blue-600 dark:text-blue-400">
                        ${pl.price.toFixed(2)}
                      </div>
                      <span className="text-[10px] text-slate-400 mt-0.5">
                        {pl.shipping}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => {
                    addToCompare(result.product);
                    setIsUrlModalOpen(false);
                    setActivePage('compare');
                  }}
                  className="px-4 py-2 bg-blue-50 dark:bg-blue-900/50 hover:bg-blue-100 text-blue-600 dark:text-blue-300 rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <Scale className="w-3.5 h-3.5" />
                  <span>Add to Comparison</span>
                </button>
                <button
                  onClick={() => {
                    setSelectedProductId(result.product.id);
                    setIsUrlModalOpen(false);
                    setActivePage('product-detail');
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <span>View Product Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
