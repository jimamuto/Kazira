"""
Test script for Single Pipeline /generate-quick endpoint
Tests the manual skills input flow without CV upload
"""

import requests
import json
from datetime import datetime

BASE_URL = "http://localhost:8000"

def test_generate_quick_roadmap():
    """Test the /api/roadmap/generate-quick endpoint"""
    
    print("=" * 60)
    print("Testing Single Pipeline - Generate Quick Roadmap")
    print("=" * 60)
    
    # Test data matching the frontend form
    test_data = {
        "target_role": "Senior Software Engineer",
        "location": "Kenya",
        "current_status": "intermediate",
        "skills": ["Python", "React", "Docker", "PostgreSQL", "AWS"],
        "timeframe_months": 6,
        "constraints": ["Full-time job", "Limited study hours"]
    }
    
    print("\n📋 Test Input:")
    print(json.dumps(test_data, indent=2))
    
    try:
        print("\n🚀 Sending POST request to /api/roadmap/generate-quick...")
        response = requests.post(
            f"{BASE_URL}/api/roadmap/generate-quick",
            json=test_data,
            headers={"Content-Type": "application/json"},
            timeout=30
        )
        
        print(f"\n📊 Response Status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("\n✅ SUCCESS! Roadmap generation initiated")
            print(f"\n📝 Response:")
            print(json.dumps(result, indent=2))
            
            if "result_id" in result:
                print(f"\n🎯 Result ID: {result['result_id']}")
                print(f"🔗 Frontend would navigate to: /roadmap/result/{result['result_id']}")
                return True
            else:
                print("\n⚠️  Warning: No result_id in response")
                return False
        else:
            print(f"\n❌ FAILED with status {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("\n❌ ERROR: Cannot connect to backend")
        print("Make sure the backend is running on http://localhost:8000")
        return False
    except Exception as e:
        print(f"\n❌ ERROR: {str(e)}")
        return False

def test_backend_health():
    """Check if backend is running"""
    print("\n🔍 Checking backend health...")
    try:
        response = requests.get(f"{BASE_URL}/api/roadmap/history", timeout=5)
        if response.status_code in [200, 404]:  # 404 is ok, means endpoint exists
            print("✅ Backend is running")
            return True
        else:
            print(f"⚠️  Backend returned status {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Backend is not running")
        return False
    except Exception as e:
        print(f"❌ Error checking backend: {str(e)}")
        return False

if __name__ == "__main__":
    print("\n" + "=" * 60)
    print("SINGLE PIPELINE BACKEND TEST")
    print(f"Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)
    
    # Check backend health first
    if not test_backend_health():
        print("\n⚠️  Please start the backend server first:")
        print("   cd c:/Ajira/backend")
        print("   uvicorn app.main:app --reload")
        exit(1)
    
    # Run the main test
    success = test_generate_quick_roadmap()
    
    print("\n" + "=" * 60)
    if success:
        print("✅ ALL TESTS PASSED")
    else:
        print("❌ TESTS FAILED")
    print("=" * 60 + "\n")
    
    exit(0 if success else 1)
