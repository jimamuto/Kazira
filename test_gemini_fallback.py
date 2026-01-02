import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

import asyncio
from app.services.gemini_client import GeminiClient

async def test_gemini_fallback():
    print("=" * 60)
    print("Testing Gemini Client Fallback to Pro")
    print("=" * 60)

    client = GeminiClient()
    print(f"Configured models in fallback order: {client.models}")
    print()

    test_prompt = "Return a JSON object with a single key 'test' set to 'success'. Return ONLY JSON."

    print("Attempting to generate content with fallback...")
    print("(This will try flash first, then fall back to pro if needed)")
    print()

    try:
        response = await client._generate_with_fallback(
            test_prompt,
            config={"response_mime_type": "application/json"}
        )
        print("=" * 60)
        print("SUCCESS! Response received:")
        print("=" * 60)
        print(response.text)
        print()

        import json
        data = json.loads(response.text)
        if data.get('test') == 'success':
            print("✓ Fallback is working correctly!")
            print(f"✓ Model used: {response.model.name if hasattr(response, 'model') else 'Unknown'}")

    except Exception as e:
        print("=" * 60)
        print("FAILED! All models failed:")
        print("=" * 60)
        print(str(e))

if __name__ == "__main__":
    asyncio.run(test_gemini_fallback())
