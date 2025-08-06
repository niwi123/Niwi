from fastapi import FastAPI
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path

# Import route modules
from routes.auth import router as auth_router
from routes.professionals import router as professionals_router
from routes.customers import router as customers_router
from routes.admin import router as admin_router
from routes.credits import router as credits_router
from routes.webhooks import router as webhooks_router

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'niwi_platform')]

# Create the main app
app = FastAPI(
    title="Niwi Platform API",
    description="Lead generation platform connecting service professionals with customers",
    version="1.0.0"
)

# Health check endpoint
@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "message": "Niwi Platform API is running"}

# Include all routers with /api prefix
app.include_router(auth_router, prefix="/api")
app.include_router(professionals_router, prefix="/api")
app.include_router(customers_router, prefix="/api")
app.include_router(admin_router, prefix="/api")

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
