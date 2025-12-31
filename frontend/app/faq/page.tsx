export default function FAQ() {
    return (
        <div className="min-h-screen pt-32 px-6 max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold text-white mb-12 tracking-tight">Frequently Asked <span className="text-white/40">Questions</span></h1>

            <div className="space-y-8">
                <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-accent/50 transition-colors group">
                    <h3 className="text-xl font-bold text-white mb-4 group-hover:text-accent transition-colors">is this really free?</h3>
                    <p className="text-slate-400 font-light leading-relaxed">
                        Yes. The core roadmap generator is completely free for Kenyan students and developers. We believe in democratizing access to high-quality career guidance.
                    </p>
                </div>

                <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-accent/50 transition-colors group">
                    <h3 className="text-xl font-bold text-white mb-4 group-hover:text-accent transition-colors">how accurate is the ai?</h3>
                    <p className="text-slate-400 font-light leading-relaxed">
                        Our AI is tuned with specific context on the East African tech ecosystem. While it provides a highly tailored starting point, we always recommend verifying with real-world job listings—which is why we built the Jobs board right into the platform.
                    </p>
                </div>

                <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-accent/50 transition-colors group">
                    <h3 className="text-xl font-bold text-white mb-4 group-hover:text-accent transition-colors">can i save my roadmap?</h3>
                    <p className="text-slate-400 font-light leading-relaxed">
                        Currently, roadmaps are ephemeral session-based. We are rolling out user accounts and persistent storage in our upcoming "Pro" tier effectively immediately.
                    </p>
                </div>
            </div>
        </div>
    )
}
