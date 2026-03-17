"use client";

import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Plus,
  Zap,
  LayoutDashboard
} from 'lucide-react';

const AdminCalendar = () => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeStr = now.toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true 
  });
  
  const dateStr = now.toLocaleDateString('en-IN', { 
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' 
  });

  const currentDay = now.getDate();
  const currentMonthName = now.toLocaleString('en-IN', { month: 'long' });
  const currentYear = now.getFullYear();

  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-[#F5F6F7] text-[#2F2F33] p-6 md:p-12 font-sans selection:bg-blue-500/30">
      
      {/* Premium Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4 text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 bg-blue-50 w-fit px-4 py-1.5 rounded-full">
            <Zap size={12} fill="currentColor" /> System Operations
          </div>
          <h1 className="text-6xl font-black text-[#2F2F33] tracking-tighter">
            Schedule<span className="text-blue-600">.</span>
          </h1>
          <p className="text-gray-400 mt-2 text-xs font-black uppercase tracking-[0.2em]">{dateStr}</p>
        </div>

        {/* Real-time India Widget (Slate Theme) */}
        <div className="bg-[#2F2F33] border border-white/10 px-8 py-6 rounded-[2.5rem] flex items-center gap-6 shadow-2xl shadow-blue-900/10 transition-transform hover:scale-[1.02]">
          <div className="bg-blue-600 p-4 rounded-2xl shadow-lg shadow-blue-500/40">
            <Clock className="text-white" size={28} />
          </div>
          <div>
            <div className="text-3xl font-black text-white tabular-nums tracking-tighter leading-none mb-1">
              {timeStr}
            </div>
            <div className="text-[9px] uppercase tracking-[0.3em] text-blue-400 font-black opacity-80">
              IST • DESKIFY SYNC
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-10">
        
        {/* Left Sidebar: Snapshots */}
        <aside className="xl:col-span-1 space-y-8">
          {/* Today's Card */}
          <div className="bg-blue-600 p-8 rounded-[3rem] shadow-2xl shadow-blue-600/30 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:rotate-12 transition-transform">
               <CalendarIcon size={80} />
            </div>
            <span className="text-white/70 font-black uppercase text-[10px] tracking-[0.3em]">Momentum</span>
            <div className="text-8xl font-black my-2 tracking-tighter">{currentDay}</div>
            <div className="text-2xl font-black tracking-tight">{currentMonthName}</div>
            <button className="mt-8 w-full py-4 bg-white text-blue-600 hover:bg-gray-100 transition-all rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl">
              <Plus size={16} strokeWidth={3} /> Create Event
            </button>
          </div>

          {/* Quick Stats / Deskify Ad Line */}
          <div className="bg-white border border-gray-100 p-8 rounded-[3rem] shadow-xl shadow-black/5">
            <h3 className="text-[#2F2F33] text-[10px] font-black uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
               <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div> Active Sprints
            </h3>
            <div className="space-y-6">
              {[1, 2].map((item) => (
                <div key={item} className="flex gap-4 group cursor-pointer">
                  <div className={`w-1.5 h-12 ${item === 1 ? 'bg-emerald-500' : 'bg-rose-500'} rounded-full`}></div>
                  <div>
                    <p className="text-xs font-black text-[#2F2F33] uppercase tracking-wider">{item === 1 ? 'Product Deployment' : 'Security Audit'}</p>
                    <p className="text-[10px] text-gray-400 font-bold mt-1 tracking-widest uppercase">09:00 — 11:30</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Calendar Grid Container */}
        <main className="xl:col-span-3 bg-white border border-gray-100 rounded-[3.5rem] overflow-hidden shadow-2xl shadow-black/5">
          {/* Calendar Header */}
          <div className="p-8 flex items-center justify-between border-b border-gray-50 bg-white/50 backdrop-blur-sm">
            <h2 className="text-2xl font-black text-[#2F2F33] tracking-tighter">
              {currentMonthName} <span className="text-gray-300 font-medium">/ {currentYear}</span>
            </h2>
            <div className="flex gap-2">
              <button className="p-3 bg-gray-50 hover:bg-[#2F2F33] hover:text-white rounded-2xl transition-all duration-300 border border-gray-100">
                <ChevronLeft size={20}/>
              </button>
              <button className="p-3 bg-gray-50 hover:bg-[#2F2F33] hover:text-white rounded-2xl transition-all duration-300 border border-gray-100">
                <ChevronRight size={20}/>
              </button>
            </div>
          </div>

          {/* Day Labels */}
          <div className="grid grid-cols-7 text-center bg-gray-50/50 py-5">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <span key={d} className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-400">{d}</span>
            ))}
          </div>

          {/* Actual Days Grid */}
          <div className="grid grid-cols-7">
            {days.map((day) => (
              <div 
                key={day} 
                className={`h-36 border-r border-b border-gray-50 p-6 transition-all hover:bg-blue-50/40 relative group cursor-pointer ${day === currentDay ? 'bg-blue-50/30' : ''}`}
              >
                <span className={`text-sm font-black tracking-tighter ${day === currentDay ? 'text-blue-600 scale-110 block' : 'text-gray-300 group-hover:text-[#2F2F33]'}`}>
                  {day.toString().padStart(2, '0')}
                </span>
                
                {day === currentDay && (
                  <div className="mt-4 flex items-center gap-1.5 bg-blue-600 text-[8px] font-black text-white uppercase tracking-[0.2em] px-2 py-1 rounded-md w-fit shadow-lg shadow-blue-200">
                    Active Day
                  </div>
                )}

                {day === 15 && (
                  <div className="mt-2 w-full h-1 bg-rose-500/20 rounded-full overflow-hidden">
                    <div className="w-2/3 h-full bg-rose-500"></div>
                  </div>
                )}

                {/* Deskify Advertisement / Motivation Line on Grid */}
                {day === 28 && (
                   <div className="mt-2 text-[8px] font-black text-emerald-600/60 uppercase leading-tight">
                     Optimizing <br/> Workspace
                   </div>
                )}
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* Bottom Deskify Ad Section */}
      <footer className="mt-12 border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center opacity-40 hover:opacity-100 transition-opacity">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">
          Deskify Interactive Catalog System
        </p>
        <div className="flex gap-8 mt-4 md:mt-0">
          <p className="text-[9px] font-bold uppercase tracking-widest italic text-blue-600">Built for Excellence</p>
          <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">v4.0.2 Stable Sync</p>
        </div>
      </footer>
    </div>
  );
};

export default AdminCalendar;