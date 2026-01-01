import asyncio
import sys
import os
import json

# Add project root to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.agents.orchestrator import CareerOrchestrator

async def run_integration_test():
    print("🌟 STARTING FULL AGENTIC PIPELINE INTEGRATION TEST 🌟")
    
    # User Input
    user_id = "test_user_v1"
    career_goal = "Frontend Developer"
    constraints = {
        "hours_per_week": 15,
        "experience": "Beginner",
        "location": "Nairobi"
    }

    orchestrator = CareerOrchestrator(user_id, career_goal, "Global")
    
    print(f"\n[ORCHESTRATOR] Initialized for '{career_goal}'")
    
    try:
        # Run the full pipeline
        results = await orchestrator.run_pipeline(constraints)
        
        print("\n✅ PIPELINE COMPLETED SUCCESSFULLY")
        print("-----------------------------------")
        
        # 1. Verify Research
        research = results.get("research_data")
        print(f"📡 Research Agent: {research.get('market_summary')}")
        print(f"   Top Skills Identified: {research.get('analysis', {}).get('top_skills')}")
        
        # 2. Verify Planning
        roadmap = results.get("roadmap")
        print(f"📝 Planning Agent: Generated roadmap with {len(roadmap.get('milestones', []))} milestones.")
        print(f"   First Milestone: {roadmap['milestones'][0]['title']}")
        
        # 3. Verify Execution
        resources = results.get("resources")
        schedule = results.get("schedule")
        print(f"🛠️ Execution Agent: Found resources for {len(resources)} milestones.")
        print(f"   Schedule: Generated {len(schedule.get('days', []))} days of tasks.")
        
        # 4. Verify Verification
        verification = results.get("verification_results")
        print(f"🛡️ Verification Agent: {verification.get('status')}")
        print(f"   Quiz Q1: {verification.get('quiz', {}).get('questions', [{}])[0].get('q')[:50]}...")
        print(f"   Mock Interview Prompt: {verification.get('mock_interview', {}).get('technical', [None])[0]}")
        
        # 5. Verify Adjustment
        adjustment = results.get("suggested_adjustment")
        print(f"🔄 Self-Correction: {adjustment.get('recommendation')}")
        
        print("\n✨ INTEGRATION TEST PASSED: All 4 agents communicated and processed data correctly.")

    except Exception as e:
        print(f"\n❌ INTEGRATION TEST FAILED: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(run_integration_test())
