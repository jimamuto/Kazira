"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Download, Share2, Copy, Check } from "lucide-react";
import { useState } from "react";
import { RoadmapOutput } from "@/types/roadmap";

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    roadmap: RoadmapOutput;
}

export default function ShareModal({ isOpen, onClose, roadmap }: ShareModalProps) {
    const [copied, setCopied] = useState(false);

    const handleDownload = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(roadmap, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `kazira_roadmap_${new Date().toISOString().split('T')[0]}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    const handleCopy = () => {
        const summary = `
🚀 Just generated my personalized AI Career Roadmap on Kazira!

🎯 Target: ${roadmap.months[0].skills[0]} Specialist
📅 Timeline: ${roadmap.months.length} Months
📍 Focus: ${roadmap.summary.substring(0, 100)}...

Build yours for free: kazira.com
#Kazira #TechKenya #SiliconSavannah
    `.trim();

        navigator.clipboard.writeText(summary);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="glass-card w-full max-w-md rounded-3xl p-8 relative border border-white/10 shadow-2xl"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="text-center mb-8">
                            <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6 border border-accent/20">
                                <Share2 className="w-8 h-8 text-accent" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Save & Share</h3>
                            <p className="text-slate-400 text-sm">Keep your blueprint safe or share your goals with the world.</p>
                        </div>

                        <div className="space-y-4">
                            {/* Download Option */}
                            <button
                                onClick={handleDownload}
                                className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                                        <Download className="w-5 h-5" />
                                    </div>
                                    <div className="text-left">
                                        <div className="text-sm font-bold text-white">Download JSON</div>
                                        <div className="text-[10px] text-slate-400">Save detailed data locally</div>
                                    </div>
                                </div>
                                <span className="text-xs font-bold uppercase tracking-widest text-slate-500 group-hover:text-white transition-colors">Save</span>
                            </button>

                            {/* Copy Social Option */}
                            <button
                                onClick={handleCopy}
                                className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                                        {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                    </div>
                                    <div className="text-left">
                                        <div className="text-sm font-bold text-white">Share Summary</div>
                                        <div className="text-[10px] text-slate-400">Copy formatted text for socials</div>
                                    </div>
                                </div>
                                <span className={`text-xs font-bold uppercase tracking-widest transition-colors ${copied ? "text-green-400" : "text-slate-500 group-hover:text-white"}`}>
                                    {copied ? "Copied!" : "Copy"}
                                </span>
                            </button>
                        </div>

                        <div className="mt-8 pt-6 border-t border-white/5 text-center">
                            <p className="text-[10px] text-slate-500">
                                Data is saved to your device. No account required.
                            </p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
