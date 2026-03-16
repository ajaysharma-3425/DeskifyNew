"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Lightbulb, 
  CheckCircle, 
  ArrowRight, 
  Star,
  Wrench,
  Coffee,
  Zap
} from "lucide-react";

// --- Tips Data ---
const tipsData = [
  {
    id: 1,
    title: "HOW TO KEEP YOUR WOODEN DESK BRAND NEW",
    description: "Wooden desks need special care. Avoid direct sunlight and use these natural oils to maintain the shine for years...",
    tag: "MAINTENANCE",
    icon: <Wrench size={24} />,
  },
  {
    id: 2,
    title: "THE 20-20-20 RULE FOR EYE STRAIN",
    description: "Working long hours? Every 20 minutes, look at something 20 feet away for 20 seconds to protect your vision...",
    tag: "HEALTH",
    icon: <Star size={24} />,
  },
  {
    id: 3,
    title: "BEST DESK LIGHTING FOR LATE NIGHT WORK",
    description: "Warm light or white light? Learn which color temperature helps you focus better during night shifts...",
    tag: "PRODUCTIVITY",
    icon: <Lightbulb size={24} />,
  },
  {
    id: 4,
    title: "CLEANING YOUR MECHANICAL KEYBOARD PROPERLY",
    description: "Dust can kill your switches. Here is a step-by-step guide to deep cleaning your keyboard without damaging it...",
    tag: "TECH CARE",
    icon: <CheckCircle size={24} />,
  },
  {
    id: 5,
    title: "CREATING A COFFEE CORNER ON A SMALL DESK",
    description: "No space for a coffee machine? Use these compact organizer tips to have your caffeine fix within reach...",
    tag: "LIFESTYLE",
    icon: <Coffee size={24} />,
  }
];

export default function TipsPage() {
  return (
    <div className="min-h-screen bg-[#003F3A] pb-20 selection:bg-[#A4F000] selection:text-[#003F3A]">
      
      {/* --- Header Section --- */}
      <div className="relative pt-24 pb-20 overflow-hidden border-b border-white/5">
        {/* Abstract Glow */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#A4F000]/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-[#A4F000] rounded-full text-[10px] font-black uppercase tracking-[0.4em] w-fit mb-8 backdrop-blur-md"
          >
            <Zap size={14} className="animate-pulse" /> Protocol Updates
          </motion.div>
          
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter italic uppercase leading-[0.9]">
            EXPERT <span className="text-[#A4F000]">ADVICE</span> <br />
            <span className="text-white/20">FOR YOUR SETUP</span>
          </h1>
          
          <p className="mt-6 text-white/50 text-base md:text-lg font-medium max-w-xl leading-relaxed">
            Chhoti chhoti baatein jo aapke work-life ko aasaan, stylish aur <span className="text-white">highly efficient</span> banati hain.
          </p>
        </div>
      </div>

      {/* --- Tips List --- */}
      <div className="max-w-4xl mx-auto px-6 mt-16 space-y-6">
        {tipsData.map((tip, index) => (
          <motion.div
            key={tip.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group bg-white/5 p-6 md:p-10 rounded-[2.5rem] border border-white/5 hover:border-[#A4F000]/30 transition-all duration-500 hover:shadow-[0_20px_50px_-20px_rgba(164,240,0,0.15)]"
          >
            <div className="flex flex-col md:flex-row gap-8 items-start">
              
              {/* Icon Box */}
              <div className="relative">
                <div className="p-6 rounded-[2rem] bg-[#A4F000] text-[#003F3A] transition-transform group-hover:rotate-12 duration-500 shadow-[0_10px_30px_-5px_rgba(164,240,0,0.4)]">
                  {tip.icon}
                </div>
                <div className="absolute inset-0 bg-[#A4F000] blur-xl opacity-0 group-hover:opacity-20 transition-opacity" />
              </div>

              {/* Text Content */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 group-hover:text-[#A4F000] transition-colors">
                    {tip.tag}
                  </span>
                </div>
                
                <h3 className="text-xl md:text-2xl font-black text-white mb-4 group-hover:text-[#A4F000] transition-colors italic uppercase tracking-tight">
                  {tip.title}
                </h3>
                
                <p className="text-white/40 text-sm md:text-base font-medium leading-relaxed mb-8">
                  {tip.description}
                </p>

                <button className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#A4F000] group-hover:gap-5 transition-all">
                  Read Full Protocol <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* --- Support CTA --- */}
      <div className="max-w-4xl mx-auto px-6 mt-28">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-[#A4F000] to-emerald-400 rounded-[3rem] p-12 md:p-16 text-center relative overflow-hidden shadow-2xl"
        >
          {/* Decorative Circles */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#003F3A]/10 rounded-full blur-3xl" />
          
          <div className="relative z-10">
            <h3 className="text-3xl md:text-4xl font-black text-[#003F3A] mb-4 italic uppercase tracking-tighter">
              Need Specific Intelligence?
            </h3>
            <p className="text-[#003F3A]/60 text-sm md:text-base font-bold mb-10 max-w-md mx-auto leading-tight">
              Hamare setup experts se direct baat karein ya hamara deep-dive FAQ check karein.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/faq" className="px-10 py-5 bg-[#003F3A] text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:scale-105 transition-all shadow-xl flex items-center justify-center gap-2">
                 Access FAQ Center
              </Link>
              <button className="px-10 py-5 bg-white/20 text-[#003F3A] border border-[#003F3A]/10 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-white/40 transition-all">
                Contact Expert
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer Branding */}
      <div className="text-center mt-20 opacity-10">
        <p className="text-[10px] font-black tracking-[1em] text-white uppercase italic">Deskify Archives</p>
      </div>
    </div>
  );
}