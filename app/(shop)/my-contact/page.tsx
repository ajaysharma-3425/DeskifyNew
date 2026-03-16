// app/contact/page.tsx
"use client";

import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiSend,
  FiCheckCircle,
  FiAlertCircle,
  FiClock,
  FiArrowRight,
  FiChevronLeft,
} from "react-icons/fi";
import Link from "next/link";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = "Protocol requires a name";
    if (!formData.email.trim()) {
      newErrors.email = "Email identity is missing";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (formData.message.trim().length < 10) newErrors.message = "Message too brief (min 10 chars)";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSubmitStatus({
        type: "success",
        message: "Inquiry uplink successful. Response estimated within 2 hours.",
      });
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: "Uplink failed. System busy, try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#003F3A] text-white selection:bg-[#A4F000] selection:text-[#003F3A]">
      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-44 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#A4F000]/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <Link href="/" className="text-[#A4F000] text-xs font-black uppercase tracking-[0.3em] flex items-center gap-2 mb-12 hover:translate-x-[-4px] transition-transform w-fit">
            <FiChevronLeft /> Return to Hub
          </Link>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-black mb-8 tracking-tighter italic uppercase leading-none"
          >
            GET IN <span className="text-[#A4F000]">TOUCH</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/40 text-sm md:text-base font-black uppercase tracking-[0.2em] max-w-2xl leading-relaxed"
          >
            Have a project in mind? Our neural network is ready to assist. 
            Initiate connection for creative inquiries or business logistics.
          </motion.p>
        </div>
      </section>

      {/* --- MAIN CONTENT --- */}
      <section className="max-w-7xl mx-auto px-6 -mt-24 pb-24 relative z-10">
        <div className="grid lg:grid-cols-12 gap-10">

          {/* Left Column: Contact Methods */}
          <div className="lg:col-span-4 space-y-6">
            <div className="grid grid-cols-1 gap-4 ">
              <ContactMethodCard
                icon={<FiMail size={20} />}
                title="Secure Uplink"
                value="hello@deskify.com"
                description="Protocol response: 2 Hours"

              />
              <ContactMethodCard
                icon={<FiPhone size={20} />}
                title="Direct Comms"
                value="+91 7990083154 DESKIFY"
                description="Mon-Fri | 09:00 - 18:00"
              />
              <ContactMethodCard
                icon={<FiMapPin size={20} />}
                title="Base Station"
                value="Ahmedabad, AH"
                description="123 Innovation Dr. Suite 500"
              />
            </div>

            {/* Support Box */}
            <div className="p-10 bg-[#A4F000] rounded-[3rem] text-[#003F3A] shadow-[0_20px_50px_-10px_rgba(164,240,0,0.3)] group cursor-pointer overflow-hidden relative">
              <div className="relative z-10">
                <FiClock className="mb-6 group-hover:rotate-12 transition-transform duration-500" size={40} />
                <h3 className="text-2xl font-black uppercase italic leading-none mb-3">Priority Support</h3>
                <p className="text-[#003F3A]/60 text-xs font-black uppercase tracking-tight mb-8">24/7 Enterprise connection active for elite partners.</p>
                <button className="flex items-center text-[10px] font-black uppercase tracking-[0.2em] group-hover:gap-4 transition-all">
                  Partner Protocol <FiArrowRight className="ml-2" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-8 bg-[#004d47] rounded-[4rem] border border-white/5 p-8 md:p-16 shadow-2xl"
          >
            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="grid md:grid-cols-2 gap-10">
                <InputField
                  label="Full Name"
                  name="name"
                  placeholder="IDENTIFY YOURSELF"
                  value={formData.name}
                  error={errors.name}
                  onChange={handleChange}
                />
                <InputField
                  label="Email Identity"
                  name="email"
                  type="email"
                  placeholder="USER@DOMAIN.COM"
                  value={formData.email}
                  error={errors.email}
                  onChange={handleChange}
                />
              </div>

              <InputField
                label="Transmission Subject"
                name="subject"
                placeholder="WHAT IS THE NATURE OF YOUR INQUIRY?"
                value={formData.subject}
                error={errors.subject}
                onChange={handleChange}
              />

              <div className="space-y-4">
                <label className="text-[10px] font-black text-[#A4F000] uppercase tracking-[0.3em] ml-2">Detailed Message</label>
                <textarea
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className={`w-full px-8 py-6 rounded-[2rem] bg-[#003F3A] border transition-all resize-none focus:outline-none focus:ring-4 ${
                    errors.message ? "border-rose-500/50 focus:ring-rose-500/10" : "border-white/5 focus:border-[#A4F000] focus:ring-[#A4F000]/5"
                  } text-white font-medium placeholder:text-white/10`}
                  placeholder="DESCRIBE YOUR PROJECT GOALS..."
                />
                {errors.message && <span className="text-rose-500 text-[10px] font-black uppercase tracking-widest ml-2">{errors.message}</span>}
              </div>

              <AnimatePresence mode="wait">
                {submitStatus.type && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className={`p-6 rounded-2xl flex items-center gap-4 ${
                      submitStatus.type === "success" ? "bg-[#A4F000]/10 text-[#A4F000] border border-[#A4F000]/20" : "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                    }`}
                  >
                    {submitStatus.type === "success" ? <FiCheckCircle size={20} /> : <FiAlertCircle size={20} />}
                    <span className="text-[10px] font-black uppercase tracking-widest">{submitStatus.message}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={isSubmitting}
                className="group w-full md:w-max px-12 py-6 bg-[#A4F000] text-[#003F3A] font-black uppercase text-xs tracking-[0.2em] rounded-2xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50 shadow-[0_15px_30px_-10px_rgba(164,240,0,0.2)] flex items-center justify-center gap-4"
              >
                {isSubmitting ? "Processing..." : "Submit Inquiry"}
                {!isSubmitting && <FiSend className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* --- MAP SECTION --- */}
      <section className="px-6 pb-24">
        <div className="max-w-7xl mx-auto rounded-[4rem] overflow-hidden border border-white/5 shadow-2xl h-[500px] grayscale brightness-50 contrast-125 hover:grayscale-0 hover:brightness-100 transition-all duration-1000">
          <iframe
             src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d235527.9186156129!2d72.48730086445326!3d22.98682493959393!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e848aba5bd449%3A0x4fcedd11614f6516!2sAhmedabad%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>
      </section>
    </div>
  );
}

/* --- REUSABLE SUB-COMPONENTS --- */

function ContactMethodCard({ icon, title, value, description }: any) {
  return (
    <div className="p-8 bg-[#004d47] rounded-[2.5rem] border border-white/5 shadow-xl group hover:border-[#A4F000]/30 transition-all duration-500">
      <div className="w-14 h-14 bg-[#003F3A] text-[#A4F000] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h4 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-2">{title}</h4>
      <p className="text-xl font-bold text-[#A4F000] mb-2 italic uppercase leading-none">{value}</p>
      <p className="text-[10px] font-black text-white/40 uppercase tracking-tighter">{description}</p>
    </div>
  );
}

function InputField({ label, name, type = "text", placeholder, value, error, onChange }: any) {
  return (
    <div className="space-y-4 w-full">
      <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-2">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-8 py-5 rounded-2xl bg-[#003F3A] border transition-all focus:outline-none focus:ring-4 ${
          error ? "border-rose-500/50 focus:ring-rose-500/10" : "border-white/5 focus:border-[#A4F000] focus:ring-[#A4F000]/5"
        } text-white font-medium placeholder:text-white/10`}
      />
      {error && <p className="text-rose-500 text-[10px] font-black uppercase tracking-widest mt-2 ml-2">{error}</p>}
    </div>
  );
}