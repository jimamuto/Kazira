from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import roadmap, jobs, orchestrator
from app.core.config import settings
import asyncio
from datetime import datetime, timedelta

app = FastAPI(title="Kazira | Autonomous Career Orchestration")

# Cleanup task for expired results
async def cleanup_expired_results():
    while True:
        await asyncio.sleep(3600)  # Run every hour
        from app.services.result_storage import roadmap_results
        current_time = datetime.now()
        expired_keys = [
            key for key, data in roadmap_results.items()
            if current_time - data.get('created_at', current_time) > timedelta(hours=24)
        ]
        for key in expired_keys:
            del roadmap_results[key]

# --- Mission Control Integration ---
from app.services.mission_control import MissionControl
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Launch Marathon Agent
    mission_ctl = MissionControl.get_instance()
    mission_ctl.start_loop()

    # Start cleanup task
    cleanup_task = asyncio.create_task(cleanup_expired_results())

    yield
    # Shutdown
    mission_ctl.stop_loop()
    cleanup_task.cancel()

app = FastAPI(title="Kazira | Autonomous Career Orchestration", lifespan=lifespan)
# -----------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(roadmap.router, prefix="/api/roadmap", tags=["roadmap"])
app.include_router(jobs.router, prefix="/api/jobs", tags=["jobs"])
app.include_router(orchestrator.router, prefix="/api") # Combined orchestrator routes

@app.get("/api/roadmap/result/{result_id}")
async def get_roadmap_result(result_id: str):
    """Retrieve stored roadmap result by ID"""
    from app.services.result_storage import get_roadmap_result

    result = get_roadmap_result(result_id)
    if not result:
        return {"error": "Result not found or expired"}

    # Don't include metadata in response
    return {
        "summary": result["summary"],
        "months": result["months"],
        "additional_info": result.get("additional_info"),
        "execution_schedule": result.get("execution_schedule"),
        "target_role": result.get("target_role", ""),
        "hours_per_week": result.get("hours_per_week", 20),
        "timeframe_months": result.get("timeframe_months")
    }

@app.get("/")
async def root():
    return {"message": "Welcome to Kazira AI Career Path KE API"}

@app.get("/health")
async def health_check():
    """Health check endpoint for monitoring and load balancers"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "service": "Kazira API",
        "version": "1.0.0"
    }

@app.get("/api/mission/logs")
async def get_mission_logs():
    return {"logs": MissionControl.get_instance().mission_logs}
