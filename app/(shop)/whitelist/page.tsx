"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowLeft, FiHeart, FiShoppingCart } from "react-icons/fi";

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

    const toggleWhitelist = (id: string) => {
        let updated;

        if (whitelistIds.includes(id)) {
            updated = whitelistIds.filter(item => item !== id);
        } else {
            updated = [...whitelistIds, id];
        }

        setWhitelistIds(updated);
        localStorage.setItem("whitelist", JSON.stringify(updated));
    };

    const fetchWhitelistedProducts = async (ids: string[]) => {
        try {
            const res = await fetch("/api/products");
            const data = await res.json();
            const allProducts: Product[] = data.products || [];
            // Filter only products that are in the whitelist
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
        <div className="min-h-screen bg-[#FDFDFD] pt-32 pb-20 px-6">
            <div className="max-w-7xl mx-auto">
                <Link href="/product" className="flex items-center gap-2 text-slate-400 font-bold mb-8 hover:text-emerald-500 transition-colors">
                    <FiArrowLeft /> BACK TO STORE
                </Link>

                <h1 className="text-5xl font-black text-slate-900 mb-12 tracking-tighter">
                    YOUR <span className="text-rose-500 italic">WHITELIST</span>
                </h1>

                {loading ? (
                    <div className="text-center py-20">Loading your favorites...</div>
                ) : products.length === 0 ? (
                    <div className="text-center py-40 bg-slate-50 rounded-[3rem] border-2 border-dashed">
                        <FiHeart className="mx-auto size-12 text-slate-200 mb-4" />
                        <p className="text-slate-400 font-bold text-xl">Your whitelist is empty</p>
                        <Link href="/product" className="mt-4 inline-block text-emerald-500 font-black underline">Explore Products</Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        <AnimatePresence>
                            {products.map((product) => (
                                <motion.div
                                    key={product._id}
                                    layout
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    className="bg-white rounded-[2rem] border border-slate-100 p-4 relative shadow-sm"
                                >
                                    <button
                                        onClick={() => removeFromWhitelist(product._id)}
                                        className="absolute top-6 right-6 z-10 bg-rose-500 text-white p-2 rounded-xl"
                                    >
                                        <FiHeart fill="white" />
                                    </button>
                                    <img src={product.image} className="aspect-square object-cover rounded-[1.5rem] mb-4" />
                                    <h3 className="font-bold text-slate-900 mb-2">{product.name}</h3>
                                    <div className="flex justify-between items-center">
                                        <p className="font-black text-xl text-slate-900">₹{product.price}</p>
                                        <FiShoppingCart className="text-emerald-500" />
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