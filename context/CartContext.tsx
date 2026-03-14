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
      localStorage.removeItem("cart");
      return;
    }

    try {

      const res = await fetch("/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });

      if (!res.ok) {
        setItemCount(0);
        localStorage.removeItem("cart");
        return;
      }

      const data = await res.json();

      if (data?.items && Array.isArray(data.items)) {

        // ✅ Correct count (quantity ke saath)
        const totalItems = data.items.reduce(
          (acc: number, item: any) => acc + (item.quantity || 1),
          0
        );

        setItemCount(totalItems);

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

  // Initial load
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

  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;
}