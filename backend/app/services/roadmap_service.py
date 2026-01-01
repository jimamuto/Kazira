from app.schemas.roadmap import RoadmapInput, RoadmapOutput
from app.services.gemini_client import gemini_client
from app.models.roadmap import Roadmap
from app.agents.execution_agent import ExecutionAgent
from typing import List

class RoadmapService:
    async def create_roadmap(self, input_data: RoadmapInput) -> RoadmapOutput:
        # 1. Generate roadmap using Gemini
        roadmap_output = await gemini_client.generate_roadmap(input_data)
        
        # 2. Generate initial execution schedule using ExecutionAgent
        execution_agent = ExecutionAgent()
        # Pass the generated roadmap in a dict format that ExecutionAgent expects
        roadmap_dict = roadmap_output.dict()
        schedule_data = await execution_agent.generate_schedule(
            roadmap_dict, 
            input_data.hours_per_week,
            input_data.constraints
        )
        
        from app.schemas.roadmap import ExecutionSchedule, ExecutionSprint
        sprints = []
        for s in schedule_data.get("sprints", []):
            sprints.append(ExecutionSprint(**s))

        roadmap_output.execution_schedule = ExecutionSchedule(
            sprints=sprints,
            active_sprint_index=0
        )

        return roadmap_output

    async def get_history(self) -> List[Roadmap]:
        # Mocking history for now
        return []

roadmap_service = RoadmapService()
