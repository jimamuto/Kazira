import pytest
from fastapi.testclient import TestClient
from unittest.mock import AsyncMock, patch
from app.main import app
from app.schemas.roadmap import RoadmapInput

client = TestClient(app)

@pytest.mark.asyncio
async def test_generate_roadmap_success():
    input_data = RoadmapInput(
        location="Remote",
        current_status="student",
        skills=["Python"],
        skill_level="beginner",
        target_role="Software Engineer",
        hours_per_week=20,
        timeframe_months=6,
        constraints=["laptop"]
    )
    
    mock_response = {
        "summary": "Roadmap for Software Engineer",
        "months": []
    }
    
    with patch('app.services.roadmap_service.roadmap_service.create_roadmap', new_callable=AsyncMock) as mock_create:
        mock_create.return_value = mock_response
        
        response = client.post("/api/roadmap/generate", json=input_data.model_dump())
        
        assert response.status_code == 200
        data = response.json()
        assert data["summary"] == "Roadmap for Software Engineer"
        assert data["months"] == []
        mock_create.assert_called_once_with(input_data)

@pytest.mark.asyncio
async def test_generate_roadmap_failure():
    input_data = RoadmapInput(
        location="Remote",
        current_status="student",
        skills=["Python"],
        skill_level="beginner",
        target_role="Software Engineer",
        hours_per_week=20,
        timeframe_months=6,
        constraints=["laptop"]
    )
    
    with patch('app.services.roadmap_service.roadmap_service.create_roadmap', new_callable=AsyncMock) as mock_create:
        mock_create.side_effect = Exception("Service error")
        
        response = client.post("/api/roadmap/generate", json=input_data.model_dump())
        
        assert response.status_code == 500
        assert "Service error" in response.json()["detail"]

@pytest.mark.asyncio
async def test_get_history():
    mock_history = [{"id": 1, "goal": "Test"}]
    
    with patch('app.services.roadmap_service.roadmap_service.get_history', new_callable=AsyncMock) as mock_get:
        mock_get.return_value = mock_history
        
        response = client.get("/api/roadmap/history")
        
        assert response.status_code == 200
        assert response.json() == mock_history

@pytest.mark.asyncio
async def test_list_models():
    mock_models = ["model1", "model2"]
    
    with patch('app.services.gemini_client.gemini_client.list_available_models') as mock_list:
        mock_list.return_value = mock_models
        
        response = client.get("/api/roadmap/debug/models")
        
        assert response.status_code == 200
        assert response.json() == mock_models

