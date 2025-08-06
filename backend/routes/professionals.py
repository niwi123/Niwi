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

@router.get("/leads/preview", response_model=List[dict])
async def get_available_leads_preview(
    service_category: Optional[ServiceCategory] = Query(None, description="Filter by service category"),
    city: Optional[str] = Query(None, description="Filter by city"),
    province: Optional[str] = Query(None, description="Filter by province"),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(10, ge=1, le=50, description="Number of records to return"),
    current_user: dict = Depends(get_current_professional)
):
    """Get preview of available customer requests (limited info, no credits required)."""
    db = get_database()
    
    # Build query for pending customer requests
    query = {"status": "pending"}
    
    if service_category:
        query["service_category"] = service_category
    
    if city:
        query["city"] = {"$regex": city, "$options": "i"}
    
    if province:
        query["province"] = {"$regex": province, "$options": "i"}
    
    # Get customer requests
    requests = await db.customer_requests.find(query) \
        .sort("created_at", -1) \
        .skip(skip) \
        .limit(limit) \
        .to_list(limit)
    
    # Return limited preview information (no contact details)
    previews = []
    for req in requests:
        preview = {
            "id": req["id"],
            "title": req["title"],
            "service_category": req["service_category"],
            "description": req["description"][:150] + "..." if len(req["description"]) > 150 else req["description"],
            "city": req["city"],
            "province": req["province"],
            "timeline": req["timeline"],
            "urgency": req["urgency"],
            "budget_range": f"${req.get('budget_min', 0):,.0f} - ${req.get('budget_max', 0):,.0f}" if req.get('budget_min') else "Budget not specified",
            "created_at": req["created_at"],
            "credits_required": 1  # Standard cost to view full details
        }
        previews.append(preview)
    
    return previews

@router.post("/leads/{request_id}/view")
async def view_lead_details(
    request_id: str,
    current_user: dict = Depends(get_current_professional)
):
    """View full lead details (requires 1 credit)."""
    db = get_database()
    
    # Check if customer request exists
    request_doc = await db.customer_requests.find_one({"id": request_id})
    if not request_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lead not found"
        )
    
    # Check if professional already viewed this lead
    existing_lead = await db.leads.find_one({
        "customer_request_id": request_id,
        "professional_id": current_user["user_id"]
    })
    
    if existing_lead and existing_lead.get("viewed_at"):
        # Already viewed, return full details without charging
        return {
            "lead_details": request_doc,
            "credits_used": 0,
            "message": "Lead already purchased"
        }
    
    # Use credit system to charge for viewing
    from routes.credits import use_credits_for_lead
    
    try:
        # Create lead record or update existing one
        if existing_lead:
            # Update existing lead with view information
            await use_credits_for_lead(db, current_user["user_id"], existing_lead["id"])
            
            await db.leads.update_one(
                {"id": existing_lead["id"]},
                {
                    "$set": {
                        "viewed_at": datetime.utcnow(),
                        "credits_used": 1,
                        "updated_at": datetime.utcnow()
                    }
                }
            )
            lead_id = existing_lead["id"]
        else:
            # Create new lead record
            lead = Lead(
                customer_request_id=request_id,
                professional_id=current_user["user_id"],
                status=LeadStatus.ASSIGNED,
                viewed_at=datetime.utcnow(),
                credits_used=1
            )
            
            await use_credits_for_lead(db, current_user["user_id"], lead.id)
            await db.leads.insert_one(lead.dict())
            lead_id = lead.id
        
        # Update customer request status if this is the first assignment
        if request_doc["status"] == "pending":
            await db.customer_requests.update_one(
                {"id": request_id},
                {"$set": {"status": "assigned", "updated_at": datetime.utcnow()}}
            )
        
        return {
            "lead_details": request_doc,
            "credits_used": 1,
            "lead_id": lead_id,
            "message": "Lead details unlocked"
        }
        
    except HTTPException as e:
        # Re-raise HTTP exceptions (like insufficient credits)
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process lead view: {str(e)}"
        )

@router.get("/leads", response_model=List[LeadResponse])
async def get_my_leads(
    status_filter: Optional[LeadStatus] = Query(None, description="Filter leads by status"),
    current_user: dict = Depends(get_current_professional)
):
    """Get all leads purchased/assigned to current professional."""
    db = get_database()
    
    # Build query - only show leads that have been viewed (purchased)
    query = {
        "professional_id": current_user["user_id"],
        "viewed_at": {"$ne": None}
    }
    
    if status_filter:
        query["status"] = status_filter
    
    leads = await db.leads.find(query).sort("created_at", -1).to_list(100)
    return [LeadResponse(**lead) for lead in leads]
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