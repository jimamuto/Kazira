"use client";

import { useRouter } from "next/navigation";
import { ClipboardList, Timer, Crown, Globe, TrendingUp, Sparkles } from "lucide-react";

const modes = [
    {
        icon: ClipboardList,
        title: "Single Pipeline",
        description: "Quick 6-month roadmap generation with basic market analysis.",
        href: "/roadmap/single",
        color: "from-blue-500/20 to-cyan-500/20",
        iconColor: "text-cyan-400"
    },
    {
        icon: Timer,
        title: "Marathon Agent",
        description: "72-hour continuous operation with market monitoring and self-correction.",
        href: "/roadmap/marathon",
        color: "from-emerald-500/20 to-green-500/20",
        iconColor: "text-emerald-400"
    },
    {
        icon: Crown,
        title: "Agent Tournament",
        description: "Multiple research agents compete - winner's strategy becomes your roadmap.",
        href: "/roadmap/tournament",
        color: "from-purple-500/20 to-pink-500/20",
        iconColor: "text-purple-400"
    },
    {
        icon: Globe,
        title: "Global Arbitrage",
        description: "Compare markets across Kenya, US, EU - find undervalued skills and salary arbitrage.",
        href: "/roadmap/multi-market",
        color: "from-blue-500/20 to-green-500/20",
        iconColor: "text-blue-400"
    },
    {
        icon: TrendingUp,
        title: "5-Year Trajectory",
        description: "Complete career path from Junior to CTO with velocity tracking and market alignment.",
        href: "/roadmap/strategic",
        color: "from-emerald-500/20 to-teal-500/20",
        iconColor: "text-emerald-400"
    },
    {
        icon: Sparkles,
        title: "Coming Soon",
        description: "Even more extraordinary features in development...",
        href: "/roadmap/coming-soon",
        color: "from-purple-500/20 to-pink-500/20",
        iconColor: "text-purple-400"
    }
];

export default function NewOrchestratorContent() {
    const router = useRouter();

    return (
        <div className="max-w-6xl mx-auto py-12 px-6">
            <div className="mb-12">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-white mb-4">Choose Your Agent Mode</h2>
                    <p className="text-slate-400 text-sm">From basic roadmap to extraordinary multi-agent orchestration</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {modes.map((mode, index) => (
                        <button
                            key={index}
                            onClick={() => router.push(mode.href)}
                            className="glass-card p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all text-left group hover:scale-[1.02] hover:bg-white/10"
                        >
                            <div className="flex items-start gap-4">
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${mode.color} flex items-center justify-center transition-all group-hover:scale-110`}>
                                    <mode.icon className={`w-6 h-6 ${mode.iconColor}`} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white mb-2 group-hover:text-primary transition-colors">{mode.title}</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed">{mode.description}</p>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
