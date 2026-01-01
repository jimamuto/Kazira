from typing import Dict, Any, List, Optional
import logging
import json
from app.services.gemini_client import gemini_client

class PlanningAgent:
    """
    Uses Gemini's reasoning capabilities to create a structured learning roadmap.
    """
    
    def __init__(self):
        self.name = "PlanningAgent"

    async def create_roadmap(self, goal: str, research_data: Dict[str, Any], user_constraints: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Generates a 6-month roadmap based on market research, predictions, and user constraints.
        EXTRAORDINARY FEATURE: Incorporates market prediction engine for strategic planning.
        """
        logging.info(f"Planning strategic roadmap for: {goal}")

        # Extract skills from research
        top_skills = research_data.get("analysis", {}).get("top_skills", [])
        trends = research_data.get("analysis", {}).get("emerging_trends", [])

        # EXTRAORDINARY: Extract prediction data for strategic planning
        predictions = research_data.get("predictions", {})
        market_velocity = predictions.get("market_velocity", {})
        career_strategy = predictions.get("career_strategy", {})
        
        system_prompt = """
        You are a Strategic Career Architect with PERFECT FORESIGHT.
        You have access to market prediction data and must create roadmaps that win the future.

        EXTRAORDINARY PRIORITIZATION RULES:
        1. **Market Velocity**: Prioritize RISING skills (60% weight), maintain STABLE skills (30% weight), avoid DECLINING skills.
        2. **Future Demand**: Allocate time based on prediction timelines - immediate skills first, then 3-month, 6-month, 1-year.
        3. **Career Strategy**: Follow the optimal learning sequence from market predictions.
        4. **Risk Assessment**: Include safe bets (long-term value) while hedging with emerging opportunities.
        5. **User Constraints**: Respect study hours but optimize for maximum career acceleration.

        You must create roadmaps that position users to CAPITALIZE on predicted market shifts.
        Return ONLY valid JSON.
        """
        
        constraints_dict = user_constraints or {}

        # Extract prediction insights
        rising_skills = market_velocity.get("rising", [])
        stable_skills = market_velocity.get("stable", [])
        declining_skills = market_velocity.get("declining", [])
        optimal_sequence = career_strategy.get("optimal_sequence", [])
        salary_projection = career_strategy.get("salary_projection", "Entry: $50K → Senior: $80K → Expert: $120K")
        safe_bets = predictions.get("risk_assessment", {}).get("safe_bets", [])
        emerging_opportunities = predictions.get("risk_assessment", {}).get("emerging_opportunities", [])

        user_prompt = f"""
        STRATEGIC CAREER MISSION: {goal}

        CURRENT MARKET INTELLIGENCE:
        - Top Skills: {', '.join(top_skills)}
        - Emerging Trends: {', '.join(trends)}

        MARKET PREDICTIONS (EXTRAORDINARY INSIGHT):
        - Rising Skills (PRIORITY): {', '.join(rising_skills)}
        - Stable Skills (MAINTAIN): {', '.join(stable_skills)}
        - Declining Skills (AVOID): {', '.join(declining_skills)}
        - Optimal Learning Sequence: {', '.join(optimal_sequence)}
        - Safe Bets (Long-term): {', '.join(safe_bets)}
        - Emerging Opportunities: {', '.join(emerging_opportunities)}
        - Salary Trajectory: {salary_projection}

        USER CONSTRAINTS: {json.dumps(constraints_dict)}

        Create a PREDICTIVE roadmap that positions the user to CAPITALIZE on these market shifts:

        {{
            "roadmap_id": "strategic-prediction-roadmap",
            "market_insights": {{
                "rising_skills_focus": "{', '.join(rising_skills[:3])}",
                "predicted_salary_growth": "{salary_projection}",
                "emerging_opportunities": ["{emerging_opportunities[0] if emerging_opportunities else 'AI/ML Integration'}"]
            }},
            "milestones": [
                {{
                    "month": 1,
                    "title": "Foundation + Rising Skills",
                    "focus": ["{rising_skills[0] if rising_skills else 'Core Fundamentals'}", "Basic Tools"],
                    "priority": "Critical",
                    "market_context": "Capitalize on rising demand",
                    "tasks": ["Master fundamentals", "Build projects", "Network strategically"]
                }}
            ],
            "estimated_weekly_hours": 10,
            "career_acceleration_factor": 2.3,
            "market_positioning": "Ahead of market curve"
        }}

        Make this roadmap EXTRAORDINARY - not generic, but PREDICTIVE and STRATEGIC.
        """
        
        try:
            # Use synchronous call (not async)
            response = gemini_client.model.generate_content(
                f"{system_prompt}\n\n{user_prompt}",
                generation_config={"response_mime_type": "application/json"}
            )
            return json.loads(response.text)
        except Exception as e:
            logging.error(f"Planning failed: {e}")
            # No fallback - return empty structure with error
            return {
                "career_goal": goal,
                "total_duration": "6 Months",
                "milestones": [],
                "error": str(e)
            }

    async def handle_message(self, message: Any):
        """
        Handles messages from other agents within the Orchestrator's message bus.
        """
        if message.message_type == "MARKET_SHIFT":
            logging.info(f"[{self.name}] Received MARKET_SHIFT: {message.data}")
            # Logic to handle market shift will be invoked by Orchestrator calling adjust_roadmap
            # or we could trigger it here if we had access to the Orchestrator instance.
            # For now, we just acknowledge.
            return {
                "status": "acknowledged", 
                "action": "ready_to_adjust"
            }
        return {"status": "ignored"}

    async def adjust_roadmap(self, current_roadmap: Dict[str, Any], market_data: Dict[str, Any], score: float = 0.0) -> Dict[str, Any]:
        """
        Adjusts an existing roadmap based on new market data or verification scores.
        Only modifies future milestones, preserving completed progress.
        """
        logging.info(f"[{self.name}] Adjusting roadmap based on market data...")
        
        new_trends = market_data.get("new_trends", [])
        job_delta = market_data.get("job_delta", 0)
        
        # If no significant changes, return original
        if not new_trends and job_delta < 5 and score > 0.8:
             logging.info(f"[{self.name}] No significant adjustment needed.")
             return current_roadmap

        system_prompt = """
        You are an Adaptive Career Strategist.
        Update the provided roadmap based on new market intelligence.
        
        RULES:
        1. **Preserve Structure**: Keep the same JSON format.
        2. **Inject Trends**: Add new skills from 'New Trends' into the next relevant phase.
        3. **Refine Focus**: If 'Job Delta' is negative, suggest broadening search criteria in notes.
        4. **Verification Impact**: If previous score was low (<0.5), add 'Foundation Review' tasks.
        
        Return ONLY valid JSON of the UPDATED roadmap.
        """
        
        user_prompt = f"""
        Current Roadmap: {json.dumps(current_roadmap)}
        New Trends: {', '.join(new_trends)}
        Job Delta: {job_delta}
        Verification Score: {score}
        
        Update the roadmap to incorporate these changes.
        """
        
        try:
            response = gemini_client.model.generate_content(
                f"{system_prompt}\n\n{user_prompt}",
                generation_config={"response_mime_type": "application/json"}
            )
            return json.loads(response.text)
        except Exception as e:
            logging.error(f"Failed to adjust roadmap: {e}")
            return current_roadmap

