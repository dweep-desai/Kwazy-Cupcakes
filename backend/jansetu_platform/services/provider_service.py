import hashlib
import os
from sqlalchemy.orm import Session
from sqlalchemy import exc
from fastapi import HTTPException, status
from ..models.user import ServiceProvider, ServiceProviderOnboardingRequest, RequestStatus
from ..schemas.provider import ProviderRegisterRequest
import uuid

AADHAAR_HASH_SALT = os.getenv("AADHAAR_HASH_SALT", "jansetu_secret_salt")

def hash_aadhaar(aadhaar: str) -> str:
    """Hash Aadhaar ID with a salt."""
    return hashlib.sha256(f"{AADHAAR_HASH_SALT}{aadhaar}".encode()).hexdigest()

class ServiceProviderService:
    @staticmethod
    def register_provider(db: Session, request: ProviderRegisterRequest):
        """Register a new service provider."""
        # 1. Hash Aadhaar
        hashed_aadhaar = hash_aadhaar(request.aadhaar)
        
        # 2. Check overlap
        existing = db.query(ServiceProvider).filter(
            (ServiceProvider.aadhaar_hash == hashed_aadhaar) |
            (ServiceProvider.phone == request.phone)
        ).first()
        
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Provider with this Aadhaar or Phone already exists."
            )
            
        # 3. Create Provider
        new_provider = ServiceProvider(
            service_provider_id=str(uuid.uuid4()),
            aadhaar_hash=hashed_aadhaar,
            full_name=request.full_name,
            phone=request.phone,
            gender=request.gender.value,
            date_of_birth=request.date_of_birth,
            address=request.address,
            organization_name=request.organization_name,
            registration_number=request.registration_number
        )
        
        try:
            db.add(new_provider)
            db.flush() # Get ID
            
            # 4. Create Onboarding Request
            onboarding_req = ServiceProviderOnboardingRequest(
                service_provider_id=new_provider.service_provider_id,
                status=RequestStatus.PENDING
            )
            db.add(onboarding_req)
            db.commit()
            db.refresh(new_provider)
            return new_provider
            
        except exc.IntegrityError:
            db.rollback()
            raise HTTPException(status_code=400, detail="Database integrity error.")

    @staticmethod
    def authenticate_provider(db: Session, aadhaar: str):
        """Authenticate provider by Aadhaar (Hash check + Approval check)."""
        hashed_aadhaar = hash_aadhaar(aadhaar)
        
        provider = db.query(ServiceProvider).filter(
            ServiceProvider.aadhaar_hash == hashed_aadhaar
        ).first()
        
        if not provider:
            return None, "NOT_FOUND"
            
        # Check onboarding status
        req = db.query(ServiceProviderOnboardingRequest).filter(
            ServiceProviderOnboardingRequest.service_provider_id == provider.service_provider_id
        ).first()
        
        if not req:
            # Should normally not happen if registered correctly, but safeguard
             return None, "PENDING"
             
        if req.status == RequestStatus.PENDING:
            return None, "PENDING"
            
        if req.status == RequestStatus.REJECTED:
            return None, "REJECTED"
            
        return provider, "OK"

    @staticmethod
    def get_pending_requests(db: Session):
        """Get list of pending requests."""
        return db.query(ServiceProviderOnboardingRequest).filter(
            ServiceProviderOnboardingRequest.status == RequestStatus.PENDING
        ).all()
        
    @staticmethod
    def update_request_status(db: Session, request_id: int, new_status: str, admin_id: int, reason: str = None):
        """Update request status by admin."""
        req = db.query(ServiceProviderOnboardingRequest).filter(
            ServiceProviderOnboardingRequest.request_id == request_id
        ).first()
        
        if not req:
            raise HTTPException(status_code=404, detail="Request not found")
            
        req.status = RequestStatus(new_status)
        req.reviewed_by_admin_id = admin_id
        req.admin_notes = reason
        
        db.commit()
        db.refresh(req)
        return req
