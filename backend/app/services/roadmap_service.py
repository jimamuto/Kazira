from app.schemas.roadmap import RoadmapInput, RoadmapOutput
from app.services.gemini_client import gemini_client
from app.models.roadmap import Roadmap
from typing import List

class RoadmapService:
    async def create_roadmap(self, input_data: RoadmapInput) -> RoadmapOutput:
        # 1. Generate roadmap using Gemini
        roadmap_output = await gemini_client.generate_roadmap(input_data)
        
        # 2. Logic to save to DB would go here (using Repository)
        # roadmap_record = Roadmap(
        #     title=f"{input_data.target_role} Roadmap for {input_data.name or 'User'}",
        #     input_data=input_data.dict(),
        #     output_data=roadmap_output.dict()
        # )
        
        return roadmap_output

    async def get_history(self) -> List[Roadmap]:
        # Mocking history for now
        return []

roadmap_service = RoadmapService()
