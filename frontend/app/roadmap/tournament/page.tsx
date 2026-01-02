"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Crown, ArrowRight, ArrowLeft, Check, Loader2, Sparkles } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type Step = "intro" | "role" | "profile" | "skills" | "constraints" | "review";

export default function TournamentPage() {
    const router = useRouter();
    const [step, setStep] = useState<Step>("intro");
    const [isLoading, setIsLoading] = useState(false);
    const [skillsInputMode, setSkillsInputMode] = useState<"upload" | "manual">("manual");
    const [cvFile, setCvFile] = useState<File | null>(null);
    
    const [formData, setFormData] = useState({
        targetRole: "",
        location: "Kenya",
        currentStatus: "beginner",
        skills: "",
        constraints: ""
    });

    const steps = [
        { key: "intro", label: "Start" },
        { key: "role", label: "Target Role" },
        { key: "profile", label: "Profile" },
        { key: "skills", label: "Skills" },
        { key: "constraints", label: "Details" },
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

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/tournament/start`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    career_goal: formData.targetRole,
                    location: formData.location,
                    current_status: formData.currentStatus,
                    skills: formData.skills.split(",").map(s => s.trim()).filter(Boolean),
                    constraints: formData.constraints.split(",").map(c => c.trim()).filter(Boolean)
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
                                    ${i < currentStepIndex ? "bg-purple-500 text-black" :
                                      i === currentStepIndex ? "bg-purple-400 text-black" : "bg-white/10 text-slate-500"}
                                `}>
                                    {i < currentStepIndex ? <Check className="w-4 h-4" /> : i + 1}
                                </div>
                                {i < steps.length - 2 && (
                                    <div className={`w-12 h-0.5 mx-1 ${i < currentStepIndex ? "bg-purple-500" : "bg-white/10"}`} />
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
                    <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mx-auto mb-8 animate-pulse">
                        <Crown className="w-12 h-12 text-purple-400" />
                    </div>
                    
                    <h1 className="text-5xl font-bold text-white mb-6 tracking-tight">
                        Agent Tournament
                    </h1>
                    
                    <p className="text-2xl text-slate-300 font-light mb-4 leading-relaxed">
                        Let AI agents battle for your career
                    </p>
                    
                    <p className="text-slate-500 mb-12 max-w-lg mx-auto leading-relaxed">
                        Four specialized AI strategies compete to create the optimal roadmap for you. 
                        The winner's analysis becomes your personalized career blueprint.
                    </p>

                    <div className="space-y-4 mb-12">
                        <div className="flex items-center justify-center gap-3 text-slate-400">
                            <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                            <span className="text-sm">4 competing agent strategies</span>
                        </div>
                        <div className="flex items-center justify-center gap-3 text-slate-400">
                            <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                            <span className="text-sm">Evolutionary algorithm scoring</span>
                        </div>
                        <div className="flex items-center justify-center gap-3 text-slate-400">
                            <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                            <span className="text-sm">Winning strategy becomes your roadmap</span>
                        </div>
                    </div>

                    <button
                        onClick={() => setStep("role")}
                        className="btn-primary px-12 py-5 text-lg flex items-center gap-3 mx-auto group bg-purple-600 hover:bg-purple-500"
                    >
                        Start Tournament
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            )}

            {step === "role" && (
                <div className="glass-card p-10 rounded-3xl border border-white/10 animate-fade-in">
                    <h2 className="text-3xl font-bold text-white mb-2">What role are you targeting?</h2>
                    <p className="text-slate-400 mb-8">The competing agents will optimize for this goal</p>
                    
                    <input
                        type="text"
                        value={formData.targetRole}
                        onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                        placeholder="Enter your target role..."
                        className="w-full bg-white/5 p-6 rounded-2xl border border-white/10 focus:border-purple-400/50 outline-none transition-all text-xl text-white mb-8"
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
                            onClick={() => setStep("profile")}
                            disabled={!formData.targetRole.trim()}
                            className="btn-primary px-8 py-3 flex items-center gap-2 disabled:opacity-50 bg-purple-600 hover:bg-purple-500"
                        >
                            Continue <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {step === "profile" && (
                <div className="glass-card p-10 rounded-3xl border border-white/10 animate-fade-in">
                    <h2 className="text-3xl font-bold text-white mb-2">Tell us about yourself</h2>
                    <p className="text-slate-400 mb-8">This helps agents tailor their strategies</p>
                    
                    <div className="grid grid-cols-2 gap-6 mb-8">
                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-3 block">Location</label>
                            <select
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                className="w-full bg-white/5 p-4 rounded-xl border border-white/10 focus:border-purple-400/50 outline-none transition-all text-white"
                            >
                                <option value="Kenya">Kenya</option>
                                <option value="Remote">Remote (Global)</option>
                                <option value="US">United States</option>
                                <option value="EU">Europe</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-3 block">Experience Level</label>
                            <select
                                value={formData.currentStatus}
                                onChange={(e) => setFormData({ ...formData, currentStatus: e.target.value })}
                                className="w-full bg-white/5 p-4 rounded-xl border border-white/10 focus:border-purple-400/50 outline-none transition-all text-white"
                            >
                                <option value="beginner">Beginner (0-1 years)</option>
                                <option value="intermediate">Intermediate (2-4 years)</option>
                                <option value="advanced">Advanced (5-7 years)</option>
                                <option value="expert">Expert (8+ years)</option>
                            </select>
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
                            onClick={() => setStep("skills")}
                            className="btn-primary px-8 py-3 flex items-center gap-2 bg-purple-600 hover:bg-purple-500"
                        >
                            Continue <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {step === "skills" && (
                <div className="glass-card p-10 rounded-3xl border border-white/10 animate-fade-in">
                    <h2 className="text-3xl font-bold text-white mb-2">What skills do you have?</h2>
                    <p className="text-slate-400 mb-8">Agents will analyze your strengths and identify gaps</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        <button
                            onClick={() => setSkillsInputMode("upload")}
                            className={`p-6 rounded-2xl border-2 text-left transition-all ${
                                skillsInputMode === "upload"
                                    ? "border-purple-400 bg-purple-400/10"
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
                                    ? "border-purple-400 bg-purple-400/10"
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
                            <div className="border-2 border-dashed border-white/20 rounded-2xl p-8 text-center hover:border-purple-400/50 transition-all cursor-pointer">
                                <input
                                    type="file"
                                    accept=".pdf,.docx,.doc,.txt"
                                    onChange={handleCvUpload}
                                    className="hidden"
                                    id="cv-upload-tournament"
                                />
                                <label htmlFor="cv-upload-tournament" className="cursor-pointer">
                                    <div className="text-4xl mb-3">{cvFile ? "✅" : "📎"}</div>
                                    <div className="text-white font-medium mb-1">
                                        {cvFile ? cvFile.name : "Click to upload or drag and drop"}
                                    </div>
                                    <div className="text-sm text-slate-500">PDF, DOCX, or TXT up to 5MB</div>
                                </label>
                            </div>
                            {cvFile && (
                                <div className="mt-4 p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl">
                                    <div className="flex items-center gap-2 text-purple-400">
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
                            className="w-full bg-white/5 p-6 rounded-2xl border border-white/10 focus:border-purple-400/50 outline-none transition-all text-white min-h-[150px] text-lg mb-8"
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
                            onClick={() => setStep("constraints")}
                            className="btn-primary px-8 py-3 flex items-center gap-2 bg-purple-600 hover:bg-purple-500"
                        >
                            Continue <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {step === "constraints" && (
                <div className="glass-card p-10 rounded-3xl border border-white/10 animate-fade-in">
                    <h2 className="text-3xl font-bold text-white mb-2">Any constraints?</h2>
                    <p className="text-slate-400 mb-8">Help the agents understand your situation</p>
                    
                    <div className="mb-8">
                        <input
                            type="text"
                            value={formData.constraints}
                            onChange={(e) => setFormData({ ...formData, constraints: e.target.value })}
                            placeholder="Full-time job, limited study hours, family commitments..."
                            className="w-full bg-white/5 p-4 rounded-xl border border-white/10 focus:border-purple-400/50 outline-none transition-all text-white"
                        />
                    </div>

                    <div className="flex justify-between">
                        <button
                            onClick={() => setStep("skills")}
                            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" /> Back
                        </button>
                        <button
                            onClick={() => setStep("review")}
                            className="btn-primary px-8 py-3 flex items-center gap-2 bg-purple-600 hover:bg-purple-500"
                        >
                            Review <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {step === "review" && (
                <div className="glass-card p-10 rounded-3xl border border-white/10 animate-fade-in">
                    <h2 className="text-3xl font-bold text-white mb-2">Ready for the tournament?</h2>
                    <p className="text-slate-400 mb-8">4 agents will compete for the best strategy</p>
                    
                    <div className="space-y-4 mb-8">
                        <div className="flex justify-between p-4 rounded-xl bg-white/5">
                            <span className="text-slate-400">Target Role</span>
                            <span className="text-white font-medium">{formData.targetRole}</span>
                        </div>
                        <div className="flex justify-between p-4 rounded-xl bg-white/5">
                            <span className="text-slate-400">Location</span>
                            <span className="text-white font-medium">{formData.location}</span>
                        </div>
                        <div className="flex justify-between p-4 rounded-xl bg-white/5">
                            <span className="text-slate-400">Experience</span>
                            <span className="text-white font-medium capitalize">{formData.currentStatus}</span>
                        </div>
                        <div className="flex justify-between p-4 rounded-xl bg-white/5">
                            <span className="text-slate-400">Skills Listed</span>
                            <span className="text-white font-medium text-right max-w-[60%]">{formData.skills || "None"}</span>
                        </div>
                    </div>

                    <div className="flex justify-between">
                        <button
                            onClick={() => setStep("constraints")}
                            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" /> Back
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="btn-primary px-12 py-4 flex items-center gap-3 disabled:opacity-50 bg-purple-600 hover:bg-purple-500"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" /> Running...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-5 h-5" /> Launch Tournament
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
