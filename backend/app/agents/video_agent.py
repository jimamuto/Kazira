import logging
import os
from pathlib import Path
from fastapi import UploadFile
from typing import Dict, Any
from app.services.gemini_client import gemini_client

class VideoAgent:
    """
    Analyzes elevator pitch videos to provide feedback on soft skills.
    Fulfills 'Spatial-Temporal Video Understanding' criteria.
    """
    def __init__(self):
        self.name = "VideoAgent"
        
    async def analyze_pitch(self, video_file: UploadFile) -> Dict[str, Any]:
        logging.info(f"📹 VideoAgent: Analyzing pitch from {video_file.filename}")
        
        # Save temp file
        import tempfile
        suffix = Path(video_file.filename).suffix
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            content = await video_file.read()
            tmp.write(content)
            tmp_path = tmp.name
            
        try:
            prompt = """
            Analyze this elevator pitch video. 
            Act as a Career Coach. Evaluate:
            1. Communication Clarity
            2. Confidence & Body Language
            3. Content Relevance (is it concise?)
            
            Return JSON:
            {
                "score": 0-100,
                "strengths": ["list"],
                "improvements": ["list"],
                "verdict": "Detailed paragraph feedback"
            }
            """
            
            result_json_str = await gemini_client.analyze_video(tmp_path, prompt)
            import json
            return json.loads(result_json_str)
            
        except Exception as e:
            logging.error(f"Video analysis failed: {e}")
            return {"error": str(e)}
        finally:
            # Clean up
            if os.path.exists(tmp_path):
                os.unlink(tmp_path)
