"use client";

import { useState, useEffect } from "react";
import { 
  FiTrendingUp, 
  FiUsers, 
  FiShoppingBag, 
  FiActivity, 
  FiArrowUpRight, 
  FiArrowDownRight, 
  FiCalendar, 
  FiDownload,
  FiPieChart,
  FiBarChart2
} from "react-icons/fi";

// Dummy Data for Analytics
const REVENUE_CHART = [
  { month: "Jan", val: 45 }, { month: "Feb", val: 52 }, { month: "Mar", val: 48 },
  { month: "Apr", val: 70 }, { month: "May", val: 61 }, { month: "Jun", val: 85 },
  { month: "Jul", val: 92 }, { month: "Aug", val: 88 }
];

const CATEGORY_DATA = [
  { name: "Electronics", percentage: 40, color: "#3B82F6" },
  { name: "Furniture", percentage: 30, color: "#334155" },
  { name: "Accessories", percentage: 20, color: "#1E293B" },
  { name: "Other", percentage: 10, color: "#0F172A" },
];

export default function AdminAnalyticsPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data fetching
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#3B82F6]/20 border-t-[#3B82F6] rounded-full animate-spin" />
          <p className="text-[#9CA3AF] font-medium animate-pulse">Loading Analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-[#F9FAFB] pb-12 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        
        {/* --- HEADER SECTION --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-black tracking-tight">
              Store <span className="text-[#3B82F6]">Analytics</span>
            </h1>
            <p className="text-[#9CA3AF] mt-1 text-sm font-medium">
              Real-time insights and sales performance metrics.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-[#111827] border border-[#334155] rounded-xl text-sm font-semibold text-[#9CA3AF]">
              <FiCalendar className="text-[#3B82F6]" />
              Last 30 Days
            </div>
            <button className="flex items-center gap-2 px-5 py-2 bg-[#3B82F6] hover:bg-[#60A5FA] text-white text-sm font-bold rounded-xl transition-all duration-300 shadow-lg shadow-[#3B82F6]/20">
              <FiDownload />
              Export Reports
            </button>
          </div>
        </div>

        {/* --- TOP PERFORMANCE CARDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { label: "Total Revenue", value: "₹4,28,500", icon: FiTrendingUp, trend: "+12.5%", up: true },
            { label: "Active Sessions", value: "2,840", icon: FiActivity, trend: "+5.2%", up: true },
            { label: "Total Sales", value: "1,120", icon: FiShoppingBag, trend: "-2.1%", up: false },
            { label: "New Customers", value: "482", icon: FiUsers, trend: "+18.4%", up: true },
          ].map((card, i) => (
            <div key={i} className="bg-[#1F2937] p-6 rounded-2xl border border-[#334155] shadow-lg group hover:border-[#3B82F6]/40 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 rounded-lg bg-[#0F172A] border border-[#334155] text-[#3B82F6] group-hover:scale-110 transition-transform">
                  <card.icon size={20} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-bold ${card.up ? 'text-[#3B82F6]' : 'text-[#9CA3AF]'}`}>
                  {card.up ? <FiArrowUpRight /> : <FiArrowDownRight />}
                  {card.trend}
                </div>
              </div>
              <p className="text-2xl font-black tracking-tight">{card.value}</p>
              <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-widest mt-1">{card.label}</p>
            </div>
          ))}
        </div>

        {/* --- MAIN CHARTS SECTION --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Revenue Over Time */}
          <div className="lg:col-span-2 bg-[#1F2937] rounded-3xl border border-[#334155] p-8 shadow-xl">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <FiBarChart2 className="text-[#3B82F6]" />
                  Revenue Growth
                </h2>
                <p className="text-xs text-[#9CA3AF]">Monthly revenue flow comparison</p>
              </div>
              <div className="flex gap-2">
                <span className="w-3 h-3 rounded-full bg-[#3B82F6]"></span>
                <span className="w-3 h-3 rounded-full bg-[#334155]"></span>
              </div>
            </div>

            <div className="h-64 flex items-end justify-between gap-4">
              {REVENUE_CHART.map((item, idx) => (
                <div key={idx} className="flex flex-col items-center w-full group relative">
                  {/* Tooltip */}
                  <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-[#3B82F6] text-white text-[10px] font-bold px-2 py-1 rounded mb-2 z-10">
                    {item.val}%
                  </div>
                  <div 
                    className="w-full bg-[#0F172A] border border-[#334155] rounded-t-xl group-hover:border-[#3B82F6] transition-all duration-500 relative overflow-hidden"
                    style={{ height: `${item.val * 2}px` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-[#3B82F6]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <span className="text-[10px] font-bold text-[#9CA3AF] mt-4 uppercase tracking-tighter">{item.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Category Distribution */}
          <div className="bg-[#1F2937] rounded-3xl border border-[#334155] p-8 shadow-xl">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <FiPieChart className="text-[#3B82F6]" />
              Sales Source
            </h2>
            
            <div className="space-y-6">
              {CATEGORY_DATA.map((cat, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-[#F9FAFB]">{cat.name}</span>
                    <span className="text-[#3B82F6]">{cat.percentage}%</span>
                  </div>
                  <div className="w-full h-2 bg-[#0F172A] rounded-full overflow-hidden border border-[#334155]">
                    <div 
                      className="h-full bg-[#3B82F6] transition-all duration-1000 ease-out"
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 p-5 bg-[#0F172A]/50 border border-[#334155] rounded-2xl">
              <h4 className="text-xs font-bold text-[#3B82F6] uppercase tracking-wider mb-2">Insight</h4>
              <p className="text-[11px] text-[#9CA3AF] leading-relaxed">
                Electronics continue to dominate 40% of your total revenue. Consider scaling inventory for Q3.
              </p>
            </div>
          </div>

        </div>

        {/* --- BOTTOM SECTION: RECENT ACTIVITY --- */}
        <div className="mt-8 bg-[#1F2937] rounded-3xl border border-[#334155] overflow-hidden shadow-2xl">
           <div className="px-8 py-6 border-b border-[#334155] bg-[#111827]/50">
              <h3 className="font-bold text-sm uppercase tracking-widest text-[#9CA3AF]">Conversion Funnel</h3>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#334155]">
              {[
                { label: "Product Views", val: "12,402", sub: "Users viewed items" },
                { label: "Add to Cart", val: "3,105", sub: "25% of total views" },
                { label: "Purchased", val: "1,120", sub: "9% conversion rate" },
              ].map((item, i) => (
                <div key={i} className="p-8 hover:bg-[#0F172A]/20 transition-colors">
                  <p className="text-3xl font-black text-[#F9FAFB]">{item.val}</p>
                  <p className="text-sm font-bold text-[#3B82F6] mt-1">{item.label}</p>
                  <p className="text-xs text-[#9CA3AF] mt-1">{item.sub}</p>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}