"""User Activity Logs Router."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import text
import hashlib
import uuid
import json
from typing import List, Optional, Dict, Any
from pydantic import BaseModel
from ..database import get_db
from ..security import get_current_user
from ..models.user import User
from ..config import settings

router = APIRouter(prefix="/activity-logs", tags=["activity-logs"])


class ActivityLogRequest(BaseModel):
    activity_type: str
    activity_description: str
    entity_type: Optional[str] = None
    entity_id: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None


class ActivityLogResponse(BaseModel):
    activity_id: str
    citizen_id: str
    activity_type: str
    activity_description: str
    entity_type: Optional[str]
    entity_id: Optional[str]
    metadata: Optional[Dict[str, Any]]
    created_at: str


@router.post("/log", response_model=ActivityLogResponse)
async def log_activity(
    request: ActivityLogRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Log a user activity."""
    try:
        aadhaar_hash = hashlib.sha256(current_user.aadhar.encode()).hexdigest()
        
        # Get citizen_id
        citizen_query = text("SELECT citizen_id FROM citizens WHERE aadhaar_hash = :aadhaar_hash")
        citizen_result = db.execute(citizen_query, {"aadhaar_hash": aadhaar_hash}).fetchone()
        
        if not citizen_result:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Citizen profile not found"
            )
        
        citizen_id = str(citizen_result[0])
        activity_id = str(uuid.uuid4())
        
        # Convert metadata to JSON string for SQLite
        metadata_str = json.dumps(request.metadata) if request.metadata else None
        
        # Insert activity log
        if settings.DATABASE_URL.startswith('sqlite'):
            insert_query = text("""
                INSERT INTO user_activity_logs 
                (activity_id, citizen_id, activity_type, activity_description, entity_type, entity_id, metadata)
                VALUES (:activity_id, :citizen_id, :activity_type, :activity_description, :entity_type, :entity_id, :metadata)
            """)
        else:
            insert_query = text("""
                INSERT INTO user_activity_logs 
                (activity_id, citizen_id, activity_type, activity_description, entity_type, entity_id, metadata)
                VALUES (:activity_id, :citizen_id, :activity_type, :activity_description, :entity_type, :entity_id, :metadata::jsonb)
            """)
        
        db.execute(insert_query, {
            "activity_id": activity_id,
            "citizen_id": citizen_id,
            "activity_type": request.activity_type,
            "activity_description": request.activity_description,
            "entity_type": request.entity_type,
            "entity_id": request.entity_id,
            "metadata": metadata_str
        })
        
        db.commit()
        
        return {
            "activity_id": activity_id,
            "citizen_id": citizen_id,
            "activity_type": request.activity_type,
            "activity_description": request.activity_description,
            "entity_type": request.entity_type,
            "entity_id": request.entity_id,
            "metadata": request.metadata,
            "created_at": ""
        }
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error logging activity: {str(e)}"
        )


@router.get("/my-history", response_model=List[ActivityLogResponse])
async def get_my_activity_history(
    activity_type: Optional[str] = None,
    limit: int = 100,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get activity history for current citizen."""
    try:
        aadhaar_hash = hashlib.sha256(current_user.aadhar.encode()).hexdigest()
        
        # Get citizen_id
        citizen_query = text("SELECT citizen_id FROM citizens WHERE aadhaar_hash = :aadhaar_hash")
        citizen_result = db.execute(citizen_query, {"aadhaar_hash": aadhaar_hash}).fetchone()
        
        if not citizen_result:
            return []
        
        citizen_id = str(citizen_result[0])
        
        # Build query with proper SQL string building
        base_query = """
            SELECT 
                activity_id, citizen_id, activity_type, activity_description,
                entity_type, entity_id, metadata, created_at
            FROM user_activity_logs
            WHERE citizen_id = :citizen_id
        """
        
        if activity_type:
            base_query += " AND activity_type = :activity_type"
        
        base_query += " ORDER BY created_at DESC LIMIT :limit"
        
        params = {"citizen_id": citizen_id, "limit": limit}
        if activity_type:
            params["activity_type"] = activity_type
        
        query = text(base_query)
        
        results = db.execute(query, params).fetchall()
        
        activities = []
        for row in results:
            metadata = None
            if row[6]:  # metadata column
                try:
                    if isinstance(row[6], str):
                        metadata = json.loads(row[6])
                    else:
                        metadata = row[6]
                except:
                    metadata = None
            
            activities.append({
                "activity_id": str(row[0]),
                "citizen_id": str(row[1]),
                "activity_type": str(row[2]),
                "activity_description": str(row[3]),
                "entity_type": str(row[4]) if row[4] else None,
                "entity_id": str(row[5]) if row[5] else None,
                "metadata": metadata,
                "created_at": str(row[7])
            })
        
        return activities
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching activity history: {str(e)}"
        )
