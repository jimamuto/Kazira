"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Globe, ArrowRight, ArrowLeft, Check, Loader2, Sparkles } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type Step = "intro" | "role" | "markets" | "profile" | "skills" | "review";

export default function MultiMarketPage() {
    const router = useRouter();
    const [step, setStep] = useState<Step>("intro");
    const [isLoading, setIsLoading] = useState(false);
    const [skillsInputMode, setSkillsInputMode] = useState<"upload" | "manual">("manual");
    const [cvFile, setCvFile] = useState<File | null>(null);
    
    const markets = ["Kenya", "US", "EU", "UK", "Canada", "Australia", "Germany", "India"];
    
    const [formData, setFormData] = useState({
        targetRole: "",
        primaryMarket: "Kenya",
        compareMarkets: ["US", "EU"] as string[],
        currentStatus: "beginner",
        skills: ""
    });

    const steps = [
        { key: "intro", label: "Start" },
        { key: "role", label: "Target Role" },
        { key: "markets", label: "Markets" },
        { key: "profile", label: "Profile" },
        { key: "skills", label: "Skills" },
        { key: "review", label: "Review" }
    ];

    const currentStepIndex = steps.findIndex(s => s.key === step);

    const handleCvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setCvFile(file);
        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append("cv", file);

            const response = await fetch(`${API_URL}/api/roadmap/extract-skills`, {
                method: "POST",
                body: formData
            });

            const data = await response.json();
            if (data.skills) {
                setFormData(prev => ({ ...prev, skills: data.skills.join(", ") }));
            }
        } catch (error) {
            console.error("Error extracting skills:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleMarket = (market: string) => {
        if (formData.compareMarkets.includes(market)) {
            setFormData({ ...formData, compareMarkets: formData.compareMarkets.filter(m => m !== market) });
        } else if (formData.compareMarkets.length < 3) {
            setFormData({ ...formData, compareMarkets: [...formData.compareMarkets, market] });
        }
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/multi-market/analyze`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    career_goal: formData.targetRole,
                    primary_market: formData.primaryMarket,
                    compare_markets: formData.compareMarkets,
                    current_status: formData.currentStatus,
                    skills: formData.skills.split(",").map(s => s.trim()).filter(Boolean)
                })
            });
            const data = await response.json();
            router.push(`/roadmap/result/${data.result_id}`);
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            {step !== "intro" && (
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                        {steps.slice(0, -1).map((s, i) => (
                            <div key={s.key} className="flex items-center">
                                <div className={`
                                    w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                                    ${i < currentStepIndex ? "bg-blue-500 text-black" :
                                      i === currentStepIndex ? "bg-blue-400 text-black" : "bg-white/10 text-slate-500"}
                                `}>
                                    {i < currentStepIndex ? <Check className="w-4 h-4" /> : i + 1}
                                </div>
                                {i < steps.length - 2 && (
                                    <div className={`w-12 h-0.5 mx-1 ${i < currentStepIndex ? "bg-blue-500" : "bg-white/10"}`} />
                                )}
                            </div>
                        ))}
                    </div>
                    <p className="text-xs text-slate-500 text-center mt-4 uppercase tracking-widest">
                        Step {currentStepIndex} of {steps.length - 1}: {steps[currentStepIndex].label}
                    </p>
                </div>
            )}

            {step === "intro" && (
                <div className="text-center py-12">
                    <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500/20 to-green-500/20 flex items-center justify-center mx-auto mb-8 animate-pulse">
                        <Globe className="w-12 h-12 text-blue-400" />
                    </div>
                    
                    <h1 className="text-5xl font-bold text-white mb-6 tracking-tight">
                        Global Arbitrage
                    </h1>
                    
                    <p className="text-2xl text-slate-300 font-light mb-4 leading-relaxed">
                        Discover opportunities across borders
                    </p>
                    
                    <p className="text-slate-500 mb-12 max-w-lg mx-auto leading-relaxed">
                        Compare job markets across Kenya, US, EU and beyond to find undervalued skills 
                        and salary arbitrage opportunities that could 2-3x your earning potential.
                    </p>

                    <div className="space-y-4 mb-12">
                        <div className="flex items-center justify-center gap-3 text-slate-400">
                            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                            <span className="text-sm">Multi-market salary comparisons</span>
                        </div>
                        <div className="flex items-center justify-center gap-3 text-slate-400">
                            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                            <span className="text-sm">Currency-adjusted analysis</span>
                        </div>
                        <div className="flex items-center justify-center gap-3 text-slate-400">
                            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                            <span className="text-sm">Skill undervaluation detection</span>
                        </div>
                    </div>

                    <button
                        onClick={() => setStep("role")}
                        className="btn-primary px-12 py-5 text-lg flex items-center gap-3 mx-auto group bg-blue-600 hover:bg-blue-500"
                    >
                        Explore Markets
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            )}

            {step === "role" && (
                <div className="glass-card p-10 rounded-3xl border border-white/10 animate-fade-in">
                    <h2 className="text-3xl font-bold text-white mb-2">What role are you targeting?</h2>
                    <p className="text-slate-400 mb-8">We'll find the best markets for this role</p>
                    
                    <input
                        type="text"
                        value={formData.targetRole}
                        onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                        placeholder="Enter your target role..."
                        className="w-full bg-white/5 p-6 rounded-2xl border border-white/10 focus:border-blue-400/50 outline-none transition-all text-xl text-white mb-8"
                        autoFocus
                    />

                    <div className="flex justify-between">
                        <button
                            onClick={() => setStep("intro")}
                            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" /> Back
                        </button>
                        <button
                            onClick={() => setStep("markets")}
                            disabled={!formData.targetRole.trim()}
                            className="btn-primary px-8 py-3 flex items-center gap-2 disabled:opacity-50 bg-blue-600 hover:bg-blue-500"
                        >
                            Continue <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {step === "markets" && (
                <div className="glass-card p-10 rounded-3xl border border-white/10 animate-fade-in">
                    <h2 className="text-3xl font-bold text-white mb-2">Select markets to compare</h2>
                    <p className="text-slate-400 mb-8">Your primary market vs. up to 3 comparison markets</p>
                    
                    <div className="mb-8">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-3 block">Primary Market</label>
                        <select
                            value={formData.primaryMarket}
                            onChange={(e) => setFormData({ ...formData, primaryMarket: e.target.value })}
                            className="w-full bg-white/5 p-4 rounded-xl border border-white/10 focus:border-blue-400/50 outline-none transition-all text-white"
                        >
                            {markets.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                    </div>

                    <div className="mb-8">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-3 block">Compare Markets (select up to 3)</label>
                        <div className="flex flex-wrap gap-2">
                            {markets.filter(m => m !== formData.primaryMarket).map(market => (
                                <button
                                    key={market}
                                    onClick={() => toggleMarket(market)}
                                    className={`px-4 py-2 rounded-full border transition-all ${
                                        formData.compareMarkets.includes(market)
                                            ? "bg-blue-500/20 border-blue-400 text-blue-400"
                                            : "bg-white/5 border-white/10 text-slate-400 hover:border-white/20"
                                    }`}
                                >
                                    {market}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-between">
                        <button
                            onClick={() => setStep("role")}
                            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" /> Back
                        </button>
                        <button
                            onClick={() => setStep("profile")}
                            disabled={formData.compareMarkets.length === 0}
                            className="btn-primary px-8 py-3 flex items-center gap-2 disabled:opacity-50 bg-blue-600 hover:bg-blue-500"
                        >
                            Continue <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {step === "profile" && (
                <div className="glass-card p-10 rounded-3xl border border-white/10 animate-fade-in">
                    <h2 className="text-3xl font-bold text-white mb-2">Your experience level</h2>
                    <p className="text-slate-400 mb-8">This affects salary comparisons</p>
                    
                    <div className="mb-8">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-3 block">Experience Level</label>
                        <select
                            value={formData.currentStatus}
                            onChange={(e) => setFormData({ ...formData, currentStatus: e.target.value })}
                            className="w-full bg-white/5 p-4 rounded-xl border border-white/10 focus:border-blue-400/50 outline-none transition-all text-white"
                        >
                            <option value="beginner">Beginner (0-1 years)</option>
                            <option value="intermediate">Intermediate (2-4 years)</option>
                            <option value="advanced">Advanced (5-7 years)</option>
                            <option value="expert">Expert (8+ years)</option>
                        </select>
                    </div>

                    <div className="flex justify-between">
                        <button
                            onClick={() => setStep("markets")}
                            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" /> Back
                        </button>
                        <button
                            onClick={() => setStep("skills")}
                            className="btn-primary px-8 py-3 flex items-center gap-2 bg-blue-600 hover:bg-blue-500"
                        >
                            Continue <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {step === "skills" && (
                <div className="glass-card p-10 rounded-3xl border border-white/10 animate-fade-in">
                    <h2 className="text-3xl font-bold text-white mb-2">Your skills</h2>
                    <p className="text-slate-400 mb-8">We'll identify which skills are undervalued in each market</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        <button
                            onClick={() => setSkillsInputMode("upload")}
                            className={`p-6 rounded-2xl border-2 text-left transition-all ${
                                skillsInputMode === "upload"
                                    ? "border-blue-400 bg-blue-400/10"
                                    : "border-white/10 hover:border-white/30 bg-white/5"
                            }`}
                        >
                            <div className="text-3xl mb-3">📄</div>
                            <div className="font-semibold text-white mb-1">Upload CV / Resume</div>
                            <div className="text-sm text-slate-400">We'll extract your skills automatically</div>
                        </button>
                        <button
                            onClick={() => setSkillsInputMode("manual")}
                            className={`p-6 rounded-2xl border-2 text-left transition-all ${
                                skillsInputMode === "manual"
                                    ? "border-blue-400 bg-blue-400/10"
                                    : "border-white/10 hover:border-white/30 bg-white/5"
                            }`}
                        >
                            <div className="text-3xl mb-3">✏️</div>
                            <div className="font-semibold text-white mb-1">Type Manually</div>
                            <div className="text-sm text-slate-400">List your skills one by one</div>
                        </button>
                    </div>

                    {skillsInputMode === "upload" && (
                        <div className="mb-8">
                            <label className="block text-sm text-slate-400 mb-3">Upload your CV (PDF, DOCX, or TXT)</label>
                            <div className="border-2 border-dashed border-white/20 rounded-2xl p-8 text-center hover:border-blue-400/50 transition-all cursor-pointer">
                                <input
                                    type="file"
                                    accept=".pdf,.docx,.doc,.txt"
                                    onChange={handleCvUpload}
                                    className="hidden"
                                    id="cv-upload-multimarket"
                                />
                                <label htmlFor="cv-upload-multimarket" className="cursor-pointer">
                                    <div className="text-4xl mb-3">{cvFile ? "✅" : "📎"}</div>
                                    <div className="text-white font-medium mb-1">
                                        {cvFile ? cvFile.name : "Click to upload or drag and drop"}
                                    </div>
                                    <div className="text-sm text-slate-500">PDF, DOCX, or TXT up to 5MB</div>
                                </label>
                            </div>
                            {cvFile && (
                                <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                                    <div className="flex items-center gap-2 text-blue-400">
                                        <span className="text-sm">Skills extracted successfully!</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {skillsInputMode === "manual" && (
                        <textarea
                            value={formData.skills}
                            onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                            placeholder="Python, JavaScript, React, AWS, Docker, PostgreSQL..."
                            className="w-full bg-white/5 p-6 rounded-2xl border border-white/10 focus:border-blue-400/50 outline-none transition-all text-white min-h-[150px] text-lg mb-8"
                        />
                    )}

                    <div className="flex justify-between">
                        <button
                            onClick={() => setStep("profile")}
                            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" /> Back
                        </button>
                        <button
                            onClick={() => setStep("review")}
                            className="btn-primary px-8 py-3 flex items-center gap-2 bg-blue-600 hover:bg-blue-500"
                        >
                            Review <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {step === "review" && (
                <div className="glass-card p-10 rounded-3xl border border-white/10 animate-fade-in">
                    <h2 className="text-3xl font-bold text-white mb-2">Ready to analyze?</h2>
                    <p className="text-slate-400 mb-8">We'll compare {formData.compareMarkets.length + 1} markets for you</p>
                    
                    <div className="space-y-4 mb-8">
                        <div className="flex justify-between p-4 rounded-xl bg-white/5">
                            <span className="text-slate-400">Target Role</span>
                            <span className="text-white font-medium">{formData.targetRole}</span>
                        </div>
                        <div className="flex justify-between p-4 rounded-xl bg-white/5">
                            <span className="text-slate-400">Primary Market</span>
                            <span className="text-white font-medium">{formData.primaryMarket}</span>
                        </div>
                        <div className="flex justify-between p-4 rounded-xl bg-white/5">
                            <span className="text-slate-400">Comparing With</span>
                            <span className="text-white font-medium">{formData.compareMarkets.join(", ")}</span>
                        </div>
                        <div className="flex justify-between p-4 rounded-xl bg-white/5">
                            <span className="text-slate-400">Experience</span>
                            <span className="text-white font-medium capitalize">{formData.currentStatus}</span>
                        </div>
                    </div>

                    <div className="flex justify-between">
                        <button
                            onClick={() => setStep("skills")}
                            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" /> Back
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="btn-primary px-12 py-4 flex items-center gap-3 disabled:opacity-50 bg-blue-600 hover:bg-blue-500"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" /> Analyzing...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-5 h-5" /> Analyze Markets
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
