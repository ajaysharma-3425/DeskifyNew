"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiChevronDown, 
  FiSearch, 
  FiHelpCircle, 
  FiTruck, 
  FiRefreshCw, 
  FiCreditCard,
  FiMessageSquare,
  FiMail
} from "react-icons/fi";

// --- FAQ Data ---
const faqData = [
  {
    category: "Logistics & Shipping",
    icon: <FiTruck />,
    questions: [
      { q: "How long does delivery take?", a: "Standard shipping takes 3-5 business days. Express delivery is available for select cities with 24-48 hour arrival." },
      { q: "Do you ship internationally?", a: "Currently, we only ship within India. We are planning to expand to international markets by late 2026." }
    ]
  },
  {
    category: "Orders & Returns",
    icon: <FiRefreshCw />,
    questions: [
      { q: "What is your return policy?", a: "We offer a 7-day hassle-free return policy for all unused items in their original packaging." },
      { q: "Can I cancel my order?", a: "Orders can be cancelled within 2 hours of placement via the 'My Orders' section in your profile." }
    ]
  },
  {
    category: "Secure Payments",
    icon: <FiCreditCard />,
    questions: [
      { q: "Which payment methods do you accept?", a: "We accept all major Credit/Debit cards, UPI (Google Pay, PhonePe), and Net Banking." },
      { q: "Is my payment information secure?", a: "Yes, we use 256-bit SSL encryption and a PCI-compliant payment gateway to ensure your data is 100% safe." }
    ]
  }
];

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeQuestion, setActiveQuestion] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#003F3A] pb-20 selection:bg-[#A4F000] selection:text-[#003F3A]">
      
      {/* Header Section */}
      <div className="relative pt-24 pb-20 md:pt-32 md:pb-28 overflow-hidden border-b border-white/5">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#A4F000]/10 rounded-full blur-[120px]" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-5 py-2 bg-white/5 border border-white/10 text-[#A4F000] rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-8 backdrop-blur-md"
          >
            <FiHelpCircle className="animate-pulse" /> Support Protocol v2.0
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-8 italic uppercase leading-none">
            HOW CAN WE <br /> <span className="text-[#A4F000]">HELP YOU?</span>
          </h1>
          
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto group">
            <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-[#A4F000] transition-colors size-5" />
            <input 
              type="text"
              placeholder="Search for answers (e.g. shipping, returns...)"
              className="w-full pl-16 pr-8 py-6 bg-white/5 border border-white/10 rounded-[2.5rem] text-sm font-medium text-white focus:bg-white/10 focus:ring-4 focus:ring-[#A4F000]/5 focus:border-[#A4F000]/50 outline-none transition-all shadow-2xl placeholder:text-white/20"
              onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
            />
          </div>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="max-w-3xl mx-auto px-6 mt-20 space-y-16">
        {faqData.map((section, sIdx) => {
          const filteredQuestions = section.questions.filter(
            item => item.q.toLowerCase().includes(searchTerm) || item.a.toLowerCase().includes(searchTerm)
          );

          if (filteredQuestions.length === 0) return null;

          return (
            <motion.div 
              key={sIdx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: sIdx * 0.1 }}
            >
              <div className="flex items-center gap-4 mb-8 px-2">
                <div className="p-3.5 bg-[#A4F000] text-[#003F3A] shadow-[0_10px_20px_-5px_rgba(164,240,0,0.4)] rounded-2xl">
                  {section.icon}
                </div>
                <div>
                  <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 leading-none mb-1">
                    Directives
                  </h2>
                  <p className="text-xl font-black text-white uppercase italic">{section.category}</p>
                </div>
              </div>

              <div className="grid gap-4">
                {filteredQuestions.map((item, qIdx) => (
                  <div 
                    key={qIdx}
                    className="group bg-white/5 border border-white/5 rounded-[2rem] overflow-hidden hover:border-[#A4F000]/30 transition-all duration-500 shadow-xl"
                  >
                    <button 
                      onClick={() => setActiveQuestion(activeQuestion === item.q ? null : item.q)}
                      className="w-full flex items-center justify-between p-7 text-left transition-all"
                    >
                      <span className="text-sm md:text-base font-bold text-white/80 group-hover:text-[#A4F000] transition-colors tracking-tight">
                        {item.q}
                      </span>
                      <motion.div
                        animate={{ rotate: activeQuestion === item.q ? 180 : 0, scale: activeQuestion === item.q ? 1.2 : 1 }}
                        className={`p-2 rounded-full ${activeQuestion === item.q ? 'bg-[#A4F000] text-[#003F3A]' : 'bg-white/5 text-white/30'}`}
                      >
                        <FiChevronDown size={18} />
                      </motion.div>
                    </button>

                    <AnimatePresence>
                      {activeQuestion === item.q && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4, ease: "circOut" }}
                        >
                          <div className="px-8 pb-8 text-sm md:text-base leading-relaxed text-white/50 font-medium border-t border-white/5 pt-4 mx-2">
                            {item.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}

        {/* Contact CTA */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="mt-28 p-12 md:p-20 bg-gradient-to-br from-[#A4F000] to-emerald-400 rounded-[4rem] text-center relative overflow-hidden shadow-[0_40px_100px_-20px_rgba(164,240,0,0.3)]"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-[80px] -mr-20 -mt-20" />
          <h3 className="text-3xl md:text-5xl font-black text-[#003F3A] mb-4 italic uppercase tracking-tighter">Still Unresolved?</h3>
          <p className="text-[#003F3A]/60 text-xs md:text-sm font-black uppercase tracking-[0.3em] mb-12">
            Our neural support team is active 24/7
          </p>
          <div className="flex flex-col md:flex-row gap-5 justify-center relative z-10">
            <button className="group flex items-center justify-center gap-3 px-10 py-5 bg-[#003F3A] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-2xl">
              <FiMessageSquare className="group-hover:rotate-12 transition-transform" /> Live Chat Now
            </button>
            <button className="group flex items-center justify-center gap-3 px-10 py-5 bg-white/20 text-[#003F3A] backdrop-blur-md border border-[#003F3A]/10 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/30 transition-all">
              <FiMail /> Dispatch Email
            </button>
          </div>
        </motion.div>

        {/* Footer Note */}
        <p className="text-center text-white/20 text-[10px] font-bold uppercase tracking-[0.5em] pt-10">
          End of Knowledge Base
        </p>
      </div>
    </div>
  );
}