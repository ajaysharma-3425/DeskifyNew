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
    <div className="min-h-screen bg-[#0F172A] text-[#F9FAFB] pb-20 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="space-y-1">
            <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
              Marketing <span className="text-[#3B82F6]">Hub</span>
              <div className="px-2 py-0.5 bg-[#3B82F6]/10 border border-[#3B82F6]/30 rounded text-[10px] uppercase text-[#3B82F6] tracking-widest">Growth Mode</div>
            </h1>
            <p className="text-[#9CA3AF] text-sm font-medium">Manage promotions, coupons, and customer outreach.</p>
          </div>
          
          <button className="flex items-center justify-center gap-2 px-6 py-3 bg-[#3B82F6] hover:bg-[#60A5FA] text-white text-sm font-bold rounded-2xl transition-all duration-300 shadow-xl shadow-[#3B82F6]/20 group">
            <FiPlus className="group-hover:rotate-90 transition-transform" />
            Create New Campaign
          </button>
        </div>

        {/* --- CORE PERFORMANCE METRICS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            { label: "Avg. Click Rate", val: "4.8%", icon: FiMousePointer, sub: "+0.4% from last month" },
            { label: "Coupon Usage", val: "842", icon: FiGift, sub: "Top Code: WELCOME20" },
            { label: "Marketing ROI", val: "5.4x", icon: FiBarChart, sub: "₹5.4 earned per ₹1 spent" },
          ].map((metric, i) => (
            <div key={i} className="bg-[#1F2937] border border-[#334155] p-6 rounded-3xl shadow-lg relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <metric.icon size={60} className="text-[#3B82F6]" />
              </div>
              <div className="relative z-10">
                <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-widest mb-1">{metric.label}</p>
                <h3 className="text-3xl font-black text-white mb-2">{metric.val}</h3>
                <p className="text-[11px] font-bold text-[#3B82F6] flex items-center gap-1">
                  <FiZap size={12} /> {metric.sub}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* --- CAMPAIGN MANAGEMENT TABLE --- */}
        <div className="bg-[#1F2937] rounded-3xl border border-[#334155] shadow-2xl overflow-hidden">
          <div className="p-8 border-b border-[#334155] bg-[#111827]/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex gap-4">
              {['all', 'active', 'paused'].map((tab) => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-xl transition-all ${
                    activeTab === tab 
                    ? "bg-[#3B82F6]/15 text-[#3B82F6] border border-[#3B82F6]/30" 
                    : "text-[#9CA3AF] hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="relative">
               <FiTarget className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3B82F6]" />
               <input 
                type="text" 
                placeholder="Search campaigns..." 
                className="bg-[#0F172A] border border-[#334155] rounded-xl py-2 pl-10 pr-4 text-xs focus:outline-none focus:border-[#3B82F6] w-full md:w-64 transition-all"
               />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.2em] bg-[#0F172A]/40">
                <tr>
                  <th className="px-8 py-5">Campaign Details</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5">Reach</th>
                  <th className="px-8 py-5">Conv. Rate</th>
                  <th className="px-8 py-5">Ad Spend</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#334155]">
                {CAMPAIGNS.map((camp) => (
                  <tr key={camp.id} className="hover:bg-[#111827]/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-[#0F172A] border border-[#334155] flex items-center justify-center text-[#3B82F6]">
                          {camp.type === 'Email' ? <FiMail /> : <FiShare2 />}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white leading-none mb-1 group-hover:text-[#3B82F6] transition-colors">{camp.name}</p>
                          <p className="text-[10px] text-[#9CA3AF] font-medium uppercase tracking-tighter">{camp.type} Marketing</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <FiCircle className={`w-2 h-2 fill-current ${camp.status === 'Active' ? 'text-[#3B82F6] animate-pulse' : 'text-[#9CA3AF]'}`} />
                        <span className={`text-[10px] font-black uppercase ${camp.status === 'Active' ? 'text-white' : 'text-[#9CA3AF]'}`}>{camp.status}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-sm font-bold text-[#F9FAFB]">{camp.reach}</td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                         <div className="w-16 h-1.5 bg-[#0F172A] rounded-full overflow-hidden border border-[#334155]">
                            <div className="h-full bg-[#3B82F6]" style={{ width: camp.conv }} />
                         </div>
                         <span className="text-xs font-bold text-[#3B82F6]">{camp.conv}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-sm font-bold text-[#F9FAFB]">{camp.spend}</td>
                    <td className="px-8 py-6 text-right">
                      <button className="p-2 hover:bg-[#3B82F6]/10 rounded-lg text-[#9CA3AF] hover:text-[#3B82F6] transition-all">
                        <FiMoreHorizontal size={18} />
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
          <div className="bg-gradient-to-br from-[#1F2937] to-[#111827] border border-[#334155] p-8 rounded-3xl relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-lg font-bold mb-2">Automated Newsletters</h3>
              <p className="text-xs text-[#9CA3AF] mb-6 max-w-xs">Your "Weekly Top Picks" email is scheduled to go out to 4,200 subscribers tomorrow at 9:00 AM.</p>
              <button className="px-5 py-2.5 border border-[#3B82F6] text-[#3B82F6] hover:bg-[#3B82F6] hover:text-white text-xs font-bold rounded-xl transition-all duration-300">
                Edit Schedule
              </button>
            </div>
            <FiMail className="absolute -bottom-6 -right-6 text-[#3B82F6]/5 w-32 h-32 rotate-12" />
          </div>

          <div className="bg-[#1F2937] border border-[#334155] p-8 rounded-3xl flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold mb-1">Coupon Engine</h3>
              <p className="text-xs text-[#9CA3AF]">12 Active codes currently being used.</p>
            </div>
            <div className="flex -space-x-3">
              {[1,2,3].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-[#1F2937] bg-[#0F172A] flex items-center justify-center text-[10px] font-bold text-[#3B82F6]">
                  {i}0%
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}