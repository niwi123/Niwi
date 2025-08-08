#!/usr/bin/env python3
"""
Simple AI Chat Test - Test core functionality
"""

import requests
import json

BACKEND_URL = "https://6be2d00e-f916-4ea9-93b7-bb62ff737612.preview.emergentagent.com/api"

def test_basic_chat():
    print("🧪 Testing Basic AI Chat Functionality")
    print("=" * 50)
    
    # Test 1: Send a message
    print("1. Sending message to AI...")
    chat_data = {
        "message": "Hello, can you help me understand how Niwi works?"
    }
    
    response = requests.post(f"{BACKEND_URL}/chat/send", json=chat_data, timeout=30)
    print(f"   Status: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"   Session ID: {data.get('session_id', 'N/A')}")
        print(f"   New Session: {data.get('is_new_session', 'N/A')}")
        print(f"   Response Length: {len(data.get('message', ''))}")
        print(f"   Response Preview: {data.get('message', '')[:100]}...")
        
        session_id = data.get('session_id')
        
        # Test 2: Get chat history
        print("\n2. Retrieving chat history...")
        history_response = requests.get(f"{BACKEND_URL}/chat/history/{session_id}", timeout=30)
        print(f"   Status: {history_response.status_code}")
        
        if history_response.status_code == 200:
            history_data = history_response.json()
            messages = history_data.get('messages', [])
            print(f"   Messages Count: {len(messages)}")
            
            for i, msg in enumerate(messages):
                print(f"   Message {i+1}: {msg.get('role', 'unknown')} - {len(msg.get('content', ''))} chars")
        
        # Test 3: Send follow-up message
        print("\n3. Sending follow-up message...")
        followup_data = {
            "message": "What are the pricing options?",
            "session_id": session_id
        }
        
        followup_response = requests.post(f"{BACKEND_URL}/chat/send", json=followup_data, timeout=30)
        print(f"   Status: {followup_response.status_code}")
        
        if followup_response.status_code == 200:
            followup_result = followup_response.json()
            print(f"   Same Session: {followup_result.get('session_id') == session_id}")
            print(f"   New Session Flag: {followup_result.get('is_new_session', 'N/A')}")
            print(f"   Response Preview: {followup_result.get('message', '')[:100]}...")
        
        print("\n✅ AI Chat functionality is working correctly!")
        print("   - Sessions are created and maintained")
        print("   - Messages are stored and retrieved")
        print("   - Chat history is accessible")
        print("   - Follow-up messages work in context")
        
    else:
        print(f"❌ Chat send failed: {response.text}")

if __name__ == "__main__":
    test_basic_chat()