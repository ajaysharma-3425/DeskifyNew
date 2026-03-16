"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiCheckCircle, FiShield, FiAlertTriangle } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validation Logic
    if (form.password !== form.confirmPassword) {
      setError("Security Alert: Passwords do not match");
      setLoading(false);
      return;
    }

    if (form.password.length < 6) {
      setError("Security Protocol: Min 6 Characters Required");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password
        }),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        const payload = JSON.parse(atob(data.token.split(".")[1]));
        login(data.token, payload.role || "user");
        router.push("/");
      } else {
        setError(data.message || "Registration Failed. Try Again.");
      }
    } catch (err) {
      setError("Signal Lost. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#003F3A] px-4 overflow-hidden relative py-12">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#A4F000]/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-5%] left-[-5%] w-[30%] h-[30%] bg-[#A4F000]/5 blur-[100px] rounded-full" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full z-10"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center">
            <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-md">
              <Image src="/Logo.png" alt="Deskify" width={40} height={40} className="object-contain" />
            </div>
            <h1 className="text-2xl font-black tracking-tighter text-white italic uppercase">
              JOIN <span className="text-[#A4F000]">DESKIFY</span>
            </h1>
          </Link>
        </div>

        <div className="bg-white/[0.03] backdrop-blur-2xl p-8 md:p-10 rounded-[2.5rem] border border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.5)]">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white tracking-tight">Create New Node</h2>
            <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] mt-1 font-medium">Initialize your premium account</p>
          </div>

          {error && (
            <motion.div initial={{ x: -10 }} animate={{ x: 0 }} className="bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl mb-6 flex items-center gap-3">
              <FiAlertTriangle className="text-rose-500 shrink-0" />
              <p className="text-rose-400 text-[10px] font-black uppercase tracking-widest leading-tight">{error}</p>
            </motion.div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Name & Email Fields */}
            <div className="space-y-4">
              <div className="group">
                <label className="block text-[10px] font-black text-[#A4F000] uppercase tracking-[0.3em] mb-2 ml-1">Legal Name</label>
                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#A4F000]" />
                  <input name="name" type="text" required value={form.name} onChange={handleChange} className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 text-white rounded-2xl focus:outline-none focus:border-[#A4F000]/50 focus:bg-white/[0.08] transition-all font-bold italic text-sm" placeholder="Full Name" />
                </div>
              </div>

              <div className="group">
                <label className="block text-[10px] font-black text-[#A4F000] uppercase tracking-[0.3em] mb-2 ml-1">Email Address</label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#A4F000]" />
                  <input name="email" type="email" required value={form.email} onChange={handleChange} className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 text-white rounded-2xl focus:outline-none focus:border-[#A4F000]/50 focus:bg-white/[0.08] transition-all font-bold italic text-sm" placeholder="name@email.com" />
                </div>
              </div>

              {/* Password Field */}
              <div className="group">
                <label className="block text-[10px] font-black text-[#A4F000] uppercase tracking-[0.3em] mb-2 ml-1">Master Key (Password)</label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#A4F000]" />
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={form.password}
                    onChange={handleChange}
                    className="w-full pl-12 pr-12 py-3.5 bg-white/5 border border-white/10 text-white rounded-2xl focus:outline-none focus:border-[#A4F000]/50 transition-all font-bold text-sm tracking-widest"
                    placeholder="••••••••"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white">
                    {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="group">
                <label className="block text-[10px] font-black text-[#A4F000] uppercase tracking-[0.3em] mb-2 ml-1">Verify Key</label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#A4F000]" />
                  <input
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={form.confirmPassword}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-12 py-3.5 bg-white/5 border ${form.confirmPassword && form.password !== form.confirmPassword ? 'border-rose-500/50' : 'border-white/10'} text-white rounded-2xl focus:outline-none focus:border-[#A4F000]/50 transition-all font-bold text-sm tracking-widest`}
                    placeholder="••••••••"
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white">
                    {showConfirmPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-[#A4F000] text-[#003F3A] rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-white transition-all shadow-xl shadow-[#A4F000]/10 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 mt-6"
            >
              {loading ? <span>Configuring...</span> : <><FiCheckCircle /> <span>Initialize Node</span></>}
            </button>

            <div className="pt-6 text-center border-t border-white/5 mt-6">
              <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">
                Member already? <Link href="/login" className="text-[#A4F000] hover:text-white transition-colors">Authorize</Link>
              </p>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}