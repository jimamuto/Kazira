"use client";

import { useEffect, useState } from "react";
import { RoadmapOutput } from "@/types/roadmap";

export default function HistoryPage() {
    const [history, setHistory] = useState<RoadmapOutput[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchHistory() {
            try {
                const res = await fetch("http://localhost:8000/api/roadmap/history");
                const data = await res.json();
                setHistory(data);
            } catch (err) {
                console.error("Error fetching history:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchHistory();
    }, []);

    return (
        <div className="py-20 px-4 md:px-12 max-w-6xl mx-auto">
            <div className="mb-16">
                <h1 className="text-5xl font-black text-white mb-4 tracking-tighter">My <span className="gradient-text">History</span></h1>
                <p className="text-slate-400 max-w-xl font-medium leading-relaxed">
                    Review and refine your previously generated career blueprints.
                </p>
            </div>

            {loading ? (
                <div className="grid md:grid-cols-2 gap-8">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-64 glass-card animate-pulse rounded-[40px] border-white/5"></div>
                    ))}
                </div>
            ) : (
                <div className="grid md:grid-cols-2 gap-8">
                    {history.length > 0 ? history.map((roadmap, i) => (
                        <div key={i} className="glass-card p-10 rounded-[48px] border-white/5 hover:border-primary/30 transition-all group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-purple/5 blur-3xl -z-10"></div>

                            <div className="flex justify-between items-start mb-8">
                                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">🗺️</div>
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{roadmap.timeframe_months} Months</span>
                            </div>

                            <h3 className="text-3xl font-black text-white mb-4 tracking-tight group-hover:text-primary transition-colors">Career Path #{i + 1}</h3>
                            <p className="text-slate-400 font-medium mb-10 line-clamp-2 leading-relaxed italic opacity-75 group-hover:opacity-100 transition-opacity">
                                "{roadmap.additional_info || "No custom notes provided for this roadmap."}"
                            </p>

                            <div className="flex flex-wrap gap-2 mb-10">
                                {roadmap.months?.[0]?.skills.slice(0, 3).map(skill => (
                                    <span key={skill} className="bg-white/5 text-slate-500 text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border border-white/5">
                                        {skill}
                                    </span>
                                ))}
                            </div>

                            <button className="w-full glass-button py-4 rounded-2xl font-black text-lg text-slate-300 hover:text-white group-hover:bg-primary/10 group-hover:border-primary/20">
                                View Full Blueprint
                            </button>
                        </div>
                    )) : (
                        <div className="col-span-full py-32 glass-card rounded-[48px] text-center border-white/5">
                            <div className="text-6xl mb-8 opacity-20">🌫️</div>
                            <h3 className="text-2xl font-bold text-slate-500 mb-6 font-medium">No history found. Let's build your first path!</h3>
                            <a href="/roadmap" className="inline-block px-10 py-5 bg-primary text-white rounded-2xl font-black text-lg hover:bg-teal-700 transition-all">Create Now</a>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
