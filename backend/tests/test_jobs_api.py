import pytest
from fastapi.testclient import TestClient
from unittest.mock import AsyncMock, patch, mock_open
from app.main import app
from io import BytesIO

client = TestClient(app)

@pytest.mark.asyncio
async def test_scrape_jobs_success():
    payload = {"role": "Developer"}
    
    mock_results = {"listings": [{"title": "Test Job"}]}
    
    with patch('app.agents.scrapers.aggregator.MarketAggregator.gather_insights', new_callable=AsyncMock) as mock_gather:
        mock_gather.return_value = mock_results
        
        response = client.post("/api/jobs/scrape", json=payload)
        
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "success"
        assert data["jobs"] == [{"title": "Test Job"}]

@pytest.mark.asyncio
async def test_scrape_jobs_fallback():
    payload = {"role": "ML Engineer"}
    
    with patch('app.agents.scrapers.aggregator.MarketAggregator.gather_insights', new_callable=AsyncMock) as mock_gather:
        mock_gather.return_value = {"listings": []}
        
        response = client.post("/api/jobs/scrape", json=payload)
        
        assert response.status_code == 200
        data = response.json()
        assert "Junior ML Engineer" in [job["title"] for job in data["jobs"]]

@pytest.mark.asyncio
async def test_scrape_jobs_error():
    payload = {"role": "Test"}
    
    with patch('app.agents.scrapers.aggregator.MarketAggregator.gather_insights', new_callable=AsyncMock) as mock_gather:
        mock_gather.side_effect = Exception("Scrape failed")
        
        response = client.post("/api/jobs/scrape", json=payload)
        
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "partial"
        assert "error" in data

@pytest.mark.asyncio
async def test_search_jobs_success():
    with patch('app.agents.scrapers.aggregator.MarketAggregator.gather_insights', new_callable=AsyncMock) as mock_gather:
        mock_gather.return_value = {"listings": [{"title": "Search Job"}]}
        
        response = client.get("/api/jobs/search?q=developer")
        
        assert response.status_code == 200
        assert response.json() == [{"title": "Search Job"}]

@pytest.mark.asyncio
async def test_search_jobs_fallback():
    with patch('app.agents.scrapers.aggregator.MarketAggregator.gather_insights', new_callable=AsyncMock) as mock_gather:
        mock_gather.side_effect = Exception("Error")
        
        response = client.get("/api/jobs/search?q=junior")
        
        assert response.status_code == 200
        jobs = response.json()
        assert len(jobs) > 0

@pytest.mark.asyncio
async def test_get_jobs():
    response = client.get("/api/jobs/")
    
    assert response.status_code == 200
    jobs = response.json()
    assert isinstance(jobs, list)
    assert len(jobs) == 4  # MOCK_JOBS count

@pytest.mark.asyncio
async def test_analyze_job_match():
    input_data = {
        "job_description": "Need Python skills",
        "user_skills": ["Python", "JS"]
    }
    
    mock_analysis = {"score": 80, "missing_skills": ["Django"], "advice": "Good"}
    
    with patch('app.services.gemini_client.gemini_client.analyze_gap', new_callable=AsyncMock) as mock_analyze:
        mock_analyze.return_value = mock_analysis
        
        response = client.post("/api/jobs/match", json=input_data)
        
        assert response.status_code == 200
        data = response.json()
        assert data["score"] == 80



# Edge cases
@pytest.mark.asyncio
async def test_scrape_jobs_empty_role():
    payload = {"role": ""}
    
    with patch('app.agents.scrapers.aggregator.MarketAggregator.gather_insights', new_callable=AsyncMock) as mock_gather:
        mock_gather.return_value = {"listings": []}
        
        response = client.post("/api/jobs/scrape", json=payload)
        
        assert response.status_code == 200

@pytest.mark.asyncio
async def test_search_jobs_empty_query():
    response = client.get("/api/jobs/search?q=")
    
    assert response.status_code == 200

@pytest.mark.asyncio
async def test_analyze_job_match_empty_skills():
    input_data = {
        "job_description": "Need coding",
        "user_skills": []
    }
    
    with patch('app.services.gemini_client.gemini_client.analyze_gap', new_callable=AsyncMock) as mock_analyze:
        mock_analyze.return_value = {"score": 0, "missing_skills": ["Everything"], "advice": "Learn"}
        
        response = client.post("/api/jobs/match", json=input_data)
        
        assert response.status_code == 200