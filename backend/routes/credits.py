from fastapi import APIRouter, Depends, HTTPException, status, Request
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List, Optional
from datetime import datetime
import os

from models import (
    CreditBalance, CreditTransaction, PaymentTransaction, CreditPackage,
    CreditPurchaseRequest, PaymentStatusResponse, CreditBalanceResponse,
    PaymentStatus
)
from auth import get_current_professional

# Import Stripe integration
from emergentintegrations.payments.stripe.checkout import (
    StripeCheckout, CheckoutSessionResponse, CheckoutStatusResponse, 
    CheckoutSessionRequest
)

router = APIRouter(prefix="/credits", tags=["credits"])

def get_database() -> AsyncIOMotorDatabase:
    from server import db
    return db

# Define credit packages with new pricing structure
CREDIT_PACKAGES = {
    CreditPackage.STARTER_10: {
        "credits": 3,
        "price": 150.00,
        "name": "Tester Pack",
        "description": "Perfect for testing the platform"
    },
    CreditPackage.BASIC_25: {
        "credits": 25, 
        "price": 499.00,
        "name": "777 Pack",
        "description": "Great for small businesses"
    },
    CreditPackage.PROFESSIONAL_50: {
        "credits": 20,
        "price": 1500.00,
        "name": "Elite Pack", 
        "description": "20 Exclusive leads for growing businesses"
    },
    CreditPackage.PREMIUM_100: {
        "credits": 30,
        "price": 2000.00,
        "name": "Pro Pack",
        "description": "30 Exclusive leads for active professionals"
    },
    CreditPackage.BUSINESS_250: {
        "credits": 100,
        "price": 6000.00,
        "name": "Premium Deluxe",
        "description": "For established businesses"
    },
    CreditPackage.ENTERPRISE_500: {
        "credits": 200,
        "price": 13250.00,
        "name": "Enterprise Deluxe",
        "description": "200 quality leads for large operations"
    }
}

@router.get("/balance", response_model=CreditBalanceResponse)
async def get_credit_balance(current_user: dict = Depends(get_current_professional)):
    """Get current professional's credit balance."""
    db = get_database()
    
    # Get or create credit balance
    balance_doc = await db.credit_balances.find_one({"user_id": current_user["user_id"]})
    
    if not balance_doc:
        # Create new balance record
        credit_balance = CreditBalance(user_id=current_user["user_id"])
        await db.credit_balances.insert_one(credit_balance.dict())
        return CreditBalanceResponse(**credit_balance.dict())
    
    return CreditBalanceResponse(**balance_doc)

@router.get("/packages")
async def get_credit_packages():
    """Get available credit packages."""
    packages = []
    for package_type, details in CREDIT_PACKAGES.items():
        packages.append({
            "package_type": package_type,
            "credits": details["credits"],
            "price": details["price"],
            "name": details["name"],
            "description": details["description"],
            "price_per_credit": round(details["price"] / details["credits"], 2)
        })
    
    return {"packages": packages}

@router.post("/purchase")
async def purchase_credits(
    request: Request,
    purchase_request: CreditPurchaseRequest,
    current_user: dict = Depends(get_current_professional)
):
    """Initiate credit purchase through Stripe checkout."""
    db = get_database()
    
    # Validate package
    if purchase_request.package_type not in CREDIT_PACKAGES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid credit package"
        )
    
    package_details = CREDIT_PACKAGES[purchase_request.package_type]
    
    # Initialize Stripe checkout
    stripe_api_key = os.environ.get('STRIPE_API_KEY')
    if not stripe_api_key:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Payment system not configured"
        )
    
    host_url = str(request.base_url).rstrip('/')
    webhook_url = f"{host_url}/api/webhook/stripe"
    stripe_checkout = StripeCheckout(api_key=stripe_api_key, webhook_url=webhook_url)
    
    # Build success and cancel URLs
    success_url = f"{purchase_request.origin_url}/credits/success?session_id={{CHECKOUT_SESSION_ID}}"
    cancel_url = f"{purchase_request.origin_url}/credits"
    
    # Create checkout session
    checkout_request = CheckoutSessionRequest(
        amount=package_details["price"],
        currency="usd",
        success_url=success_url,
        cancel_url=cancel_url,
        metadata={
            "user_id": current_user["user_id"],
            "package_type": purchase_request.package_type.value,
            "credits": str(package_details["credits"]),
            "purpose": "credit_purchase"
        }
    )
    
    try:
        session_response = await stripe_checkout.create_checkout_session(checkout_request)
        
        # Create payment transaction record
        payment_transaction = PaymentTransaction(
            user_id=current_user["user_id"],
            session_id=session_response.session_id,
            amount=package_details["price"],
            currency="usd",
            credits_purchased=package_details["credits"],
            package_type=purchase_request.package_type,
            payment_status=PaymentStatus.INITIATED,
            metadata={
                "package_name": package_details["name"],
                "user_email": current_user["email"]
            }
        )
        
        await db.payment_transactions.insert_one(payment_transaction.dict())
        
        return {
            "checkout_url": session_response.url,
            "session_id": session_response.session_id
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create payment session: {str(e)}"
        )

@router.get("/payment-status/{session_id}")
async def check_payment_status(
    session_id: str,
    current_user: dict = Depends(get_current_professional)
):
    """Check payment status and process credit addition."""
    db = get_database()
    
    # Find payment transaction
    payment_doc = await db.payment_transactions.find_one({
        "session_id": session_id,
        "user_id": current_user["user_id"]
    })
    
    if not payment_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Payment transaction not found"
        )
    
    payment_transaction = PaymentTransaction(**payment_doc)
    
    # If already completed, return current status
    if payment_transaction.payment_status == PaymentStatus.COMPLETED:
        return PaymentStatusResponse(
            payment_status="completed",
            credits_added=payment_transaction.credits_purchased,
            new_balance=await get_current_balance(db, current_user["user_id"])
        )
    
    # Check with Stripe
    stripe_api_key = os.environ.get('STRIPE_API_KEY')
    stripe_checkout = StripeCheckout(api_key=stripe_api_key, webhook_url="")
    
    try:
        status_response = await stripe_checkout.get_checkout_status(session_id)
        
        # Update payment transaction status
        new_status = PaymentStatus.COMPLETED if status_response.payment_status == "paid" else PaymentStatus.PENDING
        if status_response.status == "expired":
            new_status = PaymentStatus.EXPIRED
            
        await db.payment_transactions.update_one(
            {"session_id": session_id},
            {
                "$set": {
                    "payment_status": new_status,
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
        # If payment completed, add credits
        if new_status == PaymentStatus.COMPLETED and payment_transaction.payment_status != PaymentStatus.COMPLETED:
            await add_credits_to_user(
                db, 
                current_user["user_id"], 
                payment_transaction.credits_purchased,
                f"Credit purchase - {payment_transaction.package_type.value}",
                session_id
            )
        
        return PaymentStatusResponse(
            payment_status=status_response.payment_status,
            credits_added=payment_transaction.credits_purchased if new_status == PaymentStatus.COMPLETED else 0,
            new_balance=await get_current_balance(db, current_user["user_id"])
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to check payment status: {str(e)}"
        )

@router.get("/transactions")
async def get_credit_transactions(current_user: dict = Depends(get_current_professional)):
    """Get professional's credit transaction history."""
    db = get_database()
    
    transactions = await db.credit_transactions.find(
        {"user_id": current_user["user_id"]}
    ).sort("created_at", -1).limit(50).to_list(50)
    
    return {"transactions": transactions}

async def add_credits_to_user(db, user_id: str, credits: int, description: str, payment_session_id: str = None):
    """Add credits to user's balance and create transaction record."""
    # Get or create credit balance
    balance_doc = await db.credit_balances.find_one({"user_id": user_id})
    
    if balance_doc:
        # Update existing balance
        new_balance = balance_doc["balance"] + credits
        new_total_purchased = balance_doc["total_purchased"] + credits
        
        await db.credit_balances.update_one(
            {"user_id": user_id},
            {
                "$set": {
                    "balance": new_balance,
                    "total_purchased": new_total_purchased,
                    "last_updated": datetime.utcnow()
                }
            }
        )
    else:
        # Create new balance
        credit_balance = CreditBalance(
            user_id=user_id,
            balance=credits,
            total_purchased=credits
        )
        await db.credit_balances.insert_one(credit_balance.dict())
    
    # Create credit transaction
    credit_transaction = CreditTransaction(
        user_id=user_id,
        transaction_type="purchase",
        amount=credits,
        description=description,
        payment_session_id=payment_session_id
    )
    
    await db.credit_transactions.insert_one(credit_transaction.dict())

async def use_credits_for_lead(db, user_id: str, lead_id: str, credits_used: int = 1):
    """Deduct credits when professional views a lead."""
    # Check balance
    balance_doc = await db.credit_balances.find_one({"user_id": user_id})
    
    if not balance_doc or balance_doc["balance"] < credits_used:
        raise HTTPException(
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
            detail="Insufficient credits. Please purchase more credits to view leads."
        )
    
    # Deduct credits
    new_balance = balance_doc["balance"] - credits_used
    new_total_used = balance_doc["total_used"] + credits_used
    
    await db.credit_balances.update_one(
        {"user_id": user_id},
        {
            "$set": {
                "balance": new_balance,
                "total_used": new_total_used,
                "last_updated": datetime.utcnow()
            }
        }
    )
    
    # Create credit transaction
    credit_transaction = CreditTransaction(
        user_id=user_id,
        transaction_type="use",
        amount=-credits_used,
        description=f"Used {credits_used} credit(s) to view lead",
        lead_id=lead_id
    )
    
    await db.credit_transactions.insert_one(credit_transaction.dict())

async def get_current_balance(db, user_id: str) -> int:
    """Get user's current credit balance."""
    balance_doc = await db.credit_balances.find_one({"user_id": user_id})
    return balance_doc["balance"] if balance_doc else 0