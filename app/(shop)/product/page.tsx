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

// --- 1. Main logic component wrap in Suspense ---
function ProductsContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Filter States ---
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [maxPrice, setMaxPrice] = useState<number>(500000);
  // --- WHITELIST STATE ---
  const [whitelistIds, setWhitelistIds] = useState<string[]>([]);

  // Load whitelist from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("whitelist");
    if (saved) {
      setWhitelistIds(JSON.parse(saved));
    }
  }, []);

  const toggleWhitelist = (id: string) => {
    let updated;
    if (whitelistIds.includes(id)) {
      updated = whitelistIds.filter((item) => item !== id);
    } else {
      updated = [...whitelistIds, id];
    }
    setWhitelistIds(updated);
    localStorage.setItem("whitelist", JSON.stringify(updated));
  };

  const searchParams = useSearchParams();
  useEffect(() => {
    const query = searchParams.get("search");
    if (query) {
      setSearchQuery(query);
    }
  }, [searchParams]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      const fetchedProducts = data.products || [];
      setProducts(fetchedProducts);

      if (fetchedProducts.length > 0) {
        const highestPrice = Math.max(...fetchedProducts.map((p: Product) => p.price));
        setMaxPrice(highestPrice);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

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
    <div className="min-h-screen bg-[#FDFDFD] pb-20">
      {/* --- HEADER SECTION --- */}
      <div className="bg-[#0F172A] pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6"
          >
            <div>
              <nav className="flex items-center gap-2 text-emerald-400 text-sm font-bold uppercase tracking-widest mb-4">
                <Link href="/">Home</Link>
                <FiChevronRight />
                <span className="text-slate-400">Store</span>
              </nav>
              <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter">
                PREMIUM <span className="text-emerald-500 italic">COLLECTION</span>
              </h1>
            </div>

            <div className="relative w-full md:w-96">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              />
              <FiSearch className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 size-5" />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* --- SIDEBAR FILTERS --- */}
          <aside className="space-y-8 bg-white p-6 sm:p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 h-fit lg:sticky lg:top-24">
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-slate-900 font-black flex items-center gap-2">
                  <FiFilter className="text-emerald-500" /> FILTERS
                </h3>
                {(selectedCategory !== "All" || searchQuery !== "") && (
                  <button
                    onClick={() => {
                      setSelectedCategory("All");
                      setSearchQuery("");
                    }}
                    className="text-[10px] font-bold text-emerald-600 hover:underline underline-offset-4"
                  >
                    RESET
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

            <hr className="border-slate-100" />

            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-slate-900 font-black uppercase text-xs tracking-widest text-slate-400">
                  Price Range
                </h3>
                <span className="text-xs font-black text-emerald-600">
                  ₹{maxPrice.toLocaleString("en-IN")}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max={products.length > 0 ? Math.max(...products.map((p) => p.price)) : 100000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-2">
                <span>₹0</span>
                <span>MAX</span>
              </div>
            </div>
          </aside>

          {/* --- MAIN CONTENT --- */}
          <main className="lg:col-span-3">
            <div className="flex items-center justify-between mb-8 text-slate-500 font-medium px-2">
              <p className="text-sm">
                Showing <span className="text-slate-900 font-bold">{filteredProducts.length}</span> results
                {selectedCategory !== "All" && (
                  <span>
                    {" "}
                    in <span className="text-emerald-600">{selectedCategory}</span>
                  </span>
                )}
              </p>
              <div className="flex items-center gap-4 text-slate-400">
                <FiGrid className="text-emerald-500 cursor-pointer size-5" />
                <FiList className="hover:text-slate-900 cursor-pointer size-5 transition-colors" />
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
              <div className="text-center py-40 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                <FiSearch className="mx-auto size-12 text-slate-200 mb-4" />
                <p className="text-slate-400 font-bold text-xl italic">
                  "No items match your specific filters"
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory("All");
                    setSearchQuery("");
                  }}
                  className="mt-4 text-emerald-500 font-bold hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

// --- 2. Final Export with Suspense ---
export default function ProductsPage() {
  return (
    <Suspense fallback={<LoadingGrid />}>
      <ProductsContent />
    </Suspense>
  );
}

/* --- SUB-COMPONENTS --- */

function ProductCard({
  product,
  index,
  isWhitelisted,
  onToggle,
}: {
  product: Product;
  index: number;
  isWhitelisted: boolean;
  onToggle: () => void;
}) {
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
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -10 }}
      className="group bg-white rounded-[2.5rem] border border-slate-100 p-3 hover:shadow-2xl hover:shadow-slate-200/60 transition-all duration-500"
    >
      <Link href={`/product/${product._id}`}>
        <div className="relative aspect-square rounded-[2rem] overflow-hidden bg-slate-50 mb-6">
          <img
            src={product.image || "/placeholder.jpg"}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />

          <div className="absolute top-0 left-0">
            <div className="bg-rose-600 text-white text-[10px] font-black px-4 py-2 rounded-br-[1.5rem] shadow-lg flex flex-col items-center">
              <span className="leading-none">{discountPercent}%</span>
              <span className="text-[7px] uppercase tracking-tighter opacity-80">OFF</span>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              onToggle();
            }}
            className={`absolute top-2 right-3 backdrop-blur-md p-3 rounded-2xl shadow-lg 
                        transition-all transform translate-y-2 group-hover:translate-y-0
                         opacity-0 group-hover:opacity-100
                    ${
                      isWhitelisted
                        ? "bg-rose-500 text-white opacity-100"
                        : "bg-white/90 text-slate-400 hover:text-rose-500"
                    }
  `}
          >
            <FiHeart fill={isWhitelisted ? "white" : "none"} className="size-5" />
          </button>
        </div>
      </Link>

      <div className="px-4 pb-4">
        <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">
          {product.category || "General"}
        </p>
        <Link href={`/product/${product._id}`}>
          <h2 className="text-lg font-bold text-slate-900 line-clamp-1 group-hover:text-emerald-600 transition-colors">
            {product.name}
          </h2>
        </Link>
        <div className="flex items-end justify-between mt-4">
          <div>
            <p className="text-[10px] font-bold text-slate-400 line-through">
              ₹{mrp.toLocaleString("en-IN")}
            </p>
            <p className="text-2xl font-black text-slate-900 tracking-tighter">
              ₹{product.price.toLocaleString("en-IN")}
            </p>
          </div>
          <Link
            href={`/product/${product._id}`}
            className="text-xs font-black uppercase text-slate-400 group-hover:text-emerald-500 transition-colors mb-1"
          >
            Details +
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

function FilterOption({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center justify-between py-2.5 px-4 rounded-xl cursor-pointer transition-all duration-300 ${
        active
          ? "bg-emerald-50 text-emerald-600 font-bold translate-x-2"
          : "text-slate-500 hover:bg-slate-50 hover:translate-x-1"
      }`}
    >
      <span className="text-sm tracking-tight capitalize">{label}</span>
      {active && (
        <motion.div layoutId="activeDot" className="size-1.5 bg-emerald-500 rounded-full" />
      )}
    </div>
  );
}

function LoadingGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white rounded-[2.5rem] p-4 border border-slate-100 animate-pulse">
          <div className="aspect-square bg-slate-100 rounded-[2rem] mb-6" />
          <div className="space-y-3 px-2">
            <div className="h-4 bg-slate-100 rounded w-1/4" />
            <div className="h-6 bg-slate-100 rounded w-3/4" />
            <div className="h-8 bg-slate-100 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ErrorState({ error, retry }: { error: string; retry: () => void }) {
  return (
    <div className="text-center py-32 bg-rose-50 rounded-[3rem] border-2 border-dashed border-rose-100">
      <p className="text-rose-500 font-bold mb-6 italic text-lg">“{error}”</p>
      <button
        onClick={retry}
        className="flex items-center gap-2 mx-auto px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-black transition-all"
      >
        <FiRefreshCw /> Re-initiate Protocol
      </button>
    </div>
  );
}