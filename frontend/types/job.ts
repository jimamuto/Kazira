export interface Job {
    id: number;
    title: string;
    company: string;
    location: string;
    link: string;
    type: string;
    posted_at: string;
    description?: string;
    tags: string[];
}

export interface JobRecommendation {
    roadmap_id?: number;
    jobs: Job[];
}
