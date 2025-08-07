#!/usr/bin/env python3
"""
Focused Credit System Testing for Niwi Platform
Tests credit packages, balance, and transactions endpoints
"""

import requests
import json
from datetime import datetime

# Get backend URL from environment
BACKEND_URL = "https://c03263fb-68ad-4615-a2c4-3309f5eb5b3a.preview.emergentagent.com/api"

class CreditsTester:
    def __init__(self):
        self.base_url = BACKEND_URL
        self.professional_token = None
        self.results = []
        
    def log_result(self, test_name: str, success: bool, message: str, details=None):
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
    
    def make_request(self, method: str, endpoint: str, data=None, headers=None, params=None):
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
            else:
                raise ValueError(f"Unsupported HTTP method: {method}")
                
            return response
        except requests.exceptions.RequestException as e:
            print(f"Request failed: {e}")
            raise
    
    def login_professional(self):
        """Login as professional user to get token"""
        try:
            login_data = {
                "username": "contractor@test.com",
                "password": "password"
            }
            response = self.make_request("POST", "/auth/login", login_data)
            if response.status_code == 200:
                data = response.json()
                if "access_token" in data:
                    self.professional_token = data["access_token"]
                    self.log_result("Professional Login", True, "Successfully logged in contractor@test.com")
                    return True
                else:
                    self.log_result("Professional Login", False, "Missing access_token in response", data)
            else:
                self.log_result("Professional Login", False, f"HTTP {response.status_code}", response.text)
        except Exception as e:
            self.log_result("Professional Login", False, f"Exception: {str(e)}")
        return False
    
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
                    all_packages_info = []
                    for package in packages:
                        all_packages_info.append(f"{package['name']}: {package['description']}")
                        if package["name"] in package_checks:
                            found_packages[package["name"]] = package["description"]
                    
                    print(f"   All packages found:")
                    for info in all_packages_info:
                        print(f"     • {info}")
                    
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
                        else:
                            self.log_result(f"Credits Package '{name}'", True, f"Description correctly updated")
                    
                    if all_correct:
                        self.log_result("Credits Package Updates", True, "All specified package descriptions updated correctly")
                    
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
                        self.log_result("Credits Packages Endpoint", True, f"Successfully retrieved {len(packages)} credit packages")
                else:
                    self.log_result("Credits Packages", False, "Invalid response format", data)
            else:
                self.log_result("Credits Packages", False, f"HTTP {response.status_code}", response.text)
        except Exception as e:
            self.log_result("Credits Packages", False, f"Exception: {str(e)}")
    
    def test_credits_balance(self):
        """Test GET /api/credits/balance endpoint for professional users"""
        if not self.professional_token:
            self.log_result("Credits Balance", False, "No professional token available")
            return
            
        try:
            headers = {"Authorization": f"Bearer {self.professional_token}"}
            response = self.make_request("GET", "/credits/balance", headers=headers)
            if response.status_code == 200:
                data = response.json()
                required_fields = ["balance", "total_purchased", "total_used"]
                if all(field in data for field in required_fields):
                    self.log_result("Credits Balance", True, f"Retrieved balance: {data['balance']} credits (purchased: {data['total_purchased']}, used: {data['total_used']})")
                else:
                    missing_fields = [field for field in required_fields if field not in data]
                    self.log_result("Credits Balance", False, f"Missing fields: {missing_fields}", data)
            else:
                self.log_result("Credits Balance", False, f"HTTP {response.status_code}", response.text)
        except Exception as e:
            self.log_result("Credits Balance", False, f"Exception: {str(e)}")
    
    def test_credits_transactions(self):
        """Test GET /api/credits/transactions endpoint for professional users"""
        if not self.professional_token:
            self.log_result("Credits Transactions", False, "No professional token available")
            return
            
        try:
            headers = {"Authorization": f"Bearer {self.professional_token}"}
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
    
    def run_credit_tests(self):
        """Run all credit-related tests"""
        print(f"🚀 Starting Niwi Platform Credit System Tests")
        print(f"Backend URL: {self.base_url}")
        print("=" * 60)
        
        # Login first
        if not self.login_professional():
            print("❌ Cannot proceed without professional login")
            return
        
        # Test credit packages (no auth required)
        self.test_credits_packages()
        
        # Test credit balance (requires professional auth)
        self.test_credits_balance()
        
        # Test credit transactions (requires professional auth)
        self.test_credits_transactions()
        
        # Summary
        print("\n" + "=" * 60)
        print("📊 CREDIT SYSTEM TEST SUMMARY")
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
    tester = CreditsTester()
    passed, failed = tester.run_credit_tests()
    
    # Exit with error code if tests failed
    exit(0 if failed == 0 else 1)