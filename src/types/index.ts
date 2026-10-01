export interface PlatformPrice {
  platform: 'Amazon' | 'eBay' | 'Shopify' | 'BestBuy' | 'Walmart';
  storeName: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  url: string;
  inStock: boolean;
  shipping: string;
  shippingCost: number;
  rating: number;
  reviewsCount: number;
  badge?: string;
  lastUpdated: string;
}

export interface ProductSpec {
  name: string;
  value: string;
}

export interface PriceHistoryPoint {
  date: string;
  amazon: number;
  ebay: number;
  shopify: number;
  bestbuy?: number;
}

export interface SmartScoreBreakdown {
  priceScore: number;       // out of 35
  ratingScore: number;      // out of 25
  reviewVolumeScore: number;// out of 15
  discountScore: number;    // out of 10
  shippingScore: number;    // out of 10
  availabilityScore: number;// out of 5
  totalScore: number;       // out of 100
  recommendationReason: string;
  pros: string[];
  cons: string[];
}

export interface Product {
  id: string;
  title: string;
  brand: string;
  category: string;
  description: string;
  image: string;
  additionalImages?: string[];
  lowestPrice: number;
  highestPrice: number;
  averageRating: number;
  totalReviews: number;
  tags: string[];
  featured?: boolean;
  platforms: PlatformPrice[];
  specs: ProductSpec[];
  priceHistory: PriceHistoryPoint[];
  smartScore: SmartScoreBreakdown;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  plan: 'free' | 'basic' | 'premium';
  avatar?: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'price_drop' | 'deal_alert' | 'system' | 'comparison';
  productId?: string;
  isRead: boolean;
  createdAt: string;
}

export interface PriceAlert {
  id: string;
  productId: string;
  productTitle: string;
  productImage: string;
  currentPrice: number;
  targetPrice: number;
  platform: string;
  active: boolean;
  createdDate: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  recommendedProducts?: Product[];
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  createdAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  plan: string;
  amount: number;
  paymentMethod: string;
  status: 'completed' | 'pending' | 'failed';
  date: string;
}
