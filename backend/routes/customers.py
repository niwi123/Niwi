from fastapi import APIRouter, Depends, HTTPException, status, Query
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List, Optional
from datetime import datetime

from models import (
    CustomerRequest, CustomerRequestCreate, CustomerRequestResponse,
    ServiceCategory, LeadStatus, LeadPriority, UserType
)
from auth import get_current_user
from services.notifications import notification_service

router = APIRouter(prefix="/customers", tags=["customers"])

def get_database() -> AsyncIOMotorDatabase:
    from server import db
    return db

@router.post("/requests", response_model=CustomerRequestResponse)
async def create_customer_request(
    request_data: CustomerRequestCreate,
    current_user: dict = Depends(get_current_user)
):
    """Create a new customer service request."""
    db = get_database()
    
    # Create customer request
    customer_request = CustomerRequest(
        customer_id=current_user["user_id"],
        **request_data.dict()
    )
    
    await db.customer_requests.insert_one(customer_request.dict())
    return CustomerRequestResponse(**customer_request.dict())

@router.get("/requests", response_model=List[CustomerRequestResponse])
async def get_my_requests(
    status_filter: Optional[LeadStatus] = Query(None, description="Filter by status"),
    current_user: dict = Depends(get_current_user)
):
    """Get all service requests for current customer."""
    db = get_database()
    
    # Build query
    query = {"customer_id": current_user["user_id"]}
    if status_filter:
        query["status"] = status_filter
    
    requests = await db.customer_requests.find(query).sort("created_at", -1).to_list(100)
    return [CustomerRequestResponse(**req) for req in requests]

@router.get("/requests/{request_id}", response_model=CustomerRequestResponse)
async def get_customer_request(
    request_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Get a specific customer request."""
    db = get_database()
    
    request_doc = await db.customer_requests.find_one({
        "id": request_id,
        "customer_id": current_user["user_id"]
    })
    
    if not request_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer request not found"
        )
    
    return CustomerRequestResponse(**request_doc)

@router.put("/requests/{request_id}", response_model=CustomerRequestResponse)
async def update_customer_request(
    request_id: str,
    request_update: dict,
    current_user: dict = Depends(get_current_user)
):
    """Update a customer request (only if not yet assigned)."""
    db = get_database()
    
    # Check if request exists and belongs to user
    request_doc = await db.customer_requests.find_one({
        "id": request_id,
        "customer_id": current_user["user_id"]
    })
    
    if not request_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer request not found"
        )
    
    # Check if request can be updated (not yet assigned to professionals)
    if request_doc.get("status") != LeadStatus.PENDING:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot update request that has been assigned to professionals"
        )
    
    # Remove fields that shouldn't be updated
    restricted_fields = ["id", "customer_id", "created_at", "status"]
    update_data = {k: v for k, v in request_update.items() if k not in restricted_fields}
    update_data["updated_at"] = datetime.utcnow()
    
    # Update request
    await db.customer_requests.update_one(
        {"id": request_id},
        {"$set": update_data}
    )
    
    # Return updated request
    updated_request = await db.customer_requests.find_one({"id": request_id})
    return CustomerRequestResponse(**updated_request)

@router.delete("/requests/{request_id}")
async def delete_customer_request(
    request_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Delete a customer request (only if not yet assigned)."""
    db = get_database()
    
    # Check if request exists and belongs to user
    request_doc = await db.customer_requests.find_one({
        "id": request_id,
        "customer_id": current_user["user_id"]
    })
    
    if not request_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer request not found"
        )
    
    # Check if request can be deleted (not yet assigned to professionals)
    if request_doc.get("status") != LeadStatus.PENDING:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete request that has been assigned to professionals"
        )
    
    # Delete request
    await db.customer_requests.delete_one({"id": request_id})
    
    return {"message": "Customer request deleted successfully"}

@router.post("/requests/quick", response_model=CustomerRequestResponse)
async def create_quick_request(request_data: dict):
    """Create a quick service request without authentication (for landing page)."""
    db = get_database()
    
    # Validate required fields
    required_fields = ["email", "phone", "service_category", "title", "description", "city", "province"]
    for field in required_fields:
        if field not in request_data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Missing required field: {field}"
            )
    
    # Create a temporary customer ID using email
    customer_id = f"guest_{request_data['email']}"
    
    # Create customer request
    customer_request = CustomerRequest(
        customer_id=customer_id,
        service_category=request_data["service_category"],
        title=request_data["title"],
        description=request_data["description"],
        location=request_data.get("location", f"{request_data['city']}, {request_data['province']}"),
        city=request_data["city"],
        province=request_data["province"],
        budget_min=request_data.get("budget_min"),
        budget_max=request_data.get("budget_max"),
        timeline=request_data.get("timeline", "ASAP"),
        urgency=request_data.get("urgency", LeadPriority.MEDIUM),
        contact_preference=request_data.get("contact_preference", "either"),
        additional_details={
            "email": request_data["email"],
            "phone": request_data["phone"],
            "is_guest_request": True
        }
    )
    
    await db.customer_requests.insert_one(customer_request.dict())
    return CustomerRequestResponse(**customer_request.dict())