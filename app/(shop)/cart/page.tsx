"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag, FiArrowRight, FiTruck } from "react-icons/fi";

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
            if (!res.ok) throw new Error("Failed to load cart");
            const data = await res.json();
            setCart(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

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
        <div className="min-h-screen bg-[#F8F9FA] pb-24 pt-20">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                {/* Header */}
                <header className="mb-12">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4">
                        <FiShoppingBag className="text-emerald-500" /> 
                        Your Bag <span className="text-slate-300">({cart.items.length})</span>
                    </h1>
                </header>

                <div className="grid lg:grid-cols-12 gap-12 items-start">
                    {/* --- LEFT: ITEMS LIST --- */}
                    <div className="lg:col-span-8 space-y-6">
                        <AnimatePresence mode='popLayout'>
                            {cart.items.filter(item => item.product).map((item) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    key={item.product._id}
                                    className="group relative bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300"
                                >
                                    <div className="flex flex-col sm:flex-row gap-6">
                                        {/* Image */}
                                        <div className="w-full sm:w-32 aspect-square relative rounded-2xl overflow-hidden bg-slate-50 border border-slate-100">
                                            <img
                                                src={item.product.image}
                                                alt={item.product.name}
                                                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 flex flex-col justify-between py-1">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <Link href={`/product/${item.product._id}`} className="text-xl font-bold text-slate-900 hover:text-emerald-600 transition-colors">
                                                        {item.product.name}
                                                    </Link>
                                                    <p className="text-slate-400 font-medium text-sm mt-1 uppercase tracking-wider">Premium Edition</p>
                                                </div>
                                                <p className="text-xl font-black text-slate-900">₹{item.product.price.toLocaleString("en-IN")}</p>
                                            </div>

                                            <div className="flex flex-wrap items-center justify-between gap-4 mt-6">
                                                {/* Quantity Component */}
                                                <div className="flex items-center bg-slate-50 rounded-2xl p-1 border border-slate-100">
                                                    <button
                                                        onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                                                        disabled={updating === item.product._id || item.quantity <= 1}
                                                        className="p-2 hover:bg-white hover:shadow-sm rounded-xl transition-all disabled:opacity-30"
                                                    >
                                                        <FiMinus size={14} />
                                                    </button>
                                                    <span className="w-10 text-center font-bold text-slate-900">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                                                        disabled={updating === item.product._id}
                                                        className="p-2 hover:bg-white hover:shadow-sm rounded-xl transition-all"
                                                    >
                                                        <FiPlus size={14} />
                                                    </button>
                                                </div>

                                                <div className="flex items-center gap-6">
                                                    <div className="text-right">
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Subtotal</p>
                                                        <p className="font-bold text-emerald-600">₹{(item.product.price * item.quantity).toLocaleString("en-IN")}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => removeItem(item.product._id)}
                                                        className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all"
                                                    >
                                                        <FiTrash2 size={20} />
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
                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50">
                            <h2 className="text-2xl font-black text-slate-900 mb-8 uppercase tracking-tight">Order Summary</h2>
                            
                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-slate-500 font-medium">
                                    <span>Bag Subtotal</span>
                                    <span className="text-slate-900">₹{subtotal.toLocaleString("en-IN")}</span>
                                </div>
                                <div className="flex justify-between text-slate-500 font-medium">
                                    <span>Shipping</span>
                                    <span className={shipping === 0 ? "text-emerald-500 font-bold" : "text-slate-900"}>
                                        {shipping === 0 ? "FREE" : `₹${shipping}`}
                                    </span>
                                </div>
                                {shipping > 0 && (
                                    <p className="text-[11px] text-slate-400 italic">Add ₹{1000 - subtotal} more for free shipping</p>
                                )}
                            </div>

                            <div className="border-t border-slate-100 pt-6 mb-10">
                                <div className="flex justify-between items-end">
                                    <span className="text-slate-400 font-black uppercase text-xs tracking-widest mb-1">Total Amount</span>
                                    <span className="text-3xl font-black text-slate-900 tracking-tighter">₹{total.toLocaleString("en-IN")}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => router.push("/checkout")}
                                className="w-full bg-slate-900 hover:bg-black text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-slate-900/20"
                            >
                                Secure Checkout <FiArrowRight />
                            </button>

                            <div className="mt-8 flex items-center gap-3 text-slate-400 text-xs font-medium justify-center">
                                <FiTruck className="text-emerald-500" /> Delivery estimated within 3-5 days
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}

// Sub-components
function EmptyState() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6">
            <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-64 h-64 bg-slate-50 rounded-full flex items-center justify-center mb-10"
            >
                <FiShoppingBag size={80} className="text-slate-200" />
            </motion.div>
            <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Your bag is empty.</h2>
            <p className="text-slate-500 mb-10 text-center max-w-sm font-medium">
                Looks like you haven't discovered our latest collection yet. Let's change that.
            </p>
            <Link href="/products" className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold hover:shadow-2xl transition-all">
                Start Exploring
            </Link>
        </div>
    );
}

function LoadingState() {
    return (
        <div className="max-w-7xl mx-auto px-6 py-24 animate-pulse">
            <div className="h-12 bg-slate-100 rounded-xl w-48 mb-12" />
            <div className="grid lg:grid-cols-12 gap-12">
                <div className="lg:col-span-8 space-y-6">
                    {[1, 2].map(i => <div key={i} className="h-40 bg-slate-100 rounded-[2rem] w-full" />)}
                </div>
                <div className="lg:col-span-4 h-96 bg-slate-100 rounded-[2.5rem]" />
            </div>
        </div>
    );
}