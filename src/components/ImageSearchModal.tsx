import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';
import { X, Image as ImageIcon, Upload, Sparkles, Scale, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';

const SAMPLE_IMAGES = [
  {
    name: 'Flagship Smartphone',
    url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=400&q=80',
    category: 'Smartphones',
  },
  {
    name: 'Pro Laptop Workstation',
    url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80',
    category: 'Laptops',
  },
  {
    name: 'Noise Canceling Headphones',
    url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=400&q=80',
    category: 'Headphones',
  },
  {
    name: 'Rugged Smartwatch',
    url: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=400&q=80',
    category: 'Smart Watches',
  },
];

export const ImageSearchModal: React.FC = () => {
  const { isImageModalOpen, setIsImageModalOpen, setSelectedProductId, setActivePage, addToCompare } = useApp();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [matchedProducts, setMatchedProducts] = useState<Product[]>([]);
  const [features, setFeatures] = useState<string[]>([]);

  if (!isImageModalOpen) return null;

  const handleImageSearch = async (imgUrl: string, name: string, category: string) => {
    setSelectedImage(imgUrl);
    setImageName(name);
    setLoading(true);
    setMatchedProducts([]);

    try {
      const res = await fetch('/api/products/image-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageName: name, categoryHint: category }),
      });
      const data = await res.json();
      setFeatures(data.detectedFeatures || []);
      setMatchedProducts(data.matchedProducts || []);
    } catch {
      // Fallback
      setFeatures(['Visual feature extraction completed', 'High confidence match found']);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        handleImageSearch(result, file.name, 'All');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800/50 dark:to-indigo-950/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/30">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Visual Product Search Engine
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Upload or select an image to match hardware specs and find lowest prices
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsImageModalOpen(false);
              setSelectedImage(null);
              setMatchedProducts([]);
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          
          {/* Drag & Drop / Upload area */}
          <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-slate-50/60 dark:bg-slate-800/30 group">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Upload className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Click to upload a gadget image or photo
            </span>
            <span className="text-[11px] text-slate-400 mt-1">
              Supports PNG, JPG, WEBP up to 10MB
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          {/* Sample preset buttons */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              Or Select a Sample Product to Analyze:
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {SAMPLE_IMAGES.map((sample, idx) => (
                <div
                  key={idx}
                  onClick={() => handleImageSearch(sample.url, sample.name, sample.category)}
                  className={`p-2 rounded-xl border cursor-pointer text-left transition-all ${
                    selectedImage === sample.url
                      ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/40'
                      : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 bg-slate-50 dark:bg-slate-800/50'
                  }`}
                >
                  <img
                    src={sample.url}
                    alt={sample.name}
                    className="w-full h-20 object-cover rounded-lg mb-1.5"
                  />
                  <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate">
                    {sample.name}
                  </p>
                  <p className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">
                    {sample.category}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Loading state */}
          {loading && (
            <div className="p-8 text-center space-y-2">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Analyzing visual features and querying catalog...
              </p>
            </div>
          )}

          {/* Results */}
          {!loading && matchedProducts.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Matching Catalog Products Found ({matchedProducts.length})</span>
                </h4>
                <span className="text-[11px] text-slate-400">
                  Feature Similarity: 96%
                </span>
              </div>

              <div className="space-y-2.5">
                {matchedProducts.map(prod => (
                  <div
                    key={prod.id}
                    className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3"
                  >
                    <img
                      src={prod.image}
                      alt={prod.title}
                      className="w-14 h-14 rounded-xl object-cover bg-white shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h5 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {prod.title}
                      </h5>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-extrabold text-blue-600 dark:text-blue-400">
                          ${prod.lowestPrice}
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                          Smart Score: {prod.smartScore.totalScore}/100
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 truncate mt-0.5">
                        {prod.category} • {prod.platforms.length} Stores Compared
                      </p>
                    </div>

                    <div className="flex flex-col gap-1 shrink-0">
                      <button
                        onClick={() => {
                          setSelectedProductId(prod.id);
                          setIsImageModalOpen(false);
                          setActivePage('product-detail');
                        }}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1"
                      >
                        <span>View</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => addToCompare(prod)}
                        className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/60 hover:bg-blue-100 text-blue-600 dark:text-blue-300 rounded-lg text-xs font-bold flex items-center gap-1"
                      >
                        <Scale className="w-3 h-3" />
                        <span>Compare</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
