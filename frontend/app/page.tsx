"use client";

import Link from "next/link";

import AnimatedBackground from "@/components/AnimatedBackground";

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      <AnimatedBackground />
      {/* Background Glow specifically for Hero */}
      <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[90vw] h-[600px] bg-accent/5 blur-[150px] -z-10 rounded-full"></div>

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-48 text-center max-w-6xl mx-auto px-4">


        <h1 className="hero-heading mb-12">
          The AI Career Strategist <br className="hidden md:block" />
          <span className="text-white/60">for Kenya's Future.</span>
        </h1>

        <p className="text-muted max-w-xl mx-auto mb-20 leading-relaxed font-light text-slate-300">
          Stop guessing. We analyze local market data to build personalized, step-by-step roadmaps for developers who want to master high-value skills and secure global roles.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link href="/roadmap" className="btn-primary flex items-center gap-2 group">
            Get Your Roadmap
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
          <Link href="/pricing" className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-colors py-4 px-6">
            View Pricing
          </Link>
        </div>
      </section>

      {/* Partner / Logos Section (Minimalist row) */}
      {/* Partner Marquee (Kenyan Tech Ecosystem) */}
      <section className="mb-0 pt-20 relative w-full overflow-hidden mask-fade-edges group">
        <div className="flex w-max items-center animate-scroll-infinite hover:[animation-play-state:paused]">
          {/* First Set */}
          <div className="flex items-center gap-20 px-10 opacity-30 grayscale transition-all duration-500 hover:opacity-100 hover:grayscale-0">
            <span className="text-xs font-black tracking-widest uppercase mix-blend-difference">SAFARICOM</span>
            <span className="text-xs font-black tracking-widest uppercase mix-blend-difference">MICROSOFT ATC</span>
            <span className="text-xs font-black tracking-widest uppercase mix-blend-difference">GOOGLE AFRICA</span>
            <span className="text-xs font-black tracking-widest uppercase mix-blend-difference">MORINGA</span>
            <span className="text-xs font-black tracking-widest uppercase mix-blend-difference">CELLULANT</span>
            <span className="text-xs font-black tracking-widest uppercase mix-blend-difference">ANDELA</span>
            <span className="text-xs font-black tracking-widest uppercase mix-blend-difference">PESAPAL</span>
            <span className="text-xs font-black tracking-widest uppercase mix-blend-difference">GRO INTELLIGENCE</span>
          </div>
          {/* Duplicate Set for Infinite Loop */}
          <div className="flex items-center gap-20 px-10 opacity-30 grayscale transition-all duration-500 hover:opacity-100 hover:grayscale-0">
            <span className="text-xs font-black tracking-widest uppercase mix-blend-difference">SAFARICOM</span>
            <span className="text-xs font-black tracking-widest uppercase mix-blend-difference">MICROSOFT ATC</span>
            <span className="text-xs font-black tracking-widest uppercase mix-blend-difference">GOOGLE AFRICA</span>
            <span className="text-xs font-black tracking-widest uppercase mix-blend-difference">MORINGA</span>
            <span className="text-xs font-black tracking-widest uppercase mix-blend-difference">CELLULANT</span>
            <span className="text-xs font-black tracking-widest uppercase mix-blend-difference">ANDELA</span>
            <span className="text-xs font-black tracking-widest uppercase mix-blend-difference">PESAPAL</span>
            <span className="text-xs font-black tracking-widest uppercase mix-blend-difference">GRO INTELLIGENCE</span>
          </div>
        </div>
      </section>

      {/* Product Demo / Visual Mock */}
      <section className="max-w-7xl mx-auto px-6 mb-48">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-medium tracking-tight mb-6">Built for Clarity.</h2>
          <p className="text-muted max-w-2xl mx-auto">No more tutorial hell. Get a rigid, month-by-month execution plan tailored to the Kenyan market demand.</p>
        </div>

        <div className="relative max-w-4xl mx-auto group perspective-1000">
          {/* Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-accent/10 blur-[100px] rounded-full -z-10 group-hover:bg-accent/15 transition-all duration-700"></div>

          {/* The Mock Interface Card */}
          <div className="glass-card rounded-[32px] border border-white/10 overflow-hidden transform transition-all duration-700 group-hover:rotate-x-2 group-hover:scale-[1.01] shadow-2xl">
            {/* Mock Browser/App Header */}
            <div className="h-12 border-b border-white/10 bg-black/40 flex items-center px-6 gap-4">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
              </div>
              <div className="px-4 py-1 rounded-full bg-white/5 text-[10px] text-slate-400 font-mono tracking-wide flex-1 text-center border border-white/5">
                kazira.com/roadmap/generated/ke-001
              </div>
            </div>

            {/* Mock Content */}
            <div className="p-12 md:p-16 bg-black/40 relative">
              {/* Header Part */}
              <div className="flex items-start justify-between mb-12 border-b border-white/5 pb-8">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-[10px] font-bold uppercase tracking-widest mb-4">
                    Generated Strategy
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-2">AI Engineer (Nairobi)</h3>
                  <p className="text-slate-400 text-sm">Targeting Remote & Local Enterprise Roles</p>
                </div>
                <div className="text-right hidden sm:block">
                  <div className="text-4xl font-bold text-white mb-1">6<span className="text-lg text-slate-500 ml-1">mo</span></div>
                  <p className="text-slate-500 text-[10px] uppercase tracking-widest">Est. Timeline</p>
                </div>
              </div>

              {/* Timeline Part */}
              <div className="space-y-6 relative">
                {/* Connecting Line */}
                <div className="absolute left-6 top-4 bottom-4 w-px bg-gradient-to-b from-accent to-transparent"></div>

                {/* Month 1 */}
                <div className="relative pl-16">
                  <div className="absolute left-4 top-2 w-4 h-4 rounded-full bg-accent border-[3px] border-black shadow-[0_0_15px_rgba(13,148,136,0.6)] z-10"></div>
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-accent/40 transition-colors">
                    <span className="text-[10px] font-bold text-accent uppercase tracking-widest block mb-1">Month 01 — Foundation</span>
                    <h4 className="text-lg font-bold text-white mb-3">Python & Data Structures</h4>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-3 text-slate-400 text-xs">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-600"></div> Algorithm Efficiency (Big O)
                      </li>
                      <li className="flex items-center gap-3 text-slate-400 text-xs">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-600"></div> NumPy & Pandas Proficiency
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Month 2 */}
                <div className="relative pl-16 opacity-80">
                  <div className="absolute left-4 top-2 w-4 h-4 rounded-full bg-black border border-white/30 z-10"></div>
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Month 02 — Core Skills</span>
                    <h4 className="text-lg font-bold text-slate-300 mb-2">Machine Learning Basics</h4>
                    <div className="flex gap-2 mt-3">
                      <span className="px-3 py-1 rounded-md bg-white/5 text-[10px] text-slate-400 border border-white/5">Scikit-Learn</span>
                      <span className="px-3 py-1 rounded-md bg-white/5 text-[10px] text-slate-400 border border-white/5">Regression</span>
                    </div>
                  </div>
                </div>

                {/* Month 3 (Blurry future) */}
                <div className="relative pl-16 opacity-50">
                  <div className="absolute left-4 top-2 w-4 h-4 rounded-full bg-black border border-white/10 z-10"></div>
                  <div className="p-6 rounded-2xl border border-white/5 border-dashed">
                    <h4 className="text-lg font-bold text-slate-500">Deep Learning & Deployment</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action - Focused & clean */}
      <section className="max-w-4xl mx-auto px-6 mb-32 pt-20 text-center relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-accent/5 blur-[120px] rounded-full -z-10"></div>

        <h2 className="text-4xl md:text-6xl font-medium tracking-tighter mb-8 text-white">
          Your Global Career <br /> Starts Here.
        </h2>

        <p className="text-muted text-lg mb-12 max-w-xl mx-auto">
          Join thousands of Kenyan developers who have stopped guessing and started building.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link href="/roadmap" className="btn-primary flex items-center gap-2 group px-12 py-5 text-base">
            Start Building Now
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
