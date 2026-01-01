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
            response = gemini_client.model.generate_content(prompt, generation_config={"response_mime_type": "application/json"})
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
            response = gemini_client.model.generate_content(prompt, generation_config={"response_mime_type": "application/json"})
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
            response = gemini_client.model.generate_content(prompt, generation_config={"response_mime_type": "application/json"})
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
