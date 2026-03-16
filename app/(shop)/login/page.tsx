"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import Image from "next/image";
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiShield } from "react-icons/fi";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        const payload = JSON.parse(atob(data.token.split(".")[1]));
        login(data.token, payload.role || "user");
        router.push(payload.role === "admin" ? "/admin/dashboard" : "/");
      } else {
        setError(data.message || "Access Denied: Invalid Credentials");
      }
    } catch (err) {
      setError("Network bypass failed. Check connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#003F3A] px-4 overflow-hidden relative">
      {/* Dynamic Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#A4F000]/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#A4F000]/5 blur-[120px] rounded-full" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full z-10"
      >
        {/* Logo Section */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex flex-col items-center">
            <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-4 shadow-2xl backdrop-blur-sm">
              <Image src="/Logo.png" alt="Deskify" width={40} height={40} className="object-contain" />
            </div>
            <h1 className="text-3xl font-black tracking-tighter text-white italic uppercase">
              DESKIFY <span className="text-[#A4F000]">PORTAL</span>
            </h1>
            <div className="h-1 w-12 bg-[#A4F000] mt-2 rounded-full" />
          </Link>
        </div>

        <div className="bg-white/[0.03] backdrop-blur-xl p-8 md:p-10 rounded-[2.5rem] border border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.4)]">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white tracking-tight">Identity Verification</h2>
            <p className="text-white/40 text-xs uppercase tracking-[0.2em] mt-1 font-medium">Enter secure credentials to proceed</p>
          </div>

          {/* Error Alert */}
          {error && (
            <motion.div 
              initial={{ x: -10 }} animate={{ x: 0 }}
              className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl mb-6"
            >
              <p className="text-rose-400 text-xs font-black uppercase tracking-widest text-center">{error}</p>
            </motion.div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Email Field */}
              <div className="group">
                <label className="block text-[10px] font-black text-[#A4F000] uppercase tracking-[0.3em] mb-2 ml-1">Terminal ID (Email)</label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#A4F000] transition-colors" />
                  <input
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 text-white rounded-2xl focus:outline-none focus:border-[#A4F000]/50 focus:bg-white/[0.08] transition-all placeholder:text-white/10 font-bold italic text-sm"
                    placeholder="operator@deskify.com"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="group">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-[10px] font-black text-[#A4F000] uppercase tracking-[0.3em] ml-1">Access Key</label>
                  <Link href="/forgot-password"  className="text-[10px] font-black text-white/20 hover:text-[#A4F000] uppercase transition-colors">Recovery?</Link>
                </div>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#A4F000] transition-colors" />
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={form.password}
                    onChange={handleChange}
                    className="w-full pl-12 pr-12 py-4 bg-white/5 border border-white/10 text-white rounded-2xl focus:outline-none focus:border-[#A4F000]/50 focus:bg-white/[0.08] transition-all placeholder:text-white/10 font-bold text-sm tracking-widest"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                  >
                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-[#A4F000] text-[#003F3A] rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-white transition-all shadow-xl shadow-[#A4F000]/10 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 mt-8"
            >
              {loading ? (
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 border-2 border-[#003F3A]/30 border-t-[#003F3A] rounded-full animate-spin" />
                  <span>Authorizing...</span>
                </div>
              ) : (
                <>
                  <span>Initialize Login</span>
                  <FiArrowRight />
                </>
              )}
            </button>

            {/* Sign Up Footer */}
            <div className="pt-6 text-center">
              <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">
                Unauthorized access is restricted.{" "}
                <Link href="/signup" className="text-[#A4F000] hover:text-white transition-colors underline underline-offset-4 decoration-[#A4F000]/30">
                  Register Node
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Security Footer */}
        <div className="mt-10 flex items-center justify-center gap-2 text-white/10">
          <FiShield size={14} />
          <span className="text-[9px] font-black uppercase tracking-[0.4em]">Encrypted Session Secure</span>
        </div>
      </motion.div>
    </div>
  );
}