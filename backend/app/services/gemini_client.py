import google.generativeai as genai
import json
from app.core.config import settings
from app.schemas.roadmap import RoadmapInput, RoadmapOutput

class GeminiClient:
    def __init__(self):
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.model = genai.GenerativeModel('gemini-3-flash-preview') 

    def list_available_models(self):
        return [m.name for m in genai.list_models() if 'generateContent' in m.supported_generation_methods]

    async def generate_roadmap(self, input_data: RoadmapInput) -> RoadmapOutput:
        system_prompt = """
        You are a Senior Technical Career Coach for the global tech ecosystem.
        Your goal is to engineer a high-precision, actionable career roadmap.

        CRITICAL OUTPUT REQUIREMENTS:
        1. **Resources**: Must include specific, real-world study materials.
            - Mix of **Free** (Docs, YouTube, OS Projects) and **Paid** (Udemy, Coursera) options.
            - Provide valid URLs or highly specific search terms.
        2. **Tasks**: Break milestones into granular, trackable TO-DO items (e.g., "Complete React Tutorial Ch 1-5").
        3. **Detailed Guides**: For each month, write a mini "How-To" guide (Markdown) explaining the focus areas, why they matter, and how to start.
        4. **Global Context**: Consider the user's location and provide relevant local tech communities, industry trends, and regional opportunities.
        5. **Projects**: Suggest projects that solve real problems applicable to the user's region and industry.

        Output ONLY valid JSON matching the schema.
        """
        
        user_prompt = f"""
        Profile:
        - Location: {input_data.location}
        - Status: {input_data.current_status}
        - Role: {input_data.target_role}
        - Current Skills: {', '.join(input_data.skills)}
        - Constraints: {', '.join(input_data.constraints)}
        - Allocation Strategy: {input_data.timeframe_months} Months ({'Rapid Sprint' if input_data.timeframe_months < 5 else 'Deep Strategic'})

        Generate a JSON response with this structure:
        {{
            "summary": "High-level strategy summary...",
            "months": [
                {{
                    "month": 1,
                    "title": "Milestone Title",
                    "skills": ["Skill 1", "Skill 2"],
                    "tasks": ["Specific Task 1", "Specific Task 2"],
                    "projects": ["Project Idea 1"],
                    "detailed_guide": "## Focus Area\\nExplain the core concepts...",
                    "resources": [
                        {{
                            "name": "Resource Name",
                            "url": "https://...",
                            "type": "video" | "course" | "article",
                            "cost": "Free" | "Paid",
                            "description": "Why this resource?",
                            "is_local": boolean,
                            "thumbnail_url": "Highly specific placeholder image URL or 'https://img.youtube.com/vi/[VIDEO_ID]/0.jpg' if video"
                        }}
                    ]
                }}
            ],
            "additional_info": "A 2-3 sentence personalized closing advice. Must reference their specific constraints (e.g. data limits, time) and their unique skill advantage (e.g. 'Your background in X is a massive asset because...'). Consider their location and suggest relevant local tech communities or industry opportunities."
        }}
        """
        
        try:
            response = await self.model.generate_content_async(
                f"{system_prompt}\n\n{user_prompt}",
                generation_config={"response_mime_type": "application/json"}
            )
            data = json.loads(response.text)
            return RoadmapOutput(**data)
        except Exception as e:
            # Fallback/Error handling for MVP
            print(f"Error calling Gemini: {e}")
            raise e

    async def analyze_gap(self, job_description: str, user_skills: list[str]) -> dict:
        system_prompt = """
        You are a Technical Recruiter AI Agent.
        Your task: Analyze the gap between a candidate's skills and a job description.
        
        RULES:
        1. **Semantic Matching**: Understand that "Postgres" experience applies to "SQL" or "Supabase" roles (give partial credit).
        2. **Harsh but Fair**: If they miss a critical requirement (e.g., "Must have AWS"), penalize score.
        3. **Output JSON**: Return a strict JSON object.
        
        Output JSON Structure:
        {
            "score": Integer (0-100),
            "missing_skills": [List of strings - specific tools/concepts missing],
            "advice": "1 short sentence on what to learn next."
        }
        """

        user_prompt = f"""
        Job Description:
        "{job_description}"

        Candidate Skills:
        {json.dumps(user_skills)}
        
        Analyze now. Return ONLY JSON.
        """

        try:
            response = await self.model.generate_content_async(
                f"{system_prompt}\n\n{user_prompt}",
                generation_config={"response_mime_type": "application/json"}
            )
            return json.loads(response.text)
        except Exception as e:
            print(f"Error calling Gemini Gap Analysis: {e}")
            # Fallback to a safe mock response on error
            return {
                "score": 50,
                "missing_skills": ["Error analyzing match"],
                "advice": "Please try again later."
            }

gemini_client = GeminiClient()
