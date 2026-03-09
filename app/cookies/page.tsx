"use client";
import { motion } from "framer-motion";
import { FiCircle, FiCheckCircle } from "react-icons/fi";

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-[#FDFDFD] pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter">
            COOKIE <span className="text-orange-500 italic">SETTINGS</span>
          </h1>
          <p className="mt-4 text-slate-500">We use cookies to enhance your Deskify experience.</p>
        </motion.div>

        <div className="bg-white rounded-[3rem] border border-slate-100 overflow-hidden shadow-2xl">
          <div className="p-10 space-y-8">
            <CookieItem title="Essential Cookies" status="Always Active" desc="Necessary for the website to function (Login, Cart, Security)." />
            <CookieItem title="Performance Cookies" status="Optional" desc="Helps us understand how visitors interact with Deskify." />
            <CookieItem title="Marketing Cookies" status="Optional" desc="Used to deliver relevant advertisements to you." />
          </div>
          <div className="bg-slate-50 p-8 flex justify-end">
            <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-black transition-all">
              Save Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CookieItem({ title, status, desc }: { title: string; status: string; desc: string }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-50 pb-8 last:border-0 last:pb-0">
      <div>
        <h3 className="text-xl font-bold text-slate-900 mb-1">{title}</h3>
        <p className="text-slate-500 text-sm max-w-md font-medium">{desc}</p>
      </div>
      <div className="flex items-center gap-2">
        <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${status === 'Always Active' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
          {status}
        </span>
      </div>
    </div>
  );
}