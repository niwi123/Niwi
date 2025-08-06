from fastapi import APIRouter, Request, HTTPException
from motor.motor_asyncio import AsyncIOMotorDatabase
import os
from datetime import datetime

from models import PaymentStatus
from emergentintegrations.payments.stripe.checkout import StripeCheckout

router = APIRouter(prefix="/webhook", tags=["webhooks"])

def get_database() -> AsyncIOMotorDatabase:
    from server import db
    return db

@router.post("/stripe")
async def stripe_webhook(request: Request):
    """Handle Stripe webhook events."""
    db = get_database()
    
    # Get request body and signature
    body = await request.body()
    signature = request.headers.get("Stripe-Signature")
    
    if not signature:
        raise HTTPException(status_code=400, detail="Missing Stripe signature")
    
    # Initialize Stripe checkout
    stripe_api_key = os.environ.get('STRIPE_API_KEY')
    if not stripe_api_key:
        raise HTTPException(status_code=500, detail="Payment system not configured")
    
    stripe_checkout = StripeCheckout(api_key=stripe_api_key, webhook_url="")
    
    try:
        # Handle webhook
        webhook_response = await stripe_checkout.handle_webhook(body, signature)
        
        # Process the webhook event
        if webhook_response.event_type in ["checkout.session.completed", "payment_intent.succeeded"]:
            session_id = webhook_response.session_id
            
            # Find and update payment transaction
            payment_doc = await db.payment_transactions.find_one({"session_id": session_id})
            
            if payment_doc:
                # Update payment status
                await db.payment_transactions.update_one(
                    {"session_id": session_id},
                    {
                        "$set": {
                            "payment_status": PaymentStatus.COMPLETED,
                            "updated_at": datetime.utcnow()
                        }
                    }
                )
                
                # Add credits to user if not already added
                if payment_doc["payment_status"] != PaymentStatus.COMPLETED:
                    from routes.credits import add_credits_to_user
                    await add_credits_to_user(
                        db,
                        payment_doc["user_id"],
                        payment_doc["credits_purchased"],
                        f"Credit purchase - {payment_doc['package_type']}",
                        session_id
                    )
        
        return {"status": "success", "event_type": webhook_response.event_type}
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Webhook error: {str(e)}")