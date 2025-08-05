from fastapi import APIRouter, Depends, HTTPException, status, Query
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List, Optional
from datetime import datetime

from models import (
    User, BusinessProfile, CustomerRequest, Lead, LeadCreate, LeadResponse,
    BusinessProfileResponse, CustomerRequestResponse, UserResponse,
    ServiceCategory, LeadStatus, LeadPriority, UserType
)
from auth import get_current_admin

router = APIRouter(prefix="/admin", tags=["admin"])

def get_database() -> AsyncIOMotorDatabase:
    from server import db
    return db

# User Management
@router.get("/users", response_model=List[UserResponse])
async def get_all_users(
    user_type: Optional[UserType] = Query(None, description="Filter by user type"),
    current_admin: dict = Depends(get_current_admin)
):
    """Get all users with optional filtering."""
    db = get_database()
    
    query = {}
    if user_type:
        query["user_type"] = user_type
    
    users = await db.users.find(query).sort("created_at", -1).to_list(1000)
    return [UserResponse(**user) for user in users]

@router.put("/users/{user_id}/status")
async def update_user_status(
    user_id: str,
    status_update: dict,
    current_admin: dict = Depends(get_current_admin)
):
    """Update user active/verified status."""
    db = get_database()
    
    # Validate status update
    allowed_fields = ["is_active", "is_verified"]
    update_data = {k: v for k, v in status_update.items() if k in allowed_fields}
    
    if not update_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No valid status fields provided"
        )
    
    update_data["updated_at"] = datetime.utcnow()
    
    result = await db.users.update_one({"id": user_id}, {"$set": update_data})
    
    if result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Return updated user
    user_doc = await db.users.find_one({"id": user_id})
    return UserResponse(**user_doc)

# Business Profile Management
@router.get("/profiles", response_model=List[BusinessProfileResponse])
async def get_all_business_profiles(
    service_category: Optional[ServiceCategory] = Query(None, description="Filter by service category"),
    is_verified: Optional[bool] = Query(None, description="Filter by verification status"),
    current_admin: dict = Depends(get_current_admin)
):
    """Get all business profiles with optional filtering."""
    db = get_database()
    
    query = {}
    if service_category:
        query["service_categories"] = {"$in": [service_category]}
    if is_verified is not None:
        query["is_verified"] = is_verified
    
    profiles = await db.business_profiles.find(query).sort("created_at", -1).to_list(1000)
    return [BusinessProfileResponse(**profile) for profile in profiles]

@router.put("/profiles/{profile_id}/verify")
async def verify_business_profile(
    profile_id: str,
    verification_data: dict,
    current_admin: dict = Depends(get_current_admin)
):
    """Verify or unverify a business profile."""
    db = get_database()
    
    update_data = {
        "is_verified": verification_data.get("is_verified", True),
        "is_featured": verification_data.get("is_featured", False),
        "updated_at": datetime.utcnow()
    }
    
    result = await db.business_profiles.update_one(
        {"id": profile_id},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Business profile not found"
        )
    
    # Return updated profile
    profile_doc = await db.business_profiles.find_one({"id": profile_id})
    return BusinessProfileResponse(**profile_doc)

# Customer Request Management
@router.get("/customer-requests", response_model=List[CustomerRequestResponse])
async def get_all_customer_requests(
    status: Optional[LeadStatus] = Query(None, description="Filter by status"),
    service_category: Optional[ServiceCategory] = Query(None, description="Filter by service category"),
    urgency: Optional[LeadPriority] = Query(None, description="Filter by urgency"),
    current_admin: dict = Depends(get_current_admin)
):
    """Get all customer requests with optional filtering."""
    db = get_database()
    
    query = {}
    if status:
        query["status"] = status
    if service_category:
        query["service_category"] = service_category
    if urgency:
        query["urgency"] = urgency
    
    requests = await db.customer_requests.find(query).sort("created_at", -1).to_list(1000)
    return [CustomerRequestResponse(**req) for req in requests]

@router.post("/leads", response_model=LeadResponse)
async def assign_lead_to_professional(
    lead_data: LeadCreate,
    current_admin: dict = Depends(get_current_admin)
):
    """Manually assign a customer request to a professional."""
    db = get_database()
    
    # Verify customer request exists
    request_doc = await db.customer_requests.find_one({"id": lead_data.customer_request_id})
    if not request_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer request not found"
        )
    
    # Verify professional exists and has a business profile
    profile_doc = await db.business_profiles.find_one({"user_id": lead_data.professional_id})
    if not profile_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Professional profile not found"
        )
    
    # Check if lead already exists for this combination
    existing_lead = await db.leads.find_one({
        "customer_request_id": lead_data.customer_request_id,
        "professional_id": lead_data.professional_id
    })
    
    if existing_lead:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Lead already assigned to this professional"
        )
    
    # Create lead
    lead = Lead(
        customer_request_id=lead_data.customer_request_id,
        professional_id=lead_data.professional_id
    )
    
    await db.leads.insert_one(lead.dict())
    
    # Update customer request status
    await db.customer_requests.update_one(
        {"id": lead_data.customer_request_id},
        {"$set": {"status": LeadStatus.ASSIGNED, "updated_at": datetime.utcnow()}}
    )
    
    return LeadResponse(**lead.dict())

@router.get("/leads", response_model=List[LeadResponse])
async def get_all_leads(
    status: Optional[LeadStatus] = Query(None, description="Filter by status"),
    professional_id: Optional[str] = Query(None, description="Filter by professional"),
    current_admin: dict = Depends(get_current_admin)
):
    """Get all leads with optional filtering."""
    db = get_database()
    
    query = {}
    if status:
        query["status"] = status
    if professional_id:
        query["professional_id"] = professional_id
    
    leads = await db.leads.find(query).sort("created_at", -1).to_list(1000)
    return [LeadResponse(**lead) for lead in leads]

@router.delete("/leads/{lead_id}")
async def delete_lead(
    lead_id: str,
    current_admin: dict = Depends(get_current_admin)
):
    """Delete a lead assignment."""
    db = get_database()
    
    # Find and delete lead
    lead_doc = await db.leads.find_one({"id": lead_id})
    if not lead_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lead not found"
        )
    
    await db.leads.delete_one({"id": lead_id})
    
    # Check if there are any other leads for this customer request
    remaining_leads = await db.leads.find({"customer_request_id": lead_doc["customer_request_id"]}).to_list(1)
    
    if not remaining_leads:
        # No more leads, set customer request back to pending
        await db.customer_requests.update_one(
            {"id": lead_doc["customer_request_id"]},
            {"$set": {"status": LeadStatus.PENDING, "updated_at": datetime.utcnow()}}
        )
    
    return {"message": f"Lead {lead_id} deleted successfully"}

# Analytics and Dashboard
@router.get("/stats")
async def get_platform_stats(current_admin: dict = Depends(get_current_admin)):
    """Get platform statistics for admin dashboard."""
    db = get_database()
    
    # Get counts
    total_users = await db.users.count_documents({})
    total_professionals = await db.users.count_documents({"user_type": UserType.PROFESSIONAL})
    total_customers = await db.users.count_documents({"user_type": UserType.CUSTOMER})
    total_profiles = await db.business_profiles.count_documents({})
    verified_profiles = await db.business_profiles.count_documents({"is_verified": True})
    total_requests = await db.customer_requests.count_documents({})
    pending_requests = await db.customer_requests.count_documents({"status": LeadStatus.PENDING})
    total_leads = await db.leads.count_documents({})
    active_leads = await db.leads.count_documents({"status": {"$in": [LeadStatus.ASSIGNED, LeadStatus.CONTACTED, LeadStatus.IN_PROGRESS]}})
    
    # Get recent activity
    recent_requests = await db.customer_requests.find({}).sort("created_at", -1).limit(5).to_list(5)
    recent_registrations = await db.users.find({}).sort("created_at", -1).limit(5).to_list(5)
    
    return {
        "user_stats": {
            "total_users": total_users,
            "total_professionals": total_professionals,
            "total_customers": total_customers
        },
        "profile_stats": {
            "total_profiles": total_profiles,
            "verified_profiles": verified_profiles,
            "verification_rate": (verified_profiles / total_profiles * 100) if total_profiles > 0 else 0
        },
        "request_stats": {
            "total_requests": total_requests,
            "pending_requests": pending_requests,
            "conversion_rate": ((total_requests - pending_requests) / total_requests * 100) if total_requests > 0 else 0
        },
        "lead_stats": {
            "total_leads": total_leads,
            "active_leads": active_leads
        },
        "recent_activity": {
            "recent_requests": [CustomerRequestResponse(**req) for req in recent_requests],
            "recent_registrations": [UserResponse(**user) for user in recent_registrations]
        }
    }