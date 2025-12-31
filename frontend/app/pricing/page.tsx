import { Check } from "lucide-react";

export default function Pricing() {
    return (
        <div className="min-h-screen pt-32 px-6 max-w-6xl mx-auto">
            <div className="text-center mb-20">
                <h1 className="text-5xl font-bold text-white mb-6 tracking-tight">Simple, Transparent <span className="text-white/40">Pricing</span></h1>
                <p className="text-slate-400 max-w-xl mx-auto">Invest in your career with tools that pay for themselves in your first month of employment.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
                {/* Free Tier */}
                <div className="h-full p-8 rounded-[40px] bg-white/5 border border-white/10 hover:bg-white/[0.07] transition-all flex flex-col">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">Starter</h3>
                    <div className="text-5xl font-bold text-white mb-8">Free</div>
                    <ul className="space-y-4 mb-8 flex-1">
                        <li className="flex items-center gap-3 text-slate-300 text-sm">
                            <Check className="w-4 h-4 text-white" /> Basic Roadmap Generation
                        </li>
                        <li className="flex items-center gap-3 text-slate-300 text-sm">
                            <Check className="w-4 h-4 text-white" /> Access to Job Board
                        </li>
                        <li className="flex items-center gap-3 text-slate-300 text-sm">
                            <Check className="w-4 h-4 text-white" /> Public Domain Directory
                        </li>
                    </ul>
                    <button className="w-full py-4 rounded-full border border-white/20 text-white font-bold text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all">Get Started</button>
                </div>

                {/* Pro Tier (Featured) */}
                <div className="h-full p-8 rounded-[40px] bg-white text-black border-2 border-white shadow-2xl shadow-white/10 relative flex flex-col">
                    <div className="absolute top-0 right-0 bg-accent text-black text-[10px] font-bold px-4 py-1 rounded-bl-xl rounded-tr-[35px] uppercase tracking-widest">Recommended</div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4">Pro Student</h3>
                    <div className="text-5xl font-bold text-black mb-2">KES 500</div>
                    <div className="text-xs font-bold text-slate-400 mb-8 uppercase tracking-widest">/ month</div>
                    <ul className="space-y-4 mb-8 flex-1">
                        <li className="flex items-center gap-3 text-slate-800 text-sm font-medium">
                            <Check className="w-4 h-4 text-accent" /> Unlimited AI Re-generations
                        </li>
                        <li className="flex items-center gap-3 text-slate-800 text-sm font-medium">
                            <Check className="w-4 h-4 text-accent" /> Save & Track Progress
                        </li>
                        <li className="flex items-center gap-3 text-slate-800 text-sm font-medium">
                            <Check className="w-4 h-4 text-accent" /> Deep-Dive Mentor Chat
                        </li>
                        <li className="flex items-center gap-3 text-slate-800 text-sm font-medium">
                            <Check className="w-4 h-4 text-accent" /> Verified Certificate
                        </li>
                    </ul>
                    <button className="w-full py-4 rounded-full bg-black text-white font-bold text-xs uppercase tracking-widest hover:opacity-80 transition-all shadow-xl">Go Pro</button>
                </div>

                {/* Enterprise Tier */}
                <div className="h-full p-8 rounded-[40px] bg-white/5 border border-white/10 hover:bg-white/[0.07] transition-all flex flex-col">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">Bootcamp</h3>
                    <div className="text-5xl font-bold text-white mb-2">Custom</div>
                    <div className="text-xs font-bold text-slate-500 mb-8 uppercase tracking-widest">/ cohort</div>
                    <ul className="space-y-4 mb-12 flex-1">
                        <li className="flex items-center gap-3 text-slate-300 text-sm">
                            <Check className="w-4 h-4 text-white" /> Cohort Management
                        </li>
                        <li className="flex items-center gap-3 text-slate-300 text-sm">
                            <Check className="w-4 h-4 text-white" /> White-label API Access
                        </li>
                        <li className="flex items-center gap-3 text-slate-300 text-sm">
                            <Check className="w-4 h-4 text-white" /> Custom Curriculum Injection
                        </li>
                    </ul>
                    <button className="w-full py-4 rounded-full border border-white/20 text-white font-bold text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all">Contact Sales</button>
                </div>
            </div>
        </div>
    )
}
