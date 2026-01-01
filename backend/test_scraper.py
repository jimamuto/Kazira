import asyncio
import sys
import os

# Add the project root to sys.path for imports to work
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.agents.scrapers.aggregator import MarketAggregator

async def test_search():
    print("🚀 Initializing MarketAggregator...")
    aggregator = MarketAggregator()
    
    query = "Backend Developer"
    location = "Nairobi"
    
    print(f"🔍 Searching for '{query}' in '{location}'...")
    try:
        results = await aggregator.gather_insights(query, location)
        
        listings = results.get("listings", [])
        trends = results.get("market_trends", [])
        
        print("\n--- RESULTS ---")
        print(f"✅ Found {len(listings)} jobs.")
        
        for i, job in enumerate(listings[:3]):
            print(f"[{i+1}] {job.get('title')} at {job.get('company')} ({job.get('location')})")
        
        print(f"\n📈 Market Trends: {trends}")
        print(f"💰 Salary Insight: {results.get('salary_range')}")
        
        if len(listings) > 0:
            print("\n✨ TEST PASSED: Research Agent returned active results.")
        else:
            print("\n⚠️ TEST COMPLETED: No live results found (Scraper might be blocked or no jobs match), check LinkedIn logs.")
            
    except Exception as e:
        print(f"\n❌ TEST FAILED: {str(e)}")

if __name__ == "__main__":
    asyncio.run(test_search())
