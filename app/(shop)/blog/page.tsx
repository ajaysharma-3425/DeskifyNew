"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FiCalendar, FiClock, FiArrowRight, FiSearch,
    FiX, FiShare2, FiBookmark, FiZap
} from "react-icons/fi";

// --- Updated Dummy Blog Data ---
const blogPosts = [
    {
        id: 1,
        title: "HOW TO DESIGN THE PERFECT MINIMALIST WORKSPACE",
        excerpt: "Discover the essential elements of a minimalist desk setup that boosts productivity and reduces stress...",
        content: "Minimalism isn't just about how things look; it's about how they function. To start, clear everything off your desk. Only put back what you use daily. Use cable management sleeves to hide wires. A single plant and a high-quality desk lamp are often all the decor you need. Focus on quality over quantity to create a space that breathes.",
        category: "Design",
        date: "Feb 24, 2026",
        readTime: "5 MIN READ",
        image: "https://images.unsplash.com/photo-1493932484895-752d1471eab5?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: 2,
        title: "5 ESSENTIAL TECH GADGETS FOR EVERY MODERN OFFICE",
        excerpt: "From wireless chargers to ergonomic mice, here are the top gadgets you need on your desk this year...",
        content: "The right tech can transform your workflow. 1. An ultra-wide monitor for multitasking. 2. A mechanical keyboard for tactile feedback. 3. Noise-canceling headphones to stay in the zone. 4. A wireless charging pad to keep your phone juiced. 5. A smart desk cup warmer to keep your coffee at the perfect 135°F all day long.",
        category: "Tech",
        date: "Feb 20, 2026",
        readTime: "8 MIN READ",
        image: "https://images.unsplash.com/photo-1491933382434-500287f9b54b?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: 3,
        title: "THE PSYCHOLOGY OF COLOR IN YOUR WORKSPACE",
        excerpt: "Did you know colors can directly impact your mood and productivity? Here's how to choose the right palette...",
        content: "Color plays a powerful role in how we feel and perform. Blue tones improve focus and calmness, while green enhances balance and reduces eye strain. Neutral colors like beige and white keep the environment distraction-free. Avoid overly bright reds or neon shades in work zones. Combine soft wall colors with natural wood textures and subtle desk accessories to create a workspace that energizes without overwhelming.",
        category: "Psychology",
        date: "Feb 18, 2026",
        readTime: "6 MIN READ",
        image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: 4,
        title: "DECLUTTER YOUR DESK: A 30-MINUTE RESET GUIDE",
        excerpt: "Feeling overwhelmed by clutter? Follow this quick 30-minute reset method to refresh your workspace instantly...",
        content: "Start by removing everything from your desk surface. Sort items into three piles: keep, relocate, and discard. Wipe down the surface and reorganize only the essentials—monitor, keyboard, mouse, and daily tools. Use drawer organizers and cable clips to maintain order. Finish by adding one inspiring element, like a plant or framed quote. A clean desk clears your mind and boosts efficiency instantly.",
        category: "Organization",
        date: "Feb 15, 2026",
        readTime: "4 MIN READ",
        image: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: 5,
        title: "ERGONOMICS 101: PROTECT YOUR POSTURE WHILE WORKING",
        excerpt: "Long hours at your desk shouldn't mean back pain. Learn how to set up an ergonomic workstation...",
        content: "An ergonomic workspace prevents strain and improves comfort. Keep your monitor at eye level and about an arm’s length away. Your chair should support your lower back, and your feet should rest flat on the floor. Use a wrist rest for typing and position your mouse close to your keyboard. Small adjustments like these can prevent long-term discomfort and help you stay productive throughout the day.",
        category: "Health",
        date: "Feb 12, 2026",
        readTime: "7 MIN READ",
        image: "https://images.unsplash.com/photo-1580894894513-541e068a3e2b?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: 6,
        title: "TOP 7 DESK ACCESSORIES THAT ELEVATE YOUR SETUP",
        excerpt: "Upgrade your desk aesthetic and functionality with these must-have accessories...",
        content: "1. A sleek desk organizer for stationery. 2. An adjustable laptop stand for better posture. 3. A modern desk lamp with adjustable brightness. 4. A cable management box to hide messy wires. 5. A soft desk mat for comfort and style. 6. A wireless charging dock for convenience. 7. A minimalist wall clock to stay on schedule. The right accessories combine function and design to create a workspace you’ll love spending time in.",
        category: "Aesthetics",
        date: "Feb 10, 2026",
        readTime: "6 MIN READ",
        image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800&auto=format&fit=crop"
    }
];

export default function BlogPage() {
    const [selectedPost, setSelectedPost] = useState<any | null>(null);

    return (
        <div className="min-h-screen bg-[#003F3A] pb-20 selection:bg-[#A4F000] selection:text-[#003F3A]">
            {/* --- Page Header --- */}
            <div className="relative pt-32 pb-24 overflow-hidden border-b border-white/5">
                <div className="absolute top-0 right-0 w-[40%] h-full bg-[#A4F000]/5 blur-[120px] rounded-full pointer-events-none" />

                <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-[#A4F000] rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-8"
                    >
                        <FiZap className="animate-pulse" /> Intelligence Hub
                    </motion.div>

                    <h1 className="text-6xl md:text-9xl font-black text-[#A4F000] tracking-tighter mb-10 italic uppercase leading-none">
                        DESKIFY <span className="text-transparent bg-clip-text bg-gradient-to-r from-white/20 to-white/5">JOURNAL</span>
                    </h1>

                    <div className="relative max-w-xl mx-auto group">
                        <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-[#A4F000] transition-colors" />
                        <input
                            type="text"
                            placeholder="Filter by intelligence topic..."
                            className="w-full pl-16 pr-8 py-6 bg-white/5 border border-white/10 rounded-[2rem] text-sm text-white focus:bg-white/10 focus:border-[#A4F000]/40 outline-none transition-all shadow-2xl placeholder:text-white/20"
                        />
                    </div>
                </div>
            </div>

            {/* --- Blog Grid --- */}
            <div className="max-w-7xl mx-auto px-6 mt-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {blogPosts.map((post, index) => (
                        <motion.article
                            key={post.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => setSelectedPost(post)}
                            className="group cursor-pointer flex flex-col"
                        >
                            <div className="relative h-80 w-full overflow-hidden rounded-[3rem] bg-black/20 mb-8 border border-white/5 p-2 transition-all group-hover:border-[#A4F000]/30">
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full h-full object-cover rounded-[2.5rem] grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105 opacity-60 group-hover:opacity-100"
                                />
                                <div className="absolute bottom-6 left-6">
                                    <span className="px-5 py-2 bg-[#A4F000] text-[#003F3A] text-[9px] font-black uppercase tracking-widest rounded-xl shadow-2xl">
                                        {post.category}
                                    </span>
                                </div>
                            </div>

                            <div className="px-2">
                                <div className="flex items-center gap-4 text-white/30 text-[10px] font-black uppercase tracking-widest mb-4 italic">
                                    <span className="flex items-center gap-1.5"><FiCalendar className="text-[#A4F000]" /> {post.date}</span>
                                    <span className="flex items-center gap-1.5"><FiClock className="text-[#A4F000]" /> {post.readTime}</span>
                                </div>
                                <h2 className="text-2xl font-black text-white leading-[1.1] mb-4 group-hover:text-[#A4F000] transition-colors uppercase italic tracking-tighter">
                                    {post.title}
                                </h2>
                                <p className="text-white/40 text-sm font-medium leading-relaxed mb-8 line-clamp-2">
                                    {post.excerpt}
                                </p>
                                <div className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-[#A4F000] border-b-2 border-[#A4F000]/0 group-hover:border-[#A4F000] pb-1 transition-all">
                                    Initialize Reading <FiArrowRight className="group-hover:translate-x-2 transition-transform" />
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </div>
            </div>

            {/* --- Immersive Story Modal --- */}
            {/* --- Immersive Story Modal --- */}
            <AnimatePresence>
                {selectedPost && (
                    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center">
                        {/* Backdrop - Mobile par zyada dark taaki focus content par rahe */}
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setSelectedPost(null)}
                            className="absolute inset-0 bg-[#001A18]/95 backdrop-blur-md"
                        />

                        <motion.div
                            initial={{ opacity: 0, y: "100%" }} // Mobile par niche se upar aayega
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="relative w-full md:max-w-5xl h-[92vh] md:h-[90vh] bg-[#003F3A] border-t md:border border-white/10 rounded-t-[3rem] md:rounded-[4rem] shadow-2xl overflow-hidden flex flex-col"
                        >
                            {/* --- Handlebar for Mobile (UX improvement) --- */}
                            <div className="md:hidden w-12 h-1.5 bg-white/10 rounded-full mx-auto mt-4 mb-2" />

                            {/* Close Button - Mobile par top-right fix */}
                            <button
                                onClick={() => setSelectedPost(null)}
                                className="absolute top-4 right-6 md:top-8 md:right-8 z-30 w-12 h-12 md:w-14 md:h-14 bg-[#A4F000] rounded-2xl flex items-center justify-center text-[#003F3A] shadow-2xl transition-all active:scale-90"
                            >
                                <FiX size={24} />
                            </button>

                            {/* Scrollable Content Area */}
                            <div className="overflow-y-auto flex-1 custom-scrollbar pb-10">

                                {/* Hero Image - Responsive Height */}
                                <div className="h-[250px] md:h-[550px] w-full relative">
                                    <img src={selectedPost.image} className="w-full h-full object-cover" alt="" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#003F3A] via-transparent to-transparent" />
                                </div>

                                {/* Article Body - Improved Mobile Padding */}
                                <div className="px-4 md:px-20 -mt-16 md:-mt-32 relative z-10">
                                    <div className="bg-[#004d47] p-6 md:p-20 rounded-[2.5rem] md:rounded-[3.5rem] border border-white/5">

                                        {/* Metadata */}
                                        <div className="flex flex-wrap items-center gap-3 text-[#A4F000] text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.4em] mb-6">
                                            <span className="px-2 py-1 bg-[#A4F000]/10 rounded-md">{selectedPost.category}</span>
                                            <span className="w-1 h-1 bg-white/20 rounded-full" />
                                            <span>{selectedPost.readTime}</span>
                                        </div>

                                        {/* Responsive Title */}
                                        <h2 className="text-2xl md:text-7xl font-black text-white leading-[1.2] md:leading-none mb-8 italic uppercase tracking-tighter">
                                            {selectedPost.title}
                                        </h2>

                                        {/* Author & Share */}
                                        <div className="flex items-center gap-4 mb-10 pb-10 border-b border-white/5">
                                            <div className="w-10 h-10 md:w-14 md:h-14 bg-[#A4F000] rounded-xl md:rounded-2xl flex items-center justify-center text-[#003F3A] font-black text-lg italic shadow-xl">D</div>
                                            <div className="flex-1">
                                                <p className="text-[10px] md:text-xs font-black text-white uppercase tracking-widest leading-none mb-1">Deskify Team</p>
                                                <p className="text-[8px] md:text-[10px] text-white/30 font-bold uppercase tracking-widest">{selectedPost.date}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button className="p-3 bg-white/5 rounded-xl text-white/40 hover:text-[#A4F000]"><FiShare2 size={18} /></button>
                                                <button className="p-3 bg-white/5 rounded-xl text-white/40 hover:text-[#A4F000]"><FiBookmark size={18} /></button>
                                            </div>
                                        </div>

                                        {/* Text Content - Optimized size for Mobile */}
                                        <div className="text-white/70 text-base md:text-2xl leading-relaxed font-medium space-y-6">
                                            <p className="first-letter:text-5xl md:first-letter:text-7xl first-letter:font-black first-letter:text-[#A4F000] first-letter:mr-3 first-letter:float-left first-letter:italic">
                                                {selectedPost.content}
                                            </p>
                                            <p className="text-sm md:text-xl">
                                                Optimal performance requires more than just high-tier hardware; it demands a strategic environment. Our research indicates that visual clarity can improve focus sessions significantly.
                                            </p>
                                        </div>

                                        {/* Mobile-Friendly Newsletter Box */}
                                        <div className="mt-12 p-6 md:p-10 bg-[#A4F000] rounded-[2rem] flex flex-col items-center text-center gap-4">
                                            <h4 className="text-[#003F3A] font-black text-lg md:text-xl italic uppercase tracking-tighter leading-tight">Join the Protocol</h4>
                                            <button className="w-full md:w-auto px-8 py-4 bg-[#003F3A] text-white rounded-xl font-black uppercase text-[10px] tracking-widest active:scale-95 transition-all shadow-xl">
                                                Subscribe
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}