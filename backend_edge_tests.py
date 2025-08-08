#!/usr/bin/env python3
"""
Edge Case Testing for Niwi Platform Backend APIs
Tests error handling, validation, and security
"""

import requests
import json
from datetime import datetime

BACKEND_URL = "https://6be2d00e-f916-4ea9-93b7-bb62ff737612.preview.emergentagent.com/api"

class NiwiEdgeCaseTester:
    def __init__(self):
        self.base_url = BACKEND_URL
        self.results = []
        # Get a valid token for authenticated tests
        self.admin_token = None
        self.setup_auth()
        
    def setup_auth(self):
        """Get admin token for authenticated tests"""
        try:
            login_data = {"username": "admin@niwi.ca", "password": "admin123"}
            response = requests.post(f"{self.base_url}/auth/login", data=login_data, 
                                   headers={"Content-Type": "application/x-www-form-urlencoded"})
            if response.status_code == 200:
                self.admin_token = response.json()["access_token"]
        except:
            pass
    
    def log_result(self, test_name: str, success: bool, message: str):
        """Log test result"""
        self.results.append({"test": test_name, "success": success, "message": message})
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: {test_name} - {message}")
    
    def test_invalid_endpoints(self):
        """Test invalid endpoints return 404"""
        invalid_endpoints = ["/invalid", "/api/invalid", "/auth/invalid"]
        for endpoint in invalid_endpoints:
            try:
                response = requests.get(f"{self.base_url}{endpoint}")
                if response.status_code == 404:
                    self.log_result(f"Invalid Endpoint {endpoint}", True, "Correctly returned 404")
                else:
                    self.log_result(f"Invalid Endpoint {endpoint}", False, f"Expected 404, got {response.status_code}")
            except Exception as e:
                self.log_result(f"Invalid Endpoint {endpoint}", False, f"Exception: {str(e)}")
    
    def test_unauthorized_access(self):
        """Test unauthorized access to protected endpoints"""
        protected_endpoints = [
            "/auth/me",
            "/professionals/profile", 
            "/customers/requests",
            "/admin/users"
        ]
        
        for endpoint in protected_endpoints:
            try:
                response = requests.get(f"{self.base_url}{endpoint}")
                if response.status_code == 401:
                    self.log_result(f"Unauthorized Access {endpoint}", True, "Correctly returned 401")
                else:
                    self.log_result(f"Unauthorized Access {endpoint}", False, f"Expected 401, got {response.status_code}")
            except Exception as e:
                self.log_result(f"Unauthorized Access {endpoint}", False, f"Exception: {str(e)}")
    
    def test_invalid_token(self):
        """Test invalid token handling"""
        try:
            headers = {"Authorization": "Bearer invalid_token_here"}
            response = requests.get(f"{self.base_url}/auth/me", headers=headers)
            if response.status_code == 401:
                self.log_result("Invalid Token", True, "Correctly rejected invalid token")
            else:
                self.log_result("Invalid Token", False, f"Expected 401, got {response.status_code}")
        except Exception as e:
            self.log_result("Invalid Token", False, f"Exception: {str(e)}")
    
    def test_malformed_json(self):
        """Test malformed JSON handling"""
        try:
            headers = {"Content-Type": "application/json"}
            response = requests.post(f"{self.base_url}/auth/register", 
                                   data="invalid json", headers=headers)
            if response.status_code in [400, 422]:
                self.log_result("Malformed JSON", True, f"Correctly handled malformed JSON with {response.status_code}")
            else:
                self.log_result("Malformed JSON", False, f"Expected 400/422, got {response.status_code}")
        except Exception as e:
            self.log_result("Malformed JSON", False, f"Exception: {str(e)}")
    
    def test_missing_required_fields(self):
        """Test missing required fields in registration"""
        try:
            incomplete_data = {
                "email": "incomplete@test.com",
                # Missing password, user_type, first_name, last_name
            }
            response = requests.post(f"{self.base_url}/auth/register", 
                                   json=incomplete_data, 
                                   headers={"Content-Type": "application/json"})
            if response.status_code in [400, 422]:
                self.log_result("Missing Required Fields", True, f"Correctly validated required fields with {response.status_code}")
            else:
                self.log_result("Missing Required Fields", False, f"Expected 400/422, got {response.status_code}")
        except Exception as e:
            self.log_result("Missing Required Fields", False, f"Exception: {str(e)}")
    
    def test_invalid_email_format(self):
        """Test invalid email format validation"""
        try:
            invalid_data = {
                "email": "not-an-email",
                "password": "password123",
                "user_type": "customer",
                "first_name": "Test",
                "last_name": "User"
            }
            response = requests.post(f"{self.base_url}/auth/register", 
                                   json=invalid_data, 
                                   headers={"Content-Type": "application/json"})
            if response.status_code in [400, 422]:
                self.log_result("Invalid Email Format", True, f"Correctly validated email format with {response.status_code}")
            else:
                self.log_result("Invalid Email Format", False, f"Expected 400/422, got {response.status_code}")
        except Exception as e:
            self.log_result("Invalid Email Format", False, f"Exception: {str(e)}")
    
    def test_duplicate_email_registration(self):
        """Test duplicate email registration prevention"""
        try:
            duplicate_data = {
                "email": "admin@niwi.ca",  # Already exists
                "password": "password123",
                "user_type": "customer",
                "first_name": "Duplicate",
                "last_name": "User"
            }
            response = requests.post(f"{self.base_url}/auth/register", 
                                   json=duplicate_data, 
                                   headers={"Content-Type": "application/json"})
            if response.status_code == 400 and "already registered" in response.text:
                self.log_result("Duplicate Email Registration", True, "Correctly prevented duplicate registration")
            else:
                self.log_result("Duplicate Email Registration", False, f"Expected 400 with 'already registered', got {response.status_code}")
        except Exception as e:
            self.log_result("Duplicate Email Registration", False, f"Exception: {str(e)}")
    
    def test_wrong_credentials_login(self):
        """Test wrong credentials handling"""
        try:
            wrong_data = {"username": "admin@niwi.ca", "password": "wrongpassword"}
            response = requests.post(f"{self.base_url}/auth/login", data=wrong_data,
                                   headers={"Content-Type": "application/x-www-form-urlencoded"})
            if response.status_code == 401:
                self.log_result("Wrong Credentials Login", True, "Correctly rejected wrong credentials")
            else:
                self.log_result("Wrong Credentials Login", False, f"Expected 401, got {response.status_code}")
        except Exception as e:
            self.log_result("Wrong Credentials Login", False, f"Exception: {str(e)}")
    
    def test_nonexistent_user_login(self):
        """Test login with nonexistent user"""
        try:
            nonexistent_data = {"username": "nonexistent@test.com", "password": "password123"}
            response = requests.post(f"{self.base_url}/auth/login", data=nonexistent_data,
                                   headers={"Content-Type": "application/x-www-form-urlencoded"})
            if response.status_code == 401:
                self.log_result("Nonexistent User Login", True, "Correctly rejected nonexistent user")
            else:
                self.log_result("Nonexistent User Login", False, f"Expected 401, got {response.status_code}")
        except Exception as e:
            self.log_result("Nonexistent User Login", False, f"Exception: {str(e)}")
    
    def test_role_based_access_control(self):
        """Test role-based access control"""
        if not self.admin_token:
            return
            
        # Try to access admin endpoint with professional token
        try:
            # First get professional token
            login_data = {"username": "mike@contractor.ca", "password": "password123"}
            response = requests.post(f"{self.base_url}/auth/login", data=login_data,
                                   headers={"Content-Type": "application/x-www-form-urlencoded"})
            if response.status_code == 200:
                prof_token = response.json()["access_token"]
                
                # Try to access admin endpoint
                headers = {"Authorization": f"Bearer {prof_token}"}
                response = requests.get(f"{self.base_url}/admin/users", headers=headers)
                if response.status_code == 403:
                    self.log_result("Role-Based Access Control", True, "Correctly enforced role restrictions")
                else:
                    self.log_result("Role-Based Access Control", False, f"Expected 403, got {response.status_code}")
            else:
                self.log_result("Role-Based Access Control", False, "Could not get professional token")
        except Exception as e:
            self.log_result("Role-Based Access Control", False, f"Exception: {str(e)}")
    
    def test_invalid_service_category(self):
        """Test invalid service category handling"""
        try:
            invalid_request = {
                "email": "test@example.com",
                "phone": "+1-416-555-0000",
                "service_category": "invalid_category",
                "title": "Test Request",
                "description": "Test description",
                "city": "Toronto",
                "province": "Ontario"
            }
            response = requests.post(f"{self.base_url}/customers/requests/quick", 
                                   json=invalid_request,
                                   headers={"Content-Type": "application/json"})
            if response.status_code in [400, 422]:
                self.log_result("Invalid Service Category", True, f"Correctly validated service category with {response.status_code}")
            else:
                self.log_result("Invalid Service Category", False, f"Expected 400/422, got {response.status_code}")
        except Exception as e:
            self.log_result("Invalid Service Category", False, f"Exception: {str(e)}")
    
    def run_all_tests(self):
        """Run all edge case tests"""
        print(f"🔍 Starting Niwi Platform Edge Case Tests")
        print(f"Backend URL: {self.base_url}")
        print("=" * 60)
        
        self.test_invalid_endpoints()
        self.test_unauthorized_access()
        self.test_invalid_token()
        self.test_malformed_json()
        self.test_missing_required_fields()
        self.test_invalid_email_format()
        self.test_duplicate_email_registration()
        self.test_wrong_credentials_login()
        self.test_nonexistent_user_login()
        self.test_role_based_access_control()
        self.test_invalid_service_category()
        
        # Summary
        print("\n" + "=" * 60)
        print("📊 EDGE CASE TEST SUMMARY")
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
    tester = NiwiEdgeCaseTester()
    passed, failed = tester.run_all_tests()
    exit(0 if failed == 0 else 1)