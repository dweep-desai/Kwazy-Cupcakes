"""Citizen router for profile and citizen data."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import text
import hashlib
from typing import Optional, Dict, Any
from pydantic import BaseModel
from ..database import get_db
from ..security import get_current_user
from ..models.user import User
from ..config import settings

router = APIRouter(prefix="/citizen", tags=["citizen"])


class UpdateKisanIdRequest(BaseModel):
    kisan_id: str


@router.get("/profile")
async def get_citizen_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get citizen profile data from citizens table."""
    try:
        # Hash the Aadhaar to match the stored hash
        aadhaar_hash = hashlib.sha256(current_user.aadhar.encode()).hexdigest()
        
        # Query the citizens table using raw SQL
        query = text("""
            SELECT 
                citizen_id,
                aadhaar_hash,
                full_name,
                phone,
                gender,
                date_of_birth,
                age,
                address,
                kisan_id,
                created_at,
                updated_at
            FROM citizens
            WHERE aadhaar_hash = :aadhaar_hash
        """)
        
        result = db.execute(query, {"aadhaar_hash": aadhaar_hash}).fetchone()
        
        if not result:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Citizen profile not found"
            )
        
        # Convert result to dictionary (handle both SQLite and PostgreSQL)
        profile_data = {
            "citizen_id": str(result[0]) if result[0] else None,
            "aadhaar_hash": result[1] if result[1] else None,
            "full_name": result[2] if result[2] else None,
            "phone": result[3] if result[3] else None,
            "gender": result[4] if result[4] else None,
            "date_of_birth": str(result[5]) if result[5] else None,
            "age": int(result[6]) if result[6] is not None else None,
            "address": result[7] if result[7] else None,
            "kisan_id": result[8] if result[8] else None,
            "created_at": str(result[9]) if result[9] else None,
            "updated_at": str(result[10]) if result[10] else None
        }
        
        return profile_data
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching citizen profile: {str(e)}"
        )


@router.put("/profile/kisan-id")
async def update_kisan_id(
    request: UpdateKisanIdRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update kisan_id for the citizen."""
    try:
        aadhaar_hash = hashlib.sha256(current_user.aadhar.encode()).hexdigest()
        
        # Check if this kisan_id already exists for another citizen
        check_query = text("""
            SELECT citizen_id, aadhaar_hash 
            FROM citizens 
            WHERE kisan_id = :kisan_id
        """)
        
        existing = db.execute(check_query, {"kisan_id": request.kisan_id}).fetchone()
        
        if existing:
            # Get current user's citizen_id
            citizen_query = text("SELECT citizen_id FROM citizens WHERE aadhaar_hash = :aadhaar_hash")
            citizen_result = db.execute(citizen_query, {"aadhaar_hash": aadhaar_hash}).fetchone()
            
            if not citizen_result:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Citizen profile not found"
                )
            
            current_citizen_id = citizen_result[0]
            existing_citizen_id = existing[0]
            
            # If the kisan_id belongs to a different citizen, raise error
            if existing_citizen_id != current_citizen_id:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Kisan ID '{request.kisan_id}' is already registered to another citizen. Please use a different Kisan ID."
                )
            # If it's the same citizen, just update (no change needed, but allow the update anyway)
        
        # Update kisan_id
        if settings.DATABASE_URL.startswith('sqlite'):
            update_query = text("""
                UPDATE citizens 
                SET kisan_id = :kisan_id, updated_at = datetime('now')
                WHERE aadhaar_hash = :aadhaar_hash
            """)
        else:
            update_query = text("""
                UPDATE citizens 
                SET kisan_id = :kisan_id, updated_at = NOW()
                WHERE aadhaar_hash = :aadhaar_hash
            """)
        
        result = db.execute(update_query, {
            "kisan_id": request.kisan_id,
            "aadhaar_hash": aadhaar_hash
        })
        
        db.commit()
        
        if result.rowcount == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Citizen profile not found"
            )
        
        return {"message": "Kisan ID updated successfully", "kisan_id": request.kisan_id}
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        error_str = str(e)
        if "UNIQUE constraint" in error_str or "duplicate" in error_str.lower():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Kisan ID '{request.kisan_id}' is already registered to another citizen. Please use a different Kisan ID."
            )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating kisan_id: {error_str}"
        )
