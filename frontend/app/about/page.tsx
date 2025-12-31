export default function About() {
    return (
        <div className="min-h-screen pt-32 px-6 max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold text-white mb-8 tracking-tight">About <span className="text-white/40">Kazira</span></h1>

            <div className="prose prose-invert max-w-none">
                <p className="text-2xl text-slate-300 font-light leading-relaxed mb-12">
                    Kazira is built for the <span className="text-accent font-normal">Silicon Savannah</span>. We Bridge the gap between generic global advice and the specific reality of the Kenyan tech market.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
                    <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-4">The Mission</h3>
                        <p className="text-slate-400 font-light">
                            To reduce the "Tutorial Hell" phase for junior developers by providing precision-engineered, market-aware learning paths.
                        </p>
                    </div>
                    <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-4">The Vision</h3>
                        <p className="text-slate-400 font-light">
                            A future where every Kenyan developer has a personalized, data-driven career strategist in their pocket.
                        </p>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-12">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-8">Built With</h3>
                    <div className="flex gap-4">
                        <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-white">Next.js 14</span>
                        <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-white">Gemini Pro 1.5</span>
                        <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-white">Tailwind CSS</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
