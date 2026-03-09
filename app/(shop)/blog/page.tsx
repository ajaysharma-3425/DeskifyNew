"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FiCalendar, FiClock, FiArrowRight, FiSearch,
    FiX, FiShare2, FiBookmark
} from "react-icons/fi";

// --- Updated Dummy Blog Data with Full Content ---
const blogPosts = [
    {
        id: 1,
        title: "How to Design the Perfect Minimalist Workspace",
        excerpt: "Discover the essential elements of a minimalist desk setup that boosts productivity and reduces stress...",
        content: "Minimalism isn't just about how things look; it's about how they function. To start, clear everything off your desk. Only put back what you use daily. Use cable management sleeves to hide wires. A single plant and a high-quality desk lamp are often all the decor you need. Focus on quality over quantity to create a space that breathes.",
        category: "Design",
        date: "Feb 24, 2026",
        readTime: "5 min read",
        image: "https://images.unsplash.com/photo-1493932484895-752d1471eab5?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: 2,
        title: "5 Essential Tech Gadgets for Every Modern Office",
        excerpt: "From wireless chargers to ergonomic mice, here are the top gadgets you need on your desk this year...",
        content: "The right tech can transform your workflow. 1. An ultra-wide monitor for multitasking. 2. A mechanical keyboard for tactile feedback. 3. Noise-canceling headphones to stay in the zone. 4. A wireless charging pad to keep your phone juiced. 5. A smart desk cup warmer to keep your coffee at the perfect 135°F all day long.",
        category: "Tech",
        date: "Feb 20, 2026",
        readTime: "8 min read",
        image: "https://images.unsplash.com/photo-1491933382434-500287f9b54b?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: 3,
        title: "The Psychology of Color in Your Workspace",
        excerpt: "Did you know colors can directly impact your mood and productivity? Here's how to choose the right palette...",
        content: "Color plays a powerful role in how we feel and perform. Blue tones improve focus and calmness, while green enhances balance and reduces eye strain. Neutral colors like beige and white keep the environment distraction-free. Avoid overly bright reds or neon shades in work zones. Combine soft wall colors with natural wood textures and subtle desk accessories to create a workspace that energizes without overwhelming.",
        category: "Productivity",
        date: "Feb 18, 2026",
        readTime: "6 min read",
        image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: 4,
        title: "Declutter Your Desk: A 30-Minute Reset Guide",
        excerpt: "Feeling overwhelmed by clutter? Follow this quick 30-minute reset method to refresh your workspace instantly...",
        content: "Start by removing everything from your desk surface. Sort items into three piles: keep, relocate, and discard. Wipe down the surface and reorganize only the essentials—monitor, keyboard, mouse, and daily tools. Use drawer organizers and cable clips to maintain order. Finish by adding one inspiring element, like a plant or framed quote. A clean desk clears your mind and boosts efficiency instantly.",
        category: "Organization",
        date: "Feb 15, 2026",
        readTime: "4 min read",
        image: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: 5,
        title: "Ergonomics 101: Protect Your Posture While You Work",
        excerpt: "Long hours at your desk shouldn't mean back pain. Learn how to set up an ergonomic workstation...",
        content: "An ergonomic workspace prevents strain and improves comfort. Keep your monitor at eye level and about an arm’s length away. Your chair should support your lower back, and your feet should rest flat on the floor. Use a wrist rest for typing and position your mouse close to your keyboard. Small adjustments like these can prevent long-term discomfort and help you stay productive throughout the day.",
        category: "Health",
        date: "Feb 12, 2026",
        readTime: "7 min read",
        image: "https://images.unsplash.com/photo-1580894894513-541e068a3e2b?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: 6,
        title: "Top 7 Desk Accessories That Elevate Your Setup",
        excerpt: "Upgrade your desk aesthetic and functionality with these must-have accessories...",
        content: "1. A sleek desk organizer for stationery. 2. An adjustable laptop stand for better posture. 3. A modern desk lamp with adjustable brightness. 4. A cable management box to hide messy wires. 5. A soft desk mat for comfort and style. 6. A wireless charging dock for convenience. 7. A minimalist wall clock to stay on schedule. The right accessories combine function and design to create a workspace you’ll love spending time in.",
        category: "Accessories",
        date: "Feb 10, 2026",
        readTime: "6 min read",
        image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800&auto=format&fit=crop"
    }
    // ... other posts follow the same structure
];

export default function BlogPage() {
    const [selectedPost, setSelectedPost] = useState<any | null>(null);

    return (
        <div className="min-h-screen bg-[#F9FAFB] pb-20">
            {/* --- Page Header --- */}
            <div className="bg-white border-b border-slate-100 pt-20 pb-16">
                <div className="max-w-6xl mx-auto px-6 text-center">
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[#10B981] text-[10px] font-black uppercase tracking-[0.4em] mb-4">
                        Latest Updates
                    </motion.p>
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-8">
                        Deskify <span className="text-slate-300">Journal</span>
                    </h1>

                    <div className="relative max-w-lg mx-auto">
                        <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="text" placeholder="Search articles..." className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:bg-white focus:border-[#10B981] outline-none transition-all shadow-sm" />
                    </div>
                </div>
            </div>

            {/* --- Blog Grid --- */}
            <div className="max-w-6xl mx-auto px-6 mt-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogPosts.map((post, index) => (
                        <motion.article
                            key={post.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => setSelectedPost(post)} // Open Modal
                            className="group cursor-pointer bg-white p-4 rounded-[2.5rem] border border-transparent hover:border-slate-100 hover:shadow-xl transition-all duration-500"
                        >
                            <div className="relative h-60 w-full overflow-hidden rounded-[2rem] bg-slate-200 mb-6 shadow-sm">
                                <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                <div className="absolute top-4 left-4">
                                    <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md text-slate-900 text-[9px] font-black uppercase tracking-widest rounded-full shadow-sm">
                                        {post.category}
                                    </span>
                                </div>
                            </div>

                            <div className="px-2 pb-2">
                                <div className="flex items-center gap-4 text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-3">
                                    <span className="flex items-center gap-1.5"><FiCalendar className="text-[#10B981]" /> {post.date}</span>
                                    <span className="flex items-center gap-1.5"><FiClock className="text-[#10B981]" /> {post.readTime}</span>
                                </div>
                                <h2 className="text-xl font-black text-slate-900 leading-tight mb-3 group-hover:text-[#10B981] transition-colors">{post.title}</h2>
                                <p className="text-slate-500 text-sm font-medium leading-relaxed mb-6 line-clamp-2">{post.excerpt}</p>
                                <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#10B981] group-hover:gap-4 transition-all">
                                    Read Story <FiArrowRight />
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </div>
            </div>

            {/* --- Immersive Story Modal --- */}
            <AnimatePresence>
                {selectedPost && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setSelectedPost(null)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                        />

                        {/* Modal Content */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col"
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setSelectedPost(null)}
                                className="absolute top-6 right-6 z-10 w-12 h-12 bg-white/20 hover:bg-white backdrop-blur-md rounded-full flex items-center justify-center text-slate-900 shadow-lg transition-all"
                            >
                                <FiX size={20} />
                            </button>

                            <div className="overflow-y-auto custom-scrollbar">
                                {/* Hero Image */}
                                <div className="h-[300px] md:h-[400px] w-full relative">
                                    <img src={selectedPost.image} className="w-full h-full object-cover" alt="" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                                </div>

                                {/* Article Body */}
                                <div className="px-8 md:px-16 pb-16 -mt-20 relative">
                                    <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-slate-50">
                                        <div className="flex items-center gap-4 text-[#10B981] text-[10px] font-black uppercase tracking-widest mb-6">
                                            <span>{selectedPost.category}</span>
                                            <span className="w-1 h-1 bg-slate-200 rounded-full" />
                                            <span>{selectedPost.readTime}</span>
                                        </div>

                                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight mb-8">
                                            {selectedPost.title}
                                        </h2>

                                        <div className="flex items-center gap-4 mb-10 pb-10 border-b border-slate-100">
                                            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold">D</div>
                                            <div>
                                                <p className="text-xs font-black text-slate-900 uppercase tracking-widest">Deskify Team</p>
                                                <p className="text-[10px] text-slate-400 font-bold">{selectedPost.date}</p>
                                            </div>
                                            <div className="ml-auto flex gap-2">
                                                <button className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:text-emerald-500 transition-colors"><FiShare2 size={16} /></button>
                                                <button className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:text-emerald-500 transition-colors"><FiBookmark size={16} /></button>
                                            </div>
                                        </div>

                                        <p className="text-slate-600 text-lg leading-relaxed font-medium first-letter:text-5xl first-letter:font-black first-letter:text-slate-900 first-letter:mr-3 first-letter:float-left">
                                            {selectedPost.content}
                                        </p>

                                        {/* Placeholder for more content to show scrolling */}
                                        <p className="mt-6 text-slate-600 text-lg leading-relaxed font-medium">
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                        </p>
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