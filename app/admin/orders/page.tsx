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
  FiSearch,
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

// Premium Status Styling
const statusStyles: Record<string, string> = {
  pending: "bg-amber-50 text-amber-600 border-amber-100",
  paid: "bg-blue-50 text-blue-600 border-blue-100",
  shipped: "bg-indigo-50 text-indigo-600 border-indigo-100",
  delivered: "bg-emerald-50 text-emerald-600 border-emerald-100",
  cancelled: "bg-rose-50 text-rose-600 border-rose-100",
};

const statusIcons = {
  pending: FiClock,
  paid: FiDollarSign,
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
        body: JSON.stringify({ orderId, status: newStatus, reason }),
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

  const formatAddress = (address: any): React.ReactNode => {
    if (!address) return "Address not available";
    if (typeof address === "string") return address;
    const fullName = address.fullName || address.name || "";
    const phone = address.phone || address.mobile || "";
    const loc = [address.addressLine, address.city, address.state, address.pincode].filter(Boolean).join(", ");

    return (
      <div className="space-y-0.5">
        <p className="font-black text-[#2F2F33] text-sm uppercase tracking-tight">{fullName}</p>
        <p className="text-gray-400 text-xs font-bold">{phone}</p>
        <p className="text-gray-500 text-xs font-medium leading-relaxed mt-1">{loc}</p>
      </div>
    );
  };

  useEffect(() => { fetchOrders(); }, []);

  // Skeleton Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F6F7] py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="h-10 w-48 bg-gray-200 animate-pulse rounded-lg mb-10" />
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white h-64 rounded-[2rem] border border-gray-100 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F6F7] text-[#2F2F33] pb-20">
      <div className="max-w-7xl mx-auto px-6 pt-12">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black tracking-tighter mb-2">
              Order <span className="text-blue-600">Management</span>
            </h1>
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
              Track and fulfill customer requests in real-time
            </p>
          </div>
          <div className="relative group">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
            <input 
              type="text" 
              placeholder="Search by Order ID..." 
              className="bg-white border border-gray-100 rounded-2xl py-3 pl-12 pr-6 text-xs font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 w-full md:w-80 transition-all shadow-sm"
            />
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-[3rem] border border-gray-100 shadow-sm">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
              <FiPackage size={40} />
            </div>
            <h3 className="text-xl font-black text-[#2F2F33] mb-2">Queue is Empty</h3>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">No orders have been placed yet.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => {
              const StatusIcon = statusIcons[order.status] || FiClock;
              const isLocked = ["delivered", "cancelled"].includes(order.status);
              
              return (
                <div key={order._id} className="group bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-black/5 transition-all duration-500 overflow-hidden">
                  
                  {/* Top Bar: Info & Status */}
                  <div className="p-8 md:p-10 border-b border-gray-50 flex flex-col lg:flex-row lg:items-center justify-between gap-8 bg-gray-50/30">
                    <div className="flex items-start gap-6">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${statusStyles[order.status]} shadow-sm`}>
                        <StatusIcon size={24} />
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-3">
                          <h2 className="text-xl font-black tracking-tight uppercase">#{order._id.slice(-8)}</h2>
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusStyles[order.status]}`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          <span className="flex items-center gap-1.5"><FiUser className="text-blue-600" /> {order.user?.email}</span>
                          <span className="flex items-center gap-1.5"><FiCalendar className="text-blue-600" /> {new Date(order.createdAt).toLocaleDateString()}</span>
                          <span className="text-[#2F2F33] bg-white px-2 py-1 rounded border border-gray-100 shadow-sm">₹{order.totalAmount.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {!isLocked ? (
                        <div className="relative min-w-[160px]">
                          <select
                            value={order.status}
                            onChange={(e) => updateStatus(order._id, e.target.value)}
                            disabled={updatingId === order._id}
                            className="w-full appearance-none bg-white border-2 border-gray-100 rounded-2xl px-5 py-3 text-[10px] font-black uppercase tracking-widest text-[#2F2F33] focus:outline-none focus:border-blue-600 transition-all cursor-pointer shadow-sm disabled:opacity-50"
                          >
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                          <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-gray-400 font-black text-[10px] uppercase tracking-widest bg-white border border-gray-100 px-4 py-3 rounded-2xl shadow-sm">
                          <FiCheckCircle className={order.status === 'delivered' ? 'text-emerald-500' : 'text-rose-500'} />
                          {order.status === 'delivered' ? 'Completed' : 'Archived'}
                        </div>
                      )}
                      {updatingId === order._id && <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />}
                    </div>
                  </div>

                  {/* Main Content: Address & Items */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                    {/* Address Section */}
                    <div className="lg:col-span-4 p-8 md:p-10 bg-white border-b lg:border-b-0 lg:border-r border-gray-50">
                      <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                        <FiMapPin className="text-blue-600" /> Delivery To
                      </h3>
                      <div className="bg-gray-50/50 p-6 rounded-3xl border border-gray-50 group-hover:border-blue-100 transition-colors">
                        {formatAddress(order.shippingAddress)}
                      </div>
                      {order.status === 'cancelled' && order.cancelReason && (
                        <div className="mt-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl">
                          <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-1">Reason for Cancellation</p>
                          <p className="text-xs font-bold text-rose-800">{order.cancelReason}</p>
                        </div>
                      )}
                    </div>

                    {/* Items Section */}
                    <div className="lg:col-span-8 p-8 md:p-10">
                      <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                        <FiPackage className="text-blue-600" /> Order Items ({order.items.length})
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-3xl hover:border-blue-100 hover:shadow-sm transition-all group/item">
                            <div className="w-16 h-16 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 group-hover/item:scale-105 transition-transform">
                              {item.image ? (
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50"><FiPackage /></div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-black text-[#2F2F33] truncate uppercase tracking-tight">{item.name}</p>
                              <div className="flex items-center gap-3 mt-1">
                                <span className="text-[10px] font-black text-gray-400 bg-gray-50 px-2 py-0.5 rounded uppercase">Qty: {item.quantity}</span>
                                <span className="text-xs font-black text-blue-600">₹{item.price.toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
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