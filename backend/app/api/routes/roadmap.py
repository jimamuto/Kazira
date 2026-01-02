from fastapi import APIRouter, HTTPException, UploadFile, File
from app.schemas.roadmap import RoadmapInput, RoadmapOutput, QuickRoadmapInput
from app.services.roadmap_service import roadmap_service
from typing import List
import re
import json

router = APIRouter()

@router.post("/generate")
async def generate_roadmap(input_data: RoadmapInput):
    try:
        result_id = await roadmap_service.create_roadmap(input_data)
        return {"result_id": result_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate-quick")
async def generate_quick_roadmap(input_data: QuickRoadmapInput):
    try:
        full_input = RoadmapInput(
            target_role=input_data.target_role,
            location=input_data.location,
            current_status=input_data.current_status,
            skills=input_data.skills,
            timeframe_months=input_data.timeframe_months,
            constraints=input_data.constraints,
            skill_level="intermediate",
            hours_per_week=20
        )
        result_id = await roadmap_service.create_roadmap(full_input)
        return {"result_id": result_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/extract-skills")
async def extract_skills(cv: UploadFile = File(...)):
    try:
        content = await cv.read()
        text = content.decode("utf-8", errors="ignore")

        # Debug: Log first 500 chars
        print(f"CV text preview: {text[:500]}...")

        # Split into lines for section detection
        lines = text.split('\n')

        # Look for skills sections more aggressively
        skills_section_patterns = [
            r'(?i)skill[s]?[:\s-]',
            r'(?i)technolog[y|ies][:\s-]',
            r'(?i)tech[nology]*\s*stack[:\s-]',
            r'(?i)proficienc[y|ies][:\s-]',
            r'(?i)competenc[y|ies][:\s-]',
            r'(?i)tool[s]?[:\s-]',
            r'(?i)language[s]?[:\s-]',
            r'(?i)framework[s]?[:\s-]',
            r'(?i)database[s]?[:\s-]',
            r'(?i)programming[:\s-]',
            r'(?i)technical[:\s-]',
        ]

        section_end_patterns = [
            r'(?i)^#+\s*\w+', r'(?i)^\w+[:\s]+\d{4}',
            r'(?i)^(education|experience|projects|work|internship|volunteer|certificates|awards|references|contact|personal)',
        ]

        in_skills_section = False
        skills_lines = []

        for line in lines:
            line_lower = line.lower().strip()

            # Check if this line starts a skills section
            for pattern in skills_section_patterns:
                if re.search(pattern, line_lower):
                    print(f"Found skills section header: {line.strip()}")
                    in_skills_section = True
                    break

            if in_skills_section:
                # Check if this line ends the section
                for end_pattern in section_end_patterns:
                    if re.match(end_pattern, line_lower):
                        print(f"Found section end: {line.strip()}")
                        in_skills_section = False
                        break

                if in_skills_section and line.strip():
                    skills_lines.append(line.strip())

        all_skills_text = ' '.join(skills_lines)
        print(f"Extracted skills section text: {all_skills_text[:300]}...")

        # Comprehensive skills database
        skills_database = {
            'languages': {
                'python': ['python', 'py'],
                'javascript': ['javascript', 'js', 'ecmascript'],
                'typescript': ['typescript', 'ts'],
                'java': ['java'],
                'csharp': ['c#', 'c sharp', 'csharp'],
                'cpp': ['c++', 'cpp'],
                'go': ['go', 'golang'],
                'rust': ['rust'],
                'ruby': ['ruby'],
                'php': ['php'],
                'swift': ['swift'],
                'kotlin': ['kotlin'],
                'scala': ['scala'],
                'r': ['r', 'rlang'],
                'matlab': ['matlab'],
                'shell': ['shell', 'bash', 'zsh', 'powershell'],
                'sql': ['sql'],
                'html': ['html', 'html5'],
                'css': ['css', 'css3'],
                'solidity': ['solidity'],
                'dart': ['dart'],
            },
            'frameworks': {
                'react': ['react', 'reactjs', 'react.js'],
                'vue': ['vue', 'vuejs'],
                'angular': ['angular'],
                'django': ['django'],
                'flask': ['flask'],
                'spring': ['spring', 'spring boot'],
                'laravel': ['laravel'],
                'express': ['express', 'expressjs'],
                'nextjs': ['next.js', 'nextjs'],
                'nestjs': ['nestjs', 'nest.js'],
                'fastapi': ['fastapi'],
                'dotnet': ['.net', 'dotnet', 'asp.net'],
                'flutter': ['flutter'],
                'electron': ['electron'],
            },
            'databases': {
                'postgresql': ['postgresql', 'postgres'],
                'mysql': ['mysql'],
                'mongodb': ['mongodb', 'mongo'],
                'redis': ['redis'],
                'elasticsearch': ['elasticsearch'],
                'dynamodb': ['dynamodb', 'dynamo'],
                'firebase': ['firebase'],
                'sqlite': ['sqlite'],
            },
            'cloud_devops': {
                'aws': ['aws', 'amazon web services'],
                'azure': ['azure'],
                'gcp': ['gcp', 'google cloud'],
                'docker': ['docker'],
                'kubernetes': ['kubernetes', 'k8s'],
                'terraform': ['terraform'],
                'jenkins': ['jenkins'],
                'ansible': ['ansible'],
                'git': ['git', 'github', 'gitlab'],
            },
            'ml_ai': {
                'tensorflow': ['tensorflow'],
                'pytorch': ['pytorch', 'torch'],
                'pandas': ['pandas'],
                'numpy': ['numpy'],
                'scikit-learn': ['scikit-learn', 'sklearn'],
                'machine learning': ['machine learning', 'ml'],
                'deep learning': ['deep learning'],
                'nlp': ['nlp', 'natural language processing'],
                'computer vision': ['computer vision', 'cv'],
                'opencv': ['opencv'],
                'keras': ['keras'],
                'matplotlib': ['matplotlib'],
            },
            'testing': {
                'jest': ['jest'],
                'pytest': ['pytest'],
                'selenium': ['selenium'],
                'cypress': ['cypress'],
                'junit': ['junit'],
                'unittest': ['unittest'],
                'playwright': ['playwright'],
            },
        }

        found_skills = set()
        text_lower = all_skills_text.lower()

        # Check for exact skill matches
        for category, skill_dict in skills_database.items():
            for canonical_name, variations in skill_dict.items():
                for variation in variations:
                    pattern = r'\b' + re.escape(variation) + r'\b'
                    if re.search(pattern, text_lower):
                        # Proper capitalization
                        found_skills.add(canonical_name.title() if len(canonical_name) > 2 else canonical_name.upper())
                        break

        # If no skills found in section, search entire document
        if len(found_skills) < 3:
            print("Few skills found in section, searching entire document...")
            text_lower_full = text.lower()
            for category, skill_dict in skills_database.items():
                for canonical_name, variations in skill_dict.items():
                    for variation in variations:
                        pattern = r'\b' + re.escape(variation) + r'\b'
                        if re.search(pattern, text_lower_full):
                            found_skills.add(canonical_name.title() if len(canonical_name) > 2 else canonical_name.upper())
                            break

        unique_skills = sorted(list(found_skills))
        print(f"Found skills: {unique_skills}")
        return {"skills": unique_skills}

    except Exception as e:
        print(f"Error extracting skills: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/history")
async def get_history():
    return await roadmap_service.get_history()

@router.post("/execute-roadmap")
async def execute_roadmap(data: dict | None = None):
    """Generate detailed learning resources, tasks, and schedule for a roadmap"""
    try:
        from app.services.result_storage import get_roadmap_result
        from app.services.gemini_client import gemini_client

        # Handle OPTIONS preflight requests
        if data is None:
            return {"status": "ok"}

        result_id = data.get("result_id") if isinstance(data, dict) else str(data)
        if not result_id:
            raise HTTPException(status_code=400, detail="result_id is required")

        # Fetch roadmap data
        roadmap = get_roadmap_result(result_id)
        if not roadmap:
            raise HTTPException(status_code=404, detail="Roadmap not found")

        # Generate resources for each month
        execution_plan = {
            "roadmap_id": result_id,
            "target_role": roadmap.get("target_role", "Unknown Role"),
            "months": []
        }

        months_data = roadmap.get("months", [])
        for month_data in months_data:
            # Generate specific resources for this month
            prompt = f"""Generate learning resources for Month {month_data.get('month')} of a {roadmap.get("target_role", "Unknown Role")} learning path.

**Month Title**: {month_data.get('title')}
**Skills to learn**: {', '.join(month_data.get('skills', []))}
**Key tasks**: {', '.join(month_data.get('tasks', []))}

Generate a JSON response with:
1. At least 2-3 YouTube video resources (with real video URLs)
2. 2-3 online courses (with course URLs)
3. 1-2 documentation/resources

**Required format**:
{{
  "youtube_videos": [
    {{
      "title": "Video title",
      "url": "https://www.youtube.com/watch?v=VIDEO_ID",
      "channel": "Channel name",
      "duration": "10:25",
      "thumbnail": "https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg",
      "description": "Brief description"
    }}
  ],
  "courses": [
    {{
      "title": "Course title",
      "url": "Course URL",
      "platform": "Coursera/Udemy/etc",
      "duration": "X hours",
      "price": "Free/Paid"
    }}
  ],
  "documentation": [
    {{
      "title": "Doc title",
      "url": "URL",
      "description": "Brief description"
    }}
  ],
  "weekly_schedule": [
    {{
      "week": 1,
      "tasks": ["Task 1", "Task 2", "Task 3"],
      "estimated_hours": 10
    }}
  ]
}}

IMPORTANT: Use REAL, working URLs. For YouTube videos, use popular educational channels like:
- Traversy Media
- Programming with Mosh
- freeCodeCamp.org
- The Net Ninja
- Web Dev Simplified
- Corey Schafer
- Fireship
- FastAPI official channel
- Google Developers"""

            try:
                response = await gemini_client.generate_content_async(
                    prompt,
                    generation_config={
                        "temperature": 0.7,
                        "response_mime_type": "application/json"
                    }
                )

                response_text = response.text if hasattr(response, 'text') and response.text else str(response)
                print(f"[DEBUG] Response for month {month_data.get('month')}: {response_text[:500]}...")

                if not response_text:
                    raise ValueError("Empty response")

                month_resources = json.loads(response_text)

                # Handle list vs dict
                if isinstance(month_resources, list):
                    month_resources = month_resources[0] if len(month_resources) > 0 else {}
                elif not isinstance(month_resources, dict):
                    print(f"[ERROR] Unexpected response type: {type(month_resources)}")
                    month_resources = {}
                
                month_data = {
                    "month": month_data.get('month', 1),
                    "title": month_data.get('title', 'Month'),
                    "skills": month_data.get('skills', []),
                    "resources": month_resources,
                    "tasks": month_data.get('tasks', []),
                    "progress": 0,
                    "status": "not_started"
                }
                
                execution_plan["months"].append(month_data)
                
            except Exception as e:
                print(f"Error generating resources for month {month_data.get('month')}: {e}")
                # Add fallback resources
                month_data = {
                    "month": month_data.get('month', 1),
                    "title": month_data.get('title', 'Month'),
                    "skills": month_data.get('skills', []),
                    "resources": {
                        "youtube_videos": [
                            {
                                "title": f"Introduction to {month_data.get('skills', [''])[0] if month_data.get('skills') else 'Development'}",
                                "url": "https://www.youtube.com/watch?v=rfscVS0vtbw",
                                "channel": "freeCodeCamp.org",
                                "duration": "10:00",
                                "thumbnail": "https://img.youtube.com/vi/rfscVS0vtbw/maxresdefault.jpg",
                                "description": "Complete beginner tutorial"
                            }
                        ],
                        "courses": [
                            {
                                "title": f"{month_data.get('skills', [''])[0] if month_data.get('skills') else 'Development'} Fundamentals",
                                "url": "https://www.coursera.org/",
                                "platform": "Coursera",
                                "duration": "20 hours",
                                "price": "Free"
                            }
                        ],
                        "weekly_schedule": []
                    },
                    "tasks": month_data.get('tasks', []),
                    "progress": 0,
                    "status": "not_started"
                }
                execution_plan["months"].append(month_data)
        
        return execution_plan
        
    except Exception as e:
        print(f"Error executing roadmap: {e}")
        raise HTTPException(status_code=500, detail=str(e))
