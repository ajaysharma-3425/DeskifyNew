"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowLeft, FiHeart, FiShoppingCart, FiTrash2 } from "react-icons/fi";

interface Product {
    _id: string;
    name: string;
    price: number;
    image: string;
    category?: string;
}

export default function WhitelistPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [whitelistIds, setWhitelistIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const saved = localStorage.getItem("whitelist");
        if (saved) {
            const ids = JSON.parse(saved);
            setWhitelistIds(ids);
            fetchWhitelistedProducts(ids);
        } else {
            setLoading(false);
        }
    }, []);

    const fetchWhitelistedProducts = async (ids: string[]) => {
        try {
            const res = await fetch("/api/products");
            const data = await res.json();
            const allProducts: Product[] = data.products || [];
            const filtered = allProducts.filter(p => ids.includes(p._id));
            setProducts(filtered);
        } finally {
            setLoading(false);
        }
    };

    const removeFromWhitelist = (id: string) => {
        const updatedIds = whitelistIds.filter(item => item !== id);
        setWhitelistIds(updatedIds);
        setProducts(products.filter(p => p._id !== id));
        localStorage.setItem("whitelist", JSON.stringify(updatedIds));
    };

    return (
        <div className="min-h-screen bg-[#003F3A] pt-32 pb-20 px-6 relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-0 left-[-10%] w-[50%] h-[50%] bg-[#A4F000]/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-12"
                >
                    <Link href="/product" className="group inline-flex items-center gap-2 text-[#A4F000] font-black text-xs uppercase tracking-[0.3em] mb-6 hover:text-white transition-colors">
                        <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                        Return to Vault
                    </Link>

                    <h1 className="text-6xl md:text-7xl font-black text-white tracking-tighter leading-none italic uppercase">
                        Saved <span className="text-[#A4F000] block md:inline">Artifacts</span>
                    </h1>
                    <div className="h-1.5 w-24 bg-[#A4F000] mt-4 rounded-full" />
                </motion.div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40">
                        <div className="w-12 h-12 border-4 border-white/10 border-t-[#A4F000] rounded-full animate-spin mb-4" />
                        <p className="text-white/40 font-black uppercase tracking-[0.2em] text-[10px]">Retrieving Data...</p>
                    </div>
                ) : products.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-40 bg-white/[0.02] backdrop-blur-md rounded-[3rem] border border-white/10"
                    >
                        <FiHeart className="mx-auto size-16 text-white/5 mb-6" />
                        <p className="text-white font-bold text-2xl uppercase tracking-tighter italic">The collection is empty</p>
                        <p className="text-white/30 text-xs uppercase tracking-widest mt-2">Zero items detected in your whitelist node</p>
                        <Link href="/product" className="mt-8 inline-block bg-[#A4F000] text-[#003F3A] px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-white transition-all">
                            Start Collecting
                        </Link>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        <AnimatePresence mode="popLayout">
                            {products.map((product) => (
                                <motion.div
                                    key={product._id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    className="group bg-white/[0.03] backdrop-blur-xl rounded-[2.5rem] border border-white/10 p-5 relative hover:border-[#A4F000]/30 transition-all duration-500 shadow-2xl"
                                >
                                    {/* Action Buttons */}
                                    <button
                                        onClick={() => removeFromWhitelist(product._id)}
                                        className="absolute top-6 right-6 z-20 bg-[#003F3A]/80 text-white p-3 rounded-2xl border border-white/10 hover:bg-rose-500 hover:border-rose-500 transition-all duration-300"
                                    >
                                        <FiTrash2 size={18} />
                                    </button>

                                    {/* Image Container */}
                                    <div className="relative aspect-square overflow-hidden rounded-[2rem] mb-6 bg-[#002B27]">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#003F3A] via-transparent to-transparent opacity-60" />
                                    </div>

                                    {/* Content */}
                                    <div className="px-2">
                                        <p className="text-[#A4F000] text-[9px] font-black uppercase tracking-[0.2em] mb-1 opacity-60">
                                            {product.category || "Premium Listing"}
                                        </p>
                                        <h3 className="font-black text-white text-xl tracking-tight mb-4 uppercase italic leading-tight truncate">
                                            {product.name}
                                        </h3>

                                        <div className="flex justify-between items-center pt-4 border-t border-white/5">
                                            <p className="font-black text-2xl text-white tracking-tighter">
                                                ₹{product.price.toLocaleString()}
                                            </p>
                                            <button className="bg-[#A4F000] p-3 rounded-xl text-[#003F3A] hover:bg-white transition-colors shadow-lg shadow-[#A4F000]/10">
                                                <FiShoppingCart size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
}