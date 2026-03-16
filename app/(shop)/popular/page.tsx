"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  FiShoppingCart, 
  FiHeart, 
  FiStar, 
  FiZap 
} from "react-icons/fi";

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  category?: string;
  rating?: number;
  reviews?: number;
}

export default function PopularPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const getDiscount = (id: string, category: string) => {
    const lastDigit = id.slice(-1).charCodeAt(0);
    if (category === "Electronics") return 15 + (lastDigit % 11);
    if (category === "Fashion") return 30 + (lastDigit % 11);
    return 20 + (lastDigit % 11);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(data.products?.slice(0, 4) || []);
      } catch (err) {
        console.error("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-[#003F3A] relative overflow-hidden pb-20 selection:bg-[#A4F000] selection:text-[#003F3A]">
      
      {/* --- TECH BACKGROUND ELEMENTS --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-[#A4F000]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[600px] h-[600px] bg-[#A4F000]/10 rounded-full blur-[150px]" />
      </div>

      {/* --- Hero Header --- */}
      <div className="relative z-10 pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#A4F000]/10 border border-[#A4F000]/20 text-[#A4F000] rounded-full text-[10px] font-black uppercase tracking-widest mb-6 shadow-sm"
          >
            <FiZap className="animate-pulse" /> Most Wanted This Week
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-4 italic">
            POPULAR <span className="text-[#A4F000]">PICKS</span>
          </h1>
          <p className="text-white/60 max-w-xl mx-auto font-medium">
            Deskify's community-approved selection. High quality, premium design, and high demand.
          </p>
        </div>
      </div>

      {/* --- Products Grid --- */}
      <div className="max-w-7xl mx-auto px-6 mt-12 relative z-10">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-[450px] bg-white/5 rounded-[2.5rem] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product, index) => {
              const discountPercent = getDiscount(product._id, product.category || "General");
              const mrp = Math.round(product.price / (1 - discountPercent / 100));

              return (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group bg-[#004d47] rounded-[2.5rem] border border-white/10 p-3 hover:border-[#A4F000]/50 transition-all duration-500"
                >
                  {/* Image Area */}
                  <div className="relative aspect-square rounded-[2rem] overflow-hidden bg-[#003F3A] mb-6 shadow-inner">
                    <Link href={`/product/${product._id}`}>
                      <img
                        src={product.image || "/placeholder.jpg"}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                      />
                    </Link>

                    {/* --- SELL TAG (Lime Green Badge) --- */}
                    <div className="absolute top-0 left-0">
                      <div className="bg-[#A4F000] text-[#003F3A] text-[10px] font-black px-4 py-2 rounded-br-[1.5rem] shadow-lg flex flex-col items-center">
                        <span className="leading-none">{discountPercent}%</span>
                        <span className="text-[7px] uppercase tracking-tighter opacity-80">OFF</span>
                      </div>
                    </div>

                    {/* Quick Labels */}
                    <div className="absolute top-3 right-3">
                       <span className="px-3 py-1 bg-[#003F3A]/80 backdrop-blur-md text-[#A4F000] text-[8px] font-black uppercase tracking-tighter rounded-full border border-[#A4F000]/20">
                          {index === 0 ? "Best Seller" : "Trending"}
                       </span>
                    </div>

                    <div className="absolute bottom-4 right-4 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <button className="p-3.5 bg-white text-[#003F3A] rounded-2xl shadow-xl hover:bg-[#A4F000] transition-all active:scale-95">
                        <FiHeart size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Info Area */}
                  <div className="px-4 pb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center text-[#A4F000]">
                        <FiStar fill="currentColor" size={12} />
                        <span className="ml-1 text-white/80 text-[10px] font-black">
                          {(4.5 + (index % 5) / 10).toFixed(1)}
                        </span>
                      </div>
                    </div>

                    <Link href={`/product/${product._id}`}>
                      <h3 className="text-lg font-bold text-white leading-tight mb-4 group-hover:text-[#A4F000] transition-colors line-clamp-1 tracking-tight">
                        {product.name}
                      </h3>
                    </Link>

                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-[10px] font-bold text-white/40 line-through">
                          ₹{mrp.toLocaleString("en-IN")}
                        </p>
                        <p className="text-2xl font-black text-[#A4F000] tracking-tighter">
                          ₹{product.price.toLocaleString("en-IN")}
                        </p>
                      </div>

                      <Link
                        href={`/product/${product._id}`}
                        className="size-12 bg-[#A4F000] text-[#003F3A] rounded-2xl flex items-center justify-center hover:bg-white transition-all shadow-lg active:scale-90"
                      >
                        <FiShoppingCart size={18} />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
      
      {/* --- Footer Link --- */}
      {!loading && (
          <div className="mt-20 text-center">
            <Link href="/product" className="text-[10px] font-black uppercase tracking-[0.3em] text-[#A4F000]/50 hover:text-[#A4F000] transition-all border-b-2 border-white/5 hover:border-[#A4F000] pb-2">
                Explore Full Protocol
            </Link>
          </div>
      )}
    </div>
  );
}