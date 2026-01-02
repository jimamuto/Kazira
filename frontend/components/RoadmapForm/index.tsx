"use client";

import { useState } from "react";
import Link from "next/link";
import { RoadmapInput, RoadmapOutput } from "@/types/roadmap";
import { DOMAIN_TOOLKITS, TECH_ECOSYSTEMS, COMMON_ROLES, CONSTRAINT_CATEGORIES } from "@/constants/domains";
import { Sparkles } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface RoadmapFormProps {
    onSuccess: (data: RoadmapOutput) => void;
    onStartGeneration?: (goal: string) => void;
}

function RoadmapSkeleton() {
    return (
        <div className="max-w-7xl mx-auto py-32 px-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-32 gap-12">
                <div className="space-y-6 w-full max-w-xl">
                    <div className="h-20 w-3/4 bg-white/5 rounded-3xl animate-pulse"></div>
                    <div className="space-y-3">
                        <div className="h-4 w-full bg-white/5 rounded-full animate-pulse"></div>
                        <div className="h-4 w-2/3 bg-white/5 rounded-full animate-pulse"></div>
                    </div>
                </div>
            </div>

            <div className="relative mb-64">
                <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-white/5 -translate-x-1/2"></div>

                <div className="space-y-48">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="relative">
                            <div className={`flex flex-col md:flex-row items-start md:items-center gap-20 ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                                <div className="w-full md:w-[45%]">
                                    <div className="glass-card rounded-[48px] border-white/5 p-12 md:p-16 relative overflow-hidden">
                                        <div className="mb-12 space-y-6">
                                            <div className="h-10 w-2/3 bg-white/10 rounded-2xl animate-pulse"></div>
                                            <div className="flex gap-3">
                                                <div className="h-6 w-20 bg-white/5 rounded-full animate-pulse"></div>
                                                <div className="h-6 w-24 bg-white/5 rounded-full animate-pulse"></div>
                                                <div className="h-6 w-16 bg-white/5 rounded-full animate-pulse"></div>
                                            </div>
                                        </div>
                                        <div className="space-y-8">
                                            <div className="h-4 w-1/4 bg-white/5 rounded-full animate-pulse"></div>
                                            <div className="space-y-4">
                                                <div className="h-2 w-full bg-white/5 rounded-full animate-pulse"></div>
                                                <div className="h-2 w-5/6 bg-white/5 rounded-full animate-pulse"></div>
                                                <div className="h-2 w-4/6 bg-white/5 rounded-full animate-pulse"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="absolute left-6 md:left-1/2 -translate-x-1/2 z-10 top-0 md:top-1/2">
                                    <div className="w-12 h-12 rounded-full bg-black border border-white/10 flex items-center justify-center animate-pulse">
                                        <div className="w-6 h-6 rounded-full bg-white/10"></div>
                                    </div>
                                </div>

                                <div className="hidden md:block md:w-[45%]"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function RoadmapForm({ onSuccess, onStartGeneration }: RoadmapFormProps) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<Partial<RoadmapInput>>({
        skills: [],
        constraints: [],
        location: "Global",
        hours_per_week: 10,
        timeframe_months: 3,
        current_status: "student",
        skill_level: "beginner",
        target_role: "Junior ML Engineer"
    });
    const [loading, setLoading] = useState(false);

    const [error, setError] = useState<string | null>(null);

    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (onStartGeneration) {
            onStartGeneration(formData.target_role || "Career Path");
        }
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/api/roadmap/generate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                const errorMessage = typeof errorData.detail === 'string'
                    ? errorData.detail
                    : JSON.stringify(errorData.detail, null, 2);
                throw new Error(errorMessage || "Failed to generate roadmap");
            }

            const data = await response.json();
            onSuccess(data);
        } catch (error: unknown) {
            console.error("Error generating roadmap:", error);
            setError(error instanceof Error ? error.message : "An unexpected error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const [inputValue, setInputValue] = useState("");

    const handleSkillAdd = (skill: string) => {
        if (!formData.skills?.includes(skill)) {
            handleCheckbox("skills", skill);
        }
        setInputValue("");
    };

    const handleCheckbox = (field: "skills" | "constraints", value: string) => {
        setFormData(prev => {
            const current = (prev[field] as string[]) || [];
            if (current.includes(value)) {
                return { ...prev, [field]: current.filter(v => v !== value) };
            }
            return { ...prev, [field]: [...current, value] };
        });
    };

    if (loading) {
        return <RoadmapSkeleton />;
    }

    return (
        <div className="max-w-4xl mx-auto glass-card p-6 md:p-24 rounded-[40px] md:rounded-[64px] relative">
            <div className="mb-12 md:mb-20">
                <div className="flex justify-between items-center mb-8">
                    <span className="text-[9px] font-bold text-white/40 uppercase tracking-[0.3em]">Module {step} / 04</span>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className={`h-0.5 w-12 transition-all duration-700 ${i <= step ? 'bg-white' : 'bg-white/10'}`}></div>
                        ))}
                    </div>
                </div>

                {error && (
                    <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200 text-xs font-medium flex items-center gap-3">
                        <span className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center font-bold">!</span>
                        {error}
                    </div>
                )}

                <h2 className="text-4xl md:text-6xl font-medium tracking-tight mb-4 text-white">
                    {step === 1 && "Profile"}
                    {step === 2 && "Toolkit"}
                    {step === 3 && "Mission"}
                    {step === 4 && "Hardware"}
                </h2>
                <p className="text-slate-300 font-light">Precision engineering your technical roadmap.</p>
            </div>

            <form className="relative" onSubmit={handleSubmit}>
                {step === 1 && (
                    <div className="space-y-12 animate-fade-in">
                        <FormGroup label="Role Matrix">
                            <select
                                className="w-full bg-white/5 p-6 rounded-3xl border border-white/5 focus:border-white/20 outline-none transition-all appearance-none cursor-pointer text-sm font-medium"
                                value={formData.current_status}
                                onChange={e => setFormData({ ...formData, current_status: e.target.value })}
                            >
                                <option value="student" className="bg-[#0a0a0a] text-white">Academic Track - Current Student</option>
                                <option value="graduate" className="bg-[#0a0a0a] text-white">Specialized Graduate - Recent Graduate</option>
                                <option value="junior dev" className="bg-[#0a0a0a] text-white">Field Engineer - Junior Professional</option>
                            </select>
                        </FormGroup>
                        <FormGroup label="Location">
                            <select
                                className="w-full bg-white/5 p-6 rounded-3xl border border-white/5 focus:border-white/20 outline-none transition-all appearance-none cursor-pointer text-sm font-medium"
                                value={formData.location}
                                onChange={e => setFormData({ ...formData, location: e.target.value })}
                            >
                                <option value="Global" className="bg-[#0a0a0a] text-white">Global</option>
                                <option value="North America" className="bg-[#0a0a0a] text-white">North America</option>
                                <option value="Europe" className="bg-[#0a0a0a] text-white">Europe</option>
                                <option value="Asia" className="bg-[#0a0a0a] text-white">Asia</option>
                                <option value="Africa" className="bg-[#0a0a0a] text-white">Africa</option>
                                <option value="South America" className="bg-[#0a0a0a] text-white">South America</option>
                                <option value="Australia" className="bg-[#0a0a0a] text-white">Australia</option>
                            </select>
                        </FormGroup>
                        <FormGroup label="Primary Domain">
                            <div className="relative space-y-6">
                                <div className="flex items-center justify-between">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 ml-1">
                                        Select Track
                                    </label>
                                </div>

                                <input
                                    type="text"
                                    className="w-full bg-white/5 p-6 rounded-3xl border border-white/5 focus:border-white/20 outline-none text-sm font-medium transition-all"
                                    placeholder="Enter or select technical track..."
                                    value={formData.degree || ""}
                                    onChange={e => setFormData({ ...formData, degree: e.target.value })}
                                />

                                {formData.degree && (
                                    <div className="absolute top-full left-0 w-full mt-2 glass-card rounded-3xl overflow-hidden z-20 border-white/10 shadow-2xl">
                                        {Object.keys(DOMAIN_TOOLKITS)
                                            .filter(d => d.toLowerCase().includes((formData.degree || "").toLowerCase()) && d !== formData.degree)
                                            .slice(0, 8)
                                            .map(suggestion => (
                                                <button
                                                    key={suggestion}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, degree: suggestion })}
                                                    className="w-full text-left px-8 py-4 text-[11px] font-bold uppercase tracking-widest text-slate-300 hover:bg-white/10 hover:text-white transition-colors border-b border-white/5 last:border-0"
                                                >
                                                    {suggestion}
                                                </button>
                                            ))}
                                                                 </div>
                                                             )}
        </div>
                        </FormGroup>

                        <div className="flex justify-center -mt-6 mb-2">
                            <Link
                                href="/domains"
                                className="text-[10px] font-medium text-slate-500 hover:text-primary transition-colors border-b border-transparent hover:border-primary/50 pb-0.5"
                            >
                                Don&apos;t know where to start? <span className="text-slate-300">Explore the Domain Matrix</span>
                            </Link>
                        </div>

                        <StepNav onNext={nextStep} />
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-8 animate-fade-in">
                        <div className="text-center space-y-4">
                            <h2 className="text-3xl font-black tracking-tighter text-white">Stack Construction</h2>
                            <p className="text-sm text-slate-300 font-medium max-w-md mx-auto leading-relaxed">
                                Tell us your core strengths, and we'll recommend the ecosystem around them.
                            </p>
                        </div>

                        <FormGroup label="Core Technologies">
                            <div className="relative">
                                <input
                                    type="text"
                                    className="w-full bg-white/5 p-6 rounded-3xl border border-white/5 focus:border-white/20 outline-none text-sm font-medium transition-all pl-12"
                                    placeholder="Add a technology (e.g. Python, React)..."
                                    value={inputValue}
                                    onChange={e => setInputValue(e.target.value)}
                                    onKeyDown={e => {
                                        if (e.key === 'Enter' && inputValue) {
                                            handleSkillAdd(inputValue);
                                        }
                                    }}
                                />
                                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 text-lg">➜</span>
                            </div>
                        </FormGroup>

                        {/* Selected Skills */}
                        {formData.skills && formData.skills.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {formData.skills.map(skill => (
                                    <button
                                        key={skill}
                                        type="button"
                                        onClick={() => handleCheckbox("skills", skill)}
                                        className="px-4 py-2 rounded-xl bg-white text-black text-[11px] font-bold uppercase tracking-widest hover:bg-white/90 transition-colors flex items-center gap-2"
                                    >
                                        {skill}
                                        <span className="text-black/40">×</span>
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Smart Ecosystem Suggestions */}
                        {(formData.skills || []).some(s => TECH_ECOSYSTEMS[s]) && (
                            <div className="p-6 rounded-3xl bg-white/5 border border-white/5 space-y-4">
                                <div className="flex items-center gap-2 text-primary">
                                    <Sparkles className="w-4 h-4" />
                                    <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Ecosystem Recommendations</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {Array.from(new Set(
                                        (formData.skills || []).flatMap(skill => TECH_ECOSYSTEMS[skill] || [])
                                    )).filter(s => !formData.skills?.includes(s)).slice(0, 10).map(rec => (
                                        <button
                                            key={rec}
                                            type="button"
                                            onClick={() => handleSkillAdd(rec)}
                                            className="px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 text-primary text-[11px] font-bold uppercase tracking-widest hover:bg-primary/20 transition-colors"
                                        >
                                            + {rec}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Domain Base Suggestions */}
                        {formData.degree && (
                            <div className="space-y-4 pt-4 border-t border-white/5">
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 ml-1">
                                    Standard {formData.degree} Toolkit
                                </span>
                                <div className="flex flex-wrap gap-2 opacity-60 hover:opacity-100 transition-opacity">
                                    {DOMAIN_TOOLKITS[formData.degree as keyof typeof DOMAIN_TOOLKITS]?.filter(s => !formData.skills?.includes(s)).map(skill => (
                                        <button
                                            key={skill}
                                            type="button"
                                            onClick={() => handleCheckbox("skills", skill)}
                                            className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:bg-white/10 hover:text-white transition-colors"
                                        >
                                            + {skill}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <StepNav onNext={nextStep} onPrev={prevStep} />
                    </div>
                )}

                {step === 3 && (
                        <div className="space-y-12 animate-fade-in">
                            <FormGroup label="Target Asset">
                                <div className="relative space-y-6">
                                    <input
                                        type="text"
                                        className="w-full bg-white/5 p-6 rounded-3xl border border-white/5 focus:border-white/20 outline-none text-sm font-medium transition-all"
                                        placeholder="Enter desired role (e.g. AI Engineer)..."
                                        value={formData.target_role}
                                        onChange={e => setFormData({ ...formData, target_role: e.target.value })}
                                    />

                                    {formData.target_role && (
                                        <div className="absolute top-full left-0 w-full mt-2 glass-card rounded-3xl overflow-hidden z-20 border-white/10 shadow-2xl max-h-60 overflow-y-auto custom-scrollbar">
                                            {Array.from(new Set([...Object.keys(DOMAIN_TOOLKITS), ...COMMON_ROLES]))
                                                .filter(d => d.toLowerCase().includes((formData.target_role || "").toLowerCase()) && d !== formData.target_role)
                                                .sort()
                                                .slice(0, 50)
                                                .map(suggestion => (
                                                    <button
                                                        key={suggestion}
                                                        type="button"
                                                        onClick={() => setFormData({ ...formData, target_role: suggestion })}
                                                        className="w-full text-left px-8 py-4 text-[11px] font-bold uppercase tracking-widest text-slate-300 hover:bg-white/10 hover:text-white transition-colors border-b border-white/5 last:border-0"
                                                    >
                                                        {suggestion}
                                                    </button>
                                                ))}
                                        </div>
                                    )}
                                </div>
                            </FormGroup>
                            <FormGroup label="Allocation Strategy">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, timeframe_months: 3 })}
                                        className={`p-6 rounded-3xl border text-left transition-all group relative overflow-hidden ${formData.timeframe_months === 3
                                            ? "bg-white text-black border-white shadow-xl shadow-white/5"
                                            : "bg-white/5 border-white/5 text-slate-300 hover:border-white/10 hover:bg-white/10"
                                            }`}
                                    >
                                        <div className="relative z-10 space-y-2">
                                            <div className="text-xs font-bold uppercase tracking-[0.2em] opacity-60">Short Term</div>
                                            <div className="text-xl font-black tracking-tight">Rapid Sprint</div>
                                            <p className={`text-[11px] font-medium leading-relaxed ${formData.timeframe_months === 3 ? "text-black/60" : "text-slate-400 group-hover:text-slate-300"}`}>
                                                Focus on quick wins, interview prep, and core essentials. Ideal for immediate placement (1-4 Months).
                                            </p>
                                        </div>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, timeframe_months: 12 })}
                                        className={`p-6 rounded-3xl border text-left transition-all group relative overflow-hidden ${formData.timeframe_months === 12
                                            ? "bg-white text-black border-white shadow-xl shadow-white/5"
                                            : "bg-white/5 border-white/5 text-slate-300 hover:border-white/10 hover:bg-white/10"
                                            }`}
                                    >
                                        <div className="relative z-10 space-y-2">
                                            <div className="text-xs font-bold uppercase tracking-[0.2em] opacity-60">Long Term</div>
                                            <div className="text-xl font-black tracking-tight">Deep Strategic</div>
                                            <p className={`text-[11px] font-medium leading-relaxed ${formData.timeframe_months === 12 ? "text-black/60" : "text-slate-400 group-hover:text-slate-300"}`}>
                                                Comprehensive mastery, theory, and architectural depth. Built for long-term career dominance (6-12+ Months).
                                            </p>
                                        </div>
                                    </button>
                                </div>
                            </FormGroup>
                            <StepNav onNext={nextStep} onPrev={prevStep} />
                        </div>
                    )}

                {step === 4 && (
                        <div className="space-y-12 animate-fade-in">
                            <FormGroup label="Environmental Constraints">
                                <div className="space-y-4">
                                    {CONSTRAINT_CATEGORIES.map(cat => (
                                        <div key={cat.category} className="space-y-4">
                                            <div className="mb-4">
                                                <h3 className="text-white font-bold text-sm tracking-widest uppercase">{cat.category}</h3>
                                                <p className="text-slate-400 text-[10px] font-medium">{cat.description}</p>
                                            </div>
                                            <div className="grid grid-cols-1 gap-3">
                                                {cat.options.map(c => {
                                                    const isChecked = formData.constraints?.some(s => s.startsWith(c));
                                                    const currentDetail = formData.constraints?.find(s => s.startsWith(c))?.split(": ")[1] || "";

                                                    return (
                                                        <div key={c} className={`p-6 rounded-3xl bg-white/5 border border-white/5 transition-all ${isChecked ? "bg-white/10 border-white/20" : "hover:bg-white/10"}`}>
                                                            <label className="flex items-center gap-4 cursor-pointer">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={isChecked}
                                                                    onChange={() => {
                                                                        if (isChecked) {
                                                                            // Uncheck: remove any string starting with this constraint
                                                                            setFormData(prev => ({
                                                                                ...prev,
                                                                                constraints: prev.constraints?.filter(s => !s.startsWith(c))
                                                                            }));
                                                                        } else {
                                                                            // Check: add just the constraint name
                                                                            setFormData(prev => ({
                                                                                ...prev,
                                                                                constraints: [...(prev.constraints || []), c]
                                                                            }));
                                                                        }
                                                                    }}
                                                                    className="w-4 h-4 accent-white opacity-60"
                                                                />
                                                                <span className="text-slate-200 font-bold text-[11px] uppercase tracking-widest">{c}</span>
                                                            </label>

                                                            {isChecked && (
                                                                <div className="mt-4 pt-4 border-t border-white/5 animate-fade-in">
                                                                    <textarea
                                                                        placeholder="Add specific context (optional)..."
                                                                        className="w-full bg-black/20 p-3 rounded-xl text-[11px] text-white border border-white/5 outline-none focus:border-white/20 min-h-[60px]"
                                                                        value={currentDetail}
                                                                        onChange={(e) => {
                                                                            const newVal = `${c}: ${e.target.value}`;
                                                                            setFormData(prev => ({
                                                                                ...prev,
                                                                                constraints: prev.constraints?.map(s => s.startsWith(c) ? newVal : s)
                                                                            }));
                                                                        }}
                                                                    />
                                                                </div>
                                                             )}
                        </div>
                    )}

        </div>
    </form>

    );
}

function FormGroup({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="space-y-6">
            <label className="block text-[9px] font-bold text-white/40 uppercase tracking-[0.4em]">{label}</label>
            {children}
        </div>
    );
}

function StepNav({ onNext, onPrev }: { onNext: () => void; onPrev?: () => void }) {
    return (
        <div className="flex gap-6 pt-10">
            {onPrev && (
                <button type="button" onClick={onPrev} className="flex-1 glass-pill py-6 rounded-full font-bold text-[11px] uppercase tracking-widest text-slate-300 hover:text-white transition-colors">Back</button>
            )}
            <button type="button" onClick={onNext} className="flex-[2] bg-white/5 text-white py-6 rounded-full font-black text-[11px] uppercase tracking-widest hover:bg-white/10 transition-all active:scale-95 border border-white/10">Next Module</button>
        </div>
    );
}


