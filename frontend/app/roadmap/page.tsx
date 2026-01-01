"use client";

import { useState } from "react";
import RoadmapView from "@/components/RoadmapView";
import { RoadmapOutput } from "@/types/roadmap";
import NewOrchestrator from "@/components/NewOrchestrator";
import ExecutionView from "@/components/ExecutionView";

export default function RoadmapPage() {
    const [roadmap, setRoadmap] = useState<RoadmapOutput | null>(null);
    const [view, setView] = useState<"PLAN" | "EXECUTION">("PLAN");

    const handleSuccess = (data: RoadmapOutput) => {
        setRoadmap(data);
        setView("PLAN");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleReset = () => {
        setRoadmap(null);
        setView("PLAN");
    };

    return (
        <div className="py-12 sm:py-20 px-4">
            {!roadmap ? (
                <NewOrchestrator onSuccess={handleSuccess} />
            ) : view === "PLAN" ? (
                <RoadmapView
                    roadmap={roadmap}
                    onReset={handleReset}
                    onLaunchExecution={() => setView("EXECUTION")}
                />
            ) : (
                <ExecutionView
                    roadmap={roadmap}
                    onBack={() => setView("PLAN")}
                />
            )}
        </div>
    );
}
