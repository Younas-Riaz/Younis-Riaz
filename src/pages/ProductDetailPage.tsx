import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ArrowLeft,
  Scale,
  Heart,
  Bell,
  Star,
  ExternalLink,
  ShieldCheck,
  Check,
  TrendingDown,
  Sparkles,
  Truck,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock,
  Layers
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const {
    products,
    selectedProductId,
    setActivePage,
    addToCompare,
    isInCompare,
    toggleFavorite,
    isFavorite,
    addPriceAlert,
  } = useApp();

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [alertTargetPrice, setAlertTargetPrice] = useState<number>(0);
  const [isAlertSet, setIsAlertSet] = useState(false);

  const product = products.find(p => p.id === selectedProductId) || products[0];

  if (!product) return null;

  const images = product.additionalImages && product.additionalImages.length > 0
    ? product.additionalImages
    : [product.image];

  const inComp = isInCompare(product.id);
  const fav = isFavorite(product.id);

  const lowestPlatform = [...product.platforms].sort((a, b) => a.price - b.price)[0];
  const highestPlatform = [...product.platforms].sort((a, b) => b.price - a.price)[0];
  const maxSavings = highestPlatform.price - lowestPlatform.price;

  const handleSetAlert = (e: React.FormEvent) => {
    e.preventDefault();
    const target = alertTargetPrice > 0 ? alertTargetPrice : Math.round(product.lowestPrice * 0.95);
    addPriceAlert(product.id, target);
    setIsAlertSet(true);
    setTimeout(() => setIsAlertSet(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Back button */}
      <button
        onClick={() => setActivePage('products')}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Product Search</span>
      </button>

      {/* Main Product Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Image Gallery (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="relative p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
            {/* Badges */}
            <div className="absolute top-4 left-4 z-10 flex gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-blue-600 text-white shadow-md">
                Smart Score: {product.smartScore.totalScore}/100
              </span>
              {maxSavings > 0 && (
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500 text-white flex items-center gap-1 shadow-md">
                  <TrendingDown className="w-3 h-3" />
                  Save ${maxSavings.toFixed(0)}
                </span>
              )}
            </div>

            <img
              src={images[activeImageIdx] || product.image}
              alt={product.title}
              className="w-full h-80 sm:h-96 object-contain rounded-2xl"
            />
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImageIdx(i)}
                  className={`w-16 h-16 rounded-xl border p-1 bg-white dark:bg-slate-900 transition-all ${
                    activeImageIdx === i
                      ? 'border-blue-500 ring-2 ring-blue-500/20'
                      : 'border-slate-200 dark:border-slate-800 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumb" className="w-full h-full object-cover rounded-lg" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Pricing & Core Actions (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                {product.brand}
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-500">{product.category}</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">
              {product.title}
            </h1>

            {/* Rating summary */}
            <div className="flex items-center gap-4 text-xs pt-1">
              <div className="flex items-center gap-1 text-amber-500 font-bold">
                <Star className="w-4 h-4 fill-current" />
                <span>{product.averageRating}</span>
              </div>
              <span className="text-slate-400">
                ({product.totalReviews.toLocaleString()} verified customer reviews)
              </span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                In Stock across {product.platforms.filter(p => p.inStock).length} stores
              </span>
            </div>
          </div>

          {/* Pricing Highlight Card */}
          <div className="p-5 bg-gradient-to-r from-blue-50/80 via-indigo-50/50 to-slate-50 dark:from-slate-900 dark:via-indigo-950/30 dark:to-slate-900 rounded-3xl border border-blue-200/80 dark:border-slate-800 space-y-3">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Lowest Verified Price:
                </span>
                <span className="text-3xl font-black text-blue-600 dark:text-blue-400">
                  ${product.lowestPrice.toFixed(2)}
                </span>
                <span className="text-xs text-slate-400 ml-2 line-through">
                  ${product.highestPrice.toFixed(2)} MSRP
                </span>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Best Value at:
                </span>
                <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                  {lowestPlatform.platform} ({lowestPlatform.storeName})
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-blue-200/60 dark:border-slate-800/80 pt-2.5">
              {product.description}
            </p>
          </div>

          {/* Core Action CTAs */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => addToCompare(product)}
              className={`flex-1 py-3 px-5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-md ${
                inComp
                  ? 'bg-emerald-600 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25'
              }`}
            >
              <Scale className="w-4 h-4" />
              <span>{inComp ? 'Added to Comparison' : 'Add to Side-by-Side Compare'}</span>
            </button>

            <button
              onClick={() => toggleFavorite(product.id)}
              className={`p-3 rounded-xl border transition-colors flex items-center justify-center ${
                fav
                  ? 'bg-red-50 dark:bg-red-950/40 border-red-300 text-red-500'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
              }`}
              title="Save to favorites"
            >
              <Heart className={`w-4 h-4 ${fav ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Set Price Drop Alert Card */}
          <form
            onSubmit={handleSetAlert}
            className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2"
          >
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
              <Bell className="w-4 h-4 text-blue-600" />
              <span>Set Instant Price Drop Alert</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Notify me automatically when price falls below target threshold:
            </p>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold">$</span>
                <input
                  type="number"
                  placeholder={String(Math.round(product.lowestPrice * 0.95))}
                  value={alertTargetPrice || ''}
                  onChange={e => setAlertTargetPrice(Number(e.target.value))}
                  className="w-full pl-7 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 font-bold"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-slate-900 dark:bg-slate-700 hover:bg-blue-600 text-white text-xs font-bold rounded-xl transition-colors shrink-0"
              >
                Track Price
              </button>
            </div>
            {isAlertSet && (
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 animate-in fade-in">
                <Check className="w-3.5 h-3.5" />
                Alert active! Added to your dashboard price tracker.
              </span>
            )}
          </form>

        </div>
      </div>

      {/* 2. MULTI-PLATFORM LIVE PRICE COMPARISON TABLE */}
      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            <Scale className="w-3.5 h-3.5" />
            <span>Store Matrix</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5">
            Compare Retailer Prices & Shipping
          </h2>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold">
                <tr>
                  <th className="py-3.5 px-4">Retailer Store</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Discount</th>
                  <th className="py-3.5 px-4">Shipping</th>
                  <th className="py-3.5 px-4">Availability</th>
                  <th className="py-3.5 px-4">Store Rating</th>
                  <th className="py-3.5 px-4 text-right">Direct Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {product.platforms.map((pl, idx) => (
                  <tr
                    key={idx}
                    className={`hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors ${
                      pl.price === product.lowestPrice
                        ? 'bg-emerald-50/40 dark:bg-emerald-950/20'
                        : ''
                    }`}
                  >
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                      <div className="flex items-center gap-2">
                        <span>{pl.platform}</span>
                        {pl.badge && (
                          <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300">
                            {pl.badge}
                          </span>
                        )}
                        {pl.price === product.lowestPrice && (
                          <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300">
                            Best Deal
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 font-normal block mt-0.5">
                        {pl.storeName}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-sm font-black text-slate-900 dark:text-white">
                        ${pl.price.toFixed(2)}
                      </span>
                      {pl.originalPrice > pl.price && (
                        <span className="text-[10px] text-slate-400 line-through ml-1.5">
                          ${pl.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-emerald-600 dark:text-emerald-400">
                      {pl.discountPercent > 0 ? `${pl.discountPercent}% OFF` : 'Standard'}
                    </td>

                    <td className="py-3.5 px-4 font-medium text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-blue-500" />
                        <span>{pl.shipping}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-bold">
                      {pl.inStock ? (
                        <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> In Stock
                        </span>
                      ) : (
                        <span className="text-red-500 flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5" /> Out of Stock
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                      <div className="flex items-center gap-1 font-bold text-amber-500">
                        <Star className="w-3 h-3 fill-current" />
                        <span>{pl.rating}</span>
                        <span className="text-[10px] text-slate-400">({pl.reviewsCount})</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <a
                        href={pl.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/40 dark:hover:bg-blue-900/70 text-blue-600 dark:text-blue-300 rounded-lg font-bold text-xs transition-colors"
                      >
                        <span>Visit Store</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 3. TRANSPARENT SMART SCORE BREAKDOWN WIDGET */}
      <div className="p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Algorithm Transparency</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5">
            Smart Recommendation Engine Breakdown
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Calculated dynamically based on real-time market factors rather than hardcoded labels.
          </p>
        </div>

        {/* Score header & Reason text */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex flex-col items-center justify-center shrink-0 shadow-lg shadow-blue-500/25">
            <span className="text-3xl font-black leading-none">{product.smartScore.totalScore}</span>
            <span className="text-[10px] font-bold text-blue-200 mt-1 uppercase">/ 100 Smart</span>
          </div>

          <div className="space-y-1.5 text-left">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Recommendation Justification
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              "{product.smartScore.recommendationReason}"
            </p>
          </div>
        </div>

        {/* 6 Factor Progress Bars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          
          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl space-y-1.5">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-700 dark:text-slate-300">Price Competitiveness</span>
              <span className="text-blue-600">{product.smartScore.priceScore} / 35</span>
            </div>
            <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full"
                style={{ width: `${(product.smartScore.priceScore / 35) * 100}%` }}
              />
            </div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl space-y-1.5">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-700 dark:text-slate-300">Customer Rating</span>
              <span className="text-blue-600">{product.smartScore.ratingScore} / 25</span>
            </div>
            <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full"
                style={{ width: `${(product.smartScore.ratingScore / 25) * 100}%` }}
              />
            </div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl space-y-1.5">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-700 dark:text-slate-300">Review Volume Confidence</span>
              <span className="text-blue-600">{product.smartScore.reviewVolumeScore} / 15</span>
            </div>
            <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full"
                style={{ width: `${(product.smartScore.reviewVolumeScore / 15) * 100}%` }}
              />
            </div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl space-y-1.5">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-700 dark:text-slate-300">Promotional Discount</span>
              <span className="text-blue-600">{product.smartScore.discountScore} / 10</span>
            </div>
            <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full"
                style={{ width: `${(product.smartScore.discountScore / 10) * 100}%` }}
              />
            </div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl space-y-1.5">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-700 dark:text-slate-300">Free Shipping Availability</span>
              <span className="text-blue-600">{product.smartScore.shippingScore} / 10</span>
            </div>
            <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full"
                style={{ width: `${(product.smartScore.shippingScore / 10) * 100}%` }}
              />
            </div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl space-y-1.5">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-700 dark:text-slate-300">Merchant Stock Trust</span>
              <span className="text-blue-600">{product.smartScore.availabilityScore} / 5</span>
            </div>
            <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full"
                style={{ width: `${(product.smartScore.availabilityScore / 5) * 100}%` }}
              />
            </div>
          </div>

        </div>

        {/* Pros & Cons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900">
            <h5 className="text-xs font-extrabold text-emerald-800 dark:text-emerald-300 mb-2 flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600" /> Key Strengths (Pros)
            </h5>
            <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
              {product.smartScore.pros.map((pro, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-emerald-500 font-bold">•</span>
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900">
            <h5 className="text-xs font-extrabold text-amber-800 dark:text-amber-300 mb-2 flex items-center gap-1.5">
              <XCircle className="w-4 h-4 text-amber-600" /> Considerations (Cons)
            </h5>
            <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
              {product.smartScore.cons.map((con, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-amber-500 font-bold">•</span>
                  <span>{con}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>

      {/* 4. HISTORICAL PRICE TRACKING CHART */}
      <div className="p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              <Clock className="w-3.5 h-3.5" />
              <span>Trend Analytics</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5">
              6-Month Price Trend Across Platforms
            </h2>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
              <span className="w-3 h-3 rounded-full bg-blue-600 inline-block"></span> Amazon
            </span>
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span> eBay
            </span>
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
              <span className="w-3 h-3 rounded-full bg-indigo-500 inline-block"></span> Shopify/BestBuy
            </span>
          </div>
        </div>

        {/* Interactive SVG Line Visualizer */}
        <div className="h-64 w-full bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-4 flex items-end justify-between relative border border-slate-200/80 dark:border-slate-800">
          {product.priceHistory.map((pt, idx) => {
            const minP = Math.min(...product.priceHistory.map(p => p.ebay));
            const maxP = Math.max(...product.priceHistory.map(p => p.amazon));
            const range = maxP - minP || 1;

            const amazonHeight = Math.max(20, Math.round(((pt.amazon - minP) / range) * 140 + 40));
            const ebayHeight = Math.max(20, Math.round(((pt.ebay - minP) / range) * 140 + 30));

            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="w-full flex items-end justify-center gap-1.5 h-44">
                  {/* Amazon bar */}
                  <div
                    style={{ height: `${amazonHeight}px` }}
                    className="w-3 sm:w-4 bg-blue-600/80 group-hover:bg-blue-600 rounded-t-md transition-all relative"
                    title={`Amazon: $${pt.amazon}`}
                  />
                  {/* eBay bar */}
                  <div
                    style={{ height: `${ebayHeight}px` }}
                    className="w-3 sm:w-4 bg-emerald-500/80 group-hover:bg-emerald-500 rounded-t-md transition-all relative"
                    title={`eBay: $${pt.ebay}`}
                  />
                </div>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                  {pt.date}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. HARDWARE SPECIFICATIONS MATRIX */}
      <div className="p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5" />
            <span>Technical Datasheet</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5">
            Full Product Specifications
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {product.specs.map((spec, i) => (
            <div
              key={i}
              className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/80 dark:border-slate-800 flex justify-between gap-4"
            >
              <span className="font-bold text-slate-500 dark:text-slate-400 shrink-0">
                {spec.name}
              </span>
              <span className="font-bold text-slate-900 dark:text-white text-right">
                {spec.value}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
