"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  FiArrowLeft, 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiCheckCircle, 
  FiAlertCircle,
  FiSave
} from "react-icons/fi";

interface User {
  name: string;
  email: string;
  phone?: string;
}

export default function EditProfile() {
  const router = useRouter();
  const [user, setUser] = useState<User>({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setUser(data.user);
      } catch (err) {
        console.error("Failed to load profile");
      } finally {
        setInitialLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    const token = localStorage.getItem("token");
    try {
      const res = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: user.name, phone: user.phone }),
      });

      const data = await res.json();
      if (res.ok) {
        setStatus({ type: 'success', msg: "Profile updated successfully!" });
        setTimeout(() => router.push("/profile"), 1500);
      } else {
        setStatus({ type: 'error', msg: data.message || "Update failed" });
      }
    } catch (err) {
      setStatus({ type: 'error', msg: "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
        <div className="w-12 h-12 border-4 border-slate-100 border-t-[#10B981] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-slate-900 font-sans pb-20">
      {/* Top Header */}
      <div className="max-w-2xl mx-auto px-6 pt-12">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <Link href="/profile" className="inline-flex items-center text-slate-500 hover:text-slate-900 font-bold text-xs uppercase tracking-widest transition-colors group">
            <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Cancel Changes
          </Link>
        </motion.div>
      </div>

      <div className="max-w-2xl mx-auto px-6 mt-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100 relative overflow-hidden"
        >
          {/* Subtle Accent */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#10B981]/5 rounded-bl-full -mr-10 -mt-10" />

          <div className="mb-10 text-center md:text-left">
            <h1 className="text-3xl font-black tracking-tight text-slate-900">Edit Profile</h1>
            <p className="text-slate-400 font-medium mt-1 uppercase text-[10px] tracking-[0.2em]">Update your personal information</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
              <div className="relative group">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#10B981] transition-colors" />
                <input
                  type="text"
                  value={user.name}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-700 outline-none focus:border-[#10B981] focus:ring-4 focus:ring-emerald-500/5 transition-all"
                  placeholder="Enter your name"
                  required
                />
              </div>
            </div>

            {/* Email Field (Disabled) */}
            <div className="space-y-2 opacity-70">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address (Read Only)</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full bg-slate-100 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-400 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Phone Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Phone Number</label>
              <div className="relative group">
                <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#10B981] transition-colors" />
                <input
                  type="tel"
                  value={user.phone}
                  onChange={(e) => setUser({ ...user, phone: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-700 outline-none focus:border-[#10B981] focus:ring-4 focus:ring-emerald-500/5 transition-all"
                  placeholder="+91 00000 00000"
                />
              </div>
            </div>

            {/* Feedback Message */}
            {status && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`p-4 rounded-2xl flex items-center gap-3 text-sm font-bold ${
                  status.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                }`}
              >
                {status.type === 'success' ? <FiCheckCircle /> : <FiAlertCircle />}
                {status.msg}
              </motion.div>
            )}

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-[#10B981] disabled:bg-slate-200 disabled:text-slate-400 transition-all duration-300 shadow-xl shadow-slate-200 hover:shadow-emerald-200"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <FiSave size={18} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>

        <p className="text-center mt-10 text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">
          Data changes are synced across all devices
        </p>
      </div>
    </div>
  );
}