from typing import Dict, Any, List, Optional
import logging
from datetime import datetime, timedelta
from app.services.gemini_client import gemini_client

class StrategicCareerPathing:
    """
    EXTRAORDINARY FEATURE: Strategic Career Pathing
    Generates comprehensive 5-year career trajectories from Junior to CTO level.
    Includes detailed milestones, skill progression, and strategic positioning.
    """

    def __init__(self):
        self.name = "StrategicCareerPathing"

    async def generate_career_trajectory(self, current_role: str, target_role: str,
                                       skills_profile: Dict[str, Any],
                                       market_intelligence: Dict[str, Any],
                                       velocity_metrics: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate a complete 5-year career trajectory with detailed milestones.
        """
        try:
            logging.info(f"Generating strategic career path from {current_role} to {target_role}")

            # Extract key inputs
            current_skills = skills_profile.get("mastered_skills", [])
            learning_velocity = velocity_metrics.get("velocity_metrics", {}).get("learning_velocity", 1.0)
            market_predictions = market_intelligence.get("predictions", {})

            # Generate comprehensive career path
            career_path = await self._generate_detailed_path(
                current_role, target_role, current_skills,
                learning_velocity, market_predictions
            )

            # Calculate timeline projections
            timeline_projection = self._calculate_timeline_projection(
                career_path, learning_velocity, current_role, target_role
            )

            # Generate strategic insights
            strategic_insights = await self._generate_strategic_insights(
                career_path, market_intelligence, velocity_metrics
            )

            career_trajectory = {
                "start_role": current_role,
                "target_role": target_role,
                "career_path": career_path,
                "timeline_projection": timeline_projection,
                "strategic_insights": strategic_insights,
                "market_alignment": self._assess_market_alignment(career_path, market_intelligence),
                "success_probability": self._calculate_success_probability(
                    career_path, velocity_metrics, market_intelligence
                ),
                "generated_at": datetime.now().isoformat(),
                "confidence_score": 0.88
            }

            logging.info(f"Career trajectory generated: {len(career_path)} career stages, {timeline_projection['total_years']} year timeline")
            return career_trajectory

        except Exception as e:
            logging.error(f"Career trajectory generation failed: {e}")
            return {
                "error": str(e),
                "start_role": current_role,
                "target_role": target_role,
                "career_path": [],
                "timeline_projection": {},
                "strategic_insights": []
            }

    async def _generate_detailed_path(self, current_role: str, target_role: str,
                                    current_skills: List[str], learning_velocity: float,
                                    market_predictions: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Generate detailed career path with specific roles, skills, and milestones.
        """
        try:
            from app.services.gemini_client import gemini_client

            # Extract market intelligence
            rising_skills = market_predictions.get("market_velocity", {}).get("rising", [])
            emerging_trends = market_predictions.get("risk_assessment", {}).get("emerging_opportunities", [])

            path_prompt = f"""
            Generate a detailed 5-year career progression from {current_role} to {target_role}.

            CURRENT CONTEXT:
            - Current Skills: {', '.join(current_skills)}
            - Learning Velocity: {learning_velocity}/5 (1=slow, 5=exceptional)
            - Rising Skills: {', '.join(rising_skills)}
            - Emerging Trends: {', '.join(emerging_trends)}

            Create a career ladder with these exact stages:
            1. Junior/Entry Level (Years 0-1)
            2. Mid-Level (Years 1-2)
            3. Senior Level (Years 2-3)
            4. Lead/Principal (Years 3-4)
            5. Executive/CTO Level (Years 4-5)

            For each stage, provide:
            - title: Exact job title
            - years_experience: Required experience range
            - key_responsibilities: 3-4 bullet points
            - critical_skills: 5-7 essential skills (prioritize rising skills)
            - leadership_focus: What leadership skills to develop
            - market_value: Expected salary range
            - success_metrics: How to measure success at this level

            Return ONLY valid JSON array of career stages.
            """

            response = gemini_client.model.generate_content(
                path_prompt,
                generation_config={"response_mime_type": "application/json"}
            )

            import json
            career_path = json.loads(response.text)

            # Enhance with velocity-adjusted timelines
            for stage in career_path:
                # Adjust timeline based on learning velocity
                base_years = stage.get("years_experience", "1-2").split("-")
                if len(base_years) == 2:
                    min_years = float(base_years[0])
                    max_years = float(base_years[1])

                    # High velocity learners progress faster
                    velocity_multiplier = max(0.7, 2.0 - learning_velocity)  # Faster learners = shorter timelines

                    adjusted_min = min_years * velocity_multiplier
                    adjusted_max = max_years * velocity_multiplier

                    stage["adjusted_years_experience"] = f"{adjusted_min:.1f}-{adjusted_max:.1f}"

            return career_path

        except Exception as e:
            logging.error(f"Detailed path generation failed: {e}")
            return self._generate_fallback_path(current_role, target_role)

    def _generate_fallback_path(self, current_role: str, target_role: str) -> List[Dict[str, Any]]:
        """Fallback career path if AI generation fails."""
        return [
            {
                "title": f"Senior {current_role}",
                "years_experience": "1-2",
                "key_responsibilities": ["Lead small projects", "Mentor juniors", "Improve processes"],
                "critical_skills": ["Leadership", "Architecture", "Communication"],
                "leadership_focus": "Team leadership",
                "market_value": "$80K-$120K",
                "success_metrics": ["Project delivery", "Team satisfaction"]
            },
            {
                "title": f"Lead {target_role}",
                "years_experience": "3-4",
                "key_responsibilities": ["Strategic planning", "Cross-team coordination", "Technology vision"],
                "critical_skills": ["Strategic thinking", "Executive communication", "Innovation"],
                "leadership_focus": "Organizational leadership",
                "market_value": "$150K-$250K",
                "success_metrics": ["Business impact", "Innovation metrics"]
            }
        ]

    def _calculate_timeline_projection(self, career_path: List[Dict[str, Any]],
                                    learning_velocity: float, current_role: str, target_role: str) -> Dict[str, Any]:
        """
        Calculate realistic timeline projections based on career path and learning velocity.
        """
        # Calculate total years needed
        total_years = 0
        stage_timelines = []

        for i, stage in enumerate(career_path):
            years_range = stage.get("adjusted_years_experience", stage.get("years_experience", "1-2"))
            years_parts = years_range.split("-")

            if len(years_parts) == 2:
                min_years = float(years_parts[0])
                max_years = float(years_parts[1])
                avg_years = (min_years + max_years) / 2
            else:
                avg_years = 1.5  # Default

            total_years += avg_years

            stage_timelines.append({
                "stage": i + 1,
                "title": stage.get("title", ""),
                "years_required": avg_years,
                "cumulative_years": total_years
            })

        # Adjust for current position
        current_level_multiplier = self._get_current_level_multiplier(current_role)
        adjusted_total_years = total_years * current_level_multiplier

        # Velocity adjustment (faster learners complete faster)
        velocity_adjustment = max(0.6, 1.0 - (learning_velocity - 1.0) * 0.1)
        final_years = adjusted_total_years * velocity_adjustment

        return {
            "total_years": round(final_years, 1),
            "stage_timelines": stage_timelines,
            "milestones": [
                {"year": 1, "achievement": "First promotion"},
                {"year": round(final_years * 0.4, 1), "achievement": "Mid-level expertise"},
                {"year": round(final_years * 0.7, 1), "achievement": "Senior leadership"},
                {"year": final_years, "achievement": f"Reach {target_role}"}
            ],
            "critical_path_decisions": [
                f"Year {round(final_years * 0.3, 1)}: Choose specialization path",
                f"Year {round(final_years * 0.6, 1)}: Transition to leadership role",
                f"Year {round(final_years * 0.8, 1)}: Focus on executive skills"
            ]
        }

    def _get_current_level_multiplier(self, current_role: str) -> float:
        """Get multiplier based on current career level."""
        role_multipliers = {
            "junior": 1.0, "entry": 1.0, "intern": 1.2,
            "mid": 0.8, "senior": 0.6,
            "lead": 0.4, "principal": 0.3,
            "manager": 0.3, "director": 0.2,
            "vp": 0.1, "cto": 0.0, "executive": 0.0
        }

        role_lower = current_role.lower()
        for level, multiplier in role_multipliers.items():
            if level in role_lower:
                return multiplier

        return 1.0  # Default

    async def _generate_strategic_insights(self, career_path: List[Dict[str, Any]],
                                         market_intelligence: Dict[str, Any],
                                         velocity_metrics: Dict[str, Any]) -> List[str]:
        """
        Generate strategic insights for career success.
        """
        insights = []

        # Velocity-based insights
        velocity = velocity_metrics.get("velocity_metrics", {}).get("learning_velocity", 1.0)
        if velocity >= 4.0:
            insights.append("🚀 EXCEPTIONAL VELOCITY: You're learning at an elite pace - focus on leadership and strategic roles")
        elif velocity >= 3.0:
            insights.append("⚡ ACCELERATED PACE: Maintain momentum with continuous learning and networking")
        else:
            insights.append("📈 GROWTH OPPORTUNITIES: Increase learning velocity through structured study and mentorship")

        # Market alignment insights
        market_velocity = market_intelligence.get("predictions", {}).get("market_velocity", {})
        rising_skills = market_velocity.get("rising", [])

        if rising_skills:
            insights.append(f"🎯 MARKET ALIGNMENT: Prioritize these rising skills: {', '.join(rising_skills[:3])}")

        # Career path insights
        if len(career_path) >= 3:
            mid_career_stage = career_path[len(career_path)//2]
            leadership_focus = mid_career_stage.get("leadership_focus", "")
            if leadership_focus:
                insights.append(f"👥 LEADERSHIP DEVELOPMENT: Focus on '{leadership_focus}' for mid-career advancement")

        # Risk mitigation
        risk_assessment = market_intelligence.get("predictions", {}).get("risk_assessment", {})
        high_risk_skills = risk_assessment.get("high_risk_skills", [])

        if high_risk_skills:
            insights.append(f"⚠️ RISK AWARENESS: Be cautious with these potentially obsolete skills: {', '.join(high_risk_skills)}")

        # Success optimization
        safe_bets = risk_assessment.get("safe_bets", [])
        if safe_bets:
            insights.append(f"🛡️ SAFE BETS: Build expertise in these stable skills: {', '.join(safe_bets[:3])}")

        return insights

    def _assess_market_alignment(self, career_path: List[Dict[str, Any]],
                               market_intelligence: Dict[str, Any]) -> Dict[str, Any]:
        """
        Assess how well the career path aligns with market trends.
        """
        # Extract skills from career path
        path_skills = set()
        for stage in career_path:
            skills = stage.get("critical_skills", [])
            path_skills.update(skills)

        # Compare with market intelligence
        market_velocity = market_intelligence.get("predictions", {}).get("market_velocity", {})
        rising_skills = set(market_velocity.get("rising", []))
        stable_skills = set(market_velocity.get("stable", []))
        declining_skills = set(market_velocity.get("declining", []))

        # Calculate alignment scores
        rising_alignment = len(path_skills.intersection(rising_skills))
        stable_alignment = len(path_skills.intersection(stable_skills))
        declining_risk = len(path_skills.intersection(declining_skills))

        total_path_skills = len(path_skills)
        if total_path_skills == 0:
            return {"alignment_score": 0, "risk_level": "unknown"}

        alignment_score = (rising_alignment * 1.5 + stable_alignment * 1.0 - declining_risk * 2.0) / total_path_skills
        alignment_score = max(0, min(1, (alignment_score + 1) / 2))  # Normalize to 0-1

        # Determine risk level
        if alignment_score >= 0.8:
            risk_level = "excellent_alignment"
            description = "Strong alignment with rising market trends"
        elif alignment_score >= 0.6:
            risk_level = "good_alignment"
            description = "Good balance of current and future skills"
        elif alignment_score >= 0.4:
            risk_level = "moderate_alignment"
            description = "Some alignment but room for improvement"
        else:
            risk_level = "poor_alignment"
            description = "Significant misalignment with market trends"

        return {
            "alignment_score": round(alignment_score, 2),
            "risk_level": risk_level,
            "description": description,
            "rising_skills_coverage": rising_alignment,
            "stable_skills_coverage": stable_alignment,
            "declining_skills_risk": declining_risk
        }

    def _calculate_success_probability(self, career_path: List[Dict[str, Any]],
                                    velocity_metrics: Dict[str, Any],
                                    market_intelligence: Dict[str, Any]) -> Dict[str, Any]:
        """
        Calculate probability of successfully reaching target role.
        """
        # Base factors
        velocity_score = velocity_metrics.get("velocity_metrics", {}).get("learning_velocity", 1.0) / 5.0  # Normalize
        market_alignment = self._assess_market_alignment(career_path, market_intelligence)["alignment_score"]
        path_complexity = len(career_path) / 10.0  # Normalize (more stages = harder)

        # Calculate weighted probability
        # 40% velocity, 40% market alignment, 20% path complexity
        base_probability = (velocity_score * 0.4) + (market_alignment * 0.4) + ((1 - path_complexity) * 0.2)

        # Adjust for external factors
        external_factors = {
            "networking_importance": 0.15,
            "economic_conditions": 0.10,
            "personal_drive": 0.20,
            "timing_luck": 0.10
        }

        # Conservative estimate (success is hard)
        adjusted_probability = base_probability * 0.7

        return {
            "success_probability": round(adjusted_probability, 2),
            "confidence_interval": f"{round(max(0, adjusted_probability - 0.15), 2)} - {round(min(1, adjusted_probability + 0.15), 2)}",
            "key_success_factors": [
                f"Learning Velocity: {'Excellent' if velocity_score > 0.8 else 'Needs improvement'}",
                f"Market Alignment: {'Strong' if market_alignment > 0.7 else 'Needs focus'}",
                f"Path Complexity: {'Manageable' if path_complexity < 0.5 else 'Challenging'}"
            ],
            "risk_factors": [
                "Market changes during journey",
                "Personal life changes",
                "Competition from peers",
                "Technology disruptions"
            ]
        }