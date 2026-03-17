"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiRefreshCw, FiTag, FiDollarSign, FiBox, FiImage, FiFileText, FiEye } from "react-icons/fi";

interface Product {
    name: string;
    price: number;
    category: string;
    image: string;
    description: string;
}

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [product, setProduct] = useState<Product>({
        name: "",
        price: 0,
        category: "",
        image: "",
        description: "",
    });

    const getProduct = async () => {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        setProduct(data.product);
    };

    useEffect(() => {
        getProduct();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    const updateProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem("token");

        const res = await fetch(`/api/products/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                ...product,
                price: Number(product.price),
            }),
        });

        if (res.ok) {
            router.push("/admin/products");
        } else {
            alert("Update failed");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#F5F6F7] pb-20">
            <div className="max-w-6xl mx-auto px-6 pt-12">
                
                {/* Top Navigation */}
                <button 
                    onClick={() => router.back()}
                    className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-blue-600 transition-colors mb-8"
                >
                    <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" size={14} />
                    Cancel Revision
                </button>

                <div className="mb-12">
                    <h1 className="text-5xl font-black tracking-tighter text-[#2F2F33]">
                        Refine <span className="text-blue-600">Product.</span>
                    </h1>
                    <p className="mt-3 text-gray-400 text-[11px] font-black uppercase tracking-[0.3em]">
                        Adjusting the Deskify Standard
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Form Section */}
                    <div className="lg:col-span-8">
                        <form onSubmit={updateProduct} className="bg-white p-10 rounded-[3rem] shadow-xl shadow-black/5 border border-gray-100 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Name */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">
                                        <FiTag className="text-blue-600" /> Identity
                                    </label>
                                    <input
                                        name="name"
                                        value={product.name}
                                        onChange={handleChange}
                                        className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-600/20 transition-all font-bold text-[#2F2F33]"
                                        placeholder="Product Name"
                                    />
                                </div>

                                {/* Category */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">
                                        <FiBox className="text-blue-600" /> Classification
                                    </label>
                                    <input
                                        name="category"
                                        value={product.category}
                                        onChange={handleChange}
                                        className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-600/20 transition-all font-bold text-[#2F2F33]"
                                    />
                                </div>

                                {/* Price */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">
                                        <FiDollarSign className="text-blue-600" /> Value (INR)
                                    </label>
                                    <input
                                        name="price"
                                        type="number"
                                        value={product.price}
                                        onChange={handleChange}
                                        className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-600/20 transition-all font-bold text-[#2F2F33]"
                                    />
                                </div>

                                {/* Image URL */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">
                                        <FiImage className="text-blue-600" /> Asset URL
                                    </label>
                                    <input
                                        name="image"
                                        value={product.image}
                                        onChange={handleChange}
                                        className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-600/20 transition-all font-bold text-[#2F2F33]"
                                    />
                                </div>

                                {/* Description */}
                                <div className="md:col-span-2 space-y-2">
                                    <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">
                                        <FiFileText className="text-blue-600" /> Product Narrative
                                    </label>
                                    <textarea
                                        name="description"
                                        rows={4}
                                        value={product.description}
                                        onChange={handleChange}
                                        className="w-full px-6 py-4 rounded-3xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-600/20 transition-all font-bold text-[#2F2F33] resize-none"
                                    />
                                </div>
                            </div>

                            <div className="pt-6">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-[#2F2F33] text-white text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-blue-600 hover:-translate-y-1 transition-all duration-300 shadow-xl shadow-black/10 active:scale-95 disabled:opacity-50"
                                >
                                    {loading ? "Synchronizing..." : <><FiRefreshCw size={18} /> Update Catalog</>}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Preview Section */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="sticky top-12">
                            <div className="flex items-center gap-2 mb-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                                <FiEye className="text-blue-600" /> Live Manifestation
                            </div>
                            
                            {/* Preview Card */}
                            <div className="bg-white rounded-[2.5rem] p-4 border border-gray-100 shadow-2xl shadow-black/5 overflow-hidden">
                                <div className="aspect-square bg-gray-50 rounded-[2rem] overflow-hidden mb-6 border border-gray-50">
                                    <img 
                                        src={product.image || "https://via.placeholder.com/400"} 
                                        alt="preview" 
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="px-4 pb-4">
                                    <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">{product.category || "Category"}</span>
                                    <h3 className="mt-3 text-xl font-black text-[#2F2F33] tracking-tight truncate">{product.name || "Product Name"}</h3>
                                    <p className="text-2xl font-black text-[#2F2F33] mt-1 tracking-tighter">₹{Number(product.price).toLocaleString()}</p>
                                </div>
                            </div>

                            {/* Brand Tagline */}
                            <div className="mt-8 px-6 text-center">
                                <div className="h-[1px] w-12 bg-gray-200 mx-auto mb-6"></div>
                                <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] leading-relaxed">
                                    Refining the details. <br /> Elevating the workspace.
                                </p>
                                <p className="mt-4 text-[12px] font-black italic text-blue-600/40 tracking-tighter">Deskify Admin Protocol v2.0</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}