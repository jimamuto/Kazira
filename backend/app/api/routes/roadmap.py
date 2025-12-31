from fastapi import APIRouter, HTTPException
from app.schemas.roadmap import RoadmapInput, RoadmapOutput
from app.services.roadmap_service import roadmap_service
from typing import List

router = APIRouter()

@router.post("/generate", response_model=RoadmapOutput)
async def generate_roadmap(input_data: RoadmapInput):
    try:
        return await roadmap_service.create_roadmap(input_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/history")
async def get_history():
    return await roadmap_service.get_history()

@router.get("/debug/models")
async def list_models():
    from app.services.gemini_client import gemini_client
    return gemini_client.list_available_models()
