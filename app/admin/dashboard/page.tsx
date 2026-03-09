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

// Updated status colors using slate + blue accents
const statusColors = {
  pending: "bg-[#1F2937] text-[#9CA3AF] border border-[#334155]",
  processing: "bg-[rgba(59,130,246,0.15)] text-[#3B82F6]",
  shipped: "bg-[rgba(59,130,246,0.15)] text-[#3B82F6]",
  delivered: "bg-[rgba(59,130,246,0.15)] text-[#3B82F6]",
  cancelled: "bg-[#1F2937] text-[#9CA3AF] border border-[#334155] line-through",
};

// Mock revenue data (you can replace with real data later)
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
  // Stats state
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);

  // Recent orders state
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [ordersError, setOrdersError] = useState<string | null>(null);

  // New order alert
  const [lastOrderCount, setLastOrderCount] = useState<number | null>(null);
  const [showNewOrderAlert, setShowNewOrderAlert] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Fetch both stats and recent orders
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
      // Fetch stats
      const statsRes = await fetch("/api/admin/dashboard", { headers });
      if (!statsRes.ok) throw new Error("Failed to fetch stats");
      const statsData: DashboardStats = await statsRes.json();

      // Check for new orders
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
      // Fetch recent orders (limit to last 5 on client side)
      const ordersRes = await fetch("/api/admin/orders", { headers });
      if (!ordersRes.ok) throw new Error("Failed to fetch orders");
      const ordersData: RecentOrder[] = await ordersRes.json();
      // Sort by createdAt descending (already sorted by API) and take first 5
      setRecentOrders(ordersData.slice(0, 5));
    } catch (err) {
      setOrdersError(err instanceof Error ? err.message : "Orders error");
    } finally {
      setLoadingOrders(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Polling for new orders (only stats)
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
      } catch (error) {
        // Silent fail for polling
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [lastOrderCount]);

  const handleRefresh = () => fetchDashboardData(true);
  const dismissAlert = () => setShowNewOrderAlert(false);

  // Stats cards configuration – all use blue accent
  const statCards = stats
    ? [
        {
          title: "Total Products",
          value: stats.products,
          icon: FiPackage,
          change: "+12%",
          trend: "up",
        },
        {
          title: "Total Orders",
          value: stats.orders,
          icon: FiShoppingCart,
          change: "+8%",
          trend: "up",
        },
        {
          title: "Total Users",
          value: stats.users,
          icon: FiUsers,
          change: "+5%",
          trend: "up",
        },
        {
          title: "Total Revenue",
          value: `₹${stats.revenue.toLocaleString("en-IN")}`,
          icon: FiDollarSign,
          change: "+18%",
          trend: "up",
        },
      ]
    : [];

  // Loading state for initial page load
  const isLoading = loadingStats && !stats;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0F172A] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div className="h-10 w-64 bg-[#1F2937] rounded-lg animate-pulse" />
            <div className="h-10 w-24 bg-[#1F2937] rounded-lg animate-pulse" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-[#1F2937] rounded-xl animate-pulse" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-80 bg-[#1F2937] rounded-xl animate-pulse" />
            <div className="h-80 bg-[#1F2937] rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#F9FAFB]">
              Welcome back, Admin
            </h1>
            <p className="text-[#9CA3AF] mt-1">
              Here's what's happening with your store today.
            </p>
          </div>
          <div className="flex items-center gap-4">
            {lastUpdated && (
              <span className="text-sm text-[#9CA3AF] flex items-center gap-1">
                <FiClock size={14} />
                Last updated: {lastUpdated.toLocaleTimeString()}
              </span>
            )}
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2 bg-[#3B82F6] hover:bg-[#60A5FA] text-white rounded-lg transition-all duration-300 shadow-lg"
              disabled={loadingStats || loadingOrders}
            >
              <FiRefreshCw className={`${loadingStats || loadingOrders ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* New Order Alert – using blue accents */}
        {showNewOrderAlert && (
          <div className="mb-6 animate-slideDown">
            <div className="bg-[#1F2937] border-l-4 border-[#3B82F6] rounded-lg p-4 shadow-lg flex items-start justify-between">
              <div className="flex items-start gap-3">
                <FiBell className="text-[#3B82F6] text-xl mt-0.5" />
                <div>
                  <h3 className="font-semibold text-[#F9FAFB]">
                    New Order Received!
                  </h3>
                  <p className="text-sm text-[#9CA3AF]">
                    A new order has been placed.{" "}
                    <Link
                      href="/admin/orders"
                      className="underline font-medium text-[#3B82F6] hover:text-[#60A5FA]"
                    >
                      View orders
                    </Link>
                  </p>
                </div>
              </div>
              <button
                onClick={dismissAlert}
                className="text-[#9CA3AF] hover:text-[#F9FAFB]"
              >
                <FiX size={20} />
              </button>
            </div>
          </div>
        )}

        {/* Error messages – use red but keep within theme, maybe use a muted red variant */}
        {statsError && (
          <div className="mb-6 bg-[#1F2937] border-l-4 border-[#9CA3AF] rounded-lg p-4">
            <p className="text-[#F9FAFB]">Stats error: {statsError}</p>
          </div>
        )}
        {ordersError && (
          <div className="mb-6 bg-[#1F2937] border-l-4 border-[#9CA3AF] rounded-lg p-4">
            <p className="text-[#F9FAFB]">Orders error: {ordersError}</p>
          </div>
        )}

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <div
                  key={idx}
                  className="bg-[#1F2937] rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-[#334155]"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-lg bg-[rgba(59,130,246,0.15)] text-[#3B82F6]">
                      <Icon size={24} />
                    </div>
                    <span className="text-sm font-medium px-2 py-1 rounded-full bg-[rgba(59,130,246,0.15)] text-[#3B82F6]">
                      {card.change}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-[#F9FAFB]">
                    {card.value}
                  </p>
                  <p className="text-sm text-[#9CA3AF] mt-1">
                    {card.title}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {/* Charts and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart (mock) */}
          <div className="lg:col-span-2 bg-[#1F2937] rounded-xl shadow-lg p-6 border border-[#334155]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-[#F9FAFB]">
                Revenue Overview (Last 7 Days)
              </h2>
              <FiTrendingUp className="text-[#9CA3AF]" size={20} />
            </div>
            <div className="h-64 flex items-end justify-between gap-2">
              {mockRevenueData.map((item, idx) => (
                <div key={idx} className="flex flex-col items-center w-full">
                  <div
                    className="w-full bg-[#3B82F6] rounded-t-md transition-all duration-300 hover:bg-[#60A5FA]"
                    style={{ height: `${(item.revenue / 3500) * 200}px` }}
                  />
                  <span className="text-xs text-[#9CA3AF] mt-2">
                    {item.day}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-[#1F2937] rounded-xl shadow-lg p-6 border border-[#334155]">
            <h2 className="text-lg font-semibold text-[#F9FAFB] mb-4">
              Quick Actions
            </h2>
            <div className="space-y-3">
              <Link
                href="/admin/products/new"
                className="flex items-center gap-3 p-3 bg-[#0F172A] rounded-lg hover:bg-[#111827] transition-all duration-300 border border-[#334155] hover:border-[#3B82F6]"
              >
                <div className="p-2 bg-[rgba(59,130,246,0.15)] rounded-lg text-[#3B82F6]">
                  <FiPackage size={18} />
                </div>
                <span className="text-sm font-medium text-[#F9FAFB]">
                  Add New Product
                </span>
              </Link>
              <Link
                href="/admin/orders"
                className="flex items-center gap-3 p-3 bg-[#0F172A] rounded-lg hover:bg-[#111827] transition-all duration-300 border border-[#334155] hover:border-[#3B82F6]"
              >
                <div className="p-2 bg-[rgba(59,130,246,0.15)] rounded-lg text-[#3B82F6]">
                  <FiShoppingCart size={18} />
                </div>
                <span className="text-sm font-medium text-[#F9FAFB]">
                  View All Orders
                </span>
              </Link>
              <Link
                href="/admin/users"
                className="flex items-center gap-3 p-3 bg-[#0F172A] rounded-lg hover:bg-[#111827] transition-all duration-300 border border-[#334155] hover:border-[#3B82F6]"
              >
                <div className="p-2 bg-[rgba(59,130,246,0.15)] rounded-lg text-[#3B82F6]">
                  <FiUsers size={18} />
                </div>
                <span className="text-sm font-medium text-[#F9FAFB]">
                  Manage Users
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Orders Table */}
        <div className="mt-6 bg-[#1F2937] rounded-xl shadow-lg p-6 border border-[#334155]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#F9FAFB]">
              Recent Orders
            </h2>
            <Link
              href="/admin/orders"
              className="text-sm text-[#3B82F6] hover:text-[#60A5FA] transition-colors"
            >
              View All
            </Link>
          </div>

          {loadingOrders ? (
            // Loading skeletons for orders
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-[#0F172A] rounded animate-pulse" />
              ))}
            </div>
          ) : ordersError ? (
            <p className="text-[#F9FAFB]">Failed to load orders</p>
          ) : recentOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-[#9CA3AF] uppercase bg-[#0F172A]">
                  <tr>
                    <th scope="col" className="px-6 py-3">Order ID</th>
                    <th scope="col" className="px-6 py-3">Customer</th>
                    <th scope="col" className="px-6 py-3">Amount</th>
                    <th scope="col" className="px-6 py-3">Status</th>
                    <th scope="col" className="px-6 py-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr
                      key={order._id}
                      className="border-b border-[#334155] hover:bg-[#111827] transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-[#F9FAFB]">
                        <Link href={`/admin/orders/${order._id}`} className="hover:underline">
                          {order._id.slice(-8)}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-[#9CA3AF]">
                        {order.user?.name || order.user?.email || "Guest"}
                      </td>
                      <td className="px-6 py-4 text-[#F9FAFB]">
                        ₹{order.totalAmount.toLocaleString("en-IN")}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            statusColors[order.status] || statusColors.pending
                          }`}
                        >
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[#9CA3AF]">
                        {new Date(order.createdAt).toLocaleDateString("en-IN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-[#9CA3AF]">No orders found</p>
          )}
        </div>
      </div>
    </div>
  );
}