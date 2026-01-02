"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
    ChevronLeft, Play, Clock, CheckCircle2, Circle,
    Calendar, BookOpen, Video, ExternalLink, Target,
    TrendingUp, Award, Briefcase, ArrowRight
} from "lucide-react";

interface LearningResource {
    youtube_videos?: VideoResource[];
    courses?: CourseResource[];
    documentation?: DocResource[];
    weekly_schedule?: WeekSchedule[];
}

interface VideoResource {
    title: string;
    url: string;
    channel: string;
    duration: string;
    thumbnail: string;
    description: string;
}

interface CourseResource {
    title: string;
    url: string;
    platform: string;
    duration: string;
    price: string;
}

interface DocResource {
    title: string;
    url: string;
    description: string;
}

interface WeekSchedule {
    week: number;
    tasks: string[];
    estimated_hours: number;
}

interface MonthLearning {
    month: number;
    title: string;
    skills: string[];
    resources: LearningResource;
    tasks: string[];
    progress: number;
    status: string;
}

interface ExecutionPlan {
    roadmap_id: string;
    target_role: string;
    months: MonthLearning[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function LearningPage() {
    const params = useParams();
    const resultId = params.resultId as string;
    const [executionPlan, setExecutionPlan] = useState<ExecutionPlan | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeMonth, setActiveMonth] = useState(0);
    const [activeTab, setActiveTab] = useState<"videos" | "courses" | "docs" | "schedule">("videos");
    const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
    const [watchedVideos, setWatchedVideos] = useState<Set<string>>(new Set());

    useEffect(() => {
        if (resultId) {
            fetchExecutionPlan();
        }
    }, [resultId]);

    const fetchExecutionPlan = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/roadmap/execute-roadmap`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ result_id: resultId })
            });
            if (!res.ok) {
                const errorText = await res.text();
                console.error("API Error:", errorText);
                throw new Error("Failed to load execution plan");
            }
            const data = await res.json();
            setExecutionPlan(data);
            setActiveMonth(0);
        } catch (e) {
            console.error("Error loading execution plan:", e);
        } finally {
            setLoading(false);
        }
    };

    const toggleTask = (monthIndex: number, taskIndex: number) => {
        const key = `${monthIndex}-${taskIndex}`;
        setCompletedTasks(prev => {
            const newSet = new Set(prev);
            if (newSet.has(key)) {
                newSet.delete(key);
            } else {
                newSet.add(key);
            }
            return newSet;
        });
    };

    const markVideoWatched = (monthIndex: number, videoIndex: number) => {
        const key = `${monthIndex}-video-${videoIndex}`;
        setWatchedVideos(prev => new Set(prev).add(key));
    };

    const getProgress = (monthIndex: number) => {
        if (!executionPlan || !executionPlan.months) return 0;
        const month = executionPlan.months[monthIndex];
        if (!month) return 0;

        const tasksLength = month.tasks?.length || 0;
        const videosLength = month.resources?.youtube_videos?.length || 0;
        const totalTasks = tasksLength + videosLength;
        const completed =
            (month.tasks?.filter((_, i) => completedTasks.has(`${monthIndex}-${i}`)).length || 0) +
            (month.resources?.youtube_videos?.filter((_, i) => watchedVideos.has(`${monthIndex}-video-${i}`)).length || 0);

        return totalTasks > 0 ? Math.round((completed / totalTasks) * 100) : 0;
    };

    const getVideoId = (url: string) => {
        const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
        return match ? match[1] : "";
    };

    const thumbnailUrl = (url: string) => {
        const videoId = getVideoId(url);
        return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : "";
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-white/10 border-t-primary rounded-full animate-spin mx-auto mb-6"></div>
                    <p className="text-slate-400 text-lg">Preparing your learning journey...</p>
                </div>
            </div>
        );
    }

    if (!executionPlan || executionPlan.months.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6">
                <div className="text-center glass-card p-12 rounded-3xl border border-white/10">
                    <h2 className="text-2xl font-bold text-white mb-4">Learning Plan Not Found</h2>
                    <Link href="/roadmap" className="btn-primary px-8 py-3 inline-flex items-center gap-2">
                        <ChevronLeft className="w-4 h-4" /> Back to Roadmap
                    </Link>
                </div>
            </div>
        );
    }

    const currentMonth = executionPlan.months?.[activeMonth];
    const progress = getProgress(activeMonth);

    return (
        <div className="min-h-screen pb-20">
            {/* Header */}
            <div className="bg-gradient-to-b from-slate-900/50 to-transparent py-6 px-6 border-b border-white/5">
                <div className="max-w-7xl mx-auto">
                    <Link 
                        href={`/roadmap/result/${resultId}`} 
                        className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6"
                    >
                        <ChevronLeft className="w-4 h-4" /> Back to Roadmap
                    </Link>

                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold text-white mb-2">
                                Learning Journey: {executionPlan.target_role}
                            </h1>
                            <p className="text-slate-400">
                                Track your progress with curated resources and tasks
                            </p>
                        </div>
                        <div className="glass-card px-6 py-4 rounded-2xl border border-white/10">
                            <div className="flex items-center gap-3">
                                <TrendingUp className="w-5 h-5 text-emerald-400" />
                                <div>
                                    <div className="text-2xl font-bold text-white">{progress}%</div>
                                    <div className="text-xs text-slate-500 uppercase tracking-widest">Month Progress</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Ready for Job Market Button */}
                <div className="mt-8">
                    <div className="glass-card p-8 rounded-3xl border border-emerald-500/30 text-center">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <Briefcase className="w-8 h-8 text-emerald-400" />
                            <h3 className="text-2xl font-bold text-white">Ready for Job Market?</h3>
                        </div>
                        <p className="text-slate-400 mb-6 max-w-xl mx-auto">
                            Test your skills with our AI-powered verification system. We'll simulate a technical interview
                            and assess your readiness for real job opportunities.
                        </p>
                        <Link
                            href={`/verification/${resultId}`}
                            className="btn-primary bg-emerald-600 hover:bg-emerald-500 px-10 py-4 inline-flex items-center gap-2 text-lg group"
                        >
                            Start Verification
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
