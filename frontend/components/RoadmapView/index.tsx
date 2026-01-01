"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { RoadmapOutput, RoadmapMonth } from "@/types/roadmap";
import MentorChat from "./MentorChat";
import ShareModal from "../ShareModal";
import MissionDashboard from "../MissionDashboard";

interface RoadmapViewProps {
    roadmap: RoadmapOutput;
    onReset: () => void;
    onLaunchExecution: () => void;
    extraordinaryData?: {
        career_trajectory?: any;
        velocity_metrics?: any;
        tournament_results?: any;
        multi_market_intelligence?: any;
    };
}

export default function RoadmapView({ roadmap, onReset, onLaunchExecution, extraordinaryData }: RoadmapViewProps) {
    const [showShareModal, setShowShareModal] = useState(false);

    return (
        <div className="max-w-7xl mx-auto py-32 px-6">
            <ShareModal
                isOpen={showShareModal}
                onClose={() => setShowShareModal(false)}
                roadmap={roadmap}
            />
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-32 gap-12">
                <div>
                    <h2 className="text-7xl font-medium text-white mb-6 tracking-tight">Orchestrated <span className="text-white/40">Blueprint</span></h2>
                    <p className="text-slate-300 max-w-xl font-light leading-relaxed text-lg">
                        Precision-engineered strategy synthesized by our Planning Agent
                        based on live market requirements and your unique profile.
                    </p>
                </div>
                <div className="flex gap-4">
                    <MentorChat roadmap={roadmap} />
                    <button
                        onClick={onLaunchExecution}
                        className="bg-primary text-black px-8 py-4 rounded-full font-bold text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-primary/20 flex items-center gap-3"
                    >
                        Launch Learning Terminal
                    </button>
                    <button
                        onClick={() => setShowShareModal(true)}
                        className="bg-white text-black px-8 py-4 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-slate-200 transition-all shadow-xl shadow-white/5 flex items-center gap-3"
                    >
                        Save Blueprint
                    </button>
                    <button
                        onClick={onReset}
                        className="btn-secondary px-8"
                    >
                        &larr; New Strategy
                    </button>
                </div>
            </div>
            {/* Marathon Agent Live Dashboard */}
            <MissionDashboard />

            {/* Vertical Timeline Container */}
            <div className="relative mb-64">
                {/* Center Line (Minimalist) */}
                <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-white/5 -translate-x-1/2 pointer-events-none"></div>

                <div className="space-y-48">
                    {roadmap.months?.map((month, index) => (
                        <div key={month.month} className="relative">
                            <div className={`flex flex-col md:flex-row items-start md:items-center gap-20 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                                {/* Content Side */}
                                <div className="w-full md:w-[45%]">
                                    <MonthCard month={month} />
                                </div>

                                {/* Center Node (Minimalist) */}
                                <div className="absolute left-6 md:left-1/2 -translate-x-1/2 z-10 top-0 md:top-1/2">
                                    <div className="w-12 h-12 rounded-full bg-black border border-white/10 flex items-center justify-center font-medium text-xs text-white">
                                        0{month.month}
                                    </div>
                                </div>

                                {/* Empty Side (For Desktop Alignment) */}
                                <div className="hidden md:block md:w-[45%]"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div >


             {/* EXTRAORDINARY FEATURES DISPLAY */}

             {/* Career Trajectory - 5-Year Strategic Path */}
             {extraordinaryData?.career_trajectory && (
                 <div className="mt-20 border-t border-emerald-500/20 pt-20">
                     <div className="flex items-center gap-3 mb-12">
                         <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center">
                             🎯
                         </div>
                         <div>
                             <h3 className="text-2xl font-bold text-white mb-2">Strategic Career Trajectory</h3>
                             <p className="text-slate-400 text-sm">Complete 5-year path from {extraordinaryData.career_trajectory.start_role} to {extraordinaryData.career_trajectory.target_role}</p>
                         </div>
                     </div>

                     {/* Success Probability & Timeline */}
                     <div className="grid md:grid-cols-3 gap-6 mb-12">
                         <div className="glass-card p-6 rounded-2xl border-emerald-500/20">
                             <div className="text-center">
                                 <div className="text-3xl font-bold text-emerald-400 mb-2">
                                     {Math.round((extraordinaryData.career_trajectory.success_probability || 0) * 100)}%
                                 </div>
                                 <div className="text-xs text-slate-400 uppercase tracking-widest">Success Probability</div>
                             </div>
                         </div>
                         <div className="glass-card p-6 rounded-2xl border-emerald-500/20">
                             <div className="text-center">
                                 <div className="text-3xl font-bold text-emerald-400 mb-2">
                                     {extraordinaryData.career_trajectory.timeline_projection?.total_years || 5}
                                 </div>
                                 <div className="text-xs text-slate-400 uppercase tracking-widest">Years to Target</div>
                             </div>
                         </div>
                         <div className="glass-card p-6 rounded-2xl border-emerald-500/20">
                             <div className="text-center">
                                 <div className="text-3xl font-bold text-emerald-400 mb-2">
                                     {extraordinaryData.career_trajectory.market_alignment?.alignment_score ?
                                         Math.round(extraordinaryData.career_trajectory.market_alignment.alignment_score * 100) : 85}%
                                 </div>
                                 <div className="text-xs text-slate-400 uppercase tracking-widest">Market Alignment</div>
                             </div>
                         </div>
                     </div>

                     {/* Career Path Stages */}
                     <div className="space-y-6">
                         <h4 className="text-lg font-bold text-white mb-6">Career Progression</h4>
                         {extraordinaryData.career_trajectory.career_path?.slice(0, 5).map((stage: any, index: number) => (
                             <div key={index} className="glass-card p-6 rounded-2xl border-white/5">
                                 <div className="flex items-start justify-between mb-4">
                                     <div>
                                         <h5 className="text-lg font-bold text-white mb-1">{stage.title}</h5>
                                         <p className="text-slate-400 text-sm">{stage.years_experience}</p>
                                     </div>
                                     <div className="text-right">
                                         <div className="text-emerald-400 font-bold">{stage.market_value || "Competitive Salary"}</div>
                                     </div>
                                 </div>
                                 <div className="grid md:grid-cols-2 gap-4">
                                     <div>
                                         <h6 className="text-xs font-bold text-white/60 uppercase tracking-widest mb-2">Key Skills</h6>
                                         <div className="flex flex-wrap gap-2">
                                             {stage.critical_skills?.slice(0, 4).map((skill: string, i: number) => (
                                                 <span key={i} className="bg-emerald-500/10 text-emerald-300 text-xs px-3 py-1 rounded-full">
                                                     {skill}
                                                 </span>
                                             ))}
                                         </div>
                                     </div>
                                     <div>
                                         <h6 className="text-xs font-bold text-white/60 uppercase tracking-widest mb-2">Leadership Focus</h6>
                                         <p className="text-slate-300 text-sm">{stage.leadership_focus || "Building technical expertise"}</p>
                                     </div>
                                 </div>
                             </div>
                         ))}
                     </div>
                 </div>
             )}

             {/* Velocity Metrics - Personal Analytics */}
             {extraordinaryData?.velocity_metrics && (
                 <div className="mt-20 border-t border-purple-500/20 pt-20">
                     <div className="flex items-center gap-3 mb-12">
                         <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                             ⚡
                         </div>
                         <div>
                             <h3 className="text-2xl font-bold text-white mb-2">Career Velocity Analytics</h3>
                             <p className="text-slate-400 text-sm">Your learning speed vs market evolution</p>
                         </div>
                     </div>

                     {/* Velocity Dashboard */}
                     <div className="grid md:grid-cols-4 gap-6 mb-12">
                         <div className="glass-card p-6 rounded-2xl border-purple-500/20">
                             <div className="text-center">
                                 <div className="text-3xl font-bold text-purple-400 mb-2">
                                     {extraordinaryData.velocity_metrics.velocity_metrics?.acceleration_factor?.toFixed(1) || "2.1"}x
                                 </div>
                                 <div className="text-xs text-slate-400 uppercase tracking-widest">Acceleration Factor</div>
                             </div>
                         </div>
                         <div className="glass-card p-6 rounded-2xl border-purple-500/20">
                             <div className="text-center">
                                 <div className="text-3xl font-bold text-purple-400 mb-2">
                                     {extraordinaryData.velocity_metrics.velocity_metrics?.learning_velocity?.toFixed(1) || "3.2"}
                                 </div>
                                 <div className="text-xs text-slate-400 uppercase tracking-widest">Learning Velocity</div>
                             </div>
                         </div>
                         <div className="glass-card p-6 rounded-2xl border-purple-500/20">
                             <div className="text-center">
                                 <div className="text-3xl font-bold text-purple-400 mb-2">
                                     {extraordinaryData.velocity_metrics.velocity_metrics?.days_active || 14}
                                 </div>
                                 <div className="text-xs text-slate-400 uppercase tracking-widest">Days Active</div>
                             </div>
                         </div>
                         <div className="glass-card p-6 rounded-2xl border-purple-500/20">
                             <div className="text-center">
                                 <div className="text-3xl font-bold text-purple-400 mb-2">
                                     {extraordinaryData.velocity_metrics.skill_trajectory?.trajectory_score ?
                                         Math.round(extraordinaryData.velocity_metrics.skill_trajectory.trajectory_score * 100) : 87}%
                                 </div>
                                 <div className="text-xs text-slate-400 uppercase tracking-widest">Skill Mastery</div>
                             </div>
                         </div>
                     </div>

                     {/* Velocity Insights */}
                     <div className="space-y-4">
                         <h4 className="text-lg font-bold text-white mb-4">Velocity Insights</h4>
                         {extraordinaryData.velocity_metrics.velocity_insights?.map((insight: string, index: number) => (
                             <div key={index} className="glass-card p-4 rounded-xl border-white/5">
                                 <p className="text-slate-300 text-sm">{insight}</p>
                             </div>
                         ))}
                     </div>
                 </div>
             )}

             {/* Tournament Results */}
             {extraordinaryData?.tournament_results && (
                 <div className="mt-20 border-t border-orange-500/20 pt-20">
                     <div className="flex items-center gap-3 mb-12">
                         <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center">
                             🏆
                         </div>
                         <div>
                             <h3 className="text-2xl font-bold text-white mb-2">Agent Tournament Results</h3>
                             <p className="text-slate-400 text-sm">Evolutionary competition between {extraordinaryData.tournament_results.total_agents} agents</p>
                         </div>
                     </div>

                     {/* Tournament Stats */}
                     <div className="grid md:grid-cols-3 gap-6 mb-12">
                         <div className="glass-card p-6 rounded-2xl border-orange-500/20">
                             <div className="text-center">
                                 <div className="text-3xl font-bold text-orange-400 mb-2">
                                     {extraordinaryData.tournament_results.winner_strategy || "Balanced"}
                                 </div>
                                 <div className="text-xs text-slate-400 uppercase tracking-widest">Winning Strategy</div>
                             </div>
                         </div>
                         <div className="glass-card p-6 rounded-2xl border-orange-500/20">
                             <div className="text-center">
                                 <div className="text-3xl font-bold text-orange-400 mb-2">
                                     {extraordinaryData.tournament_results.winner_score?.toFixed(2) || "0.89"}
                                 </div>
                                 <div className="text-xs text-slate-400 uppercase tracking-widest">Winner Score</div>
                             </div>
                         </div>
                         <div className="glass-card p-6 rounded-2xl border-orange-500/20">
                             <div className="text-center">
                                 <div className="text-3xl font-bold text-orange-400 mb-2">
                                     {extraordinaryData.tournament_results.tournament_duration_seconds?.toFixed(0) || "45"}s
                                 </div>
                                 <div className="text-xs text-slate-400 uppercase tracking-widest">Tournament Duration</div>
                             </div>
                         </div>
                     </div>

                     {/* Leaderboard */}
                     <div className="space-y-4">
                         <h4 className="text-lg font-bold text-white mb-4">Tournament Leaderboard</h4>
                         {extraordinaryData.tournament_results.leaderboard?.map((result: any, index: number) => (
                             <div key={index} className="glass-card p-4 rounded-xl border-white/5 flex items-center justify-between">
                                 <div className="flex items-center gap-4">
                                     <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                                         index === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                                         index === 1 ? 'bg-gray-500/20 text-gray-400' :
                                         index === 2 ? 'bg-orange-500/20 text-orange-400' :
                                         'bg-white/10 text-white/60'
                                     }`}>
                                         {index + 1}
                                     </div>
                                     <div>
                                         <div className="font-bold text-white">{result.strategy}</div>
                                         <div className="text-slate-400 text-sm">{result.key_insight}</div>
                                     </div>
                                 </div>
                                 <div className="text-right">
                                     <div className="font-bold text-white">{result.score}</div>
                                     <div className="text-slate-400 text-xs">Score</div>
                                 </div>
                             </div>
                         ))}
                     </div>
                 </div>
             )}

             {/* Multi-Market Intelligence */}
             {extraordinaryData?.multi_market_intelligence && (
                 <div className="mt-20 border-t border-blue-500/20 pt-20">
                     <div className="flex items-center gap-3 mb-12">
                         <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-green-500/20 flex items-center justify-center">
                             🌍
                         </div>
                         <div>
                             <h3 className="text-2xl font-bold text-white mb-2">Global Market Intelligence</h3>
                             <p className="text-slate-400 text-sm">Arbitrage opportunities across {Object.keys(extraordinaryData.multi_market_intelligence.market_comparisons || {}).length} markets</p>
                         </div>
                     </div>

                     {/* Arbitrage Opportunities */}
                     <div className="space-y-6 mb-12">
                         <h4 className="text-lg font-bold text-white mb-4">Top Arbitrage Opportunities</h4>
                         {extraordinaryData.multi_market_intelligence.arbitrage_opportunities?.slice(0, 3).map((opportunity: any, index: number) => (
                             <div key={index} className="glass-card p-6 rounded-2xl border-green-500/20">
                                 <div className="flex items-start justify-between mb-4">
                                     <div>
                                         <h5 className="text-lg font-bold text-white mb-1">{opportunity.job_title}</h5>
                                         <p className="text-slate-400 text-sm">{opportunity.market} Market</p>
                                     </div>
                                     <div className="text-right">
                                         <div className="text-green-400 font-bold text-xl">${opportunity.salary_usd}</div>
                                         <div className="text-slate-400 text-xs">Annual Salary</div>
                                     </div>
                                 </div>
                                 <p className="text-slate-300 text-sm">{opportunity.description}</p>
                                 <div className="mt-4 flex items-center gap-2">
                                     <span className="text-xs font-bold text-green-400 uppercase tracking-widest">Opportunity Score:</span>
                                     <span className="text-green-400 font-bold">{opportunity.opportunity_score}/10</span>
                                 </div>
                             </div>
                         ))}
                     </div>

                     {/* Market Comparison */}
                     <div className="grid md:grid-cols-2 gap-6">
                         <div className="glass-card p-6 rounded-2xl border-white/5">
                             <h4 className="text-lg font-bold text-white mb-4">Strategic Recommendations</h4>
                             <div className="space-y-3">
                                 {extraordinaryData.multi_market_intelligence.strategic_recommendations?.migration_strategy && (
                                     <p className="text-slate-300 text-sm">{extraordinaryData.multi_market_intelligence.strategic_recommendations.migration_strategy}</p>
                                 )}
                                 {extraordinaryData.multi_market_intelligence.strategic_recommendations?.timeline && (
                                     <p className="text-slate-400 text-xs">Timeline: {extraordinaryData.multi_market_intelligence.strategic_recommendations.timeline}</p>
                                 )}
                             </div>
                         </div>

                         <div className="glass-card p-6 rounded-2xl border-white/5">
                             <h4 className="text-lg font-bold text-white mb-4">Skill Arbitrage</h4>
                             <div className="space-y-3">
                                 {extraordinaryData.multi_market_intelligence.skill_arbitrage?.undervalued_skills?.slice(0, 2).map((skill: any, index: number) => (
                                     <div key={index} className="flex justify-between items-center">
                                         <span className="text-slate-300 text-sm">{skill.skill}</span>
                                         <span className="text-green-400 text-xs font-bold">Undervalued in {skill.market}</span>
                                     </div>
                                 ))}
                             </div>
                         </div>
                     </div>
                 </div>
             )}

             {/* Coach's Notes / Final Insights */}
             {
                 roadmap.additional_info && (
                     <div className="mt-20 border-t border-white/5 pt-20">
                         <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.5em] mb-8">Final Insights</h3>
                         <p className="text-2xl font-light text-slate-300 leading-relaxed italic max-w-4xl">
                             "{roadmap.additional_info}"
                         </p>
                     </div>
                 )
             }
        </div >
    );
}

function MonthCard({ month }: { month: RoadmapMonth }) {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className={`glass-card rounded-[48px] border-white/5 transition-all group relative overflow-hidden ${expanded ? "p-12 md:p-16 ring-1 ring-white/10" : "p-10 md:p-12 hover:border-white/10"}`}>
            <div className={`glow-aura opacity-0 transition-opacity duration-1000 top-[-20%] right-[-20%] w-96 h-96 bg-accent/10 blur-[100px] ${expanded ? "opacity-40" : "group-hover:opacity-20"}`}></div>

            <div className="mb-8 cursor-pointer" onClick={() => setExpanded(!expanded)}>
                <div className="flex justify-between items-start">
                    <h3 className="text-3xl font-medium text-white mb-6 tracking-tight group-hover:text-accent transition-colors">{month.title}</h3>
                    <button className={`p-4 rounded-full bg-white/5 hover:bg-white/10 transition-all ${expanded ? "rotate-180" : ""}`}>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-50">
                            <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>

                <div className="flex flex-wrap gap-2">
                    {month.skills.map(skill => (
                        <span key={skill} className="bg-white/5 text-slate-300 text-[8px] font-bold uppercase tracking-[0.3em] px-4 py-2 rounded-full border border-white/5">
                            {skill}
                        </span>
                    ))}
                </div>
            </div>

            {/* Preview Tasks (First 3) */}
            {!expanded && (
                <ul className="space-y-3 mt-8">
                    {month.tasks?.slice(0, 3).map((task, i) => (
                        <li key={i} className="flex items-center gap-4 text-slate-400">
                            <div className="w-1.5 h-1.5 rounded-full bg-white/20"></div>
                            <span className="text-xs font-light truncate">{task}</span>
                        </li>
                    ))}
                    {month.tasks?.length > 3 && (
                        <li className="text-[10px] text-white/30 uppercase tracking-widest pl-5 pt-2">
                            + {month.tasks.length - 3} more tasks
                        </li>
                    )}
                </ul>
            )}

            {/* Expanded Content */}
            {expanded && (
                <div className="animate-fade-in space-y-12 mt-12 border-t border-white/5 pt-12">
                    {/* Detailed Guide */}
                    {month.detailed_guide && (
                        <div className="prose prose-invert prose-sm max-w-none prose-headings:text-accent prose-h3:text-sm prose-h3:uppercase prose-h3:tracking-widest prose-p:text-slate-300 prose-p:font-light prose-strong:text-white prose-li:text-slate-300">
                            <h4 className="text-[9px] font-bold text-accent uppercase tracking-[0.4em] mb-4">Deep Dive Strategy</h4>
                            <ReactMarkdown>{month.detailed_guide.replace(/\\n/g, '\n')}</ReactMarkdown>
                        </div>
                    )}

                    {/* Checklist */}
                    <div>
                        <h4 className="text-[9px] font-bold text-white/30 uppercase tracking-[0.4em] mb-6">Action Checklist</h4>
                        <ul className="space-y-4">
                            {month.tasks?.map((task, i) => (
                                <li key={i} className="flex items-start gap-4 group/task cursor-pointer">
                                    <div className="mt-1 w-5 h-5 rounded-full border border-white/20 flex items-center justify-center group-hover/task:border-accent transition-colors">
                                        <div className="w-2.5 h-2.5 rounded-full bg-accent opacity-0 group-hover/task:opacity-100 transition-opacity"></div>
                                    </div>
                                    <span className="text-slate-300 text-sm font-light leading-relaxed group-hover/task:text-white transition-colors">{task}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>
            )}
        </div>
    );
}
