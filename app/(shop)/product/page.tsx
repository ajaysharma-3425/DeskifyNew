"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FiFilter, FiSearch, FiChevronRight, FiHeart, FiGrid, FiList, FiRefreshCw } from "react-icons/fi";
import { useSearchParams } from "next/navigation";

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  category?: string;
}

function ProductsContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [maxPrice, setMaxPrice] = useState<number>(500000);
  const [whitelistIds, setWhitelistIds] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("whitelist");
    if (saved) setWhitelistIds(JSON.parse(saved));
  }, []);

  const toggleWhitelist = (id: string) => {
    let updated = whitelistIds.includes(id)
      ? whitelistIds.filter((item) => item !== id)
      : [...whitelistIds, id];
    setWhitelistIds(updated);
    localStorage.setItem("whitelist", JSON.stringify(updated));
  };

  const searchParams = useSearchParams();
  useEffect(() => {
    const query = searchParams.get("search");
    if (query) setSearchQuery(query);
  }, [searchParams]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("System Link Failure: Data not found");
      const data = await res.json();
      const fetchedProducts = data.products || [];
      setProducts(fetchedProducts);
      if (fetchedProducts.length > 0) {
        setMaxPrice(Math.max(...fetchedProducts.map((p: Product) => p.price)));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Protocol Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const categories = useMemo(() => {
    const uniqueCats = Array.from(new Set(products.map((p) => p.category || "General")));
    return ["All", ...uniqueCats];
  }, [products]);

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || (p.category || "General") === selectedCategory;
    const matchesPrice = p.price <= maxPrice;
    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <div className="min-h-screen bg-[#003F3A] pb-20 selection:bg-[#A4F000] selection:text-[#003F3A]">
      
      {/* --- HEADER SECTION --- */}
      <div className="bg-[#003632] pt-32 pb-24 px-6 border-b border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#A4F000]/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-8"
          >
            <div className="space-y-4">
              <nav className="flex items-center gap-2 text-[#A4F000] text-[10px] font-black uppercase tracking-[0.3em]">
                <Link href="/" className="hover:opacity-60 transition-opacity">Main</Link>
                <FiChevronRight className="opacity-40" />
                <span className="text-white/40">Inventory</span>
              </nav>
              <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic">
                THE <span className="text-[#A4F000]">ARCHIVE</span>
              </h1>
            </div>

            <div className="relative w-full md:w-[450px] group">
              <input
                type="text"
                placeholder="Locate protocol / product..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] py-5 px-8 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-[#A4F000]/50 transition-all backdrop-blur-xl"
              />
              <FiSearch className="absolute right-6 top-1/2 -translate-y-1/2 text-[#A4F000] size-6 group-focus-within:animate-pulse" />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          
          {/* --- SIDEBAR FILTERS --- */}
          <aside className="space-y-8 bg-[#004d47] p-8 rounded-[3rem] border border-white/5 h-fit lg:sticky lg:top-24 shadow-2xl">
            <div>
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-white font-black text-sm tracking-widest flex items-center gap-3">
                  <FiFilter className="text-[#A4F000]" /> FILTERS
                </h3>
                {(selectedCategory !== "All" || searchQuery !== "") && (
                  <button
                    onClick={() => { setSelectedCategory("All"); setSearchQuery(""); }}
                    className="text-[10px] font-black text-[#A4F000] hover:text-white transition-colors tracking-tighter"
                  >
                    RESET SYSTEM
                  </button>
                )}
              </div>

              <div className="flex flex-wrap lg:flex-col gap-2">
                {categories.map((cat) => (
                  <FilterOption
                    key={cat}
                    label={cat}
                    active={selectedCategory === cat}
                    onClick={() => setSelectedCategory(cat)}
                  />
                ))}
              </div>
            </div>

            <hr className="border-white/5" />

            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-white/40 font-black uppercase text-[10px] tracking-widest">
                  Price Limit
                </h3>
                <span className="text-sm font-black text-[#A4F000]">
                  ₹{maxPrice.toLocaleString("en-IN")}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max={products.length > 0 ? Math.max(...products.map((p) => p.price)) : 100000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full h-1.5 bg-[#003F3A] rounded-lg appearance-none cursor-pointer accent-[#A4F000]"
              />
              <div className="flex justify-between text-[10px] font-black text-white/20 mt-4 tracking-widest">
                <span>0.00</span>
                <span>MAX_CAP</span>
              </div>
            </div>
          </aside>

          {/* --- MAIN CONTENT --- */}
          <main className="lg:col-span-3">
            <div className="flex items-center justify-between mb-10 text-white/40 px-4">
              <p className="text-xs font-black uppercase tracking-widest">
                Nodes Found: <span className="text-[#A4F000]">{filteredProducts.length}</span>
              </p>
              <div className="flex items-center gap-4">
                <FiGrid className="text-[#A4F000] cursor-pointer size-5" />
                <FiList className="hover:text-white cursor-pointer size-5 transition-colors" />
              </div>
            </div>

            {loading ? (
              <LoadingGrid />
            ) : error ? (
              <ErrorState error={error} retry={fetchProducts} />
            ) : (
              <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                <AnimatePresence mode="popLayout">
                  {filteredProducts.map((product, idx) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      index={idx}
                      isWhitelisted={whitelistIds.includes(product._id)}
                      onToggle={() => toggleWhitelist(product._id)}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}

            {!loading && filteredProducts.length === 0 && (
              <div className="text-center py-40 bg-white/5 rounded-[4rem] border border-dashed border-white/10">
                <FiSearch className="mx-auto size-16 text-[#A4F000]/20 mb-6" />
                <p className="text-white/30 font-black text-2xl uppercase italic tracking-tighter">
                  "No Data in Current Filter"
                </p>
                <button
                  onClick={() => { setSelectedCategory("All"); setSearchQuery(""); }}
                  className="mt-6 text-[#A4F000] font-black text-xs uppercase tracking-widest border-b border-[#A4F000]/30 hover:border-[#A4F000] pb-1 transition-all"
                >
                  Override all filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#003F3A]" />}>
      <ProductsContent />
    </Suspense>
  );
}

/* --- REUSABLE COMPONENTS --- */

function ProductCard({ product, isWhitelisted, onToggle }: any) {
  const getDiscount = (id: string, category: string) => {
    const lastDigit = id.slice(-1).charCodeAt(0);
    if (category === "Electronics") return 15 + (lastDigit % 11);
    if (category === "Fashion") return 30 + (lastDigit % 11);
    return 20 + (lastDigit % 11);
  };

  const discountPercent = getDiscount(product._id, product.category || "General");
  const mrp = Math.round(product.price / (1 - discountPercent / 100));

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group bg-[#004d47] rounded-[3rem] border border-white/5 p-3 hover:border-[#A4F000]/50 transition-all duration-500 shadow-xl"
    >
      <Link href={`/product/${product._id}`}>
        <div className="relative aspect-square rounded-[2.5rem] overflow-hidden bg-[#003F3A] mb-6">
          <img
            src={product.image || "/placeholder.jpg"}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-80 group-hover:opacity-100"
          />

          <div className="absolute top-0 left-0">
            <div className="bg-[#A4F000] text-[#003F3A] text-[10px] font-black px-4 py-2 rounded-br-[1.5rem] shadow-lg flex flex-col items-center">
              <span className="leading-none">{discountPercent}%</span>
              <span className="text-[7px] uppercase tracking-tighter opacity-70">DISC</span>
            </div>
          </div>

          <button
            onClick={(e) => { e.preventDefault(); onToggle(); }}
            className={`absolute top-3 right-3 backdrop-blur-xl p-4 rounded-2xl shadow-2xl transition-all transform md:opacity-0 md:group-hover:opacity-100 md:translate-y-2 md:group-hover:translate-y-0
              ${isWhitelisted ? "bg-[#A4F000] text-[#003F3A]" : "bg-white/10 text-white hover:bg-[#A4F000] hover:text-[#003F3A]"}
            `}
          >
            <FiHeart fill={isWhitelisted ? "currentColor" : "none"} className="size-5" />
          </button>
        </div>
      </Link>

      <div className="px-5 pb-5">
        <p className="text-[9px] font-black text-[#A4F000] uppercase tracking-[0.2em] mb-2">
          {product.category || "General"}
        </p>
        <Link href={`/product/${product._id}`}>
          <h2 className="text-xl font-bold text-white line-clamp-1 group-hover:text-[#A4F000] transition-colors uppercase italic tracking-tight">
            {product.name}
          </h2>
        </Link>
        <div className="flex items-end justify-between mt-6">
          <div>
            <p className="text-[10px] font-black text-white/20 line-through">
              ₹{mrp.toLocaleString("en-IN")}
            </p>
            <p className="text-3xl font-black text-[#A4F000] tracking-tighter italic leading-none">
              ₹{product.price.toLocaleString("en-IN")}
            </p>
          </div>
          <Link href={`/product/${product._id}`} className="size-12 bg-white/5 hover:bg-[#A4F000] text-white hover:text-[#003F3A] rounded-2xl flex items-center justify-center transition-all shadow-inner">
            <FiChevronRight size={20} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

function FilterOption({ label, active, onClick }: any) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center justify-between py-3.5 px-6 rounded-2xl cursor-pointer transition-all duration-300 ${active
          ? "bg-[#A4F000] text-[#003F3A] font-black scale-[1.02]"
          : "text-white/40 hover:bg-white/5 hover:text-white"
        }`}
    >
      <span className="text-[11px] font-black uppercase tracking-widest">{label}</span>
      {active && <div className="size-2 bg-[#003F3A] rounded-full animate-pulse" />}
    </div>
  );
}

function LoadingGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-[#004d47] rounded-[3rem] p-4 border border-white/5 animate-pulse">
          <div className="aspect-square bg-[#003F3A] rounded-[2.5rem] mb-6" />
          <div className="space-y-4 px-2">
            <div className="h-3 bg-[#003F3A] rounded w-1/4" />
            <div className="h-6 bg-[#003F3A] rounded w-3/4" />
            <div className="h-10 bg-[#003F3A] rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ErrorState({ error, retry }: any) {
  return (
    <div className="text-center py-32 bg-[#A4F000]/5 rounded-[4rem] border border-dashed border-[#A4F000]/20">
      <p className="text-[#A4F000] font-black mb-8 italic text-xl uppercase tracking-tighter">“{error}”</p>
      <button
        onClick={retry}
        className="flex items-center gap-3 mx-auto px-10 py-5 bg-[#A4F000] text-[#003F3A] rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-105 transition-all shadow-2xl"
      >
        <FiRefreshCw className="animate-spin-slow" /> Re-Link System
      </button>
    </div>
  );
}