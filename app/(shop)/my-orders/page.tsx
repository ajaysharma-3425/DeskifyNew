"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPackage, FiCalendar, FiMapPin, FiChevronDown,
  FiXCircle, FiTruck, FiCheckCircle, FiClock, FiAlertCircle, FiPhone, FiUser
} from "react-icons/fi";

// --- Interfaces ---
interface OrderItem {
  product: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface Order {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: any;
  status: string;
  createdAt: string;
  cancelReason?: string;
  paymentMethod?: string; // Ye line add karein
  paymentStatus?: string; // Optional: Status dikhane ke liye
}

export default function MyOrders() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [cancelReasonInput, setCancelReasonInput] = useState("");
  const [isSubmittingCancel, setIsSubmittingCancel] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) { router.push("/login"); return; }
      const res = await fetch("/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  // --- Helper: Format Address ---
  const renderAddress = (address: any) => {
    if (!address) return "No address provided";
    return (
      <div className="space-y-1">
        <p className="flex items-center gap-2 font-bold text-slate-900">
          <FiUser size={14} className="text-[#10B981]" /> {address.fullName || address.name || "N/A"}
        </p>
        {address.phone && (
          <p className="flex items-center gap-2 text-slate-500 text-xs">
            <FiPhone size={12} /> {address.phone}
          </p>
        )}
        <p className="text-slate-600 text-xs leading-relaxed mt-2 pl-5">
          {address.addressLine || address.address},<br />
          {address.city}, {address.state} - <span className="font-semibold">{address.pincode}</span>
        </p>
      </div>
    );
  };

  const handleCancelSubmit = async () => {
    if (!cancelReasonInput.trim()) return alert("Please provide a reason.");
    try {
      setIsSubmittingCancel(true);
      const res = await fetch("/api/orders/cancel", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ orderId: selectedOrderId, cancelReason: cancelReasonInput }),
      });
      if (res.ok) {
        setIsModalOpen(false);
        setCancelReasonInput("");
        fetchOrders();
      }
    } catch (err) {
      alert("Failed to cancel order");
    } finally {
      setIsSubmittingCancel(false);
    }
  };

  const getStatusUI = (status: string) => {
    const s = status.toLowerCase();
    const configs: Record<string, { color: string; icon: any; bg: string }> = {
      pending: { color: "text-amber-600", bg: "bg-amber-50", icon: FiClock },
      shipped: { color: "text-blue-600", bg: "bg-blue-50", icon: FiTruck },
      delivered: { color: "text-emerald-600", bg: "bg-emerald-50", icon: FiCheckCircle },
      cancelled: { color: "text-rose-600", bg: "bg-rose-50", icon: FiXCircle },
    };
    const config = configs[s] || { color: "text-slate-600", bg: "bg-slate-50", icon: FiAlertCircle };
    const Icon = config.icon;
    return (
      <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${config.bg} ${config.color}`}>
        <Icon size={12} /> {status}
      </span>
    );
  };

  if (loading) return <LoadingState />;
  if (orders.length === 0) return <EmptyState />;

  return (
    <div className="min-h-screen bg-[#F9FAFB] pt-24 pb-20 font-sans">
      <div className="max-w-5xl mx-auto px-6">
        <header className="mb-12">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Order History</h1>
          <p className="text-slate-500 font-medium mt-2">Manage your purchases and track delivery status.</p>
        </header>

        <div className="space-y-6">
          {orders.map((order) => (
            <motion.div layout key={order._id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              {/* HEADER */}
              <div
                className="p-6 md:p-8 cursor-pointer hover:bg-slate-50/50 transition-colors"
                onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-[#10B981] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-100">
                      <FiPackage size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-900">Order #{order._id.slice(-8).toUpperCase()}</h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-slate-400 font-medium">
                        <span className="flex items-center gap-1"><FiCalendar /> {new Date(order.createdAt).toLocaleDateString("en-IN")}</span>
                        <span className="text-[#10B981] font-bold">₹{order.totalAmount.toLocaleString("en-IN")}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between md:justify-end gap-4">
                    {getStatusUI(order.status)}
                    <motion.div animate={{ rotate: expandedOrder === order._id ? 180 : 0 }}>
                      <FiChevronDown className="text-slate-300" size={24} />
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* EXPANDED CONTENT */}
              <AnimatePresence>
                {expandedOrder === order._id && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                    <div className="p-8 bg-slate-50/30 border-t border-slate-50">

                      {order.status.toLowerCase() === "cancelled" && (
                        <div className="mb-8 p-5 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-4">
                          <FiAlertCircle className="text-rose-500 mt-1" size={20} />
                          <div>
                            <h4 className="text-sm font-black text-rose-900 uppercase">Order Cancelled</h4>
                            <p className="text-sm text-rose-700 mt-1 italic">Reason: {order.cancelReason || "No reason specified"}</p>
                          </div>
                        </div>
                      )}

                      <div className="grid md:grid-cols-2 gap-12">
                        {/* LEFT: ITEMS */}
                        <div>
                          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Product Details</h4>
                          <div className="space-y-3">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-slate-100">
                                <img src={item.image || "/placeholder.png"} className="w-14 h-14 rounded-xl object-cover" alt="" />
                                <div className="flex-1">
                                  <p className="text-sm font-bold text-slate-800">{item.name}</p>
                                  <p className="text-xs text-slate-400">Qty: {item.quantity} × ₹{item.price.toLocaleString()}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* RIGHT: SHIPPING ADDRESS & ACTION */}
                        <div className="flex flex-col justify-between">
                          <div className="space-y-6">
                            <div>
                              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                                <FiMapPin size={12} className="text-[#10B981]" /> Shipping To
                              </h4>
                              {/* --- UPDATED FULL ADDRESS DISPLAY --- */}
                              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                                {renderAddress(order.shippingAddress)}
                              </div>
                            </div>

                            {order.status.toLowerCase() === "pending" && (
                              <button
                                onClick={() => { setSelectedOrderId(order._id); setIsModalOpen(true); }}
                                className="flex items-center gap-2 text-rose-500 text-[10px] font-black hover:bg-rose-50 px-5 py-3 rounded-xl border border-rose-100 uppercase tracking-widest transition-all"
                              >
                                <FiXCircle /> Cancel This Order
                              </button>
                            )}
                          </div>

                          {/* --- PAYMENT METHOD SECTION --- */}
                          <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center">
                            <div className="flex flex-col">
                              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                Payment Method
                              </span>
                              <span className={`text-sm font-bold flex items-center gap-2 ${order.paymentMethod?.toLowerCase() === 'online' || order.paymentMethod?.toLowerCase() === 'upi'
                                  ? 'text-[#10B981]'
                                  : 'text-slate-900'
                                }`}>
                                {/* Agar backend se paymentMethod mil raha hai to wo dikhao, varna default COD */}
                                {order.paymentMethod ? (
                                  order.paymentMethod.toUpperCase() === 'COD' ? 'Cash on Delivery' :
                                    order.paymentMethod.toUpperCase() === 'ONLINE' ? 'Online Payment (UPI/Card)' :
                                      order.paymentMethod
                                ) : 'Cash on Delivery'}

                                {/* Chota sa tag agar payment complete ho chuki hai */}
                                {order.paymentMethod?.toLowerCase() !== 'cod' && (
                                  <span className="text-[8px] bg-emerald-100 text-emerald-600 px-1.5 py-0.5 rounded-md uppercase">
                                    Paid
                                  </span>
                                )}
                              </span>
                            </div>

                            <Link
                              href={`/support?id=${order._id}`}
                              className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
                            >
                              Get Support
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CANCELLATION MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl">
              <h2 className="text-2xl font-black text-slate-900 mb-2">Cancel Order?</h2>
              <p className="text-slate-500 mb-6 font-medium text-sm">Please let us know the reason for cancellation.</p>
              <textarea
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-[#10B981] outline-none h-32 mb-6"
                placeholder="Changed my mind..." value={cancelReasonInput} onChange={(e) => setCancelReasonInput(e.target.value)}
              />
              <div className="flex gap-3">
                <button disabled={isSubmittingCancel} onClick={handleCancelSubmit} className="flex-1 bg-rose-500 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-600 transition-all">
                  {isSubmittingCancel ? "Stopping..." : "Confirm"}
                </button>
                <button onClick={() => setIsModalOpen(false)} className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all">
                  Back
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6">
      <div className="w-20 h-20 bg-emerald-50 rounded-[2rem] flex items-center justify-center mb-6 text-[#10B981]"><FiPackage size={32} /></div>
      <h2 className="text-2xl font-black text-slate-900">No Orders Found</h2>
      <p className="text-slate-400 font-medium mt-2 mb-8 text-center max-w-xs">Your order history is currently empty.</p>
      <Link href="/" className="bg-[#10B981] text-white px-10 py-4 rounded-[1.5rem] font-black uppercase tracking-widest text-sm shadow-xl shadow-emerald-100 transition-all hover:-translate-y-1">Start Shopping</Link>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-24 animate-pulse">
      <div className="h-10 bg-slate-100 w-48 rounded-xl mb-12" />
      {[1, 2].map(i => <div key={i} className="h-40 bg-slate-100 rounded-[2rem] mb-6" />)}
    </div>
  );
}