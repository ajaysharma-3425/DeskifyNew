"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag, FiArrowRight, FiTruck, FiChevronLeft } from "react-icons/fi";
import { useCart } from "@/context/CartContext";

interface CartItem {
    product: {
        _id: string;
        name: string;
        price: number;
        image: string;
    };
    quantity: number;
    _id: string;
}

interface Cart {
    _id: string;
    items: CartItem[];
}

export default function CartPage() {
    const router = useRouter();
    const [cart, setCart] = useState<Cart | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updating, setUpdating] = useState<string | null>(null);
    const { refreshCart } = useCart();

    const fetchCart = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }

        try {
            setLoading(true);
            const res = await fetch("/api/cart", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to load secure cart data");
            const data = await res.json();
            setCart(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Protocol Error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchCart(); refreshCart(); }, []);

    const updateQuantity = async (productId: string, newQuantity: number) => {
        if (newQuantity < 1) return;
        const token = localStorage.getItem("token");
        setUpdating(productId);

        try {
            const res = await fetch("/api/cart/update", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ productId, quantity: newQuantity }),
            });
            const data = await res.json();
            setCart(data.cart);
            await refreshCart();
        } catch (err) {
            console.error(err);
        } finally {
            setUpdating(null);
        }
    };

    const removeItem = async (productId: string) => {
        const token = localStorage.getItem("token");
        setUpdating(productId);

        try {
            const res = await fetch("/api/cart/remove", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ productId }),
            });
            const data = await res.json();
            setCart(data.cart);
            await refreshCart();
        } catch (err) {
            console.error(err);
        } finally {
            setUpdating(null);
        }
    };

    const subtotal = cart?.items?.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0) ?? 0;
    const shipping = subtotal > 1000 ? 0 : 99;
    const total = subtotal + shipping;

    if (loading) return <LoadingState />;
    if (!cart || cart.items.length === 0) return <EmptyState />;

    return (
        <div className="min-h-screen bg-[#003F3A] pb-24 pt-32 selection:bg-[#A4F000] selection:text-[#003F3A]">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                {/* Header */}
                <header className="mb-16">
                    <Link href="/products" className="text-[#A4F000] text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2 mb-6 hover:translate-x-[-4px] transition-transform w-fit">
                        <FiChevronLeft /> Back to Inventory
                    </Link>
                    <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter flex items-center gap-6 italic uppercase">
                        YOUR <span className="text-[#A4F000]">CARGO</span>
                        <span className="text-white/10 not-italic text-3xl md:text-5xl">[{cart.items.length}]</span>
                    </h1>
                </header>

                <div className="grid lg:grid-cols-12 gap-12 items-start">
                    {/* --- LEFT: ITEMS LIST --- */}
                    <div className="lg:col-span-8 space-y-6">
                        <AnimatePresence mode='popLayout'>
                            {cart.items.filter(item => item.product).map((item) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    key={item.product._id}
                                    className="group relative bg-[#004d47] p-6 rounded-[3rem] border border-white/5 hover:border-[#A4F000]/30 transition-all duration-500 shadow-2xl"
                                >
                                    <div className="flex flex-col sm:flex-row gap-8">
                                        {/* Image */}
                                        <div className="w-full sm:w-40 aspect-square relative rounded-[2rem] overflow-hidden bg-[#003F3A] border border-white/5">
                                            <img
                                                src={item.product.image}
                                                alt={item.product.name}
                                                className="object-cover w-full h-full opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-transform duration-700"
                                            />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 flex flex-col justify-between py-2">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-[10px] font-black text-[#A4F000] uppercase tracking-[0.2em] mb-2">Ref: {item.product._id.slice(-6)}</p>
                                                    <Link href={`/product/${item.product._id}`} className="text-2xl font-bold text-white hover:text-[#A4F000] transition-colors italic uppercase">
                                                        {item.product.name}
                                                    </Link>
                                                </div>
                                                <p className="text-2xl font-black text-white tracking-tighter italic">₹{item.product.price.toLocaleString("en-IN")}</p>
                                            </div>

                                            <div className="flex flex-wrap items-center justify-between gap-6 mt-8">
                                                {/* Quantity Component */}
                                                <div className="flex items-center bg-[#003F3A] rounded-2xl p-1.5 border border-white/5 shadow-inner">
                                                    <button
                                                        onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                                                        disabled={updating === item.product._id || item.quantity <= 1}
                                                        className="size-10 flex items-center justify-center hover:bg-[#A4F000] hover:text-[#003F3A] text-[#A4F000] rounded-xl transition-all disabled:opacity-10"
                                                    >
                                                        <FiMinus size={16} />
                                                    </button>
                                                    <span className="w-12 text-center font-black text-white text-lg">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                                                        disabled={updating === item.product._id}
                                                        className="size-10 flex items-center justify-center hover:bg-[#A4F000] hover:text-[#003F3A] text-[#A4F000] rounded-xl transition-all"
                                                    >
                                                        <FiPlus size={16} />
                                                    </button>
                                                </div>

                                                <div className="flex items-center gap-8">
                                                    <div className="text-right">
                                                        <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Subtotal</p>
                                                        <p className="font-black text-[#A4F000] text-xl italic">₹{(item.product.price * item.quantity).toLocaleString("en-IN")}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => removeItem(item.product._id)}
                                                        className="size-12 flex items-center justify-center text-white/20 hover:text-rose-500 hover:bg-rose-500/10 rounded-2xl transition-all border border-transparent hover:border-rose-500/20"
                                                    >
                                                        <FiTrash2 size={22} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* --- RIGHT: SUMMARY --- */}
                    <aside className="lg:col-span-4 sticky top-28">
                        <div className="bg-[#004d47] p-10 rounded-[4rem] border border-white/5 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#A4F000]/5 rounded-full blur-3xl" />
                            
                            <h2 className="text-3xl font-black text-white mb-10 uppercase tracking-tighter italic">Order Summary</h2>

                            <div className="space-y-6 mb-10">
                                <div className="flex justify-between text-white/40 font-black uppercase text-[11px] tracking-widest">
                                    <span>Bag Subtotal</span>
                                    <span className="text-white">₹{subtotal.toLocaleString("en-IN")}</span>
                                </div>
                                <div className="flex justify-between text-white/40 font-black uppercase text-[11px] tracking-widest">
                                    <span>Logistics</span>
                                    <span className={shipping === 0 ? "text-[#A4F000]" : "text-white"}>
                                        {shipping === 0 ? "FREE_DELIVERY" : `₹${shipping}`}
                                    </span>
                                </div>
                                {shipping > 0 && (
                                    <div className="bg-[#A4F000]/5 p-4 rounded-2xl border border-[#A4F000]/10">
                                        <p className="text-[10px] text-[#A4F000] font-black uppercase tracking-tighter leading-tight">
                                            Add ₹{(1000 - subtotal).toLocaleString()} more for free logistics protocol
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="border-t border-white/5 pt-8 mb-10">
                                <div className="flex flex-col gap-1">
                                    <span className="text-white/20 font-black uppercase text-[10px] tracking-[0.3em]">Grand Total</span>
                                    <span className="text-5xl font-black text-[#A4F000] tracking-tighter italic leading-none">
                                        ₹{total.toLocaleString("en-IN")}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={() => router.push("/checkout")}
                                className="w-full bg-[#A4F000] hover:scale-[1.02] active:scale-95 text-[#003F3A] py-6 rounded-[2rem] font-black uppercase text-sm tracking-widest flex items-center justify-center gap-4 transition-all shadow-[0_20px_40px_-15px_rgba(164,240,0,0.3)]"
                            >
                                Init Checkout <FiArrowRight size={20} />
                            </button>

                            <div className="mt-10 flex items-center gap-4 text-white/20 text-[10px] font-black uppercase tracking-widest justify-center">
                                <FiTruck className="text-[#A4F000]" /> ETA: 3-5 Working Days
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}

function EmptyState() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#003F3A] px-6 text-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="size-72 bg-[#004d47] rounded-full flex items-center justify-center mb-12 shadow-inner border border-white/5"
            >
                <FiShoppingBag size={100} className="text-[#A4F000]/10" />
            </motion.div>
            <h2 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter italic uppercase">Bag is Empty.</h2>
            <p className="text-white/30 mb-12 max-w-sm font-black uppercase text-xs tracking-[0.2em] leading-relaxed">
                Your cargo holds no assets. Initiate a scan of our latest collection.
            </p>
            <Link href="/products" className="bg-[#A4F000] text-[#003F3A] px-12 py-5 rounded-2xl font-black uppercase tracking-widest hover:shadow-[0_0_30px_rgba(164,240,0,0.4)] transition-all">
                Start Exploring
            </Link>
        </div>
    );
}

function LoadingState() {
    return (
        <div className="min-h-screen bg-[#003F3A] flex items-center justify-center">
             <div className="size-20 border-4 border-[#A4F000]/20 border-t-[#A4F000] rounded-full animate-spin" />
        </div>
    );
}