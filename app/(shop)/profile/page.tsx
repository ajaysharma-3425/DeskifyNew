"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUser,
  FiMail,
  FiCalendar,
  FiLogOut,
  FiArrowLeft,
  FiEdit2,
  FiLock,
  FiShoppingBag,
  FiHeart,
  FiMapPin,
  FiChevronRight,
  FiActivity,
} from "react-icons/fi";

// --- Interfaces ---
interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [orderCount, setOrderCount] = useState<number>(0);
  const [wishlistCount, setWishlistCount] = useState<number>(0);
  const [addressCount, setAddressCount] = useState<number>(0);
  const [statsLoading, setStatsLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) { router.push("/login"); return; }

        const res = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Session expired");

        const data = await res.json();
        setUser(data.user);
        await fetchStats(token);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    const fetchStats = async (token: string) => {
      setStatsLoading(true);
      try {
        const ordersRes = await fetch("/api/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (ordersRes.ok) {
          const orders = await ordersRes.json();
          setOrderCount(orders.length);
        }
      } catch (statsErr) {
        console.error(statsErr);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const getUserInitials = () => {
    if (!user) return "??";
    return user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorState error={error} />;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-slate-900 font-sans pb-20">
      {/* Top Navigation */}
      <div className="max-w-4xl mx-auto px-6 pt-12">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <Link href="/" className="inline-flex items-center text-slate-500 hover:text-slate-900 font-bold text-xs uppercase tracking-widest transition-colors group">
            <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Shop
          </Link>
        </motion.div>
      </div>

      <div className="max-w-4xl mx-auto px-6 mt-8 space-y-8">
        {/* Header Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden"
        >
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#10B981]/5 rounded-bl-full -mr-10 -mt-10" />

          {/* Avatar Area */}
          <div className="relative">
            <div className="w-28 h-28 bg-emerald-50 rounded-3xl flex items-center justify-center text-[#10B981] text-4xl font-black shadow-lg shadow-emerald-100/50">
              {getUserInitials()}
            </div>
            <Link href="/profile/edit" className="absolute -bottom-2 -right-2 bg-white p-2.5 rounded-xl shadow-md border border-slate-100 text-slate-600 hover:text-emerald-500 transition-colors">
              <FiEdit2 size={16} />
            </Link>
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-black tracking-tight text-slate-900">{user.name}</h1>
            <p className="text-slate-400 font-medium flex items-center justify-center md:justify-start gap-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-[#10B981]" />
              {user.email}
            </p>

            {/* Quick Stats bar inside Header */}
            <div className="flex items-center justify-center md:justify-start gap-8 mt-6">
              <div className="text-center md:text-left">
                <p className="text-xs font-black uppercase text-slate-300 tracking-[0.2em]">Orders</p>
                <p className="text-xl font-black text-slate-800">{statsLoading ? "..." : orderCount}</p>
              </div>
              <div className="w-px h-8 bg-slate-100" />
              <div className="text-center md:text-left">
                <p className="text-xs font-black uppercase text-slate-300 tracking-[0.2em]">Wishlist</p>
                <p className="text-xl font-black text-slate-800">{wishlistCount}</p>
              </div>
              <div className="w-px h-8 bg-slate-100" />
              <div className="text-center md:text-left">
                <p className="text-xs font-black uppercase text-slate-300 tracking-[0.2em]">Member Since</p>
                <p className="text-xl font-black text-slate-800">{new Date(user.createdAt).getFullYear()}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Section: Account Management */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100"
          >
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 flex items-center gap-2">
              <FiActivity className="text-[#10B981]" /> Settings & Security
            </h3>

            <div className="space-y-4">
              <MenuLink href="/profile/addresses" icon={<FiMapPin />} label="Shipping Addresses" subLabel="Manage delivery destinations" />
              <MenuLink href="/profile/change-password" icon={<FiLock />} label="Password & Security" subLabel="Update account credentials" />
              <MenuLink href="/orders" icon={<FiShoppingBag />} label="Order History" subLabel="Track and view past purchases" />
              <MenuLink href="/wishlist" icon={<FiHeart />} label="Saved Items" subLabel="Your personal wishlist" />
            </div>
          </motion.div>

          {/* Section: Personal Info Detail */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 flex flex-col justify-between"
          >
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 flex items-center gap-2">
                <FiUser className="text-[#10B981]" /> User Information
              </h3>

              <div className="space-y-6">
                <InfoItem icon={<FiMail />} label="Email Address" value={user.email} />
                <InfoItem icon={<FiUser />} label="Account Type" value={user.role} />
                <InfoItem icon={<FiCalendar />} label="Last Updated" value={new Date(user.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} />
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="mt-8 w-full flex items-center justify-center gap-3 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-rose-500 transition-all duration-300 group"
            >
              <FiLogOut className="group-hover:rotate-12 transition-transform" />
              Sign Out Account
            </button>
          </motion.div>
        </div>

        <p className="text-center text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">
          Cloud Infrastructure Secured Profile
        </p>
      </div>
    </div>
  );
}

// --- Helper Components ---

function MenuLink({ href, icon, label, subLabel }: { href: string; icon: any; label: string; subLabel: string }) {
  return (
    <Link href={href} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group">
      <div className="bg-slate-100 p-3 rounded-xl text-slate-500 group-hover:bg-[#10B981] group-hover:text-white transition-colors">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-sm font-black text-slate-800">{label}</p>
        <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mt-0.5">{subLabel}</p>
      </div>
      <FiChevronRight className="text-slate-300 group-hover:translate-x-1 transition-transform" />
    </Link>
  );
}

function InfoItem({ icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="mt-1 text-slate-300">{icon}</div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</p>
        <p className="text-sm font-bold text-slate-700 mt-0.5 break-all capitalize">{value}</p>
      </div>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F9FAFB]">
      <div className="w-16 h-16 border-4 border-slate-100 border-t-[#10B981] rounded-full animate-spin mb-4" />
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Syncing Profile</p>
    </div>
  );
}

function ErrorState({ error }: { error: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] p-6">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-xl text-center max-w-sm border border-slate-100">
        <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <FiActivity size={32} />
        </div>
        <h2 className="text-xl font-black text-slate-900 mb-2">Connection Error</h2>
        <p className="text-slate-500 text-sm mb-8">{error}</p>
        <button onClick={() => window.location.reload()} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#10B981] transition-all">
          Retry Sync
        </button>
      </div>
    </div>
  );
}