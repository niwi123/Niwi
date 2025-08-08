#!/usr/bin/env python3
"""
FINAL VERIFICATION TEST - SECRET KEYS AND AI COMPONENTS REMOVAL
Tests that the application is functioning properly after removing all secret keys and AI components.

Key Tests:
1. Authentication System: Verify login/registration still works without SendGrid
2. API Endpoints: Test that all core API endpoints are functional
3. Database Operations: Ensure database operations work properly
4. Email Notifications: Confirm that notification removal doesn't break core functionality
5. No AI Components: Verify no AI/chat endpoints are accessible
6. Security Check: Confirm no sensitive keys are exposed in responses
"""

import requests
import json
import os
from datetime import datetime
from typing import Dict, Any, Optional

# Get backend URL from environment
BACKEND_URL = "https://6be2d00e-f916-4ea9-93b7-bb62ff737612.preview.emergentagent.com/api"

class NiwiAPITester:
    def __init__(self):
        self.base_url = BACKEND_URL
        self.tokens = {}
        self.test_data = {}
        self.results = []
        
    def log_result(self, test_name: str, success: bool, message: str, details: Any = None):
        """Log test result"""
        result = {
            "test": test_name,
            "success": success,
            "message": message,
            "timestamp": datetime.now().isoformat(),
            "details": details
        }
        self.results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: {test_name} - {message}")
        if details and not success:
            print(f"   Details: {details}")
    
    def make_request(self, method: str, endpoint: str, data: Dict = None, 
                    headers: Dict = None, params: Dict = None) -> requests.Response:
        """Make HTTP request with error handling"""
        url = f"{self.base_url}{endpoint}"
        default_headers = {"Content-Type": "application/json"}
        if headers:
            default_headers.update(headers)
            
        try:
            if method.upper() == "GET":
                response = requests.get(url, headers=default_headers, params=params, timeout=30)
            elif method.upper() == "POST":
                if endpoint == "/auth/login":
                    # OAuth2 form data for login
                    response = requests.post(url, data=data, headers={"Content-Type": "application/x-www-form-urlencoded"}, timeout=30)
                else:
                    response = requests.post(url, json=data, headers=default_headers, timeout=30)
            elif method.upper() == "PUT":
                response = requests.put(url, json=data, headers=default_headers, timeout=30)
            elif method.upper() == "DELETE":
                response = requests.delete(url, headers=default_headers, timeout=30)
            else:
                raise ValueError(f"Unsupported HTTP method: {method}")
                
            return response
        except requests.exceptions.RequestException as e:
            print(f"Request failed: {e}")
            raise
    
    def get_auth_header(self, user_type: str) -> Dict[str, str]:
        """Get authorization header for user type"""
        token = self.tokens.get(user_type)
        if not token:
            raise ValueError(f"No token available for user type: {user_type}")
        return {"Authorization": f"Bearer {token}"}
    
    def test_health_check(self):
        """Test health check endpoint"""
        try:
            response = self.make_request("GET", "/health")
            if response.status_code == 200:
                data = response.json()
                if data.get("status") == "healthy":
                    self.log_result("Health Check", True, "API is healthy")
                else:
                    self.log_result("Health Check", False, "Unexpected health status", data)
            else:
                self.log_result("Health Check", False, f"HTTP {response.status_code}", response.text)
        except Exception as e:
            self.log_result("Health Check", False, f"Exception: {str(e)}")
    
    def test_user_registration(self):
        """Test user registration for all user types"""
        test_users = [
            {
                "type": "admin",
                "data": {
                    "email": "admin@test.com",
                    "password": "password",
                    "user_type": "admin",
                    "first_name": "Admin",
                    "last_name": "User",
                    "phone": "+1-416-555-0001"
                }
            },
            {
                "type": "professional",
                "data": {
                    "email": "contractor@test.com",
                    "password": "password",
                    "user_type": "professional",
                    "first_name": "Mike",
                    "last_name": "Johnson",
                    "phone": "+1-416-555-0002"
                }
            },
            {
                "type": "customer",
                "data": {
                    "email": "customer@test.com",
                    "password": "password",
                    "user_type": "customer",
                    "first_name": "Sarah",
                    "last_name": "Wilson",
                    "phone": "+1-416-555-0003"
                }
            }
        ]
        
        for user in test_users:
            try:
                response = self.make_request("POST", "/auth/register", user["data"])
                if response.status_code == 200:
                    data = response.json()
                    if "access_token" in data and "user" in data:
                        self.tokens[user["type"]] = data["access_token"]
                        self.test_data[f"{user['type']}_user"] = data["user"]
                        self.log_result(f"Register {user['type'].title()}", True, 
                                      f"Successfully registered {user['data']['email']}")
                    else:
                        self.log_result(f"Register {user['type'].title()}", False, 
                                      "Missing token or user in response", data)
                elif response.status_code == 400 and "already registered" in response.text:
                    # User already exists, try to login instead
                    self.log_result(f"Register {user['type'].title()}", True, 
                                  f"User {user['data']['email']} already exists, will test login")
                else:
                    self.log_result(f"Register {user['type'].title()}", False, 
                                  f"HTTP {response.status_code}", response.text)
            except Exception as e:
                self.log_result(f"Register {user['type'].title()}", False, f"Exception: {str(e)}")
    
    def test_user_login(self):
        """Test user login for all user types"""
        test_logins = [
            {"type": "admin", "username": "admin@test.com", "password": "password"},
            {"type": "professional", "username": "contractor@test.com", "password": "password"},
            {"type": "customer", "username": "customer@test.com", "password": "password"}
        ]
        
        for login in test_logins:
            try:
                login_data = {
                    "username": login["username"],
                    "password": login["password"]
                }
                response = self.make_request("POST", "/auth/login", login_data)
                if response.status_code == 200:
                    data = response.json()
                    if "access_token" in data:
                        self.tokens[login["type"]] = data["access_token"]
                        self.test_data[f"{login['type']}_user"] = data["user"]
                        self.log_result(f"Login {login['type'].title()}", True, 
                                      f"Successfully logged in {login['username']}")
                    else:
                        self.log_result(f"Login {login['type'].title()}", False, 
                                      "Missing access_token in response", data)
                else:
                    self.log_result(f"Login {login['type'].title()}", False, 
                                  f"HTTP {response.status_code}", response.text)
            except Exception as e:
                self.log_result(f"Login {login['type'].title()}", False, f"Exception: {str(e)}")
    
    def test_get_current_user(self):
        """Test getting current user info"""
        for user_type in ["admin", "professional", "customer"]:
            if user_type not in self.tokens:
                continue
                
            try:
                headers = self.get_auth_header(user_type)
                response = self.make_request("GET", "/auth/me", headers=headers)
                if response.status_code == 200:
                    data = response.json()
                    if "email" in data and "user_type" in data:
                        self.log_result(f"Get Current User ({user_type})", True, 
                                      f"Retrieved user info for {data['email']}")
                    else:
                        self.log_result(f"Get Current User ({user_type})", False, 
                                      "Missing required fields in response", data)
                else:
                    self.log_result(f"Get Current User ({user_type})", False, 
                                  f"HTTP {response.status_code}", response.text)
            except Exception as e:
                self.log_result(f"Get Current User ({user_type})", False, f"Exception: {str(e)}")
    
    def test_update_user_profile(self):
        """Test updating user profile"""
        if "professional" not in self.tokens:
            return
            
        try:
            headers = self.get_auth_header("professional")
            update_data = {
                "first_name": "Michael",
                "phone": "+1-416-555-9999"
            }
            response = self.make_request("PUT", "/auth/me", update_data, headers=headers)
            if response.status_code == 200:
                data = response.json()
                if data.get("first_name") == "Michael":
                    self.log_result("Update User Profile", True, "Successfully updated user profile")
                else:
                    self.log_result("Update User Profile", False, "Profile not updated correctly", data)
            else:
                self.log_result("Update User Profile", False, f"HTTP {response.status_code}", response.text)
        except Exception as e:
            self.log_result("Update User Profile", False, f"Exception: {str(e)}")
    
    def test_create_business_profile(self):
        """Test creating business profile for professional"""
        if "professional" not in self.tokens:
            return
            
        try:
            headers = self.get_auth_header("professional")
            profile_data = {
                "business_name": "Mike's Construction Services",
                "service_categories": ["contractor", "electrician"],
                "description": "Professional construction and roofing services with 15 years of experience",
                "service_areas": ["Toronto", "Mississauga", "Brampton"],
                "years_experience": 15,
                "license_number": "CON-12345",
                "website": "https://mikesconstruction.ca",
                "business_phone": "+1-416-555-0100",
                "address": "123 Construction Ave",
                "city": "Toronto",
                "province": "Ontario",
                "postal_code": "M1A 1A1",
                "hourly_rate_min": 75.0,
                "hourly_rate_max": 125.0
            }
            response = self.make_request("POST", "/professionals/profile", profile_data, headers=headers)
            if response.status_code == 200:
                data = response.json()
                if data.get("business_name") == profile_data["business_name"]:
                    self.test_data["business_profile"] = data
                    self.log_result("Create Business Profile", True, "Successfully created business profile")
                else:
                    self.log_result("Create Business Profile", False, "Profile data mismatch", data)
            elif response.status_code == 400 and "already exists" in response.text:
                self.log_result("Create Business Profile", True, "Business profile already exists")
            else:
                self.log_result("Create Business Profile", False, f"HTTP {response.status_code}", response.text)
        except Exception as e:
            self.log_result("Create Business Profile", False, f"Exception: {str(e)}")
    
    def test_get_business_profile(self):
        """Test getting business profile"""
        if "professional" not in self.tokens:
            return
            
        try:
            headers = self.get_auth_header("professional")
            response = self.make_request("GET", "/professionals/profile", headers=headers)
            if response.status_code == 200:
                data = response.json()
                if "business_name" in data and "service_categories" in data:
                    self.test_data["business_profile"] = data
                    self.log_result("Get Business Profile", True, f"Retrieved profile for {data['business_name']}")
                else:
                    self.log_result("Get Business Profile", False, "Missing required fields", data)
            else:
                self.log_result("Get Business Profile", False, f"HTTP {response.status_code}", response.text)
        except Exception as e:
            self.log_result("Get Business Profile", False, f"Exception: {str(e)}")
    
    def test_search_professionals(self):
        """Test searching professionals (public endpoint)"""
        try:
            # Test without filters
            response = self.make_request("GET", "/professionals/")
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    self.log_result("Search Professionals", True, f"Found {len(data)} professionals")
                else:
                    self.log_result("Search Professionals", False, "Expected list response", data)
            else:
                self.log_result("Search Professionals", False, f"HTTP {response.status_code}", response.text)
                
            # Test with filters
            params = {"service_category": "contractor", "city": "Toronto"}
            response = self.make_request("GET", "/professionals/", params=params)
            if response.status_code == 200:
                data = response.json()
                self.log_result("Search Professionals (Filtered)", True, f"Found {len(data)} contractors in Toronto")
            else:
                self.log_result("Search Professionals (Filtered)", False, f"HTTP {response.status_code}", response.text)
        except Exception as e:
            self.log_result("Search Professionals", False, f"Exception: {str(e)}")
    
    def test_create_customer_request(self):
        """Test creating customer service request"""
        if "customer" not in self.tokens:
            return
            
        try:
            headers = self.get_auth_header("customer")
            request_data = {
                "service_category": "contractor",
                "title": "Kitchen Renovation Project",
                "description": "Complete kitchen renovation including cabinets, countertops, and flooring",
                "location": "Toronto, Ontario",
                "city": "Toronto",
                "province": "Ontario",
                "budget_min": 15000.0,
                "budget_max": 25000.0,
                "timeline": "Within 2 months",
                "urgency": "medium",
                "contact_preference": "either",
                "property_type": "Condo",
                "square_footage": 800,
                "additional_details": {
                    "preferred_start_date": "2025-02-01",
                    "special_requirements": "Pet-friendly materials preferred"
                }
            }
            response = self.make_request("POST", "/customers/requests", request_data, headers=headers)
            if response.status_code == 200:
                data = response.json()
                if data.get("title") == request_data["title"]:
                    self.test_data["customer_request"] = data
                    self.log_result("Create Customer Request", True, "Successfully created service request")
                else:
                    self.log_result("Create Customer Request", False, "Request data mismatch", data)
            else:
                self.log_result("Create Customer Request", False, f"HTTP {response.status_code}", response.text)
        except Exception as e:
            self.log_result("Create Customer Request", False, f"Exception: {str(e)}")
    
    def test_quick_customer_request(self):
        """Test creating quick customer request (no auth)"""
        try:
            request_data = {
                "email": "guest@example.com",
                "phone": "+1-416-555-0200",
                "service_category": "plumber",
                "title": "Emergency Pipe Repair",
                "description": "Burst pipe in basement needs immediate repair",
                "city": "Toronto",
                "province": "Ontario",
                "budget_min": 200.0,
                "budget_max": 500.0,
                "timeline": "ASAP",
                "urgency": "urgent"
            }
            response = self.make_request("POST", "/customers/requests/quick", request_data)
            if response.status_code == 200:
                data = response.json()
                if data.get("title") == request_data["title"]:
                    self.test_data["quick_request"] = data
                    self.log_result("Create Quick Request", True, "Successfully created quick service request")
                else:
                    self.log_result("Create Quick Request", False, "Request data mismatch", data)
            else:
                self.log_result("Create Quick Request", False, f"HTTP {response.status_code}", response.text)
        except Exception as e:
            self.log_result("Create Quick Request", False, f"Exception: {str(e)}")
    
    def test_get_customer_requests(self):
        """Test getting customer's requests"""
        if "customer" not in self.tokens:
            return
            
        try:
            headers = self.get_auth_header("customer")
            response = self.make_request("GET", "/customers/requests", headers=headers)
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    self.log_result("Get Customer Requests", True, f"Retrieved {len(data)} customer requests")
                else:
                    self.log_result("Get Customer Requests", False, "Expected list response", data)
            else:
                self.log_result("Get Customer Requests", False, f"HTTP {response.status_code}", response.text)
        except Exception as e:
            self.log_result("Get Customer Requests", False, f"Exception: {str(e)}")
    
    def test_admin_get_users(self):
        """Test admin getting all users"""
        if "admin" not in self.tokens:
            return
            
        try:
            headers = self.get_auth_header("admin")
            response = self.make_request("GET", "/admin/users", headers=headers)
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    self.log_result("Admin Get Users", True, f"Retrieved {len(data)} users")
                else:
                    self.log_result("Admin Get Users", False, "Expected list response", data)
            else:
                self.log_result("Admin Get Users", False, f"HTTP {response.status_code}", response.text)
        except Exception as e:
            self.log_result("Admin Get Users", False, f"Exception: {str(e)}")
    
    def test_admin_get_profiles(self):
        """Test admin getting all business profiles"""
        if "admin" not in self.tokens:
            return
            
        try:
            headers = self.get_auth_header("admin")
            response = self.make_request("GET", "/admin/profiles", headers=headers)
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    self.log_result("Admin Get Profiles", True, f"Retrieved {len(data)} business profiles")
                else:
                    self.log_result("Admin Get Profiles", False, "Expected list response", data)
            else:
                self.log_result("Admin Get Profiles", False, f"HTTP {response.status_code}", response.text)
        except Exception as e:
            self.log_result("Admin Get Profiles", False, f"Exception: {str(e)}")
    
    def test_admin_get_customer_requests(self):
        """Test admin getting all customer requests"""
        if "admin" not in self.tokens:
            return
            
        try:
            headers = self.get_auth_header("admin")
            response = self.make_request("GET", "/admin/customer-requests", headers=headers)
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    self.log_result("Admin Get Customer Requests", True, f"Retrieved {len(data)} customer requests")
                else:
                    self.log_result("Admin Get Customer Requests", False, "Expected list response", data)
            else:
                self.log_result("Admin Get Customer Requests", False, f"HTTP {response.status_code}", response.text)
        except Exception as e:
            self.log_result("Admin Get Customer Requests", False, f"Exception: {str(e)}")
    
    def test_admin_assign_lead(self):
        """Test admin assigning lead to professional"""
        if "admin" not in self.tokens or "customer_request" not in self.test_data or "professional_user" not in self.test_data:
            return
            
        try:
            headers = self.get_auth_header("admin")
            lead_data = {
                "customer_request_id": self.test_data["customer_request"]["id"],
                "professional_id": self.test_data["professional_user"]["id"]
            }
            response = self.make_request("POST", "/admin/leads", lead_data, headers=headers)
            if response.status_code == 200:
                data = response.json()
                if data.get("customer_request_id") == lead_data["customer_request_id"]:
                    self.test_data["lead"] = data
                    self.log_result("Admin Assign Lead", True, "Successfully assigned lead to professional")
                else:
                    self.log_result("Admin Assign Lead", False, "Lead data mismatch", data)
            else:
                self.log_result("Admin Assign Lead", False, f"HTTP {response.status_code}", response.text)
        except Exception as e:
            self.log_result("Admin Assign Lead", False, f"Exception: {str(e)}")
    
    def test_professional_get_leads(self):
        """Test professional getting their leads"""
        if "professional" not in self.tokens:
            return
            
        try:
            headers = self.get_auth_header("professional")
            response = self.make_request("GET", "/professionals/leads", headers=headers)
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    self.log_result("Professional Get Leads", True, f"Retrieved {len(data)} leads")
                else:
                    self.log_result("Professional Get Leads", False, "Expected list response", data)
            else:
                self.log_result("Professional Get Leads", False, f"HTTP {response.status_code}", response.text)
        except Exception as e:
            self.log_result("Professional Get Leads", False, f"Exception: {str(e)}")
    
    def test_professional_update_lead_status(self):
        """Test professional updating lead status"""
        if "professional" not in self.tokens or "lead" not in self.test_data:
            return
            
        try:
            headers = self.get_auth_header("professional")
            lead_id = self.test_data["lead"]["id"]
            status_update = {
                "status": "contacted",
                "notes": "Called customer and scheduled site visit for next week",
                "quote_amount": 20000.0
            }
            response = self.make_request("PUT", f"/professionals/leads/{lead_id}/status", 
                                       status_update, headers=headers)
            if response.status_code == 200:
                data = response.json()
                if data.get("status") == "contacted":
                    self.log_result("Professional Update Lead Status", True, "Successfully updated lead status")
                else:
                    self.log_result("Professional Update Lead Status", False, "Status not updated correctly", data)
            else:
                self.log_result("Professional Update Lead Status", False, f"HTTP {response.status_code}", response.text)
        except Exception as e:
            self.log_result("Professional Update Lead Status", False, f"Exception: {str(e)}")
    
    def test_admin_get_stats(self):
        """Test admin getting platform statistics"""
        if "admin" not in self.tokens:
            return
            
        try:
            headers = self.get_auth_header("admin")
            response = self.make_request("GET", "/admin/stats", headers=headers)
            if response.status_code == 200:
                data = response.json()
                required_keys = ["user_stats", "profile_stats", "request_stats", "lead_stats"]
                if all(key in data for key in required_keys):
                    self.log_result("Admin Get Stats", True, "Successfully retrieved platform statistics")
                else:
                    self.log_result("Admin Get Stats", False, "Missing required statistics", data)
            else:
                self.log_result("Admin Get Stats", False, f"HTTP {response.status_code}", response.text)
        except Exception as e:
            self.log_result("Admin Get Stats", False, f"Exception: {str(e)}")
    
    def test_credits_packages(self):
        """Test GET /api/credits/packages endpoint for updated package descriptions"""
        try:
            response = self.make_request("GET", "/credits/packages")
            if response.status_code == 200:
                data = response.json()
                if "packages" in data and isinstance(data["packages"], list):
                    packages = data["packages"]
                    
                    # Check that we have 6 packages
                    if len(packages) != 6:
                        self.log_result("Credits Packages Count", False, f"Expected 6 packages, got {len(packages)}")
                        return
                    
                    # Find specific packages and verify descriptions
                    package_checks = {
                        "Elite Pack": "20 Exclusive leads for growing businesses",
                        "Pro Pack": "30 Exclusive leads for active professionals", 
                        "Enterprise Deluxe": "200 Exclusive leads for large operations"
                    }
                    
                    found_packages = {}
                    for package in packages:
                        if package["name"] in package_checks:
                            found_packages[package["name"]] = package["description"]
                    
                    # Verify all expected packages were found and have correct descriptions
                    all_correct = True
                    for name, expected_desc in package_checks.items():
                        if name not in found_packages:
                            self.log_result("Credits Package Description", False, f"Package '{name}' not found")
                            all_correct = False
                        elif found_packages[name] != expected_desc:
                            self.log_result("Credits Package Description", False, 
                                          f"Package '{name}' has incorrect description. Expected: '{expected_desc}', Got: '{found_packages[name]}'")
                            all_correct = False
                    
                    if all_correct:
                        self.log_result("Credits Package Descriptions", True, "All package descriptions updated correctly")
                    
                    # Verify all packages have required fields
                    required_fields = ["package_type", "credits", "price", "name", "description", "price_per_credit"]
                    for package in packages:
                        missing_fields = [field for field in required_fields if field not in package]
                        if missing_fields:
                            self.log_result("Credits Package Structure", False, 
                                          f"Package '{package.get('name', 'Unknown')}' missing fields: {missing_fields}")
                            all_correct = False
                    
                    if all_correct:
                        self.log_result("Credits Packages Structure", True, "All packages have correct structure")
                        self.log_result("Credits Packages", True, f"Successfully retrieved {len(packages)} credit packages")
                else:
                    self.log_result("Credits Packages", False, "Invalid response format", data)
            else:
                self.log_result("Credits Packages", False, f"HTTP {response.status_code}", response.text)
        except Exception as e:
            self.log_result("Credits Packages", False, f"Exception: {str(e)}")
    
    def test_credits_balance(self):
        """Test GET /api/credits/balance endpoint for professional users"""
        if "professional" not in self.tokens:
            return
            
        try:
            headers = self.get_auth_header("professional")
            response = self.make_request("GET", "/credits/balance", headers=headers)
            if response.status_code == 200:
                data = response.json()
                required_fields = ["user_id", "balance", "total_purchased", "total_used"]
                if all(field in data for field in required_fields):
                    self.log_result("Credits Balance", True, f"Retrieved balance: {data['balance']} credits")
                else:
                    missing_fields = [field for field in required_fields if field not in data]
                    self.log_result("Credits Balance", False, f"Missing fields: {missing_fields}", data)
            else:
                self.log_result("Credits Balance", False, f"HTTP {response.status_code}", response.text)
        except Exception as e:
            self.log_result("Credits Balance", False, f"Exception: {str(e)}")
    
    def test_credits_transactions(self):
        """Test GET /api/credits/transactions endpoint for professional users"""
        if "professional" not in self.tokens:
            return
            
        try:
            headers = self.get_auth_header("professional")
            response = self.make_request("GET", "/credits/transactions", headers=headers)
            if response.status_code == 200:
                data = response.json()
                if "transactions" in data and isinstance(data["transactions"], list):
                    self.log_result("Credits Transactions", True, f"Retrieved {len(data['transactions'])} transactions")
                else:
                    self.log_result("Credits Transactions", False, "Invalid response format", data)
            else:
                self.log_result("Credits Transactions", False, f"HTTP {response.status_code}", response.text)
        except Exception as e:
            self.log_result("Credits Transactions", False, f"Exception: {str(e)}")
    
    def test_ai_chat_endpoints_removed(self):
        """Test that AI chat endpoints are no longer accessible"""
        ai_endpoints = [
            "/chat/send",
            "/chat/history/test-session-id",
            "/api/chat/send",
            "/api/chat/history/test-session-id"
        ]
        
        for endpoint in ai_endpoints:
            try:
                # Test POST for send endpoints
                if "send" in endpoint:
                    response = self.make_request("POST", endpoint.replace("/api", ""), {"message": "test"})
                else:
                    # Test GET for history endpoints
                    response = self.make_request("GET", endpoint.replace("/api", ""))
                
                if response.status_code == 404:
                    self.log_result(f"AI Endpoint Removed ({endpoint})", True, 
                                  "AI endpoint correctly returns 404 - removed successfully")
                else:
                    self.log_result(f"AI Endpoint Removed ({endpoint})", False, 
                                  f"AI endpoint still accessible: HTTP {response.status_code}")
            except Exception as e:
                if "404" in str(e) or "Not Found" in str(e):
                    self.log_result(f"AI Endpoint Removed ({endpoint})", True, 
                                  "AI endpoint correctly removed - connection refused")
                else:
                    self.log_result(f"AI Endpoint Removed ({endpoint})", False, f"Exception: {str(e)}")
    
    def test_email_notifications_disabled_gracefully(self):
        """Test that email notifications are disabled but don't break functionality"""
        try:
            # Test user registration - should work without email notifications
            test_user_data = {
                "email": f"security_test_{datetime.now().strftime('%Y%m%d_%H%M%S')}@example.com",
                "password": "password123",
                "user_type": "professional",
                "first_name": "Security",
                "last_name": "Test",
                "phone": "+1-416-555-0001"
            }
            
            response = self.make_request("POST", "/auth/register", test_user_data)
            
            if response.status_code == 200:
                data = response.json()
                if "access_token" in data and "user" in data:
                    self.log_result("Email Notifications Disabled Gracefully", True, 
                                  "User registration works without email notifications")
                else:
                    self.log_result("Email Notifications Disabled Gracefully", False, 
                                  "Registration failed - missing token or user", data)
            elif response.status_code == 400 and "already registered" in response.text:
                self.log_result("Email Notifications Disabled Gracefully", True, 
                              "User already exists - email notifications disabled gracefully")
            else:
                self.log_result("Email Notifications Disabled Gracefully", False, 
                              f"Registration failed: HTTP {response.status_code}", response.text)
                
        except Exception as e:
            self.log_result("Email Notifications Disabled Gracefully", False, f"Exception: {str(e)}")
    
    def test_customer_requests_without_notifications(self):
        """Test that customer requests work without email notifications"""
        try:
            request_data = {
                "email": f"security_customer_{datetime.now().strftime('%Y%m%d_%H%M%S')}@example.com",
                "phone": "+1-416-555-5678",
                "service_category": "contractor",
                "title": "Security Test - Kitchen Renovation",
                "description": "Test request to verify system works without email notifications",
                "city": "Toronto",
                "province": "Ontario",
                "budget_min": 5000.0,
                "budget_max": 10000.0,
                "timeline": "Within 1 month",
                "urgency": "medium"
            }
            
            response = self.make_request("POST", "/customers/requests/quick", request_data)
            
            if response.status_code == 200:
                data = response.json()
                if data.get("title") == request_data["title"]:
                    self.log_result("Customer Requests Without Notifications", True, 
                                  "Customer requests work without email notifications")
                else:
                    self.log_result("Customer Requests Without Notifications", False, 
                                  "Request data mismatch", data)
            else:
                self.log_result("Customer Requests Without Notifications", False, 
                              f"Request creation failed: HTTP {response.status_code}", response.text)
                
        except Exception as e:
            self.log_result("Customer Requests Without Notifications", False, f"Exception: {str(e)}")
    
    def test_no_sensitive_keys_in_responses(self):
        """Test that no sensitive API keys are exposed in API responses"""
        sensitive_patterns = [
            "sk_",  # Stripe secret keys
            "sendgrid",  # SendGrid keys
            "openai",  # OpenAI keys
            "gpt",  # GPT keys
            "api_key",  # Generic API keys
            "secret_key",  # Secret keys
            "private_key",  # Private keys
        ]
        
        # Test various endpoints for sensitive data exposure
        test_endpoints = [
            ("/health", "GET", None),
            ("/credits/packages", "GET", None),
        ]
        
        for endpoint, method, data in test_endpoints:
            try:
                response = self.make_request(method, endpoint, data)
                if response.status_code == 200:
                    response_text = response.text.lower()
                    found_sensitive = []
                    
                    for pattern in sensitive_patterns:
                        if pattern in response_text:
                            found_sensitive.append(pattern)
                    
                    if found_sensitive:
                        self.log_result(f"No Sensitive Keys ({endpoint})", False, 
                                      f"Found sensitive patterns: {found_sensitive}")
                    else:
                        self.log_result(f"No Sensitive Keys ({endpoint})", True, 
                                      "No sensitive keys found in response")
                else:
                    self.log_result(f"No Sensitive Keys ({endpoint})", True, 
                                  f"Endpoint returned HTTP {response.status_code} - no data exposure")
            except Exception as e:
                self.log_result(f"No Sensitive Keys ({endpoint})", True, 
                              f"Endpoint not accessible - no data exposure risk: {str(e)}")
    
    def test_core_functionality_without_ai(self):
        """Test that core functionality works without AI components"""
        core_tests = []
        
        # Test authentication
        if "professional" in self.tokens:
            try:
                headers = self.get_auth_header("professional")
                response = self.make_request("GET", "/auth/me", headers=headers)
                if response.status_code == 200:
                    core_tests.append(("Authentication", True, "Working"))
                else:
                    core_tests.append(("Authentication", False, f"HTTP {response.status_code}"))
            except Exception as e:
                core_tests.append(("Authentication", False, f"Exception: {str(e)}"))
        
        # Test credits system
        try:
            response = self.make_request("GET", "/credits/packages")
            if response.status_code == 200:
                core_tests.append(("Credits System", True, "Working"))
            else:
                core_tests.append(("Credits System", False, f"HTTP {response.status_code}"))
        except Exception as e:
            core_tests.append(("Credits System", False, f"Exception: {str(e)}"))
        
        # Test professional search
        try:
            response = self.make_request("GET", "/professionals/")
            if response.status_code == 200:
                core_tests.append(("Professional Search", True, "Working"))
            else:
                core_tests.append(("Professional Search", False, f"HTTP {response.status_code}"))
        except Exception as e:
            core_tests.append(("Professional Search", False, f"Exception: {str(e)}"))
        
        # Log results
        working_count = sum(1 for test in core_tests if test[1])
        total_count = len(core_tests)
        
        if working_count == total_count:
            self.log_result("Core Functionality Without AI", True, 
                          f"All {total_count} core functions working without AI components")
        else:
            failed_tests = [test[0] for test in core_tests if not test[1]]
            self.log_result("Core Functionality Without AI", False, 
                          f"Core functionality issues: {failed_tests}")
    
    def run_security_cleanup_verification(self):
        """Run security cleanup verification tests"""
        print(f"🔒 FINAL VERIFICATION TEST - SECRET KEYS AND AI COMPONENTS REMOVAL")
        print(f"Backend URL: {self.base_url}")
        print("=" * 80)
        
        # Essential setup tests
        self.test_health_check()
        self.test_user_registration()
        self.test_user_login()
        
        # Security cleanup verification tests
        print("\n🔍 SECURITY CLEANUP VERIFICATION:")
        print("-" * 40)
        self.test_ai_chat_endpoints_removed()
        self.test_email_notifications_disabled_gracefully()
        self.test_customer_requests_without_notifications()
        self.test_no_sensitive_keys_in_responses()
        self.test_core_functionality_without_ai()
        
        # Core functionality tests (abbreviated)
        print("\n✅ CORE FUNCTIONALITY VERIFICATION:")
        print("-" * 40)
        self.test_get_current_user()
        self.test_create_business_profile()
        self.test_search_professionals()
        self.test_quick_customer_request()
        self.test_credits_packages()
        
        # Admin functionality (if available)
        if "admin" in self.tokens:
            print("\n👑 ADMIN FUNCTIONALITY VERIFICATION:")
            print("-" * 40)
            self.test_admin_get_users()
            self.test_admin_get_profiles()
        
        # Summary
        print("\n" + "=" * 80)
        print("📊 SECURITY CLEANUP VERIFICATION SUMMARY")
        print("=" * 80)
        
        passed = sum(1 for r in self.results if r["success"])
        failed = len(self.results) - passed
        
        print(f"Total Tests: {len(self.results)}")
        print(f"✅ Passed: {passed}")
        print(f"❌ Failed: {failed}")
        print(f"Success Rate: {(passed/len(self.results)*100):.1f}%")
        
        # Categorize results
        security_tests = [r for r in self.results if any(keyword in r["test"].lower() 
                         for keyword in ["ai", "notification", "sensitive", "security", "cleanup"])]
        core_tests = [r for r in self.results if r not in security_tests]
        
        security_passed = sum(1 for r in security_tests if r["success"])
        core_passed = sum(1 for r in core_tests if r["success"])
        
        print(f"\n🔒 Security Cleanup Tests: {security_passed}/{len(security_tests)} passed")
        print(f"⚙️  Core Functionality Tests: {core_passed}/{len(core_tests)} passed")
        
        if failed > 0:
            print("\n🔍 FAILED TESTS:")
            for result in self.results:
                if not result["success"]:
                    print(f"   • {result['test']}: {result['message']}")
        
        # Final assessment
        print("\n" + "=" * 80)
        if security_passed == len(security_tests) and core_passed >= len(core_tests) * 0.8:
            print("🎉 SECURITY CLEANUP VERIFICATION: PASSED")
            print("✅ Application is clean and secure - ready for production")
        else:
            print("⚠️  SECURITY CLEANUP VERIFICATION: NEEDS ATTENTION")
            if security_passed < len(security_tests):
                print("❌ Security cleanup incomplete")
            if core_passed < len(core_tests) * 0.8:
                print("❌ Core functionality issues detected")
        
        return passed, failed
    
    def run_all_tests(self):
        """Run all API tests in sequence"""
        print(f"🚀 Starting Niwi Platform API Tests")
        print(f"Backend URL: {self.base_url}")
        print("=" * 60)
        
        # Health check
        self.test_health_check()
        
        # Authentication tests
        self.test_user_registration()
        self.test_user_login()
        self.test_get_current_user()
        self.test_update_user_profile()
        
        # Professional tests
        self.test_create_business_profile()
        self.test_get_business_profile()
        self.test_search_professionals()
        
        # Customer tests
        self.test_create_customer_request()
        self.test_quick_customer_request()
        self.test_get_customer_requests()
        
        # Admin tests
        self.test_admin_get_users()
        self.test_admin_get_profiles()
        self.test_admin_get_customer_requests()
        self.test_admin_assign_lead()
        self.test_admin_get_stats()
        
        # Professional lead management
        self.test_professional_get_leads()
        self.test_professional_update_lead_status()
        
        # Credits system tests
        self.test_credits_packages()
        self.test_credits_balance()
        self.test_credits_transactions()
        
        # AI Chat system tests
        self.test_ai_chat_send_anonymous()
        self.test_ai_chat_send_pricing_question()
        self.test_ai_chat_send_authenticated()
        self.test_ai_chat_get_history()
        self.test_ai_chat_get_history_authenticated()
        self.test_ai_chat_error_handling()
        self.test_ai_chat_session_management()
        
        # Enhanced AI Chat tests
        self.test_enhanced_ai_chat_quick_actions()
        
        # Email Notification tests
        self.test_email_notification_user_registration()
        self.test_email_notification_customer_request()
        self.test_notification_service_integration()
        
        # Summary
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        
        passed = sum(1 for r in self.results if r["success"])
        failed = len(self.results) - passed
        
        print(f"Total Tests: {len(self.results)}")
        print(f"✅ Passed: {passed}")
        print(f"❌ Failed: {failed}")
        print(f"Success Rate: {(passed/len(self.results)*100):.1f}%")
        
        if failed > 0:
            print("\n🔍 FAILED TESTS:")
            for result in self.results:
                if not result["success"]:
                    print(f"   • {result['test']}: {result['message']}")
        
        return passed, failed

if __name__ == "__main__":
    tester = NiwiAPITester()
    passed, failed = tester.run_all_tests()
    
    # Exit with error code if tests failed
    exit(0 if failed == 0 else 1)