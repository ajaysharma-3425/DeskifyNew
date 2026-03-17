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
  { name: "Electronics", percentage: 40, color: "bg-emerald-500" },
  { name: "Furniture", percentage: 30, color: "bg-blue-500" },
  { name: "Accessories", percentage: 20, color: "bg-rose-500" },
  { name: "Other", percentage: 10, color: "bg-gray-400" },
];

export default function AdminAnalyticsPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F6F7] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#2F2F33]/5 border-t-[#2F2F33] rounded-full animate-spin" />
          <p className="text-[#2F2F33]/40 font-black animate-pulse tracking-widest uppercase text-[10px]">Syncing Analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F6F7] text-[#2F2F33] pb-12 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        
        {/* --- HEADER SECTION --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-[#2F2F33]">
              Store <span className="text-emerald-600">Analytics</span>
            </h1>
            <p className="text-[#2F2F33]/50 mt-1 text-sm font-bold uppercase tracking-tighter">
              Performance metrics & real-time growth
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400">
              <FiCalendar className="text-emerald-600" />
              Last 30 Days
            </div>
            <button className="flex items-center gap-2 px-6 py-2.5 bg-[#2F2F33] hover:bg-[#3f3f44] text-white text-xs font-black rounded-xl transition-all duration-300 shadow-xl shadow-[#2F2F33]/20 uppercase tracking-widest">
              <FiDownload />
              Export Reports
            </button>
          </div>
        </div>

        {/* --- STATS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { label: "Total Revenue", value: "₹4,28,500", icon: FiTrendingUp, trend: "+12.5%", up: true, color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "Active Sessions", value: "2,840", icon: FiActivity, trend: "+5.2%", up: true, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Total Sales", value: "1,120", icon: FiShoppingBag, trend: "-2.1%", up: false, color: "text-rose-600", bg: "bg-rose-50" },
            { label: "New Customers", value: "482", icon: FiUsers, trend: "+18.4%", up: true, color: "text-indigo-600", bg: "bg-indigo-50" },
          ].map((card, i) => (
            <div key={i} className="bg-white p-6 rounded-[2rem] border border-gray-100 group hover:shadow-2xl hover:shadow-black/5 transition-all duration-500 relative overflow-hidden">
              <div className="flex items-center justify-between mb-4 relative z-10">
                <div className={`p-3 rounded-2xl ${card.bg} ${card.color} group-hover:scale-110 transition-transform`}>
                  <card.icon size={20} />
                </div>
                <div className={`flex items-center gap-1 text-[10px] font-black uppercase ${card.up ? 'text-emerald-600' : 'text-gray-400'}`}>
                  {card.up ? <FiArrowUpRight /> : <FiArrowDownRight />}
                  {card.trend}
                </div>
              </div>
              <p className="text-2xl font-black tracking-tight text-[#2F2F33] relative z-10">{card.value}</p>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1 relative z-10">{card.label}</p>
              <card.icon size={70} className="absolute -right-4 -bottom-4 text-gray-50 opacity-50 group-hover:text-gray-100 transition-colors" />
            </div>
          ))}
        </div>

        {/* --- CHARTS SECTION --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Revenue Growth Graph */}
          <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-xl font-black text-[#2F2F33] tracking-tight flex items-center gap-2">
                  <FiBarChart2 className="text-emerald-600" />
                  Revenue Growth
                </h2>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">Monthly Financial Pulse</p>
              </div>
              <select className="bg-[#F5F6F7] border-none text-[10px] font-black uppercase rounded-lg px-3 py-2 outline-none cursor-pointer">
                <option>Year 2026</option>
                <option>Year 2025</option>
              </select>
            </div>

            <div className="h-64 flex items-end justify-between gap-3 sm:gap-6 px-2">
              {REVENUE_CHART.map((item, idx) => (
                <div key={idx} className="flex flex-col items-center w-full group relative">
                  <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-[#2F2F33] text-white text-[10px] font-black px-2 py-1 rounded-lg mb-2 z-20">
                    ₹{item.val}k
                  </div>
                  <div className="w-full bg-[#F5F6F7] rounded-2xl relative overflow-hidden h-[200px]">
                    <div 
                      className="absolute bottom-0 w-full bg-[#2F2F33] group-hover:bg-emerald-600 rounded-2xl transition-all duration-700 ease-out"
                      style={{ height: `${item.val}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-black text-gray-400 mt-4 uppercase tracking-tighter group-hover:text-[#2F2F33] transition-colors">{item.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sales Source Distribution */}
          <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm flex flex-col">
            <h2 className="text-xl font-black mb-10 flex items-center gap-2 tracking-tight">
              <FiPieChart className="text-emerald-600" />
              Sales Source
            </h2>
            
            <div className="space-y-7 flex-1">
              {CATEGORY_DATA.map((cat, i) => (
                <div key={i} className="group">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
                    <span className="text-gray-500">{cat.name}</span>
                    <span className="text-[#2F2F33]">{cat.percentage}%</span>
                  </div>
                  <div className="w-full h-2 bg-[#F5F6F7] rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${cat.color} transition-all duration-1000 ease-out`}
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-[#F5F6F7] rounded-[2rem] border border-dashed border-gray-200">
              <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-2">System Insight</h4>
              <p className="text-xs text-gray-500 leading-relaxed font-bold">
                Organic search is up by **12%**. Consider optimizing the "Electronics" landing page for better ROI.
              </p>
            </div>
          </div>

        </div>

        {/* --- CONVERSION FUNNEL --- */}
        <div className="mt-8 bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm">
           <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-50">
              {[
                { label: "Product Views", val: "12,402", sub: "Interest Level", color: "text-blue-600" },
                { label: "Add to Cart", val: "3,105", sub: "Intent to Buy", color: "text-emerald-600" },
                { label: "Purchased", val: "1,120", sub: "Final Conversion", color: "text-rose-600" },
              ].map((item, i) => (
                <div key={i} className="p-10 hover:bg-gray-50/50 transition-colors group text-center">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-2">{item.label}</p>
                  <p className={`text-4xl font-black tracking-tighter ${item.color}`}>{item.val}</p>
                  <p className="text-[10px] font-black text-[#2F2F33]/30 mt-2 uppercase tracking-widest">{item.sub}</p>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}