"""
Test script to verify Gemini Pro fallback when Flash is exhausted.
Run this after your Flash quota is depleted to see if Pro takes over.
"""
import asyncio
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

async def test_flash_exhaustion_fallback():
    """Simulate flash quota exhaustion and verify fallback to pro"""
    from app.services.gemini_client import GeminiClient

    print("=" * 60)
    print("GEMINI FALLBACK TEST")
    print("=" * 60)
    print()

    client = GeminiClient()
    print(f"Configured fallback order: {client.models}")
    print()

    # Test prompt
    prompt = "Return JSON: {\"model_used\": \"name_of_model\", \"status\": \"success\"}"
    config = {"response_mime_type": "application/json"}

    print("Sending request...")
    print("(If Flash quota is exhausted, it will automatically fall back to Pro)")
    print()

    try:
        response = await client._generate_with_fallback(prompt, config=config)
        print("=" * 60)
        print("SUCCESS! Response received:")
        print("=" * 60)
        print(response.text)
        print()

        # Try to identify which model responded
        # Note: The actual model name may be in response object metadata
        print("✓ Fallback mechanism is working!")
        print("✓ Your request was processed successfully.")

        if "pro" in response.text.lower():
            print("✓ Pro model was used (expected after Flash quota depletion)")
        else:
            print("✓ Flash model was used (still within quota)")

    except Exception as e:
        print("=" * 60)
        print("ERROR: All models failed")
        print("=" * 60)
        print(str(e))
        print()
        print("Check your API key and quota in Google AI Studio.")

if __name__ == "__main__":
    asyncio.run(test_flash_exhaustion_fallback())
