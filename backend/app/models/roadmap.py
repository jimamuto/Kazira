from sqlmodel import SQLModel, Field, JSON, Column
from typing import Optional, Dict, Any, List
from datetime import datetime, timedelta

class Roadmap(SQLModel, table=True):
    __table_args__ = {"extend_existing": True}
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = "anonymous" # For MVP
    created_at: datetime = Field(default_factory=datetime.utcnow)
    input_data: Dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSON))
    output_data: Dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSON))
    title: str

class AgentState(SQLModel, table=True):
    """
    Stores agent state for Marathon Agent resume capability.
    """
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str
    agent_name: str  # Research, Planning, Execution, Verification
    state: str  # Current state (e.g., "RESEARCHING", "IDLE")
    checkpoint_data: Dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSON))
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        indexes = [
            ["user_id", "agent_name"],
            ["user_id", "timestamp"]
        ]

class ThoughtSignature(SQLModel, table=True):
    """
    Stores thought signatures for Marathon Agent traceability.
    """
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str
    step: str  # Pipeline step name
    global_state: str  # Overall orchestrator state
    thought_metadata: Dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSON))
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        indexes = [
            ["user_id", "timestamp"],
            ["user_id", "step"]
        ]

class MarathonSession(SQLModel, table=True):
    """
    Tracks marathon agent sessions for long-running operations.
    """
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str
    career_goal: str
    started_at: datetime = Field(default_factory=datetime.utcnow)
    ended_at: Optional[datetime] = None
    duration_hours: int  # Planned duration
    cycle_count: int = Field(default=0)  # Number of completed cycles
    status: str  # RUNNING, COMPLETED, FAILED, CANCELLED
    final_summary: Optional[Dict[str, Any]] = Field(default=None, sa_column=Column(JSON))
    
    class Config:
        indexes = [
            ["user_id", "status"],
            ["user_id", "started_at"]
        ]

class JobListing(SQLModel, table=True):
    """
    Stores scraped job listings to avoid re-scraping.
    """
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    company: str
    location: str
    link: str
    description: str = ""
    source: str  # LinkedIn, Indeed, API
    skills_extracted: List[str] = Field(default_factory=list, sa_column=Column(JSON))
    scraped_at: datetime = Field(default_factory=datetime.utcnow)
    expires_at: Optional[datetime] = None  # When to re-scrape
    
    class Config:
        indexes = [
            ["source", "scraped_at"],
            ["title", "company"]
        ]

class UserProgress(SQLModel, table=True):
    """
    Tracks user progress through roadmap.
    NO AUTH REQUIRED - anonymous users supported for demo.
    """
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = "anonymous"  # Session-based ID for demo
    roadmap_id: Optional[int] = None
    milestone_completed: List[int] = Field(default_factory=list, sa_column=Column(JSON))
    quiz_scores: Dict[str, int] = Field(default_factory=dict, sa_column=Column(JSON))
    verification_attempts: int = Field(default=0)
    last_updated: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        indexes = [
            ["user_id", "last_updated"]
        ]

class MarketPrediction(SQLModel, table=True):
    """
    EXTRAORDINARY FEATURE: Stores market prediction engine results.
    Forecasts future skill demands using Gemini 3 reasoning.
    """
    id: Optional[int] = Field(default=None, primary_key=True)
    career_goal: str
    location: str = "Global"
    predictions: Dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSON))
    market_velocity: Dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSON))
    career_strategy: Dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSON))
    risk_assessment: Dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSON))
    confidence_score: float = 0.0
    data_points_analyzed: int = 0
    generated_at: datetime = Field(default_factory=datetime.utcnow)
    expires_at: datetime = Field(default_factory=lambda: datetime.utcnow() + timedelta(days=7))  # Predictions valid for 7 days

    class Config:
        indexes = [
            ["career_goal", "location"],
            ["generated_at"],
            ["expires_at"]
        ]
