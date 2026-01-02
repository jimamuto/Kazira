"use client";

import { useState } from "react";
import { CheckCircle2, Circle, Clock, Youtube, Play, BookOpen, ExternalLink, Calendar, Bell, ChevronRight, Activity, Sparkles, ShieldCheck, Database } from "lucide-react";
import { RoadmapOutput } from "@/types/roadmap";

interface ExecutionViewProps {
    roadmap: RoadmapOutput;
    onBack: () => void;
    extraordinaryData?: {
        multi_market_results?: any;
        market_predictions?: any;
    };
}

interface VerifiedResource {
    name: string;
    url: string;
    type: string;
    verification_score: number;
    test_summary: string;
    verified_at: string;
}

export default function ExecutionView({ roadmap, onBack, extraordinaryData }: ExecutionViewProps) {
    const schedule = roadmap.execution_schedule;
    const [selectedSprintIndex, setSelectedSprintIndex] = useState(0);
    const [completedTasks, setCompletedTasks] = useState<Record<number, number[]>>({});
    const [verifiedResources, setVerifiedResources] = useState<VerifiedResource[]>([]);

    if (!schedule || !schedule.sprints || schedule.sprints.length === 0) {
        return (
            <div className="text-center py-20">
                <h3 className="text-white text-2xl font-light">Deploying Sprints...</h3>
                <p className="text-slate-500 mt-4">The Execution Agent is synthesizing your 4-week path.</p>
            </div>
        );
    }

    const currentSprint = schedule.sprints[selectedSprintIndex];

    const toggleTask = (sprintIdx: number, taskIdx: number) => {
        setCompletedTasks(prev => {
            const sprintTasks = prev[sprintIdx] || [];
            const newSprintTasks = sprintTasks.includes(taskIdx)
                ? sprintTasks.filter(i => i !== taskIdx)
                : [...sprintTasks, taskIdx];
            return { ...prev, [sprintIdx]: newSprintTasks };
        });
    };

    const totalDays = schedule.sprints.reduce((acc: number, s: any) => acc + s.days.length, 0);
    const totalCompleted = Object.values(completedTasks).reduce((acc: number, tasks: number[]) => acc + tasks.length, 0);
    const overallProgress = Math.round((totalCompleted / totalDays) * 100);

    const currentSprintCompleted = completedTasks[selectedSprintIndex]?.length || 0;
    const sprintProgress = Math.round((currentSprintCompleted / currentSprint.days.length) * 100);

    // Get resources for current month/phase with verification scores
    const currentMonth = roadmap.months[0];
    const allResources = currentMonth.resources || [];

    // Filter resources by type
    const videoResources = allResources.filter(r => r.type === 'video' || r.type === 'video-lab');
    const courseResources = allResources.filter(r => r.type === 'course' || r.type === 'tutorial');

    // Group resources by verification status (mock for now)
    const highlyVerified = allResources.filter(r => r.type === 'video');
    const verified = allResources.filter(r => r.type === 'course');
    const moderateQuality = allResources.filter(r => r.type === 'documentation');

    return (
        <div className="max-w-7xl mx-auto py-20 px-6 animate-fade-in">
            {/* Nav Header */}
            <div className="flex justify-between items-center mb-12">
                <button onClick={onBack} className="text-slate-400 hover:text-white flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-colors">
                    <ChevronRight className="w-4 h-4 rotate-180" /> Back to Blueprint
                </button>
                <div className="flex items-center gap-3">
                    <Database className="text-emerald-500 w-5 h-5" />
                    <div className="px-6 py-2 rounded-full border border-white/5 bg-white/5 text-[10px] font-bold text-primary uppercase tracking-widest">
                        Vibe Engineering Active
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <div className="grid lg:grid-cols-2 gap-12 items-end mb-20">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <Activity className="text-primary w-5 h-5" />
                        <span className="text-[10px] font-bold text-primary uppercase tracking-[0.3em]">Active Execution Protocol</span>
                    </div>
                    <h2 className="text-7xl font-medium text-white mb-6 tracking-tighter">Daily <span className="text-white/40">Sprints</span></h2>
                    <p className="text-slate-400 font-light text-xl leading-relaxed">
                        Currently executing <span className="text-white font-medium">{currentSprint.milestone_title}</span>.
                        Targeting <span className="text-white font-medium">{currentSprint.focus_area}</span>.
                    </p>
                </div>

                <div className="flex flex-col gap-6 lg:items-end">
                    <div className="flex gap-2 p-1.5 bg-white/5 rounded-2xl border border-white/5">
                        {schedule.sprints.map((s, i) => (
                            <button
                                key={i}
                                onClick={() => setSelectedSprintIndex(i)}
                                className={`px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${selectedSprintIndex === i ? 'bg-primary text-black shadow-lg shadow-primary/20' : 'text-slate-500 hover:text-white'}`}
                            >
                                Week {s.week_number} {i === 0 ? "(Active)" : ""}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Analytics Bar */}
            <div className="grid md:grid-cols-4 gap-8 mb-20">
                <div className="glass-card p-8 rounded-[40px] border-white/5">
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-4">Sprint Progress</span>
                    <div className="flex items-end gap-3">
                        <div className="text-5xl font-black text-white">{sprintProgress}%</div>
                        <div className="text-[10px] font-bold text-emerald-500 mb-2 uppercase tracking-widest">Week {currentSprint.week_number}</div>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full mt-6 overflow-hidden">
                        <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${sprintProgress}%` }} />
                    </div>
                </div>

                <div className="glass-card p-8 rounded-[40px] border-white/5">
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-4">Total Mastery</span>
                    <div className="text-5xl font-black text-white">{overallProgress}%</div>
                    <p className="text-[10px] text-slate-500 mt-6 font-bold uppercase tracking-widest">Across {schedule.sprints.length} Sprints</p>
                </div>

                <div className="glass-card p-8 rounded-[40px] border-white/5">
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-4">Vibe Engineering</span>
                    <div className="text-5xl font-black text-emerald-500">
                        {moderateQuality.length + highlyVerified.length}
                    </div>
                    <p className="text-[10px] text-slate-500 mt-6 font-bold uppercase tracking-widest">Resources Verified</p>
                </div>

                <div className="glass-card p-8 rounded-[40px] border-white/5">
                    <div className="flex items-center gap-3 mb-4">
                        <Sparkles className="text-primary w-5 h-5" />
                        <span className="text-[10px] font-bold text-primary uppercase tracking-[0.3em]">Agent Strategy</span>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed italic">
                        "Optimized for your {roadmap.hours_per_week}h/week limit. Week {currentSprint.week_number} focuses on {currentSprint.focus_area}."
                    </p>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-16">
                {/* Daily Schedule */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                        <Calendar className="text-white/20 w-5 h-5" />
                        <h3 className="text-xs font-bold text-white uppercase tracking-[0.3em]">Execution Steps</h3>
                    </div>

                    {currentSprint.days.map((day, idx) => {
                        const isDone = completedTasks[selectedSprintIndex]?.includes(idx);
                        return (
                            <div
                                key={idx}
                                onClick={() => toggleTask(selectedSprintIndex, idx)}
                                className={`glass-card p-8 rounded-[35px] border transition-all cursor-pointer group ${isDone ? 'border-emerald-500/40 bg-emerald-500/5 opacity-60 scale-[0.98]' : 'border-white/5 hover:border-white/20'}`}
                            >
                                <div className="flex justify-between items-center">
                                    <div className="flex gap-8 items-center">
                                        <div className={`transition-colors ${isDone ? 'text-emerald-500' : 'text-white/10'}`}>
                                            {isDone ? <CheckCircle2 className="w-8 h-8" /> : <Circle className="w-8 h-8" />}
                                        </div>
                                        <div>
                                            <div className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em] mb-2">{day.day}</div>
                                            <h4 className="text-2xl font-medium text-white mb-4 group-hover:text-primary transition-colors">{day.topic}</h4>
                                            <div className="flex items-center gap-6">
                                                <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase font-bold tracking-widest">
                                                    <Clock className="w-3.5 h-3.5" /> {day.duration_min}m session
                                                </div>
                                                <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase font-bold tracking-widest bg-white/5 px-4 py-1.5 rounded-full border border-white/10">
                                                    <Bell className="w-3 h-3.5" /> {day.reminder_text}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <ChevronRight className="w-6 h-6 text-white/5 group-hover:text-white group-hover:translate-x-1 transition-all" />
                            </div>
                        );
                    })}
                </div>

                {/* Resources with Vibe Engineering Scores */}
                <div className="space-y-12">
                    <div>
                        <div className="flex items-center gap-3 mb-8">
                            <Youtube className="text-red-500 w-5 h-5" />
                            <h3 className="text-xs font-bold text-white uppercase tracking-[0.3em]">Video Labs</h3>
                        </div>
                        
                        {videoResources.length > 0 ? (
                            <div className="space-y-8">
                                {videoResources.slice(0, 2).map((res, i) => (
                                    <a key={i} href={res.url} target="_blank" className="block group">
                                        <div className="relative aspect-video rounded-[30px] overflow-hidden mb-5 border border-white/5 hover:border-primary/40 transition-all shadow-2xl">
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-10"></div>
                                            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent h-20 p-6 flex flex-col justify-end">
                                                <div className="bg-emerald-500/20 backdrop-blur-md w-max px-3 py-1 rounded-full text-[8px] font-bold text-emerald-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                                                    <ShieldCheck className="w-3 h-3" />
                                                    {res.type === 'video' ? "95%" : res.type === 'course' ? "90%" : "85%"}
                                                </div>
                                                <span className="text-white text-sm font-medium">{res.name}</span>
                                            </div>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        ) : (
                            <div className="p-12 rounded-2xl bg-white/5 border border-white/5 text-center">
                                <p className="text-slate-400 text-sm">No video resources found for this phase.</p>
                            </div>
                        )}
                    </div>

                    <div>
                        <div className="flex items-center gap-3 mb-8">
                            <BookOpen className="text-primary w-5 h-5" />
                            <h3 className="text-xs font-bold text-white uppercase tracking-[0.3em]">Vibe-Verified Resources</h3>
                        </div>
                        
                        {allResources.length > 0 ? (
                            <div className="space-y-4">
                                {/* Highly Verified (90%+) */}
                                {highlyVerified.length > 0 && (
                                    <div className="mb-6">
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30">
                                                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                                            </div>
                                            <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Highly Verified (90%+)</span>
                                        </div>
                                        <div className="space-y-3">
                                            {highlyVerified.map((res, i) => (
                                                <a
                                                    key={i}
                                                    href={res.url}
                                                    target="_blank"
                                                    className="flex items-start justify-between p-6 rounded-3xl bg-white/5 border border-emerald-500/20 hover:border-emerald-500/40 transition-all group"
                                                >
                                                    <div>
                                                        <span className="text-white font-medium group-hover:text-primary transition-colors block mb-2">{res.name}</span>
                                                        <div className="flex gap-4">
                                                            <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">{res.type}</span>
                                                            <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold border-l border-white/10 pl-4">{res.cost}</span>
                                                        </div>
                                                        {res.type === 'video' && (
                                                            <div className="flex items-center gap-2 mt-2">
                                                                <div className="px-2 py-1 rounded-full bg-emerald-500/10 text-[9px] font-bold text-emerald-500">
                                                                    95%
                                                                </div>
                                                                <span className="text-slate-400 text-xs">verified</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <ExternalLink className="w-6 h-6 text-slate-400 group-hover:text-white transition-colors" />
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                
                                {/* Verified (80%+) */}
                                {verified.length > 0 && (
                                    <div className="mb-6">
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="px-3 py-1 rounded-full bg-primary/20 border border-primary/30">
                                                <CheckCircle2 className="w-3 h-3 text-primary" />
                                            </div>
                                            <span className="text-xs font-bold text-primary uppercase tracking-widest">Verified (80%+)</span>
                                        </div>
                                        <div className="space-y-3">
                                            {verified.map((res, i) => (
                                                <a
                                                    key={i}
                                                    href={res.url}
                                                    target="_blank"
                                                    className="flex items-start justify-between p-6 rounded-3xl bg-white/5 border border-primary/20 hover:border-primary/40 transition-all group"
                                                >
                                                    <div>
                                                        <span className="text-white font-medium group-hover:text-primary transition-colors block mb-2">{res.name}</span>
                                                        <div className="flex gap-4">
                                                            <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">{res.type}</span>
                                                            <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold border-l border-white/10 pl-4">{res.cost}</span>
                                                        </div>
                                                        {res.type === 'documentation' && (
                                                            <div className="flex items-center gap-2 mt-2">
                                                                <div className="px-2 py-1 rounded-full bg-orange-500/10 text-[9px] font-bold text-orange-500">
                                                                    85%
                                                                </div>
                                                                <span className="text-slate-400 text-xs">verified</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <ExternalLink className="w-6 h-6 text-slate-400 group-hover:text-white transition-colors" />
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                
                                {/* Moderate Quality (60-+79%) */}
                                {moderateQuality.length > 0 && (
                                    <div>
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/30">
                                                <ShieldCheck className="w-3 h-3 text-orange-500" />
                                            </div>
                                            <span className="text-xs font-bold text-orange-500 uppercase tracking-widest">Moderate Quality (60-79%)</span>
                                        </div>
                                        <div className="space-y-3">
                                            {moderateQuality.map((res, i) => (
                                                <a
                                                    key={i}
                                                    href={res.url}
                                                    target="_blank"
                                                    className="flex items-start justify-between p-6 rounded-3xl bg-white/5 border border-orange-500/20 hover:border-orange-500/40 transition-all group"
                                                >
                                                    <div>
                                                        <span className="text-white font-medium group-hover:text-orange-400 transition-colors block mb-2">{res.name}</span>
                                                        <div className="flex gap-4">
                                                            <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">{res.type}</span>
                                                            <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold border-l border-white/10 pl-4">{res.cost}</span>
                                                        </div>
                                                        {res.type === 'course' && (
                                                            <div className="flex items-center gap-2 mt-2">
                                                                <div className="px-2 py-1 rounded-full bg-blue-500/10 text-[9px] font-bold text-blue-500">
                                                                    90%
                                                                </div>
                                                                <span className="text-slate-400 text-xs">verified</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <ExternalLink className="w-6 h-6 text-slate-400 group-hover:text-white transition-colors" />
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {allResources.length === 0 && (
                                    <div className="p-12 rounded-2xl bg-white/5 border border-white/5 text-center">
                                        <p className="text-slate-400 text-sm">No resources found yet. Execution Agent is verifying...</p>
                                        <div className="mt-4 flex justify-center">
                                            <Play className="w-10 h-10 text-primary animate-spin" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="p-12 rounded-2xl bg-white/5 border border-white/5 text-center">
                                <p className="text-slate-400 text-sm">No resources found for this phase.</p>
                            </div>
                         )}
                     </div>

                     {/* EXTRAORDINARY: Multi-Market Intelligence */}
                     {extraordinaryData?.multi_market_results && (
                         <div className="mt-16 border-t border-blue-500/20 pt-16">
                             <div className="flex items-center gap-3 mb-8">
                                 <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-green-500/20 flex items-center justify-center">
                                     🌍
                                 </div>
                                 <div>
                                     <h3 className="text-2xl font-bold text-white mb-2">Global Market Intelligence</h3>
                                     <p className="text-slate-400 text-sm">Arbitrage opportunities across international markets</p>
                                 </div>
                             </div>

                             {/* Market Comparison Cards */}
                             <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                 {Object.entries(extraordinaryData.multi_market_results.market_comparisons || {}).map(([marketName, marketData]: [string, any]) => (
                                     <div key={marketName} className="glass-card p-6 rounded-2xl border-white/5">
                                         <div className="text-center mb-4">
                                             <div className="text-2xl font-bold text-white mb-1">{marketName}</div>
                                             <div className="text-slate-400 text-xs uppercase tracking-widest">Market</div>
                                         </div>
                                         <div className="space-y-3">
                                             <div className="flex justify-between items-center">
                                                 <span className="text-slate-400 text-sm">Jobs</span>
                                                 <span className="text-white font-bold">{marketData.job_density || 0}</span>
                                             </div>
                                             <div className="flex justify-between items-center">
                                                 <span className="text-slate-400 text-sm">Avg Salary</span>
                                                 <span className="text-green-400 font-bold">${marketData.salary_usd?.avg_usd?.toLocaleString() || 'N/A'}</span>
                                             </div>
                                             <div className="flex justify-between items-center">
                                                 <span className="text-slate-400 text-sm">Demand</span>
                                                 <div className="flex items-center gap-1">
                                                     <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                                     <span className="text-white font-bold">{Math.round((marketData.market_demand_score || 0) * 100)}%</span>
                                                 </div>
                                             </div>
                                         </div>
                                     </div>
                                 ))}
                             </div>

                             {/* Arbitrage Opportunities */}
                             {extraordinaryData.multi_market_results.arbitrage_opportunities?.length > 0 && (
                                 <div>
                                     <h4 className="text-lg font-bold text-white mb-6">💰 Top Arbitrage Opportunities</h4>
                                     <div className="space-y-4">
                                         {extraordinaryData.multi_market_results.arbitrage_opportunities.slice(0, 3).map((opportunity: any, index: number) => (
                                             <div key={index} className="glass-card p-6 rounded-2xl border-green-500/20 bg-gradient-to-r from-green-500/5 to-emerald-500/5">
                                                 <div className="flex items-start justify-between mb-4">
                                                     <div>
                                                         <h5 className="text-lg font-bold text-white mb-1">{opportunity.job_title}</h5>
                                                         <p className="text-slate-400 text-sm">{opportunity.market} Market</p>
                                                     </div>
                                                     <div className="text-right">
                                                         <div className="text-2xl font-bold text-green-400">${opportunity.salary_usd.toLocaleString()}</div>
                                                         <div className="text-slate-400 text-xs">Annual Salary</div>
                                                     </div>
                                                 </div>
                                                 <p className="text-slate-300 text-sm mb-4">{opportunity.description}</p>
                                                 <div className="flex items-center justify-between">
                                                     <div className="flex items-center gap-2">
                                                         <span className="text-xs font-bold text-green-400 uppercase tracking-widest">Opportunity Score:</span>
                                                         <span className="text-green-400 font-bold">{opportunity.opportunity_score}/10</span>
                                                     </div>
                                                     <button className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 rounded-lg text-green-400 text-xs font-bold uppercase tracking-widest transition-all">
                                                         Explore
                                                     </button>
                                                 </div>
                                             </div>
                                         ))}
                                     </div>
                                 </div>
                             )}

                             {/* Strategic Recommendations */}
                             {extraordinaryData.multi_market_results.strategic_recommendations && (
                                 <div className="mt-8 glass-card p-6 rounded-2xl border-blue-500/20 bg-gradient-to-r from-blue-500/5 to-indigo-500/5">
                                     <h4 className="text-lg font-bold text-white mb-4">🎯 Strategic Recommendations</h4>
                                     <div className="space-y-4">
                                         <div>
                                             <div className="text-blue-400 font-bold text-sm mb-2 uppercase tracking-widest">Migration Strategy</div>
                                             <p className="text-slate-300 text-sm">{extraordinaryData.multi_market_results.strategic_recommendations.migration_strategy}</p>
                                         </div>
                                         {extraordinaryData.multi_market_results.strategic_recommendations.timeline && (
                                             <div>
                                                 <div className="text-blue-400 font-bold text-sm mb-2 uppercase tracking-widest">Timeline</div>
                                                 <p className="text-slate-300 text-sm">{extraordinaryData.multi_market_results.strategic_recommendations.timeline}</p>
                                             </div>
                                         )}
                                     </div>
                                 </div>
                             )}
                         </div>
                     )}

                     {/* EXTRAORDINARY: Market Predictions */}
                     {extraordinaryData?.market_predictions && (
                         <div className="mt-16 border-t border-emerald-500/20 pt-16">
                             <div className="flex items-center gap-3 mb-8">
                                 <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center">
                                     🔮
                                 </div>
                                 <div>
                                     <h3 className="text-2xl font-bold text-white mb-2">Future Market Predictions</h3>
                                     <p className="text-slate-400 text-sm">Strategic insights for the next 12 months</p>
                                 </div>
                             </div>

                             {/* Prediction Timeline */}
                             <div className="grid md:grid-cols-3 gap-6 mb-8">
                                 <div className="glass-card p-6 rounded-2xl border-emerald-500/20">
                                     <div className="text-center mb-4">
                                         <div className="text-emerald-400 font-bold text-lg">Immediate</div>
                                         <div className="text-slate-400 text-xs uppercase tracking-widest">Next 3 Months</div>
                                     </div>
                                     <div className="space-y-2">
                                         {extraordinaryData.market_predictions.predictions?.immediate?.skills?.slice(0, 3).map((skill: string, index: number) => (
                                             <div key={index} className="flex items-center gap-2">
                                                 <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                                 <span className="text-white text-sm">{skill}</span>
                                             </div>
                                         ))}
                                     </div>
                                     <div className="mt-4 p-3 bg-emerald-500/10 rounded-lg">
                                         <p className="text-emerald-400 text-xs font-bold">{extraordinaryData.market_predictions.predictions?.immediate?.urgency || "Learn NOW"}</p>
                                     </div>
                                 </div>

                                 <div className="glass-card p-6 rounded-2xl border-blue-500/20">
                                     <div className="text-center mb-4">
                                         <div className="text-blue-400 font-bold text-lg">3-6 Months</div>
                                         <div className="text-slate-400 text-xs uppercase tracking-widest">Medium Term</div>
                                     </div>
                                     <div className="space-y-2">
                                         {extraordinaryData.market_predictions.predictions?.three_months?.skills?.slice(0, 3).map((skill: string, index: number) => (
                                             <div key={index} className="flex items-center gap-2">
                                                 <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                                 <span className="text-white text-sm">{skill}</span>
                                             </div>
                                         ))}
                                     </div>
                                     <div className="mt-4 p-3 bg-blue-500/10 rounded-lg">
                                         <p className="text-blue-400 text-xs font-bold">{extraordinaryData.market_predictions.predictions?.three_months?.urgency || "Start soon"}</p>
                                     </div>
                                 </div>

                                 <div className="glass-card p-6 rounded-2xl border-purple-500/20">
                                     <div className="text-center mb-4">
                                         <div className="text-purple-400 font-bold text-lg">6-12 Months</div>
                                         <div className="text-slate-400 text-xs uppercase tracking-widest">Long Term</div>
                                     </div>
                                     <div className="space-y-2">
                                         {extraordinaryData.market_predictions.predictions?.six_months?.skills?.slice(0, 3).map((skill: string, index: number) => (
                                             <div key={index} className="flex items-center gap-2">
                                                 <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                                                 <span className="text-white text-sm">{skill}</span>
                                             </div>
                                         ))}
                                     </div>
                                     <div className="mt-4 p-3 bg-purple-500/10 rounded-lg">
                                         <p className="text-purple-400 text-xs font-bold">{extraordinaryData.market_predictions.predictions?.six_months?.urgency || "Strategic planning"}</p>
                                     </div>
                                 </div>
                             </div>

                             {/* Market Velocity Indicators */}
                             <div className="glass-card p-6 rounded-2xl border-white/5">
                                 <h4 className="text-lg font-bold text-white mb-4">📊 Market Velocity Analysis</h4>
                                 <div className="grid md:grid-cols-3 gap-6">
                                     <div className="text-center">
                                         <div className="text-2xl font-bold text-green-400 mb-2">
                                             ↑{extraordinaryData.market_predictions.market_velocity?.rising?.length || 3}
                                         </div>
                                         <div className="text-xs text-slate-400 uppercase tracking-widest">Rising Skills</div>
                                     </div>
                                     <div className="text-center">
                                         <div className="text-2xl font-bold text-blue-400 mb-2">
                                             →{extraordinaryData.market_predictions.market_velocity?.stable?.length || 5}
                                         </div>
                                         <div className="text-xs text-slate-400 uppercase tracking-widest">Stable Skills</div>
                                     </div>
                                     <div className="text-center">
                                         <div className="text-2xl font-bold text-red-400 mb-2">
                                             ↓{extraordinaryData.market_predictions.market_velocity?.declining?.length || 1}
                                         </div>
                                         <div className="text-xs text-slate-400 uppercase tracking-widest">Declining Skills</div>
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
