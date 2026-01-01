from pydantic import BaseModel, Field
from typing import List, Optional

class RoadmapResource(BaseModel):
    name: str
    url: str
    type: str # e.g., "course", "article", "community", "video"
    cost: str # "Free" or "Paid"
    description: Optional[str] = None
    is_local: bool = False
    thumbnail_url: Optional[str] = None

class RoadmapMonth(BaseModel):
    month: int
    title: str
    skills: List[str]
    tasks: List[str]
    projects: List[str]
    detailed_guide: Optional[str] = None # Markdown content for deep dive
    resources: List[RoadmapResource]

class RoadmapSection(BaseModel):
    title: str
    content: str

class DailyTask(BaseModel):
    day: str
    topic: str
    duration_min: int
    reminder_text: str

class ExecutionSprint(BaseModel):
    week_number: int
    milestone_title: str
    days: List[DailyTask]
    focus_area: str

class ExecutionSchedule(BaseModel):
    sprints: List[ExecutionSprint]
    active_sprint_index: int = 0

class RoadmapOutput(BaseModel):
    summary: str
    months: List[RoadmapMonth]
    additional_info: Optional[str] = None
    execution_schedule: Optional[ExecutionSchedule] = None

class RoadmapInput(BaseModel):
    name: Optional[str] = None
    location: str = "Kenya"
    current_status: str # student, graduate, junior dev
    degree: Optional[str] = None
    skills: List[str]
    skill_level: str # beginner, intermediate, advanced
    target_role: str
    hours_per_week: int
    timeframe_months: int # 3 or 6
    constraints: List[str] # e.g., "laptop", "4G bundles"
