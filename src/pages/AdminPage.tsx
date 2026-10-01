import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Product, ContactMessage, Transaction } from '../types';
import {
  Shield,
  Package,
  Users,
  MessageSquare,
  CreditCard,
  Plus,
  Trash2,
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
  TrendingUp,
  X
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const { products, setProducts, currentUser } = useApp();
  const [activeAdminTab, setActiveAdminTab] = useState<'products' | 'messages' | 'transactions' | 'chatlogs'>('products');
  const [adminStats, setAdminStats] = useState({
    totalProducts: products.length,
    totalUsers: 142,
    totalComparisons: 2840,
    totalRevenue: 380.00,
    pendingInquiries: 1,
    activeChatSessions: 18,
  });

  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [chatLogs, setChatLogs] = useState<Array<{ id: string; query: string; response: string; timestamp: string }>>([]);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);

  // New product form state
  const [newTitle, setNewTitle] = useState('');
  const [newBrand, setNewBrand] = useState('Apple');
  const [newCategory, setNewCategory] = useState('Smartphones');
  const [newPrice, setNewPrice] = useState(499);
  const [newImage, setNewImage] = useState('https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80');

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(res => res.json())
      .then(data => setAdminStats(prev => ({ ...prev, ...data })))
      .catch(() => {});

    fetch('/api/admin/messages')
      .then(res => res.json())
      .then(data => setMessages(data.messages || []))
      .catch(() => {});

    fetch('/api/admin/transactions')
      .then(res => res.json())
      .then(data => setTransactions(data.transactions || []))
      .catch(() => {});

    fetch('/api/admin/chat-logs')
      .then(res => res.json())
      .then(data => setChatLogs(data.logs || []))
      .catch(() => {});
  }, []);

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product from the database?')) return;
    try {
      await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const newProdData = {
      title: newTitle,
      brand: newBrand,
      category: newCategory,
      description: `Premium ${newBrand} ${newCategory} normalized for multi-store price comparisons.`,
      image: newImage,
      lowestPrice: Number(newPrice),
      highestPrice: Number(newPrice) + 50,
      averageRating: 4.7,
      totalReviews: 240,
      tags: [newBrand.toLowerCase(), newCategory.toLowerCase(), 'admin-added'],
      platforms: [
        {
          platform: 'Amazon',
          storeName: 'Amazon Merchant',
          price: Number(newPrice),
          originalPrice: Number(newPrice) + 40,
          discountPercent: 8,
          url: 'https://www.amazon.com',
          inStock: true,
          shipping: 'Free Shipping',
          shippingCost: 0,
          rating: 4.7,
          reviewsCount: 180,
          lastUpdated: 'Just now',
        },
        {
          platform: 'eBay',
          storeName: 'eBay Direct Partner',
          price: Number(newPrice) + 15,
          originalPrice: Number(newPrice) + 40,
          discountPercent: 5,
          url: 'https://www.ebay.com',
          inStock: true,
          shipping: '$4.99 Standard',
          shippingCost: 4.99,
          rating: 4.6,
          reviewsCount: 60,
          lastUpdated: '10 mins ago',
        }
      ],
      specs: [
        { name: 'Category', value: newCategory },
        { name: 'Warranty', value: '1 Year Manufacturer' },
      ],
      priceHistory: [
        { date: 'Jul', amazon: Number(newPrice) + 30, ebay: Number(newPrice) + 35, shopify: Number(newPrice) + 40 },
        { date: 'Aug', amazon: Number(newPrice) + 15, ebay: Number(newPrice) + 20, shopify: Number(newPrice) + 25 },
        { date: 'Sep', amazon: Number(newPrice), ebay: Number(newPrice) + 15, shopify: Number(newPrice) + 20 },
      ]
    };

    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProdData),
      });
      const data = await res.json();
      setProducts(prev => [data.product, ...prev]);
      setIsAddProductOpen(false);
      setNewTitle('');
    } catch {
      setIsAddProductOpen(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Admin Control Center
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                Supervisor Mode
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Manage database catalog, view user inquiries, transactions, and chatbot queries
            </p>
          </div>
        </div>

        {activeAdminTab === 'products' && (
          <button
            onClick={() => setIsAddProductOpen(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <span className="text-[11px] font-bold text-slate-500">Catalog Products</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {products.length}
          </div>
          <span className="text-[10px] text-emerald-600 font-bold">Live across 5 stores</span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <span className="text-[11px] font-bold text-slate-500">Total Users</span>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">
            {adminStats.totalUsers}
          </div>
          <span className="text-[10px] text-slate-400">Registered shoppers</span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <span className="text-[11px] font-bold text-slate-500">Comparisons Run</span>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
            {adminStats.totalComparisons}
          </div>
          <span className="text-[10px] text-emerald-600 font-bold">+14% this week</span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <span className="text-[11px] font-bold text-slate-500">Sandbox Revenue</span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            ${adminStats.totalRevenue.toFixed(2)}
          </div>
          <span className="text-[10px] text-slate-400">Simulated orders</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-4 text-xs font-bold">
        <button
          onClick={() => setActiveAdminTab('products')}
          className={`pb-3 transition-colors flex items-center gap-1.5 ${
            activeAdminTab === 'products'
              ? 'text-emerald-600 border-b-2 border-emerald-600'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Product Catalog ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('messages')}
          className={`pb-3 transition-colors flex items-center gap-1.5 ${
            activeAdminTab === 'messages'
              ? 'text-emerald-600 border-b-2 border-emerald-600'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Contact Inquiries ({messages.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('transactions')}
          className={`pb-3 transition-colors flex items-center gap-1.5 ${
            activeAdminTab === 'transactions'
              ? 'text-emerald-600 border-b-2 border-emerald-600'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Transactions & Orders</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('chatlogs')}
          className={`pb-3 transition-colors flex items-center gap-1.5 ${
            activeAdminTab === 'chatlogs'
              ? 'text-emerald-600 border-b-2 border-emerald-600'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Chatbot Logs</span>
        </button>
      </div>

      {/* Tab: Products Table */}
      {activeAdminTab === 'products' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold">
                <tr>
                  <th className="p-4">Product</th>
                  <th className="p-4">Brand / Category</th>
                  <th className="p-4">Lowest Price</th>
                  <th className="p-4">Smart Score</th>
                  <th className="p-4">Store Quotes</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {products.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="p-4 font-bold text-slate-900 dark:text-white flex items-center gap-3">
                      <img src={p.image} alt={p.title} className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0" />
                      <span className="truncate max-w-xs">{p.title}</span>
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-300">
                      {p.brand} • {p.category}
                    </td>
                    <td className="p-4 font-black text-slate-900 dark:text-white">
                      ${p.lowestPrice}
                    </td>
                    <td className="p-4 font-bold text-blue-600 dark:text-blue-400">
                      {p.smartScore.totalScore}/100
                    </td>
                    <td className="p-4 text-slate-500">
                      {p.platforms.length} Stores
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                        title="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Contact Messages */}
      {activeAdminTab === 'messages' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Registered Inquiries & Contact Forms
          </h3>
          <div className="space-y-3">
            {messages.length === 0 ? (
              <p className="text-xs text-slate-400">No contact submissions yet.</p>
            ) : (
              messages.map(m => (
                <div key={m.id} className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-slate-900 dark:text-white">{m.name} ({m.email})</span>
                    <span className="text-[10px] text-slate-400">{new Date(m.createdAt).toLocaleString()}</span>
                  </div>
                  <h4 className="font-bold text-blue-600 dark:text-blue-400">{m.subject}</h4>
                  <p className="text-slate-600 dark:text-slate-300">{m.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab: Transactions */}
      {activeAdminTab === 'transactions' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold">
                <tr>
                  <th className="p-4">Transaction Code</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Plan</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Method</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {transactions.map(t => (
                  <tr key={t.id}>
                    <td className="p-4 font-mono font-bold text-blue-600">{t.id}</td>
                    <td className="p-4 font-bold text-slate-900 dark:text-white">{t.userName}</td>
                    <td className="p-4">{t.plan}</td>
                    <td className="p-4 font-black">${t.amount}.00</td>
                    <td className="p-4 text-slate-500">{t.paymentMethod}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Chatbot Logs */}
      {activeAdminTab === 'chatlogs' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            AI Assistant Interaction Telemetry
          </h3>
          <div className="space-y-3">
            {chatLogs.length === 0 ? (
              <p className="text-xs text-slate-400">No AI queries recorded in this session yet.</p>
            ) : (
              chatLogs.map(l => (
                <div key={l.id} className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-blue-600">Q: "{l.query}"</span>
                    <span className="text-[10px] text-slate-400">{new Date(l.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 whitespace-pre-line">A: {l.response}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Modal: Add New Product */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Add New Product to Database
              </h3>
              <button onClick={() => setIsAddProductOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Google Pixel 9 Pro (128GB)"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Brand</label>
                  <input
                    type="text"
                    required
                    value={newBrand}
                    onChange={e => setNewBrand(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  >
                    <option value="Smartphones">Smartphones</option>
                    <option value="Laptops">Laptops</option>
                    <option value="Headphones">Headphones</option>
                    <option value="Smart Watches">Smart Watches</option>
                    <option value="Gaming & Accessories">Gaming & Accessories</option>
                    <option value="Cameras">Cameras</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Lowest Base Price ($)</label>
                <input
                  type="number"
                  required
                  value={newPrice}
                  onChange={e => setNewPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Image URL</label>
                <input
                  type="url"
                  required
                  value={newImage}
                  onChange={e => setNewImage(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md shadow-emerald-500/20"
                >
                  Save to Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
