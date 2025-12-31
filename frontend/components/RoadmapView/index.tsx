"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { RoadmapOutput, RoadmapMonth } from "@/types/roadmap";
import MentorChat from "./MentorChat";
import ShareModal from "../ShareModal";

interface RoadmapViewProps {
    roadmap: RoadmapOutput;
    onReset: () => void;
}

export default function RoadmapView({ roadmap, onReset }: RoadmapViewProps) {
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
                    <h2 className="text-7xl font-medium text-white mb-6 tracking-tight">Technical <span className="text-white/40">Blueprint</span></h2>
                    <p className="text-slate-300 max-w-xl font-light leading-relaxed text-lg">
                        Precision-engineered learning strategy for specialized technical
                        growth in the Silicon Savannah.
                    </p>
                </div>
                <div className="flex gap-4">
                    <MentorChat roadmap={roadmap} />
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
            </div>

            {/* Career Opportunities / Match Matrix */}
            <div className="mt-32 glass-card rounded-[60px] p-24 border-white/5 relative overflow-hidden group">
                <div className="glow-aura opacity-30 bottom-[-20%] right-[-20%] w-[500px] h-[500px] bg-accent/20"></div>
                <div className="mb-20">
                    <h3 className="text-5xl font-medium text-white mb-6 tracking-tight">Market Alignment</h3>
                    <p className="text-muted text-lg">Local technical roles mapped to your finalized blueprint.</p>
                </div>
                <div className="grid md:grid-cols-2 gap-10">
                    <div className="glass-card bg-black/40 p-12 rounded-[40px] border-white/5 group/card hover:border-white/10 transition-all h-[400px] flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h4 className="font-medium text-3xl text-white">ML Systems</h4>
                                    <p className="text-slate-500 font-bold uppercase text-[9px] tracking-[0.3em] mt-2">Safaricom . Nairobi</p>
                                </div>
                                <span className="bg-white/5 text-white text-[9px] font-bold px-4 py-2 rounded-full border border-white/10 tracking-widest uppercase">Match</span>
                            </div>
                            <p className="text-muted leading-relaxed font-light">Direct application logic for Python-heavy architectures within the region's largest data ecosystem.</p>
                        </div>
                        <a href="/jobs" className="text-white font-bold text-[10px] uppercase tracking-widest hover:opacity-60 flex items-center gap-4 group/link">
                            Inspect Asset <span className="group-hover/link:translate-x-2 transition-transform">&rarr;</span>
                        </a>
                    </div>
                </div>
            </div>

            {/* Coach's Notes / Final Insights */}
            {roadmap.additional_info && (
                <div className="mt-20 border-t border-white/5 pt-20">
                    <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.5em] mb-8">Final Insights</h3>
                    <p className="text-2xl font-light text-slate-300 leading-relaxed italic max-w-4xl">
                        "{roadmap.additional_info}"
                    </p>
                </div>
            )}
        </div>
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

                    {/* Resources */}
                    <div>
                        <h4 className="text-[9px] font-bold text-white/30 uppercase tracking-[0.4em] mb-6">Study Terminals</h4>
                        <div className="grid grid-cols-1 gap-4">
                            {month.resources?.map((res, i) => (
                                <a
                                    key={i}
                                    href={res.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all group/res"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${res.cost === 'Free' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                                            <span className="text-[10px] font-bold">{res.cost === 'Free' ? 'F' : '$'}</span>
                                        </div>
                                        <div>
                                            <div className="font-medium text-sm text-white group-hover/res:text-accent transition-colors">{res.name}</div>
                                            <div className="text-[10px] text-slate-500 uppercase tracking-wider">{res.type}</div>
                                        </div>
                                    </div>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/20 group-hover/res:text-white group-hover/res:translate-x-1 transition-all">
                                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                        <polyline points="15 3 21 3 21 9"></polyline>
                                        <line x1="10" y1="14" x2="21" y2="3"></line>
                                    </svg>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
