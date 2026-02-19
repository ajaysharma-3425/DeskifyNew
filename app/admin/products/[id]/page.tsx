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

export default function EditProductPage(
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = use(params); // ⭐ UNWRAP PARAMS HERE

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
        <div className="max-w-3xl mx-auto p-10">
            <h1 className="text-3xl font-bold mb-6">Edit Product</h1>

            <form onSubmit={updateProduct} className="flex flex-col gap-4">
                <input
                    name="name"
                    value={product.name}
                    className="border p-3"
                    onChange={handleChange}
                />

                <input
                    name="price"
                    type="number"
                    value={product.price}
                    className="border p-3"
                    onChange={handleChange}
                />

                <input
                    name="category"
                    value={product.category}
                    className="border p-3"
                    onChange={handleChange}
                />

                {/* <input
                    name="image"
                    value={product.image}
                    className="border p-3"
                    onChange={handleChange}
                /> */}

                <textarea
                    name="description"
                    rows={4}
                    value={product.description}
                    className="border p-3"
                    onChange={handleChange}
                />

                <button className="bg-black text-white p-3">
                    Update Product
                </button>
            </form>
        </div>
    );
}
