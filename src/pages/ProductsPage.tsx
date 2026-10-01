import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';
import {
  Search,
  SlidersHorizontal,
  Scale,
  Heart,
  Star,
  TrendingDown,
  LayoutGrid,
  List,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check
} from 'lucide-react';

export const ProductsPage: React.FC = () => {
  const {
    products,
    setSelectedProductId,
    setActivePage,
    addToCompare,
    isInCompare,
    toggleFavorite,
    isFavorite,
    searchKeyword,
    setSearchKeyword,
    selectedCategory,
    setSelectedCategory,
  } = useApp();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('All');
  const [minRating, setMinRating] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(3000);
  const [sortOption, setSortOption] = useState<string>('score_desc');

  // Extract available brands
  const brands = useMemo(() => {
    const set = new Set<string>();
    products.forEach(p => set.add(p.brand));
    return ['All', ...Array.from(set)];
  }, [products]);

  // Extract available categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach(p => set.add(p.category));
    return ['All', ...Array.from(set)];
  }, [products]);

  // Filtered & Sorted products
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Search keyword
    if (searchKeyword.trim()) {
      const q = searchKeyword.toLowerCase().trim();
      list = list.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    // Category
    if (selectedCategory !== 'All') {
      list = list.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    // Brand
    if (selectedBrand !== 'All') {
      list = list.filter(p => p.brand.toLowerCase() === selectedBrand.toLowerCase());
    }

    // Platform
    if (selectedPlatform !== 'All') {
      list = list.filter(p => p.platforms.some(pl => pl.platform.toLowerCase() === selectedPlatform.toLowerCase()));
    }

    // Min Rating
    if (minRating > 0) {
      list = list.filter(p => p.averageRating >= minRating);
    }

    // Max Price
    list = list.filter(p => p.lowestPrice <= maxPrice);

    // Sorting
    if (sortOption === 'price_asc') {
      list.sort((a, b) => a.lowestPrice - b.lowestPrice);
    } else if (sortOption === 'price_desc') {
      list.sort((a, b) => b.lowestPrice - a.lowestPrice);
    } else if (sortOption === 'rating_desc') {
      list.sort((a, b) => b.averageRating - a.averageRating);
    } else if (sortOption === 'reviews_desc') {
      list.sort((a, b) => b.totalReviews - a.totalReviews);
    } else {
      // Best Smart Score
      list.sort((a, b) => b.smartScore.totalScore - a.smartScore.totalScore);
    }

    return list;
  }, [products, searchKeyword, selectedCategory, selectedBrand, selectedPlatform, minRating, maxPrice, sortOption]);

  const handleResetFilters = () => {
    setSearchKeyword('');
    setSelectedCategory('All');
    setSelectedBrand('All');
    setSelectedPlatform('All');
    setMinRating(0);
    setMaxPrice(3000);
    setSortOption('score_desc');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Header & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Product Search & Comparison Catalog
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Displaying {filteredProducts.length} verified products from Amazon, eBay, Shopify & BestBuy
          </p>
        </div>

        {/* Search input in catalog */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchKeyword}
            onChange={e => setSearchKeyword(e.target.value)}
            placeholder="Filter by keyword or brand..."
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 shadow-2xs"
          />
        </div>
      </div>

      {/* Main Layout: Filters Sidebar + Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Filter Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2 font-bold text-xs text-slate-900 dark:text-white">
                <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                <span>Filters & Criteria</span>
              </div>
              <button
                onClick={handleResetFilters}
                className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-semibold"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                Category
              </label>
              <div className="space-y-1">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center justify-between ${
                      selectedCategory === cat
                        ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>{cat}</span>
                    {selectedCategory === cat && <Check className="w-3.5 h-3.5 text-blue-600" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Max Slider */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                <span className="text-slate-700 dark:text-slate-300">Max Price:</span>
                <span className="text-blue-600 dark:text-blue-400">${maxPrice}</span>
              </div>
              <input
                type="range"
                min="50"
                max="3000"
                step="50"
                value={maxPrice}
                onChange={e => setMaxPrice(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>$50</span>
                <span>$3,000</span>
              </div>
            </div>

            {/* Brand Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                Brand
              </label>
              <div className="flex flex-wrap gap-1.5">
                {brands.map(b => (
                  <button
                    key={b}
                    onClick={() => setSelectedBrand(b)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-colors ${
                      selectedBrand === b
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* Platform Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                E-Commerce Store
              </label>
              <div className="space-y-1">
                {['All', 'Amazon', 'eBay', 'Shopify', 'BestBuy'].map(store => (
                  <button
                    key={store}
                    onClick={() => setSelectedPlatform(store)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center justify-between ${
                      selectedPlatform === store
                        ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>{store}</span>
                    {selectedPlatform === store && <Check className="w-3.5 h-3.5 text-blue-600" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Min Rating */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                Minimum Customer Rating
              </label>
              <div className="grid grid-cols-4 gap-1 text-center">
                {[0, 4.0, 4.5, 4.8].map(r => (
                  <button
                    key={r}
                    onClick={() => setMinRating(r)}
                    className={`py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                      minRating === r
                        ? 'bg-amber-500 text-white border-amber-500'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {r === 0 ? 'All' : `${r}★`}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Products Results Area */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Controls Bar: Sort & View switcher */}
          <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-semibold">Sort By:</span>
              <select
                value={sortOption}
                onChange={e => setSortOption(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500"
              >
                <option value="score_desc">🏆 Highest Smart Score</option>
                <option value="price_asc">💵 Price: Low to High</option>
                <option value="price_desc">💎 Price: High to Low</option>
                <option value="rating_desc">⭐ Highest Customer Rating</option>
                <option value="reviews_desc">💬 Most Reviews</option>
              </select>
            </div>

            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600' : 'text-slate-500'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600' : 'text-slate-500'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Results Empty State */}
          {filteredProducts.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                No matching products found
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try adjusting your price threshold, clearing filters, or searching with another term.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
              >
                Reset All Filters
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            /* Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProducts.map(prod => {
                const inComp = isInCompare(prod.id);
                const fav = isFavorite(prod.id);
                const lowest = [...prod.platforms].sort((a, b) => a.price - b.price)[0];
                const highest = [...prod.platforms].sort((a, b) => b.price - a.price)[0];
                const savings = highest.price - lowest.price;

                return (
                  <div
                    key={prod.id}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden hover:shadow-xl transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {/* Image Header */}
                      <div className="relative p-4 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800">
                        {/* Smart Score Pill */}
                        <span className="absolute top-4 left-4 z-10 px-2.5 py-1 rounded-full text-xs font-black bg-blue-600 text-white shadow-md">
                          Smart: {prod.smartScore.totalScore}/100
                        </span>

                        {/* Favorite button */}
                        <button
                          onClick={() => toggleFavorite(prod.id)}
                          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 dark:bg-slate-800/90 text-slate-500 hover:text-red-500 shadow-sm transition-colors"
                          title="Save to favorites"
                        >
                          <Heart className={`w-4 h-4 ${fav ? 'fill-red-500 text-red-500' : ''}`} />
                        </button>

                        <img
                          src={prod.image}
                          alt={prod.title}
                          className="w-full h-44 object-cover rounded-2xl group-hover:scale-103 transition-transform duration-300"
                        />
                      </div>

                      {/* Info */}
                      <div className="p-4 space-y-2.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                            {prod.brand} • {prod.category}
                          </span>
                          <div className="flex items-center gap-1 text-amber-500 font-bold">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            <span>{prod.averageRating}</span>
                          </div>
                        </div>

                        <h3
                          onClick={() => {
                            setSelectedProductId(prod.id);
                            setActivePage('product-detail');
                          }}
                          className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2 hover:text-blue-600 cursor-pointer transition-colors"
                        >
                          {prod.title}
                        </h3>

                        {/* Price summary */}
                        <div className="pt-1 flex items-baseline justify-between">
                          <div>
                            <span className="text-base font-black text-slate-900 dark:text-white">
                              ${prod.lowestPrice}
                            </span>
                            {savings > 0 && (
                              <span className="text-[11px] text-slate-400 line-through ml-2">
                                ${highest.price}
                              </span>
                            )}
                          </div>
                          {savings > 0 && (
                            <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                              Save ${savings.toFixed(0)}
                            </span>
                          )}
                        </div>

                        {/* Store presence chips */}
                        <div className="flex flex-wrap gap-1 pt-1">
                          {prod.platforms.map((pl, i) => (
                            <span
                              key={i}
                              className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                                pl.price === prod.lowestPrice
                                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                                  : 'bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                              }`}
                            >
                              {pl.platform}: ${pl.price.toFixed(0)}
                            </span>
                          ))}
                        </div>

                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="p-4 pt-1 flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedProductId(prod.id);
                          setActivePage('product-detail');
                        }}
                        className="flex-1 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl transition-colors text-center"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => addToCompare(prod)}
                        className={`px-3 py-2 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 ${
                          inComp
                            ? 'bg-emerald-600 text-white'
                            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20'
                        }`}
                      >
                        <Scale className="w-3.5 h-3.5" />
                        <span>{inComp ? 'Compared' : 'Compare'}</span>
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          ) : (
            /* List View */
            <div className="space-y-3">
              {filteredProducts.map(prod => {
                const inComp = isInCompare(prod.id);
                const fav = isFavorite(prod.id);
                const lowest = [...prod.platforms].sort((a, b) => a.price - b.price)[0];
                const highest = [...prod.platforms].sort((a, b) => b.price - a.price)[0];
                const savings = highest.price - lowest.price;

                return (
                  <div
                    key={prod.id}
                    className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl hover:shadow-lg transition-all flex flex-col sm:flex-row items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <img
                        src={prod.image}
                        alt={prod.title}
                        className="w-20 h-20 rounded-2xl object-cover bg-slate-100 dark:bg-slate-800 shrink-0"
                      />
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase">
                            {prod.brand} • {prod.category}
                          </span>
                          <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                            Smart Score: {prod.smartScore.totalScore}/100
                          </span>
                        </div>
                        <h3
                          onClick={() => {
                            setSelectedProductId(prod.id);
                            setActivePage('product-detail');
                          }}
                          className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white cursor-pointer hover:text-blue-600 truncate"
                        >
                          {prod.title}
                        </h3>
                        <p className="text-[11px] text-slate-500 line-clamp-1">
                          {prod.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0 w-full sm:w-auto justify-between sm:justify-end">
                      <div className="text-right">
                        <div className="text-base font-black text-slate-900 dark:text-white">
                          ${prod.lowestPrice}
                        </div>
                        {savings > 0 && (
                          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                            Saves ${savings.toFixed(0)}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleFavorite(prod.id)}
                          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-red-500"
                        >
                          <Heart className={`w-4 h-4 ${fav ? 'fill-red-500 text-red-500' : ''}`} />
                        </button>
                        <button
                          onClick={() => addToCompare(prod)}
                          className={`px-3 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 ${
                            inComp ? 'bg-emerald-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
                          }`}
                        >
                          <Scale className="w-3.5 h-3.5" />
                          <span>{inComp ? 'Compared' : 'Compare'}</span>
                        </button>
                        <button
                          onClick={() => {
                            setSelectedProductId(prod.id);
                            setActivePage('product-detail');
                          }}
                          className="px-3 py-2 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200"
                        >
                          Details
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
