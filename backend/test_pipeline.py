import asyncio
import logging
import sys
from pathlib import Path

# Add backend directory to sys.path
backend_dir = Path(__file__).parent
sys.path.append(str(backend_dir))

from app.agents.orchestrator import CareerOrchestrator

async def main():
    logging.basicConfig(level=logging.INFO)
    print("--- Starting Career Agent Pipeline Test ---")
    
    user_id = "test_user_001"
    goal = "Senior AI Engineer (Gemini Specialist)"
    
    orchestrator = CareerOrchestrator(user_id=user_id, career_goal=goal, location="Global")
    
    try:
        final_context = await orchestrator.run_pipeline()
        print("\n--- Pipeline Success! ---")
        print(f"Goal: {final_context['goal']}")
        print(f"Research Listings Found: {len(final_context['research_data']['listings'])}")
        print(f"Roadmap Milestones: {len(final_context['roadmap']['milestones'])}")
        print(f"Resources Aggregated: {len(final_context['resources'])}")
        print(f"Verification Score: {final_context['verification_results']['overall_score']}")
        
    except Exception as e:
        print(f"\n--- Pipeline Failed! ---")
        print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(main())
