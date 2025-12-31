export interface RoadmapResource {
    name: string;
    url: string;
    type: string;
    cost: "Free" | "Paid";
    description?: string;
    is_local: boolean;
}

export interface RoadmapMonth {
    month: number;
    title: string;
    skills: string[];
    tasks: string[];
    projects: string[];
    detailed_guide?: string;
    resources: RoadmapResource[];
}

export interface RoadmapOutput {
    summary: string;
    months: RoadmapMonth[];
    additional_info?: string;
}

export interface RoadmapInput {
    name?: string;
    location: string;
    current_status: "student" | "graduate" | "junior dev";
    degree?: string;
    skills: string[];
    skill_level: "beginner" | "intermediate" | "advanced";
    target_role: string;
    hours_per_week: number;
    timeframe_months: number;
    constraints: string[];
}
