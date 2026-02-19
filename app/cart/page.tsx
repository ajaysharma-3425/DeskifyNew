"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FiTrash2, FiPlus, FiMinus } from "react-icons/fi";

interface CartItem {
    product: {
        _id: string;
        name: string;
        price: number;
        images: string[];
    };
    quantity: number;
    _id: string;
}

interface Cart {
    _id: string;
    user: string;
    items: CartItem[];
    createdAt: string;
    updatedAt: string;
}

export default function CartPage() {
    const router = useRouter();
    const [cart, setCart] = useState<Cart | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updating, setUpdating] = useState<string | null>(null); // item _id being updated

    // Fetch cart
    const fetchCart = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }

        try {
            setLoading(true);
            const res = await fetch("/api/cart", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to load cart");
            const data = await res.json();
            setCart(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    // Update quantity
    const updateQuantity = async (productId: string, newQuantity: number) => {
        if (newQuantity < 1) return;

        const token = localStorage.getItem("token");
        setUpdating(productId);

        try {
            const res = await fetch("/api/cart/update", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ productId, quantity: newQuantity }),
            });

            if (!res.ok) throw new Error("Update failed");
            const data = await res.json();

            // ✅ Directly set the cart from the response (now fully populated)
            setCart(data.cart);
        } catch (err) {
            alert("Failed to update quantity");
        } finally {
            setUpdating(null);
        }
    };

    // Remove item
    const removeItem = async (productId: string) => {
        if (!confirm("Remove item from cart?")) return;

        const token = localStorage.getItem("token");
        setUpdating(productId);

        try {
            const res = await fetch("/api/cart/remove", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ productId }),
            });

            if (!res.ok) throw new Error("Remove failed");
            const data = await res.json();

            // ✅ Set the cart from the populated response
            setCart(data.cart);
        } catch (err) {
            alert("Failed to remove item");
        } finally {
            setUpdating(null);
        }
    };

    // Calculate totals
    const subtotal = cart?.items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
    ) ?? 0;

    const shipping = subtotal > 500 ? 0 : 50;
    const total = subtotal + shipping;

    // Loading skeleton
    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
                <div className="space-y-4 animate-pulse">
                    {[...Array(2)].map((_, i) => (
                        <div key={i} className="flex gap-4 p-4 border rounded-lg">
                            <div className="w-24 h-24 bg-gray-200 rounded" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-3/4" />
                                <div className="h-4 bg-gray-200 rounded w-1/4" />
                                <div className="h-8 bg-gray-200 rounded w-32" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                <h2 className="text-2xl font-semibold text-red-600 mb-4">{error}</h2>
                <button
                    onClick={fetchCart}
                    className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800"
                >
                    Try Again
                </button>
            </div>
        );
    }

    // Empty cart
    if (!cart || cart.items.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
                <p className="text-gray-600 mb-8">Looks like you haven't added anything yet.</p>
                <Link
                    href="/"
                    className="inline-block px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800"
                >
                    Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Cart Items */}
                <div className="lg:w-2/3 space-y-4">
                    {cart.items.map((item) => (
                        <div
                            key={item.product._id}
                            className="flex flex-col sm:flex-row gap-4 p-4 border border-gray-200 rounded-lg shadow-sm"
                        >
                            {/* Product Image */}
                            <div className="sm:w-24 sm:h-24 w-full h-48 relative bg-gray-100 rounded-md overflow-hidden">
                                <img
                                    src={item.product.images[0]}
                                    alt={item.product.name}
                                    className="object-cover w-full h-full"
                                />
                            </div>

                            {/* Details */}
                            <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <Link
                                        href={`/product/${item.product._id}`}
                                        className="text-lg font-semibold hover:underline"
                                    >
                                        {item.product.name}
                                    </Link>
                                    <p className="text-gray-600">₹{item.product.price.toLocaleString("en-IN")}</p>
                                </div>

                                {/* Quantity controls */}
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                                        disabled={updating === item.product._id}
                                        className="p-2 border rounded-md hover:bg-gray-100 disabled:opacity-50"
                                    >
                                        <FiMinus size={16} />
                                    </button>
                                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                                        disabled={updating === item.product._id}
                                        className="p-2 border rounded-md hover:bg-gray-100 disabled:opacity-50"
                                    >
                                        <FiPlus size={16} />
                                    </button>

                                    <button
                                        onClick={() => removeItem(item.product._id)}
                                        disabled={updating === item.product._id}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-md ml-2 disabled:opacity-50"
                                    >
                                        <FiTrash2 size={18} />
                                    </button>
                                </div>

                                {/* Item subtotal */}
                                <div className="text-right font-semibold">
                                    ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Order Summary */}
                <div className="lg:w-1/3">
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 sticky top-24">
                        <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>₹{subtotal.toLocaleString("en-IN")}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
                            </div>
                            <div className="border-t pt-2 mt-2 font-semibold text-base">
                                <div className="flex justify-between">
                                    <span>Total</span>
                                    <span>₹{total.toLocaleString("en-IN")}</span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => router.push("/checkout")}
                            className="w-full mt-6 bg-black text-white py-3 rounded-md hover:bg-gray-800 transition"
                        >
                            Proceed to Checkout
                        </button>

                        <Link
                            href="/"
                            className="block text-center text-sm text-gray-600 mt-4 hover:underline"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}