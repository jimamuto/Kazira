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
        You are a Senior Technical Career Coach for the Kenyan tech ecosystem.
        Your goal is to engineer a high-precision, actionable career roadmap.

        CRITICAL OUTPUT REQUIREMENTS:
        1. **Resources**: Must include specific, real-world study materials.
           - Mix of **Free** (Docs, YouTube, OS Projects) and **Paid** (Udemy, Coursera) options.
           - Provide valid URLs or highly specific search terms.
        2. **Tasks**: Break milestones into granular, trackable TO-DO items (e.g., "Complete React Tutorial Ch 1-5").
        3. **Detailed Guides**: For each month, write a mini "How-To" guide (Markdown) explaining the focus areas, why they matter, and how to start.
        4. **Local Context**: Heavily prioritize Kenyan/African context (local hubs, M-Pesa integration ideas, vibrant local communities).
        5. **Projects**: Suggest projects that solve real problems (e.g., "SMS-based inventory system", "Matatu route optimizer").

        Output ONLY valid JSON matching the schema.
        """
        
        user_prompt = f"""
        Profile:
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
                            "type": "Course/Article/Video",
                            "cost": "Free" | "Paid",
                            "description": "Why this resource?",
                            "is_local": boolean
                        }}
                    ]
                }}
            ],
            "additional_info": "Final mentor advice..."
        }}
        """
        
        try:
            response = self.model.generate_content(
                f"{system_prompt}\n\n{user_prompt}",
                generation_config={"response_mime_type": "application/json"}
            )
            data = json.loads(response.text)
            return RoadmapOutput(**data)
        except Exception as e:
            # Fallback/Error handling for MVP
            print(f"Error calling Gemini: {e}")
            raise e

gemini_client = GeminiClient()
