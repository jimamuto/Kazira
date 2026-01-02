"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useState, Suspense } from "react";
import {
    ClipboardList,
    Timer,
    Crown,
    Globe,
    TrendingUp,
    Sparkles,
    Menu,
    X,
    Home,
    ExternalLink
} from "lucide-react";

const modes = [
    {
        name: "Single Pipeline",
        href: "/roadmap/single",
        icon: ClipboardList,
        description: "Quick 6-month roadmap",
        color: "cyan"
    },
    {
        name: "Marathon Agent",
        href: "/roadmap/marathon",
        icon: Timer,
        description: "72-hour continuous operation",
        color: "emerald"
    },
    {
        name: "Agent Tournament",
        href: "/roadmap/tournament",
        icon: Crown,
        description: "Multiple agents compete",
        color: "purple"
    },
    {
        name: "Global Arbitrage",
        href: "/roadmap/multi-market",
        icon: Globe,
        description: "Compare global markets",
        color: "blue"
    },
    {
        name: "5-Year Trajectory",
        href: "/roadmap/strategic",
        icon: TrendingUp,
        description: "Complete career path",
        color: "teal"
    },
    {
        name: "Coming Soon",
        href: "/roadmap/coming-soon",
        icon: Sparkles,
        description: "Future features",
        color: "pink"
    }
];

const colorClasses: Record<string, { bg: string; text: string; border: string; glow: string }> = {
    cyan: { bg: "from-blue-500/20 to-cyan-500/20", text: "text-cyan-400", border: "border-cyan-400/40", glow: "shadow-cyan-500/20" },
    emerald: { bg: "from-emerald-500/20 to-green-500/20", text: "text-emerald-400", border: "border-emerald-400/40", glow: "shadow-emerald-500/20" },
    purple: { bg: "from-purple-500/20 to-pink-500/20", text: "text-purple-400", border: "border-purple-400/40", glow: "shadow-purple-500/20" },
    blue: { bg: "from-blue-500/20 to-green-500/20", text: "text-blue-400", border: "border-blue-400/40", glow: "shadow-blue-500/20" },
    teal: { bg: "from-emerald-500/20 to-teal-500/20", text: "text-emerald-400", border: "border-emerald-400/40", glow: "shadow-emerald-500/20" },
    pink: { bg: "from-purple-500/20 to-pink-500/20", text: "text-purple-400", border: "border-purple-400/40", glow: "shadow-purple-500/20" }
};

function RoadmapLayoutContent({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    let currentMode = modes.find(m => pathname.startsWith(m.href));

    // Check for origin param override
    const origin = searchParams.get("origin");
    if (!currentMode && origin) {
        const originMode = modes.find(m => m.href.includes(origin));
        if (originMode) currentMode = originMode;
    }

    // Default fallback
    if (!currentMode) {
        if (pathname.includes("/result")) {
            currentMode = {
                name: "Career Roadmap",
                href: "/roadmap",
                icon: Sparkles,
                description: "Analysis Result",
                color: "cyan"
            };
        } else {
            currentMode = modes[0];
        }
    }

    const currentColor = colorClasses[currentMode.color] || colorClasses["cyan"];

    return (
        <div className="min-h-screen bg-black">
            {/* Mobile Toggle */}
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="fixed top-4 left-4 z-50 lg:hidden bg-white/10 p-3 rounded-full text-white hover:bg-white/20 transition-colors backdrop-blur-xl"
            >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Sidebar */}
            <aside className={`
                fixed top-0 left-0 h-full w-72 bg-black/90 backdrop-blur-xl border-r border-white/10 z-40
                transform transition-transform duration-300 ease-in-out
                ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
            `}>
                {/* Logo */}
                <div className="p-6 border-b border-white/10">
                    <Link href="/" className="text-2xl font-black text-white tracking-tighter flex items-center gap-2">
                        <span className="text-primary">KAZIRA</span>
                    </Link>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Orchestrator</p>
                </div>

                {/* Mode Navigation */}
                <nav className="p-4 space-y-2 overflow-y-auto max-h-[calc(100vh-280px)]">
                    {modes.map((mode) => {
                        const isActive = pathname === mode.href || (origin && mode.href.includes(origin));
                        const Icon = mode.icon;
                        const colors = colorClasses[mode.color];

                        return (
                            <Link
                                key={mode.href}
                                href={mode.href}
                                onClick={() => setSidebarOpen(false)}
                                className={`
                                    flex items-center gap-4 p-4 rounded-2xl transition-all duration-200
                                    ${isActive
                                        ? `bg-gradient-to-r ${colors.bg} ${colors.border} border`
                                        : "hover:bg-white/5 border border-transparent"
                                    }
                                `}
                            >
                                <div className={`
                                    w-10 h-10 rounded-xl flex items-center justify-center
                                    ${isActive ? colors.text : "text-slate-500"}
                                `}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <div className={`font-bold text-sm ${isActive ? "text-white" : "text-slate-400"}`}>
                                        {mode.name}
                                    </div>
                                    <div className="text-[10px] text-slate-500">{mode.description}</div>
                                </div>
                                {isActive && (
                                    <div className={`w-2 h-2 rounded-full ${colors.text.replace('text-', 'bg-')}`}></div>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom Actions */}
                <div className="absolute bottom-4 left-0 right-0 px-4 space-y-2">
                    <Link
                        href="/"
                        className="flex items-center gap-3 p-4 rounded-2xl text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                    >
                        <ExternalLink className="w-5 h-5" />
                        <span className="font-medium text-sm">Back to Home</span>
                    </Link>
                </div>
            </aside>

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <main className="lg:ml-72 min-h-screen">
                {/* Top Bar */}
                <div className="sticky top-0 bg-black/80 backdrop-blur-xl border-b border-white/10 z-20 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 pl-12 lg:pl-0">
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${currentColor.bg} flex items-center justify-center`}>
                                <currentMode.icon className={`w-5 h-5 ${currentColor.text}`} />
                            </div>
                            <div>
                                <h1 className="font-bold text-white">{currentMode.name}</h1>
                                <p className="text-xs text-slate-500">{currentMode.description}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Page Content */}
                <div className="p-6">
                    {children}
                </div>
            </main>
        </div>
    );
}

export default function RoadmapLayout({ children }: { children: React.ReactNode }) {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-slate-500">Loading layout...</div>}>
            <RoadmapLayoutContent>
                {children}
            </RoadmapLayoutContent>
        </Suspense>
    );
}
