"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiChevronDown, 
  FiSearch, 
  FiHelpCircle, 
  FiTruck, 
  FiRefreshCw, 
  FiCreditCard 
} from "react-icons/fi";

// --- Dummy Data ---
const faqData = [
  {
    category: "Shipping",
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
    category: "Payments",
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
    <div className="min-h-screen bg-[#F9FAFB] pb-20">
      {/* Header Section */}
      <div className="bg-white border-b border-slate-100 pt-20 pb-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-[#10B981] rounded-full text-[10px] font-black uppercase tracking-widest mb-6"
          >
            <FiHelpCircle /> Help Center
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-6">
            How can we help you?
          </h1>
          
          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto">
            <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 size-5" />
            <input 
              type="text"
              placeholder="Search for questions (e.g. shipping, returns...)"
              className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-[2rem] text-sm font-medium focus:bg-white focus:ring-4 focus:ring-emerald-500/5 focus:border-[#10B981] outline-none transition-all shadow-sm"
              onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
            />
          </div>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="max-w-3xl mx-auto px-6 mt-16 space-y-12">
        {faqData.map((section, sIdx) => {
          // Filter questions based on search
          const filteredQuestions = section.questions.filter(
            item => item.q.toLowerCase().includes(searchTerm) || item.a.toLowerCase().includes(searchTerm)
          );

          if (filteredQuestions.length === 0) return null;

          return (
            <motion.div 
              key={sIdx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: sIdx * 0.1 }}
            >
              <div className="flex items-center gap-3 mb-6 px-2">
                <div className="p-2.5 bg-white shadow-sm border border-slate-100 rounded-xl text-[#10B981]">
                  {section.icon}
                </div>
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">
                  {section.category}
                </h2>
              </div>

              <div className="space-y-3">
                {filteredQuestions.map((item, qIdx) => (
                  <div 
                    key={qIdx}
                    className="bg-white border border-slate-100 rounded-[1.5rem] overflow-hidden hover:border-emerald-100 transition-colors"
                  >
                    <button 
                      onClick={() => setActiveQuestion(activeQuestion === item.q ? null : item.q)}
                      className="w-full flex items-center justify-between p-6 text-left group"
                    >
                      <span className="text-sm font-bold text-slate-700 group-hover:text-slate-900 transition-colors">
                        {item.q}
                      </span>
                      <motion.div
                        animate={{ rotate: activeQuestion === item.q ? 180 : 0 }}
                        className={`text-slate-300 ${activeQuestion === item.q ? 'text-[#10B981]' : ''}`}
                      >
                        <FiChevronDown size={20} />
                      </motion.div>
                    </button>

                    <AnimatePresence>
                      {activeQuestion === item.q && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                        >
                          <div className="px-6 pb-6 text-sm leading-relaxed text-slate-500 font-medium">
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
        <div className="mt-20 p-8 bg-slate-900 rounded-[2.5rem] text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-bl-full -mr-10 -mt-10" />
          <h3 className="text-xl font-black text-white mb-2">Still have questions?</h3>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-8">
            Our support team is online 24/7
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-[#10B981] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all">
              Live Chat Now
            </button>
            <button className="px-8 py-4 bg-white/5 text-white border border-white/10 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">
              Email Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}