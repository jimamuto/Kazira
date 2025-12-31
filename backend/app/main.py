from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import roadmap, jobs
from app.core.config import settings

app = FastAPI(title="Ajira AI Career Path KE API")

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
    return {"message": "Welcome to Ajira AI Career Path KE API"}
