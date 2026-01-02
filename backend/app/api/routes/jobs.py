from fastapi import APIRouter, HTTPException, UploadFile, File
import io
import pypdf
import re
from app.schemas.job import Job, JobRecommendation
from typing import List, Dict, Any, Set
from datetime import datetime
from pydantic import BaseModel
from app.services.gemini_client import gemini_client
from app.agents.scrapers.aggregator import MarketAggregator
from difflib import get_close_matches
import json
from pathlib import Path

router = APIRouter()
aggregator = MarketAggregator()

# In-memory cache for discovered job roles
job_roles_cache: Set[str] = set()
cache_file = Path("backend/job_roles_cache.json")

def load_job_roles_cache():
    """Load previously discovered job roles from cache file"""
    global job_roles_cache
    if cache_file.exists():
        try:
            with open(cache_file, 'r') as f:
                job_roles_cache = set(json.load(f))
        except Exception:
            job_roles_cache = set()

def save_job_roles_cache():
    """Save discovered job roles to cache file"""
    try:
        with open(cache_file, 'w') as f:
            json.dump(list(job_roles_cache), f)
    except Exception:
        pass

def extract_job_title(title: str) -> str:
    """Clean and normalize job title"""
    # Remove common noise
    title = re.sub(r'\(.*?\)', '', title)  # Remove parenthetical content
    title = re.sub(r'\[.*?\]', '', title)  # Remove bracketed content
    title = re.sub(r'\s+', ' ', title)  # Normalize whitespace
    title = title.strip()
    
    # Common variations normalization
    variations = {
        'Sr.': 'Senior',
        'Jr.': 'Junior',
        'Sr': 'Senior',
        'Jr': 'Junior',
        'Eng': 'Engineer',
        'Dev': 'Developer',
        'Mgr': 'Manager',
    }
    
    for old, new in variations.items():
        title = title.replace(old, new)
    
    return title

def update_job_roles_cache(jobs: List[Dict[str, Any]]):
    """Update cache with new job titles from scraped data"""
    global job_roles_cache
    for job in jobs:
        if 'title' in job:
            clean_title = extract_job_title(job['title'])
            if clean_title and len(clean_title) > 3:
                job_roles_cache.add(clean_title)
    
    # Save if cache grew significantly
    if len(job_roles_cache) > 10:
        save_job_roles_cache()

def get_smart_suggestions(query: str, limit: int = 5) -> List[str]:
    """
    Smart suggestion algorithm that uses:
    1. Cached job roles from real scraped data
    2. AI-powered suggestions when cache is empty
    3. Multiple matching strategies
    """
    if not query or len(query) < 2:
        return []
    
    query_lower = query.lower().strip()
    suggestions = set()
    
    # Strategy 1: Exact prefix matches from cached roles
    for role in job_roles_cache:
        role_lower = role.lower()
        if role_lower.startswith(query_lower):
            suggestions.add(role)
    
    # Strategy 2: Partial word matches
    if len(suggestions) < limit:
        query_words = query_lower.split()
        for role in job_roles_cache:
            role_lower = role.lower()
            for word in query_words:
                if len(word) >= 3 and word in role_lower:
                    suggestions.add(role)
    
    # Strategy 3: Fuzzy matching
    if len(suggestions) < limit and len(job_roles_cache) > 0:
        close_matches = get_close_matches(query, list(job_roles_cache), n=limit, cutoff=0.4)
        suggestions.update(close_matches)
    
    # Strategy 4: AI-powered suggestions (when cache is limited)
    # Note: AI suggestions handled in the async endpoint
    
    # Convert to list and sort by relevance
    result = list(suggestions)
    result.sort(key=lambda x: (
        0 if x.lower().startswith(query_lower) else 1,  # Prefix matches first
        len(x),  # Shorter matches first
        x.lower().find(query_lower) if query_lower in x.lower() else 9999
    ))
    
    return result[:limit]

async def get_ai_suggestions(query: str, limit: int = 5) -> List[str]:
    """Use Gemini to generate relevant job role suggestions"""
    prompt = f"""Generate {limit} specific and relevant job role titles based on this query: "{query}"

Requirements:
- Return ONLY valid job titles found in the tech industry
- Be specific (e.g., "Senior ML Engineer" not "Engineer")
- Focus on modern tech roles
- Return as a JSON array of strings
- No explanations or extra text

Example format: ["Machine Learning Engineer", "Data Scientist", "ML Engineer"]
"""
    
    try:
        response = await gemini_client.generate_content_async(
            prompt,
            generation_config={
                "temperature": 0.7,
                "response_mime_type": "application/json"
            }
        )
        
        response_text = response.text if hasattr(response, 'text') and response.text else str(response)
        if response_text:
            suggestions = json.loads(response_text)
            if isinstance(suggestions, list):
                return suggestions
    except Exception as e:
        print(f"AI suggestion error: {e}")
    
    return []

# Load cache on startup
load_job_roles_cache()

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
    Scrapes jobs and updates the role cache with discovered titles.
    """
    try:
        results = await aggregator.gather_insights(payload.role)
        jobs = results.get("listings", [])
        
        if not jobs:
            jobs = [j for j in MOCK_JOBS if payload.role.lower() in j["title"].lower()]
        
        # Update cache with discovered job titles
        update_job_roles_cache(jobs)
        
        return {
            "status": "success",
            "jobs": jobs,
            "metadata": {
                "source": "Autonomous Research Agent",
                "count": len(jobs),
                "roles_discovered": len(job_roles_cache)
            }
        }
    except Exception as e:
        return {
            "status": "partial",
            "jobs": MOCK_JOBS[:2],
            "error": str(e)
        }

@router.get("/suggestions")
async def get_suggestions(q: str = "", limit: int = 5):
    """
    Get dynamic job role suggestions based on:
    - Previously scraped job data (cached)
    - Real-time AI-powered suggestions
    - Multiple intelligent matching strategies
    """
    try:
        if not q or len(q.strip()) < 2:
            return []
        
        suggestions = get_smart_suggestions(q, limit)
        
        # Add AI-powered suggestions if we need more
        if len(suggestions) < limit:
            ai_suggestions = await get_ai_suggestions(q, limit - len(suggestions))
            suggestions.extend(ai_suggestions)
        
        return list(set(suggestions))[:limit]  # Remove duplicates and limit
    except Exception as e:
        print(f"Error getting suggestions: {e}")
        return []

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
        
        # Update cache with discovered roles
        update_job_roles_cache(jobs)
        
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
    if not file.filename or not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported for now.")
    
    try:
        content = await file.read()
        pdf_reader = pypdf.PdfReader(io.BytesIO(content))
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() or ""
            
        if not text.strip():
            raise HTTPException(status_code=400, detail="Could not extract text from the PDF.")

        # Use Gemini to extract skills from raw text
        prompt = f"""
        Extract a comprehensive list of technical skills, tools, and methodologies from the following CV text.
        Return ONLY a JSON object with a key 'skills' pointing to a list of strings.
        
        CV Text:
        {text[:4000]} 
        """
        
        response = await gemini_client.generate_content_async(
            prompt,
            generation_config={"response_mime_type": "application/json"}
        )
        
        response_text = response.text if hasattr(response, 'text') and response.text else str(response)
        if not response_text:
            raise HTTPException(status_code=500, detail="Empty response from AI")
            
        extracted_data = json.loads(response_text)
        
        return {
            "status": "success",
            "skills": extracted_data.get("skills", []),
            "skills_count": len(extracted_data.get("skills", []))
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process CV: {str(e)}")
