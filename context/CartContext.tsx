"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface CartContextType {
  itemCount: number;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [itemCount, setItemCount] = useState(0);


  const fetchCartFromAPI = async () => {

    if (typeof window === "undefined") return;

    const token = localStorage.getItem("token");
    if (!token) {
      setItemCount(0);

      return;
    }

    try {
      const res = await fetch("/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store' // Force fresh data
      });

      if (!res.ok) {
        setItemCount(0);
        return;
      }

      const data = await res.json();

      // ✅ FIX: data.items directly check karo
      if (data.items && Array.isArray(data.items)) {

        const total = data.items.length;

        setItemCount(total);

        // optional sync
        localStorage.setItem("cart", JSON.stringify(data.items));
      } else {
        setItemCount(0);
        localStorage.removeItem("cart");
      }

    } catch (error) {
      console.error("Cart fetch error:", error);
      setItemCount(0);
    }
  };

  useEffect(() => {
    fetchCartFromAPI();
  }, []);

  return (
    <CartContext.Provider
      value={{
        itemCount,
        refreshCart: fetchCartFromAPI,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}