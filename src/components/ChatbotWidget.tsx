import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Product, ChatMessage } from '../types';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Scale,
  ArrowRight,
  RotateCcw,
  Zap,
  ShoppingBag
} from 'lucide-react';

const SUGGESTIONS = [
  'Which laptop is better for programming?',
  'Find me a phone under $1000',
  'Which product has the highest rating?',
  'Show me products with the highest discount',
  'Suggest a gadget for university students',
  'Compare iPhone 16 Pro vs S25 Ultra',
];

export const ChatbotWidget: React.FC = () => {
  const { setSelectedProductId, setActivePage, addToCompare, products } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-msg',
      sender: 'assistant',
      text: 'Hello! I am your **Smart E-Commerce Shopping Advisor**. Ask me to compare products, find deals across Amazon, eBay, and BestBuy, or recommend the best tech specs for your budget.',
      timestamp: 'Just now',
      recommendedProducts: products.slice(0, 2),
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: messages.map(m => ({ sender: m.sender, text: m.text })),
        }),
      });

      const data = await res.json();
      const assistantMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || "I analyzed our retailer catalog for you. Here are the top matching options:",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        recommendedProducts: data.recommendedProducts || [],
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch {
      // Local fallback in case network issues
      const fallbackMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: `Here are our highest-rated products based on your interest:`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        recommendedProducts: products.slice(0, 2),
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        id: `init-${Date.now()}`,
        sender: 'assistant',
        text: 'Chat history cleared. How can I help you find the best tech deal today?',
        timestamp: 'Just now',
      }
    ]);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <div className="fixed bottom-6 right-6 z-40">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-2xl shadow-xl shadow-blue-500/35 hover:scale-105 transition-all duration-300 focus:outline-none"
            title="Ask Smart AI Shopping Assistant"
          >
            <div className="relative">
              <Bot className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-white animate-pulse" />
            </div>
            <div className="text-left hidden sm:block">
              <span className="block text-xs font-bold leading-tight">AI Assistant</span>
              <span className="block text-[10px] text-blue-200 leading-tight">Ask & Compare</span>
            </div>
          </button>
        )}
      </div>

      {/* Expandable Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-50 w-[95vw] sm:w-[420px] h-[580px] max-h-[85vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-300">
          
          {/* Header */}
          <div className="px-4 py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-900 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-amber-300" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold leading-none">Smart E-Commerce Advisor</h3>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-blue-500/40 border border-white/20">
                    AI Active
                  </span>
                </div>
                <p className="text-[11px] text-blue-100/80 leading-none mt-1">
                  Amazon • eBay • Shopify • BestBuy Grounded
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClear}
                title="Clear Chat"
                className="p-1.5 rounded-lg text-blue-100 hover:text-white hover:bg-white/10 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close"
                className="p-1.5 rounded-lg text-blue-100 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Conversation History Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/70 dark:bg-slate-950/70">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div className={`max-w-[85%] space-y-2`}>
                  <div
                    className={`rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-tr-none'
                        : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-sm border border-slate-200/80 dark:border-slate-700/80 rounded-tl-none'
                    }`}
                  >
                    <div className="whitespace-pre-line font-medium">
                      {msg.text}
                    </div>
                    <span
                      className={`block text-[9px] mt-1.5 ${
                        msg.sender === 'user' ? 'text-blue-200 text-right' : 'text-slate-400 dark:text-slate-400'
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>

                  {/* Attached Product Recommendation Cards */}
                  {msg.recommendedProducts && msg.recommendedProducts.length > 0 && (
                    <div className="space-y-2 pt-1">
                      {msg.recommendedProducts.map(prod => (
                        <div
                          key={prod.id}
                          className="bg-white dark:bg-slate-800 rounded-xl p-2.5 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between gap-2.5 hover:border-blue-400 transition-all"
                        >
                          <img
                            src={prod.image}
                            alt={prod.title}
                            className="w-12 h-12 rounded-lg object-cover bg-slate-100 dark:bg-slate-700 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                              {prod.title}
                            </h4>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400">
                                ${prod.lowestPrice}
                              </span>
                              <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                                Score: {prod.smartScore.totalScore}/100
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate block">
                              Best on {prod.platforms[0]?.platform}
                            </span>
                          </div>

                          <div className="flex flex-col gap-1 shrink-0">
                            <button
                              onClick={() => {
                                setSelectedProductId(prod.id);
                                setActivePage('product-detail');
                                setIsOpen(false);
                              }}
                              className="px-2 py-1 bg-slate-100 dark:bg-slate-700 hover:bg-blue-50 dark:hover:bg-blue-900 text-[10px] font-bold text-slate-700 dark:text-slate-200 hover:text-blue-600 rounded flex items-center gap-1"
                            >
                              <span>View</span>
                              <ArrowRight className="w-2.5 h-2.5" />
                            </button>
                            <button
                              onClick={() => addToCompare(prod)}
                              className="px-2 py-1 bg-blue-50 dark:bg-blue-900/60 hover:bg-blue-100 text-[10px] font-bold text-blue-600 dark:text-blue-300 rounded flex items-center gap-1"
                            >
                              <Scale className="w-2.5 h-2.5" />
                              <span>Compare</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2.5 items-center text-xs text-slate-500 dark:text-slate-400">
                <div className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-2xl px-4 py-2.5 shadow-sm border border-slate-200 dark:border-slate-700 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce" />
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce [animation-delay:0.4s]" />
                  <span className="text-[11px] font-semibold text-slate-500 ml-1">Analyzing cross-platform prices...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions Chips */}
          <div className="px-3 py-2 bg-slate-100/90 dark:bg-slate-900/90 border-t border-slate-200/80 dark:border-slate-800/80 overflow-x-auto whitespace-nowrap flex gap-1.5 scrollbar-none">
            {SUGGESTIONS.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(s)}
                className="px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/40 hover:text-blue-600 rounded-full border border-slate-200 dark:border-slate-700 shrink-0 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
            <form
              onSubmit={e => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask about phones, laptops, discounts..."
                className="flex-1 px-3.5 py-2.5 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="p-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl transition-all shadow-md shadow-blue-500/20"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>
      )}
    </>
  );
};
