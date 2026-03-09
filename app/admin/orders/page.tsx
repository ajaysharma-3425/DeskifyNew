"use client";

import { useEffect, useState } from "react";
import {
  FiPackage,
  FiUser,
  FiCalendar,
  FiMapPin,
  FiDollarSign,
  FiChevronDown,
  FiX,
  FiCheckCircle,
  FiClock,
  FiTruck,
} from "react-icons/fi";

interface OrderItem {
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface Order {
  _id: string;
  user: {
    email: string;
    name?: string;
  };
  items: OrderItem[];
  totalAmount: number;
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
  cancelReason?: string;
  createdAt: string;
  shippingAddress: any;
}

// Updated status colors using slate + blue accent
const statusColors: Record<string, string> = {
  pending: "bg-[rgba(59,130,246,0.15)] text-[#3B82F6]",
  paid: "bg-[rgba(59,130,246,0.15)] text-[#3B82F6]",
  shipped: "bg-[rgba(59,130,246,0.15)] text-[#3B82F6]",
  delivered: "bg-[rgba(59,130,246,0.15)] text-[#3B82F6]",
  cancelled: "bg-[#1F2937] text-[#9CA3AF] border border-[#334155]",
};

const statusIcons = {
  pending: FiClock,
  paid: FiPackage,
  shipped: FiTruck,
  delivered: FiCheckCircle,
  cancelled: FiX,
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/admin/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId: string, newStatus: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    let reason = "";

    // If cancelling → ask reason
    if (newStatus === "cancelled") {
      reason = prompt("Enter cancellation reason:") || "";
      if (!reason) return;
    }

    setUpdatingId(orderId);

    try {
      const res = await fetch("/api/admin/orders/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderId,
          status: newStatus,
          reason,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.message || "Update failed");
        return;
      }

      await fetchOrders();
    } catch (err) {
      alert("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  // Helper to display shipping address nicely
  const formatAddress = (address: any): React.ReactNode => {
    if (!address) return "Address not available";
    if (typeof address === "string") return address;

    if (typeof address === "object") {
      const fullName = address.fullName || address.name || "";
      const phone = address.phone || address.mobile || address.phoneNumber || "";
      const addressLine = address.addressLine || address.street || address.address || "";
      const city = address.city || address.town || "";
      const pincode = address.pincode || address.pinCode || address.zip || "";
      const state = address.state || "";

      const parts = [];

      if (fullName) parts.push(<p key="name" className="font-medium text-[#F9FAFB]">{fullName}</p>);
      if (phone) parts.push(<p key="phone" className="text-[#9CA3AF] text-sm">{phone}</p>);

      const locationParts = [];
      if (addressLine) locationParts.push(addressLine);
      if (city) locationParts.push(city);
      if (state) locationParts.push(state);
      if (pincode) locationParts.push(pincode);

      if (locationParts.length > 0) {
        parts.push(
          <p key="location" className="text-[#9CA3AF] text-sm">
            {locationParts.join(", ")}
          </p>
        );
      }

      return <div className="space-y-0.5">{parts}</div>;
    }

    return "Address not available";
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F172A] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-[#F9FAFB] mb-8">Admin Orders</h1>
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-[#1F2937] rounded-xl shadow-lg p-6 border border-[#334155]">
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-2">
                    <div className="h-6 w-48 bg-[#334155] rounded animate-pulse" />
                    <div className="h-4 w-32 bg-[#334155] rounded animate-pulse" />
                  </div>
                  <div className="h-8 w-28 bg-[#334155] rounded animate-pulse" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...Array(2)].map((_, j) => (
                    <div key={j} className="h-28 bg-[#334155] rounded animate-pulse" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0F172A] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#1F2937] border-l-4 border-[#9CA3AF] rounded-lg p-4">
            <p className="text-[#F9FAFB]">Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-[#F9FAFB] mb-8">Admin Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-20 bg-[#1F2937] rounded-xl border border-[#334155]">
            <FiPackage className="mx-auto text-[#9CA3AF] text-5xl mb-4" />
            <h3 className="text-lg font-medium text-[#F9FAFB]">No orders found</h3>
            <p className="text-[#9CA3AF]">Orders will appear here once customers place them.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const StatusIcon = statusIcons[order.status] || FiClock;
              const isStatusLocked = ["delivered", "cancelled"].includes(order.status);
              const isUpdating = updatingId === order._id;

              return (
                <div
                  key={order._id}
                  className="bg-[#1F2937] rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-[#334155] overflow-hidden"
                >
                  {/* Order Header */}
                  <div className="p-6 border-b border-[#334155] bg-[#111827]">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h2 className="text-lg font-semibold text-[#F9FAFB]">
                            Order #{order._id.slice(-8)}
                          </h2>
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                              statusColors[order.status] || statusColors.pending
                            }`}
                          >
                            <StatusIcon size={12} />
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                          {/* Show cancellation reason if applicable */}
                          {order.status === "cancelled" && order.cancelReason && (
                            <span className="text-xs text-[#9CA3AF] ml-2">
                              (Reason: {order.cancelReason})
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-[#9CA3AF]">
                          <span className="flex items-center gap-1">
                            <FiUser size={14} />
                            {order.user?.email || "Guest"}
                          </span>
                          <span className="flex items-center gap-1">
                            <FiCalendar size={14} />
                            {new Date(order.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                          <span className="flex items-center gap-1 font-medium text-[#F9FAFB]">
                            <FiDollarSign size={14} />
                            ₹{order.totalAmount.toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>

                      {/* Status Update */}
                      <div className="flex items-center gap-3">
                        {!isStatusLocked ? (
                          <div className="relative">
                            <select
                              value={order.status}
                              onChange={(e) => updateStatus(order._id, e.target.value)}
                              disabled={isUpdating}
                              className="appearance-none bg-[#0F172A] border border-[#334155] rounded-lg pl-4 pr-10 py-2 text-sm text-[#F9FAFB] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <option value="pending">Pending</option>
                              <option value="paid">Paid</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                            <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none" size={16} />
                          </div>
                        ) : (
                          <span className="text-sm text-[#9CA3AF] italic">
                            {order.status === "delivered" ? "Order delivered" : "Order cancelled"}
                          </span>
                        )}
                        {isUpdating && (
                          <div className="w-5 h-5 border-2 border-[#3B82F6] border-t-transparent rounded-full animate-spin" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="px-6 py-4 border-b border-[#334155]">
                    <h3 className="text-sm font-medium text-[#F9FAFB] mb-2 flex items-center gap-1">
                      <FiMapPin size={14} />
                      Shipping Address
                    </h3>
                    <div className="text-sm text-[#9CA3AF]">
                      {formatAddress(order.shippingAddress)}
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-6">
                    <h3 className="text-sm font-medium text-[#F9FAFB] mb-4 flex items-center gap-1">
                      <FiPackage size={14} />
                      Items ({order.items.length})
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex gap-3 p-3 bg-[#0F172A] rounded-lg border border-[#334155]"
                        >
                          <div className="flex-shrink-0 w-16 h-16 bg-[#1F2937] rounded-md overflow-hidden">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[#9CA3AF]">
                                <FiPackage size={20} />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[#F9FAFB] truncate">
                              {item.name}
                            </p>
                            <p className="text-xs text-[#9CA3AF]">
                              Qty: {item.quantity}
                            </p>
                            <p className="text-sm font-semibold text-[#F9FAFB] mt-1">
                              ₹{item.price.toLocaleString("en-IN")}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}