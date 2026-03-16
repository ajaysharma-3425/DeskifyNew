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
      <div className="min-h-screen flex items-center justify-center bg-[#003F3A]">
        <div className="w-12 h-12 border-4 border-white/10 border-t-[#A4F000] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#003F3A] text-white font-sans pb-20 selection:bg-[#A4F000] selection:text-[#003F3A]">
      {/* Top Header */}
      <div className="max-w-2xl mx-auto px-6 pt-12">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <Link href="/profile" className="inline-flex items-center text-white/40 hover:text-[#A4F000] font-bold text-xs uppercase tracking-widest transition-colors group">
            <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Cancel Changes
          </Link>
        </motion.div>
      </div>

      <div className="max-w-2xl mx-auto px-6 mt-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-white/10 relative overflow-hidden backdrop-blur-xl"
        >
          {/* Subtle Accent Glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#A4F000]/10 rounded-bl-full -mr-10 -mt-10 blur-2xl" />

          <div className="mb-10 text-center md:text-left italic">
            <h1 className="text-3xl font-black tracking-tight text-white uppercase italic">Edit Profile</h1>
            <p className="text-[#A4F000]/50 font-medium mt-1 uppercase text-[10px] tracking-[0.2em]">Update your personal information</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Full Name</label>
              <div className="relative group">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#A4F000] transition-colors" />
                <input
                  type="text"
                  value={user.name}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-white outline-none focus:border-[#A4F000]/50 focus:bg-white/10 transition-all italic"
                  placeholder="Enter your name"
                  required
                />
              </div>
            </div>

            {/* Email Field (Disabled) */}
            <div className="space-y-2 opacity-50">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Email Address (Read Only)</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full bg-[#002A27] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-white/40 cursor-not-allowed italic"
                />
              </div>
            </div>

            {/* Phone Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Phone Number</label>
              <div className="relative group">
                <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#A4F000] transition-colors" />
                <input
                  type="tel"
                  value={user.phone}
                  onChange={(e) => setUser({ ...user, phone: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-white outline-none focus:border-[#A4F000]/50 focus:bg-white/10 transition-all italic"
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
                  status.type === 'success' ? 'bg-[#A4F000]/10 text-[#A4F000]' : 'bg-red-500/10 text-red-500'
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
                className="w-full flex items-center justify-center gap-3 py-5 bg-[#A4F000] text-[#003F3A] rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-white disabled:bg-white/10 disabled:text-white/20 transition-all duration-300 shadow-[0_10px_40px_-10px_rgba(164,240,0,0.3)] active:scale-95"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-[#003F3A]/30 border-t-[#003F3A] rounded-full animate-spin" />
                ) : (
                  <>
                    <FiSave size={18} />
                    Save Protocol
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>

        <p className="text-center mt-10 text-[10px] font-black uppercase tracking-[0.3em] text-white/10 italic">
          Data changes are synced across the secure deskify network
        </p>
      </div>
    </div>
  );
}