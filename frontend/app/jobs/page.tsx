"use client";

import { useEffect, useState } from "react";
import { Job } from "@/types/job";
import JobMatchModal from "@/components/JobMatchModal";

export default function JobsPage() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(false);
    const [activeCategory, setActiveCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [hasSearched, setHasSearched] = useState(false);
    const [matchingJob, setMatchingJob] = useState<string | null>(null);
    const [analysisResult, setAnalysisResult] = useState<any>(null);

    const handleSearch = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!searchQuery) return;

        setLoading(true);
        setHasSearched(true);
        try {
            const res = await fetch(`http://localhost:8000/api/jobs/search?q=${encodeURIComponent(searchQuery)}`);
            const data = await res.json();
            setJobs(data);
        } catch (err) {
            console.error("Error searching jobs:", err);
        } finally {
            setLoading(false);
        }
    };

    const CATEGORIES = ["All", "Engineering", "Data & AI", "Product", "Contract"];

    const handleAnalyze = async (job: Job) => {
        setMatchingJob(job.title);
        const mockUserSkills = ["Python", "SQL", "React"];

        try {
            const res = await fetch("http://localhost:8000/api/jobs/match", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    job_description: job.description + " " + job.tags.join(" "),
                    user_skills: mockUserSkills
                })
            });
            const data = await res.json();
            setAnalysisResult({ ...data, jobTitle: job.title });
        } catch (e) {
            console.error(e);
        } finally {
            setMatchingJob(null);
        }
    };

    const filteredJobs = activeCategory === "All"
        ? jobs
        : jobs.filter(j => j.title.includes(activeCategory) || j.tags.some(t => t.includes(activeCategory)));

    return (
        <div className="py-32 px-6 max-w-7xl mx-auto min-h-screen">
            <JobMatchModal
                isOpen={!!analysisResult}
                onClose={() => setAnalysisResult(null)}
                analysis={analysisResult}
            />

            {!hasSearched ? (
                <div className="flex flex-col items-center justify-center py-20 animate-fade-in text-center">
                    <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass-pill border-white/5 text-[9px] font-bold text-primary mb-10 tracking-[0.25em] uppercase">
                        <span className="flex h-1 w-1 rounded-full bg-primary animate-pulse"></span>
                        Awaiting Target Input
                    </div>
                    <h1 className="text-8xl font-medium text-white mb-8 tracking-tighter">What role are you <span className="text-white/40">eyeing?</span></h1>
                    <p className="text-slate-400 max-w-xl mb-12 font-light text-xl leading-relaxed">
                        Enter your dream role below. Our Research Agent will scan the Kenyan tech ecosystem and global remote markets to find the perfect fit.
                    </p>

                    <form onSubmit={handleSearch} className="flex gap-4 w-full max-w-2xl bg-white/5 p-4 rounded-[40px] border border-white/10 shadow-2xl">
                        <input
                            type="text"
                            placeholder="e.g. Senior Frontend Engineer, Data Scientist at Safaricom..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1 bg-transparent px-8 py-4 text-lg text-white focus:outline-none placeholder:text-slate-600"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-primary text-black px-12 py-4 rounded-[30px] text-sm font-bold uppercase tracking-widest hover:scale-105 transition-all"
                        >
                            {loading ? "Scanning..." : "Search Pipeline"}
                        </button>
                    </form>
                </div>
            ) : (
                <div className="animate-fade-in">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-12">
                        <div>
                            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass-pill border-white/5 text-[9px] font-bold text-white mb-10 tracking-[0.25em] uppercase">
                                <span className="flex h-1 w-1 rounded-full bg-emerald-500 animate-pulse"></span>
                                Live Pulse: {searchQuery}
                            </div>
                            <h1 className="text-7xl font-medium text-white mb-6 tracking-tight">The Market <span className="text-white/40">Results</span></h1>
                            <p className="text-slate-400 max-w-lg mb-8 font-light">
                                Analyzing {jobs.length} relevant roles synthesized by our autonomous market worker.
                            </p>

                            <form onSubmit={handleSearch} className="flex gap-4 max-w-md">
                                <input
                                    type="text"
                                    placeholder="Search another role..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="flex-1 bg-white/5 border border-white/10 rounded-full px-6 py-3 text-sm focus:border-primary/50 outline-none transition-all"
                                />
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-white text-black px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-slate-200 transition-all"
                                >
                                    {loading ? "Searching..." : "Pulse Search"}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Category Filter */}
                    <div className="flex gap-4 mb-12 overflow-x-auto pb-4">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all border ${activeCategory === cat ? "bg-white text-black border-white" : "bg-white/5 text-slate-400 border-white/5 hover:bg-white/10"}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {loading ? (
                        <div className="grid gap-10">
                            {[1, 2, 3].map(i => <div key={i} className="h-64 glass-card animate-pulse rounded-[40px] border-white/5" />)}
                        </div>
                    ) : (
                        <div className="grid gap-10">
                            {filteredJobs.length === 0 && <div className="text-slate-500 py-20 text-center">No active roles found for "{searchQuery}".</div>}

                            {filteredJobs.map(job => (
                                <div key={job.id} className="glass-card p-12 md:p-16 rounded-[40px] border-white/5 hover:border-white/10 transition-all group relative overflow-hidden">
                                    <div className="flex flex-col md:flex-row justify-between gap-12">
                                        <div className="flex-1">
                                            <h3 className="text-3xl font-medium text-white mb-4">{job.title}</h3>
                                            <div className="flex gap-4 text-xs font-bold uppercase tracking-widest text-slate-500 mb-8">
                                                <span className="text-accent">{job.company}</span>
                                                <span>{job.location}</span>
                                                <span className="text-green-500">Live Match</span>
                                            </div>
                                            <p className="text-slate-300 font-light leading-relaxed mb-8 max-w-2xl">{job.description}</p>
                                            <div className="flex gap-2">
                                                {job.tags.map(tag => (
                                                    <span key={tag} className="px-3 py-1 rounded-md bg-white/5 text-[9px] font-bold text-slate-400 uppercase tracking-wider">{tag}</span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end justify-center gap-4">
                                            <button
                                                onClick={() => handleAnalyze(job)}
                                                disabled={matchingJob === job.title}
                                                className="px-8 py-3 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-[10px] uppercase tracking-widest hover:bg-primary hover:text-black transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-primary/5"
                                            >
                                                {matchingJob === job.title ? "Analyzing..." : "Analyze Match"}
                                            </button>
                                            <a href={job.link} target="_blank" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:text-white transition-colors">Apply Pipeline &rarr;</a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
