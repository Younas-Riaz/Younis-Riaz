# Smart E-Commerce Product Comparison Website
### BSCS Final Year Project (Session 2023–2027)

An intelligent multi-platform product comparison web application designed to help consumers find, analyze, and select products across Amazon, eBay, Shopify, BestBuy, and Walmart from one centralized platform.

---

## 🎯 Key Features

1. **Multi-Store Price Comparison Engine:**
   - Real-time side-by-side comparison tables.
   - Highlights Lowest Price, Highest Rating, and Maximum Savings.
   - Deep links directly to retailer product pages with stock status.

2. **Transparent Smart Recommendation Score (0–100):**
   - Weighted multi-factor algorithm:
     - Price Competitiveness (35%)
     - Customer Rating (25%)
     - Review Volume Confidence (15%)
     - Promotional Discount (10%)
     - Free Shipping Availability (10%)
     - Stock & Merchant Trust (5%)
   - Human-readable justifications explaining why a product was recommended.

3. **Smart E-Commerce AI Chatbot:**
   - Powered by Gemini 3.8 Flash (`@google/genai`) on the server with catalog grounding.
   - Resilient rule-based fallback assistant for offline operation without API keys.
   - Displays interactive product recommendation cards directly in the conversation.

4. **Product URL Analyzer:**
   - Paste any product URL (Amazon, eBay, Shopify, BestBuy).
   - Validates, extracts normalized specs, and searches multi-retailer matches.

5. **Visual Product Search:**
   - Upload or drag-and-drop gadget images to match catalog inventory.

6. **Price Tracking & Alert System:**
   - Historical price trend charts.
   - Custom threshold alerts (e.g., "Notify when price drops below $500").

7. **User Dashboard & Role-Based Access:**
   - User Dashboard: Tracked products, comparison history, saved favorites.
   - Admin Panel: Product CRUD, user analytics, contact inquiries, transactions, chatbot query logs.

8. **Sandbox Payment Module:**
   - Free, Basic ($9/mo), and Premium ($19/mo) plans.
   - Real-time test transaction processing with simulated invoice generation.

9. **Light / Dark Mode:**
   - Smooth persistent theme switcher stored in `localStorage`.

---

## 🛠️ Technology Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Lucide React Icons, Motion.
- **Backend (Live):** Node.js, Express, TypeScript (`server.ts`).
- **Backend (XAMPP / PHP Version):** PHP 8.x + MySQL PDO (`/php_backend/`).
- **Database:** Relational MySQL (`/database/smart_ecommerce.sql`).
- **AI Integration:** `@google/genai` (Gemini 3.8 Flash model).

---

## 🚀 Running Locally with XAMPP / WAMP (PHP + MySQL)

1. **Install XAMPP / WAMP:**
   - Download and install XAMPP with PHP 8.x and MySQL.
2. **Start Services:**
   - Open XAMPP Control Panel and start **Apache** and **MySQL**.
3. **Database Setup:**
   - Open your browser to `http://localhost/phpmyadmin`.
   - Click **Import** and select the file `/database/smart_ecommerce.sql`.
   - The `smart_ecommerce` database with all tables and seed records will be created automatically.
4. **Copy PHP Backend:**
   - Copy the `/php_backend` folder into your `C:/xampp/htdocs/smart-ecommerce/`.
   - Check `config/database.php` to ensure MySQL host is `localhost`, user is `root`, and password matches your local MySQL setup (default is blank).
5. **Access Endpoints:**
   - Test `http://localhost/smart-ecommerce/api/products.php` in your browser.

---

## 💻 Running the Live Node.js / React Applet

In this Google AI Studio environment, the full-stack server is already integrated:
```bash
npm run dev
```
The server will start on port `3000`, serving both the Express `/api/*` endpoints and the React frontend simultaneously!

---

## 🔑 Demo Credentials

- **Administrator:**
  - Email: `admin@smartcompare.com`
  - Password: `Admin@123`
- **Standard User:**
  - Email: `user@smartcompare.com`
  - Password: `User@123`
- *(Quick 1-Click Login buttons are also provided on the Login screen for demonstration during viva evaluations)*.
