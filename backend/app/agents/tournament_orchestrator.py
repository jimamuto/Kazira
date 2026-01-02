from typing import Dict, Any, List, Tuple
import logging
import asyncio
from datetime import datetime
from .research_agent import ResearchAgent
from app.services.gemini_client import gemini_client

class TournamentOrchestrator:
    """
    EXTRAORDINARY FEATURE: Competitive Agent Tournament
    Multiple research agents with different strategies compete to create the best roadmap.
    Winner's insights become the final result. Demonstrates evolutionary algorithms.
    """

    def __init__(self):
        self.name = "TournamentOrchestrator"
        self.tournament_results = []

    async def run_tournament(self, goal: str, location: str = "Global", num_agents: int = 5) -> Dict[str, Any]:
        """
        Runs a competitive tournament where multiple research agents compete.
        Returns the winner's results plus tournament statistics.
        """
        logging.info(f"🏆 Starting Competitive Agent Tournament for: {goal}")
        logging.debug(f"Tournament config: location={location}, num_agents={num_agents}")

        # Define tournament strategies (each agent has different approach)
        strategies = [
            "balanced",      # Standard approach
            "aggressive",    # Focus on rising skills, high risk
            "conservative",  # Focus on stable skills, low risk
            "innovative",    # Focus on emerging trends, experimental
            "data_driven"    # Heavy emphasis on quantitative analysis
        ]

        # Limit to available strategies or specified number
        tournament_strategies = strategies[:min(num_agents, len(strategies))]
        logging.debug(f"Running strategies: {tournament_strategies}")

        # Spawn agents with different strategies
        agents = []
        for strategy in tournament_strategies:
            agent = ResearchAgent(strategy=strategy)
            agents.append(agent)
        logging.debug(f"Created {len(agents)} tournament agents")

        # Run all agents concurrently (tournament parallel execution)
        logging.info(f"🤖 Running {len(agents)} agents in parallel tournament...")

        tournament_start = datetime.now()
        tasks = []
        for agent in agents:
            task = asyncio.create_task(self._run_agent_with_scoring(agent, goal, location))
            tasks.append(task)

        # Wait for all agents to complete
        agent_results = await asyncio.gather(*tasks, return_exceptions=True)
        tournament_duration = (datetime.now() - tournament_start).total_seconds()

        # Process results and determine winner
        valid_results = [r for r in agent_results if not isinstance(r, Exception) and isinstance(r, dict)]
        scored_results = []

        for result in valid_results:
            if result and isinstance(result, dict):
                score = await self._score_agent_performance(result)
                scored_results.append({
                    "agent_strategy": result.get("agent_strategy"),
                    "score": score,
                    "research_data": result.get("research_data"),
                    "performance_metrics": result.get("performance_metrics")
                })

        # Sort by score (highest first)
        scored_results.sort(key=lambda x: x["score"], reverse=True)
        winner = scored_results[0] if scored_results else None

        # Generate tournament summary
        tournament_summary = {
            "tournament_id": f"tournament_{int(datetime.now().timestamp())}",
            "goal": goal,
            "location": location,
            "total_agents": len(agents),
            "successful_agents": len(valid_results),
            "tournament_duration_seconds": tournament_duration,
            "winner_strategy": winner["agent_strategy"] if winner else None,
            "winner_score": winner["score"] if winner else 0.0,
            "leaderboard": [
                {
                    "rank": i+1,
                    "strategy": result["agent_strategy"],
                    "score": result["score"],
                    "key_insight": self._extract_key_insight(result["research_data"])
                }
                for i, result in enumerate(scored_results[:5])  # Top 5
            ],
            "tournament_insights": await self._analyze_tournament_patterns(scored_results)
        }

        # Store tournament results
        self.tournament_results.append(tournament_summary)

        # Return winner's research data plus tournament metadata
        final_result = winner["research_data"].copy() if winner else {}
        final_result["tournament_metadata"] = tournament_summary

        logging.info(f"🏆 Tournament Complete! Winner: {tournament_summary['winner_strategy']} (Score: {tournament_summary['winner_score']:.2f})")
        return final_result

    async def _run_agent_with_scoring(self, agent: ResearchAgent, goal: str, location: str) -> Dict[str, Any]:
        """
        Runs a single agent and captures performance metrics.
        """
        agent_start = datetime.now()

        try:
            # Run research
            research_data = await agent.research(goal, location)

            # Capture performance metrics
            duration = (datetime.now() - agent_start).total_seconds()
            jobs_found = len(research_data.get("listings", []))
            skills_identified = len(research_data.get("analysis", {}).get("top_skills", []))
            predictions_generated = bool(research_data.get("predictions"))

            return {
                "agent_strategy": agent.strategy,
                "research_data": research_data,
                "performance_metrics": {
                    "duration_seconds": duration,
                    "jobs_found": jobs_found,
                    "skills_identified": skills_identified,
                    "predictions_generated": predictions_generated,
                    "success": True
                }
            }

        except Exception as e:
            logging.error(f"Agent {agent.strategy} failed: {e}")
            return {
                "agent_strategy": agent.strategy,
                "error": str(e),
                "performance_metrics": {
                    "duration_seconds": (datetime.now() - agent_start).total_seconds(),
                    "jobs_found": 0,
                    "skills_identified": 0,
                    "predictions_generated": False,
                    "success": False
                }
            }

    async def _score_agent_performance(self, agent_result: Dict[str, Any]) -> float:
        """
        Scores agent performance based on multiple criteria.
        Higher score = better performance.
        """
        metrics = agent_result.get("performance_metrics", {})
        research_data = agent_result.get("research_data", {})

        score = 0.0

        # Data quality (40% weight)
        jobs_found = metrics.get("jobs_found", 0)
        score += min(jobs_found / 10.0, 1.0) * 0.4  # Max 10 jobs = 40 points

        # Analysis quality (30% weight)
        skills_count = metrics.get("skills_identified", 0)
        score += min(skills_count / 5.0, 1.0) * 0.3  # Max 5 skills = 30 points

        # Innovation (20% weight) - predictions generated
        if metrics.get("predictions_generated", False):
            score += 0.2

        # Efficiency (10% weight) - faster is better
        duration = metrics.get("duration_seconds", 60)
        efficiency_bonus = max(0, (60 - duration) / 60.0)  # Bonus for under 60 seconds
        score += efficiency_bonus * 0.1

        return round(score, 3)

    def _extract_key_insight(self, research_data: Dict[str, Any]) -> str:
        """
        Extracts a key insight from the research data for tournament display.
        """
        predictions = research_data.get("predictions", {})
        market_velocity = predictions.get("market_velocity", {})

        rising = market_velocity.get("rising", [])
        if rising:
            return f"Rising skill: {rising[0]}"

        analysis = research_data.get("analysis", {})
        trends = analysis.get("emerging_trends", [])
        if trends:
            return f"Trend: {trends[0]}"

        skills = analysis.get("top_skills", [])
        if skills:
            return f"Key skill: {skills[0]}"

        return "General market analysis"

    async def _analyze_tournament_patterns(self, scored_results: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Analyzes patterns across all tournament participants to extract insights.
        """
        if not scored_results:
            return {"patterns": [], "consensus_insights": []}

        try:
            # Extract all skills and trends from all agents
            all_skills = []
            all_trends = []
            strategy_performance = {}

            for result in scored_results:
                strategy = result["agent_strategy"]
                research_data = result["research_data"]

                analysis = research_data.get("analysis", {})
                skills = analysis.get("top_skills", [])
                trends = analysis.get("emerging_trends", [])

                all_skills.extend(skills)
                all_trends.extend(trends)
                strategy_performance[strategy] = result["score"]

            # Find consensus (skills mentioned by multiple agents)
            skill_counts = {}
            for skill in all_skills:
                skill_counts[skill] = skill_counts.get(skill, 0) + 1

            consensus_skills = [skill for skill, count in skill_counts.items() if count >= 2]

            # Strategy analysis
            best_strategy = max(strategy_performance.items(), key=lambda x: x[1])

            return {
                "consensus_skills": consensus_skills[:5],  # Top 5 agreed-upon skills
                "total_unique_skills": len(set(all_skills)),
                "total_unique_trends": len(set(all_trends)),
                "best_performing_strategy": best_strategy[0],
                "strategy_performance_variance": round(
                    sum(strategy_performance.values()) / len(strategy_performance), 2
                ),
                "tournament_insights": [
                    f"Consensus on {len(consensus_skills)} key skills across agents",
                    f"{best_strategy[0]} strategy outperformed others (score: {best_strategy[1]})",
                    f"Agents identified {len(set(all_trends))} unique market trends"
                ]
            }

        except Exception as e:
            logging.error(f"Tournament pattern analysis failed: {e}")
            return {"patterns": [], "consensus_insights": [], "error": str(e)}