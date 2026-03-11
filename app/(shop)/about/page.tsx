"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { 
  FiTruck, FiShield, FiHeadphones, FiRefreshCw, 
  FiAward, FiUsers, FiPackage, FiClock, FiArrowRight, FiTarget, FiHeart 
} from "react-icons/fi";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900 overflow-x-hidden">
      
      {/* --- PREMIUM HERO SECTION --- */}
      <section className="relative pt-28 pb-16 md:pt-48 md:pb-32 overflow-hidden bg-[#0F172A]">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 mb-6"
            >
              <div className="h-px w-8 bg-emerald-500" />
              <span className="text-emerald-400 font-bold tracking-[0.2em] uppercase text-[10px] md:text-xs">Since 2024</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl sm:text-6xl md:text-8xl font-black text-white mb-6 md:mb-8 tracking-tighter leading-[1.1] md:leading-[0.9]"
            >
              WE REDEFINE <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">EXCELLENCE.</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-base md:text-2xl text-slate-400 max-w-2xl leading-relaxed mb-10"
            >
              Deskify isn’t just an e-commerce platform. We are an ecosystem of quality, bridging the gap between premium engineering and everyday accessibility.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row flex-wrap gap-4"
            >
              <Link href="/product" className="group flex items-center justify-center gap-3 bg-emerald-500 hover:bg-emerald-400 text-slate-900 px-8 py-4 rounded-2xl font-bold transition-all hover:scale-105">
                Explore Tech <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <div className="flex items-center gap-4 px-6 py-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                <div className="flex -space-x-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-[#0F172A] bg-slate-700" />
                  ))}
                </div>
                <span className="text-white text-xs md:text-sm font-medium">Trusted by 10k+ innovators</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- BENTO GRID STATS --- */}
      <section className="max-w-7xl mx-auto px-6 -mt-10 md:-mt-16 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={<FiUsers />} label="Active Users" value="10k+" color="bg-emerald-500" />
          <StatCard icon={<FiPackage />} label="Premium Products" value="500+" color="bg-blue-500" />
          <StatCard icon={<FiTarget />} label="Accuracy Rate" value="99.9%" color="bg-purple-500" />
          <StatCard icon={<FiClock />} label="Fast Delivery" value="3 Days" color="bg-orange-500" />
        </div>
      </section>

      {/* --- OUR STORY --- */}
      <section className="max-w-7xl mx-auto px-6 py-20 md:py-32">
        <div className="grid lg:grid-cols-2 gap-12 md:gap-20 items-center">
          <div className="relative order-2 lg:order-1">
            <div className="absolute -top-6 -left-6 md:-top-10 md:-left-10 w-24 h-24 md:w-32 md:h-32 bg-emerald-100 rounded-full z-0" />
            <div className="relative z-10 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl border-[6px] md:border-[12px] border-white">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
                alt="Office"
                className="w-full h-[300px] md:h-[500px] object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
            <motion.div 
              whileHover={{ rotate: 5 }}
              className="z-10 absolute -bottom-6 -right-2 md:-bottom-8 md:-right-8 bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-xl border border-slate-100 flex items-center gap-3 md:gap-4"
            >
              <div className="w-10 h-10 md:w-14 md:h-14 bg-emerald-500 rounded-xl md:rounded-2xl flex items-center justify-center text-white">
                <FiAward size={20} className="md:w-7 md:h-7" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Excellence</p>
                <p className="text-sm md:text-lg font-black text-slate-900">Award 2025</p>
              </div>
            </motion.div>
          </div>

          <div className="space-y-6 md:space-y-8 order-1 lg:order-2">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">
              FROM A GARAGE <br />
              <span className="text-emerald-500 uppercase">to a global mission.</span>
            </h2>
            <div className="space-y-4 text-slate-600 text-base md:text-lg leading-relaxed">
              <p>
                Founded in 2024, Deskify began as a disruption to the overpriced electronics market. We believed that <strong>"Industrial Grade"</strong> should be a standard, not a luxury.
              </p>
              <p>
                Every product in our catalog undergoes 12 stages of quality verification before it reaches your door.
              </p>
            </div>
            <div className="pt-6 border-t border-slate-100 grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl text-center lg:text-left">
                <p className="text-xl md:text-2xl font-black text-slate-900">01.</p>
                <p className="text-[10px] md:text-sm font-bold text-slate-400 uppercase">Handpicked Vendors</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl text-center lg:text-left">
                <p className="text-xl md:text-2xl font-black text-slate-900">02.</p>
                <p className="text-[10px] md:text-sm font-bold text-slate-400 uppercase">Eco-Packaging</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- MILESTONE TRACKER --- */}
      <section className="bg-slate-50 py-20 md:py-32 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">MILESTONE TRACKER</h2>
            <p className="text-slate-500 font-medium text-sm md:text-base">Evolution of a New Standard</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {milestones.map((m, i) => (
              <div key={i} className="bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all group">
                <span className="text-emerald-500 font-black text-xl mb-4 block">0{i+1}</span>
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">{m.year}</p>
                <h4 className="text-lg md:text-xl font-bold text-slate-900 mb-3 group-hover:text-emerald-600 transition-colors">{m.title}</h4>
                <p className="text-sm text-slate-500 leading-relaxed">{m.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- VALUES --- */}
      <section className="max-w-7xl mx-auto px-6 py-20 md:py-32">
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-1 text-center lg:text-left">
            <span className="text-emerald-500 font-bold uppercase tracking-widest text-xs">Core Philosophy</span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mt-4 mb-6 leading-tight">WHAT WE STAND FOR</h2>
            <p className="text-slate-500 text-base md:text-lg">We don't just sell; we advocate for the end user in every decision.</p>
          </div>
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            {values.map((v, i) => (
              <div key={i} className="p-6 md:p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:border-emerald-200 transition-all group">
                <div className="text-3xl md:text-4xl mb-6 group-hover:scale-110 transition-transform inline-block">{v.icon}</div>
                <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-2">{v.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA --- */}
      <section className="px-6 pb-20 md:pb-24">
        <div className="max-w-7xl mx-auto bg-[#0F172A] rounded-[2rem] md:rounded-[3rem] p-10 md:p-24 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 md:w-64 md:h-64 bg-emerald-500/20 rounded-full blur-[80px] md:blur-[100px]" />
          <h2 className="relative z-10 text-3xl md:text-6xl font-black text-white mb-8 tracking-tighter">
            READY TO JOIN THE <br className="hidden md:block" />
            <span className="text-emerald-400 italic">REVOLUTION?</span>
          </h2>
          <Link href="/product" className="relative z-10 inline-flex items-center gap-3 bg-white text-slate-900 px-8 py-4 md:px-10 md:py-5 rounded-full font-bold text-base md:text-lg hover:bg-emerald-400 hover:scale-105 transition-all">
            Start Shopping Now <FiArrowRight />
          </Link>
        </div>
      </section>
    </div>
  );
}

/* --- REUSABLE STAT CARD --- */
function StatCard({ icon, label, value, color }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl md:rounded-3xl shadow-lg border border-slate-100 flex flex-col items-center text-center group hover:-translate-y-2 transition-all">
      <div className={`w-10 h-10 md:w-12 md:h-12 ${color} text-white rounded-xl md:rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
        {icon}
      </div>
      <p className="text-xl md:text-3xl font-black text-slate-900">{value}</p>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{label}</p>
    </div>
  );
}

const milestones = [
  { year: "JAN 2024", title: "Inception", description: "Deskify was founded with a mission to bring durability back to e-commerce." },
  { year: "JUN 2024", title: "1k Growth", description: "Reached our first 1,000 users purely through word-of-mouth growth." },
  { year: "FEB 2025", title: "Voted #1", description: "Awarded 'Most Transparent Retailer' by the Digital Commerce Union." },
  { year: "PRESENT", title: "Expansion", description: "Now shipping to over 200 cities with an average 3-day delivery time." },
];

const values = [
  { icon: "⚡", title: "Precision", description: "Every product is verified for exact specs and performance before listing." },
  { icon: "🛡️", title: "Security", description: "Your data and payments are protected by military-grade encryption." },
  { icon: "🌿", title: "Eco-Logic", description: "Our packaging is 100% biodegradable without compromising safety." },
  { icon: "💎", title: "Value", description: "We cut the middleman to provide enterprise quality at consumer prices." },
];