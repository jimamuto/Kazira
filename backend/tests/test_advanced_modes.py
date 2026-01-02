"""
Advanced Modes Test - Multi-Market, Strategic, and Tournament
Tests the specialized career agent modes
"""

import requests
import json
import time
from datetime import datetime
import sys

BASE_URL = "http://localhost:8000"

def print_section(title):
    """Print a formatted section header"""
    print("\n" + "=" * 70)
    print(f"  {title}")
    print("=" * 70)

def print_log(emoji, message):
    """Print a timestamped log message"""
    timestamp = datetime.now().strftime('%H:%M:%S')
    print(f"[{timestamp}] {emoji} {message}")

def test_multi_market_arbitrage():
    """Test Multi-Market Arbitrage Mode"""
    print_section("TEST 1: MULTI-MARKET ARBITRAGE")
    
    test_data = {
        "career_goal": "Full Stack Developer",
        "primary_market": "Kenya",
        "compare_markets": ["US", "EU", "Canada"],
        "current_status": "intermediate",
        "skills": ["React", "Node.js", "TypeScript"]
    }
    
    print_log("📋", "Input Data:")
    print(json.dumps(test_data, indent=2))
    
    try:
        print_log("🚀", "Sending analysis request...")
        response = requests.post(f"{BASE_URL}/api/multi-market/analyze", json=test_data)
        
        print_log("📊", f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print_log("✅", "Analysis Initiated Successfully")
            print_log("📝", f"Response: {json.dumps(result, indent=2)}")
            
            if "analysis_id" in result and result.get("status") == "completed":
                return True
        else:
            print_log("❌", f"Request Failed: {response.text}")
            
    except Exception as e:
        print_log("❌", f"Error: {e}")
        
    return False

def test_strategic_trajectory():
    """Test Strategic Trajectory Mode"""
    print_section("TEST 2: STRATEGIC TRAJECTORY - 5 YEAR PLAN")
    
    test_data = {
        "target_role": "CTO",
        "start_role": "Senior Developer",
        "current_skills": ["System Design", "Team Leadership", "Cloud Architecture"],
        "years_experience": 5,
        "location": "Kenya"
    }
    
    print_log("📋", "Input Data:")
    print(json.dumps(test_data, indent=2))
    
    try:
        print_log("🚀", "Sending strategic path request...")
        response = requests.post(f"{BASE_URL}/api/strategic/path", json=test_data)
        
        print_log("📊", f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print_log("✅", "Trajectory Generated Successfully")
            print_log("📝", f"Response: {json.dumps(result, indent=2)}")
            
            if "path_id" in result:
                return True
        else:
            print_log("❌", f"Request Failed: {response.text}")
            
    except Exception as e:
        print_log("❌", f"Error: {e}")
        
    return False

def test_tournament_mode():
    """Test Tournament Mode (Competitive Simulation)"""
    print_section("TEST 3: TOURNAMENT MODE")
    
    test_data = {
        "career_goal": "Data Scientist",
        "location": "Remote",
        "current_status": "beginner",
        "skills": ["Python", "Statistics"],
        "constraints": []
    }
    
    print_log("📋", "Input Data:")
    print(json.dumps(test_data, indent=2))
    
    try:
        print_log("🚀", "Starting 4-Agent Simulation...")
        response = requests.post(f"{BASE_URL}/api/tournament/start", json=test_data)
        
        print_log("📊", f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print_log("✅", "Tournament Completed Successfully")
            print_log("🏆", f"Winner Strategy: {result.get('winner_strategy')}")
            print_log("⭐", f"Winner Score: {result.get('winner_score')}")
            print_log("📝", f"Response: {json.dumps(result, indent=2)}")
            
            if "tournament_id" in result:
                return True
        else:
            print_log("❌", f"Request Failed: {response.text}")
            
    except Exception as e:
        print_log("❌", f"Error: {e}")
        
    return False

if __name__ == "__main__":
    print("\n" + "=" * 70)
    print("  ADVANCED MODES TEST SUITE")
    print("  Multi-Market | Strategic | Tournament")
    print("  " + datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
    print("=" * 70)
    
    results = {
        "Multi-Market": test_multi_market_arbitrage(),
        "Strategic": test_strategic_trajectory(),
        "Tournament": test_tournament_mode()
    }
    
    print_section("TEST SUMMARY")
    all_passed = True
    for test, passed in results.items():
        status = "✅ PASSED" if passed else "❌ FAILED"
        print(f"{status} - {test} Mode")
        if not passed:
            all_passed = False
            
    print("\n" + "=" * 70 + "\n")
    sys.exit(0 if all_passed else 1)
