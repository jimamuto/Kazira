import asyncio
import os
import sys

# Add backend directory to sys.path to allow imports
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.services.gemini_client import GeminiClient
from app.schemas.roadmap import RoadmapInput
from app.core.config import settings

async def test_generation():
    print("🚀 Testing Gemini Client Roadmap Generation...")
    
    if not settings.GEMINI_API_KEY:
        print("❌ CRITICAL: GEMINI_API_KEY is missing in settings!")
    else:
        print(f"🔑 API Key found: {settings.GEMINI_API_KEY[:4]}...{settings.GEMINI_API_KEY[-4:]}")

    client = GeminiClient()
    print(f"📋 Configured Models in Client: {client.models}")
    
    print("🔎 Listing Available Models from Google API...")
    try:
        available = client.list_available_models()
        print(f"✅ Available Models: {available}")
    except Exception as e:
        print(f"❌ Failed to list models: {e}")
    
    input_data = RoadmapInput(
        target_role="AI Engineer",
        current_status="Intermediate",
        skills=["Python", "TensorFlow"],
        location="Kenya",
        timeframe_months=6,
        constraints=["Part-time"],
        skill_level="Intermediate",
        hours_per_week=20
    )
    
    try:
        # We want to see if it calls the API successfully
        # The generate_roadmap method has a try-except block that swallows errors and falls back.
        # To debug, we might need to modify the client or inspect the output carefully.
        # But wait, generate_roadmap returns mock data on error. 
        # So if we get mock data, we know it failed.
        # BUT we won't see the error message because it is printed to stdout in the app.
        
        # Let's try to call the internal _generate_with_fallback directly to see the error?
        # No, that's private.
        
        # We will rely on stdout capture of the test script to see the "⚠️ AI generation failed: ..." message
        # printed by the client.
        
        result = await client.generate_roadmap(input_data)
        
        print("\n✅ Result Recieved")
        # Check if it looks generic
        if "Month 1: Foundation" in result.months[0].title and "Complete 5 hours" in result.months[0].tasks[0]:
             print("❌ FAILED: Returned Generic Mock Data")
        else:
             print("✅ SUCCESS: Returned AI Generated Data")
             print(f"Summary: {result.summary[:100]}...")
             
    except Exception as e:
        print(f"❌ CRITICAL ERROR: {e}")

if __name__ == "__main__":
    asyncio.run(test_generation())
