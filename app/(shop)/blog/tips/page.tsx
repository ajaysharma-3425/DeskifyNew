"use client";

import { motion } from "framer-motion";
import Link from "next/link";
// ✅ Using lucide-react for guaranteed compatibility
import { 
  Lightbulb, 
  CheckCircle, 
  ArrowRight, 
  Star,
  Wrench,
  Coffee,
  AlertCircle
} from "lucide-react";

// --- Dummy Tips Data ---
const tipsData = [
  {
    id: 1,
    title: "How to Keep Your Wooden Desk Brand New",
    description: "Wooden desks need special care. Avoid direct sunlight and use these natural oils to maintain the shine for years...",
    tag: "Maintenance",
    icon: <Wrench size={24} />,
    color: "bg-blue-50 text-blue-600"
  },
  {
    id: 2,
    title: "The 20-20-20 Rule for Eye Strain",
    description: "Working long hours? Every 20 minutes, look at something 20 feet away for 20 seconds to protect your vision...",
    tag: "Health",
    icon: <Star size={24} />,
    color: "bg-amber-50 text-amber-600"
  },
  {
    id: 3,
    title: "Best Desk Lighting for Late Night Work",
    description: "Warm light or white light? Learn which color temperature helps you focus better during night shifts...",
    tag: "Productivity",
    icon: <Lightbulb size={24} />,
    color: "bg-emerald-50 text-emerald-600"
  },
  {
    id: 4,
    title: "Cleaning Your Mechanical Keyboard Properly",
    description: "Dust can kill your switches. Here is a step-by-step guide to deep cleaning your keyboard without damaging it...",
    tag: "Tech Care",
    icon: <CheckCircle size={24} />,
    color: "bg-purple-50 text-purple-600"
  },
  {
    id: 5,
    title: "Creating a Coffee Corner on a Small Desk",
    description: "No space for a coffee machine? Use these compact organizer tips to have your caffeine fix within reach...",
    tag: "Lifestyle",
    icon: <Coffee size={24} />,
    color: "bg-rose-50 text-rose-600"
  }
];

export default function TipsPage() {
  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-20">
      {/* --- Header Section --- */}
      <div className="bg-white border-b border-slate-100 pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-[#10B981] rounded-full text-[10px] font-black uppercase tracking-[0.3em] w-fit mb-6"
          >
            <Lightbulb size={14} /> Pro Tips & Tricks
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Expert <span className="text-[#10B981]">Advice</span> for Your Workspace
          </h1>
          <p className="mt-4 text-slate-500 text-lg font-medium max-w-2xl">
            Chhoti chhoti baatein jo aapke work-life ko aasaan aur stylish banati hain.
          </p>
        </div>
      </div>

      {/* --- Tips List --- */}
      <div className="max-w-4xl mx-auto px-6 mt-12 space-y-6">
        {tipsData.map((tip, index) => (
          <motion.div
            key={tip.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-emerald-500/5 hover:border-emerald-100 transition-all duration-300"
          >
            <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* Icon Box */}
              <div className={`p-5 rounded-2xl ${tip.color} transition-transform group-hover:scale-110 duration-300`}>
                {tip.icon}
              </div>

              {/* Text Content */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">
                    {tip.tag}
                  </span>
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-3 group-hover:text-[#10B981] transition-colors">
                  {tip.title}
                </h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed mb-6">
                  {tip.description}
                </p>

                <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#10B981] hover:gap-4 transition-all">
                  Read Full Guide <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* --- Support CTA --- */}
      <div className="max-w-4xl mx-auto px-6 mt-20">
        <div className="bg-slate-900 rounded-[2.5rem] p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-bl-full" />
          <h3 className="text-2xl font-black text-white mb-2">Have a specific question?</h3>
          <p className="text-slate-400 text-sm mb-8">Hamare experts se direct baat karein ya FAQ check karein.</p>
          <div className="flex justify-center gap-4">
            <Link href="/faq" className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#10B981] hover:text-white transition-all">
              Visit FAQ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}