"use client";

import { useState } from "react";
import { 
  FiTarget, 
  FiZap, 
  FiGift, 
  FiMail, 
  FiPlus, 
  FiBarChart, 
  FiMoreHorizontal, 
  FiMousePointer, 
  FiShare2,
  FiCircle
} from "react-icons/fi";

// Dummy Campaign Data
const CAMPAIGNS = [
  { id: 1, name: "Summer Tech Sale", status: "Active", reach: "45.2k", conv: "3.2%", spend: "₹12,000", type: "Email" },
  { id: 2, name: "New User Welcome", status: "Active", reach: "12.8k", conv: "8.5%", spend: "₹0", type: "Automation" },
  { id: 3, name: "Flash Weekend 20", status: "Paused", reach: "8.1k", conv: "1.2%", spend: "₹5,400", type: "Social" },
  { id: 4, name: "Abandoned Cart Recovery", status: "Active", reach: "2.4k", conv: "12.1%", spend: "₹0", type: "Trigger" },
];

export default function AdminMarketingPage() {
  const [activeTab, setActiveTab] = useState("all");

  return (
    <div className="min-h-screen bg-[#F5F6F7] text-[#2F2F33] pb-20 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="space-y-1">
            <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
              Marketing <span className="text-blue-600">Hub</span>
              <div className="px-2 py-0.5 bg-blue-50 border border-blue-100 rounded text-[10px] uppercase text-blue-600 tracking-widest font-bold">Growth Mode</div>
            </h1>
            <p className="text-gray-400 text-sm font-bold uppercase tracking-tighter">Manage promotions, coupons, and customer outreach.</p>
          </div>
          
          <button className="flex items-center justify-center gap-2 px-6 py-3 bg-[#2F2F33] hover:bg-[#3f3f44] text-white text-xs font-black rounded-2xl transition-all duration-300 shadow-xl shadow-[#2F2F33]/20 group uppercase tracking-widest">
            <FiPlus className="group-hover:rotate-90 transition-transform" />
            Create New Campaign
          </button>
        </div>

        {/* --- CORE PERFORMANCE METRICS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            { label: "Avg. Click Rate", val: "4.8%", icon: FiMousePointer, sub: "+0.4% from last month", color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Coupon Usage", val: "842", icon: FiGift, sub: "Top Code: WELCOME20", color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "Marketing ROI", val: "5.4x", icon: FiBarChart, sub: "₹5.4 earned per ₹1 spent", color: "text-rose-600", bg: "bg-rose-50" },
          ].map((metric, i) => (
            <div key={i} className="bg-white border border-gray-100 p-8 rounded-[2rem] shadow-sm relative overflow-hidden group hover:shadow-xl hover:shadow-black/5 transition-all duration-500">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <metric.icon size={80} className={metric.color} />
              </div>
              <div className="relative z-10">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{metric.label}</p>
                <h3 className="text-4xl font-black text-[#2F2F33] mb-3 tracking-tighter">{metric.val}</h3>
                <p className={`text-[11px] font-black ${metric.color} flex items-center gap-1 uppercase tracking-tighter`}>
                  <FiZap size={12} /> {metric.sub}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* --- CAMPAIGN MANAGEMENT TABLE --- */}
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-gray-50 bg-gray-50/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex gap-4">
              {['all', 'active', 'paused'].map((tab) => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-[10px] font-black uppercase tracking-widest px-5 py-2.5 rounded-xl transition-all ${
                    activeTab === tab 
                    ? "bg-[#2F2F33] text-white shadow-lg shadow-[#2F2F33]/20" 
                    : "text-gray-400 hover:text-[#2F2F33] bg-white border border-gray-100"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="relative">
               <FiTarget className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600" />
               <input 
                type="text" 
                placeholder="Search campaigns..." 
                className="bg-white border border-gray-100 rounded-xl py-2.5 pl-11 pr-4 text-xs font-bold focus:outline-none focus:border-blue-600 w-full md:w-64 transition-all shadow-sm"
               />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] bg-gray-50/50">
                <tr>
                  <th className="px-10 py-6">Campaign Details</th>
                  <th className="px-10 py-6">Status</th>
                  <th className="px-10 py-6">Reach</th>
                  <th className="px-10 py-6">Conv. Rate</th>
                  <th className="px-10 py-6">Ad Spend</th>
                  <th className="px-10 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {CAMPAIGNS.map((camp) => (
                  <tr key={camp.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-10 py-7">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                          {camp.type === 'Email' ? <FiMail size={20} /> : <FiShare2 size={20} />}
                        </div>
                        <div>
                          <p className="text-sm font-black text-[#2F2F33] leading-none mb-1.5 group-hover:text-blue-600 transition-colors">{camp.name}</p>
                          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{camp.type} Marketing</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-7">
                      <div className="flex items-center gap-2.5">
                        <FiCircle className={`w-2 h-2 fill-current ${camp.status === 'Active' ? 'text-blue-600 animate-pulse' : 'text-gray-300'}`} />
                        <span className={`text-[10px] font-black uppercase tracking-widest ${camp.status === 'Active' ? 'text-[#2F2F33]' : 'text-gray-400'}`}>{camp.status}</span>
                      </div>
                    </td>
                    <td className="px-10 py-7 text-sm font-black text-[#2F2F33]">{camp.reach}</td>
                    <td className="px-10 py-7">
                      <div className="flex items-center gap-3">
                         <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-600 rounded-full" style={{ width: camp.conv }} />
                         </div>
                         <span className="text-xs font-black text-blue-600">{camp.conv}</span>
                      </div>
                    </td>
                    <td className="px-10 py-7 text-sm font-black text-[#2F2F33]">{camp.spend}</td>
                    <td className="px-10 py-7 text-right">
                      <button className="p-2.5 hover:bg-blue-50 rounded-xl text-gray-400 hover:text-blue-600 transition-all">
                        <FiMoreHorizontal size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* --- BOTTOM QUICK TOOLS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
          <div className="bg-white border border-gray-100 p-10 rounded-[2.5rem] relative overflow-hidden shadow-sm group">
            <div className="relative z-10">
              <h3 className="text-xl font-black mb-3 tracking-tight">Automated Newsletters</h3>
              <p className="text-xs text-gray-400 font-bold mb-8 max-w-xs leading-relaxed uppercase tracking-tighter">Your "Weekly Top Picks" email is scheduled to go out to 4,200 subscribers tomorrow at 9:00 AM.</p>
              <button className="px-6 py-3 border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all duration-300">
                Edit Schedule
              </button>
            </div>
            <FiMail className="absolute -bottom-6 -right-6 text-blue-50 w-40 h-40 rotate-12 group-hover:scale-110 group-hover:text-blue-100/50 transition-all duration-500" />
          </div>

          <div className="bg-[#2F2F33] p-10 rounded-[2.5rem] flex items-center justify-between shadow-xl shadow-[#2F2F33]/10 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-xl font-black mb-1.5 tracking-tight text-white">Coupon Engine</h3>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">12 Active codes in use.</p>
            </div>
            <div className="flex -space-x-4 relative z-10">
              {[1,2,3].map(i => (
                <div key={i} className="w-14 h-14 rounded-2xl border-4 border-[#2F2F33] bg-white flex items-center justify-center text-xs font-black text-[#2F2F33] shadow-lg transform hover:-translate-y-2 transition-transform cursor-pointer">
                  {i}0%
                </div>
              ))}
            </div>
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl" />
          </div>
        </div>

      </div>
    </div>
  );
}