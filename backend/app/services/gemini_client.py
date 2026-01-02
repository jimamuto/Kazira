import os
from google import genai
import json
from typing import List, Dict, Any
from app.core.config import settings
from app.schemas.roadmap import RoadmapInput, RoadmapOutput

class GeminiClient:
    def __init__(self):
        self.client = genai.Client(api_key=settings.GEMINI_API_KEY)
        self.models = [
            'gemini-3-flash-preview',
            'gemini-3-pro-preview',
        ]

    async def _generate_with_fallback(self, prompt, config=None, models=None):
        if models is None:
            models = self.models
        
        last_error = None
        for model_name in models:
            try:
                print(f"[*] Trying model: {model_name}...")
                response = self.client.models.generate_content(
                    model=model_name,
                    contents=prompt,
                    config=config or {}
                )
                return response
            
            except Exception as e:
                print(f"[!] Model {model_name} failed: {e}")
                last_error = e
                continue
        
        raise Exception(f"All models failed. Last error: {last_error}")

    async def generate_content_async(self, prompt, generation_config=None):
        return await self._generate_with_fallback(prompt, config=generation_config)

    async def generate_content(self, prompt, generation_config=None):
        return await self._generate_with_fallback(prompt, config=generation_config)

    async def generate_roadmap(self, input_data: RoadmapInput) -> RoadmapOutput:
        """Generate a personalized career roadmap using Gemini AI"""
        print(f"[*] Generating AI roadmap for {input_data.target_role} in {input_data.location}")
        
        prompt = f"""You are an expert career advisor and learning path designer. Create a detailed, personalized {input_data.timeframe_months}-month roadmap for someone who wants to become a {input_data.target_role}.

**User Profile:**
- Target Role: {input_data.target_role}
- Location: {input_data.location}
- Current Status: {input_data.current_status}
- Current Skills: {', '.join(input_data.skills) if input_data.skills else 'None specified'}
- Timeframe: {input_data.timeframe_months} months
- Constraints: {', '.join(input_data.constraints) if input_data.constraints else 'None'}

**Requirements:**
1. Create a month-by-month breakdown with specific, actionable tasks
2. Recommend skills to learn in priority order
3. Suggest real projects to build
4. Include resources (courses, docs, communities) relevant to {input_data.location}
5. Provide detailed weekly plans for each month
6. Consider the local job market in {input_data.location}

**Output Format (JSON):**
{{
  "summary": "Brief overview of the roadmap",
  "months": [
    {{
      "month": 1,
      "title": "Month 1: Foundation",
      "skills": ["skill1", "skill2"],
      "tasks": ["task1", "task2"],
      "projects": ["project1"],
      "detailed_guide": "Markdown formatted detailed guide",
      "resources": [
        {{
          "name": "Resource Name",
          "url": "https://...",
          "type": "course|documentation|community",
          "cost": "Free|Paid",
          "description": "Brief description",
          "is_local": true|false,
          "thumbnail_url": ""
        }}
      ]
    }}
  ],
  "additional_info": "Tips and advice"
}}

Generate a comprehensive, realistic roadmap."""

        try:
            response = await self.generate_content_async(
                prompt,
                generation_config={
                    "temperature": 0.7,
                    "response_mime_type": "application/json"
                }
            )
            
            response_text = response.text if hasattr(response, 'text') and response.text else str(response)
            if not response_text:
                raise ValueError("Empty response from AI")
            
            roadmap_data = json.loads(response_text)
            
            # Handle case where AI returns a list instead of dict
            if isinstance(roadmap_data, list):
                print("⚠️ AI returned a list, expected dict, trying to fix...")
                if len(roadmap_data) > 0 and isinstance(roadmap_data[0], dict):
                    roadmap_data = roadmap_data[0]
                else:
                    raise ValueError("AI returned invalid data structure")
            
            # Validate structure
            if not isinstance(roadmap_data, dict):
                raise ValueError(f"AI returned {type(roadmap_data).__name__}, expected dict")
            
            if not roadmap_data.get("months"):
                print("⚠️ AI returned empty months list, forcing mock fallback")
                raise ValueError("AI returned empty roadmap structure")

            print(f"✅ AI roadmap generated successfully with {len(roadmap_data.get('months', []))} months")
            
            return RoadmapOutput(**roadmap_data)
            
        except Exception as e:
            print(f"⚠️ AI generation failed: {e}, falling back to mock data")
            return self._create_mock_roadmap(input_data)

    async def analyze_gap(self, job_description: str, user_skills: List[str]) -> dict:
        """Analyzes the gap between a job description and user skills."""
        prompt = f"""
        Compare these user skills: {', '.join(user_skills)}
        Against this Job Description:
        {job_description[:2000]}
        
        Return JSON:
        {{
            "score": 0-100,
            "missing_skills": ["list"],
            "advice": "1 sentence advice"
        }}
        """
        try:
            response = await self.generate_content_async(
                prompt, 
                generation_config={"response_mime_type": "application/json"}
            )
            response_text = response.text if hasattr(response, 'text') and response.text else str(response)
            if not response_text:
                raise ValueError("Empty response from AI")
            return json.loads(response_text)
        except Exception as e:
            print(f"Gap analysis failed: {e}")
            return {"score": 0, "missing_skills": [], "advice": "Analysis failed"}

    def _create_mock_roadmap(self, input_data: RoadmapInput) -> RoadmapOutput:
        months = []
        current_skills = input_data.skills if input_data.skills else []

        for i in range(1, min(input_data.timeframe_months + 1, 13)):
            months.append({
                "month": i,
                "title": f"Month {i}: {'Foundation' if i == 1 else 'Development' if i == 2 else 'Projects' if i == 3 else 'Advanced'}",
                "skills": current_skills[:5] if current_skills else ["Python", "JavaScript", "Git"],
                "tasks": [
                    f"Complete {i*5} hours of learning",
                    f"Build practice exercise",
                    f"Study documentation",
                    "Join coding community"
                ],
                "projects": [f"Project {i}", "Portfolio", "Practice App"],
                "detailed_guide": f"""## Month {i}

**Goal**: Build your skills as {input_data.target_role}

**Weekly Plan**:
- Week 1-2: Core concepts
- Week 3-4: Hands-on practice

**Actions**:
1. Set up development environment
2. Follow structured learning path
3. Build small projects
4. Document your progress

**Tips**:
- Code daily, even if just 1 hour
- Join {input_data.location} tech communities
- Network with other learners""",
                "resources": [
                    {"name": "FreeCodeCamp", "url": "https://freecodecamp.org", "type": "course", "cost": "Free", "description": "Full curriculum", "is_local": False, "thumbnail_url": ""},
                    {"name": "MDN Docs", "url": "https://developer.mozilla.org", "type": "documentation", "cost": "Free", "description": "Reference docs", "is_local": False, "thumbnail_url": ""},
                ]
            })

        return RoadmapOutput(
            summary=f"A {input_data.timeframe_months}-month personalized roadmap to become a {input_data.target_role}. Starting from your current level, you'll build practical skills through structured learning and hands-on projects.",
            months=months,
            additional_info=f"Focus on consistent daily practice. Your background in {', '.join(current_skills) if current_skills else 'tech fundamentals'} will help accelerate your learning. Join {input_data.location} tech communities for networking and mentorship."
        )

gemini_client = GeminiClient()
