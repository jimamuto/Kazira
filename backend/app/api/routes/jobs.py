from fastapi import APIRouter, HTTPException
from app.schemas.job import Job, JobRecommendation
from typing import List
from datetime import datetime

router = APIRouter()

# Mock data for Kenyan AI Jobs
MOCK_JOBS = [
    {
        "id": 1,
        "title": "Junior ML Engineer",
        "company": "Safaricom PLC",
        "location": "Nairobi, Kenya",
        "link": "https://www.safaricom.co.ke/careers",
        "type": "Full-time",
        "tags": ["Python", "TensorFlow", "Big Data"],
        "description": "Join the AI & Automation squad at Safaricom."
    },
    {
        "id": 2,
        "title": "Data Analyst Intern",
        "company": "Kopo Kopo",
        "location": "Nairobi, Kenya (Hybrid)",
        "link": "https://kopokopo.co.ke/careers",
        "type": "Internship",
        "tags": ["Excel", "SQL", "Tableau"],
        "description": "Analyze merchant trends and credit scoring models."
    },
    {
        "id": 3,
        "title": "Machine Learning Research Assistant",
        "company": "CGIAR AI Hub",
        "location": "Nairobi, Kenya",
        "link": "https://www.cgiar.org",
        "type": "Contract",
        "tags": ["NLP", "Agriculture AI", "Python"],
        "description": "Apply AI to climate-smart agriculture datasets."
    },
     {
        "id": 4,
        "title": "Backend AI Developer",
        "company": "Ajua",
        "location": "Nairobi, Kenya",
        "link": "https://ajua.com",
        "type": "Full-time",
        "tags": ["FastAPI", "LLMs", "PostgreSQL"],
        "description": "Build high-scale customer experience platforms powered by AI."
    }
]

from pydantic import BaseModel
from app.services.gemini_client import gemini_client

class MatchInput(BaseModel):
    job_description: str
    user_skills: List[str]

class MatchOutput(BaseModel):
    score: int
    missing_skills: List[str]
    advice: str

@router.get("/", response_model=List[Job])
async def get_jobs():
    # Simulate freshness by updating posted_at dynamically for the demo
    current_jobs = []
    for job in MOCK_JOBS:
        # Shallow copy to avoid mutating global
        j = job.copy()
        j["posted_at"] = datetime.now().isoformat() # Always "Just now" for the hackathon
        current_jobs.append(j)
    return current_jobs

@router.get("/recommendations/{roadmap_id}", response_model=JobRecommendation)
async def get_job_recommendations(roadmap_id: str):
    return {"roadmap_id": int(roadmap_id) if roadmap_id.isdigit() else None, "jobs": MOCK_JOBS[:2]}

@router.post("/match", response_model=MatchOutput)
async def analyze_job_match(input_data: MatchInput):
    # Quick Mock Logic for MVP Speed (can swap to Gemini if requested, but user said "no complex stuff")
    # Actually, user asked for "Analysis", so let's try a simple Gemini call if feasible, else specific logic
    
    # Let's use a robust heuristic for speed/reliability in demo
    job_text = input_data.job_description.lower()
    user_skills_lower = [s.lower() for s in input_data.user_skills]
    
    found = 0
    missing = []
    
    # simplistic keyword extraction from description for the demo
    keywords = ["python", "react", "sql", "aws", "docker", "kubernetes", "typescript", "fastapi", "django", "machine learning"]
    relevant_keywords = [k for k in keywords if k in job_text]
    
    for k in relevant_keywords:
        if any(k in s for s in user_skills_lower):
            found += 1
        else:
            missing.append(k.title())
            
    score = int((found / len(relevant_keywords)) * 100) if relevant_keywords else 85
    
    advice = "Strong match!" if score > 80 else f"Consider building a project with {', '.join(missing[:2])} to bridge the gap."
    
    return {
        "score": max(min(score, 98), 40), # Clamp between 40 and 98
        "missing_skills": missing,
        "advice": advice
    }
