"use client";

import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Plus,
  MoreVertical 
} from 'lucide-react';

const AdminCalendar = () => {
  const [now, setNow] = useState(new Date());

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // India Locale Formatting
  const timeStr = now.toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true 
  });
  
  const dateStr = now.toLocaleDateString('en-IN', { 
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' 
  });

  const currentDay = now.getDate();
  const currentMonthName = now.toLocaleString('en-IN', { month: 'long' });
  const currentYear = now.getFullYear();

  // Simple logic to fill a 31-day grid (Simplified for UI demo)
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-300 p-6 md:p-10 font-sans selection:bg-blue-500/30">
      
      {/* Top Header Section */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <CalendarIcon className="text-blue-500" size={32} />
            Calendar
          </h1>
          <p className="text-slate-400 mt-2 font-medium">{dateStr}</p>
        </div>

        {/* Real-time IST Widget */}
        <div className="bg-slate-800/40 border border-slate-700/50 backdrop-blur-md px-6 py-4 rounded-2xl flex items-center gap-5 shadow-2xl ring-1 ring-white/5">
          <div className="bg-blue-600/20 p-3 rounded-xl">
            <Clock className="text-blue-400" size={24} />
          </div>
          <div>
            <div className="text-2xl font-mono font-bold text-white tabular-nums tracking-tighter">
              {timeStr}
            </div>
            <div className="text-[10px] uppercase tracking-widest text-blue-400 font-bold opacity-80">
              IST • India Time
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        
        {/* Left Sidebar: Today's Snapshot */}
        <aside className="xl:col-span-1 space-y-6">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 rounded-3xl shadow-lg shadow-blue-900/20">
            <span className="text-blue-100/80 font-semibold uppercase text-xs tracking-widest">Today</span>
            <div className="text-6xl font-black text-white my-2">{currentDay}</div>
            <div className="text-xl font-medium text-white/90">{currentMonthName}</div>
            <button className="mt-6 w-full py-3 bg-white/10 hover:bg-white/20 transition-all rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-2 border border-white/10">
              <Plus size={18} /> Add Event
            </button>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl">
            <h3 className="text-white font-bold mb-4">Upcoming</h3>
            <div className="space-y-4">
              {[1, 2].map((item) => (
                <div key={item} className="flex gap-4 p-3 rounded-xl hover:bg-slate-800/50 transition-colors cursor-pointer group">
                  <div className="w-1 h-10 bg-blue-500 rounded-full group-hover:h-12 transition-all"></div>
                  <div>
                    <p className="text-sm font-semibold text-slate-200">Dev Sprint Review</p>
                    <p className="text-xs text-slate-500">14:00 - 15:30</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Right Content: The Calendar Grid */}
        <main className="xl:col-span-3 bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-800/20">
            <h2 className="text-lg font-bold text-white">{currentMonthName} {currentYear}</h2>
            <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-700">
              <button className="p-2 hover:bg-slate-800 rounded-md transition-all text-slate-400 hover:text-white"><ChevronLeft size={20}/></button>
              <button className="p-2 hover:bg-slate-800 rounded-md transition-all text-slate-400 hover:text-white"><ChevronRight size={20}/></button>
            </div>
          </div>

          {/* Calendar Day Labels */}
          <div className="grid grid-cols-7 text-center border-b border-slate-800 py-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <span key={d} className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{d}</span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7">
            {days.map((day) => (
              <div 
                key={day} 
                className={`h-32 border-r border-b border-slate-800 p-3 transition-all hover:bg-blue-600/5 relative group cursor-pointer ${day === currentDay ? 'bg-blue-600/10' : ''}`}
              >
                <span className={`text-sm font-bold ${day === currentDay ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'}`}>
                  {day.toString().padStart(2, '0')}
                </span>
                {day === currentDay && (
                  <span className="absolute top-3 right-3 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                  </span>
                )}
                <div className="mt-4 flex flex-col gap-1">
                  {day % 7 === 0 && <div className="text-[9px] bg-slate-800 text-slate-400 p-1 rounded">System Backup</div>}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminCalendar;