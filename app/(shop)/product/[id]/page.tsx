"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiChevronRight, FiHeart, FiShare2, FiShield,
  FiTruck, FiRotateCcw, FiPlus, FiMinus, FiCheckCircle, FiZap, FiArrowLeft
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
        if (!res.ok) throw new Error("Artifact not found in vault");
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
        setError(err instanceof Error ? err.message : "Protocol Error");
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
    <div className="bg-[#003F3A] min-h-screen pb-32 relative overflow-hidden">
       {/* Background Glows */}
      <div className="absolute top-0 left-[-10%] w-[50%] h-[50%] bg-[#A4F000]/5 blur-[120px] rounded-full pointer-events-none" />
      
      {/* BREADCRUMB */}
      <div className="max-w-7xl mx-auto px-6 pt-28 pb-8 relative z-10">
        <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/30">
          <Link href="/" className="hover:text-[#A4F000] transition-colors">Home</Link>
          <FiChevronRight />
          <Link href="/product" className="hover:text-[#A4F000] transition-colors">Vault</Link>
          <FiChevronRight />
          <span className="text-[#A4F000] truncate max-w-[150px] italic">{product.name}</span>
        </nav>
      </div>

      <main className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-20 items-start">

          {/* LEFT: IMAGE GALLERY */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-square w-full rounded-[3rem] overflow-hidden bg-white/[0.03] border border-white/10 backdrop-blur-md group"
            >
              {/* DISCOUNT BADGE */}
              <div className="absolute top-0 left-0 z-20">
                <div className="bg-[#A4F000] text-[#003F3A] text-xs font-black px-8 py-4 rounded-br-[2.5rem] shadow-2xl flex flex-col items-center italic uppercase">
                  <span className="text-xl leading-none">-{discountPercent}%</span>
                  <span className="text-[8px] tracking-widest font-black mt-1">Artifact Offer</span>
                </div>
              </div>

              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain p-8 lg:p-16 group-hover:scale-110 transition-transform duration-[1.5s] opacity-90 group-hover:opacity-100"
              />

              <button
                onClick={toggleWhitelist}
                className={`absolute top-8 right-8 p-5 backdrop-blur-xl rounded-2xl shadow-2xl transition-all active:scale-90 border border-white/10
                ${isWishlisted ? "bg-[#A4F000] text-[#003F3A]" : "bg-white/5 text-white/40 hover:text-[#A4F000]"}`}
              >
                <FiHeart className={isWishlisted ? "fill-current" : ""} size={24} />
              </button>
            </motion.div>
          </div>

          {/* RIGHT: PRODUCT INFO */}
          <div className="lg:col-span-5 space-y-10">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#A4F000]/10 text-[#A4F000] text-[9px] font-black uppercase tracking-[0.2em] border border-[#A4F000]/20 italic">
                  <FiZap className="fill-current" /> High Demand
                </div>
                <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/5 text-white/40 text-[9px] font-black uppercase tracking-[0.2em] italic">
                  <FiCheckCircle /> {product.inStock !== false ? "Verified Stock" : "Limited Slot"}
                </div>
              </div>

              <h1 className="text-5xl md:text-7xl font-black text-white leading-[0.9] tracking-tighter uppercase italic">
                {product.name}
              </h1>

              <div className="flex flex-col gap-1 pt-4">
                <span className="text-white/20 line-through font-black text-xl tracking-tighter italic">
                  ₹{mrp.toLocaleString("en-IN")}
                </span>
                <div className="flex items-center gap-4">
                  <p className="text-6xl font-black text-[#A4F000] tracking-tighter italic leading-none">
                    ₹{product.price.toLocaleString("en-IN")}
                  </p>
                  <span className="bg-white/5 text-white/40 text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest border border-white/5">
                    Save ₹{(mrp - product.price).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* ACTION CARD */}
            <div className="p-8 bg-white/[0.03] rounded-[3rem] border border-white/10 backdrop-blur-xl space-y-8 relative overflow-hidden">
              <div className="flex items-center justify-between relative z-10">
                <span className="text-white font-black uppercase text-[10px] tracking-[0.3em] opacity-40">Unit Allocation</span>
                <div className="flex items-center bg-[#003F3A] rounded-2xl p-1.5 border border-white/5">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 text-white/40 hover:text-[#A4F000] transition-colors"><FiMinus /></button>
                  <span className="w-12 text-center font-black text-xl text-[#A4F000] italic">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="p-3 text-white/40 hover:text-[#A4F000] transition-colors"><FiPlus /></button>
                </div>
              </div>

              <div className="flex gap-4 relative z-10">
                <div className="flex-grow">
                  <AddToCartButton productId={product._id} quantity={quantity} />
                </div>
                <button className="p-5 bg-white/5 text-white rounded-[1.5rem] hover:bg-white hover:text-[#003F3A] transition-all border border-white/10">
                  <FiShare2 size={24} />
                </button>
              </div>
            </div>

            {/* TRUST BADGES */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              <TrustBadge icon={<FiTruck />} label="Express" sub="Node Delivery" />
              <TrustBadge icon={<FiShield />} label="Encrypted" sub="Warranty" />
              <TrustBadge icon={<FiRotateCcw />} label="7-Day" sub="Protocol" />
            </div>
          </div>
        </div>

        {/* TABS SECTION */}
        <section className="mt-24 lg:mt-40">
          <div className="flex border-b border-white/5 gap-8 sm:gap-16 mb-12 overflow-x-auto no-scrollbar justify-center lg:justify-start">
            <TabButton active={activeTab === 'description'} onClick={() => setActiveTab('description')}>Intel</TabButton>
            <TabButton active={activeTab === 'specs'} onClick={() => setActiveTab('specs')}>Data Sheet</TabButton>
            <TabButton active={activeTab === 'shipping'} onClick={() => setActiveTab('shipping')}>Logistics</TabButton>
          </div>

          <div className="max-w-4xl min-h-[200px] mx-auto lg:mx-0 px-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-white/60 text-lg leading-relaxed font-medium"
              >
                {activeTab === 'description' && (
                  <div className="space-y-4">
                    <p className="whitespace-pre-line first-letter:text-7xl first-letter:font-black first-letter:text-[#A4F000] first-letter:mr-4 first-letter:float-left first-letter:italic">
                      {product.description}
                    </p>
                  </div>
                )}
                {activeTab === 'specs' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <SpecItem label="ID CODE" value={product.sku || "DE-VAULT-X"} />
                    <SpecItem label="ORIGIN" value={product.category || "General"} />
                    <SpecItem label="INTEGRITY" value="Premium Certified" />
                    <SpecItem label="STRUCTURE" value="High-Grade Build" />
                  </div>
                )}
                {activeTab === 'shipping' && (
                  <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 flex items-start gap-5">
                    <FiTruck className="text-[#A4F000] text-4xl mt-1 shrink-0" />
                    <p className="italic font-bold text-white/80 uppercase text-xs tracking-widest leading-loose">
                      Global transit active. Node processing: 24h. Real-time encryption tracking provided upon dispatch.
                    </p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        {/* RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <section className="mt-24 lg:mt-40">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
              <div>
                <span className="text-[#A4F000] font-black uppercase text-xs tracking-[0.4em] italic">Linked Assets</span>
                <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mt-4 uppercase italic">More from {product.category}</h2>
              </div>
              <Link href="/product" className="group flex items-center gap-2 text-[10px] font-black text-[#A4F000] uppercase tracking-[0.3em] italic">
                EXPLORE VAULT <FiChevronRight />
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

      {/* STICKY MOBILE BAR */}
      <div className="lg:hidden fixed bottom-8 left-6 right-6 z-50">
        <div className="bg-white/10 backdrop-blur-3xl text-white rounded-[2rem] p-3 flex items-center justify-between border border-white/20 shadow-[0_30px_60px_rgba(0,0,0,0.5)]">
          <div className="px-5">
            <p className="text-[8px] font-black uppercase text-[#A4F000] tracking-widest italic">Protocol Price</p>
            <p className="text-2xl font-black tracking-tighter italic">₹{product.price.toLocaleString()}</p>
          </div>
          <div className="w-[55%]">
            <AddToCartButton productId={product._id} quantity={quantity} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* --- REUSABLE COMPONENTS --- */

function RelatedCard({ product, getDiscount }: { product: Product, getDiscount: any }) {
  const discount = getDiscount(product._id, product.category || "General");
  return (
    <Link href={`/product/${product._id}`} className="group block bg-white/[0.03] p-5 rounded-[2.5rem] border border-white/5 hover:border-[#A4F000]/30 transition-all duration-700">
      <div className="relative aspect-square bg-[#002B27] rounded-[2rem] overflow-hidden mb-6">
        <div className="absolute top-0 left-0 z-10 bg-[#A4F000] text-[#003F3A] text-[10px] font-black px-4 py-2 rounded-br-2xl italic">
          -{discount}%
        </div>
        <img src={product.image} className="w-full h-full object-contain p-8 group-hover:scale-110 transition-transform duration-1000 opacity-80 group-hover:opacity-100" alt={product.name} />
      </div>
      <div className="px-2">
        <p className="text-[8px] font-black text-[#A4F000] uppercase tracking-[0.3em] mb-1">{product.category}</p>
        <h3 className="font-black text-white text-lg tracking-tight uppercase italic truncate">{product.name}</h3>
        <p className="font-black text-white/40 text-xl tracking-tighter mt-2 group-hover:text-white transition-colors italic">₹{product.price.toLocaleString()}</p>
      </div>
    </Link>
  );
}

function TrustBadge({ icon, label, sub }: { icon: any, label: string, sub: string }) {
  return (
    <div className="flex flex-col items-center text-center p-5 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all group">
      <div className="text-[#A4F000] text-3xl mb-3 group-hover:scale-110 transition-transform">{icon}</div>
      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white italic">{label}</span>
      <span className="text-[8px] font-bold uppercase tracking-widest text-white/20 mt-1">{sub}</span>
    </div>
  );
}

function SpecItem({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex flex-col p-5 bg-white/[0.02] rounded-[1.5rem] border border-white/5">
      <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em] mb-1">{label}</span>
      <span className="text-white font-black text-sm uppercase italic tracking-widest">{value}</span>
    </div>
  )
}

function TabButton({ children, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`pb-5 text-[10px] font-black uppercase tracking-[0.4em] transition-all relative italic ${active ? 'text-[#A4F000]' : 'text-white/20 hover:text-white/40'}`}
    >
      {children}
      {active && <motion.div layoutId="tabLine" className="absolute bottom-0 left-0 right-0 h-1 bg-[#A4F000] rounded-full shadow-[0_0_15px_rgba(164,240,0,0.5)]" />}
    </button>
  );
}

function LoadingSkeleton() {
  return (
    <div className="bg-[#003F3A] min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center">
         <div className="w-16 h-16 border-4 border-white/10 border-t-[#A4F000] rounded-full animate-spin mb-6" />
         <span className="text-white/20 text-[10px] font-black uppercase tracking-[0.5em] animate-pulse">Decrypting Artifact</span>
      </div>
    </div>
  );
}

function ErrorState({ error }: { error: string | null }) {
  return (
    <div className="min-h-screen bg-[#003F3A] flex items-center justify-center p-6">
      <div className="max-w-xl w-full bg-white/[0.03] backdrop-blur-3xl rounded-[3rem] p-12 border border-white/10 text-center">
        <FiRotateCcw className="text-rose-500 text-6xl mx-auto mb-8 animate-spin-slow" />
        <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-4">Node Disconnected</h2>
        <p className="text-white/40 font-bold uppercase text-[10px] tracking-widest leading-loose mb-10 italic">“{error || "Artifact Signal Lost"}”</p>
        <Link href="/product" className="inline-block bg-[#A4F000] text-[#003F3A] px-12 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-white transition-all shadow-2xl">Return to Store</Link>
      </div>
    </div>
  );
}