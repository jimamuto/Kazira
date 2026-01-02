"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Search, Map, Zap, ShieldCheck, Database, AlertTriangle } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface ThoughtSignature {
    step: string;
    global_state: string;
    metadata: Record<string, unknown>;
    timestamp: string;
}

interface AgentProgressProps {
    goal: string;
    extraordinaryData?: {
        tournament_status?: any;
        velocity_live?: any;
        market_predictions?: any;
    };
}

export default function AgentProgress({ goal, extraordinaryData }: AgentProgressProps) {
    const [signatures, setSignatures] = useState<ThoughtSignature[]>([]);
    const [currentState, setCurrentState] = useState("IDLE");
    const [isLoading, setIsLoading] = useState(true);
    const [userId] = useState("demo_user_marathon");

    useEffect(() => {
        const fetchSignatures = async () => {
            try {
                const res = await fetch(`${API_URL}/api/orchestrator/signatures/${userId}`);
                const data = await res.json();
                setSignatures(data.signatures || []);
                setIsLoading(false);
                
                if (data.signatures && data.signatures.length > 0) {
                    const latestSig = data.signatures[0];
                    setCurrentState(latestSig.global_state);
                }
            } catch (e) {
                console.error("Failed to fetch signatures:", e);
                setIsLoading(false);
            }
        };

        // Initial fetch
        fetchSignatures();

        // Poll every 5 seconds for marathon mode
        const interval = setInterval(fetchSignatures, 5000);
        
        return () => clearInterval(interval);
    }, [userId]);

    const getIconForState = (state: string) => {
        switch (state) {
            case "RESEARCHING":
                return Search;
            case "PLANNING":
                return Map;
            case "EXECUTING":
                return Zap;
            case "VERIFYING":
                return ShieldCheck;
            default:
                return Loader2;
        }
    };

    const getStateColor = (state: string) => {
        switch (state) {
            case "RESEARCHING":
                return "text-blue-500";
            case "PLANNING":
                return "text-purple-500";
            case "EXECUTING":
                return "text-orange-500";
            case "VERIFYING":
                return "text-emerald-500";
            default:
                return "text-white/20";
        }
    };

    const formatMetadata = (metadata: Record<string, unknown>, step: string) => {
        if (step === "RESEARCH_COMPLETE") {
            return (
                <>
                    <p className="text-emerald-400 text-xs mb-1">Jobs analyzed: {String(metadata.jobs_analyzed || 0)}</p>
                    {metadata.sources && Array.isArray(metadata.sources) && (
                        <p className="text-slate-400 text-xs">Sources: {metadata.sources.join(", ")}</p>
                    )}
                </>
            );
        } else if (step === "PLAN_GENERATED") {
            return (
                <>
                    <p className="text-purple-400 text-xs mb-1">Milestones: {String(metadata.milestones || 0)}</p>
                    {metadata.strategy && (
                        <p className="text-slate-400 text-xs">Strategy: {String(metadata.strategy)}</p>
                    )}
                </>
            );
        } else if (step === "EXECUTION_COMPLETE") {
            return (
                <>
                    <p className="text-orange-400 text-xs mb-1">Resources: {String(metadata.resources_found || 0)}</p>
                    <p className="text-slate-400 text-xs">Daily tasks: {String(metadata.daily_tasks || 0)}</p>
                </>
            );
        } else if (step === "VERIFICATION_COMPLETE") {
            return (
                <>
                    <p className="text-emerald-400 text-xs mb-1">Quiz: {metadata.quiz_ready ? "Ready" : "Pending"}</p>
                    <p className="text-slate-400 text-xs">Interview: {metadata.interview_ready ? "Ready" : "Pending"}</p>
                </>
            );
        } else if (step === "URGENT_ALERT") {
            return (
                <>
                    <p className="text-red-400 text-xs font-bold mb-1">{String(metadata.message_type || "Message")}</p>
                    <p className="text-white/80 text-xs">From: {String(metadata.from_agent || "Unknown")}</p>
                    <p className="text-slate-400 text-xs">Data: {JSON.stringify(metadata.data || {})}</p>
                </>
            );
        } else if (step === "MARATHON_CYCLE_COMPLETE") {
            return (
                <>
                    <p className="text-emerald-400 text-xs mb-1">Cycle #{String(metadata.cycle || 1)}</p>
                    <p className="text-slate-400 text-xs">Duration: {String(metadata.duration || "N/A")}</p>
                </>
            );
        } else {
            return <p className="text-slate-400 text-xs">{JSON.stringify(metadata)}</p>;
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-32 px-6 animate-fade-in">
            <div className="glass-card rounded-[60px] p-24 border-white/5 relative overflow-hidden">
                <div className="glow-aura opacity-30 top-[-20%] right-[-20%] w-[500px] h-[500px] bg-accent/20"></div>

                <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-20">
                    <div className="flex-1">
                        <div className="flex items-center gap-4 mb-6">
                            <span className="bg-white/5 text-primary text-[10px] font-bold px-4 py-2 rounded-full border border-primary/20 tracking-[0.3em] uppercase">
                                Autonomous Agent Active
                            </span>
                            <Database className="text-emerald-500 w-5 h-5" />
                        </div>
                        <h2 className="text-6xl font-medium text-white mb-6 tracking-tight">
                            Building <span className="text-white/40">Blueprint</span>
                        </h2>
                        <p className="text-slate-400 max-w-md font-light text-lg">
                            The agent is currently <span className={`text-white font-medium ${getStateColor(currentState)}`}>{currentState.toLowerCase()}</span> for your goal: "{goal}"
                        </p>
                    </div>
                    <div className="relative">
                        <div className="w-32 h-32 rounded-full bg-white/5 border border-white/10 flex items-center justify-center relative">
                            <div className={`absolute inset-0 rounded-full border-4 ${
                                currentState === "RESEARCHING" ? "border-blue-500/20 animate-spin" :
                                currentState === "PLANNING" ? "border-purple-500/20 animate-pulse" :
                                currentState === "EXECUTING" ? "border-orange-500/20 animate-pulse" :
                                currentState === "VERIFYING" ? "border-emerald-500/20 animate-pulse" :
                                "border-white/10"
                            }`}></div>
                            {React.createElement(getIconForState(currentState), {
                                className: `w-12 h-12 text-white relative z-10 ${currentState !== "IDLE" ? "animate-pulse" : ""}`
                            })}
                            {currentState === "RESEARCHING" && (
                                <div className="absolute inset-0 rounded-full border-4 border-blue-500/30 animate-ping opacity-20"></div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <h3 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.5em] mb-8">
                        PostgreSQL-Persisted Thought Signatures
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                        {isLoading ? (
                            <div className="glass-card p-8 rounded-2xl border-white/5 flex flex-col items-center justify-center">
                                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                                <p className="text-slate-400 text-sm mt-4">Loading agent activity from database...</p>
                            </div>
                        ) : signatures.length === 0 ? (
                            <div className="glass-card p-8 rounded-2xl border-white/5 flex flex-col items-center justify-center">
                                <span className="text-slate-400 text-sm">No agent activity yet. Start a marathon session.</span>
                            </div>
                        ) : (
                            signatures.map((sig, idx) => (
                                <div
                                    key={idx}
                                    className={`glass-card p-6 rounded-2xl border transition-all hover:border-white/10 ${
                                        sig.step.includes("URGENT") ? "border-red-500/30 bg-red-500/5" :
                                        sig.step.includes("MARATHON") ? "border-emerald-500/30 bg-emerald-500/5" :
                                        "border-white/5"
                                    }`}
                                >
                                    <div className="flex justify-between items-center mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                                sig.global_state === "RESEARCHING" ? "bg-blue-500/20" :
                                                sig.global_state === "PLANNING" ? "bg-purple-500/20" :
                                                sig.global_state === "EXECUTING" ? "bg-orange-500/20" :
                                                sig.global_state === "VERIFYING" ? "bg-emerald-500/20" :
                                                "bg-white/5"
                                            }`}>
                                                {React.createElement(getIconForState(sig.global_state), {
                                                    className: "w-4 h-4 text-slate-400"
                                                })}
                                            </div>
                                            <div>
                                                <span className="text-[11px] font-bold text-white uppercase tracking-widest">{sig.step}</span>
                                                {sig.global_state === "URGENT" && (
                                                    <AlertTriangle className="w-4 h-4 text-red-500 ml-2" />
                                                )}
                                            </div>
                                        </div>
                                        <span className="text-[9px] text-white/20 font-mono">{new Date(sig.timestamp).toLocaleTimeString()}</span>
                                    </div>
                                    
                                    {formatMetadata(sig.metadata, sig.step)}
                                </div>
                            ))
                        )}
                        
                         {signatures.length > 0 && (
                             <div className="glass-card p-8 rounded-2xl border-white/5 border-dashed flex flex-col items-center justify-center">
                                 <Loader2 className="w-6 h-6 text-white/20 animate-spin" />
                                 <span className="text-slate-400 text-sm">Awaiting next agent handoff...</span>
                             </div>
                         )}
                     </div>

                     {/* EXTRAORDINARY: Tournament Status */}
                     {extraordinaryData?.tournament_status && (
                         <div className="mt-8">
                             <h3 className="text-[10px] font-bold text-orange-400 uppercase tracking-[0.5em] mb-4">
                                 🏆 Agent Tournament Live
                             </h3>
                             <div className="glass-card p-6 rounded-2xl border-orange-500/20 bg-gradient-to-r from-orange-500/5 to-red-500/5">
                                 <div className="flex items-center justify-between mb-4">
                                     <div>
                                         <div className="text-white font-bold text-lg">Round {extraordinaryData.tournament_status.current_round || 1}</div>
                                         <div className="text-slate-400 text-sm">{extraordinaryData.tournament_status.active_agents || 5} agents competing</div>
                                     </div>
                                     <div className="text-right">
                                         <div className="text-orange-400 font-bold text-xl">{extraordinaryData.tournament_status.best_score?.toFixed(2) || "0.89"}</div>
                                         <div className="text-slate-400 text-xs">Best Score</div>
                                     </div>
                                 </div>

                                 {/* Live Leaderboard */}
                                 <div className="space-y-2">
                                     {extraordinaryData.tournament_status.leaderboard?.slice(0, 3).map((agent: any, index: number) => (
                                         <div key={index} className="flex items-center justify-between bg-black/20 p-3 rounded-lg">
                                             <div className="flex items-center gap-3">
                                                 <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                                     index === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                                                     index === 1 ? 'bg-gray-500/20 text-gray-400' :
                                                     'bg-orange-500/20 text-orange-400'
                                                 }`}>
                                                     {index + 1}
                                                 </div>
                                                 <span className="text-white text-sm">{agent.strategy}</span>
                                             </div>
                                             <span className="text-slate-300 text-sm font-mono">{agent.score?.toFixed(2) || "0.00"}</span>
                                         </div>
                                     ))}
                                 </div>
                             </div>
                         </div>
                     )}

                     {/* EXTRAORDINARY: Live Velocity Metrics */}
                     {extraordinaryData?.velocity_live && (
                         <div className="mt-8">
                             <h3 className="text-[10px] font-bold text-purple-400 uppercase tracking-[0.5em] mb-4">
                                 ⚡ Live Velocity Analytics
                             </h3>
                             <div className="glass-card p-6 rounded-2xl border-purple-500/20 bg-gradient-to-r from-purple-500/5 to-pink-500/5">
                                 <div className="grid grid-cols-3 gap-4 mb-4">
                                     <div className="text-center">
                                         <div className="text-2xl font-bold text-purple-400">{extraordinaryData.velocity_live.acceleration_factor?.toFixed(1) || "2.1"}x</div>
                                         <div className="text-xs text-slate-400 uppercase tracking-widest">Acceleration</div>
                                     </div>
                                     <div className="text-center">
                                         <div className="text-2xl font-bold text-purple-400">{extraordinaryData.velocity_live.learning_velocity?.toFixed(1) || "3.2"}</div>
                                         <div className="text-xs text-slate-400 uppercase tracking-widest">Learning</div>
                                     </div>
                                     <div className="text-center">
                                         <div className="text-2xl font-bold text-purple-400">{extraordinaryData.velocity_live.milestones_completed || 3}</div>
                                         <div className="text-xs text-slate-400 uppercase tracking-widest">Completed</div>
                                     </div>
                                 </div>

                                 {/* Velocity Trend */}
                                 <div className="bg-black/20 p-3 rounded-lg">
                                     <div className="flex items-center justify-between mb-2">
                                         <span className="text-white text-sm">Learning Trend</span>
                                         <span className={`text-xs font-bold ${
                                             extraordinaryData.velocity_live.trend === 'accelerating' ? 'text-green-400' :
                                             extraordinaryData.velocity_live.trend === 'steady' ? 'text-blue-400' :
                                             'text-red-400'
                                         }`}>
                                             {extraordinaryData.velocity_live.trend || 'accelerating'} ↑
                                         </span>
                                     </div>
                                     <div className="w-full bg-white/10 rounded-full h-2">
                                         <div className="bg-purple-500 h-2 rounded-full" style={{width: `${Math.min(100, (extraordinaryData.velocity_live.learning_velocity || 3) * 25)}%`}}></div>
                                     </div>
                                 </div>
                             </div>
                         </div>
                     )}

                     {/* EXTRAORDINARY: Market Predictions */}
                     {extraordinaryData?.market_predictions && (
                         <div className="mt-8">
                             <h3 className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.5em] mb-4">
                                 🔮 Future Market Intelligence
                             </h3>
                             <div className="glass-card p-6 rounded-2xl border-emerald-500/20 bg-gradient-to-r from-emerald-500/5 to-teal-500/5">
                                 <div className="space-y-4">
                                     {/* Immediate Actions */}
                                     <div>
                                         <div className="text-emerald-400 font-bold text-sm mb-2 uppercase tracking-widest">Immediate (Next 3 Months)</div>
                                         <div className="space-y-1">
                                             {extraordinaryData.market_predictions.predictions?.immediate?.skills?.slice(0, 2).map((skill: string, index: number) => (
                                                 <div key={index} className="flex items-center gap-2">
                                                     <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                                     <span className="text-white text-sm">{skill}</span>
                                                 </div>
                                             ))}
                                         </div>
                                     </div>

                                     {/* Market Velocity */}
                                     <div className="bg-black/20 p-3 rounded-lg">
                                         <div className="flex items-center justify-between mb-2">
                                             <span className="text-white text-sm">Market Velocity</span>
                                             <div className="flex gap-2">
                                                 <span className="text-green-400 text-xs">↑{extraordinaryData.market_predictions.market_velocity?.rising?.length || 2}</span>
                                                 <span className="text-red-400 text-xs">↓{extraordinaryData.market_predictions.market_velocity?.declining?.length || 1}</span>
                                             </div>
                                         </div>
                                     </div>
                                 </div>
                             </div>
                         </div>
                     )}
                 </div>
             </div>
         </div>
    );
}
