import os
import sys
from dotenv import load_dotenv
from google import genai

load_dotenv('backend/.env')

api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    print("ERROR: GEMINI_API_KEY not found in environment")
    sys.exit(1)

print("Testing Gemini 3 Flash with new google-genai package...")
print(f"API Key: {api_key[:10]}...{api_key[-4:]}")
print()

client = genai.Client(api_key=api_key)

models_to_test = [
    "gemini-3-flash-preview",
    "gemini-3-pro-preview",
]

for model_name in models_to_test:
    try:
        print(f"Testing model: {model_name}")
        response = client.models.generate_content(
            model=model_name,
            contents="Say 'Hello' in one word."
        )
        print(f"SUCCESS: {model_name}")
        print(f"Response: {response.text.strip()}")
        print()
        break
    except Exception as e:
        print(f"FAILED: {model_name}")
        print(f"Error: {e}")
        print()
