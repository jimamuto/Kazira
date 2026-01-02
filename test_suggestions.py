import asyncio
import sys
import os

# Add backend to path
sys.path.insert(0, 'backend')

from dotenv import load_dotenv
load_dotenv('backend/.env')

# Import the jobs module
from backend.app.api.routes import jobs

async def test_suggestions():
    """Test the suggestion system"""
    print("=" * 60)
    print("Testing Smart Job Suggestions System")
    print("=" * 60)
    print()
    
    # Test with different queries
    test_queries = [
        "engineer",
        "machine learning",
        "data",
        "frontend",
        "ai",
    ]
    
    for query in test_queries:
        print(f"\n🔍 Query: '{query}'")
        suggestions = jobs.get_smart_suggestions(query, limit=5)
        
        if suggestions:
            print(f"   Found {len(suggestions)} suggestions:")
            for i, sugg in enumerate(suggestions, 1):
                print(f"   {i}. {sugg}")
        else:
            print("   ❌ No suggestions found")
    
    print()
    print("=" * 60)
    print(f"Total cached roles: {len(jobs.job_roles_cache)}")
    print("Cache roles:", list(jobs.job_roles_cache))
    print("=" * 60)

if __name__ == "__main__":
    asyncio.run(test_suggestions())
