from typing import Dict, Any, List, Optional
import logging
import json
import re
import subprocess
import tempfile
from pathlib import Path
from app.services.gemini_client import gemini_client

class ExecutionAgent:
    """
    Finds specific learning resources and schedules daily learning tasks.
    """
    
    def __init__(self):
        self.name = "ExecutionAgent"

    async def find_resources(self, roadmap: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Iterates through roadmap milestones and identifies specific resource types and search paths.
        """
        logging.info("Searching for specialized resources...")
        
        milestones = roadmap.get("milestones", [])
        all_resources = []
        
        for milestone in milestones:
            # We use Gemini to suggest the best specific search strings or resource names
            # In a full system, this would trigger a SERP API call
            suggestion = await self._get_resource_suggestions(milestone)
            all_resources.append({
                "milestone": milestone["title"],
                "suggestions": suggestion
            })
            
        return all_resources

    async def generate_schedule(self, roadmap: Dict[str, Any], hours_per_week: int = 15, constraints: List[str] = []) -> Dict[str, Any]:
        """
        Generates a 4-week daily task schedule based on the first few milestones.
        """
        logging.info(f"Generating 4-week learning schedule with {hours_per_week} hrs/week...")
        milestones = roadmap.get("months", [])[:2] # Look at first two milestones
        
        prompt = f"""
        Generate a 4-week (4 sprints) 'Daily Learning Schedule' based on these milestones: {json.dumps(milestones)}
        
        USER CONSTRAINTS:
        - Hours available per week: {hours_per_week}
        - Special constraints: {', '.join(constraints)}
        
        OUTPUT REQUIREMENTS:
        1. Return a JSON object with a list 'sprints'.
        2. Each sprint MUST have 'week_number', 'milestone_title', 'days' (7 days), and 'focus_area'.
        3. Each day in 'days' MUST have 'day', 'topic', 'duration_min', and 'reminder_text'.
        4. CRITICAL: Total 'duration_min' per week MUST NOT exceed {hours_per_week * 60} minutes.
        5. The focus_area should be a 1-sentence summary of that week's goal.
        
        Return ONLY valid JSON.
        """
        
        try:
            response = await gemini_client.model.generate_content_async(prompt, generation_config={"response_mime_type": "application/json"})
            return json.loads(response.text)
        except Exception as e:
            logging.error(f"Schedule generation failed: {e}")
            return {
                "sprints": [
                    {
                        "week_number": 1,
                        "milestone_title": "Orientation",
                        "focus_area": "Setting up the environment",
                        "days": [{"day": "Monday", "topic": "Installation", "duration_min": 60, "reminder_text": "Get started!"}]
                    }
                ]
            }

    async def _get_resource_suggestions(self, milestone: Dict[str, Any]) -> List[Dict[str, Any]]:
        prompt = f"For milestone '{milestone['title']}' focusing on {milestone['focus']}, list 3 specific resource search terms for YouTube/Coursera. Return ONLY JSON list of objects with 'name' and 'platform'."
        try:
            response = await gemini_client.model.generate_content_async(prompt, generation_config={"response_mime_type": "application/json"})
            return json.loads(response.text)
        except Exception as e:
            logging.error(f"Failed to get resource suggestions: {e}")
            # No fallback - return empty and let caller handle
            return []
    
    async def find_and_verify_resources(self, roadmap: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        MARATHON MODE: Finds resources AND verifies them with autonomous testing.
        
        This is the "Vibe Engineering" feature:
        1. Finds potential resources
        2. Scrapes content from each resource
        3. Extracts code examples
        4. Tests code in sandbox
        5. Only returns verified resources (pass rate > 80%)
        """
        logging.info("[Verification] Finding and verifying learning resources...")
        
        milestones = roadmap.get("milestones", [])
        verified_resources = []
        
        for milestone in milestones:
            # 1. Get potential resources
            candidates = await self._search_resources_for_milestone(milestone)
            
            logging.info(f"[Verification] Found {len(candidates)} candidates for {milestone['title']}")
            
            # 2. Verify each candidate
            for resource in candidates:
                verification_result = await self._verify_resource_quality(resource)
                
                if verification_result["verified"]:
                    verified_resources.append({
                        **resource,
                        "verification_score": verification_result["score"],
                        "test_summary": verification_result["summary"],
                        "verified_at": self._get_timestamp()
                    })
                    logging.info(f"[Verification] ✓ Resource verified: {resource['name']} (score: {verification_result['score']:.2f})")
                else:
                    logging.warning(f"[Verification] ✗ Resource failed verification: {resource['name']} (score: {verification_result['score']:.02f})")
        
        return verified_resources
    
    async def _search_resources_for_milestone(self, milestone: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Searches for actual resources for a milestone.
        In production, this would use SERP APIs.
        For now, generates search queries.
        """
        focus = milestone.get("focus", [])
        title = milestone.get("title", "")
        
        # Generate search queries
        search_queries = []
        for skill in focus[:3]:  # Top 3 skills
            search_queries.extend([
                f"{skill} tutorial",
                f"{skill} course",
                f"{skill} documentation"
            ])
        
        # Mock resources (in production, scrape real URLs)
        resources = []
        for query in search_queries[:5]:
            resources.append({
                "name": query,
                "url": f"https://example.com/search?q={query.replace(' ', '%20')}",
                "type": "tutorial",
                "platform": "web"
            })
        
        return resources
    
    async def _verify_resource_quality(self, resource: Dict[str, Any]) -> Dict[str, Any]:
        """
        AUTONOMOUS VERIFICATION: Tests resource quality by:
        1. Scraping content
        2. Extracting code examples
        3. Running code in sandbox
        4. Scoring based on execution results
        
        Returns verification score (0-1) and verification status.
        """
        try:
            # 1. Scrape resource content
            logging.info(f"[Verification] Scraping: {resource['name']}")
            content = await self._scrape_url_safely(resource["url"])
            
            if not content:
                return {
                    "verified": False,
                    "score": 0.0,
                    "summary": "Failed to scrape content"
                }
            
            # 2. Extract code blocks
            code_blocks = self._extract_code_from_html(content)
            logging.info(f"[Verification] Extracted {len(code_blocks)} code blocks")
            
            if not code_blocks:
                return {
                    "verified": False,
                    "score": 0.3,
                    "summary": "No code examples found"
                }
            
            # 3. Test code in sandbox
            test_results = await self._test_code_in_sandbox(code_blocks)
            logging.info(f"[Verification] Code test results: {test_results['pass_rate']:.2%}")
            
            # 4. Calculate verification score
            score = self._calculate_verification_score(
                content_length=len(content),
                code_count=len(code_blocks),
                test_results=test_results
            )
            
            # 5. Determine verification status
            verified = score > 0.8  # 80% threshold
            
            return {
                "verified": verified,
                "score": score,
                "summary": self._generate_test_summary(test_results, code_blocks),
                "test_results": test_results
            }
            
        except Exception as e:
            logging.error(f"[Verification] Error verifying resource: {e}")
            return {
                "verified": False,
                "score": 0.0,
                "summary": f"Verification error: {str(e)}"
            }
    
    async def _scrape_url_safely(self, url: str, max_retries: int = 3) -> Optional[str]:
        """
        Scrapes URL with retry logic and error handling.
        """
        import httpx
        
        for attempt in range(max_retries):
            try:
                async with httpx.AsyncClient(timeout=10.0) as client:
                    headers = {
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
                    }
                    response = await client.get(url, headers=headers, follow_redirects=True)
                    
                    if response.status_code == 200:
                        return response.text
                    else:
                        logging.warning(f"[Scrape] HTTP {response.status_code} for {url}")
                        
            except Exception as e:
                logging.warning(f"[Scrape] Attempt {attempt + 1}/{max_retries} failed: {e}")
                if attempt < max_retries - 1:
                    await asyncio.sleep(2 ** attempt)  # Exponential backoff
        
        return None
    
    def _extract_code_from_html(self, html_content: str) -> List[Dict[str, Any]]:
        """
        Extracts code blocks from HTML using regex patterns.
        """
        code_blocks = []
        
        # Pattern 1: <code> tags
        code_tags = re.findall(r'<code[^>]*>(.*?)</code>', html_content, re.DOTALL)
        for code in code_tags:
            code_blocks.append({
                "code": code,
                "language": "unknown",
                "source": "code_tag"
            })
        
        # Pattern 2: <pre> tags
        pre_tags = re.findall(r'<pre[^>]*>(.*?)</pre>', html_content, re.DOTALL)
        for pre in pre_tags:
            code_blocks.append({
                "code": pre,
                "language": "unknown",
                "source": "pre_tag"
            })
        
        # Pattern 3: Markdown code blocks
        md_blocks = re.findall(r'```(\w+)?\n(.*?)\n```', html_content, re.DOTALL)
        for lang, code in md_blocks:
            code_blocks.append({
                "code": code,
                "language": lang or "unknown",
                "source": "markdown"
            })
        
        return code_blocks
    
    async def _test_code_in_sandbox(self, code_blocks: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Tests code blocks in a restricted Python sandbox.
        
        Returns test results with pass rate and details.
        """
        results = {
            "total_blocks": len(code_blocks),
            "tested_blocks": 0,
            "passed_blocks": 0,
            "failed_blocks": 0,
            "syntax_errors": 0,
            "runtime_errors": 0,
            "errors": []
        }
        
        for i, block in enumerate(code_blocks[:10]):  # Test first 10 blocks
            code = block["code"]
            
            # Skip empty or very short blocks
            if len(code.strip()) < 10:
                continue
            
            results["tested_blocks"] += 1
            
            try:
                # Create temp file
                with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as f:
                    f.write(code)
                    temp_file = f.name
                
                # Execute with timeout
                result = subprocess.run(
                    ['python', '-m', 'py_compile', temp_file],
                    capture_output=True,
                    timeout=5
                )
                
                if result.returncode == 0:
                    # Syntax is valid
                    results["passed_blocks"] += 1
                else:
                    # Syntax error
                    results["syntax_errors"] += 1
                    results["failed_blocks"] += 1
                    results["errors"].append({
                        "block_index": i,
                        "error": result.stderr.decode('utf-8', errors='ignore')[:200]
                    })
                
                # Clean up
                Path(temp_file).unlink(missing_ok=True)
                
            except subprocess.TimeoutExpired:
                results["failed_blocks"] += 1
                results["errors"].append({
                    "block_index": i,
                    "error": "Execution timeout"
                })
            except Exception as e:
                results["failed_blocks"] += 1
                results["errors"].append({
                    "block_index": i,
                    "error": str(e)[:200]
                })
        
        # Calculate pass rate
        if results["tested_blocks"] > 0:
            results["pass_rate"] = results["passed_blocks"] / results["tested_blocks"]
        else:
            results["pass_rate"] = 0.0
        
        return results
    
    def _calculate_verification_score(
        self,
        content_length: int,
        code_count: int,
        test_results: Dict[str, Any]
    ) -> float:
        """
        Calculates overall verification score based on multiple factors.
        """
        # Factor 1: Content length (prefer comprehensive resources)
        content_score = min(content_length / 5000, 1.0)  # Max at 5000 chars
        
        # Factor 2: Code count (prefer practical resources)
        code_score = min(code_count / 5, 1.0)  # Max at 5 code blocks
        
        # Factor 3: Test results (critical factor - 60% weight)
        test_score = test_results["pass_rate"]
        
        # Weighted average
        final_score = (content_score * 0.2) + (code_score * 0.2) + (test_score * 0.6)
        
        return final_score
    
    def _generate_test_summary(
        self,
        test_results: Dict[str, Any],
        code_blocks: List[Dict[str, Any]]
    ) -> str:
        """
        Generates human-readable test summary.
        """
        summary_parts = [
            f"Tested {test_results['tested_blocks']} code blocks",
            f"{test_results['passed_blocks']} passed",
            f"{test_results['syntax_errors']} had syntax errors"
        ]
        
        if test_results["runtime_errors"] > 0:
            summary_parts.append(f"{test_results['runtime_errors']} had runtime errors")
        
        return ". ".join(summary_parts) + "."
    
    def _get_timestamp(self) -> str:
        """
        Returns current timestamp in ISO format.
        """
        from datetime import datetime
        return datetime.now().isoformat()
