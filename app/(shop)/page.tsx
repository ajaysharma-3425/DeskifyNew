"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion"; // Optional: npm install framer-motion
import { 
  FiShoppingCart, FiArrowRight, FiSearch, FiTruck, 
  FiShield, FiHeadphones, FiRefreshCw, FiZap, FiStar 
} from "react-icons/fi";

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  category?: string;
}

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch("/api/products");
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setFeaturedProducts((data.products || []).slice(0, 4));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="bg-[#FDFDFD] min-h-screen font-sans selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* --- ELITE HERO SECTION --- */}
      <section className="relative w-full pt-12 pb-24 md:pt-20 md:pb-32 overflow-hidden bg-[#0F172A]">
        {/* Dynamic Light Blobs */}
        <div className="absolute top-[-10%] left-[-5%] w-[50%] h-[60%] bg-emerald-500/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[50%] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-bold tracking-wide uppercase">
                <FiZap className="animate-pulse" /> New Season Arrival
              </div>
              
              <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.1] tracking-tight">
                The Future of <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-300">
                  Premium Shopping
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-slate-400 max-w-xl leading-relaxed">
                Experience a curated marketplace where quality meets engineering. 
                Fast delivery, industrial-grade security, and 24/7 elite support.
              </p>

              <div className="flex flex-wrap gap-5">
                <Link href="/product" className="group flex items-center gap-3 bg-emerald-500 hover:bg-emerald-400 text-slate-900 px-10 py-5 rounded-2xl font-bold transition-all hover:scale-105 hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.4)]">
                  Start Shopping <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
                
                {/* Visual Search Bar */}
                <div className="relative group min-w-[300px]">
                  <input
                    type="text"
                    placeholder="Search premium goods..."
                    className="w-full px-6 py-5 rounded-2xl bg-white/5 border border-white/10 text-white backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                  />
                  <button className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-emerald-500 text-white hover:text-slate-900 rounded-xl transition-all">
                    <FiSearch size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Graphic Layout */}
            <div className="lg:col-span-5 relative hidden lg:block">
              <div className="relative z-10 bg-gradient-to-br from-white/10 to-white/5 p-8 rounded-[3rem] border border-white/10 backdrop-blur-sm">
                 <div className="aspect-[4/5] bg-slate-800 rounded-[2rem] overflow-hidden flex items-center justify-center border border-white/5 shadow-2xl">
                    <Image 
                      src="/logo.png" 
                      alt="Hero" 
                      width={400} 
                      height={400} 
                      priority
                      className="opacity-80 brightness-110 object-contain drop-shadow-[0_0_30px_rgba(16,185,129,0.3)]"
                    />
                 </div>
              </div>
              {/* Floating Decorative Card */}
              <div className="z-10 absolute -bottom-10 -left-10 bg-white p-6 rounded-3xl shadow-2xl animate-bounce-slow">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-amber-100 rounded-2xl text-amber-600"><FiStar fill="currentColor" /></div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">Trustpilot</p>
                    <p className="text-lg font-black text-slate-900">4.9/5 Rating</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- VALUE PROPOSITION (GRID) --- */}
      <section className="max-w-7xl mx-auto px-6 -mt-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <FeatureCard icon={<FiTruck />} title="Rapid Logistics" desc="Express delivery in 72hrs" />
          <FeatureCard icon={<FiShield />} title="Encrypted" desc="AES-256 Secure Payments" />
          <FeatureCard icon={<FiHeadphones />} title="Global Care" desc="24/7 Expert Support" />
          <FeatureCard icon={<FiRefreshCw />} title="Easy Returns" desc="30-day No-Question Policy" />
        </div>
      </section>

      {/* --- TRENDING PRODUCTS --- */}
      <section id="featured" className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="space-y-4">
              <span className="text-emerald-500 font-black tracking-widest uppercase text-xs italic">The Catalog</span>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none">
                CURATED <span className="text-slate-300">EXCELLENCE</span>
              </h2>
            </div>
            <Link href="/product" className="inline-flex items-center gap-2 text-slate-900 font-bold border-b-2 border-emerald-500 pb-1 hover:text-emerald-500 transition-colors">
              Explore All Collection <FiArrowRight />
            </Link>
          </div>

          {loading ? (
            <LoadingSkeleton />
          ) : error ? (
            <ErrorMessage error={error} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* --- CTA PROMO BANNER --- */}
      <section className="px-6 pb-24">
        <div className="max-w-7xl mx-auto bg-emerald-500 rounded-[3rem] p-12 md:p-20 relative overflow-hidden">
          {/* Decorative Circle */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400 rounded-full -mr-20 -mt-20 opacity-50 blur-3xl" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="text-center md:text-left space-y-4">
              <h2 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight">
                Unlock 50% <br />
                <span className="text-white">Summer Discount</span>
              </h2>
              <p className="text-emerald-900/70 font-bold text-lg">Limited items available. Secure yours today.</p>
            </div>
            <Link href="/product" className="bg-slate-900 text-white px-12 py-6 rounded-3xl font-black text-xl hover:scale-105 transition-all shadow-xl shadow-emerald-700/20">
              Claim Discount
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

/* --- REUSABLE COMPONENTS --- */

function FeatureCard({ icon, title, desc }: any) {
  return (
    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl hover:shadow-2xl transition-all group hover:-translate-y-2">
      <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-500">
        {icon}
      </div>
      <h3 className="text-lg font-black text-slate-900 mb-1 tracking-tight">{title}</h3>
      <p className="text-slate-400 text-sm font-medium">{desc}</p>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const [imgError, setImgError] = useState(false);
  return (
    <div className="group">
      <div className="relative aspect-[4/5] bg-slate-100 rounded-[2.5rem] overflow-hidden mb-6 border border-slate-100">
        {!imgError ? (
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-200">No Image</div>
        )}
        
        {/* Floating Action Bar */}
        <div className="absolute inset-x-4 bottom-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
          <button className="w-full bg-white/90 backdrop-blur-md py-4 rounded-2xl text-slate-900 font-bold flex items-center justify-center gap-2 hover:bg-emerald-500 hover:text-white transition-colors">
            <FiShoppingCart /> Add to Cart
          </button>
        </div>
      </div>
      
      <div className="px-2 space-y-1">
        <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest">{product.category || 'Lifestyle'}</p>
        <h3 className="text-xl font-black text-slate-900 truncate tracking-tight">{product.name}</h3>
        <p className="text-2xl font-black text-emerald-600">₹{product.price.toLocaleString()}</p>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-[4/5] bg-slate-200 rounded-[2.5rem] mb-6" />
          <div className="h-4 bg-slate-200 rounded w-1/3 mb-2" />
          <div className="h-6 bg-slate-200 rounded w-3/4 mb-2" />
          <div className="h-8 bg-slate-200 rounded w-1/2" />
        </div>
      ))}
    </div>
  );
}

function ErrorMessage({ error }: { error: string }) {
  return (
    <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
      <p className="text-slate-400 font-bold mb-6 italic">"{error}"</p>
      <button onClick={() => window.location.reload()} className="bg-emerald-500 text-white px-8 py-3 rounded-full font-bold">
        Retry Protocol
      </button>
    </div>
  );
}