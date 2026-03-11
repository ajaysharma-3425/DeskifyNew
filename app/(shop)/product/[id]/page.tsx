"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiChevronRight, FiHeart, FiShare2, FiShield,
  FiTruck, FiRotateCcw, FiPlus, FiMinus, FiCheckCircle, FiZap
} from "react-icons/fi";
import AddToCartButton from "@/components/AddToCartButton";

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category?: string;
  sku?: string;
  inStock?: boolean;
}

export default function ProductDetails() {
  const params = useParams();
  const id = params?.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState("description");

  // Discount Logic: Same as Products Page
  const getDiscount = (pid: string, cat: string) => {
    const lastDigit = pid.slice(-1).charCodeAt(0);
    if (cat === "Electronics") return 15 + (lastDigit % 11);
    if (cat === "Fashion") return 30 + (lastDigit % 11);
    return 20 + (lastDigit % 11);
  };

  useEffect(() => {
    const fetchFullData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();
        const mainProduct = data.product;
        setProduct(mainProduct);

        const relRes = await fetch(`/api/products`);
        const relData = await relRes.json();
        if (relData.products) {
          const filtered = relData.products
            .filter((p: Product) => p.category === mainProduct.category && p._id !== mainProduct._id)
            .slice(0, 4);
          setRelatedProducts(filtered);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    fetchFullData();
  }, [id]);

  useEffect(() => {
    if (id) {
      const saved = JSON.parse(localStorage.getItem("whitelist") || "[]");
      setIsWishlisted(saved.includes(id));
    }
  }, [id]);

  // 2. Toggle Whitelist Function
  const toggleWhitelist = () => {
    const saved = JSON.parse(localStorage.getItem("whitelist") || "[]");
    let updated;
    if (saved.includes(id)) {
      updated = saved.filter((itemId: string) => itemId !== id);
      setIsWishlisted(false);
    } else {
      updated = [...saved, id];
      setIsWishlisted(true);
    }
    localStorage.setItem("whitelist", JSON.stringify(updated));
  };

  const discountPercent = useMemo(() => {
    if (!product) return 0;
    return getDiscount(product._id, product.category || "General");
  }, [product]);

  const mrp = useMemo(() => {
    if (!product) return 0;
    return Math.round(product.price / (1 - discountPercent / 100));
  }, [product, discountPercent]);

  if (loading) return <LoadingSkeleton />;
  if (error || !product) return <ErrorState error={error} />;

  return (
    <div className="bg-[#FAFAFB] min-h-screen pb-32">
      {/* BREADCRUMB - Clean & Thin */}
      <div className="max-w-7xl mx-auto px-6 pt-28 pb-6">
        <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
          <Link href="/" className="hover:text-emerald-500 transition-colors">Home</Link>
          <FiChevronRight className="opacity-50" />
          <Link href="/product" className="hover:text-emerald-500 transition-colors">Store</Link>
          <FiChevronRight className="opacity-50" />
          <span className="text-slate-900 truncate max-w-[150px]">{product.name}</span>
        </nav>
      </div>

      <main className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-20 items-start">

          {/* LEFT: IMAGE GALLERY */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative aspect-[4/5] md:aspect-square w-full rounded-[3rem] overflow-hidden bg-white border border-slate-100 shadow-2xl shadow-slate-200/40 group"
            >
              {/* CURVED DISCOUNT BADGE */}
              <div className="absolute top-0 left-0 z-10">
                <div className="bg-rose-600 text-white text-xs font-black px-6 py-3 rounded-br-[2rem] shadow-xl flex flex-col items-center">
                  <span className="text-lg leading-none">{discountPercent}% OFF</span>
                  <span className="text-[8px] uppercase tracking-tighter opacity-80 font-bold">Special Offer</span>
                </div>
              </div>

              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain p-8 lg:p-16 group-hover:scale-105 transition-transform duration-1000"
              />

              <button
                onClick={toggleWhitelist} // Yahan change kiya
                className={`absolute top-6 right-6 p-4 backdrop-blur-md rounded-2xl shadow-lg transition-all active:scale-90
    opacity-100 md:opacity-0 md:translate-y-2 md:group-hover:opacity-100 md:group-hover:translate-y-0
    ${isWishlisted ? "bg-rose-500 text-white" : "bg-white/80 text-slate-400 hover:text-rose-500"}`}
              >
                <FiHeart className={isWishlisted ? "fill-white" : ""} size={22} />
              </button>
            </motion.div>
          </div>

          {/* RIGHT: PRODUCT INFO */}
          <div className="lg:col-span-5 space-y-10">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                  <FiZap className="fill-emerald-600" /> Hot Seller
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                  <FiCheckCircle /> {product.inStock !== false ? "In Stock" : "Limited"}
                </div>
              </div>

              <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-[1.1] tracking-tighter">
                {product.name}
              </h1>

              <div className="flex flex-col">
                <span className="text-slate-400 line-through font-bold text-lg decoration-rose-500/30">
                  ₹{mrp.toLocaleString("en-IN")}
                </span>
                <div className="flex items-center gap-3">
                  <p className="text-5xl font-black text-emerald-600 tracking-tighter">
                    ₹{product.price.toLocaleString("en-IN")}
                  </p>
                  <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black px-2 py-1 rounded-md">
                    SAVE ₹{(mrp - product.price).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* ACTION CARD */}
            <div className="p-8 bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/30 space-y-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16 blur-3xl" />

              <div className="flex items-center justify-between relative z-10">
                <span className="text-slate-900 font-black uppercase text-xs tracking-widest">Select Quantity</span>
                <div className="flex items-center bg-slate-50 rounded-2xl p-1.5 border border-slate-200 shadow-inner">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:text-emerald-500 transition-colors"><FiMinus /></button>
                  <span className="w-12 text-center font-black text-lg text-slate-900">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="p-3 hover:text-emerald-500 transition-colors"><FiPlus /></button>
                </div>
              </div>

              <div className="flex gap-4 relative z-10">
                <div className="flex-grow transform hover:scale-[1.02] transition-transform">
                  <AddToCartButton productId={product._id} quantity={quantity} />
                </div>
                <button className="p-5 bg-slate-900 text-white rounded-[1.5rem] hover:bg-emerald-600 transition-all shadow-xl shadow-slate-900/20 active:scale-95">
                  <FiShare2 size={24} />
                </button>
              </div>
            </div>

            {/* TRUST BADGES - Improved Visuals */}
            <div className="grid grid-cols-3 gap-4 border-t border-slate-100 pt-10">
              <TrustBadge icon={<FiTruck />} label="Fast" sub="Shipping" />
              <TrustBadge icon={<FiShield />} label="Secure" sub="Warranty" />
              <TrustBadge icon={<FiRotateCcw />} label="7-Day" sub="Returns" />
            </div>
          </div>
        </div>

        {/* TABS SECTION */}
        <section className="mt-24 lg:mt-40">
          <div className="flex border-b border-slate-200 gap-8 sm:gap-16 mb-12 overflow-x-auto no-scrollbar justify-center lg:justify-start">
            <TabButton active={activeTab === 'description'} onClick={() => setActiveTab('description')}>Description</TabButton>
            <TabButton active={activeTab === 'specs'} onClick={() => setActiveTab('specs')}>Specifications</TabButton>
            <TabButton active={activeTab === 'shipping'} onClick={() => setActiveTab('shipping')}>Delivery Info</TabButton>
          </div>

          <div className="max-w-4xl min-h-[200px] mx-auto lg:mx-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="text-slate-600 text-lg leading-relaxed font-medium"
              >
                {activeTab === 'description' && (
                  <div className="space-y-4">
                    <p className="whitespace-pre-line first-letter:text-5xl first-letter:font-black first-letter:text-emerald-500 first-letter:mr-3 first-letter:float-left">
                      {product.description}
                    </p>
                  </div>
                )}
                {activeTab === 'specs' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <SpecItem label="SKU" value={product.sku || "N/A"} />
                    <SpecItem label="Category" value={product.category || "General"} />
                    <SpecItem label="Status" value="Quality Certified" />
                    <SpecItem label="Material" value="Premium Grade" />
                  </div>
                )}
                {activeTab === 'shipping' && (
                  <div className="bg-emerald-50 p-8 rounded-[2rem] border border-emerald-100 flex items-start gap-4">
                    <FiTruck className="text-emerald-500 text-3xl mt-1" />
                    <p className="italic">Orders are typically processed within 24-48 hours. We offer worldwide express shipping with real-time tracking IDs provided via email.</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        {/* RELATED PRODUCTS - Improved Grid */}
        {relatedProducts.length > 0 && (
          <section className="mt-24 lg:mt-40">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
              <div>
                <span className="text-emerald-500 font-black uppercase text-xs tracking-[0.3em]">Similar Vibes</span>
                <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter mt-2">More from {product.category}</h2>
              </div>
              <Link href="/product" className="group flex items-center gap-2 text-sm font-black text-slate-900 uppercase tracking-widest">
                View Gallery <FiChevronRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((item) => (
                <RelatedCard key={item._id} product={item} getDiscount={getDiscount} />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* STICKY MOBILE BAR - Modern Pill Style */}
      <div className="lg:hidden fixed bottom-6 left-6 right-6 z-50 transform translate-z-0">
        <div className="bg-slate-900/90 backdrop-blur-2xl text-white rounded-[2.5rem] p-3 flex items-center justify-between shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/10">
          <div className="px-5">
            <p className="text-[9px] font-black uppercase text-emerald-400 tracking-widest">Pricing</p>
            <p className="text-xl font-black tracking-tighter">₹{product.price.toLocaleString()}</p>
          </div>
          <div className="w-[55%]">
            <AddToCartButton productId={product._id} quantity={quantity} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* --- REUSABLE MINI COMPONENTS --- */

function RelatedCard({ product, getDiscount }: { product: Product, getDiscount: any }) {
  const discount = getDiscount(product._id, product.category || "General");
  return (
    <Link href={`/product/${product._id}`} className="group block bg-white p-5 rounded-[2.5rem] border border-slate-100 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 hover:-translate-y-2">
      <div className="relative aspect-square bg-[#F8F9FA] rounded-[2rem] overflow-hidden mb-6">
        {/* MINI BADGE */}
        <div className="absolute top-0 left-0 z-10 bg-rose-500 text-white text-[9px] font-black px-3 py-1.5 rounded-br-2xl">
          {discount}% OFF
        </div>
        <img src={product.image} className="w-full h-full object-contain p-6 group-hover:scale-110 transition-transform duration-700" alt={product.name} />
      </div>
      <div className="space-y-1 px-2">
        <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">{product.category}</p>
        <h3 className="font-bold text-slate-900 text-lg truncate uppercase tracking-tighter group-hover:text-emerald-600 transition-colors">{product.name}</h3>
        <p className="font-black text-slate-900 text-xl tracking-tighter">₹{product.price.toLocaleString()}</p>
      </div>
    </Link>
  );
}

function TrustBadge({ icon, label, sub }: { icon: any, label: string, sub: string }) {
  return (
    <div className="flex flex-col items-center text-center p-4 rounded-3xl hover:bg-white hover:shadow-xl hover:shadow-slate-100 transition-all group">
      <div className="text-emerald-500 text-2xl mb-2 group-hover:scale-110 transition-transform">{icon}</div>
      <div className="flex flex-col">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">{label}</span>
        <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">{sub}</span>
      </div>
    </div>
  );
}

function SpecItem({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex flex-col p-4 bg-slate-50 rounded-2xl border border-slate-100">
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</span>
      <span className="text-slate-900 font-bold">{value}</span>
    </div>
  )
}

function TabButton({ children, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`pb-5 text-sm font-black uppercase tracking-[0.2em] transition-all relative ${active ? 'text-emerald-500' : 'text-slate-300 hover:text-slate-900'}`}
    >
      {children}
      {active && <motion.div layoutId="tabLine" className="absolute bottom-0 left-0 right-0 h-1.5 bg-emerald-500 rounded-full" />}
    </button>
  );
}

function LoadingSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-40 animate-pulse">
      <div className="grid lg:grid-cols-12 gap-20">
        <div className="lg:col-span-7 aspect-square bg-slate-200 rounded-[4rem]" />
        <div className="lg:col-span-5 space-y-12 pt-10">
          <div className="h-6 bg-slate-200 rounded-full w-1/4" />
          <div className="h-24 bg-slate-200 rounded-[2rem] w-full" />
          <div className="h-12 bg-slate-200 rounded-full w-1/3" />
          <div className="h-56 bg-slate-200 rounded-[3rem] w-full" />
        </div>
      </div>
    </div>
  );
}

function ErrorState({ error }: { error: string | null }) {
  return (
    <div className="max-w-7xl mx-auto px-6 py-40 text-center">
      <div className="bg-rose-50 rounded-[4rem] p-16 md:p-24 border-2 border-dashed border-rose-100 max-w-3xl mx-auto">
        <div className="bg-rose-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-rose-200">
          <FiRotateCcw className="text-white text-3xl" />
        </div>
        <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter">Protocol Terminated</h2>
        <p className="text-slate-500 font-medium mb-12 text-lg italic">“{error || "The item could not be retrieved from the main server."}”</p>
        <Link href="/product" className="inline-block bg-slate-900 text-white px-12 py-5 rounded-2xl font-black hover:bg-emerald-600 transition-all shadow-2xl shadow-slate-900/20">Return to Store</Link>
      </div>
    </div>
  );
}