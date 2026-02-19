"use client";

import { useEffect, useState } from "react";

interface Product {
    _id: string;
    name: string;
    price: number;
    image: string;
    category: string;
}

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    const getProducts = async () => {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(data.products);
        setLoading(false);
    };

    const deleteProduct = async (id: string) => {
        const token = localStorage.getItem("token");

        if (!confirm("Delete this product?")) return;

        await fetch(`/api/products/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        // refresh list
        getProducts();
    };

    useEffect(() => {
        getProducts();
    }, []);

    if (loading) return <h1 className="p-10">Loading...</h1>;

    return (
        <div className="max-w-6xl mx-auto p-10">
            <h1 className="text-3xl font-bold mb-8">Admin Products</h1>
            <a href="/admin/products/new" className="bg-black text-white px-4 py-2 rounded">
                Add Product
            </a>

            <div className="grid grid-cols-4 gap-6">
                {products.map((p) => (
                    <div key={p._id} className="border p-4 rounded-lg">
                        <img src={p.image} className="h-40 w-full object-cover" />
                        <h2 className="font-bold mt-2">{p.name}</h2>
                        <p>₹{p.price}</p>
                        <p className="text-sm text-gray-500">{p.category}</p>

                        <div className="flex gap-2 mt-3">
                            <a
                                href={`/admin/products/${p._id}`}
                                className="bg-blue-500 text-white px-3 py-1 rounded"
                            >
                                Edit
                            </a>


                            <button
                                onClick={() => deleteProduct(p._id)}
                                className="bg-red-500 text-white px-3 py-1 rounded"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
