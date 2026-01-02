"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
    Home, Layers, Zap, Trophy, Globe, TrendingUp, ChevronRight, Box, Sparkles,
    ShoppingBag, HelpCircle, Info, Settings, BookOpen, Key, Shield, FileText,
    MoreHorizontal
} from "lucide-react";

interface SidebarProps {
    isCollapsed: boolean;
    setIsCollapsed: (collapsed: boolean) => void;
}

export default function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
    const pathname = usePathname();
    const [isOrchestratorOpen, setIsOrchestratorOpen] = useState(true);

    const isActive = (path: string) => pathname === path || pathname.startsWith(path + "/");
    const isOrchestratorActive = isActive('/roadmap');

    // X-style: Simple list. Animation controls width.
    const sidebarVariants = {
        expanded: { width: "260px", x: 0, opacity: 1 },
        collapsed: { width: "88px", x: 0, opacity: 1 }
    };

    return (
        <motion.aside
            initial={{ x: -100, opacity: 0 }}
            animate={isCollapsed ? "collapsed" : "expanded"}
            exit={{ x: -100, opacity: 0, transition: { duration: 0.3 } }}
            variants={sidebarVariants}
            className="fixed top-0 left-0 h-screen z-50 p-4 flex flex-col pointer-events-none"
        >
            {/* Main Container - Glass Pill/Rail */}
            <motion.div
                layout
                className={`
                    glass-card h-full my-auto self-center
                    flex flex-col border border-white/10 bg-[#0a0a0a]/90 backdrop-blur-3xl shadow-2xl
                    pointer-events-auto relative overflow-hidden transition-all duration-300
                    ${isCollapsed ? 'items-center rounded-[40px]' : 'rounded-[32px] px-4'}
                `}
            >
                {/* Brand */}
                <div className={`flex items-center gap-3 py-8 ${isCollapsed ? 'justify-center' : 'px-4'}`}>
                    <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-7 h-7 text-white" />
                    </div>
                </div>

                {/* Navigation Items */}
                <nav className="flex-1 flex flex-col gap-2 overflow-y-auto no-scrollbar w-full">

                    <NavItem href="/" icon={Home} label="Home" isCollapsed={isCollapsed} isActive={isActive('/') && pathname === '/'} />
                    <NavItem href="/jobs" icon={ShoppingBag} label="Market" isCollapsed={isCollapsed} isActive={isActive('/jobs')} />

                    {/* Orchestrator - Inline Expansion */}
                    <div className="flex flex-col gap-1">
                        <button
                            onClick={() => {
                                if (isCollapsed) setIsCollapsed(false);
                                else setIsOrchestratorOpen(!isOrchestratorOpen);
                            }}
                            className={`
                                flex items-center gap-4 w-full rounded-3xl transition-all duration-200 group relative
                                ${isCollapsed ? 'justify-center w-12 h-12 self-center' : 'px-4 py-3'}
                                ${isOrchestratorActive ? 'font-bold' : 'text-slate-400 hover:text-white hover:bg-white/10'}
                            `}
                        >
                            <Box className={`w-6 h-6 flex-shrink-0 ${isOrchestratorActive ? 'text-white' : ''}`} />
                            {!isCollapsed && (
                                <div className="flex-1 flex items-center justify-between overflow-hidden">
                                    <span className="text-lg tracking-tight">Orchestrator</span>
                                    <ChevronRight className={`w-4 h-4 text-slate-500 transition-transform ${isOrchestratorOpen ? 'rotate-90' : ''}`} />
                                </div>
                            )}
                        </button>

                        <AnimatePresence>
                            {(!isCollapsed && isOrchestratorOpen) && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden flex flex-col gap-1 pl-4" // Simple indentation
                                >
                                    {/* X-style sub-items usually don't exist, but we'll use a clean list */}
                                    <SubItem href="/roadmap/single" icon={Layers} title="Single Pipeline" isActive={isActive('/roadmap/single')} />
                                    <SubItem href="/roadmap/marathon" icon={Zap} title="Marathon" isActive={isActive('/roadmap/marathon')} />
                                    <SubItem href="/roadmap/tournament" icon={Trophy} title="Tournament" isActive={isActive('/roadmap/tournament')} />
                                    <SubItem href="/roadmap/multi-market" icon={Globe} title="Arbitrage" isActive={isActive('/roadmap/multi-market')} />
                                    <SubItem href="/roadmap/strategic" icon={TrendingUp} title="Trajectory" isActive={isActive('/roadmap/strategic')} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <NavItem href="/faq" icon={HelpCircle} label="How it works" isCollapsed={isCollapsed} isActive={isActive('/faq')} />
                    <NavItem href="/about" icon={Info} label="Project" isCollapsed={isCollapsed} isActive={isActive('/about')} />

                    {/* Spacer */}
                    <div className="flex-1"></div>

                    {/* Bottom / More Section */}
                    <NavItem href="/settings" icon={MoreHorizontal} label="More" isCollapsed={isCollapsed} isActive={isActive('/settings')} />

                    {/* User Profile / Config Placeholder */}
                    <div className={`mt-4 mb-6 flex items-center gap-3 ${isCollapsed ? 'justify-center' : 'px-4'}`}>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500"></div>
                        {!isCollapsed && (
                            <div className="flex flex-col overflow-hidden">
                                <span className="text-sm font-bold text-white truncate">Kazira Agent</span>
                                <span className="text-xs text-slate-500 truncate">@pro_plan</span>
                            </div>
                        )}
                    </div>
                </nav>

                {/* Toggle Button - X doesn't really have this, but user needs it for "clunky" fix maybe? 
                    Actually, if we copy X, it's usually based on viewport. 
                    But user has a manual toggle preference. We'll keep it subtle.
                */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-12 bg-[#0a0a0a] border border-white/20 rounded-r-xl flex items-center justify-center hover:bg-white hover:text-black transition-colors duration-200 z-50 cursor-pointer"
                >
                    <ChevronRight className={`w-3 h-3 transition-transform duration-300 ${isCollapsed ? '' : 'rotate-180'}`} />
                </button>

            </motion.div>
        </motion.aside>
    );
}

function NavItem({ href, icon: Icon, label, isCollapsed, isActive }: any) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <Link
            href={href}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`
                flex items-center gap-4 w-full rounded-3xl transition-all duration-200 group relative
                ${isCollapsed ? 'justify-center w-12 h-12 self-center' : 'px-4 py-3'}
                ${isActive ? 'font-bold' : 'text-slate-400 hover:text-white hover:bg-white/10'}
            `}
        >
            <Icon className={`w-6 h-6 flex-shrink-0 ${isActive ? 'text-white' : ''}`} />

            {!isCollapsed && (
                <span className="text-xl tracking-tight overflow-hidden whitespace-nowrap">
                    {label}
                </span>
            )}

            {/* X-style Dot for Active */}
            {/* {isActive && !isCollapsed && <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full"></div>} */}

            {/* Tooltip for Collapsed State */}
            <AnimatePresence>
                {isCollapsed && isHovered && (
                    <motion.div
                        initial={{ opacity: 0, x: 10, scale: 0.9 }}
                        animate={{ opacity: 1, x: 20, scale: 1 }}
                        exit={{ opacity: 0, x: 10, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-full top-1/2 -translate-y-1/2 z-[60] bg-white text-black text-xs font-bold px-3 py-1.5 rounded-lg shadow-xl whitespace-nowrap pointer-events-none"
                    >
                        {label}
                        <div className="absolute left-0 top-1/2 -translate-x-[4px] -translate-y-1/2 w-2 h-2 bg-white rotate-45"></div>
                    </motion.div>
                )}
            </AnimatePresence>
        </Link>
    );
}

function SubItem({ href, icon: Icon, title, isActive }: any) {
    return (
        <Link
            href={href}
            className={`
                flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group
                ${isActive ? 'text-white bg-white/10' : 'text-slate-500 hover:text-white hover:bg-white/5'}
            `}
        >
            <Icon className="w-5 h-5 shrink-0" />
            <span className="text-base truncate">{title}</span>
        </Link>
    );
}
