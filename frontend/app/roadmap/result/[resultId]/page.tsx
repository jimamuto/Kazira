"use client";

import { useParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import {
    ChevronLeft, Share2, Download, RefreshCw,
    CheckCircle2, Clock, Target, TrendingUp, Trophy,
    Calendar, MapPin, Briefcase, Sparkles, Play
} from "lucide-react";
import { RoadmapOutput } from "@/types/roadmap";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function RoadmapResultContent() {
    const params = useParams();
    const resultId = params.resultId as string;
    const [mode, setMode] = useState<string>("single");
    const [showLogs, setShowLogs] = useState(false);
    const [data, setData] = useState<RoadmapOutput | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (resultId) {
            fetchRoadmapData(resultId);
        } else {
            setError("No result ID provided");
            setLoading(false);
        }
    }, [resultId]);

    const fetchRoadmapData = async (resultId: string) => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/roadmap/result/${resultId}`);
            if (!res.ok) {
                throw new Error(`HTTP ${res.status}: ${res.statusText}`);
            }
            const result = await res.json();
            setData(result);

            // Auto-detect mode based on summary content
            if (result.summary?.includes("Marathon Session")) {
                setMode("marathon");
            }
        } catch (e) {
            console.error("Failed to fetch roadmap data:", e);
            setError("Failed to load roadmap data. It may have expired.");
        }
        setLoading(false);
    };

    const getModeConfig = () => {
        switch (mode) {
            case "single": return { icon: Target, color: "cyan", label: "Single Pipeline" };
            case "marathon": return { icon: Clock, color: "emerald", label: "Marathon Agent" };
            case "tournament": return { icon: Trophy, color: "purple", label: "Agent Tournament" };
            case "multi-market": return { icon: TrendingUp, color: "blue", label: "Global Arbitrage" };
            case "strategic": return { icon: MapPin, color: "teal", label: "5-Year Trajectory" };
            default: return { icon: Sparkles, color: "cyan", label: "Career Roadmap" };
        }
    };

    const config = getModeConfig();
    const Icon = config.icon;
    const colorClass = `text-${config.color}-400 bg-${config.color}-500/10 border-${config.color}-500/20`;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-white/10 border-t-primary rounded-full animate-spin mx-auto mb-6"></div>
                    <p className="text-slate-400 text-lg">Loading your roadmap...</p>
                </div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center glass-card p-12 rounded-3xl border border-red-500/20">
                    <div className="text-6xl mb-6">❌</div>
                    <h2 className="text-2xl font-bold text-white mb-4">No Roadmap Found</h2>
                    <p className="text-slate-400 mb-8">{error || "Unable to load your career blueprint"}</p>
                    <Link href="/roadmap" className="btn-primary px-8 py-3 inline-flex items-center gap-2">
                        <ChevronLeft className="w-4 h-4" /> Create New Roadmap
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
                <Link href="/roadmap" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                    <ChevronLeft className="w-5 h-5" /> Back to Modes
                </Link>
                <div className="flex items-center gap-3">
                    <button className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
                        <Share2 className="w-5 h-5 text-slate-400" />
                    </button>
                    <button className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
                        <Download className="w-5 h-5 text-slate-400" />
                    </button>
                </div>
            </div>

            {/* Hero Card */}
            <div className="glass-card p-10 rounded-3xl border border-white/10 mb-8 relative overflow-hidden">
                <div className={`absolute top-0 right-0 w-64 h-64 bg-${config.color}-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2`}></div>

                <div className="flex items-start gap-6 relative z-10">
                    <div className={`w-16 h-16 rounded-2xl bg-${config.color}-500/10 flex items-center justify-center`}>
                        <Icon className={`w-8 h-8 text-${config.color}-400`} />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-${config.color}-500/10 text-${config.color}-400 border border-${config.color}-500/20`}>
                                {config.label}
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                {data.months?.length || 0} Months
                            </span>
                        </div>
                        <h1 className="text-4xl font-bold text-white mb-2">{data.target_role}</h1>
                        <p className="text-slate-400 text-lg max-w-2xl">{data.summary}</p>
                    </div>
                </div>

                {data.execution_schedule && (
                    <div className="mt-8 grid grid-cols-4 gap-4">
                        <div className="bg-white/5 rounded-xl p-4 text-center">
                            <div className="text-2xl font-bold text-white">{data.execution_schedule.sprints?.length || 0}</div>
                            <div className="text-xs text-slate-500 uppercase tracking-widest">Sprints</div>
                        </div>
                        <div className="bg-white/5 rounded-xl p-4 text-center">
                            <div className="text-2xl font-bold text-white">{data.hours_per_week}h</div>
                            <div className="text-xs text-slate-500 uppercase tracking-widest">Per Week</div>
                        </div>
                        <div className="bg-white/5 rounded-xl p-4 text-center">
                            <div className="text-2xl font-bold text-white">{data.months?.reduce((acc, m) => acc + (m.skills?.length || 0), 0) || 0}</div>
                            <div className="text-xs text-slate-500 uppercase tracking-widest">Skills</div>
                        </div>
                        <div className="bg-white/5 rounded-xl p-4 text-center">
                            <div className="text-2xl font-bold text-white">{data.months?.reduce((acc, m) => acc + (m.projects?.length || 0), 0) || 0}</div>
                            <div className="text-xs text-slate-500 uppercase tracking-widest">Projects</div>
                        </div>
                    </div>
                )}
            </div>

            {/* Marathon Live View */}
            {mode === "marathon" && (
                <div className="glass-card p-8 rounded-2xl border border-emerald-500/30 mb-8 animate-fade-in relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-cyan-500 animate-pulse"></div>

                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></div>
                            <h2 className="text-2xl font-bold text-white">Mission Control Live</h2>
                        </div>
                        <div className="flex items-center gap-2 text-emerald-400 text-sm font-mono">
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            SYNCING
                        </div>
                    </div>

                    <div className="bg-black/40 rounded-xl p-6 font-mono text-sm text-emerald-400/80 mb-6 min-h-[300px] max-h-[500px] overflow-y-auto border border-white/5 shadow-inner custom-scrollbar">
                        {data.logs && data.logs.length > 0 ? (
                            data.logs.slice().reverse().map((log, i) => (
                                <div key={i} className="mb-2 font-mono text-xs border-b border-white/5 pb-1 last:border-0 hover:bg-white/5 p-1 rounded transition-colors">
                                    <div className="flex items-center gap-2 opacity-50 mb-0.5">
                                        <span className="text-[10px]">{new Date(log.timestamp).toLocaleTimeString()}</span>
                                        <span className={`font-bold ${log.source === 'ERROR' ? 'text-red-400' : 'text-cyan-400'}`}>[{log.source}]</span>
                                    </div>
                                    <div className="text-white/90 pl-1">{log.message}</div>
                                </div>
                            ))
                        ) : (
                            <>
                                <div className="flex items-center gap-2 mb-2 text-white/60">
                                    <span>{">"}</span> SYSTEM_INIT: verified
                                </div>
                                <div className="flex items-center gap-2 mb-2 text-white/60">
                                    <span>{">"}</span> WAITING_FOR_LOGS...
                                </div>
                                <div className="flex items-center gap-2 mb-2 text-white">
                                    <span>{">"}</span> <span className="animate-pulse">_</span>
                                </div>
                            </>
                        )}
                        <div className="mt-4 text-xs text-slate-500 border-t border-white/5 pt-2">
                            Channel: {resultId} | Status: ACTIVE
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => fetchRoadmapData(resultId)}
                            className="btn-primary bg-emerald-600 hover:bg-emerald-500 px-6 py-3 flex-1 flex items-center justify-center gap-2 group"
                        >
                            <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform" /> Sync Logs
                        </button>
                        <button className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 flex-1 text-slate-400">
                            Pause Agent
                        </button>
                    </div>
                </div>
            )}

            {/* Timeline */}
            {mode !== "marathon" && data.months && data.months.length > 0 && (
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                        <Calendar className="w-6 h-6 text-primary" /> Your Roadmap
                    </h2>

                    {data.months.map((month, idx) => (
                        <div key={idx} className="glass-card p-8 rounded-2xl border border-white/5 hover:border-white/10 transition-all">
                            <div className="flex items-start gap-6">
                                <div className={`w-14 h-14 rounded-xl bg-${config.color}-500/10 flex items-center justify-center flex-shrink-0`}>
                                    <span className={`text-xl font-bold text-${config.color}-400`}>M{month.month}</span>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-white mb-3">{month.title}</h3>

                                    {month.skills && month.skills.length > 0 && (
                                        <div className="mb-4">
                                            <div className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Skills</div>
                                            <div className="flex flex-wrap gap-2">
                                                {month.skills.map((skill, i) => (
                                                    <span key={i} className="px-3 py-1.5 rounded-lg bg-white/5 text-sm text-slate-300 border border-white/5">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {month.tasks && month.tasks.length > 0 && (
                                        <div className="mb-4">
                                            <div className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Key Tasks</div>
                                            <ul className="space-y-2">
                                                {month.tasks.slice(0, 5).map((task, i) => (
                                                    <li key={i} className="flex items-start gap-2 text-slate-300 text-sm">
                                                        <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                                                        {task}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {month.projects && month.projects.length > 0 && (
                                        <div>
                                            <div className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Projects</div>
                                            <div className="flex flex-wrap gap-2">
                                                {month.projects.map((project, i) => (
                                                    <span key={i} className="px-3 py-1.5 rounded-lg bg-primary/10 text-sm text-primary border border-primary/20">
                                                        {project}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Additional Info */}
            {data.additional_info && (
                <div className="mt-8 glass-card p-8 rounded-2xl border border-white/10">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-primary" /> AI Insights
                    </h3>
                    <p className="text-slate-300 leading-relaxed">{data.additional_info}</p>
                </div>
            )}

            {/* Actions */}
            <div className="mt-12 flex items-center justify-center gap-4">
                <Link
                    href={`/learning/${resultId}`}
                    className="btn-primary bg-emerald-600 hover:bg-emerald-500 px-10 py-4 flex items-center gap-2 group"
                >
                    <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    Get Started Now
                </Link>
                <Link href="/roadmap" className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-all flex items-center gap-2">
                    <RefreshCw className="w-5 h-5" /> Create Another
                </Link>
            </div>
        </div>
    );
}

export default function RoadmapResultPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-white/10 border-t-primary rounded-full animate-spin mx-auto mb-6"></div>
                    <p className="text-slate-400">Loading...</p>
                </div>
            </div>
        }>
            <RoadmapResultContent />
        </Suspense>
    );
}
