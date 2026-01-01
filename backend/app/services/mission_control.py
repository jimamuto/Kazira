import asyncio
import logging
import json
import random
from datetime import datetime
from typing import List, Dict, Any, Optional

# Singleton instance
_mission_control = None

class MissionControl:
    def __init__(self):
        self.is_running = False
        self.mission_logs: List[Dict[str, Any]] = []
        self.last_scrape_time = None
        self.scrape_interval = 30 # Seconds (for demo purposes, usually hours)
        self.active_mission_id = "MISSION_ALPHA_001"
        self._loop_task = None

    @classmethod
    def get_instance(cls):
        global _mission_control
        if _mission_control is None:
            _mission_control = MissionControl()
        return _mission_control

    def start_loop(self):
        if self.is_running:
            return
        self.is_running = True
        self.log_event("SYSTEM", "Mission Control loop initiated. autonomous_mode=ENABLED")
        self._loop_task = asyncio.create_task(self._run_loop())

    def stop_loop(self):
        self.is_running = False
        self.log_event("SYSTEM", "Mission Control loop paused.")
        if self._loop_task:
            self._loop_task.cancel()

    def log_event(self, source: str, message: str, metadata: Dict = None):
        """
        Logs an event to the mission log.
        This provides the data source for the frontend Live Terminal.
        """
        event = {
            "timestamp": datetime.now().isoformat(),
            "source": source,
            "message": message,
            "metadata": metadata or {}
        }
        self.mission_logs.append(event)
        # Keep log size manageable
        if len(self.mission_logs) > 100:
            self.mission_logs.pop(0)
        logging.info(f"[{source}] {message}")

    async def _run_loop(self):
        logging.info("Mission Control background loop started.")
        while self.is_running:
            try:
                await self.tick()
                await asyncio.sleep(5) # Tick every 5 seconds
            except asyncio.CancelledError:
                break
            except Exception as e:
                logging.error(f"Error in Mission Control loop: {e}")
                self.log_event("ERROR", f"Critical loop failure: {str(e)}")
                await asyncio.sleep(5) # Backoff on error

    async def tick(self):
        # 1. Check if scraping is due
        now = datetime.now()
        if not self.last_scrape_time or (now - self.last_scrape_time).total_seconds() > self.scrape_interval:
            await self.execute_autonomous_scrape()
            self.last_scrape_time = now

    async def execute_autonomous_scrape(self):
        self.log_event("MONITOR", "Initiating scheduled market surveillance...", {"target": "Nairobi_Tech_Cluster"})
        
        # Simulate scraping delay
        await asyncio.sleep(2)
        self.log_event("RESEARCH_AGENT", "Scraping LinkedIn & Indeed [background_mode]...")
        
        # In a real app, we'd call the actual scrapers here.
        # For the hackathon "Marathon" demo, we'll simulate a finding periodically.
        
        import random
        if random.random() > 0.7: # 30% chance to find something new
            self.trigger_adaptation()
        else:
            self.log_event("ANALYSIS", "No significant market shifts detected. Maintaining current roadmap.")

    def trigger_adaptation(self):
        emerging_skills = ["Qdrant", "CrewAI", "LangGraph", "Supabase Edge Functions"]
        new_skill = random.choice(emerging_skills)
        
        self.log_event("ALERT", f"Detected emerging skill spike: '{new_skill}' (+240% DoD)")
        self.log_event("PLANNING_AGENT", f"Calculating impact on existing roadmap...")
        self.log_event("DECISION", f"Auto-injecting module '{new_skill}' into Phase 3.")
        
        # Here we would actually update the User's Roadmap object in DB
