"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertTriangle, ArrowRight } from "lucide-react";

interface MatchModalProps {
    isOpen: boolean;
    onClose: () => void;
    analysis: {
        score: number;
        missing_skills: string[];
        advice: string;
        jobTitle: string;
    } | null;
}

export default function MatchModal({ isOpen, onClose, analysis }: MatchModalProps) {
    if (!analysis) return null;

    const scoreColor = analysis.score > 75 ? "text-green-400" : analysis.score > 50 ? "text-yellow-400" : "text-red-400";
    const ringColor = analysis.score > 75 ? "border-green-500" : analysis.score > 50 ? "border-yellow-500" : "border-red-500";

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 30 }}
                        className="glass-card w-full max-w-2xl rounded-[40px] p-10 relative border border-white/10 shadow-2xl"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="flex flex-col md:flex-row gap-10">
                            {/* Score Column */}
                            <div className="flex flex-col items-center justify-center text-center">
                                <div className={`w-32 h-32 rounded-full border-4 ${ringColor} flex items-center justify-center bg-white/5 mb-6 relative`}>
                                    <span className={`text-4xl font-black ${scoreColor}`}>{analysis.score}%</span>
                                    <span className="absolute -bottom-3 bg-black px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-slate-500 border border-white/10 rounded-full">Match</span>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-1">{analysis.jobTitle}</h3>
                                <p className="text-xs text-slate-500 font-mono">Analysis Complete</p>
                            </div>

                            {/* Details Column */}
                            <div className="flex-1 space-y-8">
                                <div>
                                    <h4 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-4">
                                        <AlertTriangle className="w-3 h-3 text-amber-500" />
                                        Gap Analysis
                                    </h4>
                                    {analysis.missing_skills.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {analysis.missing_skills.map(skill => (
                                                <span key={skill} className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold">
                                                    Missing: {skill}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-sm text-green-400 font-medium">No critical gaps found! You are ready.</div>
                                    )}
                                </div>

                                <div>
                                    <h4 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-4">
                                        <CheckCircle className="w-3 h-3 text-accent" />
                                        AI Career Stylist
                                    </h4>
                                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-sm font-light text-slate-300 leading-relaxed">
                                        "{analysis.advice}"
                                    </div>
                                </div>

                                <button onClick={onClose} className="w-full py-4 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-widest hover:bg-slate-200 transition-colors flex items-center justify-center gap-2">
                                    Update Roadmap <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
