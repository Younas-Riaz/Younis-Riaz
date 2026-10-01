import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Layers,
  Heart,
  Bell,
  Scale,
  Settings,
  TrendingDown,
  Trash2,
  ExternalLink,
  ShieldCheck,
  User,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const {
    currentUser,
    products,
    favorites,
    toggleFavorite,
    priceAlerts,
    removePriceAlert,
    compareList,
    notifications,
    markNotificationRead,
    setSelectedProductId,
    setActivePage,
    setIsCheckoutModalOpen,
    setCheckoutPlan,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'favorites' | 'tracking' | 'history' | 'notifications' | 'settings'>('overview');

  const favoriteProducts = products.filter(p => favorites.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Banner / User Welcome */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-900 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md text-white font-black text-2xl flex items-center justify-center shadow-md">
            {currentUser?.name ? currentUser.name.charAt(0) : 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black">
                {currentUser?.name || 'Shopper Dashboard'}
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-blue-400 text-slate-900">
                {currentUser?.plan || 'Basic'} Plan
              </span>
            </div>
            <p className="text-xs text-blue-100 mt-1">
              {currentUser?.email || 'user@smartcompare.com'} • Track prices, deals, and saved comparisons
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setCheckoutPlan({ name: 'Premium Pro', price: 19 });
            setIsCheckoutModalOpen(true);
          }}
          className="px-4 py-2.5 bg-white text-blue-700 hover:bg-blue-50 text-xs font-bold rounded-xl transition-all shadow-md shrink-0 flex items-center gap-1.5"
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Upgrade to Pro</span>
        </button>
      </div>

      {/* Main Grid: Sidebar + Active Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Dashboard Sidebar Tabs (3 cols) */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 space-y-1 shadow-sm">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-2.5 ${
              activeTab === 'overview'
                ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('favorites')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-between ${
              activeTab === 'favorites'
                ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Heart className="w-4 h-4 text-red-500" />
              <span>Saved Products</span>
            </div>
            <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800">
              {favorites.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('tracking')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-between ${
              activeTab === 'tracking'
                ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Bell className="w-4 h-4 text-amber-500" />
              <span>Price Tracking</span>
            </div>
            <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800">
              {priceAlerts.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-2.5 ${
              activeTab === 'history'
                ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Clock className="w-4 h-4 text-indigo-500" />
            <span>Search & Compare Logs</span>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-between ${
              activeTab === 'notifications'
                ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Bell className="w-4 h-4 text-blue-500" />
              <span>Notifications</span>
            </div>
            {notifications.filter(n => !n.isRead).length > 0 && (
              <span className="w-2 h-2 rounded-full bg-red-500" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-2.5 ${
              activeTab === 'settings'
                ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Settings className="w-4 h-4 text-slate-500" />
            <span>Account Settings</span>
          </button>
        </div>

        {/* Tab Content (9 cols) */}
        <div className="lg:col-span-9 space-y-6">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Stats KPI cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-[11px] font-bold text-slate-500 block">Saved Favorites</span>
                  <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                    {favorites.length}
                  </div>
                  <span className="text-[10px] text-emerald-600 font-bold">Active in list</span>
                </div>

                <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-[11px] font-bold text-slate-500 block">Price Alerts</span>
                  <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">
                    {priceAlerts.length}
                  </div>
                  <span className="text-[10px] text-slate-400">Monitoring 24/7</span>
                </div>

                <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-[11px] font-bold text-slate-500 block">Compared Items</span>
                  <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
                    {compareList.length}
                  </div>
                  <span className="text-[10px] text-slate-400">Side-by-side</span>
                </div>

                <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-[11px] font-bold text-slate-500 block">Estimated Savings</span>
                  <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                    $214.00
                  </div>
                  <span className="text-[10px] text-emerald-600 font-bold">From best prices</span>
                </div>
              </div>

              {/* Quick Actions & Recent alerts */}
              <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    Actively Monitored Price Alerts
                  </h3>
                  <button
                    onClick={() => setActiveTab('tracking')}
                    className="text-xs font-bold text-blue-600 hover:underline"
                  >
                    View All
                  </button>
                </div>

                <div className="space-y-2.5">
                  {priceAlerts.slice(0, 2).map(alert => (
                    <div
                      key={alert.id}
                      className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <img src={alert.productImage} alt={alert.productTitle} className="w-12 h-12 rounded-xl object-cover" />
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                            {alert.productTitle}
                          </h4>
                          <span className="text-[11px] text-slate-500">
                            Current: ${alert.currentPrice} • Alert Trigger: <strong className="text-blue-600">${alert.targetPrice}</strong>
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-extrabold px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        Monitoring
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: FAVORITES */}
          {activeTab === 'favorites' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Saved / Favorite Products ({favoriteProducts.length})
              </h3>

              {favoriteProducts.length === 0 ? (
                <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-500 text-xs">
                  No saved products yet. Browse catalog and click heart icons to bookmark items.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {favoriteProducts.map(prod => (
                    <div
                      key={prod.id}
                      className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-between gap-4 shadow-sm"
                    >
                      <img src={prod.image} alt={prod.title} className="w-16 h-16 rounded-xl object-cover bg-slate-100" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {prod.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm font-black text-blue-600 dark:text-blue-400">
                            ${prod.lowestPrice}
                          </span>
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                            Smart: {prod.smartScore.totalScore}/100
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1 shrink-0">
                        <button
                          onClick={() => {
                            setSelectedProductId(prod.id);
                            setActivePage('product-detail');
                          }}
                          className="px-2.5 py-1 text-[11px] font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => toggleFavorite(prod.id)}
                          className="px-2.5 py-1 text-[11px] font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PRICE TRACKING */}
          {activeTab === 'tracking' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    Active Price Drop Alerts
                  </h3>
                  <p className="text-xs text-slate-500">
                    The background engine queries Amazon, eBay, and BestBuy daily to detect price reductions.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {priceAlerts.map(alert => (
                  <div
                    key={alert.id}
                    className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <img src={alert.productImage} alt={alert.productTitle} className="w-14 h-14 rounded-xl object-cover" />
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                          {alert.productTitle}
                        </h4>
                        <div className="flex items-center gap-3 mt-1 text-xs">
                          <span className="text-slate-500">Current: <strong>${alert.currentPrice}</strong></span>
                          <span className="text-blue-600 font-bold">Target Alert: <strong>${alert.targetPrice}</strong></span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedProductId(alert.productId);
                          setActivePage('product-detail');
                        }}
                        className="px-3 py-1.5 text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200"
                      >
                        View Product
                      </button>
                      <button
                        onClick={() => removePriceAlert(alert.id)}
                        className="p-1.5 text-slate-400 hover:text-red-500"
                        title="Remove alert"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: HISTORY */}
          {activeTab === 'history' && (
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4 animate-in fade-in duration-200">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Recent Searches & Comparison History
              </h3>
              <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                <div className="py-3 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">iPhone 16 Pro vs Samsung Galaxy S25 Ultra</span>
                    <span className="text-[11px] text-slate-400">Side-by-side Smart Score matrix calculated</span>
                  </div>
                  <span className="text-[10px] text-slate-400">Today, 10:14 AM</span>
                </div>
                <div className="py-3 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">Query: "Programming Laptops under $1500"</span>
                    <span className="text-[11px] text-slate-400">Resulted in MacBook M4 recommendation</span>
                  </div>
                  <span className="text-[10px] text-slate-400">Yesterday</span>
                </div>
                <div className="py-3 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">URL Analyzed: amazon.com/dp/B09XS7JWHH</span>
                    <span className="text-[11px] text-slate-400">Sony WH-1000XM5 normalized</span>
                  </div>
                  <span className="text-[10px] text-slate-400">3 days ago</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4 animate-in fade-in duration-200">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Notifications Center
              </h3>
              <div className="space-y-2.5">
                {notifications.map(n => (
                  <div
                    key={n.id}
                    onClick={() => markNotificationRead(n.id)}
                    className={`p-3.5 rounded-2xl border text-xs cursor-pointer transition-colors ${
                      !n.isRead
                        ? 'bg-blue-50/60 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-slate-900 dark:text-white">{n.title}</span>
                      <span className="text-[10px] text-slate-400">{n.createdAt}</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 mt-1">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-5 animate-in fade-in duration-200">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Account & Preferences
              </h3>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-500 font-bold mb-1">User Name</label>
                  <input
                    type="text"
                    disabled
                    value={currentUser?.name || 'Shopper'}
                    className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Email</label>
                  <input
                    type="email"
                    disabled
                    value={currentUser?.email || 'user@smartcompare.com'}
                    className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Active Plan</label>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900">
                    <span className="font-extrabold text-blue-700 dark:text-blue-300 uppercase">
                      {currentUser?.plan} Tier
                    </span>
                    <button
                      onClick={() => {
                        setCheckoutPlan({ name: 'Premium Pro', price: 19 });
                        setIsCheckoutModalOpen(true);
                      }}
                      className="px-3 py-1 bg-blue-600 text-white rounded-lg font-bold"
                    >
                      Change Plan
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
