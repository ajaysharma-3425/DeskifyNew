"use client";

import Link from "next/link";
import Image from "next/image";
import {
  FiFacebook,
  FiTwitter,
  FiInstagram,
  FiGithub,
  FiMail,
  FiPhone,
  FiMapPin,
  FiChevronRight,
} from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="bg-[#0B1120] border-t border-white/5">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center space-x-2">
              <div className="relative w-8 h-8 sm:w-9 sm:h-9">
                <Image
                  src="/Logo.png"
                  alt="Deskify"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <span className="text-xl md:text-2xl font-bold">
                <span className="text-emerald-400">Des</span>
                <span className="text-white">kify</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Curated premium products for the modern lifestyle. Quality,
              elegance, and innovation – delivered to your doorstep.
            </p>
            <div className="flex gap-3">
              <SocialIcon href="https://facebook.com" icon={<FiFacebook />} />
              <SocialIcon href="https://twitter.com" icon={<FiTwitter />} />
              <SocialIcon href="https://instagram.com" icon={<FiInstagram />} />
              <SocialIcon href="https://github.com" icon={<FiGithub />} />
            </div>
          </div>

          {/* Quick Links (based on navbar) */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-5">
              Quick Shop
            </h3>
            <ul className="space-y-3">
              <FooterLink href="/" label="Home" />
              <FooterLink href="/product" label="Shop" />
              <FooterLink href="/popular" label="Popular" />
              <FooterLink href="/my-contact" label="Contact" />
            </ul>
          </div>

          {/* Information (pages & blogs) */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-5">
              Information
            </h3>
            <ul className="space-y-3">
              <FooterLink href="/about" label="About Us" />
              <FooterLink href="/faq" label="FAQ" />
              <FooterLink href="/blog" label="Blog" />
              <FooterLink href="/blog/tips" label="Shopping Tips" />
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-5">
              Get in Touch
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-slate-400 text-sm">
                <FiMapPin className="text-emerald-400 mt-1 flex-shrink-0" />
                <span>123 Design Street, Creative Valley, India – 400001</span>
              </li>
              <li className="flex items-center gap-3 text-slate-400 text-sm">
                <FiPhone className="text-emerald-400 flex-shrink-0" />
                <a href="tel:+919876543210" className="hover:text-emerald-400 transition">
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-center gap-3 text-slate-400 text-sm">
                <FiMail className="text-emerald-400 flex-shrink-0" />
                <a href="mailto:support@deskify.com" className="hover:text-emerald-400 transition">
                  support@deskify.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-500 text-xs font-medium">
          <p>© 2026 Deskify. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-emerald-400 transition">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-emerald-400 transition">
              Terms of Service
            </Link>
            <Link href="/cookies" className="hover:text-emerald-400 transition">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Reusable social icon component
function SocialIcon({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-emerald-500 hover:text-white transition-all duration-300"
    >
      {icon}
    </Link>
  );
}

// Reusable footer link with arrow on hover
function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <li>
      <Link
        href={href}
        className="group flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition-colors text-sm"
      >
        <FiChevronRight className="text-emerald-400/0 group-hover:text-emerald-400 transition-all text-sm" />
        {label}
      </Link>
    </li>
  );
}