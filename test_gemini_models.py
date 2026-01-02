import os
import sys
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    print("ERROR: GEMINI_API_KEY not found in environment")
    sys.exit(1)

genai.configure(api_key=api_key)

print("🔍 Listing available Gemini models...")
print()

models = genai.list_models()
flash_models = []
pro_models = []
other_models = []

for m in models:
    if 'generateContent' in m.supported_generation_methods:
        name = m.name.replace('models/', '')
        if 'flash' in name.lower():
            flash_models.append(name)
        elif 'pro' in name.lower():
            pro_models.append(name)
        else:
            other_models.append(name)

print("🚀 Flash Models (Fast, cost-effective):")
for m in sorted(flash_models):
    print(f"   - {m}")

print()
print("💎 Pro Models (Higher quality):")
for m in sorted(pro_models):
    print(f"   - {m}")

print()
print("📋 Other Models:")
for m in sorted(other_models)[:10]:
    print(f"   - {m}")

print()
print("=" * 60)
print()

if flash_models:
    print("✅ Testing Gemini Flash model...")
    test_model = sorted(flash_models)[0]
    try:
        model = genai.GenerativeModel(f"models/{test_model}")
        response = model.generate_content("Say 'Hello' in one word.")
        print(f"✅ Model '{test_model}' works!")
        print(f"   Response: {response.text.strip()}")
    except Exception as e:
        print(f"❌ Model '{test_model}' failed: {e}")
