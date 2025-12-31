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
        <div className="py-32 px-6 max-w-7xl mx-auto">
            <div className="mb-32">
                <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass-pill border-white/5 text-[9px] font-bold text-white mb-10 tracking-[0.25em] uppercase">
                    <span className="flex h-1 w-1 rounded-full bg-accent"></span>
                    Strategy Archive
                </div>
                <h1 className="text-7xl font-medium text-white mb-6 tracking-tight">Mission <span className="text-slate-500">History</span></h1>
                <p className="text-muted max-w-xl font-light leading-relaxed text-lg">
                    Review and refine specialized technical blueprints from your archive.
                </p>
            </div>

            {loading ? (
                <div className="grid md:grid-cols-2 gap-12">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-64 glass-card animate-pulse rounded-[40px] border-white/5"></div>
                    ))}
                </div>
            ) : (
                <div className="grid md:grid-cols-2 gap-12">
                    {history.length > 0 ? history.map((roadmap, i) => (
                        <div key={i} className="glass-card p-16 rounded-[60px] border-white/5 hover:border-white/10 transition-all group relative overflow-hidden h-[500px] flex flex-col justify-between">
                            <div className="glow-aura opacity-0 group-hover:opacity-20 transition-opacity top-[-20%] right-[-20%] w-64 h-64 bg-accent/20"></div>

                            <div>
                                <div className="flex justify-between items-start mb-12">
                                    <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-xl group-hover:scale-110 transition-transform">⚙️</div>
                                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.3em]">{roadmap.timeframe_months} Mo.</span>
                                </div>

                                <h3 className="text-4xl font-medium text-white mb-6 tracking-tight group-hover:text-accent transition-colors">Mission 0{i + 1}</h3>
                                <p className="text-muted font-light mb-12 line-clamp-2 leading-relaxed italic opacity-60">
                                    "{roadmap.additional_info || "Standard configuration blueprint."}"
                                </p>
                            </div>

                            <button className="btn-secondary w-full text-center py-5">
                                Re-Open Configuration
                            </button>
                        </div>
                    )) : (
                        <div className="col-span-full py-48 glass-card rounded-[60px] text-center border-white/5">
                            <div className="text-6xl mb-12 opacity-10">🌫️</div>
                            <h3 className="text-3xl font-medium text-slate-500 mb-12">Archive Empty. Launch Application.</h3>
                            <a href="/roadmap" className="btn-primary inline-block">Execute Launch</a>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
