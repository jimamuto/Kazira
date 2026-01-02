import logging
import json
from typing import Dict, Any, List
from app.services.gemini_client import gemini_client

class VerificationAgent:
    """
    Generates assessments, mock interviews, and adjusts roadmaps based on performance.
    """
    
    def __init__(self):
        self.name = "VerificationAgent"

    async def verify_project_repo(self, repo_url: str, requirements: List[str]) -> Dict[str, Any]:
        """
        EXTRAORDINARY: Autonomous Code Vibe Check
        Verifies if a user's GitHub repo matches the roadmap requirements.
        Uses Gemini to reason over code structure (README, package.json).
        """
        logging.info(f"🕵️ VerificationAgent: Auditing repo {repo_url}")
        
        try:
            import httpx
            # Convert normal URL to raw content URL for README
            # Example: https://github.com/user/repo -> https://raw.githubusercontent.com/user/repo/main/README.md
            
            # Simple heuristic for main/master branch
            base_url = repo_url.replace("github.com", "raw.githubusercontent.com")
            readme_url = f"{base_url}/main/README.md"
            
            async with httpx.AsyncClient() as client:
                resp = await client.get(readme_url)
                if resp.status_code == 404:
                    readme_url = f"{base_url}/master/README.md"
                    resp = await client.get(readme_url)
                
                if resp.status_code != 200:
                    return {
                        "verified": False,
                        "score": 0,
                        "reason": "Could not access README.md. Please ensure the repo is public and has a README."
                    }
                
                readme_content = resp.text[:5000] # Analyze first 5k chars
                
                # Use Gemini to Audit
                from app.services.gemini_client import gemini_client
                prompt = f"""
                Audit this GitHub Project README against these requirements: {requirements}
                
                README Content:
                {readme_content}
                
                Return JSON:
                {{
                    "verified": true/false (true if most requirements met),
                    "score": 0-100,
                    "found_features": ["feature1", "feature2"],
                    "missing_features": ["feature3"],
                    "feedback": "Constructive feedback on the project documentation."
                }}
                """
                
                ai_resp = await gemini_client.generate_content_async(prompt, generation_config={"response_mime_type": "application/json"})
                return json.loads(ai_resp.text)
                
        except Exception as e:
            logging.error(f"Repo verification failed: {e}")
            return {"verified": False, "error": str(e)}

    async def verify_skills(self, roadmap: Dict[str, Any]) -> Dict[str, Any]:
        """
        Main entry point for skill verification.
        """
        logging.info("Generating verification suite...")
        
        # 1. Generate Quiz
        quiz = await self._generate_gemini_quiz(roadmap)
        
        # 2. Generate Mock Interview Questions
        interview = await self.generate_mock_interview(roadmap)
        
        return {
            "overall_score": 0,
            "quiz": quiz,
            "mock_interview": interview,
            "status": "AWAITING_ASSESSMENT",
            "feedback": "Agentic verification layer ready. Take the quiz or start the mock interview."
        }

    async def _generate_gemini_quiz(self, roadmap: Dict[str, Any]) -> Dict[str, Any]:
        milestone = roadmap.get("milestones", [{}])[0]
        focus_skills = milestone.get("focus", [])
        
        prompt = f"""
        Act as a technical interviewer. Based on these target skills: {focus_skills}, 
        generate a 3-question technical quiz. 
        Return ONLY JSON with 'questions' list, each having 'q', 'options', and 'correct_answer'.
        """
        
        try:
            # Use synchronous call
            response = await gemini_client.generate_content_async(prompt, generation_config={"response_mime_type": "application/json"})
            return json.loads(response.text)
        except Exception as e:
            logging.error(f"Quiz generation failed: {e}")
            # No fallback - return empty structure
            return {
                "questions": [],
                "error": str(e)
            }

    async def generate_mock_interview(self, roadmap: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generates situational/behavioral and deep technical questions for a mock interview.
        """
        goal = roadmap.get("career_goal", "Software Engineer")
        prompt = f"Generate 3 specialized mock interview questions for a {goal} candidate. Return ONLY JSON with keys 'technical' and 'behavioral'."
        
        try:
            # Use synchronous call
            response = await gemini_client.generate_content_async(prompt, generation_config={"response_mime_type": "application/json"})
            return json.loads(response.text)
        except Exception as e:
            logging.error(f"Mock interview generation failed: {e}")
            # No fallback - return empty structure
            return {
                "technical": [],
                "behavioral": [],
                "error": str(e)
            }

    async def suggest_roadmap_adjustments(self, current_roadmap: Dict[str, Any], score: int) -> Dict[str, Any]:
        """
        Dynamically adjusts roadmap intensity based on user score (0-100).
        """
        logging.info(f"Analyzing performance (Score: {score}). Suggesting adjustments...")
        
        prompt = f"""
        Current Roadmap: {json.dumps(current_roadmap)}
        User Score: {score}/100
        
        If score < 50: Recommend 'Bridge Week' or 'Deep Foundations'.
        If score > 85: Recommend 'Fast-Track' or 'Advanced Tracks'.
        Return ONLY JSON with 'recommendation', 'action', and 'adjusted_weekly_hours'.
        """
        
        try:
            # Use synchronous call
            response = await gemini_client.generate_content_async(prompt, generation_config={"response_mime_type": "application/json"})
            return json.loads(response.text)
        except Exception as e:
            logging.error(f"Roadmap adjustment failed: {e}")
            # No fallback - return empty structure
            return {
                "recommendation": "Analysis failed",
                "action": "NONE",
                "adjusted_weekly_hours": 0,
                "error": str(e)
            }
