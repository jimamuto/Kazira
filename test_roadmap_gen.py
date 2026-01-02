import asyncio
import os
from dotenv import load_dotenv
from google import genai
import json

load_dotenv('backend/.env')

async def test_roadmap_generation():
    """Test roadmap generation with Gemini 3 Flash"""
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("ERROR: GEMINI_API_KEY not found")
        return
    
    client = genai.Client(api_key=api_key)
    
    print("=" * 60)
    print("Testing Gemini 3 Flash for Roadmap Generation")
    print("=" * 60)
    print()
    
    prompt = """Create a 3-month roadmap for someone who wants to become an AI Engineer in Kenya.
    
    Return JSON:
    {
      "summary": "Brief overview",
      "months": [
        {
          "month": 1,
          "title": "Month 1: Foundation",
          "skills": ["skill1", "skill2"],
          "tasks": ["task1", "task2"],
          "projects": ["project1"],
          "detailed_guide": "Guide text",
          "resources": []
        }
      ],
      "additional_info": "Tips"
    }"""
    
    try:
        print("Sending request to gemini-3-flash-preview...")
        response = client.models.generate_content(
            model="gemini-3-flash-preview",
            contents=prompt,
            config={
                "temperature": 0.7,
                "response_mime_type": "application/json"
            }
        )
        
        print("Response received!")
        print(f"Status: Success")
        print(f"Response length: {len(response.text)} characters")
        print()
        print("=" * 60)
        print("Response:")
        print("=" * 60)
        print(response.text[:1000])
        print("...")
        
        # Try to parse as JSON
        data = json.loads(response.text)
        print()
        print("JSON parsed successfully!")
        print(f"Number of months: {len(data.get('months', []))}")
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_roadmap_generation())
