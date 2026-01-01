from fastapi import APIRouter, HTTPException, UploadFile, File
import io
import pypdf
from app.schemas.job import Job, JobRecommendation
from typing import List, Dict, Any
from datetime import datetime
from pydantic import BaseModel
from app.services.gemini_client import gemini_client
from app.agents.scrapers.aggregator import MarketAggregator

router = APIRouter()
aggregator = MarketAggregator()

# Mock data for fallback
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

class MatchInput(BaseModel):
    job_description: str
    user_skills: List[str]

class MatchOutput(BaseModel):
    score: int
    missing_skills: List[str]
    advice: str

class ScrapeInput(BaseModel):
    role: str

@router.post("/scrape")
async def scrape_jobs(payload: ScrapeInput):
    """
    Called by the Research Agent flow in the Orchestrator.
    """
    try:
        results = await aggregator.gather_insights(payload.role)
        jobs = results.get("listings", [])
        
        if not jobs:
            jobs = [j for j in MOCK_JOBS if payload.role.lower() in j["title"].lower()]
            
        return {
            "status": "success",
            "jobs": jobs,
            "metadata": {
                "source": "Autonomous Research Agent",
                "count": len(jobs)
            }
        }
    except Exception as e:
        return {
            "status": "partial",
            "jobs": MOCK_JOBS[:2],
            "error": str(e)
        }

@router.get("/search")
async def search_jobs(q: str):
    """
    Called by the dedicated Market Pulse search bar.
    """
    try:
        results = await aggregator.gather_insights(q)
        jobs = results.get("listings", [])
        if not jobs:
            return [j for j in MOCK_JOBS if q.lower() in j["title"].lower()]
        return jobs
    except Exception:
        return [j for j in MOCK_JOBS if q.lower() in j["title"].lower()]

@router.get("/", response_model=List[Job])
async def get_jobs():
    current_jobs = []
    for job in MOCK_JOBS:
        j = job.copy()
        j["posted_at"] = datetime.now().isoformat()
        current_jobs.append(j)
    return current_jobs

@router.post("/match", response_model=MatchOutput)
async def analyze_job_match(input_data: MatchInput):
    analysis = await gemini_client.analyze_gap(
        job_description=input_data.job_description,
        user_skills=input_data.user_skills
    )
    return {
        "score": analysis.get("score", 0),
        "missing_skills": analysis.get("missing_skills", []),
        "advice": analysis.get("advice", "Keep learning!")
    }
@router.post("/extract-skills")
async def extract_skills_from_cv(file: UploadFile = File(...)):
    """
    Extracts text from a CV (PDF) and uses Gemini to synthesize a skills list.
    """
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported for now.")
    
    try:
        content = await file.read()
        pdf_reader = pypdf.PdfReader(io.BytesIO(content))
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() or ""
            
        if not text.strip():
            raise HTTPException(status_code=400, detail="Could not extract text from the PDF.")

        # Use Gemini to extract skills from the raw text
        prompt = f"""
        Extract a comprehensive list of technical skills, tools, and methodologies from the following CV text.
        Return ONLY a JSON object with a key 'skills' pointing to a list of strings.
        
        CV Text:
        {text[:4000]} 
        """
        
        response = await gemini_client.model.generate_content_async(prompt, generation_config={"response_mime_type": "application/json"})
        import json
        extracted_data = json.loads(response.text)
        
        return {
            "status": "success",
            "skills": extracted_data.get("skills", []),
            "skills_count": len(extracted_data.get("skills", []))
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process CV: {str(e)}")
