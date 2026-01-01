import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Link from "next/link";

import Footer from "@/components/Footer";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Kazira | AI Career Stylist for Kenya",
  description: "Personalized AI career roadmaps for Kenyan developers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={outfit.variable} suppressHydrationWarning>
      <body className="font-sans antialiased bg-black text-white relative overflow-x-hidden">
        {/* Top Floating Pill Nav */}
        <header className="fixed top-8 left-1/2 -translate-x-1/2 w-[90%] max-w-7xl z-50 flex items-center justify-between">
          <Link href="/" className="text-3xl font-black text-white hover:text-primary transition-colors tracking-tighter">
            KAZIRA
          </Link>

          <nav className="glass-pill rounded-full px-8 py-3 flex items-center gap-6 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
            <Link href="/" className="hover:text-white transition-colors">The Agent</Link>
            <Link href="/roadmap" className="hover:text-white transition-colors">Orcestrator</Link>
            <Link href="/jobs" className="hover:text-white transition-colors">Market</Link>
            <div className="w-px h-3 bg-white/10"></div>
            <Link href="/faq" className="hover:text-white transition-colors">How it works</Link>
            <Link href="/about" className="hover:text-white transition-colors">Project</Link>
          </nav>

          <div className="flex items-center gap-4 pr-4">
            <Link href="/roadmap" className="bg-white text-black px-6 py-2.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] hover:bg-slate-200 transition-all active:scale-95">
              Deploy Agent
            </Link>
          </div>
        </header>

        <main className="min-h-[calc(100vh-200px)] pt-24 pb-20">
          {children}
        </main>

        <Footer />

        {/* Global Background Glows */}
        <div className="glow-aura fixed top-[-10%] right-[-10%] opacity-40"></div>
        <div className="glow-aura-secondary fixed bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-accent/5 blur-[150px] -z-10 rounded-full opacity-20"></div>
      </body>
    </html>
  );
}
