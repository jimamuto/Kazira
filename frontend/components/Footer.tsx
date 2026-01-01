import Link from "next/link";
import { Twitter, Github, Linkedin, Mail } from "lucide-react";

export default function Footer() {
    return (
        <footer className="border-t border-white/5 bg-black z-10 relative">
            <div className="max-w-7xl mx-auto px-6 py-20">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
                    {/* Brand Column */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white font-black text-sm shadow-lg shadow-primary/20">K</div>
                            <span className="font-bold tracking-tighter text-xl text-white">Kazira</span>
                        </div>
                        <p className="text-slate-500 text-sm leading-relaxed max-w-xs font-light">
                            The Silicon Savannah's first autonomous career engine. Powered by Gemini, driven by your ambition.
                        </p>
                        <div className="flex gap-4">
                            <SocialIcon icon={<Twitter className="w-4 h-4" />} href="#" />
                            <SocialIcon icon={<Github className="w-4 h-4" />} href="#" />
                            <SocialIcon icon={<Linkedin className="w-4 h-4" />} href="#" />
                        </div>
                    </div>

                    {/* Product Column */}
                    <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 mb-8">Intelligence</h4>
                        <ul className="space-y-4">
                            <FooterLink href="/roadmap" label="Agent Workspace" />
                            <FooterLink href="/jobs" label="Market Pulse" />
                            <FooterLink href="/history" label="Thought Archive" />
                            <FooterLink href="/pricing" label="Reserve Capacity" />
                        </ul>
                    </div>

                    {/* Resources Column */}
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-6">Resources</h4>
                        <ul className="space-y-4">
                            <FooterLink href="/about" label="Manifesto" />
                            <FooterLink href="/blog" label="Success Stories" />
                            <FooterLink href="/community" label="Community Hub" />
                            <FooterLink href="/mentors" label="For Mentors" />
                        </ul>
                    </div>

                    {/* Contact/Legal Column */}
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-6">Legal</h4>
                        <ul className="space-y-4">
                            <FooterLink href="/privacy" label="Privacy Policy" />
                            <FooterLink href="/terms" label="Terms of Service" />
                            <div className="pt-4">
                                <a href="mailto:hello@kazira.com" className="flex items-center gap-2 text-xs font-bold text-white hover:text-accent transition-colors">
                                    <Mail className="w-3 h-3" /> hello@kazira.com
                                </a>
                            </div>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">
                        © 2026 Kazira Inc. | Nairobi, Kenya
                    </p>
                    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/5 border border-emerald-500/10">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-500">All Agents Operational</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function FooterLink({ href, label }: { href: string; label: string }) {
    return (
        <li>
            <Link href={href} className="text-xs text-slate-400 hover:text-white transition-colors">
                {label}
            </Link>
        </li>
    );
}

function SocialIcon({ icon, href }: { icon: React.ReactNode; href: string }) {
    return (
        <a href={href} className="w-8 h-8 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-slate-400 hover:bg-white hover:text-black transition-all">
            {icon}
        </a>
    );
}
