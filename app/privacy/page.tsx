"use client";
import { motion } from "framer-motion";
import { FiShield, FiLock, FiEye, FiUserCheck } from "react-icons/fi";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#FDFDFD] pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold tracking-widest uppercase mb-4">
            <FiShield /> Security Protocol
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter">
            PRIVACY <span className="text-emerald-500 italic">POLICY</span>
          </h1>
          <p className="mt-6 text-slate-500 font-medium">Last Updated: March 2026</p>
        </motion.div>

        <div className="space-y-12">
          <PolicySection 
            icon={<FiLock className="text-emerald-500" />}
            title="Data Protection"
            content="At Deskify, we prioritize your data security. We use industry-standard encryption to protect your personal information during transmission and storage."
          />
          <PolicySection 
            icon={<FiEye className="text-emerald-500" />}
            title="Information Collection"
            content="We collect only necessary information such as your name, email, and shipping address to provide a seamless shopping experience. We never sell your data to third parties."
          />
          <PolicySection 
            icon={<FiUserCheck className="text-emerald-500" />}
            title="Your Rights"
            content="You have the right to access, correct, or delete your personal data at any time. Simply contact our support team to initiate a data request."
          />
        </div>
      </div>
    </div>
  );
}

function PolicySection({ icon, title, content }: { icon: any; title: string; content: string }) {
  return (
    <motion.section 
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50"
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 bg-slate-50 rounded-2xl">{icon}</div>
        <h3 className="text-xl font-bold text-slate-900">{title}</h3>
      </div>
      <p className="text-slate-600 leading-relaxed font-medium">{content}</p>
    </motion.section>
  );
}