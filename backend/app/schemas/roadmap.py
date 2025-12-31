from pydantic import BaseModel, Field
from typing import List, Optional

class RoadmapResource(BaseModel):
    name: str
    url: str
    type: str # e.g., "course", "article", "community"
    cost: str # "Free" or "Paid"
    description: Optional[str] = None
    is_local: bool = False

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

class RoadmapOutput(BaseModel):
    summary: str
    months: List[RoadmapMonth]
    additional_info: Optional[str] = None

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
