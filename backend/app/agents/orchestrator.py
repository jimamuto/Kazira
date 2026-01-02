import logging
import datetime
import json
import os
import asyncio
from pathlib import Path
from typing import List, Dict, Any, Optional
from .research_agent import ResearchAgent
from .planning_agent import PlanningAgent
from .execution_agent import ExecutionAgent
from .verification_agent import VerificationAgent
from .tournament_orchestrator import TournamentOrchestrator
from .agent_message_bus import AgentMessageBus
from app.services.database_service import DatabaseService
from app.services.career_velocity_engine import CareerVelocityEngine
from app.services.strategic_career_pathing import StrategicCareerPathing
from app.services.mission_control import MissionControl

class CareerOrchestrator:
    """
    MARATHON AGENT: The central coordinator for Autonomous Career Agent system.
    
    Runs continuously for 72+ hours, periodically checking for:
    - New job listings (every 30 minutes)
    - Market trend changes
    - User progress updates
    - Dynamic roadmap adjustments
    """
    
    def __init__(self, user_id: str, career_goal: str, location: str = "Global"):
        self.user_id = user_id
        self.career_goal = career_goal
        self.location = location
        self.state = "IDLE"
        self.is_running = False
        self.check_interval = 1800  # 30 minutes in seconds
        self.session_duration = 259200  # 72 hours in seconds
        self.session_start_time: Optional[datetime.datetime] = None
        self.cycle_count = 0
        
        self.context = {
            "user_id": user_id,
            "goal": career_goal,
            "research_data": None,
            "roadmap": None,
            "resources": None,
            "verification_results": None,
            "previous_job_count": 0,
            "market_trend_history": []
        }
        
        self.thought_signatures: List[Dict[str, Any]] = []
        self.signature_path = Path(f"thought_signatures_{user_id}.json")
        
        # Initialize services
        self.db = DatabaseService(user_id)
        self.message_bus = AgentMessageBus()
        self.agents = {
            "research": ResearchAgent(),
            "planning": PlanningAgent(),
            "execution": ExecutionAgent(),
            "verification": VerificationAgent()
        }

    async def run_pipeline(self, constraints: Optional[Dict[str, Any]] = None, tournament_mode: bool = False, multi_market: bool = False):
        """
        Executes full agentic pipeline with dynamic adjustment.
        EXTRAORDINARY: Optional tournament mode and multi-market intelligence.
        """
        logging.info(f"🧠 Orchestrator: Starting pipeline for {self.career_goal}")
        logging.debug(f"Pipeline config: tournament_mode={tournament_mode}, multi_market={multi_market}, constraints={constraints}")

        try:
            # 1. Research (with optional tournament or multi-market mode)
            if tournament_mode:
                logging.info("🏆 Running research in TOURNAMENT MODE")
                logging.debug(f"Tournament config: goal={self.career_goal}, location={self.location}")
                tournament_orchestrator = TournamentOrchestrator()
                self.context["research_data"] = await tournament_orchestrator.run_tournament(
                    self.career_goal, self.location
                )
                logging.debug(f"Tournament results: winner={self.context['research_data'].get('winner_strategy', 'unknown')}")
            else:
                logging.debug("Running standard research phase")
                self.context["research_data"] = await self._run_research(multi_market)

            # 2. Planning
            self.context["roadmap"] = await self._run_planning(self.context["research_data"], constraints or {})

            # 3. Execution
            execution_data = await self._run_execution(self.context["roadmap"], constraints or {})
            self.context["resources"] = execution_data["resources"]
            self.context["schedule"] = execution_data["schedule"]

            # 4. Verification
            self.context["verification_results"] = await self._run_verification(self.context["roadmap"])

            # EXTRAORDINARY: Calculate Career Velocity Metrics
            velocity_engine = CareerVelocityEngine(self.user_id)
            user_progress = await self.db.load_user_progress()
            self.context["velocity_metrics"] = await velocity_engine.calculate_velocity_metrics(
                self.context["roadmap"], user_progress or {}
            )

            # EXTRAORDINARY: Generate Strategic Career Trajectory
            career_pathing = StrategicCareerPathing()
            current_role = "Junior Developer"  # Could be extracted from user profile
            target_role = "Senior " + self.career_goal.split()[-1]  # Extract role from goal
            self.context["career_trajectory"] = await career_pathing.generate_career_trajectory(
                current_role, target_role,
                self.context["velocity_metrics"],  # Skills profile from velocity metrics
                self.context["research_data"],    # Market intelligence
                self.context["velocity_metrics"]   # Velocity metrics
            )

            # 5. Dynamic Adjustment Loop
            score = self.context["verification_results"].get("overall_score", 0)
            adjustment = await self._adjust_roadmap(self.context["roadmap"], score)
            self.context["suggested_adjustment"] = adjustment

            self.state = "COMPLETED"
            await self.save_thought_signature("PIPELINE_COMPLETE", {
                "status": "success",
                "tournament_mode": tournament_mode,
                "multi_market_enabled": multi_market
            })
            return self.context

        except Exception as e:
            self.state = "FAILED"
            logging.error(f"Pipeline failed at state {self.state}: {e}")
            await self.save_thought_signature("FAILURE_LOG", {
                "error": str(e),
                "tournament_mode": tournament_mode,
                "multi_market_enabled": multi_market
            })
            raise

    async def _run_research(self, multi_market: bool = False):
        logging.info("🔍 Starting research phase")
        logging.debug(f"Research config: multi_market={multi_market}, goal={self.career_goal}, location={self.location}")
        self.state = "RESEARCHING"
        agent = ResearchAgent()
        data = await agent.research(self.career_goal, self.location, multi_market)
        logging.info(f"✅ Research completed: {len(data.get('listings', []))} listings analyzed")
        logging.debug(f"Research data keys: {list(data.keys())}")
        await self.save_thought_signature("RESEARCH_COMPLETE", {
            "jobs_analyzed": len(data.get("listings", [])),
            "multi_market_enabled": multi_market,
            "arbitrage_opportunities": len(data.get("multi_market_intelligence", {}).get("arbitrage_opportunities", []))
        })
        return data

    async def _run_planning(self, research_data: Dict[str, Any], constraints: Dict[str, Any]):
        logging.info("📋 Starting planning phase")
        logging.debug(f"Planning input: research_data_keys={list(research_data.keys())}, constraints={constraints}")
        self.state = "PLANNING"
        agent = PlanningAgent()
        roadmap = await agent.create_roadmap(self.career_goal, research_data, constraints)
        logging.info(f"✅ Planning completed: {len(roadmap.get('months', []))} months planned")
        logging.debug(f"Roadmap structure: {len(roadmap.get('months', []))} months, {len(roadmap.get('milestones', []))} milestones")
        await self.save_thought_signature("PLAN_GENERATED", {"milestones": len(roadmap.get("milestones", []))})
        return roadmap

    async def _run_execution(self, roadmap: Dict[str, Any], constraints: Dict[str, Any]):
        logging.info("⚡ Starting execution phase")
        logging.debug(f"Execution config: hours_per_week={constraints.get('hours_per_week', 10) if constraints else 10}")
        self.state = "EXECUTING"
        agent = ExecutionAgent()
        hours = constraints.get("hours_per_week", 10) if constraints else 10
        resources = await agent.find_resources(roadmap)
        schedule = await agent.generate_schedule(roadmap, hours)
        logging.info(f"✅ Execution completed: {len(resources)} resources found, {len(schedule.get('sprints', []))} sprints scheduled")
        logging.debug(f"Schedule: {len(schedule.get('sprints', []))} sprints, {len(schedule.get('active_sprint_index', 0))} active sprint")
        await self.save_thought_signature("EXECUTION_COMPLETE", {"resources_found": len(resources), "daily_tasks": len(schedule.get("days", []))})
        return {"resources": resources, "schedule": schedule}

    async def _run_verification(self, roadmap: Dict[str, Any]):
        logging.info("🔍 Starting verification phase")
        logging.debug(f"Verification input: roadmap_months={len(roadmap.get('months', []))}")
        self.state = "VERIFYING"
        agent = VerificationAgent()
        results = await agent.verify_skills(roadmap)
        logging.info(f"✅ Verification completed: {len(results)} skills verified")
        logging.debug(f"Verification results: gaps_found={len(results.get('skill_gaps', []))}")
        await self.save_thought_signature("VERIFICATION_COMPLETE", {"quiz_ready": "quiz" in results, "interview_ready": "mock_interview" in results})
        return results

    async def _adjust_roadmap(self, roadmap: Dict[str, Any], score: int):
        self.state = "ADJUSTING"
        agent = VerificationAgent()
        adjustment = await agent.suggest_roadmap_adjustments(roadmap, score)
        await self.save_thought_signature("ROADMAP_ADJUSTED", {"recommendation": adjustment.get("recommendation")})
        return adjustment

    async def save_thought_signature(self, step: str, metadata: Dict[str, Any]):
        """
        Saves a checkpoint for resume capability and demo logging.
        """
        signature = {
            "step": step,
            "metadata": metadata,
            "timestamp": datetime.datetime.now().isoformat(),
            "global_state": self.state
        }
        self.thought_signatures.append(signature)
        
        # Persist to disk
        try:
            with open(self.signature_path, "w") as f:
                json.dump(self.thought_signatures, f, indent=4)
            print(f"[Thought Signature] {step} saved to {self.signature_path}")
        except Exception as e:
            logging.error(f"Failed to persist thought signature: {e}")

    def load_last_signature(self):
        """
        Resumes logic by loading the last saved signature.
        """
        if self.signature_path.exists():
            with open(self.signature_path, "r") as f:
                self.thought_signatures = json.load(f)
                return self.thought_signatures[-1] if self.thought_signatures else None
        return None
    
    async def start_marathon_session(
        self,
        constraints: Optional[Dict[str, Any]] = None,
        duration_hours: int = 72,
        check_interval_minutes: int = 30,
        tournament_mode: bool = False
    ):
        """
        MARATHON MODE: Runs continuously for specified duration.
        
        Key differences from run_pipeline:
        - Runs in background for hours/days, not minutes
        - Periodically checks for new job listings
        - Auto-updates roadmap based on market changes
        - Agents communicate dynamically via message bus
        - Self-corrects on failures
        - Persists all state to database
        
        Args:
            constraints: User constraints (hours_per_week, skill_level, etc.)
            duration_hours: How long to run the marathon (default 72)
            check_interval_minutes: How often to wake up and check (default 30)
        """
        self.is_running = True
        self.session_start_time = datetime.datetime.now()
        self.session_duration = duration_hours * 3600  # Convert to seconds
        self.check_interval = check_interval_minutes * 60
        
        await self.save_thought_signature("MARATHON_SESSION_STARTED", {
            "duration_hours": duration_hours,
            "check_interval_minutes": check_interval_minutes,
            "goal": self.career_goal
        })
        
        mission_ctl = MissionControl.get_instance()
        mission_ctl.log_event("MARATHON", f"🏃 SESSION STARTED | Goal: {self.career_goal}")
        
        # Start message bus router
        message_bus_task = asyncio.create_task(self.message_bus.start_router())
        
        # Subscribe agents to message bus
        for agent_name, agent in self.agents.items():
            if hasattr(agent, 'handle_message'):
                self.message_bus.subscribe(agent_name, agent.handle_message)
        
            # Initial pipeline run
        mission_ctl.log_event("ORCHESTRATOR", f"Running initial pipeline... (Tournament Mode: {tournament_mode})")
        initial_context = await self.run_pipeline(constraints or {}, tournament_mode)
        
        # Main marathon loop
        mission_ctl.log_event("MARATHON", "Starting continuous monitoring loop...")
        marathon_task = asyncio.create_task(self._marathon_loop(constraints))
        
        # Run until session ends
        try:
            await marathon_task
        except asyncio.CancelledError:
             mission_ctl.log_event("MARATHON", "Session cancelled by user")
        finally:
            self.is_running = False
            message_bus_task.cancel()
            await self.save_thought_signature("MARATHON_SESSION_ENDED", {
                "total_cycles": self.cycle_count,
                "duration": str(datetime.datetime.now() - self.session_start_time)
            })
            mission_ctl.log_event("MARATHON", "🏁 MARATHON SESSION ENDED 🏁")
    
    async def _marathon_loop(self, constraints: Optional[Dict[str, Any]]):
        """
        Main marathon loop that periodically wakes up to:
        1. Check for new job listings
        2. Analyze market changes
        3. Update roadmap if needed
        4. Communicate with agents via message bus
        5. Self-correct on failures
        """
        mission_ctl = MissionControl.get_instance()
        
        while self.is_running:
            try:
                self.cycle_count += 1
                if self.session_start_time is None:
                    self.session_start_time = datetime.datetime.now()
                elapsed = (datetime.datetime.now() - self.session_start_time).total_seconds()
                
                # Check if session duration exceeded
                if elapsed >= self.session_duration:
                    mission_ctl.log_event("MARATHON", f"Session duration reached ({self.session_duration/3600}h)")
                    break
                
                mission_ctl.log_event("MARATHON", f"Cycle #{self.cycle_count} | Elapsed: {elapsed/3600:.2f}h")
                
                # 1. Check for new job listings
                await self._check_market_updates()
                
                # 2. Check user progress and adjust
                await self._check_user_progress()
                
                # 3. Process any pending agent messages
                pending_messages = self.message_bus.get_recent_messages(5)
                if pending_messages:
                    mission_ctl.log_event("MESSAGE_BUS", f"Processing {len(pending_messages)} agent messages...")
                
                # Wait for next cycle
                mission_ctl.log_event("MARATHON", f"Sleeping for {self.check_interval/60} minutes...")
                await asyncio.sleep(self.check_interval)
                
            except Exception as e:
                logging.error(f"[Marathon] Error in cycle {self.cycle_count}: {e}")
                mission_ctl.log_event("ERROR", f"Marathon Cycle Error: {str(e)}")
                await self.save_thought_signature("MARATHON_CYCLE_ERROR", {
                    "cycle": self.cycle_count,
                    "error": str(e)
                })
                # Continue despite error (self-correction)
                await asyncio.sleep(60)  # Wait 1 minute before retry
    
    async def _check_market_updates(self):
        """
        Checks for new job listings and market changes.
        If significant changes detected, triggers agent negotiation.
        """
        mission_ctl = MissionControl.get_instance()
        mission_ctl.log_event("MARKET_WATCH", "Checking for new job listings...")
        
        # Re-run research to get fresh data
        research_agent = self.agents["research"]
        new_research_data = await research_agent.research(self.career_goal, self.location)
        
        # Compare with previous data
        previous_count = self.context.get("previous_job_count", 0)
        new_count = len(new_research_data.get("listings", []))
        
        job_change = new_count - previous_count
        
        mission_ctl.log_event("ANALYSIS", f"Job Delta: {previous_count} -> {new_count} ({job_change})")
        
        # Detect market shifts
        if abs(job_change) > 5:  # More than 5 jobs added/removed
            mission_ctl.log_event("ALERT", "⚠️ Significant Market Shift Detected!")
            
            # Send URGENT message to Planning Agent
            await self.message_bus.send_message(
                from_agent="ResearchAgent",
                to_agent="PlanningAgent",
                message_type="MARKET_SHIFT",
                data={
                    "job_delta": job_change,
                    "new_trends": new_research_data.get("analysis", {}).get("emerging_trends", []),
                    "priority": "HIGH"
                },
                priority="URGENT"
            )
            
            await self.save_thought_signature("MARKET_SHIFT_DETECTED", {
                "job_delta": job_change,
                "new_trends": new_research_data.get("analysis", {}).get("emerging_trends", [])
            })

            # TRIGGER SELF-CORRECTION
            mission_ctl.log_event("SELF_CORRECTION", "🛠️ Initiating Self-Correction Sequence...")
            planning_agent = self.agents["planning"]
            current_roadmap = self.context.get("roadmap", {})
            
            if current_roadmap:
                updated_roadmap = await planning_agent.adjust_roadmap(
                    current_roadmap, 
                    {
                        "new_trends": new_research_data.get("analysis", {}).get("emerging_trends", []),
                        "job_delta": job_change
                    },
                    score=self.context.get("verification_results", {}).get("overall_score", 0.0)
                )
                
                self.context["roadmap"] = updated_roadmap
                self.context["roadmap_version"] = self.context.get("roadmap_version", 1) + 1
                
                mission_ctl.log_event("SUCCESS", f"✅ Roadmap Self-Corrected (v{self.context['roadmap_version']})")
                await self.save_thought_signature("ROADMAP_SELF_CORRECTED", {
                    "version": self.context["roadmap_version"],
                    "changes": "Updated based on market shift"
                })

        
        # Update context
        self.context["research_data"] = new_research_data
        self.context["previous_job_count"] = new_count
        
        # Track trend history
        self.context["market_trend_history"].append({
            "timestamp": datetime.datetime.now().isoformat(),
            "job_count": new_count,
            "trends": new_research_data.get("analysis", {}).get("emerging_trends", [])
        })
    
    async def _check_user_progress(self):
        """
        Checks user progress and adjusts roadmap accordingly.
        In production, this would read from database user_progress table.
        For now, we simulate progress checking.
        """
        # mission_ctl = MissionControl.get_instance()
        # mission_ctl.log_event("PROGRESS", "Checking user progress...")
        
        # In production, load from database:
        # user_progress = await db.get_user_progress(self.user_id)
        # completed_milestones = user_progress.get("completed_milestones", [])
        # quiz_scores = user_progress.get("quiz_scores", [])
        
        # For demo, we just log
        await self.save_thought_signature("PROGRESS_CHECK", {
            "cycle": self.cycle_count,
            "status": "checking"
        })
    
    async def stop_marathon_session(self):
        """
        Gracefully stops the marathon session.
        """
        self.is_running = False
        MissionControl.get_instance().log_event("MARATHON", "Stopping session...")
        await self.save_thought_signature("MARATHON_STOP_REQUESTED", {})

if __name__ == "__main__":
    import asyncio
    
    # Demo: Run marathon session for 5 minutes (in production, use 72 hours)
    orchestrator = CareerOrchestrator(
        user_id="demo_user_marathon",
        career_goal="Senior Python Backend Developer"
    )
    
    # Run marathon for 5 minutes (for demo purposes)
    asyncio.run(orchestrator.start_marathon_session(
        duration_hours=int(0.08),  # 5 minutes
        check_interval_minutes=1  # Check every minute for demo
    ))


