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

# Base Models
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

# Response models
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
    created_at: datetime