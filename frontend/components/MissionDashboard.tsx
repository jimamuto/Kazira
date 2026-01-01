"use client";

import { useEffect, useState, useRef } from "react";
import { Terminal, Activity, Wifi, ShieldCheck, Zap } from "lucide-react";

export default function MissionDashboard() {
    const [logs, setLogs] = useState<any[]>([]);
    const [status, setStatus] = useState("ACTIVE");
    const logsEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const res = await fetch("http://localhost:8000/api/mission/logs");
                const data = await res.json();
                if (data.logs) {
                    setLogs(data.logs);
                }
            } catch (e) {
                setStatus("CONNECTING...");
            }
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [logs]);

    return (
        <div className="w-full max-w-7xl mx-auto mb-32">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                        <Activity className="w-6 h-6 text-emerald-500 animate-pulse" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white tracking-tight">Marathon Agent <span className="text-emerald-500">Live</span></h3>
                        <p className="text-xs text-slate-400 font-mono uppercase tracking-widest">Autonomous Mission Loop: {status}</p>
                    </div>
                </div>
                <div className="flex gap-6 text-xs font-bold text-slate-500 uppercase tracking-widest">
                    <div className="flex items-center gap-2"><Wifi className="w-4 h-4" /> Uplink Stable</div>
                    <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> Protocol Secure</div>
                    <div className="flex items-center gap-2 text-accent"><Zap className="w-4 h-4" /> Auto-Correction Enabled</div>
                </div>
            </div>

            <div className="bg-black/80 rounded-3xl border border-white/10 overflow-hidden font-mono text-sm shadow-2xl relative group">
                <div className="absolute top-0 left-0 right-0 h-10 bg-white/5 border-b border-white/5 flex items-center px-4 gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                    <div className="ml-4 text-[10px] text-slate-500">mission_control.log</div>
                </div>

                <div className="p-6 pt-16 h-[300px] overflow-y-auto custom-scrollbar space-y-2">
                    {logs.length === 0 && <div className="text-slate-600 italic">Establishing link to Mission Control...</div>}
                    {logs.map((log, i) => (
                        <div key={i} className="flex gap-4 animate-fade-in">
                            <span className="text-slate-600 shrink-0">[{log.timestamp.split('T')[1].split('.')[0]}]</span>
                            <span className={`font-bold shrink-0 w-32 ${log.source === "ALERT" ? "text-red-500" :
                                    log.source === "DECISION" ? "text-accent" :
                                        log.source === "SYSTEM" ? "text-blue-400" :
                                            "text-emerald-500"
                                }`}>
                                {log.source}:
                            </span>
                            <span className="text-slate-300 break-all">{log.message}</span>
                        </div>
                    ))}
                    <div ref={logsEndRef} />
                </div>

                {/* Scanline effect */}
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[size:100%_4px] pointer-events-none opacity-20"></div>
            </div>
        </div>
    );
}
