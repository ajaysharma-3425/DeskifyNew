"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
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
    <div className="bg-[#003F3A] min-h-screen font-sans selection:bg-[#A4F000] selection:text-[#003F3A]">

      {/* --- ELITE HERO SECTION --- */}
      <section className="relative w-full pt-12 pb-24 md:pt-20 md:pb-32 overflow-hidden border-b border-amber-300 bg-[#003F3A]">
        {/* Dynamic Glow Blobs */}
        <div className="absolute top-[-10%] left-[-5%] w-[50%] h-[60%] bg-[#A4F000]/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[50%] bg-[#A4F000]/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">

            {/* Left Content */}
            <div className="lg:col-span-7 space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#A4F000]/10 border border-[#A4F000]/20 text-[#A4F000] text-xs font-black tracking-widest uppercase">
                <FiZap className="animate-pulse" /> System Active: New Arrivals
              </div>

              <h1 className="text-5xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter uppercase italic">
                Next Gen <br />
                <span className="text-[#A4F000]">Curations</span>
              </h1>

              <p className="text-lg md:text-xl text-white/50 max-w-xl leading-relaxed font-medium">
                Experience a curated marketplace where high-end engineering meets luxury. 
                Encrypted transactions. Global logistics. Elite support.
              </p>

              <div className="flex flex-wrap gap-5">
                <Link href="/product" className="group flex items-center gap-3 bg-[#A4F000] hover:bg-white text-[#003F3A] px-10 py-5 rounded-2xl font-black transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(164,240,0,0.3)]">
                  START PROTOCOL <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>

                <div className="relative group min-w-[320px]">
                  <input
                    type="text"
                    placeholder="Search the archive..."
                    className="w-full px-6 py-5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-[#A4F000]/50 transition-all"
                  />
                  <button className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-[#A4F000] text-[#003F3A] rounded-xl hover:scale-95 transition-all">
                    <FiSearch size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Graphic Layout */}
            <div className="lg:col-span-5 relative hidden lg:block">
              <div className="relative z-10 bg-white/5 p-8 rounded-[4rem] border border-white/10 backdrop-blur-sm">
                <div className="aspect-[4/5] bg-[#004d47] rounded-[3rem] overflow-hidden flex items-center justify-center border border-white/5 shadow-2xl relative group">
                   <div className="absolute inset-0 bg-gradient-to-t from-[#A4F000]/20 to-transparent opacity-40 group-hover:opacity-60 transition-opacity"></div>
                   <span className="text-[#A4F000] font-black text-9xl opacity-10 tracking-tighter">DESK</span>
                </div>
              </div>
              
              {/* Floating Trusted Card */}
              <div className="z-20 absolute -bottom-6 -left-10 bg-[#A4F000] p-6 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-[#003F3A] rounded-2xl text-[#A4F000] shadow-inner"><FiStar fill="currentColor" /></div>
                  <div>
                    <p className="text-[10px] font-black text-[#003F3A]/40 uppercase tracking-widest">Global Status</p>
                    <p className="text-xl font-black text-[#003F3A]">4.9/5 RATING</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- VALUE PROPOSITION --- */}
      <section className="max-w-7xl mx-auto px-6 -mt-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <FeatureCard icon={<FiTruck />} title="Rapid Logistics" desc="Express delivery in 72hrs" />
          <FeatureCard icon={<FiShield />} title="Encrypted" desc="AES-256 Secure Payments" />
          <FeatureCard icon={<FiHeadphones />} title="Global Care" desc="24/7 Expert Support" />
          <FeatureCard icon={<FiRefreshCw />} title="Easy Returns" desc="30-day No-Question Policy" />
        </div>
      </section>

      {/* --- TRENDING PRODUCTS --- */}
      <section id="featured" className="py-24 md:py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="space-y-4">
              <span className="text-[#A4F000] font-black tracking-[0.3em] uppercase text-xs">Access Catalog</span>
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-none uppercase italic">
                CURATED <span className="text-[#A4F000]">STOCKS</span>
              </h2>
            </div>
            <Link href="/product" className="group inline-flex items-center gap-2 text-white/50 font-black text-xs uppercase tracking-widest border-b border-white/10 pb-2 hover:text-[#A4F000] hover:border-[#A4F000] transition-all">
              See All Inventory <FiArrowRight className="group-hover:translate-x-2 transition-transform" />
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
        <div className="max-w-7xl mx-auto bg-[#A4F000] rounded-[4rem] p-12 md:p-24 relative overflow-hidden shadow-[0_0_60px_rgba(164,240,0,0.2)]">
          {/* Tech Pattern Decoration */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#003F3A] rounded-full -mr-40 -mt-40 opacity-10 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full -ml-32 -mb-32 opacity-20 blur-3xl" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="text-center md:text-left space-y-4">
              <h2 className="text-5xl md:text-7xl font-black text-[#003F3A] leading-[0.9] uppercase italic tracking-tighter">
                Summer <br />
                <span className="bg-[#003F3A] text-[#A4F000] px-4 py-1 inline-block mt-2">Discount 50%</span>
              </h2>
              <p className="text-[#003F3A]/60 font-black text-sm uppercase tracking-widest">Limited availability. Update your setup now.</p>
            </div>
            <Link href="/product" className="bg-[#003F3A] text-[#A4F000] px-16 py-8 rounded-[2.5rem] font-black text-2xl hover:bg-white hover:text-[#003F3A] transition-all shadow-2xl hover:scale-105 active:scale-95 uppercase tracking-tighter">
              Claim Access
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
    <div className="bg-[#004d47] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl group hover:border-[#A4F000]/40 transition-all duration-500">
      <div className="w-16 h-16 bg-[#003F3A] text-[#A4F000] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#A4F000] group-hover:text-[#003F3A] transition-all duration-500 shadow-inner">
        {icon}
      </div>
      <h3 className="text-lg font-black text-white mb-1 tracking-tight uppercase italic">{title}</h3>
      <p className="text-white/40 text-sm font-medium">{desc}</p>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const [imgError, setImgError] = useState(false);
  return (
    <div className="group">
      <div className="relative aspect-[4/5] bg-[#004d47] rounded-[3rem] overflow-hidden mb-6 border border-white/5 group-hover:border-[#A4F000]/30 transition-all duration-500">
        {!imgError ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out opacity-80 group-hover:opacity-100"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#003F3A] text-white/10 font-black">NO IMAGE</div>
        )}

        {/* Action Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#003F3A] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="absolute inset-x-6 bottom-6 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
          <button className="w-full bg-[#A4F000] text-[#003F3A] py-5 rounded-[1.5rem] font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2 hover:bg-white transition-colors shadow-2xl">
            <FiShoppingCart size={16} /> Add to Cart
          </button>
        </div>
      </div>

      <div className="px-4 space-y-1">
        <p className="text-[10px] font-black text-[#A4F000] uppercase tracking-[0.2em]">{product.category || 'Lifestyle'}</p>
        <h3 className="text-xl font-bold text-white truncate tracking-tight group-hover:text-[#A4F000] transition-colors uppercase italic">{product.name}</h3>
        <p className="text-2xl font-black text-white/90 tracking-tighter italic">₹{product.price.toLocaleString()}</p>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-[4/5] bg-white/5 rounded-[3rem] mb-6" />
          <div className="h-3 bg-white/5 rounded w-1/4 mb-3" />
          <div className="h-6 bg-white/5 rounded w-3/4 mb-3" />
          <div className="h-8 bg-white/5 rounded w-1/2" />
        </div>
      ))}
    </div>
  );
}

function ErrorMessage({ error }: { error: string }) {
  return (
    <div className="text-center py-20 bg-white/5 rounded-[3rem] border border-white/10">
      <p className="text-white/40 font-black mb-6 uppercase tracking-widest">Protocol Error: {error}</p>
      <button onClick={() => window.location.reload()} className="bg-[#A4F000] text-[#003F3A] px-10 py-4 rounded-full font-black uppercase text-xs tracking-widest">
        Restart System
      </button>
    </div>
  );
}