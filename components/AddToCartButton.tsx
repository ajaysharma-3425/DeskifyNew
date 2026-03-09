"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";   // 👈 import

export default function AddToCartButton({
  productId,
  quantity = 1
}: {
  productId: string;
  quantity?: number;
}) {
  const [loading, setLoading] = useState(false);
  const { refreshCart } = useCart();   // 👈 useCart hook

  // AddToCartButton.tsx 
  const addToCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity }),
      });

      const data = await res.json();

      if (res.ok) {
        // ✅ Step 1: Context ko refresh karo (Ye api/cart fetch karega automatically)
        await refreshCart();

        // ✅ Step 2: Confirmation
        alert("Added to cart 🛒");
      } else {
        alert(data.message || "Something went wrong");
      }
    } catch (error) {
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={addToCart}
      disabled={loading}
      className="bg-black text-white px-6 py-2 mt-6 rounded-md hover:bg-gray-800 transition disabled:opacity-50"
    >
      {loading ? "Adding..." : "Add to Cart"}
    </button>
  );
}