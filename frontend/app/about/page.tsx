import { Search, Brain, Zap, Shield } from "lucide-react";

export default function About() {
    return (
        <div className="min-h-screen pt-32 px-6 max-w-4xl mx-auto pb-32">
            <h1 className="text-6xl font-medium text-white mb-12 tracking-tight">Our <span className="text-white/40">Mission</span></h1>
            <p className="text-slate-400 text-lg font-light mb-20 max-w-2xl leading-relaxed">Kazira was built for the Google Gemini 3 Hackathon to pioneer autonomous career orchestration using advanced multi-agent AI systems powered by Gemini 3.0 Flash Preview.</p>

            <div className="glass-card p-12 rounded-[50px] border-white/5 bg-white/5 mb-32">
                <h2 className="text-3xl text-white mb-8 font-medium">From Static Plans to Autonomous Agents</h2>
                <p className="text-slate-400 leading-relaxed max-w-4xl text-lg font-light mb-8">
                    Traditional career planning is reactive and static. Kazira introduces the "Action Era" of AI - autonomous systems that don't just generate plans, but actively monitor markets, adapt to your progress, and self-correct for 72+ hours of continuous optimization.
                </p>
                <div className="grid md:grid-cols-2 gap-12 mt-16">
                    <div>
                        <h3 className="text-primary font-bold uppercase text-[10px] tracking-widest mb-4">Global Vision</h3>
                        <p className="text-white font-light">To democratize elite career coaching worldwide by providing every developer with a personal fleet of autonomous AI agents that work 24/7.</p>
                    </div>
                    <div>
                        <h3 className="text-primary font-bold uppercase text-[10px] tracking-widest mb-4">Core Technology</h3>
                        <p className="text-white font-light">Powered by Gemini 3.0 Flash Preview with 1M token context windows, built with Next.js 16, React 19, and FastAPI for enterprise-grade performance.</p>
                    </div>
                </div>
            </div>

            <div className="space-y-16 mb-32">
                <div className="p-10 rounded-[40px] bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-6">The Autonomous Revolution</h3>
                    <p className="text-white font-light leading-relaxed">
                        Kazira represents the evolution from "AI assistants" to "AI orchestrators". Instead of waiting for user commands, our four specialized agents proactively research markets, synthesize curricula, schedule learning, and verify progress - all while maintaining perfect continuity through Thought Signatures.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="p-8 rounded-[30px] bg-white/5 border border-white/5">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-900 to-black flex items-center justify-center mb-6 border border-white/10">
                            <Search className="w-6 h-6 text-white" />
                        </div>
                        <h4 className="text-white font-medium mb-4">Research Agent</h4>
                        <p className="text-slate-400 text-sm leading-relaxed">Scans 100+ global job boards in real-time, extracting market intelligence and salary data across all major regions.</p>
                    </div>

                    <div className="p-8 rounded-[30px] bg-white/5 border border-white/5">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-900 to-black flex items-center justify-center mb-6 border border-white/10">
                            <Brain className="w-6 h-6 text-white" />
                        </div>
                        <h4 className="text-white font-medium mb-4">Planning Agent</h4>
                        <p className="text-slate-400 text-sm leading-relaxed">Synthesizes personalized 6-month curricula using massive context windows to understand complex skill dependencies.</p>
                    </div>

                    <div className="p-8 rounded-[30px] bg-white/5 border border-white/5">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-900 to-black flex items-center justify-center mb-6 border border-white/10">
                            <Zap className="w-6 h-6 text-white" />
                        </div>
                        <h4 className="text-white font-medium mb-4">Execution Agent</h4>
                        <p className="text-slate-400 text-sm leading-relaxed">Finds and schedules verified learning resources, creating detailed daily task schedules with progress tracking.</p>
                    </div>

                    <div className="p-8 rounded-[30px] bg-white/5 border border-white/5 md:col-span-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-900 to-black flex items-center justify-center mb-6 border border-white/10">
                            <Shield className="w-6 h-6 text-white" />
                        </div>
                        <h4 className="text-white font-medium mb-4">Verification Agent</h4>
                        <p className="text-slate-400 text-sm leading-relaxed">Generates automated quizzes and code tests, triggers self-correction loops when progress stalls, and maintains Thought Signatures for perfect continuity.</p>
                    </div>
                </div>
            </div>

            <div className="border-t border-white/5 pt-12">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20 mb-8">Technical Architecture</h3>
                <div className="flex flex-wrap gap-4">
                    <span className="px-5 py-2.5 rounded-full bg-white/5 border border-white/5 text-[10px] font-bold text-white uppercase tracking-widest">Next.js 16</span>
                    <span className="px-5 py-2.5 rounded-full bg-white/5 border border-white/5 text-[10px] font-bold text-white uppercase tracking-widest">React 19</span>
                    <span className="px-5 py-2.5 rounded-full bg-white/5 border border-white/5 text-[10px] font-bold text-white uppercase tracking-widest">Gemini 3.0 Flash</span>
                    <span className="px-5 py-2.5 rounded-full bg-white/5 border border-white/5 text-[10px] font-bold text-white uppercase tracking-widest">FastAPI</span>
                    <span className="px-5 py-2.5 rounded-full bg-white/5 border border-white/5 text-[10px] font-bold text-white uppercase tracking-widest">Autonomous Pipeline</span>
                    <span className="px-5 py-2.5 rounded-full bg-white/5 border border-white/5 text-[10px] font-bold text-white uppercase tracking-widest">Thought Signatures</span>
                    <span className="px-5 py-2.5 rounded-full bg-white/5 border border-white/5 text-[10px] font-bold text-white uppercase tracking-widest">Global Job Scraping</span>
                    <span className="px-5 py-2.5 rounded-full bg-white/5 border border-white/5 text-[10px] font-bold text-white uppercase tracking-widest">Self-Correction Loops</span>
                </div>
            </div>

            <div className="border-t border-white/5 pt-12 mt-16">
                <div className="text-center">
                    <h3 className="text-2xl font-medium text-white mb-4">Ready to Experience Autonomous Career Planning?</h3>
                    <p className="text-slate-400 mb-8">Join the revolution where AI agents work tirelessly to advance your career.</p>
                    <a href="/roadmap" className="inline-flex items-center gap-2 bg-primary text-black px-8 py-4 rounded-full font-bold text-sm uppercase tracking-widest hover:scale-105 transition-all">
                        Launch Your Agent Fleet
                        <span className="text-lg">→</span>
                    </a>
                </div>
            </div>
        </div>
    );
}
