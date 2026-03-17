"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiEdit2,
  FiLock,
  FiLogOut,
  FiArrowLeft,
  FiShield
} from "react-icons/fi";

interface Admin {
  _id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  bio?: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminProfilePage() {
  const router = useRouter();
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const res = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          if (res.status === 401) router.push("/login");
          throw new Error("Failed to fetch profile");
        }

        const data = await res.json();
        setAdmin(data.user);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchAdmin();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#F5F6F7]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !admin) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#F5F6F7]">
        <div className="bg-[#2F2F33] border border-white/10 p-6 rounded-2xl text-white shadow-2xl">
          {error || "User not found"}
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-[#F5F6F7] pb-20">
      <div className="max-w-5xl mx-auto px-6 pt-12">
        
        {/* Top Navigation */}
        <div className="flex justify-between items-center mb-12">
          <button 
            onClick={() => router.back()}
            className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-blue-600 transition-colors"
          >
            <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            Control Center
          </button>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-rose-500 border border-rose-100 rounded-full hover:bg-rose-500 hover:text-white transition-all duration-300"
          >
            <FiLogOut size={14} /> Termination
          </button>
        </div>

        {/* Hero Profile Card (Slate & Blue) */}
        <div className="bg-[#2F2F33] rounded-[3rem] p-10 mb-10 text-white shadow-2xl shadow-blue-900/20 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-5">
             <FiShield size={200} />
          </div>
          
          <div className="relative">
            <div className="w-32 h-32 bg-blue-600 rounded-[2.5rem] flex items-center justify-center text-4xl font-black shadow-2xl shadow-blue-500/40 border-4 border-white/10">
              {admin.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
            </div>
          </div>

          <div className="text-center md:text-left flex-1 relative z-10">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <h1 className="text-4xl font-black tracking-tighter">{admin.name}</h1>
              <span className="w-fit mx-auto md:mx-0 px-4 py-1 bg-white/10 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border border-white/5">
                {admin.role === "admin" ? "Master Admin" : "Team Manager"}
              </span>
            </div>
            <p className="mt-2 text-blue-400 text-xs font-black uppercase tracking-[0.3em]">
               Executive Level Authority
            </p>
          </div>

          <Link
            href="/admin/profile/edit"
            className="px-8 py-4 bg-white text-[#2F2F33] text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-xl relative z-10"
          >
            <FiEdit2 className="inline mr-2" /> Modify Profile
          </Link>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Identity Block */}
          <div className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-black/5 border border-gray-100">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-8 flex items-center gap-3">
              <FiUser className="text-blue-600" /> Identity Details
            </h3>
            
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-black text-gray-300 uppercase tracking-widest mb-1">First Name</label>
                  <p className="text-[#2F2F33] font-bold">{admin.name.split(" ")[0] || "-"}</p>
                </div>
                <div>
                  <label className="block text-[9px] font-black text-gray-300 uppercase tracking-widest mb-1">Last Name</label>
                  <p className="text-[#2F2F33] font-bold">{admin.name.split(" ").slice(1).join(" ") || "-"}</p>
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-black text-gray-300 uppercase tracking-widest mb-1">Email Protocol</label>
                <div className="flex items-center gap-3 text-[#2F2F33] font-bold">
                  <FiMail className="text-blue-600" /> {admin.email}
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-black text-gray-300 uppercase tracking-widest mb-1">Professional Bio</label>
                <p className="text-[#2F2F33] font-bold leading-relaxed">
                  {admin.bio || "No administrative bio provided."}
                </p>
              </div>
            </div>
          </div>

          {/* Logistics Block */}
          <div className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-black/5 border border-gray-100">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-8 flex items-center gap-3">
              <FiMapPin className="text-blue-600" /> Logistics & Region
            </h3>
            
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-black text-gray-300 uppercase tracking-widest mb-1">Country</label>
                  <p className="text-[#2F2F33] font-bold">India</p>
                </div>
                <div>
                  <label className="block text-[9px] font-black text-gray-300 uppercase tracking-widest mb-1">Primary Base</label>
                  <p className="text-[#2F2F33] font-bold">{admin.location || "Ahmedabad, Gujarat"}</p>
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-black text-gray-300 uppercase tracking-widest mb-1">Contact String</label>
                <div className="flex items-center gap-3 text-[#2F2F33] font-bold">
                  <FiPhone className="text-blue-600" /> {admin.phone || "+91 ——— ———"}
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-black text-gray-300 uppercase tracking-widest mb-1">Security Token</label>
                <p className="text-[#2F2F33] font-bold uppercase tracking-tighter">AS4568384</p>
              </div>
            </div>
          </div>

          {/* Account Security Block (Full Width) */}
          <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-10 shadow-xl shadow-black/5 border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner">
                <FiLock size={24} />
              </div>
              <div>
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#2F2F33]">Access History</h3>
                <div className="flex gap-8 mt-2">
                   <div>
                      <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-0.5">Established</p>
                      <p className="text-[#2F2F33] text-xs font-bold">{formatDate(admin.createdAt)}</p>
                   </div>
                   <div>
                      <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-0.5">Last Sync</p>
                      <p className="text-[#2F2F33] text-xs font-bold">{formatDate(admin.updatedAt)}</p>
                   </div>
                </div>
              </div>
            </div>
            
            <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em]">
              Deskify Platform Security v4.0.2
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}