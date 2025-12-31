"use client";

import { useEffect, useState } from "react";
import { Job } from "@/types/job";
import JobMatchModal from "@/components/JobMatchModal";

export default function JobsPage() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState("All");
    const [matchingJob, setMatchingJob] = useState<string | null>(null);
    const [analysisResult, setAnalysisResult] = useState<any>(null);

    const CATEGORIES = ["All", "Engineering", "Data & AI", "Product", "Contract"];

    useEffect(() => {
        async function fetchJobs() {
            try {
                const res = await fetch("http://localhost:8000/api/jobs/");
                const data = await res.json();
                setJobs(data);
            } catch (err) {
                console.error("Error fetching jobs:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchJobs();
    }, []);

    const handleAnalyze = async (job: Job) => {
        setMatchingJob(job.title);

        // Mock retrieving user skills from "Local Storage" (The last generated roadmap)
        // In a real app, we'd read this from the context or DB
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

            <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-12">
                <div>
                    <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass-pill border-white/5 text-[9px] font-bold text-white mb-10 tracking-[0.25em] uppercase">
                        <span className="flex h-1 w-1 rounded-full bg-accent animate-pulse"></span>
                        Live Updates: {new Date().toLocaleTimeString()}
                    </div>
                    <h1 className="text-7xl font-medium text-white mb-6 tracking-tight">Technical <span className="text-white/40">Inventory</span></h1>
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
                    {/* Skeletons */}
                    {[1, 2, 3].map(i => <div key={i} className="h-64 glass-card animate-pulse rounded-[40px] border-white/5" />)}
                </div>
            ) : (
                <div className="grid gap-10">
                    {filteredJobs.length === 0 && <div className="text-slate-500 py-20 text-center">No active roles found for this category.</div>}

                    {filteredJobs.map(job => (
                        <div key={job.id} className="glass-card p-12 md:p-16 rounded-[40px] border-white/5 hover:border-white/10 transition-all group relative overflow-hidden">
                            <div className="flex flex-col md:flex-row justify-between gap-12">
                                <div className="flex-1">
                                    <h3 className="text-3xl font-medium text-white mb-4">{job.title}</h3>
                                    <div className="flex gap-4 text-xs font-bold uppercase tracking-widest text-slate-500 mb-8">
                                        <span className="text-accent">{job.company}</span>
                                        <span>{job.location}</span>
                                        <span className="text-green-500">Just Now</span>
                                    </div>
                                    <p className="text-slate-300 font-light leading-relaxed mb-8 max-w-2xl">{job.description}</p>
                                    <div className="flex gap-2">
                                        {job.tags.map(tag => (
                                            <span key={tag} className="px-3 py-1 rounded-md bg-white/5 text-[9px] font-bold text-slate-400 uppercase tracking-wider">{tag}</span>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-4">
                                    <button
                                        onClick={() => handleAnalyze(job)}
                                        disabled={matchingJob === job.title}
                                        className="px-8 py-3 rounded-full bg-accent/10 border border-accent/20 text-accent font-bold text-[10px] uppercase tracking-widest hover:bg-accent hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        {matchingJob === job.title ? "Analyzing..." : "Analyze Match"}
                                    </button>
                                    <a href={job.link} target="_blank" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:text-white">Apply Externally &rarr;</a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
