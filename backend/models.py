from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum
import uuid

class UserType(str, Enum):
    PROFESSIONAL = "professional"
    CUSTOMER = "customer"
    ADMIN = "admin"

class ServiceCategory(str, Enum):
    CONTRACTOR = "contractor"
    REAL_ESTATE = "real_estate"
    MORTGAGE_BROKER = "mortgage_broker"
    PLUMBER = "plumber"
    ELECTRICIAN = "electrician"
    HVAC = "hvac"
    ROOFING = "roofing"
    LANDSCAPING = "landscaping"
    CLEANING = "cleaning"
    HANDYMAN = "handyman"
    PAINTER = "painter"
    FLOORING = "flooring"

class LeadStatus(str, Enum):
    PENDING = "pending"
    ASSIGNED = "assigned"
    CONTACTED = "contacted"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class LeadPriority(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"

class PaymentStatus(str, Enum):
    PENDING = "pending"
    INITIATED = "initiated"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"
    EXPIRED = "expired"

class CreditPackage(str, Enum):
    STARTER_10 = "starter_10"      # 10 credits
    BASIC_25 = "basic_25"          # 25 credits  
    PROFESSIONAL_50 = "professional_50"  # 50 credits
    PREMIUM_100 = "premium_100"    # 100 credits
    BUSINESS_250 = "business_250"  # 250 credits
    ENTERPRISE_500 = "enterprise_500"  # 500 credits
    ULTIMATE_1000 = "ultimate_1000"  # 1000 credits

# Credit system models
class CreditBalance(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    balance: int = 0
    total_purchased: int = 0
    total_used: int = 0
    last_updated: datetime = Field(default_factory=datetime.utcnow)

class CreditTransaction(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    transaction_type: str  # "purchase", "use", "refund"
    amount: int  # positive for purchase/refund, negative for use
    description: str
    lead_id: Optional[str] = None  # if used for viewing a lead
    payment_session_id: Optional[str] = None  # for purchase transactions
    created_at: datetime = Field(default_factory=datetime.utcnow)

class PaymentTransaction(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    session_id: str
    payment_id: Optional[str] = None
    amount: float
    currency: str = "usd"
    credits_purchased: int
    package_type: CreditPackage
    payment_status: PaymentStatus = PaymentStatus.PENDING
    metadata: Dict[str, Any] = {}
    stripe_payment_intent_id: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# Base Models (existing ones remain the same)
class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    password_hash: str
    user_type: UserType
    first_name: str
    last_name: str
    phone: Optional[str] = None
    is_active: bool = True
    is_verified: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    user_type: UserType
    first_name: str
    last_name: str
    phone: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class BusinessProfile(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    business_name: str
    service_categories: List[ServiceCategory]
    description: str
    service_areas: List[str]  # Cities/regions they serve
    years_experience: int
    license_number: Optional[str] = None
    insurance_verified: bool = False
    website: Optional[str] = None
    business_phone: Optional[str] = None
    address: Optional[str] = None
    city: str
    province: str
    postal_code: str
    hourly_rate_min: Optional[float] = None
    hourly_rate_max: Optional[float] = None
    portfolio_images: List[str] = []  # URLs to portfolio images
    certifications: List[str] = []
    rating: float = 0.0
    review_count: int = 0
    is_featured: bool = False
    is_verified: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class BusinessProfileCreate(BaseModel):
    business_name: str
    service_categories: List[ServiceCategory]
    description: str
    service_areas: List[str]
    years_experience: int
    license_number: Optional[str] = None
    website: Optional[str] = None
    business_phone: Optional[str] = None
    address: Optional[str] = None
    city: str
    province: str
    postal_code: str
    hourly_rate_min: Optional[float] = None
    hourly_rate_max: Optional[float] = None

class CustomerRequest(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    customer_id: str
    service_category: ServiceCategory
    title: str
    description: str
    location: str
    city: str
    province: str
    budget_min: Optional[float] = None
    budget_max: Optional[float] = None
    timeline: str  # e.g., "ASAP", "Within 1 week", "Within 1 month"
    urgency: LeadPriority
    contact_preference: str  # "phone", "email", "either"
    property_type: Optional[str] = None  # For relevant services
    square_footage: Optional[int] = None
    additional_details: Dict[str, Any] = {}
    status: LeadStatus = LeadStatus.PENDING
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class CustomerRequestCreate(BaseModel):
    service_category: ServiceCategory
    title: str
    description: str
    location: str
    city: str
    province: str
    budget_min: Optional[float] = None
    budget_max: Optional[float] = None
    timeline: str
    urgency: LeadPriority
    contact_preference: str
    property_type: Optional[str] = None
    square_footage: Optional[int] = None
    additional_details: Dict[str, Any] = {}

class Lead(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    customer_request_id: str
    professional_id: str
    status: LeadStatus = LeadStatus.ASSIGNED
    assigned_at: datetime = Field(default_factory=datetime.utcnow)
    contacted_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    notes: str = ""
    quote_amount: Optional[float] = None
    is_won: Optional[bool] = None
    feedback_rating: Optional[int] = None  # 1-5 stars
    feedback_comment: Optional[str] = None
    # Credit system integration
    credits_used: int = 1  # Default 1 credit per lead view
    viewed_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class LeadCreate(BaseModel):
    customer_request_id: str
    professional_id: str

class Review(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    business_profile_id: str
    customer_id: str
    lead_id: str
    rating: int  # 1-5 stars
    title: str
    comment: str
    is_verified: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ReviewCreate(BaseModel):
    business_profile_id: str
    lead_id: str
    rating: int
    title: str
    comment: str

# Payment request models
class CreditPurchaseRequest(BaseModel):
    package_type: CreditPackage
    origin_url: str

class PaymentStatusResponse(BaseModel):
    payment_status: str
    credits_added: int
    new_balance: int

# Response models (existing ones remain the same)
class UserResponse(BaseModel):
    id: str
    email: str
    user_type: UserType
    first_name: str
    last_name: str
    phone: Optional[str]
    is_active: bool
    is_verified: bool
    created_at: datetime

class BusinessProfileResponse(BaseModel):
    id: str
    user_id: str
    business_name: str
    service_categories: List[ServiceCategory]
    description: str
    service_areas: List[str]
    years_experience: int
    city: str
    province: str
    hourly_rate_min: Optional[float]
    hourly_rate_max: Optional[float]
    rating: float
    review_count: int
    is_featured: bool
    is_verified: bool
    created_at: datetime

class CustomerRequestResponse(BaseModel):
    id: str
    customer_id: str
    service_category: ServiceCategory
    title: str
    description: str
    location: str
    city: str
    province: str
    budget_min: Optional[float]
    budget_max: Optional[float]
    timeline: str
    urgency: LeadPriority
    status: LeadStatus
    created_at: datetime

class LeadResponse(BaseModel):
    id: str
    customer_request_id: str
    professional_id: str
    status: LeadStatus
    assigned_at: datetime
    quote_amount: Optional[float]
    is_won: Optional[bool]
    credits_used: int
    viewed_at: Optional[datetime]
    created_at: datetime

class CreditBalanceResponse(BaseModel):
    balance: int
    total_purchased: int
    total_used: int
    last_updated: datetime

# Chat-related models
class ChatSession(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: Optional[str] = None  # Can be anonymous
    session_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    metadata: Dict[str, Any] = Field(default_factory=dict)

class ChatMessage(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: str
    role: str  # "user" or "assistant"
    content: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    metadata: Dict[str, Any] = Field(default_factory=dict)

class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None  # If None, create new session
    user_id: Optional[str] = None  # For logged in users

class ChatResponse(BaseModel):
    message: str
    session_id: str
    is_new_session: bool = False

class ChatHistory(BaseModel):
    session_id: str
    messages: List[ChatMessage]
    created_at: datetime
    updated_at: datetime