# Niwi Platform - Complete Project Structure

## Overview
Niwi is a dual-sided marketplace connecting service professionals (contractors, real estate agents, mortgage brokers, electricians, plumbers, HVAC specialists) with customers seeking services. Built with React frontend, FastAPI backend, and MongoDB database.

**NEW DESIGN**: The platform now features an Inkris-inspired features layout combined with Bark's "How it Works" process flow, maintaining all existing Niwi functionality while providing a more professional, conversion-focused user experience.

## Technology Stack
- **Frontend**: React 18, Tailwind CSS, React Router DOM
- **Backend**: FastAPI (Python), Pydantic, JWT Authentication
- **Database**: MongoDB with Motor (async driver)
- **Payment**: Stripe Integration
- **Authentication**: JWT + bcrypt password hashing
- **Deployment**: Docker containers with supervisor

---

## Directory Structure

```
/app/
├── backend/
│   ├── server.py              # Main FastAPI application
│   ├── models.py              # Pydantic data models
│   ├── auth.py                # Authentication utilities
│   ├── requirements.txt       # Python dependencies
│   ├── .env                  # Backend environment variables
│   └── routes/               # API route modules
│       ├── __init__.py
│       ├── auth.py           # Authentication routes
│       ├── professionals.py   # Professional user routes
│       ├── customers.py       # Customer routes
│       ├── admin.py          # Admin routes
│       ├── credits.py        # Credit system routes
│       └── webhooks.py       # Stripe webhook handlers
├── frontend/
│   ├── package.json          # Node.js dependencies
│   ├── tailwind.config.js    # Tailwind CSS configuration
│   ├── postcss.config.js     # PostCSS configuration
│   ├── .env                  # Frontend environment variables
│   ├── public/              # Static files
│   └── src/
│       ├── index.js         # React app entry point
│       ├── App.js           # Main React component with routing
│       ├── App.css          # Global CSS styles
│       ├── index.css        # Base CSS with Tailwind imports
│       ├── contexts/
│       │   └── AuthContext.js # Authentication context provider
│       └── pages/           # React page components
│           ├── LandingPage.js
│           ├── Login.js
│           ├── ProfessionalSignup.js
│           ├── ProfessionalDashboard.js
│           ├── ProfessionalProfile.js
│           ├── CustomerRequest.js
│           ├── Credits.js
│           ├── CreditSuccess.js
│           └── AdminDashboard.js
└── PROJECT_STRUCTURE.md    # This documentation file
```

---

## Core Components Breakdown

### 1. BACKEND COMPONENTS

#### `/backend/server.py`
- **Purpose**: Main FastAPI application entry point
- **Key Features**:
  - FastAPI app initialization
  - CORS middleware configuration
  - Router inclusion for all API endpoints
  - MongoDB connection setup
  - Health check endpoint

#### `/backend/models.py` 
- **Purpose**: Pydantic data models for validation and serialization
- **Key Models**:
  - `User`: Base user model (professionals, customers, admins)
  - `BusinessProfile`: Professional business information
  - `CustomerRequest`: Service requests from customers
  - `Lead`: Lead generation and assignment
  - `Review`: Professional reviews and ratings
  - `CreditPackage`: Credit purchase packages
  - `Transaction`: Payment transaction records

#### `/backend/auth.py`
- **Purpose**: Authentication utilities and security
- **Key Features**:
  - Password hashing with bcrypt
  - JWT token generation and validation
  - Current user dependency for protected routes
  - Role-based access control

#### `/backend/routes/auth.py`
- **Purpose**: User authentication endpoints
- **Key Endpoints**:
  - `POST /api/auth/register` - User registration
  - `POST /api/auth/login` - User login (OAuth2 form data)
  - `GET /api/auth/me` - Get current user profile
  - `PUT /api/auth/me` - Update user profile

#### `/backend/routes/professionals.py`
- **Purpose**: Professional user management
- **Key Endpoints**:
  - `POST /api/professionals/profile` - Create business profile
  - `GET /api/professionals/profile` - Get business profile
  - `PUT /api/professionals/profile` - Update business profile
  - `GET /api/professionals/leads` - Get assigned leads
  - `PUT /api/professionals/leads/{lead_id}/status` - Update lead status
  - `GET /api/professionals/` - Public professional search
  - `GET /api/professionals/{professional_id}` - Get specific profile

#### `/backend/routes/customers.py`
- **Purpose**: Customer request management
- **Key Endpoints**:
  - `POST /api/customers/requests/quick` - Quick request (no auth)
  - `POST /api/customers/requests` - Authenticated requests
  - `GET /api/customers/requests` - Get customer's requests
  - `GET /api/customers/requests/{request_id}` - Get specific request
  - `PUT /api/customers/requests/{request_id}` - Update request
  - `DELETE /api/customers/requests/{request_id}` - Delete request

#### `/backend/routes/admin.py`
- **Purpose**: Admin management functions
- **Key Endpoints**:
  - `GET /api/admin/users` - Get all users with filtering
  - `PUT /api/admin/users/{user_id}/status` - Update user status
  - `GET /api/admin/profiles` - Get all business profiles
  - `PUT /api/admin/profiles/{profile_id}/verify` - Verify profile
  - `GET /api/admin/customer-requests` - Get all requests
  - `POST /api/admin/leads` - Manually assign leads
  - `GET /api/admin/leads` - Get all leads with filtering
  - `DELETE /api/admin/leads/{lead_id}` - Delete lead assignment
  - `GET /api/admin/stats` - Get platform statistics

#### `/backend/routes/credits.py`
- **Purpose**: Credit system management
- **Key Endpoints**:
  - `GET /api/credits/packages` - Get credit packages
  - `POST /api/credits/purchase` - Initiate credit purchase
  - `GET /api/credits/balance` - Get user credit balance
  - `POST /api/credits/deduct` - Deduct credits for lead access

#### `/backend/routes/webhooks.py`
- **Purpose**: Stripe payment webhooks
- **Key Endpoints**:
  - `POST /api/webhooks/stripe` - Handle Stripe payment events

---

### 2. FRONTEND COMPONENTS

#### `/frontend/src/App.js`
- **Purpose**: Main React component with routing
- **Key Features**:
  - React Router setup with all routes
  - AuthProvider integration
  - Route definitions for all pages

#### `/frontend/src/contexts/AuthContext.js`
- **Purpose**: Global authentication state management
- **Key Features**:
  - User login/logout functionality
  - JWT token management with localStorage
  - Role-based redirect logic
  - Current user state management

#### `/frontend/src/pages/LandingPage.js`
- **Purpose**: Main public-facing landing page
- **Key Features**:
  - Dual-sided value proposition (professionals vs customers)
  - Interactive tab switching
  - Service category showcase with luxury SVG icons
  - Pricing packages with Stripe checkout links
  - Responsive design for mobile/desktop
  - Interactive feature cards with hover effects
  - Trust indicators and social proof

#### `/frontend/src/pages/Login.js`
- **Purpose**: Universal login form
- **Key Features**:
  - Role-based authentication
  - OAuth2 form data submission
  - Error handling and validation
  - Automatic redirect based on user role

#### `/frontend/src/pages/ProfessionalSignup.js`
- **Purpose**: Professional registration flow
- **Key Features**:
  - Two-step registration process
  - Personal information collection
  - Business profile creation
  - Service category selection
  - Form validation and progress indicators

#### `/frontend/src/pages/CustomerRequest.js`
- **Purpose**: Customer service request form
- **Key Features**:
  - Comprehensive request form
  - Service type selection
  - Location and budget inputs
  - Quick request for non-authenticated users

#### `/frontend/src/pages/ProfessionalDashboard.js`
- **Purpose**: Professional user dashboard
- **Key Features**:
  - Lead statistics overview
  - Recent leads display
  - Quick action buttons
  - Credit balance display

#### `/frontend/src/pages/AdminDashboard.js`
- **Purpose**: Admin control panel
- **Key Features**:
  - Platform statistics overview
  - Recent activity feed
  - Quick action buttons for admin tasks

#### `/frontend/src/pages/Credits.js`
- **Purpose**: Credit package display and purchase
- **Key Features**:
  - Credit package cards with pricing
  - Stripe checkout integration
  - Package comparison features

#### `/frontend/src/pages/ProfessionalProfile.js`
- **Purpose**: Bark-style professional profile page
- **Key Features**:
  - Left column profile card
  - Right column tabbed content
  - Reviews and Q&As sections
  - Services offered display

---

## Configuration Files

### Backend Configuration

#### `/backend/.env`
```env
JWT_SECRET=your_jwt_secret_key
MONGO_URL=mongodb://localhost:27017/niwi_platform
STRIPE_SECRET_KEY=your_stripe_secret_key
```

#### `/backend/requirements.txt`
```txt
fastapi==0.104.1
uvicorn==0.24.0
motor==3.3.2
pydantic==2.5.0
python-jose[cryptography]==3.3.0
python-multipart==0.0.6
bcrypt==4.1.2
stripe==7.8.0
```

### Frontend Configuration

#### `/frontend/.env`
```env
REACT_APP_BACKEND_URL=http://localhost:8001
```

#### `/frontend/package.json`
```json
{
  "name": "niwi-frontend",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.1",
    "react-scripts": "5.0.1",
    "axios": "^1.6.2"
  },
  "devDependencies": {
    "tailwindcss": "^3.3.6",
    "postcss": "^8.4.32",
    "autoprefixer": "^10.4.16"
  }
}
```

#### `/frontend/tailwind.config.js`
```js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        emerald: {
          50: '#ecfdf5',
          100: '#d1fae5',
          500: '#10b981',
          600: '#059669',
          700: '#047857'
        }
      }
    },
  },
  plugins: [],
}
```

---

## Database Schema

### Users Collection
```javascript
{
  _id: "uuid",
  email: "user@example.com",
  password: "hashed_password",
  first_name: "John",
  last_name: "Doe",
  user_type: "professional|customer|admin",
  phone: "+1234567890",
  is_active: true,
  created_at: "2025-01-01T00:00:00Z",
  updated_at: "2025-01-01T00:00:00Z"
}
```

### Business Profiles Collection
```javascript
{
  _id: "uuid",
  user_id: "uuid",
  business_name: "ABC Contractors",
  service_categories: ["contractors", "electricians"],
  location: {
    city: "Toronto",
    province: "ON"
  },
  years_experience: 5,
  description: "Professional contracting services",
  is_verified: false,
  created_at: "2025-01-01T00:00:00Z"
}
```

### Customer Requests Collection
```javascript
{
  _id: "uuid",
  customer_id: "uuid|null", // null for quick requests
  service_type: "contractors",
  title: "Kitchen Renovation",
  description: "Need full kitchen renovation",
  location: {
    city: "Toronto",
    province: "ON"
  },
  budget: {
    min: 10000,
    max: 50000
  },
  urgency: "within_week",
  contact_preference: "email",
  status: "open|assigned|completed",
  created_at: "2025-01-01T00:00:00Z"
}
```

---

## API Endpoints Summary

### Authentication (`/api/auth/`)
- `POST /register` - User registration
- `POST /login` - User authentication
- `GET /me` - Get current user
- `PUT /me` - Update profile

### Professionals (`/api/professionals/`)
- `POST /profile` - Create business profile
- `GET /profile` - Get own profile
- `PUT /profile` - Update profile
- `GET /leads` - Get assigned leads
- `PUT /leads/{id}/status` - Update lead status
- `GET /` - Search professionals (public)
- `GET /{id}` - Get specific professional

### Customers (`/api/customers/`)
- `POST /requests/quick` - Quick request (no auth)
- `POST /requests` - Create request (auth)
- `GET /requests` - Get own requests
- `GET /requests/{id}` - Get specific request
- `PUT /requests/{id}` - Update request
- `DELETE /requests/{id}` - Delete request

### Admin (`/api/admin/`)
- `GET /users` - Get all users
- `PUT /users/{id}/status` - Update user status
- `GET /profiles` - Get all profiles
- `PUT /profiles/{id}/verify` - Verify profile
- `GET /customer-requests` - Get all requests
- `POST /leads` - Assign leads
- `GET /leads` - Get all leads
- `DELETE /leads/{id}` - Delete lead
- `GET /stats` - Platform statistics

### Credits (`/api/credits/`)
- `GET /packages` - Get credit packages
- `POST /purchase` - Purchase credits
- `GET /balance` - Get credit balance
- `POST /deduct` - Deduct credits

### Webhooks (`/api/webhooks/`)
- `POST /stripe` - Stripe payment webhook

---

## Key Features Implemented

### 1. **Dual-Sided Marketplace**
- Professional registration and profile creation
- Customer request submission system
- Lead matching and assignment system

### 2. **Credit-Based System**
- Stripe-integrated payment system
- Credit packages for professionals
- Credit deduction for lead access

### 3. **Authentication & Authorization**
- JWT-based authentication
- Role-based access control
- Protected routes and endpoints

### 4. **Responsive UI/UX**
- Mobile-first design approach
- Interactive components with hover effects
- Luxury SVG icons and professional styling

### 5. **Admin Management**
- User and professional verification
- Lead assignment and monitoring
- Platform statistics and reporting

---

## Environment Setup

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

### Frontend Setup
```bash
cd frontend
yarn install
yarn start
```

### MongoDB Setup
```bash
# MongoDB should be running on localhost:27017
# Database: niwi_platform
# Collections: users, business_profiles, customer_requests, leads
```

---

## Deployment Notes

- **Backend**: Runs on port 8001 with supervisor management
- **Frontend**: Runs on port 3000 with hot reload
- **Database**: MongoDB connection via MONGO_URL environment variable
- **Payment**: Stripe integration with webhook endpoint for payment processing
- **Environment**: Kubernetes containerized deployment with ingress routing

---

## Security Considerations

1. **Password Security**: bcrypt hashing for all user passwords
2. **JWT Tokens**: Secure token generation with expiration
3. **API Protection**: Protected routes with authentication middleware
4. **Input Validation**: Pydantic models for request/response validation
5. **CORS**: Proper CORS configuration for frontend-backend communication

---

This documentation provides a complete overview of the Niwi platform architecture, enabling future development and modifications to the codebase.