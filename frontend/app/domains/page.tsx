"use client";

import { useState } from "react";
import Link from "next/link";
import { DOMAIN_TOOLKITS, DOMAIN_CATEGORIES } from "@/constants/domains";
import { motion, AnimatePresence } from "framer-motion";

export default function DomainDirectory() {
    const [activeCategory, setActiveCategory] = useState("All");
    const categories = ["All", "Data & AI", "Engineering", "Infrastructure", "Specialized", "Product"];

    const filteredDomains = Object.entries(DOMAIN_TOOLKITS)
        .sort()
        .filter(([domain]) => {
            if (activeCategory === "All") return true;
            return DOMAIN_CATEGORIES[domain] === activeCategory;
        });

    return (
        <div className="min-h-screen bg-black text-white selection:bg-primary/30">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 pt-6 px-6 pointer-events-none">
                <div className="max-w-7xl mx-auto flex items-center justify-between pointer-events-auto">
                    <Link href="/roadmap" className="glass-pill px-6 py-3 flex items-center gap-3 text-xs font-bold tracking-widest hover:bg-white/10 transition-colors group">
                        <span className="text-slate-400 group-hover:text-white transition-colors">← RETURN TO BUILDER</span>
                    </Link>
                    <div className="glass-pill px-6 py-3">
                        <span className="text-xs font-black tracking-[0.2em] text-white">DOMAIN MATRIX</span>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-40 relative z-10">
                <div className="text-center mb-16 space-y-6">
                    <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white mb-6">
                        Technical <span className="text-white/40">Inventory</span>
                    </h1>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        A comprehensive index of the 40+ specialized career tracks available in the Kazira ecosystem,
                        mapped to their industry-standard toolkits.
                    </p>
                </div>

                {/* Filter Tabs */}
                <div className="flex flex-wrap justify-center gap-3 mb-16 sticky top-28 z-40">
                    <div className="glass-pill p-1.5 flex flex-wrap justify-center gap-1 bg-black/50 backdrop-blur-xl border-white/10">
                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${activeCategory === category
                                    ? "bg-white text-black shadow-lg shadow-white/10 scale-105"
                                    : "text-slate-400 hover:text-white hover:bg-white/5"
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence mode="popLayout">
                        {filteredDomains.map(([domain, skills], index) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.2 }}
                                key={domain}
                                className="glass-card p-10 rounded-[32px] border-white/5 hover:border-white/10 group transition-all hover:bg-white/[0.02]"
                            >
                                <div className="mb-8">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 border border-white/5">
                                        <span className="text-xl font-bold text-white/40 group-hover:text-primary transition-colors">
                                            {domain.charAt(0)}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">{domain}</h3>
                                    <p className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                                        {skills.length} Core Technologies
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {skills.map(skill => (
                                        <span
                                            key={skill}
                                            className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-[10px] font-bold text-slate-300 uppercase tracking-wider hover:bg-white/10 hover:text-white transition-colors cursor-default"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </main>

            {/* Background Effects */}
            <div className="fixed top-0 left-0 w-full h-[800px] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
            <div className="fixed -top-[400px] left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-primary/10 blur-[150px] rounded-full pointer-events-none opacity-20" />
        </div>
    );
}
