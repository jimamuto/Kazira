from app.schemas.roadmap import RoadmapInput, RoadmapOutput
from app.services.gemini_client import gemini_client
from app.services.result_storage import store_roadmap_result
from app.models.roadmap import Roadmap
from app.agents.execution_agent import ExecutionAgent
from typing import List

class RoadmapService:
    async def create_roadmap(self, input_data: RoadmapInput) -> str:
        # 1. Generate roadmap using mock (Gemini temporarily disabled)
        roadmap_output = await gemini_client.generate_roadmap(input_data)

        # 2. Skip execution agent for now to avoid timeouts
        # TODO: Re-enable execution agent when performance is optimized

        # 3. Store the result and return the ID
        result_data = roadmap_output.dict()
        result_id = store_roadmap_result(result_data)
        return result_id

    async def get_history(self) -> List[dict]:
        # Return persisted history
        from app.services.result_storage import get_all_results
        return get_all_results()

roadmap_service = RoadmapService()
