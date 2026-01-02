"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ClipboardList, ArrowRight, ArrowLeft, Check, Loader2, Sparkles } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

console.log("=== SINGLE PIPELINE PAGE LOADED ===");
console.log("API_URL:", API_URL);
console.log("Environment:", process.env.NEXT_PUBLIC_API_URL ? "Production" : "Development");

type Step = "intro" | "role" | "profile" | "skills" | "constraints" | "review";

export default function SinglePipelinePage() {
    const router = useRouter();
    const [step, setStep] = useState<Step>("intro");
    const [isLoading, setIsLoading] = useState(false);
    const [skillsInputMode, setSkillsInputMode] = useState<"upload" | "manual">("manual");
    const [cvFile, setCvFile] = useState<File | null>(null);

    // Log component mount
    console.log("Single Pipeline Page Component Mounted");
    console.log("CV Upload Handler Ready");
    console.log("Form Submit Handler Ready");

    const [formData, setFormData] = useState({
        targetRole: "",
        location: "Kenya",
        currentStatus: "beginner",
        skills: "",
        timeframe: 6,
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

        console.log("=== CV/RESUME UPLOAD STARTED ===");
        console.log("File selected:", file.name);
        console.log("File size:", file.size, "bytes (", (file.size / 1024 / 1024).toFixed(2), "MB)");
        console.log("File type:", file.type);

        setCvFile(file);
        setIsLoading(true);

        try {
            console.log("Starting upload to backend...");

            const formData = new FormData();
            formData.append("cv", file);
            console.log("FormData created with file");

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000);

            const response = await fetch(`${API_URL}/api/roadmap/extract-skills`, {
                method: "POST",
                body: formData,
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            console.log("Response received");
            console.log("Response status:", response.status, response.statusText);
            console.log("Response OK:", response.ok);

            if (!response.ok) {
                console.log("Server error:", response.status);
                throw new Error(`Server error: ${response.status}`);
            }

            console.log("Parsing JSON response...");
            const data = await response.json();
            console.log("Full response data:", data);

            if (data.skills) {
                console.log("Skills extracted successfully!");
                console.log("Number of skills:", data.skills.length);
                console.log("Skills:", data.skills);
                setFormData(prev => ({ ...prev, skills: data.skills.join(", ") }));
                console.log("Form state updated with skills");
            } else {
                console.log("No skills found in response");
                console.log("Available keys:", Object.keys(data));
            }
        } catch (error: any) {
            console.error("Error extracting skills:", error);
            console.error("Error name:", error?.name);
            console.error("Error message:", error?.message);
            if (error.name === 'AbortError') {
                console.log("Request timed out (30s)");
                alert("Request timed out. Please check your internet connection.");
            } else {
                console.log("Upload failed");
                alert("Failed to extract skills. Please try again.");
            }
        } finally {
            console.log("Upload process completed");
            console.log("Resetting loading state");
            setIsLoading(false);
        }
    };

    const handleSubmit = async () => {
        console.log("=== FORM SUBMIT STARTED ===");
        console.log("Form data:", formData);

        setIsLoading(true);
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 60000);

            const requestBody = {
                target_role: formData.targetRole,
                location: formData.location,
                current_status: formData.currentStatus,
                skills: formData.skills.split(",").map(s => s.trim()).filter(Boolean),
                timeframe_months: formData.timeframe,
                constraints: formData.constraints.split(",").map(c => c.trim()).filter(Boolean)
            };

            console.log("Sending request to:", `${API_URL}/api/roadmap/generate-quick`);
            console.log("Request body:", requestBody);

            const response = await fetch(`${API_URL}/api/roadmap/generate-quick`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody),
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            console.log("Response received");
            console.log("Response status:", response.status);
            console.log("Response OK:", response.ok);

            if (!response.ok) {
                console.log("Request failed!");
                const errorData = await response.json();
                console.log("Error data:", errorData);
                throw new Error(errorData.detail || "Failed to generate roadmap");
            }

            const data = await response.json();
            router.push(`/roadmap/result/${data.result_id}?origin=single`);
        } catch (error: any) {
            console.error("Error generating roadmap:", error);
            if (error.name === 'AbortError') {
                alert("Request timed out. The AI agent is taking longer than expected. Please try again.");
            } else {
                alert(`Error: ${error.message || "Failed to generate roadmap. Please check your inputs and try again."}`);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            {/* Progress Bar */}
            {step !== "intro" && (
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                        {steps.slice(0, -1).map((s, i) => (
                            <div key={s.key} className="flex items-center">
                                <div className={`
                                    w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                                    ${i < currentStepIndex ? "bg-emerald-500 text-black" :
                                        i === currentStepIndex ? "bg-cyan-400 text-black" : "bg-white/10 text-slate-500"}
                                `}>
                                    {i < currentStepIndex ? <Check className="w-4 h-4" /> : i + 1}
                                </div>
                                {i < steps.length - 2 && (
                                    <div className={`w-12 h-0.5 mx-1 ${i < currentStepIndex ? "bg-emerald-500" : "bg-white/10"}`} />
                                )}
                            </div>
                        ))}
                    </div>
                    <p className="text-xs text-slate-500 text-center mt-4 uppercase tracking-widest">
                        Step {currentStepIndex} of {steps.length - 1}: {steps[currentStepIndex].label}
                    </p>
                </div>
            )}

            {/* INTRO STEP */}
            {step === "intro" && (
                <div className="text-center py-12">
                    <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center mx-auto mb-8 animate-pulse">
                        <ClipboardList className="w-12 h-12 text-cyan-400" />
                    </div>

                    <h1 className="text-5xl font-bold text-white mb-6 tracking-tight">
                        Single Pipeline
                    </h1>

                    <p className="text-2xl text-slate-300 font-light mb-4 leading-relaxed">
                        Your personal AI career strategist
                    </p>

                    <p className="text-slate-500 mb-10 max-w-lg mx-auto leading-relaxed text-sm">
                        Generate a precision-engineered 6-month roadmap tailored to your unique profile,
                        backed by live market data and AI-powered insights.
                    </p>

                    <div className="space-y-3 mb-10">
                        <div className="flex items-center justify-center gap-3 text-slate-400">
                            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                            <span className="text-sm">Live market analysis</span>
                        </div>
                        <div className="flex items-center justify-center gap-3 text-slate-400">
                            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                            <span className="text-sm">Personalized learning path</span>
                        </div>
                        <div className="flex items-center justify-center gap-3 text-slate-400">
                            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                            <span className="text-sm">Verified resources & projects</span>
                        </div>
                    </div>

                    <button
                        onClick={() => setStep("role")}
                        className="btn-primary px-10 py-4 text-base flex items-center gap-3 mx-auto group"
                    >
                        Begin Journey
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            )}

            {/* ROLE STEP */}
            {step === "role" && (
                <div className="glass-card p-10 rounded-3xl border border-white/10 animate-fade-in">
                    <h2 className="text-3xl font-bold text-white mb-2">What role are you targeting?</h2>
                    <p className="text-slate-400 mb-8">Be specific - e.g. "Senior AI Engineer" or "Cloud Architect"</p>

                    <input
                        type="text"
                        value={formData.targetRole}
                        onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                        placeholder="Enter your target role..."
                        className="w-full bg-white/5 p-6 rounded-2xl border border-white/10 focus:border-cyan-400/50 outline-none transition-all text-xl text-white mb-8"
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
                            className="btn-primary px-8 py-3 flex items-center gap-2 disabled:opacity-50"
                        >
                            Continue <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* PROFILE STEP */}
            {step === "profile" && (
                <div className="glass-card p-10 rounded-3xl border border-white/10 animate-fade-in">
                    <h2 className="text-3xl font-bold text-white mb-2">Tell us about yourself</h2>
                    <p className="text-slate-400 mb-8">This helps us personalize your roadmap</p>

                    <div className="grid grid-cols-2 gap-6 mb-8">
                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-3 block">Location</label>
                            <select
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                className="w-full bg-white/5 p-4 rounded-xl border border-white/10 focus:border-cyan-400/50 outline-none transition-all text-white"
                            >
                                <option value="Kenya" className="bg-[#0a0a0a] text-white">Kenya</option>
                                <option value="Remote" className="bg-[#0a0a0a] text-white">Remote (Global)</option>
                                <option value="US" className="bg-[#0a0a0a] text-white">United States</option>
                                <option value="EU" className="bg-[#0a0a0a] text-white">Europe</option>
                                <option value="UK" className="bg-[#0a0a0a] text-white">United Kingdom</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-3 block">Experience Level</label>
                            <select
                                value={formData.currentStatus}
                                onChange={(e) => setFormData({ ...formData, currentStatus: e.target.value })}
                                className="w-full bg-white/5 p-4 rounded-xl border border-white/10 focus:border-cyan-400/50 outline-none transition-all text-white"
                            >
                                <option value="beginner" className="bg-[#0a0a0a] text-white">Beginner (0-1 years)</option>
                                <option value="intermediate" className="bg-[#0a0a0a] text-white">Intermediate (2-4 years)</option>
                                <option value="advanced" className="bg-[#0a0a0a] text-white">Advanced (5-7 years)</option>
                                <option value="expert" className="bg-[#0a0a0a] text-white">Expert (8+ years)</option>
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
                            className="btn-primary px-8 py-3 flex items-center gap-2"
                        >
                            Continue <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* SKILLS STEP */}
            {step === "skills" && (
                <div className="glass-card p-10 rounded-3xl border border-white/10 animate-fade-in">
                    <h2 className="text-3xl font-bold text-white mb-2">What skills do you have?</h2>
                    <p className="text-slate-400 mb-8">Choose how you'd like to add your skills</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        <button
                            onClick={() => setSkillsInputMode("upload")}
                            className={`p-6 rounded-2xl border-2 text-left transition-all ${skillsInputMode === "upload"
                                ? "border-cyan-400 bg-cyan-400/10"
                                : "border-white/10 hover:border-white/30 bg-white/5"
                                }`}
                        >
                            <div className="text-3xl mb-3">📄</div>
                            <div className="font-semibold text-white mb-1">Upload CV / Resume</div>
                            <div className="text-sm text-slate-400">We'll extract your skills automatically</div>
                        </button>
                        <button
                            onClick={() => setSkillsInputMode("manual")}
                            className={`p-6 rounded-2xl border-2 text-left transition-all ${skillsInputMode === "manual"
                                ? "border-cyan-400 bg-cyan-400/10"
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
                            <div
                                className="border-2 border-dashed border-white/20 rounded-2xl p-8 text-center hover:border-cyan-400/50 transition-all cursor-pointer"
                                onDragEnter={() => console.log("File dragged into drop zone")}
                                onDragLeave={() => console.log("File left drop zone")}
                                onDrop={() => console.log("File dropped in drop zone")}
                            >
                                <input
                                    type="file"
                                    accept=".pdf,.docx,.doc,.txt"
                                    onChange={handleCvUpload}
                                    onClick={() => console.log("File input clicked")}
                                    className="hidden"
                                    id="cv-upload"
                                />
                                <label htmlFor="cv-upload" className="cursor-pointer">
                                    <div className="text-4xl mb-3">{cvFile ? "CHECK" : "DOC"}</div>
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
                            value={formData.skills}
                            onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                            placeholder="Python, JavaScript, React, AWS, Docker, PostgreSQL..."
                            className="w-full bg-white/5 p-6 rounded-2xl border border-white/10 focus:border-cyan-400/50 outline-none transition-all text-white min-h-[150px] text-lg mb-8"
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
                            className="btn-primary px-8 py-3 flex items-center gap-2"
                        >
                            Continue <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* CONSTRAINTS STEP */}
            {step === "constraints" && (
                <div className="glass-card p-10 rounded-3xl border border-white/10 animate-fade-in">
                    <h2 className="text-3xl font-bold text-white mb-2">Final details</h2>
                    <p className="text-slate-400 mb-8">Timeframe and any constraints</p>

                    <div className="grid grid-cols-2 gap-6 mb-8">
                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-3 block">Timeframe (months)</label>
                            <input
                                type="number"
                                value={formData.timeframe}
                                onChange={(e) => {
                                    const value = parseInt(e.target.value) || 0;
                                    const validValue = Math.max(1, Math.min(24, value));
                                    setFormData({ ...formData, timeframe: validValue });
                                }}
                                className="w-full bg-white/5 p-4 rounded-xl border border-white/10 focus:border-cyan-400/50 outline-none transition-all text-white"
                                min={1}
                                max={24}
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-3 block">Constraints (optional)</label>
                            <input
                                type="text"
                                value={formData.constraints}
                                onChange={(e) => setFormData({ ...formData, constraints: e.target.value })}
                                placeholder="Full-time job, limited hours..."
                                className="w-full bg-white/5 p-4 rounded-xl border border-white/10 focus:border-cyan-400/50 outline-none transition-all text-white"
                            />
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
                            onClick={() => setStep("review")}
                            className="btn-primary px-8 py-3 flex items-center gap-2"
                        >
                            Review <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* REVIEW STEP */}
            {step === "review" && (
                <div className="glass-card p-10 rounded-3xl border border-white/10 animate-fade-in">
                    <h2 className="text-3xl font-bold text-white mb-2">Review your journey</h2>
                    <p className="text-slate-400 mb-8">Everything looks good?</p>

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
                            <span className="text-slate-400">Skills</span>
                            <span className="text-white font-medium text-right max-w-[60%]">{formData.skills || "None listed"}</span>
                        </div>
                        <div className="flex justify-between p-4 rounded-xl bg-white/5">
                            <span className="text-slate-400">Timeframe</span>
                            <span className="text-white font-medium">{formData.timeframe} months</span>
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
                            className="btn-primary px-12 py-4 flex items-center gap-3 disabled:opacity-50"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" /> Generating...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-5 h-5" /> Generate Roadmap
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
