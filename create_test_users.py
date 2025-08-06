#!/usr/bin/env python3
"""
Script to create test users for the Niwi platform
"""
import asyncio
import os
import sys
from datetime import datetime
import uuid
from motor.motor_asyncio import AsyncIOMotorClient
import bcrypt

# Add the backend directory to the Python path
sys.path.append('/app/backend')

MONGO_URL = os.getenv('MONGO_URL', 'mongodb://localhost:27017/niwi_platform')

def get_password_hash(password: str) -> str:
    """Hash a password for storing."""
    pwd_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(pwd_bytes, salt)
    return hashed.decode('utf-8')

async def create_test_users():
    """Create test users for testing the platform"""
    client = AsyncIOMotorClient(MONGO_URL)
    db = client.niwi_platform
    
    # Test users to create
    test_users = [
        {
            "_id": str(uuid.uuid4()),
            "email": "admin@test.com",
            "password_hash": get_password_hash("password"),
            "user_type": "admin",
            "first_name": "Admin",
            "last_name": "User",
            "phone": "+1234567890",
            "is_active": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "_id": str(uuid.uuid4()),
            "email": "contractor@test.com", 
            "password_hash": get_password_hash("password"),
            "user_type": "professional",
            "first_name": "Test",
            "last_name": "Contractor",
            "phone": "+1234567891",
            "is_active": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "_id": str(uuid.uuid4()),
            "email": "customer@test.com",
            "password_hash": get_password_hash("password"),
            "user_type": "customer", 
            "first_name": "Test",
            "last_name": "Customer",
            "phone": "+1234567892",
            "is_active": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
    ]
    
    print("Creating test users...")
    
    for user in test_users:
        # Check if user already exists
        existing = await db.users.find_one({"email": user["email"]})
        if existing:
            print(f"User {user['email']} already exists, skipping...")
            continue
            
        # Create user
        await db.users.insert_one(user)
        print(f"✅ Created user: {user['email']} (Type: {user['user_type']})")
        
        # Create business profile for professional user
        if user["user_type"] == "professional":
            profile = {
                "_id": str(uuid.uuid4()),
                "user_id": user["_id"],
                "business_name": "Test Contracting Services",
                "service_categories": ["contractors"],
                "location": {
                    "city": "Toronto",
                    "province": "ON",
                    "postal_code": "M5V 3A8"
                },
                "years_experience": 5,
                "description": "Professional contracting services for residential and commercial projects.",
                "is_verified": True,
                "hourly_rate_min": 75,
                "hourly_rate_max": 150,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
            
            existing_profile = await db.business_profiles.find_one({"user_id": user["_id"]})
            if not existing_profile:
                await db.business_profiles.insert_one(profile)
                print(f"✅ Created business profile for {user['email']}")
            
            # Create initial credit balance
            credit_balance = {
                "_id": str(uuid.uuid4()),
                "user_id": user["_id"],
                "balance": 10,  # Give them some test credits
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
            
            existing_balance = await db.credit_balances.find_one({"user_id": user["_id"]})
            if not existing_balance:
                await db.credit_balances.insert_one(credit_balance)
                print(f"✅ Created credit balance for {user['email']} (10 credits)")
    
    # Create some sample customer requests for testing
    sample_requests = [
        {
            "_id": str(uuid.uuid4()),
            "customer_id": None,  # Anonymous request
            "service_type": "contractors",
            "title": "Kitchen Renovation Project",
            "description": "Looking for a contractor to renovate our kitchen. Need new cabinets, countertops, and flooring.",
            "location": {
                "city": "Toronto", 
                "province": "ON"
            },
            "budget": {
                "min": 15000,
                "max": 25000
            },
            "urgency": "within_month",
            "contact_preference": "email",
            "status": "open",
            "created_at": datetime.utcnow()
        },
        {
            "_id": str(uuid.uuid4()),
            "customer_id": None,
            "service_type": "electricians",
            "title": "Electrical Panel Upgrade",
            "description": "Need to upgrade my home's electrical panel to support new appliances.",
            "location": {
                "city": "Vancouver",
                "province": "BC"
            },
            "budget": {
                "min": 2000,
                "max": 4000
            },
            "urgency": "within_week",
            "contact_preference": "phone",
            "status": "open",
            "created_at": datetime.utcnow()
        }
    ]
    
    print("\nCreating sample customer requests...")
    for request in sample_requests:
        existing_request = await db.customer_requests.find_one({"title": request["title"]})
        if not existing_request:
            await db.customer_requests.insert_one(request)
            print(f"✅ Created sample request: {request['title']}")
        else:
            print(f"Request '{request['title']}' already exists, skipping...")
    
    print("\n✅ Test data creation completed!")
    print("\nTest accounts created:")
    print("Admin: admin@test.com / password")
    print("Contractor: contractor@test.com / password") 
    print("Customer: customer@test.com / password")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(create_test_users())