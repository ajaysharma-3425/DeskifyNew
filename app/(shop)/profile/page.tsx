"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
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
  FiZap,
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
    <div className="min-h-screen bg-[#003F3A] text-white font-sans pb-10 overflow-x-hidden selection:bg-[#A4F000] selection:text-[#003F3A]">
      {/* Top Navigation */}
      <div className="max-w-4xl mx-auto px-4 md:px-6 pt-8 md:pt-12">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <Link href="/" className="inline-flex items-center text-white/40 hover:text-[#A4F000] font-bold text-[10px] md:text-xs uppercase tracking-widest transition-colors group">
            <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Shop
          </Link>
        </motion.div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-6 mt-6 md:mt-8 space-y-6 md:space-y-8">
        
        {/* Header Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 shadow-2xl border border-white/10 flex flex-col md:flex-row items-center gap-6 md:gap-8 relative overflow-hidden backdrop-blur-xl"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#A4F000]/10 rounded-bl-full -mr-8 -mt-8 pointer-events-none blur-2xl" />

          {/* Avatar Area */}
          <div className="relative">
            <div className="w-24 h-24 md:w-28 md:h-28 bg-[#A4F000] rounded-[2rem] md:rounded-3xl flex items-center justify-center text-[#003F3A] text-3xl md:text-4xl font-black shadow-[0_10px_40px_-10px_rgba(164,240,0,0.5)] italic">
              {getUserInitials()}
            </div>
            <Link href="/profile/edit" className="absolute -bottom-1 -right-1 bg-white p-2 md:p-2.5 rounded-xl shadow-md border border-slate-100 text-[#003F3A] hover:scale-110 transition-transform">
              <FiEdit2 size={14} />
            </Link>
          </div>

          <div className="flex-1 text-center md:text-left w-full">
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white uppercase italic">{user.name}</h1>
            <p className="text-white/40 text-sm md:text-base font-medium flex items-center justify-center md:justify-start gap-2 mt-1 break-all">
              <span className="shrink-0 w-2 h-2 rounded-full bg-[#A4F000] animate-pulse" />
              {user.email}
            </p>

            {/* Quick Stats bar */}
            <div className="grid grid-cols-3 gap-2 md:flex md:items-center md:gap-8 mt-6 border-t md:border-t-0 border-white/5 pt-6 md:pt-0">
              <div className="text-center md:text-left">
                <p className="text-[9px] md:text-xs font-black uppercase text-white/20 tracking-wider md:tracking-[0.2em]">Orders</p>
                <p className="text-lg md:text-xl font-black text-[#A4F000] italic">{statsLoading ? "..." : orderCount}</p>
              </div>
              <div className="hidden md:block w-px h-8 bg-white/10" />
              <div className="text-center md:text-left border-x md:border-x-0 border-white/5">
                <p className="text-[9px] md:text-xs font-black uppercase text-white/20 tracking-wider md:tracking-[0.2em]">Wishlist</p>
                <p className="text-lg md:text-xl font-black text-[#A4F000] italic">{wishlistCount}</p>
              </div>
              <div className="hidden md:block w-px h-8 bg-white/10" />
              <div className="text-center md:text-left">
                <p className="text-[9px] md:text-xs font-black uppercase text-white/20 tracking-wider md:tracking-[0.2em]">Since</p>
                <p className="text-lg md:text-xl font-black text-[#A4F000] italic">{new Date(user.createdAt).getFullYear()}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">

          {/* Section: Account Management */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-white/5 rounded-[2rem] p-6 md:p-8 shadow-xl border border-white/10 backdrop-blur-sm"
          >
            <h3 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-[#A4F000] mb-6 flex items-center gap-2">
              <FiZap /> Settings & Security
            </h3>

            <div className="space-y-2 md:space-y-4">
              <MenuLink href="/profile/addresses" icon={<FiMapPin />} label="Addresses" subLabel="Delivery destinations" />
              <MenuLink href="/profile/change-password" icon={<FiLock />} label="Security" subLabel="Manage credentials" />
              <MenuLink href="/orders" icon={<FiShoppingBag />} label="Orders" subLabel="View history" />
              <MenuLink href="/wishlist" icon={<FiHeart />} label="Wishlist" subLabel="Saved items" />
            </div>
          </motion.div>

          {/* Section: Personal Info Detail */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-white/5 rounded-[2rem] p-6 md:p-8 shadow-xl border border-white/10 flex flex-col justify-between backdrop-blur-sm"
          >
            <div>
              <h3 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-[#A4F000] mb-6 flex items-center gap-2">
                <FiUser /> User Information
              </h3>

              <div className="space-y-5">
                <InfoItem icon={<FiMail />} label="Email Address" value={user.email} />
                <InfoItem icon={<FiUser />} label="Account Type" value={user.role} />
                <InfoItem icon={<FiCalendar />} label="Last Updated" value={new Date(user.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} />
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="mt-8 w-full flex items-center justify-center gap-3 py-4 md:py-4 bg-[#A4F000] text-[#003F3A] rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-[0.2em] hover:bg-white transition-all duration-300 group active:scale-95 shadow-[0_10px_30px_-10px_rgba(164,240,0,0.3)]"
            >
              <FiLogOut className="group-hover:translate-x-1 transition-transform" />
              Sign Out Account
            </button>
          </motion.div>
        </div>

        <p className="text-center text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-white/10 pb-6 italic">
          Deskify Infrastructure Secured Profile
        </p>
      </div>
    </div>
  );
}

// --- Optimized Helper Components for Mobile ---

function MenuLink({ href, icon, label, subLabel }: { href: string; icon: any; label: string; subLabel: string }) {
  return (
    <Link href={href} className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all group">
      <div className="bg-white/10 p-2.5 md:p-3 rounded-xl text-white/60 group-hover:bg-[#A4F000] group-hover:text-[#003F3A] transition-colors">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs md:text-sm font-black text-white truncate uppercase italic">{label}</p>
        <p className="text-[8px] md:text-[10px] font-medium text-white/30 uppercase tracking-wider mt-0.5 truncate">{subLabel}</p>
      </div>
      <FiChevronRight className="text-white/10 group-hover:text-[#A4F000] group-hover:translate-x-1 transition-all shrink-0" />
    </Link>
  );
}

function InfoItem({ icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 md:gap-4">
      <div className="mt-1 text-[#A4F000] shrink-0 opacity-60">{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-white/20">{label}</p>
        <p className="text-xs md:text-sm font-bold text-white/80 mt-0.5 break-words capitalize italic">{value}</p>
      </div>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#003F3A]">
      <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-white/5 border-t-[#A4F000] rounded-full animate-spin mb-4" />
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#A4F000] animate-pulse">Syncing Profile</p>
    </div>
  );
}

function ErrorState({ error }: { error: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#003F3A] p-4">
      <div className="bg-white/5 p-8 md:p-10 rounded-[2rem] md:rounded-[2.5rem] shadow-xl text-center max-w-sm border border-white/10 w-full backdrop-blur-xl">
        <div className="w-14 h-14 md:w-16 md:h-16 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <FiActivity size={28} />
        </div>
        <h2 className="text-lg md:text-xl font-black text-white mb-2 uppercase italic">Connection Error</h2>
        <p className="text-white/40 text-xs md:text-sm mb-8">{error}</p>
        <button onClick={() => window.location.reload()} className="w-full py-4 bg-[#A4F000] text-[#003F3A] rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest hover:bg-white transition-all shadow-lg">
          Retry Sync
        </button>
      </div>
    </div>
  );
}