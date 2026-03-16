"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiArrowLeft, FiMapPin, FiPlus, FiTrash2, 
  FiEdit3, FiCheckCircle, FiHome, FiBriefcase, FiZap 
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

        const res = await fetch("/api/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const orders = await res.json();
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
    <div className="min-h-screen bg-[#003F3A] text-white font-sans pb-20 selection:bg-[#A4F000] selection:text-[#003F3A]">
      {/* Header Section */}
      <div className="relative border-b border-white/5 pt-16 pb-12 overflow-hidden">
        {/* Decorative Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#A4F000]/5 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <Link href="/profile" className="inline-flex items-center text-white/30 hover:text-[#A4F000] font-black text-[10px] uppercase tracking-[0.3em] mb-8 transition-all group">
            <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Profile
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase leading-none">
                Shipping <span className="text-[#A4F000]">Vault</span>
              </h1>
              <p className="text-white/40 text-sm font-medium mt-3 uppercase tracking-wider">Manage your secure delivery nodes</p>
            </div>
            <button className="flex items-center justify-center gap-3 bg-[#A4F000] text-[#003F3A] px-8 py-4 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white shadow-[0_10px_30px_-10px_rgba(164,240,0,0.4)] transition-all active:scale-95 group">
              <FiPlus size={18} className="group-hover:rotate-90 transition-transform duration-300"/> Add New Node
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 mt-12">
        {loading ? (
          <div className="flex flex-col items-center py-24">
            <div className="w-12 h-12 border-4 border-white/5 border-t-[#A4F000] rounded-full animate-spin mb-6" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#A4F000]/50 animate-pulse">Scanning Addresses...</p>
          </div>
        ) : addresses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence>
              {addresses.map((addr, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative bg-white/5 p-8 rounded-[2.5rem] border transition-all group backdrop-blur-md ${
                    index === 0 ? "border-[#A4F000]/30 shadow-[0_20px_50px_-20px_rgba(164,240,0,0.15)]" : "border-white/5 hover:border-white/10"
                  }`}
                >
                  {index === 0 && (
                    <div className="absolute -top-3 left-8 bg-[#A4F000] text-[#003F3A] text-[9px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full flex items-center gap-2 shadow-lg shadow-[#A4F000]/20">
                      <FiCheckCircle /> Primary Node
                    </div>
                  )}

                  <div className="flex justify-between items-start mb-6">
                    <div className="bg-white/5 p-4 rounded-2xl text-[#A4F000] group-hover:bg-[#A4F000] group-hover:text-[#003F3A] transition-all duration-500">
                      {index % 2 === 0 ? <FiHome size={22} /> : <FiBriefcase size={22} />}
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2.5 text-white/30 hover:text-[#A4F000] bg-white/5 hover:bg-white/10 rounded-xl transition-all">
                        <FiEdit3 size={16} />
                      </button>
                      <button className="p-2.5 text-white/30 hover:text-red-500 bg-white/5 hover:bg-red-500/10 rounded-xl transition-all">
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-xl font-black text-white italic uppercase tracking-tight">{addr.fullName}</h3>
                  <p className="text-white/40 text-sm mt-3 leading-relaxed font-medium">
                    {addr.addressLine}<br />
                    <span className="text-white/60">{addr.city}, {addr.pincode}</span>
                  </p>
                  
                  <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] group-hover:text-[#A4F000]/50 transition-colors">{addr.phone}</span>
                    {index !== 0 && (
                      <button className="text-[10px] font-black text-[#A4F000] uppercase tracking-[0.2em] hover:text-white transition-colors flex items-center gap-1">
                        <FiZap size={10} /> Set Default
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="bg-white/5 rounded-[3rem] p-16 text-center border-2 border-dashed border-white/5 backdrop-blur-sm">
            <div className="w-20 h-20 bg-white/5 text-white/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
              <FiMapPin size={40} />
            </div>
            <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">No nodes detected</h2>
            <p className="text-white/30 text-sm mt-3 mb-10 max-w-xs mx-auto uppercase tracking-wide leading-relaxed">Add your first shipping destination to activate checkout protocol.</p>
            <button className="bg-[#A4F000] text-[#003F3A] px-10 py-5 rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.3em] hover:bg-white transition-all shadow-xl shadow-[#A4F000]/10 active:scale-95">
              Add New Address Node
            </button>
          </div>
        )}
      </div>

      <div className="mt-24 text-center">
        <p className="text-[10px] font-black uppercase tracking-[1em] text-white/5 italic">Deskify Secure Logistics</p>
      </div>
    </div>
  );
}