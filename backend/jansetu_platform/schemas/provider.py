from pydantic import BaseModel, constr
from datetime import datetime, date
from typing import Optional
from enum import Enum
from .user import RoleSchema

class GenderEnum(str, Enum):
    MALE = "MALE"
    FEMALE = "FEMALE"
    OTHER = "OTHER"

class ProviderRegisterRequest(BaseModel):
    """Schema for provider registration."""
    aadhaar: constr(min_length=12, max_length=12) # Raw aadhaar from frontend
    full_name: str
    phone: str
    gender: GenderEnum
    date_of_birth: date
    address: Optional[str] = None
    organization_name: Optional[str] = None
    registration_number: Optional[str] = None

class ProviderResponse(BaseModel):
    """Schema for provider response."""
    service_provider_id: str
    full_name: str
    phone: str
    organization_name: Optional[str] = None
    created_at: datetime
    
    model_config = {"from_attributes": True}

class OnboardingRequestResponse(BaseModel):
    """Schema for onboarding request list."""
    request_id: int
    service_provider: ProviderResponse
    status: str
    created_at: datetime
    
    model_config = {"from_attributes": True}

class UpdateRequestStatus(BaseModel):
    """Schema for admin approval update."""
    status: str
    reason: Optional[str] = None
