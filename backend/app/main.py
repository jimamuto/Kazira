from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import roadmap, jobs
from app.core.config import settings

app = FastAPI(title="Kazira | Autonomous Career Orchestration")

# --- Mission Control Integration ---
from app.services.mission_control import MissionControl
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Launch Marathon Agent
    mission_ctl = MissionControl.get_instance()
    mission_ctl.start_loop()
    yield
    # Shutdown
    mission_ctl.stop_loop()

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

@app.get("/")
async def root():
    return {"message": "Welcome to Kazira AI Career Path KE API"}

@app.get("/api/mission/logs")
async def get_mission_logs():
    return {"logs": MissionControl.get_instance().mission_logs}
