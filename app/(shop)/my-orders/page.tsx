"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPackage, FiCalendar, FiMapPin, FiChevronDown,
  FiXCircle, FiTruck, FiCheckCircle, FiClock, FiAlertCircle, FiPhone, FiUser, FiZap
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
  paymentMethod?: string;
  paymentStatus?: string;
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

  const renderAddress = (address: any) => {
    if (!address) return "No address provided";
    return (
      <div className="space-y-1">
        <p className="flex items-center gap-2 font-bold text-white italic">
          <FiUser size={14} className="text-[#A4F000]" /> {address.fullName || address.name || "N/A"}
        </p>
        {address.phone && (
          <p className="flex items-center gap-2 text-white/40 text-xs">
            <FiPhone size={12} /> {address.phone}
          </p>
        )}
        <p className="text-white/60 text-xs leading-relaxed mt-2 pl-5 italic">
          {address.addressLine || address.address},<br />
          {address.city}, {address.state} - <span className="text-[#A4F000] font-semibold">{address.pincode}</span>
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
      pending: { color: "text-amber-400", bg: "bg-amber-400/10", icon: FiClock },
      shipped: { color: "text-blue-400", bg: "bg-blue-400/10", icon: FiTruck },
      delivered: { color: "text-[#A4F000]", bg: "bg-[#A4F000]/10", icon: FiCheckCircle },
      cancelled: { color: "text-rose-500", bg: "bg-rose-500/10", icon: FiXCircle },
    };
    const config = configs[s] || { color: "text-white/40", bg: "bg-white/5", icon: FiAlertCircle };
    const Icon = config.icon;
    return (
      <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.15em] ${config.bg} ${config.color} border border-current/20`}>
        <Icon size={12} /> {status}
      </span>
    );
  };

  if (loading) return <LoadingState />;
  if (orders.length === 0) return <EmptyState />;

  return (
    <div className="min-h-screen bg-[#003F3A] pt-24 pb-20 font-sans text-white selection:bg-[#A4F000] selection:text-[#003F3A]">
      <div className="max-w-5xl mx-auto px-6">
        <header className="mb-16 relative">
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-[#A4F000]/5 blur-3xl rounded-full" />
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">Deployment <span className="text-[#A4F000]">History</span></h1>
          <p className="text-white/40 font-medium mt-2 uppercase text-[10px] tracking-[0.2em]">Track and manage your deskify hardware acquisitions</p>
        </header>

        <div className="space-y-6">
          {orders.map((order) => (
            <motion.div layout key={order._id} className="bg-white/5 backdrop-blur-md rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden group transition-all hover:border-white/20">
              {/* HEADER */}
              <div
                className="p-8 cursor-pointer hover:bg-white/[0.02] transition-colors"
                onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-[#A4F000] rounded-2xl flex items-center justify-center text-[#003F3A] shadow-[0_10px_30px_-5px_rgba(164,240,0,0.3)] transition-transform group-hover:scale-105">
                      <FiPackage size={28} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-white italic uppercase tracking-tight">Order #{order._id.slice(-8).toUpperCase()}</h3>
                      <div className="flex items-center gap-5 mt-2 text-[11px] text-white/30 font-bold uppercase tracking-widest">
                        <span className="flex items-center gap-1.5"><FiCalendar className="text-[#A4F000]" /> {new Date(order.createdAt).toLocaleDateString("en-IN")}</span>
                        <span className="text-white/80 bg-white/10 px-2 py-0.5 rounded">₹{order.totalAmount.toLocaleString("en-IN")}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between md:justify-end gap-6">
                    {getStatusUI(order.status)}
                    <motion.div animate={{ rotate: expandedOrder === order._id ? 180 : 0 }}>
                      <FiChevronDown className="text-white/20" size={24} />
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* EXPANDED CONTENT */}
              <AnimatePresence>
                {expandedOrder === order._id && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                    <div className="p-10 bg-black/20 border-t border-white/5">

                      {order.status.toLowerCase() === "cancelled" && (
                        <div className="mb-10 p-6 bg-rose-500/10 border border-rose-500/20 rounded-[2rem] flex items-start gap-4">
                          <FiAlertCircle className="text-rose-500 mt-1" size={20} />
                          <div>
                            <h4 className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Order Terminated</h4>
                            <p className="text-sm text-rose-200/60 mt-1 italic">Reason: {order.cancelReason || "No protocol specified"}</p>
                          </div>
                        </div>
                      )}

                      <div className="grid md:grid-cols-2 gap-16">
                        {/* LEFT: ITEMS */}
                        <div>
                          <h4 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-6">Hardware Manifest</h4>
                          <div className="space-y-4">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex items-center gap-5 bg-white/5 p-4 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                                <img src={item.image || "/placeholder.png"} className="w-16 h-16 rounded-xl object-cover grayscale hover:grayscale-0 transition-all shadow-lg" alt="" />
                                <div className="flex-1">
                                  <p className="text-sm font-bold text-white uppercase italic">{item.name}</p>
                                  <p className="text-[10px] text-[#A4F000]/50 font-black mt-1 uppercase tracking-widest">UNIT: {item.quantity} <span className="mx-2">|</span> VAL: ₹{item.price.toLocaleString()}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* RIGHT: SHIPPING & ACTION */}
                        <div className="flex flex-col justify-between">
                          <div className="space-y-8">
                            <div>
                              <h4 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                                <FiMapPin size={12} className="text-[#A4F000]" /> Destination Node
                              </h4>
                              <div className="bg-white/[0.03] p-6 rounded-[2rem] border border-white/5 shadow-inner">
                                {renderAddress(order.shippingAddress)}
                              </div>
                            </div>

                            {order.status.toLowerCase() === "pending" && (
                              <button
                                onClick={() => { setSelectedOrderId(order._id); setIsModalOpen(true); }}
                                className="group flex items-center gap-3 text-rose-500 text-[10px] font-black hover:bg-rose-500 hover:text-white px-6 py-4 rounded-2xl border border-rose-500/30 uppercase tracking-[0.2em] transition-all active:scale-95"
                              >
                                <FiXCircle className="group-hover:rotate-90 transition-transform" /> Abort Shipment
                              </button>
                            )}
                          </div>

                          {/* PAYMENT METHOD */}
                          <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex flex-col">
                              <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">
                                Transaction Protocol
                              </span>
                              <div className="flex items-center gap-3 mt-1">
                                <span className={`text-sm font-black italic uppercase ${order.paymentMethod?.toLowerCase() === 'online' || order.paymentMethod?.toLowerCase() === 'upi' ? 'text-[#A4F000]' : 'text-white'}`}>
                                    {order.paymentMethod ? (
                                    order.paymentMethod.toUpperCase() === 'COD' ? 'Cash on Delivery' :
                                    order.paymentMethod.toUpperCase() === 'ONLINE' ? 'Digital Ledger (UPI/Card)' :
                                    order.paymentMethod
                                    ) : 'Cash on Delivery'}
                                </span>
                                {order.paymentMethod?.toLowerCase() !== 'cod' && (
                                  <span className="text-[8px] bg-[#A4F000]/10 text-[#A4F000] border border-[#A4F000]/20 px-2 py-0.5 rounded uppercase font-black tracking-tighter">
                                    VERIFIED
                                  </span>
                                )}
                              </div>
                            </div>

                            <Link
                              href={`/support?id=${order._id}`}
                              className="px-8 py-4 bg-white text-[#003F3A] rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#A4F000] transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2"
                            >
                              <FiZap /> Contact HQ
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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-[#002A27]/80 backdrop-blur-xl" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative bg-[#003F3A] border border-white/10 w-full max-w-md rounded-[3rem] p-12 shadow-[0_30px_100px_rgba(0,0,0,0.5)]">
              <h2 className="text-2xl font-black text-white mb-2 italic uppercase">Abort Order?</h2>
              <p className="text-white/40 mb-8 font-medium text-xs uppercase tracking-widest">Reasoning required for termination protocol.</p>
              <textarea
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-sm text-white focus:border-[#A4F000]/50 focus:bg-white/10 outline-none h-32 mb-8 transition-all italic"
                placeholder="Protocol mismatch..." value={cancelReasonInput} onChange={(e) => setCancelReasonInput(e.target.value)}
              />
              <div className="flex gap-4">
                <button disabled={isSubmittingCancel} onClick={handleCancelSubmit} className="flex-1 bg-rose-500 text-white py-5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/20 active:scale-95">
                  {isSubmittingCancel ? "Processing..." : "Confirm Abort"}
                </button>
                <button onClick={() => setIsModalOpen(false)} className="flex-1 bg-white/5 text-white/40 py-5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all border border-white/5">
                  Dismiss
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#003F3A] px-6 text-center">
      <div className="w-24 h-24 bg-white/5 border border-white/10 rounded-[2.5rem] flex items-center justify-center mb-8 text-[#A4F000] shadow-2xl animate-bounce">
        <FiPackage size={40} />
      </div>
      <h2 className="text-3xl font-black text-white italic uppercase">No Deployments Found</h2>
      <p className="text-white/30 font-medium mt-3 mb-12 uppercase text-[10px] tracking-[0.3em] max-w-xs leading-loose">Your tactical hardware history is currently void.</p>
      <Link href="/" className="bg-[#A4F000] text-[#003F3A] px-12 py-5 rounded-[1.5rem] font-black uppercase tracking-[0.3em] text-[11px] shadow-[0_10px_40px_-10px_rgba(164,240,0,0.4)] transition-all hover:bg-white active:scale-95 italic">Initialize Shopping</Link>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="min-h-screen bg-[#003F3A] max-w-5xl mx-auto px-6 py-32">
      <div className="h-10 bg-white/5 w-64 rounded-2xl mb-16 animate-pulse" />
      {[1, 2].map(i => <div key={i} className="h-48 bg-white/5 rounded-[3rem] mb-8 animate-pulse border border-white/5" />)}
    </div>
  );
}