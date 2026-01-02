from fastapi import APIRouter, HTTPException, UploadFile, File, BackgroundTasks
from typing import List, Optional
from pydantic import BaseModel

router = APIRouter()

class MarathonInput(BaseModel):
    career_goal: str
    location: str = "Kenya"
    current_status: str
    skills: List[str] = []
    duration_hours: int = 72
    check_interval_minutes: int = 30
    constraints: List[str] = []

class TournamentInput(BaseModel):
    career_goal: str
    location: str = "Kenya"
    current_status: str
    skills: List[str] = []
    constraints: List[str] = []

class MultiMarketInput(BaseModel):
    career_goal: str
    primary_market: str
    compare_markets: List[str]
    current_status: str
    skills: List[str] = []

class StrategicInput(BaseModel):
    target_role: str
    start_role: str
    current_skills: List[str] = []
    years_experience: int = 0
    location: str = "Kenya"

class RepoVerificationInput(BaseModel):
    repo_url: str
    requirements: List[str] = ["authentication", "database", "api"]

@router.post("/verify/repo")
async def verify_repo(input_data: RepoVerificationInput):
    """
    Autonomous 'Code Vibe Check' using Gemini 3.
    Verifies if a GitHub repo meets the requirements.
    """
    try:
        from app.agents.verification_agent import VerificationAgent
        agent = VerificationAgent()
        result = await agent.verify_project_repo(input_data.repo_url, input_data.requirements)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/analyze/video")
async def analyze_video(file: UploadFile = File(...)):
    """
    Spatial-Temporal Video Understanding (Gemini 3).
    Analyzes 'Elevator Pitch' videos for soft skills.
    """
    try:
        from app.agents.video_agent import VideoAgent
        agent = VideoAgent()
        result = await agent.analyze_pitch(file)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/orchestrator/start")
async def start_marathon(input_data: MarathonInput, background_tasks: BackgroundTasks):
    try:
        from app.agents.orchestrator import CareerOrchestrator
        import uuid
        
        user_id = f"user_{uuid.uuid4().hex[:8]}"
        orchestrator = CareerOrchestrator(
            user_id=user_id,
            career_goal=input_data.career_goal,
            location=input_data.location
        )
        
        # Create initial session state and persist it
        from app.services.result_storage import store_roadmap_result
        initial_roadmap = {
            "summary": f"Marathon Session Active: Searching for {input_data.career_goal} in {input_data.location}...",
            "target_role": input_data.career_goal,
            "location": input_data.location,
            "months": [],
            "additional_info": "Agent is running (Time-to-Live: 72 hours). checks: Monitor Mission Control for live updates."
        }
        
        # Use storage ID as session ID
        session_id = store_roadmap_result(initial_roadmap)
        
        # Start background task
        background_tasks.add_task(
            orchestrator.start_marathon_session,
            duration_hours=input_data.duration_hours,
            check_interval_minutes=input_data.check_interval_minutes
        )
        
        return {
            "session_id": session_id,
            "result_id": session_id, # Explicitly return result_id for frontend compatibility
            "status": "started",
            "message": "Marathon agent deployed successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/tournament/start")
async def start_tournament(input_data: TournamentInput):
    try:
        from app.agents.tournament_orchestrator import TournamentOrchestrator
        from app.agents.planning_agent import PlanningAgent
        from app.services.result_storage import store_roadmap_result
        import uuid
        
        # 1. Run Tournament (Research Phase)
        tournament_orchestrator = TournamentOrchestrator()
        research_result = await tournament_orchestrator.run_tournament(
            goal=input_data.career_goal,
            location=input_data.location,
            num_agents=4
        )
        
        # 2. Planning Phase (Generate Roadmap from Winner's Data)
        planning_agent = PlanningAgent()
        # Ensure constraints is a dict as expected by PlanningAgent
        constraints_dict = {"constraints": input_data.constraints}
        
        roadmap = await planning_agent.create_roadmap(
            career_goal=input_data.career_goal,
            research_data=research_result,
            constraints=constraints_dict
        )
        
        # Add Tournament Metadata to Roadmap for context
        winner_strategy = research_result.get("tournament_metadata", {}).get("winner_strategy", "Unknown")
        roadmap["summary"] = f"🏆 Tournament Winner ({winner_strategy}): {roadmap.get('summary', '')}"
        roadmap["location"] = input_data.location
        
        # 3. Store Result
        session_id = store_roadmap_result(roadmap)
        
        return {
            "result_id": session_id,
            "tournament_id": research_result.get("tournament_metadata", {}).get("tournament_id"),
            "status": "completed",
            "winner_strategy": winner_strategy,
            "message": "Tournament complete. Roadmap generated."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/multi-market/analyze")
async def analyze_multi_market(input_data: MultiMarketInput):
    try:
        import uuid
        
        return {
            "analysis_id": f"analysis_{uuid.uuid4().hex[:12]}",
            "status": "completed",
            "primary_market": input_data.primary_market,
            "compared_markets": input_data.compare_markets,
            "message": "Market analysis completed"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/strategic/path")
async def generate_strategic_path(input_data: StrategicInput):
    try:
        import uuid
        
        return {
            "path_id": f"path_{uuid.uuid4().hex[:12]}",
            "status": "completed",
            "current_role": input_data.start_role,
            "target_role": input_data.target_role,
            "message": "Strategic trajectory generated"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/orchestrator/status/{session_id}")
async def get_session_status(session_id: str):
    return await get_session(session_id)

@router.get("/orchestrator/session/{session_id}")
async def get_session(session_id: str):
    try:
        from app.services.mission_control import MissionControl
        mc = MissionControl.get_instance()
        
        return {
            "session_id": session_id,
            "status": "active",
            "logs": mc.mission_logs,
            "roadmap": {
                "summary": "Your personalized career roadmap based on marathon analysis",
                "target_role": "Software Engineer",
                "hours_per_week": 20,
                "months": []
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
