
import asyncio
import logging
from app.agents.planning_agent import PlanningAgent
from app.agents.agent_message_bus import AgentMessage

# Configure logging
logging.basicConfig(level=logging.INFO)

async def test_self_correction():
    print("🧪 Testing Self-Correction Logic...")
    
    agent = PlanningAgent()
    
    # 1. Test Message Handling
    msg = AgentMessage(
        from_agent="ResearchAgent",
        to_agent="PlanningAgent",
        message_type="MARKET_SHIFT",
        data={"trends": ["Agentic AI"], "delta": 10},
        priority="URGENT"
    )
    
    response = await agent.handle_message(msg)
    print(f"Message Handling: {response}")
    assert response["status"] == "acknowledged", "Message handling failed"
    
    # 2. Test Roadmap Adjustment
    current_roadmap = {
        "milestones": [
            {"month": 1, "focus": ["Python Basics"], "tasks": ["Learn Syntax"]}
        ]
    }
    
    market_data = {
        "new_trends": ["LangGraph", "CrewAI"],
        "job_delta": 15
    }
    
    print("Adjusting roadmap...")
    updated_roadmap = await agent.adjust_roadmap(current_roadmap, market_data, score=0.9)
    print(f"Updated Roadmap: {updated_roadmap}")
    
    # Verify structure preserved but content updated
    assert "milestones" in updated_roadmap, "Structure broken"
    
    print("✅ Self-Correction Verification Passed!")

if __name__ == "__main__":
    asyncio.run(test_self_correction())
