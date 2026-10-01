import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, User, NotificationItem, PriceAlert } from '../types';
import { initialProducts } from '../data/mockProducts';

interface AppContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  currentUser: User | null;
  login: (email: string, role?: 'user' | 'admin') => void;
  logout: () => void;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  compareList: Product[];
  addToCompare: (product: Product) => void;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
  isInCompare: (productId: string) => boolean;
  favorites: string[];
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  priceAlerts: PriceAlert[];
  addPriceAlert: (productId: string, targetPrice: number) => void;
  removePriceAlert: (alertId: string) => void;
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  activePage: string;
  setActivePage: (page: string) => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  isUrlModalOpen: boolean;
  setIsUrlModalOpen: (open: boolean) => void;
  isImageModalOpen: boolean;
  setIsImageModalOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isCheckoutModalOpen: boolean;
  setIsCheckoutModalOpen: (open: boolean) => void;
  checkoutPlan: { name: string; price: number } | null;
  setCheckoutPlan: (plan: { name: string; price: number } | null) => void;
  searchKeyword: string;
  setSearchKeyword: (keyword: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('smart_compare_theme');
    return (saved as 'light' | 'dark') || 'light';
  });

  useEffect(() => {
    localStorage.setItem('smart_compare_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Auth state
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('smart_compare_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch {
        return null;
      }
    }
    // Default demo user for easy evaluation
    return {
      id: 'usr-demo-1',
      name: 'Ali Khan (FYP Student)',
      email: 'user@smartcompare.com',
      role: 'user',
      plan: 'basic',
      createdAt: '2026-09-01T00:00:00Z',
    };
  });

  const login = (email: string, role: 'user' | 'admin' = 'user') => {
    const user: User = {
      id: role === 'admin' ? 'adm-1' : 'usr-demo-1',
      name: role === 'admin' ? 'Administrator' : 'Ali Khan (FYP Student)',
      email: email,
      role: role,
      plan: role === 'admin' ? 'premium' : 'basic',
      createdAt: new Date().toISOString(),
    };
    setCurrentUser(user);
    localStorage.setItem('smart_compare_user', JSON.stringify(user));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('smart_compare_user');
  };

  // Products state (loads from API or fallback initial products)
  const [products, setProducts] = useState<Product[]>(initialProducts);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (data.products && Array.isArray(data.products)) {
          setProducts(data.products);
        }
      })
      .catch(() => {
        // Fallback to local initial products
      });
  }, []);

  // Compare List (up to 4 products)
  const [compareList, setCompareList] = useState<Product[]>(() => {
    return [initialProducts[0], initialProducts[1]];
  });

  const addToCompare = (product: Product) => {
    if (compareList.some(p => p.id === product.id)) return;
    if (compareList.length >= 4) {
      alert('You can compare a maximum of 4 products side-by-side.');
      return;
    }
    setCompareList(prev => [...prev, product]);
  };

  const removeFromCompare = (productId: string) => {
    setCompareList(prev => prev.filter(p => p.id !== productId));
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  const isInCompare = (productId: string) => {
    return compareList.some(p => p.id === productId);
  };

  // Favorites
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('smart_compare_favs');
    return saved ? JSON.parse(saved) : ['prod-iphone-16-pro', 'prod-macbook-pro-m4', 'prod-sony-wh1000xm5'];
  });

  useEffect(() => {
    localStorage.setItem('smart_compare_favs', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (productId: string) => {
    setFavorites(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  const isFavorite = (productId: string) => favorites.includes(productId);

  // Price Alerts
  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>([
    {
      id: 'alert-1',
      productId: 'prod-iphone-16-pro',
      productTitle: 'Apple iPhone 16 Pro',
      productImage: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
      currentPrice: 969.00,
      targetPrice: 940.00,
      platform: 'eBay',
      active: true,
      createdDate: '2026-09-20',
    },
    {
      id: 'alert-2',
      productId: 'prod-sony-wh1000xm5',
      productTitle: 'Sony WH-1000XM5 Headphones',
      productImage: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
      currentPrice: 328.00,
      targetPrice: 310.00,
      platform: 'Amazon',
      active: true,
      createdDate: '2026-09-24',
    }
  ]);

  const addPriceAlert = (productId: string, targetPrice: number) => {
    const prod = products.find(p => p.id === productId);
    if (!prod) return;

    const newAlert: PriceAlert = {
      id: `alert-${Date.now()}`,
      productId: prod.id,
      productTitle: prod.title,
      productImage: prod.image,
      currentPrice: prod.lowestPrice,
      targetPrice,
      platform: prod.platforms[0]?.platform || 'Amazon',
      active: true,
      createdDate: new Date().toISOString().split('T')[0],
    };

    setPriceAlerts(prev => [newAlert, ...prev]);
  };

  const removePriceAlert = (alertId: string) => {
    setPriceAlerts(prev => prev.filter(a => a.id !== alertId));
  };

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      userId: 'usr-1',
      title: 'Price Drop Alert: Sony WH-1000XM5',
      message: 'Sony WH-1000XM5 dropped to $328.00 on Amazon (18% discount).',
      type: 'price_drop',
      productId: 'prod-sony-wh1000xm5',
      isRead: false,
      createdAt: '15 mins ago',
    },
    {
      id: 'notif-2',
      userId: 'usr-1',
      title: 'New Deal Found: MacBook Pro M4',
      message: 'Best Buy updated pricing to $1,449.00 (saves $150 compared to standard).',
      type: 'deal_alert',
      productId: 'prod-macbook-pro-m4',
      isRead: false,
      createdAt: '2 hours ago',
    },
    {
      id: 'notif-3',
      userId: 'usr-1',
      title: 'Smart Recommendation Update',
      message: 'Your comparison between iPhone 16 Pro and Galaxy S25 Ultra is ready to review.',
      type: 'comparison',
      isRead: true,
      createdAt: '1 day ago',
    }
  ]);

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  // Navigation & Page state
  const [activePage, setActivePage] = useState<string>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  // Modals
  const [isUrlModalOpen, setIsUrlModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [checkoutPlan, setCheckoutPlan] = useState<{ name: string; price: number } | null>(null);

  // Global search & filters
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        currentUser,
        login,
        logout,
        products,
        setProducts,
        compareList,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isInCompare,
        favorites,
        toggleFavorite,
        isFavorite,
        priceAlerts,
        addPriceAlert,
        removePriceAlert,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        activePage,
        setActivePage,
        selectedProductId,
        setSelectedProductId,
        isUrlModalOpen,
        setIsUrlModalOpen,
        isImageModalOpen,
        setIsImageModalOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isCheckoutModalOpen,
        setIsCheckoutModalOpen,
        checkoutPlan,
        setCheckoutPlan,
        searchKeyword,
        setSearchKeyword,
        selectedCategory,
        setSelectedCategory,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
