from fastapi import APIRouter, Depends, HTTPException, status
from datetime import datetime
import uuid
from typing import List, Optional
from pydantic import BaseModel, Field

from ..auth import get_current_user
from ..models import User
from motor.motor_asyncio import AsyncIOMotorClient
import os

router = APIRouter()

# MongoDB connection
MONGO_URL = os.getenv('MONGO_URL', 'mongodb://localhost:27017/niwi_platform')
client = AsyncIOMotorClient(MONGO_URL)
db = client.niwi_platform

class ReviewCreate(BaseModel):
    professional_id: str
    rating: int = Field(..., ge=1, le=5)
    title: str
    comment: str

class Review(BaseModel):
    id: str
    customer_id: str
    professional_id: str  
    rating: int
    title: str
    comment: str
    customer_name: str
    created_at: datetime

@router.post("/reviews", response_model=dict)
async def create_review(
    review_data: ReviewCreate,
    current_user: User = Depends(get_current_user)
):
    """Create a new review for a professional"""
    try:
        # Verify the professional exists
        professional = await db.business_profiles.find_one({"_id": review_data.professional_id})
        if not professional:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Professional not found"
            )

        # Check if customer has already reviewed this professional
        existing_review = await db.reviews.find_one({
            "customer_id": current_user.id,
            "professional_id": review_data.professional_id
        })
        
        if existing_review:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="You have already reviewed this professional"
            )

        # Create review document
        review_doc = {
            "_id": str(uuid.uuid4()),
            "customer_id": current_user.id,
            "professional_id": review_data.professional_id,
            "rating": review_data.rating,
            "title": review_data.title,
            "comment": review_data.comment,
            "customer_name": f"{current_user.first_name} {current_user.last_name}",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }

        await db.reviews.insert_one(review_doc)
        
        # Update professional's average rating
        await update_professional_rating(review_data.professional_id)
        
        return {"message": "Review created successfully", "review_id": review_doc["_id"]}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating review: {str(e)}"
        )

@router.get("/professionals/{professional_id}/reviews", response_model=List[Review])
async def get_professional_reviews(professional_id: str):
    """Get all reviews for a professional"""
    try:
        reviews = await db.reviews.find({
            "professional_id": professional_id
        }).sort("created_at", -1).to_list(100)
        
        return [Review(
            id=review["_id"],
            customer_id=review["customer_id"],
            professional_id=review["professional_id"],
            rating=review["rating"],
            title=review["title"],
            comment=review["comment"],
            customer_name=review["customer_name"],
            created_at=review["created_at"]
        ) for review in reviews]
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching reviews: {str(e)}"
        )

@router.get("/reviews/my-reviews")
async def get_my_reviews(current_user: User = Depends(get_current_user)):
    """Get reviews written by the current user"""
    try:
        reviews = await db.reviews.find({
            "customer_id": current_user.id
        }).sort("created_at", -1).to_list(100)
        
        # Fetch professional names for each review
        for review in reviews:
            professional_profile = await db.business_profiles.find_one({
                "_id": review["professional_id"]
            })
            if professional_profile:
                review["professional_name"] = professional_profile.get("business_name", "Unknown Professional")
            
        return reviews
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching your reviews: {str(e)}"
        )

async def update_professional_rating(professional_id: str):
    """Update the average rating for a professional"""
    try:
        # Calculate new average rating
        pipeline = [
            {"$match": {"professional_id": professional_id}},
            {"$group": {
                "_id": None,
                "avg_rating": {"$avg": "$rating"},
                "total_reviews": {"$sum": 1}
            }}
        ]
        
        result = await db.reviews.aggregate(pipeline).to_list(1)
        
        if result:
            avg_rating = round(result[0]["avg_rating"], 2)
            total_reviews = result[0]["total_reviews"]
            
            # Update professional profile with new rating
            await db.business_profiles.update_one(
                {"_id": professional_id},
                {
                    "$set": {
                        "avg_rating": avg_rating,
                        "total_reviews": total_reviews,
                        "updated_at": datetime.utcnow()
                    }
                }
            )
        
    except Exception as e:
        print(f"Error updating professional rating: {str(e)}")

@router.delete("/reviews/{review_id}")
async def delete_review(
    review_id: str,
    current_user: User = Depends(get_current_user)
):
    """Delete a review (only by the author or admin)"""
    try:
        # Find the review
        review = await db.reviews.find_one({"_id": review_id})
        if not review:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Review not found"
            )
        
        # Check permissions
        if review["customer_id"] != current_user.id and current_user.user_type != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only delete your own reviews"
            )
        
        # Delete the review
        await db.reviews.delete_one({"_id": review_id})
        
        # Update professional's rating
        await update_professional_rating(review["professional_id"])
        
        return {"message": "Review deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error deleting review: {str(e)}"
        )