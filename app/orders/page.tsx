"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiPackage, FiCalendar, FiMapPin, FiChevronDown, FiChevronUp } from "react-icons/fi";

// Types based on your Order model
interface OrderItem {
  product: string;        // product ID
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface Order {
  _id: string;
  user: string;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: any;   // could be string or object
  status?: string;        // optional – if you add it later
  createdAt: string;
  updatedAt: string;
}

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  // Fetch orders
  const fetchOrders = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to load orders");
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Helper to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Helper to display shipping address nicely
  const formatAddress = (address: any): string => {
    if (typeof address === "string") return address;
    if (typeof address === "object") {
      // If it's an object like { fullName, addressLine, city, pincode }
      const parts = [
        address.fullName,
        address.addressLine,
        address.city,
        address.pincode,
      ].filter(Boolean);
      return parts.join(", ");
    }
    return "Address not available";
  };

  // Toggle order details
  const toggleExpand = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>
        <div className="space-y-4 animate-pulse">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-4" />
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h2 className="text-2xl font-semibold text-red-600 mb-4">{error}</h2>
        <button
          onClick={fetchOrders}
          className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <div className="mb-6">
          <FiPackage className="mx-auto h-16 w-16 text-gray-400" />
        </div>
        <h1 className="text-3xl font-bold mb-4">No orders yet</h1>
        <p className="text-gray-600 mb-8">Looks like you haven't placed any orders.</p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
          >
            {/* Order Header (always visible) */}
            <div
              className="p-6 cursor-pointer hover:bg-gray-50 transition"
              onClick={() => toggleExpand(order._id)}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <FiPackage className="h-6 w-6 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Order #{order._id.slice(-8)}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="flex items-center text-sm text-gray-600">
                        <FiCalendar className="mr-1 h-4 w-4" />
                        {formatDate(order.createdAt)}
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        Total: ₹{order.totalAmount.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                    Delivered
                  </span>
                  {expandedOrder === order._id ? (
                    <FiChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <FiChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </div>
              </div>
            </div>

            {/* Expanded Details */}
            {expandedOrder === order._id && (
              <div className="border-t border-gray-200 p-6 bg-gray-50">
                {/* Shipping Address */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <FiMapPin className="mr-1 h-4 w-4" /> Shipping Address
                  </h3>
                  <p className="text-sm text-gray-600">{formatAddress(order.shippingAddress)}</p>
                </div>

                {/* Order Items */}
                <h3 className="text-sm font-medium text-gray-700 mb-3">Items</h3>
                <div className="space-y-3">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-3">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-10 h-10 object-cover rounded"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                            No img
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-800">{item.name}</p>
                          <p className="text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-medium text-gray-900">
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Order Total */}
                <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between font-medium">
                  <span>Total</span>
                  <span>₹{order.totalAmount.toLocaleString("en-IN")}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}