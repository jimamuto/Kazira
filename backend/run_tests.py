"""
Test Suite Runner for Kazira Backend
Runs all roadmap generation tests
"""

import sys
import subprocess
from pathlib import Path

def run_test(test_file, description):
    """Run a single test file and report results"""
    print(f"\n{'='*70}")
    print(f"Running: {description}")
    print(f"File: {test_file}")
    print('='*70)
    
    try:
        result = subprocess.run(
            [sys.executable, test_file],
            capture_output=False,
            text=True,
            cwd=Path(__file__).parent
        )
        return result.returncode == 0
    except Exception as e:
        print(f"❌ Error running test: {e}")
        return False

def main():
    """Run all tests in sequence"""
    print("\n" + "="*70)
    print("KAZIRA BACKEND TEST SUITE")
    print("="*70)
    
    tests = [
        ("tests/test_single_pipeline.py", "Single Pipeline - Manual Skills Input"),
        ("tests/test_automated_generation.py", "Automated Roadmap Generation - Real AI"),
        ("tests/test_marathon_agent.py", "Marathon Agent - Autonomous Cycle"),
        ("tests/test_advanced_modes.py", "Advanced Modes - Multi-Market, Strategic, Tournament"),
    ]
    
    results = {}
    for test_file, description in tests:
        results[description] = run_test(test_file, description)
    
    # Print summary
    print("\n" + "="*70)
    print("TEST SUMMARY")
    print("="*70)
    
    passed = sum(1 for r in results.values() if r)
    total = len(results)
    
    for test_name, passed_test in results.items():
        status = "✅ PASSED" if passed_test else "❌ FAILED"
        print(f"{status} - {test_name}")
    
    print("\n" + "="*70)
    print(f"Results: {passed}/{total} tests passed")
    print("="*70 + "\n")
    
    return 0 if passed == total else 1

if __name__ == "__main__":
    sys.exit(main())
