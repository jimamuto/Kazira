import pytest
from unittest.mock import AsyncMock, patch
from app.agents.orchestrator import CareerOrchestrator
from app.agents.research_agent import ResearchAgent
from app.agents.planning_agent import PlanningAgent
from app.agents.execution_agent import ExecutionAgent
from app.agents.verification_agent import VerificationAgent

@pytest.mark.asyncio
async def test_research_agent_research():
    agent = ResearchAgent()

    mock_data = {"listings": [{"title": "Job1", "company": "TestCo", "description": "Test"}], "market_trends": [], "salary_range": "$50k-$80k"}

    with patch('app.agents.scrapers.aggregator.MarketAggregator.gather_insights', new_callable=AsyncMock) as mock_gather:
        mock_gather.return_value = mock_data

        result = await agent.research("Developer")

        assert "listings" in result
        assert len(result["listings"]) == 1

@pytest.mark.asyncio
async def test_planning_agent_create_roadmap():
    agent = PlanningAgent()

    mock_data = {"milestones": []}

    with patch('app.services.gemini_client.gemini_client.model.generate_content', new_callable=AsyncMock) as mock_generate:
        mock_generate.return_value = type('MockResponse', (), {'text': '{"milestones": []}'})()

        result = await agent.create_roadmap("Engineer", {"analysis": {"top_skills": []}}, {})

        assert "milestones" in result

@pytest.mark.asyncio
async def test_execution_agent_find_resources():
    agent = ExecutionAgent()

    mock_data = {"suggestions": []}

    with patch('app.services.gemini_client.gemini_client.model.generate_content', new_callable=AsyncMock) as mock_generate:
        mock_generate.return_value = type('MockResponse', (), {'text': '{"suggestions": []}'})()

        result = await agent.find_resources({"milestones": [{"title": "Test", "focus": ["Python"]}]})

        assert isinstance(result, list)

@pytest.mark.asyncio
async def test_verification_agent_verify_skills():
    agent = VerificationAgent()

    with patch('app.services.gemini_client.gemini_client.model.generate_content', new_callable=AsyncMock) as mock_generate:
        mock_generate.return_value = type('MockResponse', (), {'text': '{"questions": []}'})()

        result = await agent.verify_skills({"milestones": [{}]})
        result2 = await agent.verify_skills({"milestones": [{}]})  # Second call for mock interview

        assert "quiz" in result
        assert "mock_interview" in result

@pytest.mark.asyncio
async def test_orchestrator_init():
    orchestrator = CareerOrchestrator("user", "goal", "Global")

    assert orchestrator.user_id == "user"
    assert orchestrator.career_goal == "goal"
    assert "research" in orchestrator.agents
    assert "planning" in orchestrator.agents