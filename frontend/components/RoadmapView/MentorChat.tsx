"use client";

import { useState } from "react";
import { X, Send, Sparkles, HelpCircle, GripHorizontal } from "lucide-react";
import { RoadmapOutput } from "@/types/roadmap";
import { motion, useDragControls } from "framer-motion";

interface MentorChatProps {
    roadmap: RoadmapOutput;
}

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
}

export default function MentorChat({ roadmap }: MentorChatProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { id: "1", role: "assistant", content: "I've analyzed your blueprint. Need clarification on any module?" }
    ]);
    const [inputValue, setInputValue] = useState("");

    // Drag controls for the header handle
    const controls = useDragControls();

    const generateResponse = (query: string) => {
        const lowerQuery = query.toLowerCase();

        if (lowerQuery.includes("clarify") || lowerQuery.includes("explain") || lowerQuery.includes("why")) {
            return `This blueprint focuses on high-leverage skills first. Detailed guides are available in the expanded view of each month. What specific module is unclear?`;
        }
        if (lowerQuery.includes("shorten") || lowerQuery.includes("fast") || lowerQuery.includes("quick")) {
            return `I can compress the timeline. Currently it's set to ${roadmap.months.length} months. Should I switch to a 'Rapid Sprint' mode (approx -20% duration)?`;
        }
        if (lowerQuery.includes("job") || lowerQuery.includes("work") || lowerQuery.includes("money")) {
            return `The 'Career Alignment' matrix at the bottom links directly to live market roles. Focus on the [${roadmap.months[0]?.skills[0] || 'Core'}] module to get hired fastest.`;
        }
        if (lowerQuery.includes("python") || lowerQuery.includes("code") || lowerQuery.includes("tech")) {
            return `We've prioritized local market relevance. For Kenya, Python/Django is currently seeing 40% more traction than Node.js in enterprise roles.`;
        }
        return `I've noted that requirement. I'm learning your preferences to better refine the next iteration of the strategy.`;
    };

    const handleSend = () => {
        if (!inputValue.trim()) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: inputValue
        };

        setMessages(prev => [...prev, newMessage]);
        setInputValue("");

        setTimeout(() => {
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: generateResponse(newMessage.content)
            }]);
        }, 1000);
    };

    return (
        <motion.div
            drag
            dragListener={false}
            dragControls={controls}
            dragMomentum={false}
            initial={{ x: 0, y: 0 }}
            className="fixed top-32 right-10 z-[100]"
        >
            {/* Collapsed Trigger Pill */}
            {!isOpen && (
                <div
                    onPointerDown={(e) => controls.start(e)}
                    onClick={() => setIsOpen(true)}
                    className="cursor-grab active:cursor-grabbing flex items-center gap-3 px-5 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/20 transition-all shadow-xl group"
                >
                    <div className="p-1.5 rounded-full bg-accent text-black">
                        <HelpCircle className="w-3 h-3" />
                    </div>
                    <span className="text-[10px] font-bold text-white uppercase tracking-widest group-hover:text-accent transition-colors">Have a question?</span>
                    <GripHorizontal className="w-3 h-3 text-white/20 ml-2" />
                </div>
            )}

            {/* Expanded Chat Panel */}
            {isOpen && (
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-[340px] h-[500px] glass-card rounded-[32px] border-white/10 shadow-2xl overflow-hidden flex flex-col"
                >
                    {/* Header (Drag Handle) */}
                    <div
                        onPointerDown={(e) => controls.start(e)}
                        className="p-5 border-b border-white/5 flex justify-between items-center bg-black/40 cursor-grab active:cursor-grabbing"
                    >
                        <div className="flex items-center gap-3 pointer-events-none">
                            <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center">
                                <Sparkles className="w-3 h-3 text-accent" />
                            </div>
                            <div>
                                <h3 className="text-xs font-bold text-white">Mentor AI</h3>
                                <p className="text-[9px] text-slate-400">Context Active</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <GripHorizontal className="w-4 h-4 text-white/10" />
                            <button
                                onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
                                className="p-1.5 rounded-full hover:bg-white/10 transition-colors text-white/50 hover:text-white"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-5 space-y-4">
                        {messages.map(msg => (
                            <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                <div className={`max-w-[85%] p-3 rounded-xl text-[10px] leading-relaxed ${msg.role === "user"
                                        ? "bg-white text-black"
                                        : "bg-white/5 text-slate-300 border border-white/5"
                                    }`}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Input */}
                    <div className="p-4 bg-black/40 border-t border-white/5">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Type your query..."
                                className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-4 pr-10 text-[10px] text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                            />
                            <button
                                onClick={handleSend}
                                className="absolute right-1 top-1 p-2 rounded-full bg-white text-black hover:bg-slate-200 transition-colors"
                            >
                                <Send className="w-3 h-3" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
}
