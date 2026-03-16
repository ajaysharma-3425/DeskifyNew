"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { 
  FiTruck, FiShield, FiHeadphones, FiRefreshCw, 
  FiAward, FiUsers, FiPackage, FiClock, FiArrowRight, FiTarget, FiHeart 
} from "react-icons/fi";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#003F3A] text-white font-sans selection:bg-[#A4F000] selection:text-[#003F3A] overflow-x-hidden">
      
      {/* --- PREMIUM HERO SECTION --- */}
      <section className="relative pt-28 pb-16 md:pt-48 md:pb-32 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[40%] bg-[#A4F000]/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[40%] bg-emerald-500/5 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 mb-6"
            >
              <div className="h-px w-8 bg-[#A4F000]" />
              <span className="text-[#A4F000] font-black tracking-[0.3em] uppercase text-[10px] md:text-xs italic">Protocol: Established 2024</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl sm:text-7xl md:text-9xl font-black text-white mb-6 md:mb-8 tracking-tighter italic uppercase leading-[0.85]"
            >
              WE REDEFINE <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A4F000] to-emerald-400">EXCELLENCE.</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-white/50 text-base md:text-xl max-w-2xl leading-relaxed mb-10 font-medium tracking-tight"
            >
              Deskify is more than an interface. It is a high-performance ecosystem designed to bridge the gap between industrial-grade engineering and everyday human ambition.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row flex-wrap gap-4"
            >
              <Link href="/product" className="group flex items-center justify-center gap-3 bg-[#A4F000] hover:scale-105 text-[#003F3A] px-10 py-5 rounded-2xl font-black uppercase text-sm transition-all shadow-[0_20px_40px_-10px_rgba(164,240,0,0.3)]">
                Initialize Search <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <div className="flex items-center gap-4 px-6 py-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl">
                <div className="flex -space-x-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-[#003F3A] bg-[#A4F000]" />
                  ))}
                </div>
                <span className="text-white/60 text-[10px] md:text-xs font-black uppercase tracking-widest">10K+ Nodes Active</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- BENTO GRID STATS --- */}
      <section className="max-w-7xl mx-auto px-6 -mt-10 md:-mt-20 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={<FiUsers />} label="Active Users" value="10k+" color="bg-[#A4F000]" />
          <StatCard icon={<FiPackage />} label="Premium Units" value="500+" color="bg-white/10" />
          <StatCard icon={<FiTarget />} label="Accuracy Rate" value="99.9%" color="bg-white/10" />
          <StatCard icon={<FiClock />} label="Fast Uplink" value="3 Days" color="bg-[#A4F000]" />
        </div>
      </section>

      {/* --- OUR STORY --- */}
      <section className="max-w-7xl mx-auto px-6 py-24 md:py-44">
        <div className="grid lg:grid-cols-2 gap-16 md:gap-24 items-center">
          <div className="relative order-2 lg:order-1">
            <div className="absolute -top-10 -left-10 w-44 h-44 bg-[#A4F000]/10 rounded-full z-0 blur-3xl" />
            <div className="relative z-10 rounded-[3rem] overflow-hidden border border-white/10 bg-black/20 p-2">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
                alt="HQ"
                className="w-full h-[400px] md:h-[600px] object-cover grayscale brightness-50 hover:grayscale-0 hover:brightness-100 transition-all duration-1000 rounded-[2.5rem]"
              />
            </div>
            <motion.div 
              whileHover={{ rotate: -2, scale: 1.05 }}
              className="z-20 absolute -bottom-8 -right-4 md:-bottom-12 md:-right-8 bg-[#A4F000] p-6 md:p-10 rounded-[2.5rem] shadow-2xl text-[#003F3A] flex items-center gap-6"
            >
              <FiAward size={48} className="font-black" />
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Tech Excellence</p>
                <p className="text-xl md:text-3xl font-black italic uppercase leading-none">Global Award '25</p>
              </div>
            </motion.div>
          </div>

          <div className="space-y-10 order-1 lg:order-2">
            <h2 className="text-4xl md:text-6xl font-black text-white italic leading-none uppercase">
              GARAGE STARTUP <br />
              <span className="text-[#A4F000]">GLOBAL MISSION.</span>
            </h2>
            <div className="space-y-6 text-white/50 text-lg leading-relaxed font-medium">
              <p>
                Founded in 2024, Deskify began as a tactical disruption. We believed that <span className="text-white font-bold italic tracking-wider">"INDUSTRIAL GRADE"</span> should be a human right, not a corporate luxury.
              </p>
              <p>
                Every component is subjected to 12 stages of neural verification. If it's not perfect, it doesn't exist in our catalog.
              </p>
            </div>
            <div className="pt-10 border-t border-white/5 grid grid-cols-2 gap-6">
              <div className="p-8 bg-white/5 rounded-[2rem] border border-white/5 hover:border-[#A4F000]/20 transition-all">
                <p className="text-3xl font-black text-[#A4F000] italic">01.</p>
                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mt-2">Vetted Nodes</p>
              </div>
              <div className="p-8 bg-white/5 rounded-[2rem] border border-white/5 hover:border-[#A4F000]/20 transition-all">
                <p className="text-3xl font-black text-[#A4F000] italic">02.</p>
                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mt-2">Bio-Packaging</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- MILESTONE TRACKER --- */}
      <section className="bg-black/20 py-24 md:py-44 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-20">
            <h2 className="text-4xl md:text-7xl font-black text-white italic uppercase tracking-tighter">MILESTONE <span className="text-[#A4F000]">LOGS</span></h2>
            <p className="text-white/30 font-black uppercase tracking-[0.4em] text-xs mt-4">Evolution of a New Standard</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {milestones.map((m, i) => (
              <div key={i} className="bg-[#004d47] p-10 rounded-[3rem] border border-white/5 hover:border-[#A4F000]/30 transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 text-white/5 font-black text-6xl group-hover:text-[#A4F000]/10 transition-colors">0{i+1}</div>
                <p className="text-[10px] font-black text-[#A4F000] uppercase mb-4 tracking-widest italic">{m.year}</p>
                <h4 className="text-xl font-black text-white mb-4 uppercase italic group-hover:translate-x-2 transition-transform">{m.title}</h4>
                <p className="text-sm text-white/40 leading-relaxed font-medium">{m.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- VALUES --- */}
      <section className="max-w-7xl mx-auto px-6 py-24 md:py-44">
        <div className="grid lg:grid-cols-3 gap-16">
          <div className="lg:col-span-1">
            <span className="text-[#A4F000] font-black uppercase tracking-[0.3em] text-[10px] italic">Core Directives</span>
            <h2 className="text-4xl md:text-6xl font-black text-white mt-4 mb-8 leading-none uppercase italic">WHAT WE <br /> <span className="text-[#A4F000]">STAND FOR</span></h2>
            <p className="text-white/40 text-lg font-medium">We advocate for the user in every neural decision we make.</p>
          </div>
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {values.map((v, i) => (
              <div key={i} className="p-10 rounded-[3rem] bg-white/5 border border-white/5 hover:border-[#A4F000]/20 hover:bg-white/[0.07] transition-all group">
                <div className="text-5xl mb-8 grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500">{v.icon}</div>
                <h3 className="text-2xl font-black text-white mb-3 italic uppercase leading-none">{v.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed font-medium tracking-tight">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA --- */}
      <section className="px-6 pb-24 md:pb-44">
        <div className="max-w-7xl mx-auto bg-[#A4F000] rounded-[4rem] p-12 md:p-32 text-center relative overflow-hidden shadow-[0_40px_100px_-20px_rgba(164,240,0,0.4)]">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-[120px]" />
          <h2 className="relative z-10 text-4xl md:text-8xl font-black text-[#003F3A] mb-12 tracking-tighter italic uppercase leading-none">
            READY TO JOIN THE <br />
            REVOLUTION?
          </h2>
          <Link href="/product" className="relative z-10 inline-flex items-center gap-4 bg-[#003F3A] text-white px-12 py-6 rounded-2xl font-black uppercase text-sm hover:scale-105 transition-all shadow-2xl">
            Initialize Link <FiArrowRight />
          </Link>
        </div>
      </section>
    </div>
  );
}

/* --- REUSABLE STAT CARD --- */
function StatCard({ icon, label, value, color }: any) {
  const isLime = color === "bg-[#A4F000]";
  return (
    <div className="bg-[#004d47] p-8 md:p-12 rounded-[3rem] border border-white/5 flex flex-col items-center text-center group hover:-translate-y-3 transition-all duration-500">
      <div className={`w-14 h-14 ${isLime ? "bg-[#A4F000] text-[#003F3A]" : "bg-white/5 text-white"} rounded-[1.5rem] flex items-center justify-center mb-6 shadow-2xl group-hover:rotate-12 transition-transform`}>
        {icon}
      </div>
      <p className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter">{value}</p>
      <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mt-3">{label}</p>
    </div>
  );
}

const milestones = [
  { year: "JAN 2024", title: "Inception", description: "Deskify nodes initialized with a mission for extreme durability." },
  { year: "JUN 2024", title: "Scale Phase", description: "Reached first 1,000 innovators via organic neural network growth." },
  { year: "FEB 2025", title: "Sector #1", description: "Ranked as most transparent tech retailer by Digital Commerce Hub." },
  { year: "CURRENT", title: "Expansion", description: "Deploying to 200+ global sectors with 3-day rapid delivery." },
];

const values = [
  { icon: "⚡", title: "Precision", description: "Verified specs. Every unit must exceed performance quotas." },
  { icon: "🛡️", title: "Secure", description: "Military-grade data protection protocols for all transactions." },
  { icon: "🌿", title: "Bio-Logic", description: "Zero-waste packaging without compromising unit integrity." },
  { icon: "💎", title: "True Value", description: "Cutting the middlemen to provide elite quality at node pricing." },
];