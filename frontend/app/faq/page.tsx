export default function FAQ() {
    const FAQS = [
        {
            q: "What makes Kazira different from other career planning tools?",
            a: "Kazira is an autonomous multi-agent system, not just a static roadmap generator. It deploys 4 specialized AI agents (Research, Planning, Execution, Verification) that work continuously for up to 72 hours, self-correcting and adapting to market changes without human intervention."
        },
        {
            q: "How does the autonomous 'Marathon Mode' work?",
            a: "In Marathon Mode, Kazira runs continuously for 72 hours, periodically checking market conditions, verifying your progress through automated quizzes, and adjusting your roadmap based on performance. It uses 'Thought Signatures' to maintain state and resume work seamlessly."
        },
        {
            q: "What data sources does Kazira use?",
            a: "Our Research Agent scrapes live job data from LinkedIn, Indeed, and global job boards. We don't use stale datasets - every roadmap is built from current market intelligence across your selected location."
        },
        {
            q: "How does Kazira ensure location-specific relevance?",
            a: "You can select from Global, North America, Europe, Asia, Africa, South America, or Australia. The Planning Agent tailors recommendations based on local tech ecosystems, industry trends, and regional opportunities."
        },
        {
            q: "What is a 'Thought Signature'?",
            a: "A Thought Signature is a verifiable log of an agent's internal reasoning process. It shows exactly why an agent made a decision and serves as a checkpoint for autonomous operations, allowing the system to resume work after interruptions."
        },
        {
            q: "How does the self-correction system work?",
            a: "The Verification Agent generates automated quizzes and code tests. If you struggle with a skill, it triggers a self-correction loop that adjusts roadmap intensity, adds resources, or modifies the learning path without manual intervention."
        },
        {
            q: "Can I upload my CV for better personalization?",
            a: "Yes! Our CV parsing feature uses Gemini AI to extract skills from PDF resumes and automatically populate your skills profile, saving you time and ensuring accuracy."
        },
        {
            q: "What happens if the AI quota is exceeded?",
            a: "Kazira handles API rate limits gracefully. When Gemini's free tier limit is reached (20 requests/day), the system shows a clear explanation and countdown until retry is available, demonstrating production-ready error handling."
        },
        {
            q: "How long does it take to generate a roadmap?",
            a: "Single mode generates a roadmap in under 2 minutes. Marathon mode runs continuously for 72 hours, with periodic updates and self-corrections based on your progress."
        },
        {
            q: "Is Kazira available worldwide?",
            a: "Yes! Kazira supports global users with location-specific recommendations. While currently demonstrated in English, the architecture supports internationalization."
        }
    ];

    return (
        <div className="min-h-screen pt-32 px-6 max-w-4xl mx-auto pb-48">
            <h1 className="text-6xl font-medium text-white mb-12 tracking-tight">Frequently Asked <span className="text-white/40">Questions</span></h1>
            <p className="text-slate-400 text-lg font-light mb-20 max-w-2xl leading-relaxed">Everything you need to know about the Kazira autonomous career orchestration engine and how it revolutionizes career planning.</p>

            <div className="space-y-20">
                <section>
                    <h2 className="text-[10px] font-bold text-primary mb-8 uppercase tracking-[0.4em]">System Overview</h2>
                    <div className="space-y-12">
                        <div className="group">
                            <h3 className="text-3xl font-medium text-white mb-6 group-hover:text-primary transition-colors">What is Kazira?</h3>
                            <p className="text-slate-400 leading-relaxed max-w-3xl">Kazira is a multi-agent autonomous framework designed to automate the career transition lifecycle. Unlike traditional "roadmapping" tools, Kazira deploys specialized AI agents to crawl markets, audit your technical delta, and orchestrate a 6-month execution strategy with continuous self-correction capabilities.</p>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-[10px] font-bold text-primary mb-8 uppercase tracking-[0.4em]">Frequently Asked Questions</h2>
                    <div className="space-y-8">
                        {FAQS.map((faq, index) => (
                            <div key={index} className="group border-b border-white/5 pb-8 last:border-b-0">
                                <h3 className="text-xl font-medium text-white mb-4 group-hover:text-primary transition-colors">
                                    {faq.q}
                                </h3>
                                <p className="text-slate-400 leading-relaxed max-w-3xl">
                                    {faq.a}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                <section>
                    <h2 className="text-[10px] font-bold text-primary mb-8 uppercase tracking-[0.4em]">Technical Architecture</h2>
                    <div className="space-y-12">
                        <div className="group">
                            <h3 className="text-3xl font-medium text-white mb-6 group-hover:text-primary transition-colors">How does the agent orchestration work?</h3>
                            <p className="text-slate-400 leading-relaxed max-w-3xl">
                                Kazira uses four specialized agents working in sequence: <strong>Research Agent</strong> (market intelligence), <strong>Planning Agent</strong> (curriculum synthesis), <strong>Execution Agent</strong> (resource scheduling), and <strong>Verification Agent</strong> (progress assessment and self-correction). They communicate via a message bus and maintain state through Thought Signatures.
                            </p>
                        </div>
                        <div className="group">
                            <h3 className="text-3xl font-medium text-white mb-6 group-hover:text-primary transition-colors">What technologies power Kazira?</h3>
                            <p className="text-slate-400 leading-relaxed max-w-3xl">
                                Built with Next.js, FastAPI, and SQLModel for the full-stack architecture. Gemini 3.0 Flash Preview provides the AI orchestration with 1M token context windows. Selenium and BeautifulSoup handle real-time job scraping from LinkedIn, Indeed, and global job boards.
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
