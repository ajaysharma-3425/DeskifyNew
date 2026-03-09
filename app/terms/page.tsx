"use client";
import { motion } from "framer-motion";
import { FiFileText, FiTruck, FiRefreshCw, FiAlertCircle } from "react-icons/fi";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#FDFDFD] pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-xs font-bold tracking-widest uppercase mb-4">
            <FiFileText /> Agreement
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter">
            TERMS OF <span className="text-blue-500 italic">SERVICE</span>
          </h1>
        </motion.div>

        <div className="grid gap-8">
          <TermsCard 
            title="1. Order Acceptance"
            desc="Deskify reserves the right to refuse or cancel any order for reasons including stock availability or errors in pricing."
          />
          <TermsCard 
            title="2. Shipping & Delivery"
            desc="Delivery timelines are estimates. We are not responsible for delays caused by logistics partners or customs clearance."
          />
          <TermsCard 
            title="3. Return Policy"
            desc="Items must be returned in original packaging within 7 days of delivery. Used or damaged items are not eligible for refund."
          />
        </div>
      </div>
    </div>
  );
}

function TermsCard({ title, desc }: { title: string; desc: string }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.01 }}
      className="p-8 bg-white rounded-[2rem] border border-slate-100 hover:border-blue-200 transition-all shadow-sm"
    >
      <h3 className="text-lg font-black text-slate-900 mb-3 uppercase tracking-tight">{title}</h3>
      <p className="text-slate-500 font-medium leading-relaxed italic">"{desc}"</p>
    </motion.div>
  );
}