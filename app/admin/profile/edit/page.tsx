"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiArrowLeft, FiSave, FiUser, FiMail, FiPhone, FiMapPin, FiInfo, FiCheckCircle } from "react-icons/fi";

export default function AdminEditProfile() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    location: "",
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const res = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setFormData({
          name: data.user.name || "",
          email: data.user.email || "",
          phone: data.user.phone || "",
          bio: data.user.bio || "",
          location: data.user.location || "",
        });
      } catch (err) {
        console.error(err);
      } finally {
        setFetchLoading(false);
      }
    };
    fetchProfile();
  }, [router]);

  // Validation Logic
  const validateForm = () => {
    if (formData.name.trim().length < 3) {
      setError("Name must be at least 3 characters long.");
      return false;
    }
    // Check if phone is exactly 10 digits
    const phoneRegex = /^[0-9]{10}$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      setError("Phone number must be exactly 10 digits.");
      return false;
    }
    if (formData.bio.length > 200) {
      setError("Bio cannot exceed 200 characters.");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          bio: formData.bio,
          location: formData.location,
        }),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/admin/profile");
        }, 1500);
      } else {
        const data = await res.json();
        setError(data.message || "Update failed");
      }
    } catch (error) {
      setError("An error occurred while saving.");
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#F5F6F7]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F6F7] pb-20">
      <div className="max-w-4xl mx-auto px-6 pt-12">
        
        <button 
          onClick={() => router.back()}
          className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-blue-600 transition-colors mb-10"
        >
          <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          Discard Changes
        </button>

        <div className="mb-12">
          <h1 className="text-5xl font-black tracking-tighter text-[#2F2F33]">
            Edit <span className="text-blue-600">Profile.</span>
          </h1>
          <p className="mt-3 text-gray-400 text-[10px] font-black uppercase tracking-[0.3em]">
            Deskify Administrative Identity Update
          </p>
        </div>

        {/* Error Message Display */}
        {error && (
          <div className="mb-6 p-4 bg-rose-50 border-l-4 border-rose-500 text-rose-600 text-[10px] font-black uppercase tracking-widest rounded-r-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white rounded-[3rem] p-10 shadow-2xl shadow-black/5 border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-8">
            
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-gray-400 ml-2">
                <FiUser className="text-blue-600" /> Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-600/20 transition-all font-bold text-[#2F2F33]"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-gray-400 ml-2">
                <FiMail className="text-blue-600" /> Account Email
              </label>
              <input
                type="email"
                value={formData.email}
                disabled
                className="w-full px-6 py-4 rounded-2xl bg-gray-100 border-none font-bold text-gray-400 cursor-not-allowed"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-gray-400 ml-2">
                <FiPhone className="text-blue-600" /> Contact Number (10 Digits)
              </label>
              <input
                type="text"
                maxLength={10}
                value={formData.phone}
                onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, ""); // Sirf digits allow karega
                    setFormData({ ...formData, phone: val });
                }}
                className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-600/20 transition-all font-bold text-[#2F2F33]"
                placeholder="9876543210"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-gray-400 ml-2">
                <FiMapPin className="text-blue-600" /> Operational Base
              </label>
              <input
                type="text"
                maxLength={50}
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-600/20 transition-all font-bold text-[#2F2F33]"
                placeholder="City, State"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <div className="flex justify-between items-center ml-2">
                <label className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-gray-400">
                  <FiInfo className="text-blue-600" /> Professional Bio
                </label>
                <span className={`text-[9px] font-bold ${formData.bio.length > 180 ? 'text-rose-500' : 'text-gray-300'}`}>
                  {formData.bio.length}/200
                </span>
              </div>
              <textarea
                rows={4}
                maxLength={200}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full px-6 py-4 rounded-[2rem] bg-gray-50 border-none focus:ring-2 focus:ring-blue-600/20 transition-all font-bold text-[#2F2F33] resize-none"
                placeholder="Brief summary of your expertise..."
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-5 rounded-2xl flex items-center justify-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] transition-all duration-500 shadow-xl ${
              success 
              ? "bg-emerald-500 text-white" 
              : "bg-[#2F2F33] text-white hover:bg-blue-600 hover:-translate-y-1"
            }`}
          >
            {loading ? (
              <div className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full"></div>
            ) : success ? (
              <><FiCheckCircle size={18} /> Protocol Updated</>
            ) : (
              <><FiSave size={18} /> Commit Changes</>
            )}
          </button>
        </form>

        <p className="mt-10 text-center text-[9px] font-black text-gray-300 uppercase tracking-[0.5em]">
          Deskify Secure Data Synchronization
        </p>
      </div>
    </div>
  );
}