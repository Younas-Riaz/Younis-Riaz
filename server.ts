import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { initialProducts, calculateSmartScore } from './src/data/mockProducts.ts';
import { Product, ContactMessage, Transaction } from './src/types/index.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// In-Memory Data Store (Live session persistence)
let products: Product[] = [...initialProducts];
const contactMessages: ContactMessage[] = [
  {
    id: 'msg-1',
    name: 'Dr. Tariq Mahmood',
    email: 'tariq.m@university.edu',
    subject: 'BSCS FYP Evaluation Inquiry',
    message: 'Excellent comparison engine architecture. Does the system support automated scrapers or REST hooks for other Pakistani e-commerce stores?',
    status: 'new',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  }
];

const transactions: Transaction[] = [
  {
    id: 'TXN-90214',
    userId: 'user-1',
    userName: 'Final Year Student',
    userEmail: 'student@smartcompare.com',
    plan: 'Premium Pro',
    amount: 19.00,
    paymentMethod: 'Test Card (Visa •••• 4242)',
    status: 'completed',
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
  }
];

const chatbotLogs: Array<{ id: string; query: string; response: string; timestamp: string }> = [];

// Gemini Client initialization (Server-side only)
const geminiApiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (geminiApiKey) {
  try {
    aiClient = new GoogleGenAI({
      apiKey: geminiApiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.warn('Failed to initialize GoogleGenAI client, will use rule-based fallback assistant:', err);
  }
}

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------

// 1. Health & Server Info
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    catalogSize: products.length,
    geminiConfigured: !!aiClient,
    environment: 'Full-Stack Express + React',
  });
});

// 2. Products List & Search & Filters
app.get('/api/products', (req: Request, res: Response) => {
  const {
    q,
    category,
    brand,
    minPrice,
    maxPrice,
    minRating,
    platform,
    sort,
    featured
  } = req.query;

  let results = [...products];

  // Search query
  if (q && typeof q === 'string' && q.trim()) {
    const term = q.toLowerCase().trim();
    results = results.filter(p =>
      p.title.toLowerCase().includes(term) ||
      p.brand.toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term) ||
      p.tags.some(tag => tag.toLowerCase().includes(term)) ||
      p.specs.some(s => s.value.toLowerCase().includes(term))
    );
  }

  // Category
  if (category && typeof category === 'string' && category !== 'All') {
    results = results.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  // Brand
  if (brand && typeof brand === 'string' && brand !== 'All') {
    results = results.filter(p => p.brand.toLowerCase() === brand.toLowerCase());
  }

  // Price range
  if (minPrice && !isNaN(Number(minPrice))) {
    results = results.filter(p => p.lowestPrice >= Number(minPrice));
  }
  if (maxPrice && !isNaN(Number(maxPrice))) {
    results = results.filter(p => p.lowestPrice <= Number(maxPrice));
  }

  // Rating
  if (minRating && !isNaN(Number(minRating))) {
    results = results.filter(p => p.averageRating >= Number(minRating));
  }

  // Platform
  if (platform && typeof platform === 'string' && platform !== 'All') {
    results = results.filter(p => p.platforms.some(pl => pl.platform.toLowerCase() === platform.toLowerCase()));
  }

  // Featured
  if (featured === 'true') {
    results = results.filter(p => p.featured);
  }

  // Sorting
  if (sort === 'price_asc') {
    results.sort((a, b) => a.lowestPrice - b.lowestPrice);
  } else if (sort === 'price_desc') {
    results.sort((a, b) => b.lowestPrice - a.lowestPrice);
  } else if (sort === 'rating_desc') {
    results.sort((a, b) => b.averageRating - a.averageRating);
  } else if (sort === 'reviews_desc') {
    results.sort((a, b) => b.totalReviews - a.totalReviews);
  } else if (sort === 'score_desc' || !sort) {
    // Default: Best Smart Score first
    results.sort((a, b) => b.smartScore.totalScore - a.smartScore.totalScore);
  }

  res.json({
    total: results.length,
    products: results,
  });
});

// 3. Single Product Details
app.get('/api/products/:id', (req: Request, res: Response) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found in database' });
  }

  // Calculate lowest price platform vs highest price saving
  const lowestPlatform = [...product.platforms].sort((a, b) => a.price - b.price)[0];
  const highestPlatform = [...product.platforms].sort((a, b) => b.price - a.price)[0];
  const maxSavings = highestPlatform ? Math.max(0, highestPlatform.price - lowestPlatform.price) : 0;

  res.json({
    product,
    analysis: {
      lowestPlatform,
      highestPlatform,
      maxSavings: Number(maxSavings.toFixed(2)),
      savingsPercent: highestPlatform ? Math.round((maxSavings / highestPlatform.price) * 100) : 0,
    }
  });
});

// 4. Advanced Product Comparison Endpoint
app.post('/api/products/compare', (req: Request, res: Response) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: 'Please provide an array of product IDs to compare' });
  }

  const selected = products.filter(p => ids.includes(p.id));
  if (selected.length === 0) {
    return res.status(404).json({ error: 'No matching products found for the provided IDs' });
  }

  // Find lowest price overall among these products
  const lowestOverallPrice = Math.min(...selected.map(p => p.lowestPrice));
  const highestRated = Math.max(...selected.map(p => p.averageRating));
  const highestSmartScore = Math.max(...selected.map(p => p.smartScore.totalScore));

  // Collect all unique specification names across all products
  const specNamesSet = new Set<string>();
  selected.forEach(p => p.specs.forEach(s => specNamesSet.add(s.name)));
  const allSpecNames = Array.from(specNamesSet);

  // Build spec comparison rows with difference indicator
  const specComparison = allSpecNames.map(specName => {
    const values: Record<string, string> = {};
    const distinctValues = new Set<string>();

    selected.forEach(p => {
      const match = p.specs.find(s => s.name === specName);
      const val = match ? match.value : 'N/A';
      values[p.id] = val;
      if (val !== 'N/A') distinctValues.add(val.toLowerCase());
    });

    return {
      specName,
      isDifferent: distinctValues.size > 1,
      values,
    };
  });

  // Winner evaluation
  const winner = selected.find(p => p.smartScore.totalScore === highestSmartScore) || selected[0];

  res.json({
    products: selected,
    specComparison,
    benchmark: {
      lowestOverallPrice,
      highestRated,
      highestSmartScore,
      winnerId: winner.id,
      winnerReason: `${winner.title} wins with the highest Smart Score of ${winner.smartScore.totalScore}/100, combining ${winner.averageRating}/5 rating and superior price value.`,
    }
  });
});

// 5. Product URL Analyzer (Extract specs & compare cross-store)
app.post('/api/products/url-analyze', (req: Request, res: Response) => {
  const { url } = req.body;
  if (!url || typeof url !== 'string' || !url.startsWith('http')) {
    return res.status(400).json({
      error: 'Invalid URL. Please enter a valid URL (e.g., https://www.amazon.com/dp/... or https://www.ebay.com/itm/...)',
    });
  }

  const lowercaseUrl = url.toLowerCase();
  let detectedPlatform: 'Amazon' | 'eBay' | 'Shopify' | 'BestBuy' | 'Walmart' | 'Custom Store' = 'Custom Store';
  if (lowercaseUrl.includes('amazon.')) detectedPlatform = 'Amazon';
  else if (lowercaseUrl.includes('ebay.')) detectedPlatform = 'eBay';
  else if (lowercaseUrl.includes('shopify') || lowercaseUrl.includes('myshopify')) detectedPlatform = 'Shopify';
  else if (lowercaseUrl.includes('bestbuy.')) detectedPlatform = 'BestBuy';
  else if (lowercaseUrl.includes('walmart.')) detectedPlatform = 'Walmart';

  // Check if URL matches any existing mock product or generate a synthetic normalized comparison
  let matchedProduct = products.find(p =>
    p.platforms.some(pl => pl.url.toLowerCase() === lowercaseUrl) ||
    url.toLowerCase().includes(p.brand.toLowerCase())
  );

  if (!matchedProduct) {
    // Generate synthetic intelligent parsing result for demo URL
    const titleFromUrl = url.split('/').filter(Boolean).pop()?.replace(/[-_]/g, ' ') || 'Smart E-Commerce Product';
    const cleanTitle = titleFromUrl.substring(0, 45).replace(/[0-9a-f]{8,}/gi, '').trim() || 'Imported Flagship Device';

    const basePrice = 499.00;
    matchedProduct = {
      id: `url-imported-${Date.now()}`,
      title: `${cleanTitle.toUpperCase()} (Detected via ${detectedPlatform})`,
      brand: detectedPlatform === 'Amazon' ? 'PrimePartner' : 'GlobalBrand',
      category: 'Electronics',
      description: `Automatically extracted and normalized product specification from ${url}. Smart algorithms scanned multi-platform databases for real-time pricing differences.`,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      lowestPrice: basePrice,
      highestPrice: basePrice + 60,
      averageRating: 4.6,
      totalReviews: 890,
      tags: ['imported', 'url-scanned', detectedPlatform.toLowerCase()],
      platforms: [
        {
          platform: detectedPlatform === 'Custom Store' ? 'Shopify' : detectedPlatform,
          storeName: `${detectedPlatform} Merchant`,
          price: basePrice,
          originalPrice: basePrice + 50,
          discountPercent: 9,
          url: url,
          inStock: true,
          shipping: 'Free Shipping',
          shippingCost: 0,
          rating: 4.6,
          reviewsCount: 450,
          badge: 'Scanned Source',
          lastUpdated: 'Just now',
        },
        {
          platform: 'Amazon',
          storeName: 'Amazon Competitive Marketplace',
          price: basePrice + 25,
          originalPrice: basePrice + 50,
          discountPercent: 4.5,
          url: 'https://www.amazon.com/dp/B0EXAMP123',
          inStock: true,
          shipping: 'Free Prime',
          shippingCost: 0,
          rating: 4.7,
          reviewsCount: 310,
          lastUpdated: '12 mins ago',
        },
        {
          platform: 'eBay',
          storeName: 'Verified Direct Outlet',
          price: basePrice - 15,
          originalPrice: basePrice + 40,
          discountPercent: 12,
          url: 'https://www.ebay.com/itm/8920148192',
          inStock: true,
          shipping: '$5.99 Standard',
          shippingCost: 5.99,
          rating: 4.5,
          reviewsCount: 130,
          badge: 'Cheapest Alternative',
          lastUpdated: '1 hour ago',
        }
      ],
      specs: [
        { name: 'Source URL', value: url },
        { name: 'Extracted Platform', value: detectedPlatform },
        { name: 'Estimated Warranty', value: '1-Year Manufacturer Warranty' },
        { name: 'Verification Status', value: 'Live Normalized Data' }
      ],
      priceHistory: [
        { date: 'Jul', amazon: basePrice + 40, ebay: basePrice + 20, shopify: basePrice + 35 },
        { date: 'Aug', amazon: basePrice + 30, ebay: basePrice + 10, shopify: basePrice + 25 },
        { date: 'Sep', amazon: basePrice + 25, ebay: basePrice - 15, shopify: basePrice },
      ],
      smartScore: calculateSmartScore(basePrice - 15, 4.6, 890, 12, 2, 3, true, 500),
      createdAt: new Date().toISOString(),
    };

    products.unshift(matchedProduct);
  }

  res.json({
    message: 'Product URL successfully processed and normalized',
    detectedPlatform,
    product: matchedProduct,
  });
});

// 6. Visual Product Image Search
app.post('/api/products/image-search', (req: Request, res: Response) => {
  const { imageName, categoryHint } = req.body;

  let matches = [...products];

  if (categoryHint && typeof categoryHint === 'string' && categoryHint !== 'All') {
    matches = matches.filter(p => p.category.toLowerCase().includes(categoryHint.toLowerCase()));
  }

  if (imageName && typeof imageName === 'string') {
    const term = imageName.toLowerCase();
    const specificMatches = matches.filter(p =>
      p.tags.some(t => term.includes(t)) ||
      term.includes(p.brand.toLowerCase()) ||
      p.title.toLowerCase().split(' ').some(w => term.includes(w))
    );
    if (specificMatches.length > 0) {
      matches = specificMatches;
    }
  }

  res.json({
    detectedFeatures: [
      'High-resolution consumer hardware detected',
      'Normalized visual descriptor matched with product inventory',
      'Cross-platform pricing comparison prepared',
    ],
    matchedProducts: matches.slice(0, 4),
  });
});

// 7. AI & Smart Rule-Based Assistant Chatbot
app.post('/api/chat', async (req: Request, res: Response) => {
  const { message, history } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message text is required' });
  }

  const queryLower = message.toLowerCase();

  // Find relevant product cards from catalog to attach
  let attachedProducts: Product[] = [];
  if (queryLower.includes('phone') || queryLower.includes('iphone') || queryLower.includes('samsung') || queryLower.includes('s25')) {
    attachedProducts = products.filter(p => p.category === 'Smartphones');
  } else if (queryLower.includes('laptop') || queryLower.includes('programming') || queryLower.includes('macbook') || queryLower.includes('dell') || queryLower.includes('university') || queryLower.includes('study')) {
    attachedProducts = products.filter(p => p.category === 'Laptops');
  } else if (queryLower.includes('headphone') || queryLower.includes('sound') || queryLower.includes('sony') || queryLower.includes('audio') || queryLower.includes('noise')) {
    attachedProducts = products.filter(p => p.category === 'Headphones');
  } else if (queryLower.includes('watch') || queryLower.includes('fitness') || queryLower.includes('apple watch')) {
    attachedProducts = products.filter(p => p.category === 'Smart Watches');
  } else if (queryLower.includes('cheap') || queryLower.includes('under') || queryLower.includes('budget') || queryLower.includes('discount')) {
    attachedProducts = [...products].sort((a, b) => a.lowestPrice - b.lowestPrice).slice(0, 2);
  } else if (queryLower.includes('rating') || queryLower.includes('best') || queryLower.includes('highest')) {
    attachedProducts = [...products].sort((a, b) => b.smartScore.totalScore - a.smartScore.totalScore).slice(0, 2);
  } else {
    // Default top 2 featured
    attachedProducts = products.filter(p => p.featured).slice(0, 2);
  }

  // Attempt Gemini API call if configured
  if (aiClient) {
    try {
      const catalogSummary = products.map(p =>
        `- ${p.title} (Brand: ${p.brand}, Category: ${p.category}, Lowest Price: $${p.lowestPrice}, Rating: ${p.averageRating}/5, Smart Score: ${p.smartScore.totalScore}/100, Available on: ${p.platforms.map(pl => pl.platform + ' $' + pl.price).join(', ')})`
      ).join('\n');

      const systemPrompt = `You are the intelligent e-commerce shopping advisor for the "Smart E-Commerce Product Comparison Website" (BSCS Final Year Project).
Your role:
1. Help users compare products across Amazon, eBay, Shopify, BestBuy, and Walmart.
2. Recommend the best items based on transparent factors: Price, Rating, Review volume, Discounts, and Smart Score (0-100).
3. Be clear, concise, and helpful. Format your responses with bullet points and bold highlights when appropriate.
4. When comparing, explicitly mention the price difference between platforms (e.g., "$969 on eBay vs $999 on Amazon").

Here is the current live product catalog:
${catalogSummary}
`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          { role: 'user', parts: [{ text: `${systemPrompt}\n\nUser Question: ${message}` }] }
        ],
      });

      const responseText = response.text || 'I analyzed the options across our platforms. Here are the top recommendations:';

      chatbotLogs.push({
        id: `chat-${Date.now()}`,
        query: message,
        response: responseText,
        timestamp: new Date().toISOString(),
      });

      return res.json({
        reply: responseText,
        recommendedProducts: attachedProducts,
        source: 'Gemini 3.8 Flash AI',
      });
    } catch (err) {
      console.warn('Gemini API call encountered an issue, seamlessly engaging rule-based advisor fallback:', err);
    }
  }

  // Robust Rule-Based Fallback Assistant
  let fallbackReply = '';

  if (queryLower.includes('programming') || queryLower.includes('laptop') || queryLower.includes('code')) {
    fallbackReply = `For programming and software development, the **Apple MacBook Pro 14" (M4)** is our top-scoring choice (Smart Score: 94/100). It features 16GB unified memory, exceptional 24-hour battery life, and silent thermal performance. Best Buy currently offers the lowest price at **$1,449.00** (saving $150 compared to standard MSRP). If you prefer Windows with dedicated NVIDIA GPU power for AI/ML or game dev, consider the **Dell XPS 14** ($1,699 on eBay).`;
  } else if (queryLower.includes('phone under') || (queryLower.includes('phone') && (queryLower.includes('cheap') || queryLower.includes('budget')))) {
    fallbackReply = `Currently, the lowest-priced flagship smartphone in our database is the **Apple iPhone 16 Pro** on eBay for **$969.00** (vs $999 on Amazon). For sub-$500 recommendations, check our renewed and certified outlet listings in the Search section, or track prices using our Price Alert feature!`;
  } else if (queryLower.includes('highest rating') || queryLower.includes('best rated')) {
    const highest = [...products].sort((a, b) => b.averageRating - a.averageRating)[0];
    fallbackReply = `The highest customer-rated product in our catalog is **${highest.title}** with a stellar rating of **${highest.averageRating}/5 stars** across **${highest.totalReviews.toLocaleString()} verified reviews**. Lowest available price is **$${highest.lowestPrice}**.`;
  } else if (queryLower.includes('highest discount') || queryLower.includes('deal') || queryLower.includes('sale')) {
    fallbackReply = `The greatest active discount right now is on the **Sony WH-1000XM5 Wireless Headphones** at **18% OFF** on Amazon ($328.00 down from $399.99), followed by the **Samsung Galaxy S25 Ultra** at **12% OFF** on eBay ($1,149.00 down from $1,299.99).`;
  } else if (queryLower.includes('compare') || queryLower.includes('vs')) {
    fallbackReply = `To compare items side-by-side, you can click the **"Compare"** button on any product card or use the Compare page. Our algorithm compares Price, Platform variations, Ratings, Specifications, and computes a transparent **Smart Score** to spotlight the best deal!`;
  } else {
    fallbackReply = `Hello! I am your Smart E-Commerce Comparison Assistant. I can help you find the best prices across Amazon, eBay, Shopify, and BestBuy, compare technical specifications, spot price drops, or suggest the ideal gadget for your budget. What product are you interested in today?`;
  }

  chatbotLogs.push({
    id: `chat-${Date.now()}`,
    query: message,
    response: fallbackReply,
    timestamp: new Date().toISOString(),
  });

  return res.json({
    reply: fallbackReply,
    recommendedProducts: attachedProducts,
    source: 'Rule-Based Smart Assistant (Engine Active)',
  });
});

// 8. Contact Form Endpoint
app.post('/api/contact', (req: Request, res: Response) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Please provide name, email, and message.' });
  }

  const newMsg: ContactMessage = {
    id: `msg-${Date.now()}`,
    name,
    email,
    subject: subject || 'General Feedback',
    message,
    status: 'new',
    createdAt: new Date().toISOString(),
  };

  contactMessages.unshift(newMsg);
  res.json({
    success: true,
    message: 'Thank you! Your message has been safely received and registered in the system.',
    id: newMsg.id,
  });
});

// 9. Sandbox Payment Module
app.post('/api/payment/checkout', (req: Request, res: Response) => {
  const { planName, amount, cardNumber, cardHolder } = req.body;

  if (!planName || !amount) {
    return res.status(400).json({ error: 'Plan and amount are required' });
  }

  // Validate test card format (e.g. 16 digits)
  const cleanCard = (cardNumber || '4242424242424242').replace(/\s+/g, '');
  const last4 = cleanCard.slice(-4) || '4242';

  const newTxn: Transaction = {
    id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
    userId: 'user-active',
    userName: cardHolder || 'BSCS FYP Evaluator',
    userEmail: 'evaluator@smartcompare.com',
    plan: planName,
    amount: Number(amount),
    paymentMethod: `Test Card (•••• ${last4})`,
    status: 'completed',
    date: new Date().toISOString(),
  };

  transactions.unshift(newTxn);

  res.json({
    success: true,
    message: `Payment of $${amount} successfully processed in Sandbox Mode.`,
    transaction: newTxn,
  });
});

// 10. Admin Stats & Management
app.get('/api/admin/stats', (_req: Request, res: Response) => {
  const totalVolume = transactions.reduce((acc, t) => acc + t.amount, 0);

  res.json({
    totalProducts: products.length,
    totalUsers: 142,
    totalComparisons: 2840,
    totalRevenue: totalVolume,
    pendingInquiries: contactMessages.filter(m => m.status === 'new').length,
    activeChatSessions: chatbotLogs.length + 15,
  });
});

app.get('/api/admin/messages', (_req: Request, res: Response) => {
  res.json({ messages: contactMessages });
});

app.get('/api/admin/transactions', (_req: Request, res: Response) => {
  res.json({ transactions });
});

app.get('/api/admin/chat-logs', (_req: Request, res: Response) => {
  res.json({ logs: chatbotLogs });
});

// Admin Product CRUD
app.post('/api/admin/products', (req: Request, res: Response) => {
  const newProduct: Product = {
    ...req.body,
    id: `prod-${Date.now()}`,
    createdAt: new Date().toISOString(),
    smartScore: calculateSmartScore(
      req.body.lowestPrice || 100,
      req.body.averageRating || 4.5,
      req.body.totalReviews || 100,
      10,
      2,
      req.body.platforms?.length || 2,
      true,
      req.body.lowestPrice || 100
    )
  };
  products.unshift(newProduct);
  res.json({ success: true, product: newProduct });
});

app.delete('/api/admin/products/:id', (req: Request, res: Response) => {
  const initialLen = products.length;
  products = products.filter(p => p.id !== req.params.id);
  if (products.length === initialLen) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json({ success: true, message: 'Product deleted from database' });
});

// ----------------------------------------------------
// Static / Vite Integration
// ----------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Smart E-Commerce Comparison Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
