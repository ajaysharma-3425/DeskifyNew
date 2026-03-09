"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiCheckCircle } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!form.name || !form.email || !form.password) {
      setError("Please fill in all fields to create your account.");
      setLoading(false);
      return;
    }

    if (form.password.length < 6) {
      setError("Security first: Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        const payload = JSON.parse(atob(data.token.split(".")[1]));
        login(data.token, payload.role || "user");
        router.push("/");
      } else {
        setError(data.message || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] px-4 sm:px-6 lg:px-8">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-full h-64 bg-gradient-to-b from-[#84CC16]/5 to-transparent -z-10" />
      
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 my-10">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="relative w-10 h-10">
              <Image src="/Logo.png" alt="Deskify" fill className="object-contain" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-[#1F2937]">
              Des<span className="text-[#10B981]">kify</span>
            </span>
          </Link>
          <h2 className="text-3xl font-extrabold text-[#1F2937]">Create Account</h2>
          <p className="mt-2 text-[#6B7280]">Join our community of premium shoppers</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg animate-shake">
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
        )}

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-[#1F2937] mb-1.5">
                Full Name
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <FiUser className="h-5 w-5 text-gray-400 group-focus-within:text-[#10B981] transition-colors" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={handleChange}
                  className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 text-[#1F2937] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981] focus:bg-white transition-all duration-200"
                  placeholder="John Doe"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-[#1F2937] mb-1.5">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-gray-400 group-focus-within:text-[#10B981] transition-colors" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 text-[#1F2937] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981] focus:bg-white transition-all duration-200"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-[#1F2937] mb-1.5">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400 group-focus-within:text-[#10B981] transition-colors" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={form.password}
                  onChange={handleChange}
                  className="block w-full pl-11 pr-12 py-3.5 bg-gray-50 border border-gray-200 text-[#1F2937] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981] focus:bg-white transition-all duration-200"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-[#1F2937] transition-colors"
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
              <p className="mt-2 text-[11px] text-[#6B7280] flex items-center">
                <FiCheckCircle className="mr-1 text-[#10B981]" /> Must be at least 6 characters long
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-[#10B981] hover:bg-[#065F46] focus:outline-none focus:ring-4 focus:ring-[#10B981]/30 transition-all duration-300 transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-[#10B981]/20"
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Creating Account...</span>
              </div>
            ) : (
              <div className="flex items-center">
                <span>Create Free Account</span>
                <FiArrowRight className="ml-2 h-4 w-4" />
              </div>
            )}
          </button>

          {/* Sign In Footer */}
          <div className="pt-2 text-center">
            <p className="text-sm text-[#6B7280]">
              Already a member?{" "}
              <Link href="/login" className="font-bold text-[#10B981] hover:underline decoration-2 underline-offset-4 transition-all">
                Sign in here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}