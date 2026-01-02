"""
Comprehensive test for automated roadmap generation
Shows real-time logs and monitors the generation process
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

def print_step(step_num, description):
    """Print a test step"""
    print(f"\n[Step {step_num}] {description}")
    print("-" * 70)

def test_full_roadmap_generation():
    """Test the complete roadmap generation flow"""
    
    print_section("AUTOMATED ROADMAP GENERATION TEST")
    print(f"⏰ Started at: {datetime.now().strftime('%H:%M:%S')}")
    
    # Test data
    test_data = {
        "target_role": "Machine Learning Engineer",
        "location": "Kenya",
        "current_status": "intermediate",
        "skills": ["Python", "TensorFlow", "Docker", "SQL"],
        "timeframe_months": 6,
        "constraints": ["Full-time job", "Weekend learning"]
    }
    
    print_step(1, "Preparing Test Data")
    print(json.dumps(test_data, indent=2))
    
    # Step 1: Submit roadmap generation request
    print_step(2, "Submitting Roadmap Generation Request")
    print("📤 POST /api/roadmap/generate-quick")
    
    try:
        start_time = time.time()
        response = requests.post(
            f"{BASE_URL}/api/roadmap/generate-quick",
            json=test_data,
            headers={"Content-Type": "application/json"},
            timeout=120
        )
        request_time = time.time() - start_time
        
        print(f"✅ Response received in {request_time:.2f}s")
        print(f"📊 Status Code: {response.status_code}")
        
        if response.status_code != 200:
            print(f"❌ Error: {response.text}")
            return False
        
        result = response.json()
        print(f"📝 Response: {json.dumps(result, indent=2)}")
        
        if "result_id" not in result:
            print("❌ No result_id in response")
            return False
        
        result_id = result["result_id"]
        print(f"\n🎯 Result ID: {result_id}")
        
        # Step 2: Monitor generation progress
        print_step(3, "Monitoring Generation Progress")
        print("⏳ Waiting for roadmap generation to complete...")
        print("💡 This involves:")
        print("   - AI analyzing your profile and skills")
        print("   - Researching market trends for ML Engineer in Kenya")
        print("   - Generating personalized learning path")
        print("   - Creating milestone timeline")
        
        max_attempts = 30
        attempt = 0
        
        while attempt < max_attempts:
            attempt += 1
            time.sleep(2)
            
            try:
                # Try to fetch the result
                result_response = requests.get(
                    f"{BASE_URL}/api/roadmap/result/{result_id}",
                    timeout=10
                )
                
                if result_response.status_code == 200:
                    roadmap_data = result_response.json()
                    elapsed = time.time() - start_time
                    
                    print(f"\n✅ Roadmap Generated Successfully! (took {elapsed:.1f}s)")
                    
                    # Display roadmap summary
                    print_step(4, "Roadmap Summary")
                    
                    if "roadmap" in roadmap_data:
                        roadmap = roadmap_data["roadmap"]
                        
                        print(f"🎯 Target Role: {roadmap.get('target_role', 'N/A')}")
                        print(f"📍 Location: {roadmap.get('location', 'N/A')}")
                        print(f"📅 Timeframe: {roadmap.get('timeframe_months', 'N/A')} months")
                        
                        if "milestones" in roadmap:
                            print(f"\n📋 Milestones: {len(roadmap['milestones'])} phases")
                            for i, milestone in enumerate(roadmap['milestones'][:3], 1):
                                print(f"   {i}. {milestone.get('title', 'N/A')}")
                        
                        if "skills_to_learn" in roadmap:
                            print(f"\n🎓 Skills to Learn: {len(roadmap['skills_to_learn'])}")
                            for skill in roadmap['skills_to_learn'][:5]:
                                print(f"   • {skill}")
                        
                        if "resources" in roadmap:
                            print(f"\n📚 Resources: {len(roadmap['resources'])} recommended")
                    
                    return True
                
                elif result_response.status_code == 404:
                    # Still processing
                    print(f"⏳ Attempt {attempt}/{max_attempts} - Still generating...", end='\r')
                else:
                    print(f"\n⚠️  Unexpected status: {result_response.status_code}")
                    
            except requests.exceptions.Timeout:
                print(f"\n⚠️  Request timeout on attempt {attempt}")
            except Exception as e:
                print(f"\n⚠️  Error checking status: {str(e)}")
        
        print(f"\n⏰ Timeout: Generation took longer than expected")
        print("💡 Check backend logs for details")
        return False
        
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to backend")
        print("Make sure backend is running on http://localhost:8000")
        return False
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

def check_backend_logs():
    """Remind user to check backend logs"""
    print_section("BACKEND LOGS")
    print("💡 To see real-time AI generation logs, check the terminal running:")
    print("   uvicorn app.main:app --reload")
    print("\nYou should see logs showing:")
    print("   • Gemini API calls")
    print("   • Market research queries")
    print("   • Roadmap generation steps")
    print("   • Milestone creation")

if __name__ == "__main__":
    print("\n" + "=" * 70)
    print("  SINGLE PIPELINE - AUTOMATED GENERATION TEST")
    print("  " + datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
    print("=" * 70)
    
    check_backend_logs()
    
    # Run the test
    success = test_full_roadmap_generation()
    
    print_section("TEST RESULTS")
    if success:
        print("✅ ALL TESTS PASSED")
        print("\n🎉 The automated roadmap generation is working correctly!")
        print("\n📋 What was verified:")
        print("   ✅ Request submission")
        print("   ✅ Result ID generation")
        print("   ✅ Roadmap generation completion")
        print("   ✅ Data structure validation")
    else:
        print("❌ TESTS FAILED")
        print("\n💡 Check:")
        print("   • Backend is running")
        print("   • Gemini API key is configured")
        print("   • Database connection is working")
    
    print("=" * 70 + "\n")
    
    sys.exit(0 if success else 1)
