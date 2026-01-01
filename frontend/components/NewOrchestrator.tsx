"use client";

import { useState, useEffect } from "react";
import { Search, Brain, Map, ShieldCheck, ArrowRight, Loader2, CheckCircle2, Upload, FileText, X, Play, Pause, Clock, Zap, AlertTriangle, Database, Trophy, Globe, Target } from "lucide-react";
import { RoadmapOutput } from "@/types/roadmap";

type Stage = "RESEARCH" | "QUALIFICATIONS" | "GAP_ANALYSIS" | "PARAMETERS" | "FINAL_BLUEPRINT";
type MarathonMode = "single" | "marathon" | "tournament" | "multi_market" | "strategic";

interface ThoughtSignature {
    step: string;
    global_state: string;
    metadata: any;
    timestamp: string;
}

interface MarathonSession {
    id: number;
    career_goal: string;
    started_at: string;
    status: "RUNNING" | "COMPLETED" | "FAILED" | "CANCELLED";
    cycle_count: number;
    duration_hours: number;
}

export default function NewOrchestratorContent({ onSuccess }: { onSuccess: (data: RoadmapOutput) => void }) {
    const [stage, setStage] = useState<Stage>("RESEARCH");
    const [targetRole, setTargetRole] = useState("");
    const [marathonMode, setMarathonMode] = useState<MarathonMode>("single");
    const [isScraping, setIsScraping] = useState(false);
    const [jobsFound, setJobsFound] = useState<any[]>([]);
    const [qualifications, setQualifications] = useState("");
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [gapResults, setGapResults] = useState<any>(null);
    const [skillLevel, setSkillLevel] = useState("beginner");
    const [hoursPerWeek, setHoursPerWeek] = useState(15);
    const [userConstraints, setUserConstraints] = useState("");
    const [cvFile, setCvFile] = useState<File | null>(null);
    const [isExtracting, setIsExtracting] = useState(false);
    const [uploadError, setUploadError] = useState("");

    // Marathon Agent State
    const [marathonSession, setMarathonSession] = useState<MarathonSession | null>(null);
    const [thoughtSignatures, setThoughtSignatures] = useState<ThoughtSignature[]>([]);
    const [durationHours, setDurationHours] = useState(72);
    const [checkInterval, setCheckInterval] = useState(30);



    // Fetch thought signatures from database
    useEffect(() => {
        const fetchSignatures = async () => {
            try {
                const res = await fetch("http://localhost:8000/api/orchestrator/signatures/demo_user_marathon");
                const data = await res.json();
                setThoughtSignatures(data.signatures || []);
            } catch (e) {
                console.error("Failed to fetch signatures:", e);
            }
        };

        if (marathonMode === "marathon") {
            fetchSignatures();
            const interval = setInterval(fetchSignatures, 5000); // Poll every 5 seconds
            return () => clearInterval(interval);
        }
    }, [marathonMode]);

    // Stage 1: Research Agent (Target Role -> Scraping)
    const handleStartResearch = async () => {
        setIsScraping(true);

        if (marathonMode === "marathon") {
            // Start marathon session
            try {
                const res = await fetch("http://localhost:8000/api/orchestrator/start", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        user_id: "demo_user_marathon",
                        career_goal: targetRole,
                        duration_hours: durationHours,
                        check_interval_minutes: checkInterval
                    })
                });
                const data = await res.json();
                setMarathonSession({
                    id: data.session_id,
                    career_goal: targetRole,
                    started_at: new Date().toISOString(),
                    status: "RUNNING",
                    cycle_count: 0,
                    duration_hours: durationHours
                });
            } catch (e) {
                console.error(e);
                setIsScraping(false);
            }
        } else {
            // Single pipeline - old behavior
            try {
                const res = await fetch("http://localhost:8000/api/jobs/scrape", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ role: targetRole })
                });
                const data = await res.json();
                setJobsFound(data.jobs || []);
                setTimeout(() => {
                    setIsScraping(false);
                    setStage("QUALIFICATIONS");
                }, 3000);
            } catch (e) {
                console.error(e);
                setIsScraping(false);
            }
        }
    };

    // Stage 2: CV Parsing / Manual Entry
    const handleFileUpload = async (file: File) => {
        setIsExtracting(true);
        setUploadError("");
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("http://localhost:8000/api/jobs/extract-skills", {
                method: "POST",
                body: formData
            });
            const data = await res.json();
            if (data.status === "success" && data.skills) {
                const newSkills = data.skills.join(", ");
                setQualifications(prev => prev ? `${prev}, ${newSkills}` : newSkills);
                setCvFile(file);
            } else {
                setUploadError(data.detail || "Extraction failed");
            }
        } catch (e) {
            setUploadError("Network error during CV scan");
        } finally {
            setIsExtracting(false);
        }
    };

    // Stage 3: Planning Agent (Gap Analysis & Knowledge Graph)
    const handleAnalyzeGaps = async () => {
        setIsAnalyzing(true);
        try {
            const firstJob = jobsFound[0] || { description: targetRole };
            const res = await fetch("http://localhost:8000/api/jobs/match", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    job_description: firstJob.description,
                    user_skills: qualifications.split(/[,\n]/).map(s => s.trim()).filter(Boolean)
                })
            });
            const data = await res.json();

            setGapResults({
                critical_gaps: data.missing_skills || ["Industry Standard Tools"],
                skill_graph: { nodes: data.score / 10, edges: data.score / 5 },
                market_urgency: data.score > 70 ? "Medium" : "High"
            });
            setIsAnalyzing(false);

            if (marathonMode === "single") {
                setStage("GAP_ANALYSIS");
            }
        } catch (e) {
            console.error(e);
            setIsAnalyzing(false);
        }
    };

    // Stage 4: Execution Agent (Generate Full Roadmap)
    const handleBuildRoadmap = async () => {
        setIsAnalyzing(true);
        try {
            const res = await fetch("http://localhost:8000/api/roadmap/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: "User",
                    location: "Kenya",
                    current_status: "junior dev",
                    degree: "Technical Training",
                    target_role: targetRole,
                    skills: qualifications.split(/[,\n]/).map(s => s.trim()).filter(Boolean),
                    timeframe_months: 6,
                    skill_level: skillLevel,
                    hours_per_week: hoursPerWeek,
                    constraints: userConstraints.split(/[,\n]/).map(s => s.trim()).filter(Boolean)
                })
            });
            const data = await res.json();

            if (marathonMode === "single") {
                onSuccess(data);
            }

        } catch (e) {
            console.error(e);
            setIsAnalyzing(false);
        }
    };

    // Marathon Agent Controls
    const handleStopMarathon = async () => {
        if (!marathonSession) return;

        try {
            await fetch(`http://localhost:8000/api/orchestrator/stop/${marathonSession.id}`, {
                method: "POST"
            });
            setMarathonSession({ ...marathonSession, status: "CANCELLED" });
        } catch (e) {
            console.error("Failed to stop marathon:", e);
        }
    };

    return (
        <div className="max-w-6xl mx-auto py-12 px-6">
            {/* EXTRAORDINARY Mode Selection */}
            <div className="mb-12">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-white mb-4">Choose Your Agent Mode</h2>
                    <p className="text-slate-400 text-sm">From basic roadmap to extraordinary multi-agent orchestration</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Single Pipeline */}
                    <button
                        onClick={() => setMarathonMode("single")}
                        className={`glass-card p-6 rounded-2xl border transition-all text-left group ${marathonMode === "single" ? "border-primary bg-primary/5" : "border-white/10 hover:border-white/20"}`}
                    >
                        <div className="flex items-start gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${marathonMode === "single" ? "bg-primary text-black" : "bg-white/5 text-white group-hover:bg-white/10"}`}>
                                📋
                            </div>
                            <div>
                                <h3 className="font-bold text-white mb-2">Single Pipeline</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">Quick 6-month roadmap generation with basic market analysis.</p>
                            </div>
                        </div>
                    </button>

                    {/* Marathon Agent */}
                    <button
                        onClick={() => setMarathonMode("marathon")}
                        className={`glass-card p-6 rounded-2xl border transition-all text-left group ${marathonMode === "marathon" ? "border-primary bg-primary/5" : "border-white/10 hover:border-white/20"}`}
                    >
                        <div className="flex items-start gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${marathonMode === "marathon" ? "bg-primary text-black" : "bg-white/5 text-white group-hover:bg-white/10"}`}>
                                🏃
                            </div>
                            <div>
                                <h3 className="font-bold text-white mb-2">Marathon Agent</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">72-hour continuous operation with market monitoring and self-correction.</p>
                            </div>
                        </div>
                    </button>

                    {/* EXTRAORDINARY: Tournament Mode */}
                    <button
                        onClick={() => setMarathonMode("tournament")}
                        className={`glass-card p-6 rounded-2xl border transition-all text-left group ${marathonMode === "tournament" ? "border-primary bg-primary/5" : "border-white/10 hover:border-white/20"}`}
                    >
                        <div className="flex items-start gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${marathonMode === "tournament" ? "bg-primary text-black" : "bg-white/5 text-white group-hover:bg-white/10"}`}>
                                🏆
                            </div>
                            <div>
                                <h3 className="font-bold text-white mb-2">Agent Tournament</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">Multiple research agents compete - winner's strategy becomes your roadmap.</p>
                            </div>
                        </div>
                    </button>

                    {/* EXTRAORDINARY: Multi-Market Intelligence */}
                    <button
                        onClick={() => setMarathonMode("multi_market")}
                        className={`glass-card p-6 rounded-2xl border transition-all text-left group ${marathonMode === "multi_market" ? "border-primary bg-primary/5" : "border-white/10 hover:border-white/20"}`}
                    >
                        <div className="flex items-start gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${marathonMode === "multi_market" ? "bg-primary text-black" : "bg-white/5 text-white group-hover:bg-white/10"}`}>
                                🌍
                            </div>
                            <div>
                                <h3 className="font-bold text-white mb-2">Global Arbitrage</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">Compare markets across Kenya, US, EU - find undervalued skills and salary arbitrage.</p>
                            </div>
                        </div>
                    </button>

                    {/* EXTRAORDINARY: Strategic Career Pathing */}
                    <button
                        onClick={() => setMarathonMode("strategic")}
                        className={`glass-card p-6 rounded-2xl border transition-all text-left group ${marathonMode === "strategic" ? "border-primary bg-primary/5" : "border-white/10 hover:border-white/20"}`}
                    >
                        <div className="flex items-start gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${marathonMode === "strategic" ? "bg-primary text-black" : "bg-white/5 text-white group-hover:bg-white/10"}`}>
                                🎯
                            </div>
                            <div>
                                <h3 className="font-bold text-white mb-2">5-Year Trajectory</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">Complete career path from Junior to CTO with velocity tracking and market alignment.</p>
                            </div>
                        </div>
                    </button>

                    {/* PLACEHOLDER for future extraordinary feature */}
                    <div className="glass-card p-6 rounded-2xl border border-white/5 opacity-50">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center text-purple-400">
                                🚀
                            </div>
                            <div>
                                <h3 className="font-bold text-white/60 mb-2">Coming Soon</h3>
                                <p className="text-slate-500 text-sm leading-relaxed">Even more extraordinary features in development...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* EXTRAORDINARY Mode Information */}
            {marathonMode !== "single" && (
                <div className="mb-12">
                    {marathonMode === "tournament" && (
                        <div className="glass-card p-6 rounded-2xl border-primary/20 bg-gradient-to-r from-purple-500/5 to-pink-500/5">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                                    🏆
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-white mb-2">Agent Tournament Mode</h3>
                                    <p className="text-slate-300 mb-3">Multiple research agents with different strategies compete to create your optimal roadmap. Evolutionary algorithms determine the winner.</p>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-purple-400 font-bold">🤖 Agents:</span>
                                            <span className="text-slate-400 ml-2">Balanced, Aggressive, Conservative, Innovative</span>
                                        </div>
                                        <div>
                                            <span className="text-purple-400 font-bold">🏅 Winner:</span>
                                            <span className="text-slate-400 ml-2">Highest-scoring strategy becomes your roadmap</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {marathonMode === "multi_market" && (
                        <div className="glass-card p-6 rounded-2xl border-primary/20 bg-gradient-to-r from-blue-500/5 to-green-500/5">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-green-500/20 flex items-center justify-center">
                                    🌍
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-white mb-2">Global Market Arbitrage</h3>
                                    <p className="text-slate-300 mb-3">Compare job markets across Kenya, United States, and European Union. Identify undervalued skills and salary arbitrage opportunities.</p>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-blue-400 font-bold">📊 Markets:</span>
                                            <span className="text-slate-400 ml-2">Kenya, US, EU (4 regions total)</span>
                                        </div>
                                        <div>
                                            <span className="text-green-400 font-bold">💰 Arbitrage:</span>
                                            <span className="text-slate-400 ml-2">Find 2-3x salary opportunities</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {marathonMode === "strategic" && (
                        <div className="glass-card p-6 rounded-2xl border-primary/20 bg-gradient-to-r from-emerald-500/5 to-teal-500/5">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center">
                                    🎯
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-white mb-2">Strategic Career Pathing</h3>
                                    <p className="text-slate-300 mb-3">Complete 5-year career trajectory from Junior to CTO. Includes velocity tracking, market alignment, and success probability calculations.</p>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-emerald-400 font-bold">📈 Trajectory:</span>
                                            <span className="text-slate-400 ml-2">Junior → Senior → Lead → Principal → CTO</span>
                                        </div>
                                        <div>
                                            <span className="text-teal-400 font-bold">⚡ Velocity:</span>
                                            <span className="text-slate-400 ml-2">Personal learning speed vs market evolution</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Marathon Mode Info Panel */}
            {marathonMode === "marathon" && marathonSession && (
                <div className="glass-card p-6 rounded-2xl border-white/5 mb-12">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                <Play className="w-5 h-5 text-emerald-500" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-emerald-500 text-xs font-bold uppercase tracking-widest">Marathon Session Active</span>
                                    {marathonSession.status === "RUNNING" && (
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                    )}
                                </div>
                                <div className="text-slate-400 text-xs">
                                    Goal: {marathonSession.career_goal} • Cycle #{marathonSession.cycle_count} • {durationHours}h duration
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={handleStopMarathon}
                            className="px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold uppercase tracking-widest hover:bg-red-500/20 transition-all"
                        >
                            Stop
                        </button>
                    </div>

                    {/* Marathon Mode Configuration */}
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2 block">Session Duration (hours)</label>
                            <input
                                type="number"
                                value={durationHours}
                                onChange={(e) => setDurationHours(parseInt(e.target.value))}
                                className="w-full bg-white/5 p-3 rounded-lg border border-white/10 text-white text-sm"
                                min={1}
                                max={168}
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2 block">Check Interval (minutes)</label>
                            <input
                                type="number"
                                value={checkInterval}
                                onChange={(e) => setCheckInterval(parseInt(e.target.value))}
                                className="w-full bg-white/5 p-3 rounded-lg border border-white/10 text-white text-sm"
                                min={5}
                                max={120}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Orchestration Stepper */}
            <div className="flex justify-between mb-20 relative">
                <div className="absolute top-1/2 left-0 w-full h-px bg-white/5 -translate-y-1/2 -z-10"></div>
                {[
                    { s: "RESEARCH", icon: "/market-research.png", label: "Market Research", isImg: true },
                    { s: "QUALIFICATIONS", icon: "/quals-entry.png", label: "Quals Entry", isImg: true },
                    { s: "GAP_ANALYSIS", icon: "/gap-graph.png", label: "Gap Graph", isImg: true },
                    { s: "PARAMETERS", icon: Loader2, label: "Constraints" },
                    { s: "FINAL_BLUEPRINT", icon: ShieldCheck, label: "Blueprint" },
                ].map((item: any, i) => (
                    <div key={i} className={`flex flex-col items-center gap-3 bg-black px-4 transition-all duration-500 ${stage === item.s ? "opacity-100 scale-110" : "opacity-30"}`}>
                        <div className={`w-12 h-12 rounded-full border flex items-center justify-center ${stage === item.s ? "border-primary text-primary" : "border-white/10 text-white"} overflow-hidden bg-white/5`}>
                            {item.isImg ? (
                                <img src={item.icon} alt={item.label} className="w-full h-full object-cover brightness-0 invert opacity-80" />
                            ) : (
                                <item.icon className="w-5 h-5" />
                            )}
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-widest">{item.label}</span>
                    </div>
                ))}
            </div>

            <div className="glass-card rounded-[60px] p-20 border-white/5 relative overflow-hidden min-h-[500px] flex flex-col justify-center">
                <div className="glow-aura opacity-20 top-[-20%] right-[-20%] w-[500px] h-[500px] bg-primary/20"></div>

                {stage === "RESEARCH" && (
                    <div className="animate-fade-in text-center max-w-2xl mx-auto">
                        {!isScraping ? (
                            <>
                                <h2 className="text-5xl font-medium text-white mb-6 tracking-tight">
                                    {marathonMode === "marathon" ? (
                                        "Start Marathon Agent"
                                    ) : marathonMode === "tournament" ? (
                                        <>Launch <span className="text-white/40">Agent Tournament</span></>
                                    ) : marathonMode === "multi_market" ? (
                                        <>Analyze <span className="text-white/40">Global Markets</span></>
                                    ) : marathonMode === "strategic" ? (
                                        <>Generate <span className="text-white/40">Career Trajectory</span></>
                                    ) : (
                                        <>Deploy <span className="text-white/40">Research Agent</span></>
                                    )}
                                </h2>
                                <p className="text-slate-400 mb-12 font-light text-lg">
                                    {marathonMode === "marathon"
                                        ? "This autonomous agent will run for 72 hours, continuously monitoring job markets, detecting shifts, and adjusting your roadmap dynamically without human supervision."
                                        : marathonMode === "tournament"
                                        ? "Multiple research agents with different strategies compete in a tournament. The winning agent's analysis becomes your personalized roadmap."
                                        : marathonMode === "multi_market"
                                        ? "Compare job markets across Kenya, US, and EU simultaneously. Identify salary arbitrage opportunities and undervalued skills for strategic career positioning."
                                        : marathonMode === "strategic"
                                        ? "Generate a complete 5-year career trajectory from Junior to CTO, including velocity tracking, market alignment analysis, and success probability calculations."
                                        : "Tell the agent which role you are targeting. It will scrape live data from Kenyan and Remote job boards."
                                    }
                                </p>
                                {marathonMode === "marathon" && (
                                    <div className="mb-8 p-6 rounded-2xl bg-white/5 border border-primary/20">
                                        <div className="flex items-center gap-3 mb-4">
                                            <Clock className="w-5 h-5 text-primary" />
                                            <span className="text-white text-sm font-bold">Marathon Agent Features:</span>
                                        </div>
                                        <ul className="space-y-2 text-left text-slate-300 text-sm">
                                            <li className="flex items-start gap-2"><span className="text-emerald-500">✓</span> 72-hour continuous operation</li>
                                            <li className="flex items-start gap-2"><span className="text-emerald-500">✓</span> Real-time job market monitoring</li>
                                            <li className="flex items-start gap-2"><span className="text-emerald-500">✓</span> Autonomous agent negotiation</li>
                                            <li className="flex items-start gap-2"><span className="text-emerald-500">✓</span> Dynamic roadmap adjustments</li>
                                            <li className="flex items-start gap-2"><span className="text-emerald-500">✓</span> Vibe Engineering verification</li>
                                        </ul>
                                    </div>
                                )}

                                {marathonMode === "tournament" && (
                                    <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-purple-500/5 to-pink-500/5 border border-purple-500/20">
                                        <div className="flex items-center gap-3 mb-4">
                                            <Trophy className="w-5 h-5 text-purple-400" />
                                            <span className="text-white text-sm font-bold">Agent Tournament Features:</span>
                                        </div>
                                        <ul className="space-y-2 text-left text-slate-300 text-sm">
                                            <li className="flex items-start gap-2"><span className="text-purple-400">🏆</span> Evolutionary algorithm competition</li>
                                            <li className="flex items-start gap-2"><span className="text-purple-400">🤖</span> 4 specialized agent strategies</li>
                                            <li className="flex items-start gap-2"><span className="text-purple-400">📊</span> Performance scoring & leaderboard</li>
                                            <li className="flex items-start gap-2"><span className="text-purple-400">🎯</span> Winning strategy becomes your roadmap</li>
                                            <li className="flex items-start gap-2"><span className="text-purple-400">🧬</span> Strategy evolution for future tournaments</li>
                                        </ul>
                                    </div>
                                )}

                                {marathonMode === "multi_market" && (
                                    <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-blue-500/5 to-green-500/5 border border-blue-500/20">
                                        <div className="flex items-center gap-3 mb-4">
                                            <Globe className="w-5 h-5 text-blue-400" />
                                            <span className="text-white text-sm font-bold">Global Arbitrage Features:</span>
                                        </div>
                                        <ul className="space-y-2 text-left text-slate-300 text-sm">
                                            <li className="flex items-start gap-2"><span className="text-blue-400">🌍</span> 4-market simultaneous analysis</li>
                                            <li className="flex items-start gap-2"><span className="text-blue-400">💰</span> Currency-adjusted salary comparisons</li>
                                            <li className="flex items-start gap-2"><span className="text-blue-400">📈</span> Skill undervaluation detection</li>
                                            <li className="flex items-start gap-2"><span className="text-blue-400">🎯</span> Strategic relocation recommendations</li>
                                            <li className="flex items-start gap-2"><span className="text-blue-400">⚡</span> 2-3x salary arbitrage opportunities</li>
                                        </ul>
                                    </div>
                                )}

                                {marathonMode === "strategic" && (
                                    <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-emerald-500/5 to-teal-500/5 border border-emerald-500/20">
                                        <div className="flex items-center gap-3 mb-4">
                                            <Target className="w-5 h-5 text-emerald-400" />
                                            <span className="text-white text-sm font-bold">Strategic Pathing Features:</span>
                                        </div>
                                        <ul className="space-y-2 text-left text-slate-300 text-sm">
                                            <li className="flex items-start gap-2"><span className="text-emerald-400">📈</span> Complete 5-year career trajectory</li>
                                            <li className="flex items-start gap-2"><span className="text-emerald-400">⚡</span> Personal learning velocity tracking</li>
                                            <li className="flex items-start gap-2"><span className="text-emerald-400">🎯</span> Market alignment analysis</li>
                                            <li className="flex items-start gap-2"><span className="text-emerald-400">📊</span> Success probability calculations</li>
                                            <li className="flex items-start gap-2"><span className="text-emerald-400">💼</span> Executive-level career positioning</li>
                                        </ul>
                                    </div>
                                )}
                                <div className="space-y-12">
                                    <input
                                        type="text"
                                        value={targetRole}
                                        onChange={(e) => setTargetRole(e.target.value)}
                                        placeholder="e.g. AI Engineer, Senior Backend, Cloud Architect..."
                                        className="w-full bg-white/5 p-6 rounded-3xl border border-white/10 focus:border-primary/40 outline-none transition-all text-center text-xl"
                                    />
                                    <button
                                        onClick={handleStartResearch}
                                        disabled={!targetRole}
                                        className={`btn-primary w-full py-6 flex items-center justify-center gap-3 disabled:opacity-50 ${marathonMode === "marathon" ? 'bg-emerald-600 hover:bg-emerald-500' : ''}`}
                                    >
                                        {marathonMode === "marathon" ? "Start 72-Hour Marathon Session" :
                                         marathonMode === "tournament" ? "Launch Agent Tournament 🏆" :
                                         marathonMode === "multi_market" ? "Analyze Global Markets 🌍" :
                                         marathonMode === "strategic" ? "Generate 5-Year Career Path 🎯" :
                                         "Execute Market Scraping"} <ArrowRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="space-y-12">
                                <div className="w-24 h-24 rounded-full border-4 border-primary/20 border-t-primary animate-spin mx-auto"></div>
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-4 uppercase tracking-widest">
                                        {marathonMode === "marathon" ? "Marathon Agent Active" : "Autonomous Scout Active"}
                                    </h3>
                                    <div className="space-y-3">
                                        <p className="text-slate-500 font-mono text-xs animate-pulse"># [SCRIBE] Initiating real-time market scrape...</p>
                                        <p className="text-slate-500 font-mono text-xs delay-75 animate-pulse"># [SCRIBE] Synthesizing industry clusters in Nairobi & Remote...</p>
                                        <p className="text-slate-500 font-mono text-xs delay-150 animate-pulse"># [SCRIBE] Quantifying skill delta via Gemini 3 Flash...</p>
                                        {marathonMode === "marathon" && (
                                            <>
                                                <p className="text-emerald-500 font-mono text-xs delay-225 animate-pulse"># [MARATHON] Starting 72-hour autonomous session...</p>
                                                <p className="text-emerald-500 font-mono text-xs delay-300 animate-pulse"># [MARATHON] Initializing agent message bus...</p>
                                                <p className="text-emerald-500 font-mono text-xs delay-375 animate-pulse"># [MARATHON] All agents standing by for continuous operation...</p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {stage === "QUALIFICATIONS" && (
                    <div className="animate-fade-in max-w-2xl mx-auto w-full">
                        <div className="flex items-center gap-4 mb-8">
                            <CheckCircle2 className="text-emerald-500 w-6 h-6" />
                            <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Market Pulse Synthesized</span>
                        </div>
                        <h2 className="text-5xl font-medium text-white mb-6 tracking-tight">Technical <span className="text-white/40">Audit</span></h2>
                        <p className="text-slate-400 mb-12 font-light text-lg">Key in your skills or let the agent scan your CV for a faster qualification audit.</p>

                        <div className="space-y-10">
                            {/* CV Drop Zone */}
                            <div
                                className={`relative p-10 rounded-[40px] border-2 border-dashed transition-all group flex flex-col items-center justify-center text-center ${cvFile ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-white/10 hover:border-primary/40 bg-white/5'}`}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    const file = e.dataTransfer.files[0];
                                    if (file) handleFileUpload(file);
                                }}
                            >
                                <input
                                    type="file"
                                    accept=".pdf"
                                    onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                                {isExtracting ? (
                                    <div className="flex flex-col items-center gap-4">
                                        <Loader2 className="w-10 h-10 text-primary animate-spin" />
                                        <p className="text-xs font-bold text-primary uppercase tracking-widest">Scanning CV Text...</p>
                                    </div>
                                ) : cvFile ? (
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                                            <FileText className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <p className="text-white font-medium">{cvFile.name}</p>
                                            <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest mt-1">Audit Complete</p>
                                        </div>
                                        <button onClick={(e) => { e.stopPropagation(); setCvFile(null); }} className="text-white/40 hover:text-white transition-colors">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-6">
                                        <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center text-white group-hover:bg-primary transition-all group-hover:text-black">
                                            <Upload className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <p className="text-white font-medium mb-1">Drop your CV here</p>
                                            <p className="text-[10px] text-slate-500 uppercase tracking-widest">PDF format supported • Fast scan</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-4 py-2">
                                <div className="h-px bg-white/5 flex-1"></div>
                                <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Manual Override</span>
                                <div className="h-px bg-white/5 flex-1"></div>
                            </div>

                            <div className="space-y-6">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 block">Foundations & Masteries</label>
                                <textarea
                                    value={qualifications}
                                    onChange={(e) => setQualifications(e.target.value)}
                                    placeholder="Paste CV highlights or list skills (e.g. Python, React, AWS...)"
                                    className="w-full bg-white/5 p-8 rounded-[40px] border border-white/10 focus:border-primary/40 outline-none transition-all min-h-[150px] text-lg font-light"
                                />
                                {uploadError && <p className="text-red-500 text-xs text-center font-bold tracking-widest uppercase">{uploadError}</p>}
                                <button
                                    onClick={handleAnalyzeGaps}
                                    disabled={!qualifications || isExtracting}
                                    className="btn-primary w-full py-6 flex items-center justify-center gap-3 disabled:opacity-50"
                                >
                                    {isAnalyzing ? <Loader2 className="animate-spin" /> : "Proceed to Gap Analysis"} <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {stage === "GAP_ANALYSIS" && marathonMode === "single" && (
                    <div className="animate-fade-in w-full text-center">
                        <h2 className="text-5xl font-medium text-white mb-6 tracking-tight">The <span className="text-white/40">Knowledge Graph</span></h2>
                        <p className="text-slate-400 mb-12 font-light text-lg">We've identified {gapResults?.critical_gaps.length} critical gaps in your profile. Below is your specialized acquisition graph.</p>

                        <div className="relative h-64 mb-12 bg-white/5 rounded-[40px] border border-white/5 flex items-center justify-center overflow-hidden">
                            {/* Simple CSS Graph Visual */}
                            <div className="absolute inset-0 opacity-20">
                                <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full border border-primary animate-pulse"></div>
                                <div className="absolute top-1/2 right-1/4 w-24 h-24 rounded-full border border-accent animate-pulse delay-75"></div>
                                <div className="absolute bottom-1/4 left-1/2 w-48 h-48 rounded-full border border-primary/40 animate-pulse delay-150"></div>
                            </div>
                            <div className="relative z-10 flex gap-12 items-center">
                                {gapResults?.critical_gaps.slice(0, 3).map((gap: string, i: number) => (
                                    <div key={i} className="flex flex-col items-center gap-4">
                                        <div className="w-16 h-16 rounded-full bg-black border-2 border-primary flex items-center justify-center text-primary font-bold shadow-lg shadow-primary/20">
                                            {gap.charAt(0)}
                                        </div>
                                        <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">{gap}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-12 mb-12 text-left">
                            <div className="p-10 rounded-[40px] bg-white/5 border border-white/10">
                                <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 mb-8">Missing Masteries</h3>
                                <div className="space-y-4">
                                    {gapResults?.critical_gaps.map((gap: string) => (
                                        <div key={gap} className="flex items-center gap-4 text-white font-medium">
                                            <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                            {gap}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="p-10 rounded-[40px] bg-white/5 border border-white/10 flex flex-col justify-center items-center text-center">
                                <div className="text-6xl font-black text-primary mb-4">{gapResults?.skill_graph.edges}</div>
                                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Synthesized Knowledge Edges</div>
                            </div>
                        </div>

                        <button
                            onClick={() => setStage("PARAMETERS")}
                            className="btn-primary px-12 py-6 flex items-center justify-center gap-3 mx-auto"
                        >
                            Define Strategy Parameters <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                )}

                {/* NEW: Marathon Mode - Show Thought Signatures */}
                {marathonMode === "marathon" && (
                    <div className="animate-fade-in w-full">
                        <div className="flex items-center gap-3 mb-6">
                            <Database className="w-5 h-5 text-primary" />
                            <span className="text-xs font-bold text-primary uppercase tracking-widest">PostgreSQL Persistence Active</span>
                        </div>
                        <h2 className="text-5xl font-medium text-white mb-6 tracking-tight">Thought <span className="text-white/40">Signatures</span></h2>
                        <p className="text-slate-400 mb-8 font-light text-lg">Real-time agent checkpointing with complete audit trail and resume capability.</p>

                        <div className="space-y-4">
                            {thoughtSignatures.length === 0 ? (
                                <div className="p-12 rounded-2xl bg-white/5 border border-white/10 text-center">
                                    <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
                                    <p className="text-slate-400 text-sm">Waiting for agent activity...</p>
                                </div>
                            ) : (
                                thoughtSignatures.map((sig, idx) => (
                                    <div key={idx} className="glass-card p-6 rounded-2xl border-white/5 hover:border-white/10 transition-all">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${sig.global_state === "RESEARCHING" ? "bg-blue-500/20" :
                                                    sig.global_state === "PLANNING" ? "bg-purple-500/20" :
                                                        sig.global_state === "EXECUTING" ? "bg-orange-500/20" :
                                                            sig.global_state === "VERIFYING" ? "bg-emerald-500/20" : "bg-white/5"
                                                    }`}>
                                                    {sig.global_state === "RESEARCHING" && <Search className="w-4 h-4 text-blue-500" />}
                                                    {sig.global_state === "PLANNING" && <Map className="w-4 h-4 text-purple-500" />}
                                                    {sig.global_state === "EXECUTING" && <Zap className="w-4 h-4 text-orange-500" />}
                                                    {sig.global_state === "VERIFYING" && <ShieldCheck className="w-4 h-4 text-emerald-500" />}
                                                </div>
                                                <span className="text-xs font-bold text-white uppercase">{sig.step}</span>
                                            </div>
                                            <span className="text-[9px] text-slate-500 font-mono">{new Date(sig.timestamp).toLocaleTimeString()}</span>
                                        </div>

                                        {sig.metadata && (
                                            <div className="bg-black/50 p-4 rounded-xl">
                                                {sig.global_state === "RESEARCHING" && (
                                                    <>
                                                        <p className="text-emerald-400 text-xs mb-2">Jobs analyzed: {sig.metadata.jobs_analyzed}</p>
                                                        <p className="text-slate-400 text-xs">Sources: {sig.metadata.sources?.join(", ")}</p>
                                                    </>
                                                )}
                                                {sig.global_state === "PLANNING" && (
                                                    <>
                                                        <p className="text-purple-400 text-xs mb-2">Milestones: {sig.metadata.milestones}</p>
                                                        <p className="text-slate-400 text-xs">Strategy: {sig.metadata.strategy}</p>
                                                    </>
                                                )}
                                                {sig.global_state === "EXECUTING" && (
                                                    <>
                                                        <p className="text-orange-400 text-xs mb-2">Resources verified: {sig.metadata.verified_count}</p>
                                                        <p className="text-emerald-500 text-xs">Quality score: {sig.metadata.avg_quality}</p>
                                                    </>
                                                )}
                                                {sig.global_state === "VERIFYING" && (
                                                    <>
                                                        <p className="text-emerald-400 text-xs mb-2">Quiz ready: {sig.metadata.quiz_ready ? "✓" : "✗"}</p>
                                                        <p className="text-slate-400 text-xs">Interview ready: {sig.metadata.interview_ready ? "✓" : "✗"}</p>
                                                    </>
                                                )}
                                            </div>
                                        )}

                                        {/* Agent Negotiation Alerts */}
                                        {sig.global_state === "URGENT" && (
                                            <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <AlertTriangle className="w-5 h-5 text-red-500" />
                                                    <span className="text-xs font-bold text-red-500 uppercase tracking-widest">Urgent Message Detected</span>
                                                </div>
                                                <div className="text-sm text-slate-300">
                                                    <p className="mb-2"><strong>From:</strong> {sig.metadata.from_agent}</p>
                                                    <p className="mb-2"><strong>Type:</strong> {sig.metadata.message_type}</p>
                                                    <p className="text-white/80"><strong>Data:</strong> {sig.metadata.data}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Add gap analysis button in marathon mode */}
                        {marathonMode === "marathon" && jobsFound.length > 0 && (
                            <div className="mt-8 pt-8 border-t border-white/10">
                                <button
                                    onClick={handleAnalyzeGaps}
                                    disabled={isAnalyzing}
                                    className="btn-primary w-full py-6 flex items-center justify-center gap-3"
                                >
                                    {isAnalyzing ? <Loader2 className="animate-spin" /> : "Analyze Market Gaps & View Roadmap"} <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {stage === "PARAMETERS" && (
                    <div className="animate-fade-in max-w-2xl mx-auto w-full">
                        <h2 className="text-5xl font-medium text-white mb-6 tracking-tight">Strategy <span className="text-white/40">Parameters</span></h2>
                        <p className="text-slate-400 mb-12 font-light text-lg">Help the agent tailor your blueprint. How much time do you have and what are your constraints?</p>

                        <div className="grid grid-cols-2 gap-8 mb-8">
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-4 block">Experience Level</label>
                                <select
                                    value={skillLevel}
                                    onChange={(e) => setSkillLevel(e.target.value)}
                                    className="w-full bg-white/5 p-5 rounded-[20px] border border-white/10 text-white outline-none"
                                >
                                    <option value="beginner" className="bg-slate-900">Beginner</option>
                                    <option value="intermediate" className="bg-slate-900">Intermediate</option>
                                    <option value="advanced" className="bg-slate-900">Advanced</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-4 block">Hours / Week</label>
                                <input
                                    type="number"
                                    value={hoursPerWeek}
                                    onChange={(e) => setHoursPerWeek(parseInt(e.target.value))}
                                    className="w-full bg-white/5 p-5 rounded-[20px] border border-white/10 text-white outline-none"
                                />
                            </div>
                        </div>

                        <div className="mb-12">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-4 block">Specific Constraints (e.g. Offline access, Free only)</label>
                            <input
                                type="text"
                                value={userConstraints}
                                onChange={(e) => setUserConstraints(e.target.value)}
                                placeholder="Low bandwidth, M-Pesa projects only, etc."
                                className="w-full bg-white/5 p-6 rounded-[20px] border border-white/10 focus:border-primary/40 outline-none transition-all"
                            />
                        </div>

                        <button
                            onClick={handleBuildRoadmap}
                            disabled={isAnalyzing}
                            className="btn-primary w-full py-6 flex items-center justify-center gap-3"
                        >
                            {isAnalyzing ? <Loader2 className="animate-spin" /> : "Orchestrate Final Blueprint"} <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
