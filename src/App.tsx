import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CompareFloatingBar } from './components/CompareFloatingBar';
import { ChatbotWidget } from './components/ChatbotWidget';
import { UrlAnalyzerModal } from './components/UrlAnalyzerModal';
import { ImageSearchModal } from './components/ImageSearchModal';
import { CheckoutModal } from './components/CheckoutModal';
import { AuthModal } from './components/AuthModal';

import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { ComparePage } from './pages/ComparePage';
import { DashboardPage } from './pages/DashboardPage';
import { AdminPage } from './pages/AdminPage';
import { PricingPage } from './pages/PricingPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { PortalPage } from './pages/PortalPage';

const AppContent: React.FC = () => {
  const { activePage } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-200">
      <Navbar />

      <main className="flex-1">
        {activePage === 'home' && <HomePage />}
        {activePage === 'products' && <ProductsPage />}
        {activePage === 'product-detail' && <ProductDetailPage />}
        {activePage === 'compare' && <ComparePage />}
        {activePage === 'dashboard' && <DashboardPage />}
        {activePage === 'admin' && <AdminPage />}
        {activePage === 'pricing' && <PricingPage />}
        {activePage === 'about' && <AboutPage />}
        {activePage === 'contact' && <ContactPage />}
        {activePage === 'portal' && <PortalPage />}
      </main>

      <Footer />

      {/* Floating Widgets & Modals */}
      <CompareFloatingBar />
      <ChatbotWidget />
      <UrlAnalyzerModal />
      <ImageSearchModal />
      <CheckoutModal />
      <AuthModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
