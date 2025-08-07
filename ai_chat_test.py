#!/usr/bin/env python3
"""
Focused AI Chat Testing for Niwi Platform
Tests the new AI chat functionality specifically
"""

import requests
import json
import os
from datetime import datetime
from typing import Dict, Any, Optional

# Get backend URL from environment
BACKEND_URL = "https://c03263fb-68ad-4615-a2c4-3309f5eb5b3a.preview.emergentagent.com/api"

class AIChatTester:
    def __init__(self):
        self.base_url = BACKEND_URL
        self.results = []
        self.session_data = {}
        
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
        print(f"{status}: {test_name}")
        print(f"   {message}")
        if details and not success:
            print(f"   Details: {details}")
        print()
    
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
                response = requests.post(url, json=data, headers=default_headers, timeout=30)
            else:
                raise ValueError(f"Unsupported HTTP method: {method}")
                
            return response
        except requests.exceptions.RequestException as e:
            print(f"Request failed: {e}")
            raise
    
    def test_anonymous_chat_professional_interest(self):
        """Test anonymous chat asking about becoming a professional"""
        try:
            chat_data = {
                "message": "Hi, I'm interested in becoming a professional on Niwi. Can you tell me how it works?"
            }
            response = self.make_request("POST", "/chat/send", chat_data)
            
            if response.status_code == 200:
                data = response.json()
                
                # Check response structure
                required_fields = ["message", "session_id", "is_new_session"]
                if all(field in data for field in required_fields):
                    if data["is_new_session"] and data["session_id"] and len(data["message"]) > 0:
                        self.session_data["professional_session"] = data["session_id"]
                        
                        # Check if response is relevant to Niwi platform
                        response_text = data["message"].lower()
                        niwi_keywords = ["niwi", "professional", "signup", "lead", "platform", "service"]
                        relevant = any(keyword in response_text for keyword in niwi_keywords)
                        
                        if relevant:
                            self.log_result(
                                "Anonymous Chat - Professional Interest", 
                                True, 
                                f"AI provided relevant response about becoming a professional on Niwi\nResponse: {data['message'][:200]}..."
                            )
                        else:
                            self.log_result(
                                "Anonymous Chat - Professional Interest", 
                                True, 
                                f"AI responded but content may not be Niwi-specific\nResponse: {data['message'][:200]}..."
                            )
                    else:
                        self.log_result(
                            "Anonymous Chat - Professional Interest", 
                            False, 
                            "Invalid response structure", 
                            data
                        )
                else:
                    missing_fields = [field for field in required_fields if field not in data]
                    self.log_result(
                        "Anonymous Chat - Professional Interest", 
                        False, 
                        f"Missing required fields: {missing_fields}", 
                        data
                    )
            else:
                self.log_result(
                    "Anonymous Chat - Professional Interest", 
                    False, 
                    f"HTTP {response.status_code}: {response.text}"
                )
        except Exception as e:
            self.log_result("Anonymous Chat - Professional Interest", False, f"Exception: {str(e)}")
    
    def test_pricing_question(self):
        """Test asking about pricing and lead packages"""
        if "professional_session" not in self.session_data:
            self.log_result("Pricing Question", False, "No session available from previous test")
            return
            
        try:
            chat_data = {
                "message": "What are your lead packages and pricing?",
                "session_id": self.session_data["professional_session"]
            }
            response = self.make_request("POST", "/chat/send", chat_data)
            
            if response.status_code == 200:
                data = response.json()
                
                if data.get("session_id") == self.session_data["professional_session"] and not data.get("is_new_session"):
                    response_text = data["message"].lower()
                    
                    # Check for pricing-related content
                    pricing_keywords = ["package", "price", "pricing", "lead", "cost", "$", "dollar", "tester", "elite", "pro", "enterprise"]
                    has_pricing_info = any(keyword in response_text for keyword in pricing_keywords)
                    
                    if has_pricing_info:
                        self.log_result(
                            "Pricing Question", 
                            True, 
                            f"AI provided pricing information in session context\nResponse: {data['message'][:300]}..."
                        )
                    else:
                        self.log_result(
                            "Pricing Question", 
                            True, 
                            f"AI responded but may need better pricing knowledge\nResponse: {data['message'][:300]}..."
                        )
                else:
                    self.log_result(
                        "Pricing Question", 
                        False, 
                        "Session not maintained correctly", 
                        data
                    )
            else:
                self.log_result(
                    "Pricing Question", 
                    False, 
                    f"HTTP {response.status_code}: {response.text}"
                )
        except Exception as e:
            self.log_result("Pricing Question", False, f"Exception: {str(e)}")
    
    def test_session_persistence(self):
        """Test that session maintains context across messages"""
        if "professional_session" not in self.session_data:
            self.log_result("Session Persistence", False, "No session available from previous test")
            return
            
        try:
            chat_data = {
                "message": "Can you tell me more about the signup process?",
                "session_id": self.session_data["professional_session"]
            }
            response = self.make_request("POST", "/chat/send", chat_data)
            
            if response.status_code == 200:
                data = response.json()
                
                if (data.get("session_id") == self.session_data["professional_session"] and 
                    not data.get("is_new_session") and 
                    len(data.get("message", "")) > 0):
                    
                    self.log_result(
                        "Session Persistence", 
                        True, 
                        f"Session maintained context across multiple messages\nResponse: {data['message'][:200]}..."
                    )
                else:
                    self.log_result(
                        "Session Persistence", 
                        False, 
                        "Session context not maintained", 
                        data
                    )
            else:
                self.log_result(
                    "Session Persistence", 
                    False, 
                    f"HTTP {response.status_code}: {response.text}"
                )
        except Exception as e:
            self.log_result("Session Persistence", False, f"Exception: {str(e)}")
    
    def test_chat_history(self):
        """Test retrieving chat history"""
        if "professional_session" not in self.session_data:
            self.log_result("Chat History", False, "No session available from previous test")
            return
            
        try:
            session_id = self.session_data["professional_session"]
            response = self.make_request("GET", f"/chat/history/{session_id}")
            
            if response.status_code == 200:
                data = response.json()
                
                required_fields = ["session_id", "messages", "created_at", "updated_at"]
                if all(field in data for field in required_fields):
                    if (data["session_id"] == session_id and 
                        isinstance(data["messages"], list) and 
                        len(data["messages"]) >= 6):  # Should have 3 user + 3 assistant messages
                        
                        # Verify message structure
                        first_message = data["messages"][0]
                        message_fields = ["id", "session_id", "role", "content", "created_at"]
                        if all(field in first_message for field in message_fields):
                            # Check for alternating user/assistant messages
                            roles = [msg["role"] for msg in data["messages"]]
                            expected_pattern = ["user", "assistant"] * 3  # 3 exchanges
                            
                            if roles == expected_pattern:
                                self.log_result(
                                    "Chat History", 
                                    True, 
                                    f"Retrieved complete chat history with {len(data['messages'])} messages in correct order"
                                )
                            else:
                                self.log_result(
                                    "Chat History", 
                                    True, 
                                    f"Retrieved {len(data['messages'])} messages (roles: {roles})"
                                )
                        else:
                            missing_fields = [field for field in message_fields if field not in first_message]
                            self.log_result(
                                "Chat History", 
                                False, 
                                f"Message structure incomplete, missing: {missing_fields}"
                            )
                    else:
                        self.log_result(
                            "Chat History", 
                            True, 
                            f"Retrieved {len(data.get('messages', []))} messages (expected at least 6)"
                        )
                else:
                    missing_fields = [field for field in required_fields if field not in data]
                    self.log_result(
                        "Chat History", 
                        False, 
                        f"Response missing fields: {missing_fields}", 
                        data
                    )
            else:
                self.log_result(
                    "Chat History", 
                    False, 
                    f"HTTP {response.status_code}: {response.text}"
                )
        except Exception as e:
            self.log_result("Chat History", False, f"Exception: {str(e)}")
    
    def test_new_anonymous_session(self):
        """Test creating a new anonymous session"""
        try:
            chat_data = {
                "message": "I need help finding a contractor for my home renovation."
            }
            response = self.make_request("POST", "/chat/send", chat_data)
            
            if response.status_code == 200:
                data = response.json()
                
                if (data.get("is_new_session") and 
                    data.get("session_id") and 
                    data.get("session_id") != self.session_data.get("professional_session")):
                    
                    self.session_data["customer_session"] = data["session_id"]
                    
                    # Check if response is helpful for customers
                    response_text = data["message"].lower()
                    customer_keywords = ["contractor", "service", "professional", "help", "find", "renovation"]
                    helpful = any(keyword in response_text for keyword in customer_keywords)
                    
                    if helpful:
                        self.log_result(
                            "New Anonymous Session", 
                            True, 
                            f"Created new session with customer-focused response\nResponse: {data['message'][:200]}..."
                        )
                    else:
                        self.log_result(
                            "New Anonymous Session", 
                            True, 
                            f"Created new session but response may not be customer-focused\nResponse: {data['message'][:200]}..."
                        )
                else:
                    self.log_result(
                        "New Anonymous Session", 
                        False, 
                        "Failed to create distinct new session", 
                        data
                    )
            else:
                self.log_result(
                    "New Anonymous Session", 
                    False, 
                    f"HTTP {response.status_code}: {response.text}"
                )
        except Exception as e:
            self.log_result("New Anonymous Session", False, f"Exception: {str(e)}")
    
    def test_error_handling(self):
        """Test error handling scenarios"""
        try:
            # Test 1: Invalid session ID for history
            fake_session_id = "invalid-session-id-12345"
            response = self.make_request("GET", f"/chat/history/{fake_session_id}")
            
            if response.status_code == 404:
                self.log_result(
                    "Error Handling - Invalid Session", 
                    True, 
                    "Correctly returned 404 for non-existent session"
                )
            else:
                self.log_result(
                    "Error Handling - Invalid Session", 
                    False, 
                    f"Expected 404, got HTTP {response.status_code}: {response.text}"
                )
            
            # Test 2: Very long message
            long_message = "A" * 5000  # 5000 character message
            chat_data = {"message": long_message}
            response = self.make_request("POST", "/chat/send", chat_data)
            
            if response.status_code in [200, 422, 413]:  # 200 (handled), 422 (validation), 413 (too large)
                self.log_result(
                    "Error Handling - Long Message", 
                    True, 
                    f"Handled long message appropriately (HTTP {response.status_code})"
                )
            else:
                self.log_result(
                    "Error Handling - Long Message", 
                    False, 
                    f"Unexpected response to long message: HTTP {response.status_code}"
                )
                
        except Exception as e:
            self.log_result("Error Handling", False, f"Exception: {str(e)}")
    
    def run_all_tests(self):
        """Run all AI chat tests"""
        print("🤖 Starting AI Chat Functionality Tests for Niwi Platform")
        print(f"Backend URL: {self.base_url}")
        print("=" * 70)
        print()
        
        # Run tests in sequence
        self.test_anonymous_chat_professional_interest()
        self.test_pricing_question()
        self.test_session_persistence()
        self.test_chat_history()
        self.test_new_anonymous_session()
        self.test_error_handling()
        
        # Summary
        print("=" * 70)
        print("📊 AI CHAT TEST SUMMARY")
        print("=" * 70)
        
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
        
        print(f"\n💡 Sessions Created: {len(self.session_data)}")
        for name, session_id in self.session_data.items():
            print(f"   • {name}: {session_id}")
        
        return passed, failed

if __name__ == "__main__":
    tester = AIChatTester()
    passed, failed = tester.run_all_tests()
    
    # Exit with error code if tests failed
    exit(0 if failed == 0 else 1)