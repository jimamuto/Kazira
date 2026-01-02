"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import { AnimatePresence } from "framer-motion";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Sidebar should be consistent on all pages EXCEPT Landing, How it Works, Project... AND Roadmap (which has its own sidebar)
  // Added /jobs (Market) to marketing pages as requested
  const isMarketingPage = ["/", "/faq", "/about", "/jobs"].includes(pathname);
  const isRoadmapPage = pathname.startsWith("/roadmap"); // New check
  const isLearningPage = pathname.startsWith("/learning");

  // Show global sidebar only if NOT marketing AND NOT roadmap AND NOT learning
  const showSidebar = !isMarketingPage && !isRoadmapPage && !isLearningPage;

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <>
      {/* Show Top Navigation ONLY on Marketing Pages */}
      {isMarketingPage && (
        <header className="fixed top-8 left-1/2 -translate-x-1/2 w-[90%] max-w-7xl z-50 flex items-center justify-between">
          <Link href="/" className="text-3xl font-black text-white hover:text-primary transition-colors tracking-tighter">
            KAZIRA
          </Link>

          <nav className="glass-pill rounded-full px-8 py-3 flex items-center gap-6 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
            <Link href="/" className="hover:text-white transition-colors">The Agent</Link>
            <Link href="/roadmap" className="hover:text-white transition-colors">Orchestrator</Link>
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
      )}

      {/* Show Sidebar on App Pages (excluding Roadmap) */}
      <AnimatePresence mode="wait">
        {showSidebar && (
          <Sidebar
            key="sidebar"
            isCollapsed={isSidebarCollapsed}
            setIsCollapsed={setIsSidebarCollapsed}
          />
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main
        className={`min-h-[calc(100vh-200px)] pb-20 transition-all duration-500 ease-in-out ${showSidebar
          ? (isSidebarCollapsed ? "pl-[100px] pt-8 pr-8" : "pl-[290px] pt-8 pr-8") // Push content when expanded
          : "pt-24 pl-0"
          }`}
        // Correction: If on roadmap or learning page, ClientLayout should essentially be transparent/reset
        style={(isRoadmapPage || isLearningPage) ? { paddingTop: 0, paddingLeft: 0, paddingRight: 0, paddingBottom: 0 } : {}}
      >
        {children}
      </main>

      {!showSidebar && !isRoadmapPage && !isLearningPage && <Footer />}
    </>
  );
}
