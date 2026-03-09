"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiArrowLeft, FiSave } from "react-icons/fi";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

      const data = await res.json();
      if (res.ok) {
        alert("Profile updated successfully!");
        router.push("/admin/profile");
      } else {
        alert(data.message || "Update failed");
      }
    } catch (error) {
      alert("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center h-64 ">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3B82F6]"></div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 bg-[#1F2937]">
      <Link
        href="/admin/profile"
        className="inline-flex items-center text-[#9CA3AF] hover:text-[#3B82F6] transition-colors mb-6"
      >
        <FiArrowLeft className="mr-2" />
        Back to Profile
      </Link>

      <div className="bg-[#1F2937] rounded-xl shadow-lg border border-[#334155] p-6">
        <h2 className="text-xl font-bold text-[#F9FAFB] mb-6">Edit Profile</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#9CA3AF] mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-[#334155] rounded-lg bg-[#0F172A] text-[#F9FAFB] placeholder-[#9CA3AF] focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#9CA3AF] mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                disabled
                className="w-full px-4 py-2 border border-[#334155] rounded-lg bg-[#1F2937] text-[#9CA3AF] cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#9CA3AF] mb-2">
                Phone
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border border-[#334155] rounded-lg bg-[#0F172A] text-[#F9FAFB] placeholder-[#9CA3AF] focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition"
                placeholder="+1 234 567 890"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#9CA3AF] mb-2">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2 border border-[#334155] rounded-lg bg-[#0F172A] text-[#F9FAFB] placeholder-[#9CA3AF] focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition"
                placeholder="City, State"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#9CA3AF] mb-2">
                Bio
              </label>
              <textarea
                rows={4}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full px-4 py-2 border border-[#334155] rounded-lg bg-[#0F172A] text-[#F9FAFB] placeholder-[#9CA3AF] focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition"
                placeholder="Tell us about yourself..."
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-6 py-2 bg-[#3B82F6] hover:bg-[#60A5FA] text-white font-medium rounded-lg transition-all duration-300 disabled:opacity-50"
            >
              <FiSave className="mr-2" />
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}