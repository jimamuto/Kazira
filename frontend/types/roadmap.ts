export interface RoadmapResource {
    name: string;
    url: string;
    type: string;
    cost: "Free" | "Paid";
    description?: string;
    is_local: boolean;
    thumbnail_url?: string;
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

export interface DailyTask {
    day: string;
    topic: string;
    duration_min: number;
    reminder_text: string;
}

export interface ExecutionSprint {
    week_number: number;
    milestone_title: string;
    days: DailyTask[];
    focus_area: string;
}

export interface ExecutionSchedule {
    sprints: ExecutionSprint[];
    active_sprint_index: number;
}

export interface RoadmapOutput {
    summary: string;
    months: RoadmapMonth[];
    additional_info?: string;
    execution_schedule?: ExecutionSchedule;
    target_role: string;
    hours_per_week: number;
    timeframe_months?: number;
    location?: string;
    logs?: {
        timestamp: string;
        source: string;
        message: string;
        metadata?: any;
    }[];
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
