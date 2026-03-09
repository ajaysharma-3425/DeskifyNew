"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { use } from "react";

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
            alert("Product updated 🎉");
            router.push("/admin/products");
        } else {
            alert("Update failed");
        }
    };

    return (
        <div className="w-full ">
            <div className="bg-[#1F2937] shadow-lg  overflow-hidden border border-[#334155]">
                <div className="px-6 py-8 border-b border-[#334155]">
                    <h1 className="text-3xl font-bold text-[#F9FAFB]">Edit Product</h1>
                    <p className="mt-2 text-sm text-[#9CA3AF]">
                        Update the product details below.
                    </p>
                </div>

                <form onSubmit={updateProduct} className="px-6 py-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-[#9CA3AF] mb-1">
                                Product Name *
                            </label>
                            <input
                                name="name"
                                value={product.name}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-[#334155] rounded-lg bg-[#0F172A] text-[#F9FAFB] focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition"
                                placeholder="Product name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#9CA3AF] mb-1">
                                Price ($) *
                            </label>
                            <input
                                name="price"
                                type="number"
                                step="0.01"
                                min="0"
                                value={product.price}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-[#334155] rounded-lg bg-[#0F172A] text-[#F9FAFB] focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition"
                                placeholder="0.00"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#9CA3AF] mb-1">
                                Category *
                            </label>
                            <input
                                name="category"
                                value={product.category}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-[#334155] rounded-lg bg-[#0F172A] text-[#F9FAFB] focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition"
                                placeholder="e.g., Electronics"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#9CA3AF] mb-1">
                                Image URL *
                            </label>
                            <input
                                name="image"
                                value={product.image}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-[#334155] rounded-lg bg-[#0F172A] text-[#F9FAFB] focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition"
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-[#9CA3AF] mb-1">
                                Description *
                            </label>
                            <textarea
                                name="description"
                                rows={4}
                                value={product.description}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-[#334155] rounded-lg bg-[#0F172A] text-[#F9FAFB] focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition"
                                placeholder="Enter a detailed description..."
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="px-8 py-3 border border-[#3B82F6] text-[#3B82F6] font-medium rounded-lg hover:bg-[#3B82F6] hover:text-white transition-all duration-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-8 py-3 bg-[#3B82F6] text-white font-medium rounded-lg hover:bg-[#60A5FA] transition-all duration-300"
                        >
                            Update Product
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}