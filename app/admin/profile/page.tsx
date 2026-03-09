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
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3B82F6]"></div>
      </div>
    );
  }

  if (error || !admin) {
    return (
      <div className="bg-[#1F2937] border border-[#334155] p-4 rounded-lg text-[#F9FAFB]">
        {error || "User not found"}
      </div>
    );
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      {/* <div className="flex items-center justify-between">
        <Link
          href="/admin/dashboard"
          className="inline-flex items-center text-[#9CA3AF] hover:text-[#3B82F6] transition-colors"
        >
          <FiArrowLeft className="mr-2" />
          Back to Dashboard
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center px-4 py-2 text-sm border border-[#3B82F6] text-[#3B82F6] rounded-lg hover:bg-[#3B82F6] hover:text-white transition-all duration-300"
        >
          <FiLogOut className="mr-2" size={16} />
          Logout
        </button>
      </div> */}

      {/* Profile Card */}
      <div className="bg-[#1F2937]  shadow-lg border border-[#334155] overflow-hidden">
        {/* Profile Header */}
        <div className="px-6 py-5 border-b border-[#334155]">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-[#0F172A] rounded-full flex items-center justify-center">
                <span className="text-xl font-semibold text-[#3B82F6]">
                  {admin.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#F9FAFB]">{admin.name}</h2>
                <p className="text-sm text-[#9CA3AF]">
                  {admin.role === "admin" ? "Administrator" : "Team Manager"} {admin.location && `| ${admin.location}`}
                </p>
              </div>
            </div>
            <Link
              href="/admin/profile/edit"
              className="inline-flex items-center px-4 py-2 bg-[#3B82F6] hover:bg-[#60A5FA] text-white text-sm font-medium rounded-lg transition-all duration-300"
            >
              <FiEdit2 className="mr-2" size={16} />
              Edit Profile
            </Link>
          </div>
        </div>

        {/* Personal Information */}
        <div className="p-6 border-b border-[#334155]">
          <h3 className="text-lg font-semibold text-[#F9FAFB] mb-4 flex items-center">
            <FiUser className="mr-2 text-[#3B82F6]" />
            Personal Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm text-[#9CA3AF]">First Name</label>
              <p className="text-[#F9FAFB] font-medium">
                {admin.name.split(" ")[0] || "-"}
              </p>
            </div>
            <div>
              <label className="text-sm text-[#9CA3AF]">Last Name</label>
              <p className="text-[#F9FAFB] font-medium">
                {admin.name.split(" ").slice(1).join(" ") || "-"}
              </p>
            </div>
            <div>
              <label className="text-sm text-[#9CA3AF]">Email address</label>
              <p className="text-[#F9FAFB] font-medium break-all">{admin.email}</p>
            </div>
            <div>
              <label className="text-sm text-[#9CA3AF]">Phone</label>
              <p className="text-[#F9FAFB] font-medium">{admin.phone || "-"}</p>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm text-[#9CA3AF]">Bio</label>
              <p className="text-[#F9FAFB] font-medium">{admin.bio || "No bio provided"}</p>
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="p-6 border-b border-[#334155]">
          <h3 className="text-lg font-semibold text-[#F9FAFB] mb-4 flex items-center">
            <FiMapPin className="mr-2 text-[#3B82F6]" />
            Address
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm text-[#9CA3AF]">Country</label>
              <p className="text-[#F9FAFB] font-medium">United States</p>
            </div>
            <div>
              <label className="text-sm text-[#9CA3AF]">City/State</label>
              <p className="text-[#F9FAFB] font-medium">Phoenix, Arizona</p>
            </div>
            <div>
              <label className="text-sm text-[#9CA3AF]">Postal Code</label>
              <p className="text-[#F9FAFB] font-medium">ERT 2489</p>
            </div>
            <div>
              <label className="text-sm text-[#9CA3AF]">TAX ID</label>
              <p className="text-[#F9FAFB] font-medium">AS4568384</p>
            </div>
          </div>
        </div>

        {/* Account Info */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-[#F9FAFB] mb-4 flex items-center">
            <FiLock className="mr-2 text-[#3B82F6]" />
            Account Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm text-[#9CA3AF]">Member Since</label>
              <p className="text-[#F9FAFB] font-medium">{formatDate(admin.createdAt)}</p>
            </div>
            <div>
              <label className="text-sm text-[#9CA3AF]">Last Updated</label>
              <p className="text-[#F9FAFB] font-medium">{formatDate(admin.updatedAt)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}