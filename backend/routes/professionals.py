from fastapi import APIRouter, Depends, HTTPException, status, Query
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List, Optional
from datetime import datetime

from models import (
    BusinessProfile, BusinessProfileCreate, BusinessProfileResponse,
    ServiceCategory, Lead, LeadResponse, LeadStatus, UserType
)
from auth import get_current_user, get_current_professional

router = APIRouter(prefix="/professionals", tags=["professionals"])

def get_database() -> AsyncIOMotorDatabase:
    from server import db
    return db

@router.post("/profile", response_model=BusinessProfileResponse)
async def create_business_profile(
    profile_data: BusinessProfileCreate,
    current_user: dict = Depends(get_current_professional)
):
    """Create a business profile for a professional."""
    db = get_database()
    
    # Check if user already has a profile
    existing_profile = await db.business_profiles.find_one({"user_id": current_user["user_id"]})
    if existing_profile:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Business profile already exists"
        )
    
    # Create business profile
    profile = BusinessProfile(
        user_id=current_user["user_id"],
        **profile_data.dict()
    )
    
    await db.business_profiles.insert_one(profile.dict())
    return BusinessProfileResponse(**profile.dict())

@router.get("/profile", response_model=BusinessProfileResponse)
async def get_my_profile(current_user: dict = Depends(get_current_professional)):
    """Get current professional's business profile."""
    db = get_database()
    
    profile_doc = await db.business_profiles.find_one({"user_id": current_user["user_id"]})
    if not profile_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Business profile not found"
        )
    
    return BusinessProfileResponse(**profile_doc)

@router.put("/profile", response_model=BusinessProfileResponse)
async def update_my_profile(
    profile_update: dict,
    current_user: dict = Depends(get_current_professional)
):
    """Update current professional's business profile."""
    db = get_database()
    
    # Remove fields that shouldn't be updated
    restricted_fields = ["id", "user_id", "created_at", "rating", "review_count"]
    update_data = {k: v for k, v in profile_update.items() if k not in restricted_fields}
    update_data["updated_at"] = datetime.utcnow()
    
    result = await db.business_profiles.update_one(
        {"user_id": current_user["user_id"]},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Business profile not found"
        )
    
    # Return updated profile
    profile_doc = await db.business_profiles.find_one({"user_id": current_user["user_id"]})
    return BusinessProfileResponse(**profile_doc)

@router.get("/leads", response_model=List[LeadResponse])
async def get_my_leads(
    status_filter: Optional[LeadStatus] = Query(None, description="Filter leads by status"),
    current_user: dict = Depends(get_current_professional)
):
    """Get all leads assigned to current professional."""
    db = get_database()
    
    # Build query
    query = {"professional_id": current_user["user_id"]}
    if status_filter:
        query["status"] = status_filter
    
    leads = await db.leads.find(query).sort("created_at", -1).to_list(100)
    return [LeadResponse(**lead) for lead in leads]

@router.put("/leads/{lead_id}/status")
async def update_lead_status(
    lead_id: str,
    status_update: dict,
    current_user: dict = Depends(get_current_professional)
):
    """Update lead status and add notes."""
    db = get_database()
    
    # Verify lead belongs to current professional
    lead = await db.leads.find_one({"id": lead_id, "professional_id": current_user["user_id"]})
    if not lead:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lead not found"
        )
    
    # Prepare update data
    update_data = {"updated_at": datetime.utcnow()}
    
    if "status" in status_update:
        update_data["status"] = status_update["status"]
        
        # Update timestamps based on status
        if status_update["status"] == LeadStatus.CONTACTED:
            update_data["contacted_at"] = datetime.utcnow()
        elif status_update["status"] == LeadStatus.COMPLETED:
            update_data["completed_at"] = datetime.utcnow()
    
    if "notes" in status_update:
        update_data["notes"] = status_update["notes"]
    
    if "quote_amount" in status_update:
        update_data["quote_amount"] = status_update["quote_amount"]
    
    if "is_won" in status_update:
        update_data["is_won"] = status_update["is_won"]
    
    # Update lead
    await db.leads.update_one({"id": lead_id}, {"$set": update_data})
    
    # Return updated lead
    updated_lead = await db.leads.find_one({"id": lead_id})
    return LeadResponse(**updated_lead)

@router.get("/", response_model=List[BusinessProfileResponse])
async def search_professionals(
    service_category: Optional[ServiceCategory] = Query(None, description="Filter by service category"),
    city: Optional[str] = Query(None, description="Filter by city"),
    province: Optional[str] = Query(None, description="Filter by province"),
    is_verified: Optional[bool] = Query(None, description="Show only verified professionals"),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(20, ge=1, le=100, description="Number of records to return")
):
    """Search and filter professional business profiles."""
    db = get_database()
    
    # Build query
    query = {"is_active": True}
    
    if service_category:
        query["service_categories"] = {"$in": [service_category]}
    
    if city:
        query["city"] = {"$regex": city, "$options": "i"}  # Case-insensitive search
    
    if province:
        query["province"] = {"$regex": province, "$options": "i"}
    
    if is_verified is not None:
        query["is_verified"] = is_verified
    
    # Execute query with pagination
    profiles = await db.business_profiles.find(query) \
        .sort("is_featured", -1) \
        .sort("rating", -1) \
        .skip(skip) \
        .limit(limit) \
        .to_list(limit)
    
    return [BusinessProfileResponse(**profile) for profile in profiles]

@router.get("/{professional_id}", response_model=BusinessProfileResponse)
async def get_professional_profile(professional_id: str):
    """Get a specific professional's public profile."""
    db = get_database()
    
    profile_doc = await db.business_profiles.find_one({"user_id": professional_id})
    if not profile_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Professional profile not found"
        )
    
    return BusinessProfileResponse(**profile_doc)