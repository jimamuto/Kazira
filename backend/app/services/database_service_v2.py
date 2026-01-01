from sqlmodel import Session, select, col
from app.core.db import get_session
from app.models.roadmap import AgentState, ThoughtSignature, MarathonSession, JobListing, UserProgress
from typing import List, Dict, Any, Optional, Union
import logging
from datetime import datetime, timedelta

class DatabaseService:
    """
    PostgreSQL persistence service for Marathon Agent.
    
    Replaces file-based thought signatures with database storage.
    Enables:
    - Resume capability
    - Multi-session tracking
    - Historical analysis
    - Data persistence for judges
    """
    
    def __init__(self, user_id: str):
        self.user_id = user_id
    
    async def save_agent_state(
        self,
        agent_name: str,
        state: str,
        checkpoint_data: Dict[str, Any]
    ):
        """
        Saves current agent state to database.
        """
        try:
            with next(get_session()) as session:
                # Check for existing state
                existing = session.exec(
                    select(AgentState)
                    .where(AgentState.user_id == self.user_id)
                    .where(AgentState.agent_name == agent_name)
                ).first()
                
                if existing:
                    # Update existing
                    existing.state = state
                    existing.checkpoint_data = checkpoint_data
                    existing.timestamp = datetime.utcnow()
                else:
                    # Create new state
                    agent_state = AgentState(
                        user_id=self.user_id,
                        agent_name=agent_name,
                        state=state,
                        checkpoint_data=checkpoint_data
                    )
                    session.add(agent_state)
                
                session.commit()
                logging.info(f"[DB] Saved state for {agent_name}: {state}")
                
        except Exception as e:
            logging.error(f"[DB] Failed to save agent state: {e}")
    
    async def load_agent_state(self, agent_name: str) -> Optional[Dict[str, Any]]:
        """
        Loads current agent state from database.
        """
        try:
            with next(get_session()) as session:
                state = session.exec(
                    select(AgentState)
                    .where(AgentState.user_id == self.user_id)
                    .where(AgentState.agent_name == agent_name)
                    .order_by(col(AgentState.timestamp).desc())
                ).first()
                
                if state:
                    return {
                        "state": state.state,
                        "checkpoint_data": state.checkpoint_data,
                        "timestamp": state.timestamp.isoformat()
                    }
                return None
                
        except Exception as e:
            logging.error(f"[DB] Failed to load agent state: {e}")
            return None
    
    async def save_thought_signature(
        self,
        step: str,
        global_state: str,
        metadata: Dict[str, Any]
    ):
        """
        Saves thought signature to database (replaces file-based approach).
        """
        try:
            with next(get_session()) as session:
                signature = ThoughtSignature(
                    user_id=self.user_id,
                    step=step,
                    global_state=global_state,
                    metadata=metadata
                )
                session.add(signature)
                session.commit()
                logging.info(f"[DB] Saved thought signature: {step}")
                
        except Exception as e:
            logging.error(f"[DB] Failed to save thought signature: {e}")
    
    async def load_recent_signatures(self, limit: int = 50) -> List[Dict[str, Any]]:
        """
        Loads recent thought signatures for display/analysis.
        """
        try:
            with next(get_session()) as session:
                signatures = session.exec(
                    select(ThoughtSignature)
                    .where(ThoughtSignature.user_id == self.user_id)
                    .order_by(col(ThoughtSignature.timestamp).desc())
                    .limit(limit)
                ).all()
                
                result = []
                for sig in signatures:
                    result.append({
                        "step": sig.step,
                        "global_state": sig.global_state,
                        "metadata": sig.metadata,
                        "timestamp": sig.timestamp.isoformat()
                    })
                
                return result
                
        except Exception as e:
            logging.error(f"[DB] Failed to load signatures: {e}")
            return []
    
    async def start_marathon_session(
        self,
        career_goal: str,
        duration_hours: int
    ) -> int:
        """
        Creates a new marathon session record.
        Returns session ID.
        """
        try:
            with next(get_session()) as session:
                marathon_session = MarathonSession(
                    user_id=self.user_id,
                    career_goal=career_goal,
                    duration_hours=duration_hours,
                    status="RUNNING"
                )
                session.add(marathon_session)
                session.commit()
                session.refresh(marathon_session)
                logging.info(f"[DB] Started marathon session {marathon_session.id}")
                return marathon_session.id
                
        except Exception as e:
            logging.error(f"[DB] Failed to start session: {e}")
            return -1
    
    async def end_marathon_session(
        self,
        session_id: int,
        cycle_count: int,
        final_summary: Optional[Dict[str, Any]] = None,
        status: str = "COMPLETED"
    ):
        """
        Marks marathon session as ended.
        """
        try:
            with next(get_session()) as session:
                marathon_session = session.get(MarathonSession, session_id)
                if marathon_session:
                    marathon_session.ended_at = datetime.utcnow()
                    marathon_session.cycle_count = cycle_count
                    marathon_session.status = status
                    marathon_session.final_summary = final_summary
                    session.commit()
                    logging.info(f"[DB] Ended marathon session {session_id}: {status}")
                
        except Exception as e:
            logging.error(f"[DB] Failed to end session: {e}")
    
    async def save_job_listings(
        self,
        listings: List[Dict[str, Any]],
        source: str
    ):
        """
        Saves scraped job listings to avoid re-scraping.
        """
        try:
            with next(get_session()) as session:
                saved_count = 0
                for job_data in listings:
                    # Check for duplicates
                    existing = session.exec(
                        select(JobListing)
                        .where(JobListing.link == job_data.get("link", ""))
                    ).first()
                    
                    if not existing:
                        # Create with validation
                        job_listing = JobListing(
                            title=str(job_data.get("title", "Unknown")),
                            company=str(job_data.get("company", "Unknown")),
                            location=str(job_data.get("location", "Unknown")),
                            link=str(job_data.get("link", "")),
                            description=str(job_data.get("description", "")),
                            source=source,
                            skills_extracted=list(job_data.get("skills", []))
                        )
                        session.add(job_listing)
                        saved_count += 1
                
                session.commit()
                logging.info(f"[DB] Saved {saved_count} job listings from {source}")
                
        except Exception as e:
            logging.error(f"[DB] Failed to save job listings: {e}")
    
    async def load_recent_jobs(
        self,
        days: int = 1
    ) -> List[Dict[str, Any]]:
        """
        Loads recent job listings from database.
        """
        try:
            with next(get_session()) as session:
                cutoff_date = datetime.utcnow() - timedelta(days=days)
                
                jobs = session.exec(
                    select(JobListing)
                    .where(JobListing.scraped_at >= cutoff_date)
                    .order_by(col(JobListing.scraped_at).desc())
                    .limit(100)
                ).all()
                
                result = []
                for job in jobs:
                    result.append({
                        "id": job.id,
                        "title": job.title,
                        "company": job.company,
                        "location": job.location,
                        "link": job.link,
                        "description": job.description,
                        "source": job.source,
                        "skills": job.skills_extracted,
                        "scraped_at": job.scraped_at.isoformat()
                    })
                
                return result
                
        except Exception as e:
            logging.error(f"[DB] Failed to load jobs: {e}")
            return []
    
    async def update_user_progress(
        self,
        roadmap_id: Optional[int],
        milestone_index: int,
        quiz_score: Optional[int] = None
    ):
        """
        Updates user progress through roadmap.
        """
        try:
            with next(get_session()) as session:
                # Get or create progress record
                progress = session.exec(
                    select(UserProgress)
                    .where(UserProgress.user_id == self.user_id)
                ).first()
                
                if progress:
                    # Update existing
                    progress.last_updated = datetime.utcnow()
                    if milestone_index not in progress.milestone_completed:
                        progress.milestone_completed.append(milestone_index)
                    if quiz_score is not None:
                        progress.quiz_scores[f"quiz_{milestone_index}"] = quiz_score
                    progress.verification_attempts += 1
                else:
                    # Create new progress
                    progress = UserProgress(
                        user_id=self.user_id,
                        roadmap_id=roadmap_id,
                        milestone_completed=[milestone_index] if milestone_index is not None else [],
                        quiz_scores={f"quiz_{milestone_index}": quiz_score} if quiz_score is not None else {},
                        verification_attempts=1
                    )
                    session.add(progress)
                
                session.commit()
                logging.info(f"[DB] Updated user progress")
                
        except Exception as e:
            logging.error(f"[DB] Failed to update progress: {e}")
    
    async def load_user_progress(self) -> Optional[Dict[str, Any]]:
        """
        Loads user progress from database.
        """
        try:
            with next(get_session()) as session:
                progress = session.exec(
                    select(UserProgress)
                    .where(UserProgress.user_id == self.user_id)
                    .order_by(col(UserProgress.last_updated).desc())
                ).first()
                
                if progress:
                    return {
                        "roadmap_id": progress.roadmap_id,
                        "milestone_completed": progress.milestone_completed,
                        "quiz_scores": progress.quiz_scores,
                        "verification_attempts": progress.verification_attempts,
                        "last_updated": progress.last_updated.isoformat()
                    }
                return None
                
        except Exception as e:
            logging.error(f"[DB] Failed to load progress: {e}")
            return None
