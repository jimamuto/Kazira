"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TrendingUp, ArrowRight, ArrowLeft, Check, Loader2, Sparkles } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type Step = "intro" | "target" | "current" | "skills" | "review";

export default function StrategicPage() {
    const router = useRouter();
    const [step, setStep] = useState<Step>("intro");
    const [isLoading, setIsLoading] = useState(false);
    const [skillsInputMode, setSkillsInputMode] = useState<"upload" | "manual">("manual");
    const [cvFile, setCvFile] = useState<File | null>(null);
    
    const [formData, setFormData] = useState({
        targetRole: "",
        startRole: "Junior Developer",
        experience: 0,
        location: "Kenya",
        currentSkills: ""
    });

    const steps = [
        { key: "intro", label: "Start" },
        { key: "target", label: "Target" },
        { key: "current", label: "Current" },
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
                setFormData(prev => ({ ...prev, currentSkills: data.skills.join(", ") }));
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
            const response = await fetch(`${API_URL}/api/strategic/path`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    target_role: formData.targetRole,
                    start_role: formData.startRole,
                    current_skills: formData.currentSkills.split(",").map(s => s.trim()).filter(Boolean),
                    years_experience: formData.experience,
                    location: formData.location
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
                                    ${i < currentStepIndex ? "bg-emerald-500 text-black" :
                                      i === currentStepIndex ? "bg-emerald-400 text-black" : "bg-white/10 text-slate-500"}
                                `}>
                                    {i < currentStepIndex ? <Check className="w-4 h-4" /> : i + 1}
                                </div>
                                {i < steps.length - 2 && (
                                    <div className={`w-16 h-0.5 mx-1 ${i < currentStepIndex ? "bg-emerald-500" : "bg-white/10"}`} />
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
                    <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center mx-auto mb-8 animate-pulse">
                        <TrendingUp className="w-12 h-12 text-emerald-400" />
                    </div>
                    
                    <h1 className="text-5xl font-bold text-white mb-6 tracking-tight">
                        5-Year Trajectory
                    </h1>
                    
                    <p className="text-2xl text-slate-300 font-light mb-4 leading-relaxed">
                        Chart your path to executive leadership
                    </p>
                    
                    <p className="text-slate-500 mb-12 max-w-lg mx-auto leading-relaxed">
                        Generate a complete career trajectory from your current level to CTO or VP Engineering. 
                        Includes velocity tracking, market alignment, and success probability calculations.
                    </p>

                    <div className="space-y-4 mb-12">
                        <div className="flex items-center justify-center gap-3 text-slate-400">
                            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                            <span className="text-sm">5-year career roadmap</span>
                        </div>
                        <div className="flex items-center justify-center gap-3 text-slate-400">
                            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                            <span className="text-sm">Learning velocity tracking</span>
                        </div>
                        <div className="flex items-center justify-center gap-3 text-slate-400">
                            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                            <span className="text-sm">Market alignment analysis</span>
                        </div>
                        <div className="flex items-center justify-center gap-3 text-slate-400">
                            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                            <span className="text-sm">Success probability score</span>
                        </div>
                    </div>

                    <button
                        onClick={() => setStep("target")}
                        className="btn-primary px-12 py-5 text-lg flex items-center gap-3 mx-auto group bg-emerald-600 hover:bg-emerald-500"
                    >
                        Plan My Trajectory
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            )}

            {step === "target" && (
                <div className="glass-card p-10 rounded-3xl border border-white/10 animate-fade-in">
                    <h2 className="text-3xl font-bold text-white mb-2">Where do you want to be?</h2>
                    <p className="text-slate-400 mb-8">Your 5-year target role</p>
                    
                    <input
                        type="text"
                        value={formData.targetRole}
                        onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                        placeholder="e.g. CTO, VP Engineering, Tech Lead..."
                        className="w-full bg-white/5 p-6 rounded-2xl border border-white/10 focus:border-emerald-400/50 outline-none transition-all text-xl text-white mb-8"
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
                            onClick={() => setStep("current")}
                            disabled={!formData.targetRole.trim()}
                            className="btn-primary px-8 py-3 flex items-center gap-2 disabled:opacity-50 bg-emerald-600 hover:bg-emerald-500"
                        >
                            Continue <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {step === "current" && (
                <div className="glass-card p-10 rounded-3xl border border-white/10 animate-fade-in">
                    <h2 className="text-3xl font-bold text-white mb-2">Where are you now?</h2>
                    <p className="text-slate-400 mb-8">Your current position and experience</p>
                    
                    <div className="grid grid-cols-2 gap-6 mb-8">
                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-3 block">Current Role</label>
                            <select
                                value={formData.startRole}
                                onChange={(e) => setFormData({ ...formData, startRole: e.target.value })}
                                className="w-full bg-white/5 p-4 rounded-xl border border-white/10 focus:border-emerald-400/50 outline-none transition-all text-white"
                            >
                                <option value="Junior Developer">Junior Developer</option>
                                <option value="Mid-Level Developer">Mid-Level Developer</option>
                                <option value="Senior Developer">Senior Developer</option>
                                <option value="Tech Lead">Tech Lead</option>
                                <option value="Engineering Manager">Engineering Manager</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-3 block">Years Experience</label>
                            <input
                                type="number"
                                value={formData.experience}
                                onChange={(e) => setFormData({ ...formData, experience: parseInt(e.target.value) })}
                                className="w-full bg-white/5 p-4 rounded-xl border border-white/10 focus:border-emerald-400/50 outline-none transition-all text-white"
                                min={0}
                                max={20}
                            />
                        </div>
                    </div>

                    <div className="mb-8">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-3 block">Location</label>
                        <select
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            className="w-full bg-white/5 p-4 rounded-xl border border-white/10 focus:border-emerald-400/50 outline-none transition-all text-white"
                        >
                            <option value="Kenya">Kenya</option>
                            <option value="Remote">Remote</option>
                            <option value="US">United States</option>
                            <option value="EU">Europe</option>
                        </select>
                    </div>

                    <div className="flex justify-between">
                        <button
                            onClick={() => setStep("target")}
                            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" /> Back
                        </button>
                        <button
                            onClick={() => setStep("skills")}
                            className="btn-primary px-8 py-3 flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500"
                        >
                            Continue <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {step === "skills" && (
                <div className="glass-card p-10 rounded-3xl border border-white/10 animate-fade-in">
                    <h2 className="text-3xl font-bold text-white mb-2">What skills do you have?</h2>
                    <p className="text-slate-400 mb-8">Your current technical toolkit</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        <button
                            onClick={() => setSkillsInputMode("upload")}
                            className={`p-6 rounded-2xl border-2 text-left transition-all ${
                                skillsInputMode === "upload"
                                    ? "border-emerald-400 bg-emerald-400/10"
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
                                    ? "border-emerald-400 bg-emerald-400/10"
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
                            <div className="border-2 border-dashed border-white/20 rounded-2xl p-8 text-center hover:border-emerald-400/50 transition-all cursor-pointer">
                                <input
                                    type="file"
                                    accept=".pdf,.docx,.doc,.txt"
                                    onChange={handleCvUpload}
                                    className="hidden"
                                    id="cv-upload-strategic"
                                />
                                <label htmlFor="cv-upload-strategic" className="cursor-pointer">
                                    <div className="text-4xl mb-3">{cvFile ? "✅" : "📎"}</div>
                                    <div className="text-white font-medium mb-1">
                                        {cvFile ? cvFile.name : "Click to upload or drag and drop"}
                                    </div>
                                    <div className="text-sm text-slate-500">PDF, DOCX, or TXT up to 5MB</div>
                                </label>
                            </div>
                            {cvFile && (
                                <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                                    <div className="flex items-center gap-2 text-emerald-400">
                                        <span className="text-sm">Skills extracted successfully!</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {skillsInputMode === "manual" && (
                        <textarea
                            value={formData.currentSkills}
                            onChange={(e) => setFormData({ ...formData, currentSkills: e.target.value })}
                            placeholder="Python, JavaScript, AWS, Docker, System Design, Team Leadership..."
                            className="w-full bg-white/5 p-6 rounded-2xl border border-white/10 focus:border-emerald-400/50 outline-none transition-all text-white min-h-[150px] text-lg mb-8"
                        />
                    )}

                    <div className="flex justify-between">
                        <button
                            onClick={() => setStep("current")}
                            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" /> Back
                        </button>
                        <button
                            onClick={() => setStep("review")}
                            className="btn-primary px-8 py-3 flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500"
                        >
                            Review <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {step === "review" && (
                <div className="glass-card p-10 rounded-3xl border border-white/10 animate-fade-in">
                    <h2 className="text-3xl font-bold text-white mb-2">Ready to map your future?</h2>
                    <p className="text-slate-400 mb-8">Your 5-year trajectory analysis</p>
                    
                    <div className="space-y-4 mb-8">
                        <div className="flex justify-between p-4 rounded-xl bg-white/5">
                            <span className="text-slate-400">Current Role</span>
                            <span className="text-white font-medium">{formData.startRole}</span>
                        </div>
                        <div className="flex justify-between p-4 rounded-xl bg-white/5">
                            <span className="text-slate-400">Experience</span>
                            <span className="text-white font-medium">{formData.experience} years</span>
                        </div>
                        <div className="flex justify-between p-4 rounded-xl bg-white/5">
                            <span className="text-slate-400">Target Role</span>
                            <span className="text-white font-medium">{formData.targetRole}</span>
                        </div>
                        <div className="flex justify-between p-4 rounded-xl bg-white/5">
                            <span className="text-slate-400">Location</span>
                            <span className="text-white font-medium">{formData.location}</span>
                        </div>
                        <div className="flex justify-between p-4 rounded-xl bg-white/5">
                            <span className="text-slate-400">Skills</span>
                            <span className="text-white font-medium text-right max-w-[60%]">{formData.currentSkills || "None listed"}</span>
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
                            className="btn-primary px-12 py-4 flex items-center gap-3 disabled:opacity-50 bg-emerald-600 hover:bg-emerald-500"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" /> Generating...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-5 h-5" /> Generate Trajectory
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
