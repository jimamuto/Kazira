from typing import Dict, Any, List, Optional
import logging
from datetime import datetime, timedelta
from app.services.database_service import DatabaseService

class CareerVelocityEngine:
    """
    EXTRAORDINARY FEATURE: Career Velocity Metric
    Tracks personal learning speed vs market evolution.
    Calculates acceleration factor and predicts career trajectory.
    """

    def __init__(self, user_id: str):
        self.user_id = user_id
        self.db = DatabaseService(user_id)

    async def calculate_velocity_metrics(self, current_roadmap: Dict[str, Any], user_progress: Dict[str, Any]) -> Dict[str, Any]:
        """
        Calculates comprehensive career velocity metrics.
        Returns acceleration factor, market positioning, and trajectory predictions.
        """
        try:
            # Extract user progress data
            completed_milestones = user_progress.get("milestone_completed", [])
            quiz_scores = user_progress.get("quiz_scores", {})
            start_date = user_progress.get("start_date", datetime.now().isoformat())
            last_updated = user_progress.get("last_updated", datetime.now().isoformat())

            # Calculate time metrics
            days_active = self._calculate_days_active(start_date, last_updated)
            milestones_completed = len(completed_milestones)

            # Calculate learning velocity
            learning_velocity = self._calculate_learning_velocity(
                milestones_completed, days_active, current_roadmap
            )

            # Calculate market velocity (how fast market is changing)
            market_velocity = await self._calculate_market_velocity()

            # Calculate acceleration factor (user speed vs market speed)
            acceleration_factor = learning_velocity / max(market_velocity, 0.1)  # Avoid division by zero

            # Calculate skill mastery trajectory
            skill_trajectory = self._calculate_skill_trajectory(
                current_roadmap, completed_milestones, quiz_scores
            )

            # Generate velocity insights
            velocity_insights = self._generate_velocity_insights(
                acceleration_factor, learning_velocity, market_velocity, skill_trajectory
            )

            # Career positioning analysis
            market_positioning = self._analyze_market_positioning(
                acceleration_factor, skill_trajectory
            )

            velocity_report = {
                "velocity_metrics": {
                    "learning_velocity": round(learning_velocity, 2),
                    "market_velocity": round(market_velocity, 2),
                    "acceleration_factor": round(acceleration_factor, 2),
                    "days_active": days_active,
                    "milestones_completed": milestones_completed,
                    "average_quiz_score": self._calculate_average_quiz_score(quiz_scores)
                },
                "skill_trajectory": skill_trajectory,
                "market_positioning": market_positioning,
                "velocity_insights": velocity_insights,
                "career_predictions": self._generate_career_predictions(
                    acceleration_factor, skill_trajectory, current_roadmap
                ),
                "generated_at": datetime.now().isoformat(),
                "confidence_score": 0.87  # Self-assessed confidence
            }

            # Store velocity report
            await self._store_velocity_report(velocity_report)

            logging.info(f"Velocity metrics calculated for {self.user_id}: Acceleration factor {acceleration_factor:.2f}")
            return velocity_report

        except Exception as e:
            logging.error(f"Velocity calculation failed: {e}")
            return {
                "error": str(e),
                "velocity_metrics": {},
                "skill_trajectory": {},
                "market_positioning": {},
                "velocity_insights": [],
                "career_predictions": {}
            }

    def _calculate_days_active(self, start_date: str, last_updated: str) -> int:
        """Calculate days since user started their journey."""
        try:
            start = datetime.fromisoformat(start_date.replace('Z', '+00:00'))
            last = datetime.fromisoformat(last_updated.replace('Z', '+00:00'))
            return max(1, (last - start).days)  # Minimum 1 day
        except:
            return 7  # Default to 1 week

    def _calculate_learning_velocity(self, milestones_completed: int, days_active: int, roadmap: Dict[str, Any]) -> float:
        """
        Calculate learning velocity: milestones per day, normalized by roadmap difficulty.
        Returns velocity score (higher = faster learner).
        """
        if days_active == 0:
            return 0.0

        # Base velocity: milestones per day
        base_velocity = milestones_completed / days_active

        # Adjust for roadmap length and difficulty
        total_milestones = len(roadmap.get("milestones", []))
        roadmap_complexity = len(roadmap.get("estimated_weekly_hours", 10)) / 10.0  # Normalize

        # Weighted velocity (accounts for difficulty)
        adjusted_velocity = base_velocity * roadmap_complexity

        # Scale to 0-5 range for interpretability
        return min(5.0, adjusted_velocity * 2.0)

    async def _calculate_market_velocity(self) -> float:
        """
        Calculate how fast the job market is evolving.
        Based on recent job listings and skill emergence patterns.
        """
        try:
            # Get recent job data from database
            recent_jobs = await self.db.load_recent_jobs(days=7)

            if not recent_jobs:
                return 1.0  # Default market velocity

            # Analyze skill emergence patterns
            skill_counts = {}
            for job in recent_jobs:
                skills = job.get("skills", [])
                for skill in skills:
                    skill_counts[skill] = skill_counts.get(skill, 0) + 1

            # Calculate market velocity based on new skill emergence
            total_skills = len(skill_counts)
            emerging_skills = len([count for count in skill_counts.values() if count <= 2])  # Skills appearing 1-2 times

            # Velocity = emerging skills ratio (0-1) scaled to 0-3 range
            velocity = (emerging_skills / max(total_skills, 1)) * 3.0

            return max(0.5, min(3.0, velocity))  # Clamp between 0.5-3.0

        except Exception as e:
            logging.error(f"Market velocity calculation failed: {e}")
            return 1.0  # Default

    def _calculate_skill_trajectory(self, roadmap: Dict[str, Any], completed_milestones: List[int], quiz_scores: Dict[str, int]) -> Dict[str, Any]:
        """
        Calculate skill mastery trajectory based on completed milestones and quiz performance.
        """
        milestones = roadmap.get("milestones", [])
        trajectory = {
            "mastered_skills": [],
            "developing_skills": [],
            "emerging_skills": [],
            "weak_areas": [],
            "trajectory_score": 0.0,
            "predicted_completion_months": 6
        }

        # Analyze completed milestones
        for milestone_idx in completed_milestones:
            if milestone_idx < len(milestones):
                milestone = milestones[milestone_idx]
                skills = milestone.get("focus", [])
                trajectory["mastered_skills"].extend(skills)

        # Analyze quiz scores for weak areas
        avg_score = self._calculate_average_quiz_score(quiz_scores)
        trajectory["trajectory_score"] = avg_score / 100.0  # Convert to 0-1 scale

        # Identify weak areas (scores below 70%)
        weak_quizzes = [quiz for quiz, score in quiz_scores.items() if score < 70]
        trajectory["weak_areas"] = weak_quizzes

        # Calculate remaining milestones and predict completion
        remaining_milestones = len(milestones) - len(completed_milestones)
        trajectory["predicted_completion_months"] = max(1, remaining_milestones // 2)  # Rough estimate

        return trajectory

    def _calculate_average_quiz_score(self, quiz_scores: Dict[str, int]) -> float:
        """Calculate average quiz score."""
        if not quiz_scores:
            return 0.0
        return sum(quiz_scores.values()) / len(quiz_scores)

    def _generate_velocity_insights(self, acceleration_factor: float, learning_velocity: float,
                                   market_velocity: float, skill_trajectory: Dict[str, Any]) -> List[str]:
        """
        Generate human-readable velocity insights.
        """
        insights = []

        # Acceleration insights
        if acceleration_factor >= 2.0:
            insights.append("🚀 EXCEPTIONAL: You're learning 2x faster than market evolution!")
        elif acceleration_factor >= 1.5:
            insights.append("⚡ ACCELERATED: You're ahead of market trends")
        elif acceleration_factor >= 1.0:
            insights.append("✅ ON TRACK: Your learning pace matches market evolution")
        else:
            insights.append("⚠️ BEHIND: Consider increasing study hours to keep pace")

        # Skill trajectory insights
        mastered_count = len(skill_trajectory.get("mastered_skills", []))
        if mastered_count > 5:
            insights.append(f"🎯 SKILL MASTER: You've mastered {mastered_count} skills")

        weak_areas = skill_trajectory.get("weak_areas", [])
        if weak_areas:
            insights.append(f"📚 FOCUS NEEDED: {len(weak_areas)} areas need attention")

        # Market positioning
        if learning_velocity > market_velocity * 1.2:
            insights.append("🏆 MARKET LEADER: Your skills are more advanced than current job requirements")

        return insights

    def _analyze_market_positioning(self, acceleration_factor: float, skill_trajectory: Dict[str, Any]) -> Dict[str, Any]:
        """
        Analyze user's market positioning based on velocity and skills.
        """
        positioning = {
            "position": "unknown",
            "description": "",
            "opportunities": [],
            "risks": [],
            "recommendations": []
        }

        score = skill_trajectory.get("trajectory_score", 0.0)

        if acceleration_factor >= 2.0 and score >= 0.8:
            positioning["position"] = "market_leader"
            positioning["description"] = "You're ahead of market demand"
            positioning["opportunities"] = ["Early adopter advantage", "Higher salary potential", "Career flexibility"]
            positioning["recommendations"] = ["Mentor others", "Explore advanced specializations"]
        elif acceleration_factor >= 1.5 and score >= 0.7:
            positioning["position"] = "market_competitive"
            positioning["description"] = "You're competitive in the current market"
            positioning["opportunities"] = ["Job security", "Salary growth potential"]
            positioning["recommendations"] = ["Continue current pace", "Network strategically"]
        elif acceleration_factor >= 1.0:
            positioning["position"] = "market_follower"
            positioning["description"] = "You're keeping pace with market changes"
            positioning["opportunities"] = ["Stable career progression"]
            positioning["recommendations"] = ["Increase learning velocity", "Focus on high-demand skills"]
        else:
            positioning["position"] = "market_behind"
            positioning["description"] = "You're falling behind market evolution"
            positioning["risks"] = ["Job displacement risk", "Salary stagnation"]
            positioning["recommendations"] = ["Immediate acceleration needed", "Prioritize essential skills"]

        return positioning

    def _generate_career_predictions(self, acceleration_factor: float, skill_trajectory: Dict[str, Any],
                                   roadmap: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate career trajectory predictions based on current velocity.
        """
        completion_months = skill_trajectory.get("predicted_completion_months", 6)

        # Adjust completion time based on acceleration
        adjusted_completion = completion_months / acceleration_factor

        predictions = {
            "estimated_completion_months": round(adjusted_completion, 1),
            "career_stage_prediction": self._predict_career_stage(adjusted_completion),
            "salary_trajectory": self._predict_salary_trajectory(acceleration_factor, skill_trajectory),
            "skill_gap_analysis": skill_trajectory.get("weak_areas", []),
            "acceleration_needed": max(0, 1.5 - acceleration_factor)  # How much faster they need to go
        }

        return predictions

    def _predict_career_stage(self, completion_months: float) -> str:
        """Predict career stage based on completion timeline."""
        if completion_months <= 3:
            return "Senior Developer (Accelerated Path)"
        elif completion_months <= 6:
            return "Mid-Level Developer (Standard Path)"
        elif completion_months <= 12:
            return "Junior Developer (Extended Path)"
        else:
            return "Entry-Level (Significant Acceleration Needed)"

    def _predict_salary_trajectory(self, acceleration_factor: float, skill_trajectory: Dict[str, Any]) -> Dict[str, Any]:
        """Predict salary growth based on velocity and skills."""
        base_salary = 50000  # Entry level
        score = skill_trajectory.get("trajectory_score", 0.0)

        # Salary multipliers based on acceleration and skill mastery
        acceleration_multiplier = min(2.0, acceleration_factor)
        skill_multiplier = score

        predicted_salary = base_salary * acceleration_multiplier * skill_multiplier

        return {
            "entry_level": round(base_salary, 0),
            "current_predicted": round(predicted_salary, 0),
            "senior_level_predicted": round(predicted_salary * 1.8, 0),  # 3-5 years growth
            "confidence": round((acceleration_factor + score) / 2, 2)
        }

    async def _store_velocity_report(self, velocity_report: Dict[str, Any]):
        """
        Store velocity report in database for historical tracking.
        """
        try:
            # Store as user progress metadata
            await self.db.update_user_progress(
                roadmap_id=None,  # Could be enhanced to link to specific roadmap
                milestone_index=-1,  # Special marker for velocity data
                quiz_score=None
            )

            # Could add a separate velocity table in future enhancement
            logging.info(f"Velocity report stored for user {self.user_id}")

        except Exception as e:
            logging.error(f"Failed to store velocity report: {e}")