"use client";

import Link from "next/link";
import AnimatedBackground from "@/components/AnimatedBackground";
import { Globe, TestTube, RefreshCw, FileText } from "lucide-react";

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      <AnimatedBackground />
      {/* Background Glow specifically for Hero */}
      <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[90vw] h-[600px] bg-accent/5 blur-[150px] -z-10 rounded-full"></div>

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-48 text-center max-w-6xl mx-auto px-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-primary uppercase tracking-[0.3em] mb-12 animate-fade-in">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          Autonomous Agent System Live
        </div>

        <h1 className="hero-heading mb-12">
          The World's First <br className="hidden md:block" />
          <span className="text-white/60">Marathon Agent System.</span>
        </h1>

        <p className="text-muted max-w-2xl mx-auto mb-20 leading-relaxed font-light text-slate-300 text-lg">
          Kazira is an autonomous career planning marathon agent powered by Google's Gemini 3 Flash Preview.
          It runs continuously for 72+ hours without human supervision, performing real-time job market research,
          strategic roadmap planning, resource discovery, and autonomous code verification.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link href="/roadmap" className="btn-primary flex items-center gap-2 group px-10 py-5">
            Start Marathon Agent
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
          <Link href="#how-it-works" className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-colors py-4 px-6">
            View Architecture
          </Link>
        </div>
      </section>

      {/* Partner Marquee */}
      <section className="mb-0 pt-20 relative w-full overflow-hidden mask-fade-edges group">
        <div className="flex w-max items-center animate-scroll-infinite hover:[animation-play-state:paused]">
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

      {/* Product Demo / Agent Orchestration Visual */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-6 mb-48 pt-32">
        <div className="text-center mb-24">
          <h2 className="text-5xl font-medium tracking-tight mb-6">72-Hour Marathon Agent.</h2>
          <p className="text-muted max-w-2xl mx-auto text-lg font-light leading-relaxed">
            Our multi-agent system powered by Gemini 3 Flash Preview runs continuously for 72+ hours,
            executing in 30-minute cycles with autonomous agent negotiation and self-correction.
          </p>
        </div>
      </section>

      {/* Feature Grids - The Multi-Agent Difference */}
      <section className="max-w-4xl mx-auto px-6 mb-48 relative z-10">
        <div className="grid md:grid-cols-2 gap-y-20 gap-x-24">
          {[
            {
              title: "Marathon Agent",
              desc: "72-hour continuous operation with 30-minute autonomous cycles. No human supervision required.",
              icon: Globe
            },
            {
              title: "Vibe Engineering",
              desc: "Execution Agent tests resources in a Python sandbox, only recommending content that passes 80%+ quality verification.",
              icon: TestTube
            },
            {
              title: "Agent Negotiation",
              desc: "Agents communicate via message bus with URGENT/CRITICAL priorities, enabling emergent behaviors like market-shift detection.",
              icon: RefreshCw
            },
            {
              title: "PostgreSQL Persistence",
              desc: "Complete audit trail with thought signatures. Resume capability - agents continue from last saved checkpoint.",
              icon: FileText
            },
          ].map((f, i) => {
            const IconComponent = f.icon;
            return (
              <div key={i} className="group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-900 to-black flex items-center justify-center border border-white/10">
                    <IconComponent className="w-4 h-4 text-white group-hover:scale-125 transition-transform duration-300" />
                  </div>
                  <h3 className="text-lg font-bold text-white tracking-tight">{f.title}</h3>
                </div>
                <p className="text-slate-400 text-[15px] font-light leading-relaxed max-w-sm">
                  {f.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="max-w-4xl mx-auto px-6 mb-32 pt-20 text-center relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-accent/5 blur-[120px] rounded-full -z-10"></div>

        <h2 className="text-4xl md:text-6xl font-medium tracking-tighter mb-8 text-white">
          Launch Your Marathon. <br /> Dominate the Market.
        </h2>

        <p className="text-muted text-lg mb-12 max-w-xl mx-auto font-light">
          Choose between quick single-pipeline generation or comprehensive marathon mode.
          Let autonomous agents work 72+ hours to perfect your career strategy.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link href="/roadmap" className="btn-primary flex items-center gap-2 group px-12 py-5 text-base shadow-2xl shadow-primary/20">
            Start Marathon Agent
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </section>
    </div>
  );
}

