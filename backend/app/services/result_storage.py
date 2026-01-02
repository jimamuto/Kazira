import uuid
import json
import os
from typing import Dict, Any, Optional
from datetime import datetime

# Simple file-based DB
DB_FILE = "roadmap_store.json"
roadmap_results: Dict[str, Dict[str, Any]] = {}

def _load_db():
    global roadmap_results
    if os.path.exists(DB_FILE):
        try:
            with open(DB_FILE, "r") as f:
                # Need to handle datetime conversion if needed, but simple JSON is fine for now
                roadmap_results = json.load(f)
        except Exception as e:
            print(f"Failed to load DB: {e}")

def _save_db():
    try:
        # Convert datetime objects to string for JSON serialization
        serializable = {}
        for k, v in roadmap_results.items():
            item = v.copy()
            if "created_at" in item and isinstance(item["created_at"], datetime):
                item["created_at"] = item["created_at"].isoformat()
            serializable[k] = item
            
        with open(DB_FILE, "w") as f:
            json.dump(serializable, f, indent=2)
    except Exception as e:
        print(f"Failed to save DB: {e}")

# Load on module import
_load_db()

def store_roadmap_result(roadmap_data: Dict[str, Any]) -> str:
    """Store roadmap result and return ID"""
    result_id = str(uuid.uuid4())
    roadmap_results[result_id] = {
        **roadmap_data,
        "result_id": result_id, # Ensure ID is inside object too
        "created_at": datetime.now().isoformat() # Store as string immediately
    }
    _save_db()
    return result_id

def get_roadmap_result(result_id: str) -> Optional[Dict[str, Any]]:
    """Retrieve stored roadmap result by ID"""
    return roadmap_results.get(result_id)

def get_all_results() -> list:
    """Return all stored roadmaps (for history)"""
    return list(roadmap_results.values())