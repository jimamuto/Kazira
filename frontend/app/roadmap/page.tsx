"use client";

import { useState } from "react";
import RoadmapForm from "@/components/RoadmapForm";
import RoadmapView from "@/components/RoadmapView";
import { RoadmapOutput } from "@/types/roadmap";

export default function RoadmapPage() {
    const [roadmap, setRoadmap] = useState<RoadmapOutput | null>(null);

    const handleSuccess = (data: RoadmapOutput) => {
        setRoadmap(data);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleReset = () => {
        setRoadmap(null);
    };

    return (
        <div className="py-12 sm:py-20 px-4">
            {!roadmap ? (
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Your AI Career Blueprint</h1>
                        <p className="text-slate-500 max-w-xl mx-auto">
                            Fill out the form below to receive a customized learning path optimized for the Kenyan tech ecosystem.
                        </p>
                    </div>
                    <RoadmapForm onSuccess={handleSuccess} />
                </div>
            ) : (
                <RoadmapView roadmap={roadmap} onReset={handleReset} />
            )}
        </div>
    );
}
