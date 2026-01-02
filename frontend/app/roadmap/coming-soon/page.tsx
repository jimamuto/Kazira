"use client";

import { Sparkles } from "lucide-react";

export default function ComingSoonPage() {
    return (
        <div className="max-w-2xl mx-auto">
            <div className="glass-card p-12 rounded-3xl border border-white/10 text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/10 to-pink-500/10 flex items-center justify-center mx-auto mb-6">
                    <Sparkles className="w-10 h-10 text-purple-400 animate-pulse" />
                </div>
                <h2 className="text-xl font-bold text-white mb-3">Something Extraordinary is Coming</h2>
                <p className="text-slate-400 mb-6 text-sm">
                    Our team is working on next-generation autonomous career features that will revolutionize how you plan and execute your career strategy.
                </p>
                <div className="inline-block px-6 py-3 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-bold">
                    Stay Tuned
                </div>
            </div>
        </div>
    );
}
