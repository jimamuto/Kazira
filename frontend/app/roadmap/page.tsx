"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { RoadmapOutput } from "@/types/roadmap";
import RoadmapView from "@/components/RoadmapView";
import ExecutionView from "@/components/ExecutionView";

export default function RoadmapPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [roadmap, setRoadmap] = useState<RoadmapOutput | null>(null);
    const [view, setView] = useState<"SELECT" | "PLAN" | "EXECUTION">("SELECT");

    useEffect(() => {
        const dataParam = searchParams.get("data");
        if (dataParam) {
            try {
                const data = JSON.parse(decodeURIComponent(dataParam));
                setRoadmap(data);
                setView("PLAN");
            } catch (e) {
                console.error("Error parsing roadmap data:", e);
            }
        }
    }, [searchParams]);

    const handleSuccess = (data: RoadmapOutput) => {
        setRoadmap(data);
        setView("PLAN");
    };

    const handleReset = () => {
        setRoadmap(null);
        setView("SELECT");
        router.push("/roadmap");
    };

    if (roadmap && view === "PLAN") {
        return (
            <RoadmapView
                roadmap={roadmap}
                onReset={handleReset}
                onLaunchExecution={() => setView("EXECUTION")}
            />
        );
    }

    if (roadmap && view === "EXECUTION") {
        return (
            <ExecutionView
                roadmap={roadmap}
                onBack={() => setView("PLAN")}
            />
        );
    }

    return (
        <div className="max-w-6xl mx-auto py-12 px-6">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Choose Your Agent Mode</h2>
                <p className="text-slate-400 text-lg">From basic roadmap to extraordinary multi-agent orchestration</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <a href="/roadmap/single" className="glass-card p-8 rounded-2xl border border-white/10 hover:border-cyan-400/40 transition-all group">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <svg className="w-7 h-7 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Single Pipeline</h3>
                    <p className="text-slate-400 text-sm">Quick 6-month roadmap generation with basic market analysis.</p>
                </a>

                <a href="/roadmap/marathon" className="glass-card p-8 rounded-2xl border border-white/10 hover:border-emerald-400/40 transition-all group">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-green-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <svg className="w-7 h-7 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Marathon Agent</h3>
                    <p className="text-slate-400 text-sm">72-hour continuous operation with market monitoring and self-correction.</p>
                </a>

                <a href="/roadmap/tournament" className="glass-card p-8 rounded-2xl border border-white/10 hover:border-purple-400/40 transition-all group">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <svg className="w-7 h-7 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Agent Tournament</h3>
                    <p className="text-slate-400 text-sm">Multiple research agents compete - winner's strategy becomes your roadmap.</p>
                </a>

                <a href="/roadmap/multi-market" className="glass-card p-8 rounded-2xl border border-white/10 hover:border-blue-400/40 transition-all group">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-green-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Global Arbitrage</h3>
                    <p className="text-slate-400 text-sm">Compare markets across Kenya, US, EU - find undervalued skills and salary arbitrage.</p>
                </a>

                <a href="/roadmap/strategic" className="glass-card p-8 rounded-2xl border border-white/10 hover:border-emerald-400/40 transition-all group">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <svg className="w-7 h-7 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">5-Year Trajectory</h3>
                    <p className="text-slate-400 text-sm">Complete career path from Junior to CTO with velocity tracking and market alignment.</p>
                </a>

                <a href="/roadmap/coming-soon" className="glass-card p-8 rounded-2xl border border-white/5 opacity-50 hover:opacity-70 transition-all group">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <svg className="w-7 h-7 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white/60 mb-2">Coming Soon</h3>
                    <p className="text-slate-500 text-sm">Even more extraordinary features in development...</p>
                </a>
            </div>
        </div>
    );
}
