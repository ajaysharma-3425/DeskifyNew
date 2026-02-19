"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddProductPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    image: "",
    description: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const createProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const res = await fetch("/api/products/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...form,
        price: Number(form.price),
      }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Product created 🎉");
      router.push("/admin/products");
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-10">
      <h1 className="text-3xl font-bold mb-6">Add New Product</h1>

      <form onSubmit={createProduct} className="flex flex-col gap-4">
        <input
          name="name"
          placeholder="Product name"
          className="border p-3"
          onChange={handleChange}
          required
        />

        <input
          name="price"
          placeholder="Price"
          type="number"
          className="border p-3"
          onChange={handleChange}
          required
        />

        <input
          name="category"
          placeholder="Category"
          className="border p-3"
          onChange={handleChange}
          required
        />

        <input
          name="image"
          placeholder="Image URL"
          className="border p-3"
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          rows={4}
          className="border p-3"
          onChange={handleChange}
          required
        />

        <button className="bg-black text-white p-3">
          Create Product
        </button>
      </form>
    </div>
  );
}
