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
  title: "Kazira | AI Career Path KE",
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
          <div className="flex items-center gap-2 pl-4">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-black font-black text-xs">C</div>
            <span className="font-bold tracking-tighter text-lg hidden sm:block">Kazira</span>
          </div>

          <nav className="glass-pill rounded-full px-8 py-3 flex items-center gap-8 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <Link href="/roadmap" className="hover:text-white transition-colors">Build</Link>
            <Link href="/jobs" className="hover:text-white transition-colors">Jobs</Link>
            <Link href="/history" className="hover:text-white transition-colors">History</Link>
            <div className="w-px h-3 bg-white/10 mx-2"></div>
            <Link href="/faq" className="hover:text-white transition-colors">FAQ</Link>
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <Link href="/pricing" className="hover:text-white transition-colors text-accent">Pricing</Link>
          </nav>

          <div className="flex items-center gap-4 pr-4">
            <Link href="/roadmap" className="text-[10px] font-bold text-white hover:opacity-80 transition-opacity uppercase tracking-[0.2em]">Generate</Link>
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
