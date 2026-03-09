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
  FiMessageSquare,
  FiArrowRight,
} from "react-icons/fi";

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
    if (!formData.name.trim()) newErrors.name = "Full name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.subject.trim()) newErrors.subject = "Please select or enter a subject";
    if (formData.message.trim().length < 10) newErrors.message = "Message must be at least 10 characters";

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
      // Simulated API Call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSubmitStatus({
        type: "success",
        message: "Message received! Our team will reach out within 2 hours.",
      });
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: "Server is temporarily busy. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 font-sans">
      {/* --- HERO SECTION --- */}
      <section className="relative pt-20 pb-32 overflow-hidden bg-[#0F172A]">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wider text-emerald-400 uppercase bg-emerald-400/10 rounded-full border border-emerald-400/20"
          >
            Contact Us
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight"
          >
            Let’s build something <span className="text-emerald-500">great.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed"
          >
            Have a project in mind or just want to say hi? We’re always open to discussing new projects, creative ideas or opportunities to be part of your visions.
          </motion.p>
        </div>
      </section>

      {/* --- MAIN CONTENT --- */}
      <section className="max-w-7xl mx-auto px-6 -mt-20 pb-24 relative z-20">
        <div className="grid lg:grid-cols-12 gap-8">

          {/* Left Column: Contact Methods */}
          <div className="lg:col-span-4 space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <ContactMethodCard
                icon={<FiMail size={24} />}
                title="Email Support"
                value="hello@deskify.com"
                description="Fast response within 2 business hours."
              />
              <ContactMethodCard
                icon={<FiPhone size={24} />}
                title="Direct Line"
                value="+1 (555) 000-1234"
                description="Available Mon-Fri, 9am - 6pm EST."
              />
              <ContactMethodCard
                icon={<FiMapPin size={24} />}
                title="Headquarters"
                value="New York, NY"
                description="123 Innovation Drive, Suite 500"
              />
            </div>

            {/* Support Box */}
            <div className="p-8 bg-emerald-600 rounded-3xl text-white shadow-xl shadow-emerald-200/50">
              <FiClock className="text-emerald-200 mb-4" size={32} />
              <h3 className="text-xl font-bold mb-2">Priority Support</h3>
              <p className="text-emerald-50/80 mb-6">Our dedicated support team is available 24/7 for our enterprise clients.</p>
              <button className="flex items-center font-semibold hover:gap-2 transition-all">
                Learn about Enterprise <FiArrowRight className="ml-2" />
              </button>
            </div>
          </div>

          {/* Right Column: Modern Form */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-8 bg-white rounded-[2rem] shadow-2xl shadow-slate-200/60 border border-slate-100 p-8 md:p-12"
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <InputField
                  label="Full Name"
                  name="name"
                  placeholder="Steve Rogers"
                  value={formData.name}
                  error={errors.name}
                  onChange={handleChange}
                />
                <InputField
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="steve@avengers.com"
                  value={formData.email}
                  error={errors.email}
                  onChange={handleChange}
                />
              </div>

              <InputField
                label="Subject"
                name="subject"
                placeholder="How can we help your business?"
                value={formData.subject}
                error={errors.subject}
                onChange={handleChange}
              />

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Message</label>
                <textarea
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className={`w-full px-5 py-4 rounded-2xl bg-slate-50 border transition-all resize-none focus:outline-none focus:ring-4 ${errors.message ? "border-red-500 focus:ring-red-100" : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-100"
                    }`}
                  placeholder="Describe your project goals..."
                />
                {errors.message && <span className="text-red-500 text-sm font-medium">{errors.message}</span>}
              </div>

              <AnimatePresence mode="wait">
                {submitStatus.type && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`p-4 rounded-xl flex items-center gap-3 ${submitStatus.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                      }`}
                  >
                    {submitStatus.type === "success" ? <FiCheckCircle /> : <FiAlertCircle />}
                    <span className="text-sm font-semibold">{submitStatus.message}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full md:w-max px-10 py-4 bg-[#0F172A] text-white font-bold rounded-2xl overflow-hidden transition-all hover:bg-slate-800 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isSubmitting ? "Processing..." : "Submit Inquiry"}
                  {!isSubmitting && <FiSend className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                </span>
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* --- MAP SECTION --- */}
      <section className="px-6 pb-20">
        <div className="max-w-7xl mx-auto rounded-[3rem] overflow-hidden border-8 border-white shadow-2xl h-[450px] grayscale hover:grayscale-0 transition-all duration-700">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d235527.9186156129!2d72.48730086445326!3d22.98682493959393!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e848aba5bd449%3A0x4fcedd11614f6516!2sAhmedabad%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </section>
    </div>
  );
}

/* --- REUSABLE SUB-COMPONENTS --- */

function ContactMethodCard({ icon, title, value, description }: any) {
  return (
    <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
      <div className="w-12 h-12 bg-slate-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
        {icon}
      </div>
      <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">{title}</h4>
      <p className="text-lg font-bold text-slate-900 mb-1">{value}</p>
      <p className="text-sm text-slate-500">{description}</p>
    </div>
  );
}

function InputField({ label, name, type = "text", placeholder, value, error, onChange }: any) {
  return (
    <div className="space-y-2 w-full">
      <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-5 py-4 rounded-2xl bg-slate-50 border transition-all focus:outline-none focus:ring-4 ${error ? "border-red-500 focus:ring-red-100" : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-100"
          }`}
      />
      {error && <p className="text-red-500 text-xs font-bold mt-1 ml-1">{error}</p>}
    </div>
  );
}