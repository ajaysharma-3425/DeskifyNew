  "use client";

  import { useEffect, useState } from "react";
  import {
    FiRefreshCw,
    FiBell,
    FiX,
    FiPackage,
    FiShoppingCart,
    FiUsers,
    FiDollarSign,
    FiTrendingUp,
    FiClock,
    FiArrowUpRight,
  } from "react-icons/fi";
  import { DashboardStats } from "@/types/dashboard";
  import Link from "next/link";

  // Types for orders
  type RecentOrder = {
    _id: string;
    user?: { name: string; email: string };
    totalAmount: number;
    status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
    createdAt: string;
  };

  // --- LIGHT THEME COLOR PALETTE ---
  // Emerald for success/active, Rose for alerts/urgent, Slate for structure
  const statusColors = {
    pending: "bg-amber-100 text-amber-700 border border-amber-200",
    processing: "bg-blue-100 text-blue-700 border border-blue-200",
    shipped: "bg-indigo-100 text-indigo-700 border border-indigo-200",
    delivered: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    cancelled: "bg-rose-100 text-rose-700 border border-rose-200 line-through",
  };

  const mockRevenueData = [
    { day: "Mon", revenue: 1200 },
    { day: "Tue", revenue: 1800 },
    { day: "Wed", revenue: 1600 },
    { day: "Thu", revenue: 2200 },
    { day: "Fri", revenue: 2600 },
    { day: "Sat", revenue: 3100 },
    { day: "Sun", revenue: 2800 },
  ];

  export default function AdminDashboardPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loadingStats, setLoadingStats] = useState(true);
    const [statsError, setStatsError] = useState<string | null>(null);
    const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [ordersError, setOrdersError] = useState<string | null>(null);
    const [lastOrderCount, setLastOrderCount] = useState<number | null>(null);
    const [showNewOrderAlert, setShowNewOrderAlert] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    const fetchDashboardData = async (showLoading = true) => {
      if (showLoading) {
        setLoadingStats(true);
        setLoadingOrders(true);
      }
      setStatsError(null);
      setOrdersError(null);

      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      try {
        const statsRes = await fetch("/api/admin/dashboard", { headers });
        if (!statsRes.ok) throw new Error("Failed to fetch stats");
        const statsData: DashboardStats = await statsRes.json();

        if (lastOrderCount !== null && statsData.orders > lastOrderCount) {
          setShowNewOrderAlert(true);
        }

        setStats(statsData);
        setLastOrderCount(statsData.orders);
        setLastUpdated(new Date());
      } catch (err) {
        setStatsError(err instanceof Error ? err.message : "Stats error");
      } finally {
        setLoadingStats(false);
      }

      try {
        const ordersRes = await fetch("/api/admin/orders", { headers });
        if (!ordersRes.ok) throw new Error("Failed to fetch orders");
        const ordersData: RecentOrder[] = await ordersRes.json();
        setRecentOrders(ordersData.slice(0, 5));
      } catch (err) {
        setOrdersError(err instanceof Error ? err.message : "Orders error");
      } finally {
        setLoadingOrders(false);
      }
    };

    useEffect(() => {
      fetchDashboardData();
    }, []);

    useEffect(() => {
      const interval = setInterval(async () => {
        const token = localStorage.getItem("token");
        try {
          const res = await fetch("/api/admin/dashboard", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const data: DashboardStats = await res.json();
            if (lastOrderCount !== null && data.orders > lastOrderCount) {
              setShowNewOrderAlert(true);
            }
            setLastOrderCount(data.orders);
            setLastUpdated(new Date());
          }
        } catch (error) {}
      }, 30000);
      return () => clearInterval(interval);
    }, [lastOrderCount]);

    const handleRefresh = () => fetchDashboardData(true);
    const dismissAlert = () => setShowNewOrderAlert(false);

    const statCards = stats
      ? [
          { title: "Products", value: stats.products, icon: FiPackage, color: "text-emerald-600", bg: "bg-emerald-100", change: "+12%" },
          { title: "Total Orders", value: stats.orders, icon: FiShoppingCart, color: "text-blue-600", bg: "bg-blue-100", change: "+8%" },
          { title: "Total Users", value: stats.users, icon: FiUsers, color: "text-indigo-600", bg: "bg-indigo-100", change: "+5%" },
          { title: "Revenue", value: `₹${stats.revenue.toLocaleString("en-IN")}`, icon: FiDollarSign, color: "text-rose-600", bg: "bg-rose-100", change: "+18%" },
        ]
      : [];

    if (loadingStats && !stats) {
      return (
        <div className="min-h-screen bg-white p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="h-12 w-48 bg-[#F5F6F7] animate-pulse rounded-lg" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => <div key={i} className="h-32 bg-[#F5F6F7] animate-pulse rounded-2xl" />)}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-white pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          
          {/* --- HEADER --- */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
            <div>
              <h1 className="text-3xl font-black text-[#2F2F33] tracking-tight">Dashboard Overview</h1>
              <p className="text-gray-500 font-medium">Monitoring Deskify store performance</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center px-3 py-1.5 bg-[#F5F6F7] border border-gray-100 rounded-full text-[12px] font-bold text-gray-400">
                <FiClock className="mr-2" /> UPDATED: {lastUpdated?.toLocaleTimeString()}
              </div>
              <button
                onClick={handleRefresh}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#2F2F33] text-white rounded-xl font-bold hover:shadow-xl hover:shadow-[#2F2F33]/20 transition-all active:scale-95"
              >
                <FiRefreshCw className={loadingStats ? "animate-spin" : ""} />
                Sync Data
              </button>
            </div>
          </div>

          {/* --- ALERTS --- */}
          {showNewOrderAlert && (
            <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="bg-[#2F2F33] rounded-2xl p-5 shadow-2xl flex items-center justify-between border border-white/10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-rose-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-rose-500/40">
                    <FiBell size={24} className="animate-bounce" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">New Order Placed!</h3>
                    <p className="text-gray-400 text-sm">Check the orders panel to process it immediately.</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Link href="/admin/orders" className="px-4 py-2 bg-white text-[#2F2F33] rounded-lg font-bold text-sm hover:bg-gray-100 transition-colors">View All</Link>
                  <button onClick={dismissAlert} className="text-gray-400 hover:text-white"><FiX size={20} /></button>
                </div>
              </div>
            </div>
          )}

          {/* --- STATS GRID --- */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {statCards.map((card, idx) => (
              <div key={idx} className="bg-[#F5F6F7] rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-2xl ${card.bg} ${card.color} transition-transform group-hover:scale-110`}>
                    <card.icon size={22} />
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Growth</span>
                    <span className="text-emerald-600 text-xs font-bold flex items-center">
                      <FiTrendingUp className="mr-1" /> {card.change}
                    </span>
                  </div>
                </div>
                <h3 className="text-3xl font-black text-[#2F2F33] tracking-tight">{card.value}</h3>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-tighter mt-1">{card.title}</p>
                <div className="absolute -right-2 -bottom-2 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                  <card.icon size={80} />
                </div>
              </div>
            ))}
          </div>

          {/* --- CHARTS & ACTIONS --- */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Revenue Graph */}
            <div className="lg:col-span-2 bg-[#F5F6F7] rounded-3xl p-8 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-xl font-black text-[#2F2F33]">Weekly Revenue</h2>
                  <p className="text-sm text-gray-400 font-medium">Sales performance per day</p>
                </div>
                <select className="bg-white border-none text-xs font-bold rounded-lg px-3 py-2 outline-none">
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                </select>
              </div>
              <div className="h-64 flex items-end justify-between gap-3 sm:gap-6 px-2">
                {mockRevenueData.map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center flex-1 group">
                    <div className="w-full bg-white rounded-2xl relative overflow-hidden" style={{ height: `200px` }}>
                      <div 
                        className="absolute bottom-0 w-full bg-[#2F2F33] rounded-2xl transition-all duration-700 ease-out group-hover:bg-emerald-600"
                        style={{ height: `${(item.revenue / 3500) * 100}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-black text-gray-400 mt-4 uppercase">{item.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-[#2F2F33] rounded-3xl p-8 shadow-xl text-white">
              <h2 className="text-xl font-black mb-6 tracking-tight">Quick Controls</h2>
              <div className="space-y-4">
                {[
                  { label: "New Product", href: "/admin/products/new", icon: FiPackage, bg: "bg-emerald-500" },
                  { label: "Check Orders", href: "/admin/orders", icon: FiShoppingCart, bg: "bg-blue-500" },
                  { label: "User Database", href: "/admin/users", icon: FiUsers, bg: "bg-rose-500" }
                ].map((action, i) => (
                  <Link key={i} href={action.href} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 border border-white/5 transition-all group">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 ${action.bg} rounded-xl flex items-center justify-center text-white shadow-lg`}><action.icon size={18} /></div>
                      <span className="font-bold text-sm">{action.label}</span>
                    </div>
                    <FiArrowUpRight className="text-gray-500 group-hover:text-white transition-colors" />
                  </Link>
                ))}
              </div>
              <div className="mt-8 p-5 bg-white/5 rounded-2xl border border-dashed border-white/20">
                <p className="text-xs text-gray-400 leading-relaxed font-medium">Tip: Use the sync button to manually refresh inventory data across all nodes.</p>
              </div>
            </div>
          </div>

          {/* --- RECENT ORDERS TABLE --- */}
          <div className="mt-10 bg-[#F5F6F7] rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-8 flex items-center justify-between border-b border-gray-50">
              <h2 className="text-xl font-black text-[#2F2F33]">Live Transactions</h2>
              <Link href="/admin/orders" className="px-4 py-2 bg-white text-[#2F2F33] rounded-xl text-xs font-black uppercase tracking-tighter hover:bg-gray-100 transition-colors">See Ledger</Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Order Ref</th>
                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer Detail</th>
                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-8 py-5">
                        <Link href={`/admin/orders/${order._id}`} className="font-bold text-[#2F2F33] hover:text-emerald-600 flex items-center">
                          #{order._id.slice(-8).toUpperCase()}
                        </Link>
                      </td>
                      <td className="px-8 py-5">
                        <p className="font-bold text-sm text-[#2F2F33]">{order.user?.name || "Guest User"}</p>
                        <p className="text-xs text-gray-400 font-medium">{order.user?.email || "No email"}</p>
                      </td>
                      <td className="px-8 py-5 font-black text-[#2F2F33]">₹{order.totalAmount.toLocaleString("en-IN")}</td>
                      <td className="px-8 py-5">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${statusColors[order.status]}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-gray-400 text-xs font-bold">{new Date(order.createdAt).toLocaleDateString("en-IN", { day: '2-digit', month: 'short' })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }