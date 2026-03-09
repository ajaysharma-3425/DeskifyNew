"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiArrowLeft, FiMapPin, FiPlus, FiTrash2, 
  FiEdit3, FiCheckCircle, FiHome, FiBriefcase 
} from "react-icons/fi";

interface Address {
  _id?: string;
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

export default function AddressesPage() {
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) { router.push("/login"); return; }

        // Fetching from your existing orders to populate initial list
        const res = await fetch("/api/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const orders = await res.json();
          // Filter unique addresses from orders
          const uniqueAddrs = Array.from(
            new Set(orders.filter((o: any) => o.shippingAddress).map((o: any) => JSON.stringify(o.shippingAddress)))
          ).map((str: any) => JSON.parse(str)) as Address[];
          
          setAddresses(uniqueAddrs);
        }
      } catch (err) {
        console.error("Failed to load addresses", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, [router]);

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-20">
      {/* Header Section */}
      <div className="bg-white border-b border-slate-100 pt-12 pb-8">
        <div className="max-w-4xl mx-auto px-6">
          <Link href="/profile" className="inline-flex items-center text-slate-400 hover:text-slate-900 font-black text-[10px] uppercase tracking-[0.2em] mb-6 transition-colors group">
            <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Profile
          </Link>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Shipping Addresses</h1>
              <p className="text-slate-400 text-sm font-medium mt-1">Manage your delivery locations for faster checkout</p>
            </div>
            <button className="flex items-center justify-center gap-2 bg-[#10B981] text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 shadow-lg shadow-emerald-100 transition-all active:scale-95">
              <FiPlus size={16}/> Add New Address
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 mt-10">
        {loading ? (
          <div className="flex flex-col items-center py-20">
            <div className="w-10 h-10 border-4 border-slate-100 border-t-[#10B981] rounded-full animate-spin mb-4" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Loading your addresses...</p>
          </div>
        ) : addresses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence>
              {addresses.map((addr, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative bg-white p-6 rounded-[2rem] border-2 transition-all group ${
                    index === 0 ? "border-[#10B981] shadow-md" : "border-slate-100 hover:border-slate-200"
                  }`}
                >
                  {index === 0 && (
                    <div className="absolute -top-3 left-6 bg-[#10B981] text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1">
                      <FiCheckCircle /> Default
                    </div>
                  )}

                  <div className="flex justify-between items-start mb-4 mt-2">
                    <div className="bg-slate-50 p-3 rounded-xl text-slate-400 group-hover:text-[#10B981] transition-colors">
                      {index % 2 === 0 ? <FiHome size={20} /> : <FiBriefcase size={20} />}
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 text-slate-400 hover:text-[#10B981] hover:bg-emerald-50 rounded-lg transition-all">
                        <FiEdit3 size={16} />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all">
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-lg font-black text-slate-800">{addr.fullName}</h3>
                  <p className="text-slate-500 text-sm mt-2 leading-relaxed font-medium">
                    {addr.addressLine}<br />
                    {addr.city}, {addr.pincode}
                  </p>
                  
                  <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{addr.phone}</span>
                    {index !== 0 && (
                      <button className="text-[10px] font-black text-[#10B981] uppercase tracking-widest hover:underline decoration-2 underline-offset-4">
                        Set as Default
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="bg-white rounded-[2.5rem] p-12 text-center border border-dashed border-slate-200">
            <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FiMapPin size={32} />
            </div>
            <h2 className="text-xl font-black text-slate-900">No addresses saved yet</h2>
            <p className="text-slate-500 text-sm mt-2 mb-8">Add your first shipping address to get started with your next order.</p>
            <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#10B981] transition-all">
              Add New Address
            </button>
          </div>
        )}
      </div>
    </div>
  );
}