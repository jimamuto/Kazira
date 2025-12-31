from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class JobBase(BaseModel):
    title: str
    company: str
    location: str = "Nairobi, Kenya"
    link: str
    type: str # Full-time, Internship, Contract
    posted_at: datetime = datetime.utcnow()
    description: Optional[str] = None
    tags: List[str] = []

class Job(JobBase):
    id: int

class JobRecommendation(BaseModel):
    roadmap_id: Optional[int] = None
    jobs: List[Job]
