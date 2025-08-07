from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List, Optional
from datetime import datetime
import os
import uuid

from models import (
    ChatSession, ChatMessage, ChatRequest, ChatResponse, ChatHistory
)
from auth import get_current_user_optional

# Import LLM integration
from emergentintegrations.llm.chat import LlmChat, UserMessage

router = APIRouter(prefix="/chat", tags=["chat"])

def get_database() -> AsyncIOMotorDatabase:
    from server import db
    return db

# AI Assistant system message for Niwi platform
NIWI_SYSTEM_MESSAGE = """You are an AI assistant for Niwi, a dual-sided marketplace connecting service professionals with customers in Canada.

Your role is to help with:
1. User signups and account creation for both professionals and customers
2. Explaining lead packages and pricing information
3. General customer support questions about how the platform works
4. Payment and billing inquiries
5. Helping users navigate the platform features

KEY INFORMATION ABOUT NIWI:
- We connect service professionals (contractors, electricians, plumbers, real estate agents, mortgage brokers, HVAC specialists, etc.) with customers needing services
- Professional signup is FREE - they only pay for leads they want to pursue
- Customers can post requests for FREE and get matched with professionals
- We serve all of Canada

LEAD PACKAGES & PRICING:
1. **Tester Pack**: 3 leads for $150 ($50 per lead) - Perfect for testing the platform
2. **777 Pack**: 25 leads for $499 ($20 per lead) - Great for small businesses  
3. **Elite Pack**: 20 Exclusive leads for $1,500 ($75 per lead) - Premium leads for growing businesses
4. **Pro Pack**: 30 Exclusive leads for $2,000 ($67 per lead) - For active professionals
5. **Premium Deluxe**: 100 Exclusive leads for $6,000 ($60 per lead) - For established businesses
6. **Enterprise Deluxe**: 200 Exclusive leads for $13,250 ($66 per lead) - For large operations

QUICK ACTION RESPONSES:
When users click on quick actions, provide these specific responses:

**PRICING**: "Here are our current lead packages:
• Tester Pack: 3 leads for $150 (perfect to try us out!)
• 777 Pack: 25 leads for $499 (great value)
• Elite Pack: 20 Exclusive leads for $1,500 (premium quality)
• Pro Pack: 30 Exclusive leads for $2,000 (most popular)
• Premium Deluxe: 100 Exclusive leads for $6,000 (for busy pros)
• Enterprise Deluxe: 200 Exclusive leads for $13,250 (maximum volume)

All leads are verified and exclusive - not shared with many professionals. You only pay for leads you want to pursue! Would you like to know more about any specific package?"

**SIGNUP**: "Signing up as a professional is completely FREE! Here's how it works:
1. Create your account (no cost)
2. Set up your business profile with services offered
3. Get verified (we review your profile)
4. Purchase leads when you're ready to grow your business

You can browse lead previews for free, and only pay when you want to contact a customer directly. Ready to create your free professional account?"

**HOW IT WORKS**: "Niwi makes it simple to grow your business:

For Professionals:
1. Sign up free and create your business profile
2. Browse available customer requests in your area
3. Purchase leads for customers you want to contact
4. Connect directly with customers using their contact info
5. Close more deals and grow your business!

For Customers:
1. Submit your service request (completely free)
2. Get matched with qualified local professionals
3. Receive quotes and compare options
4. Choose the best professional for your needs

We verify all leads and professionals for quality. Want to know more about any specific part?"

**SUPPORT**: "I'm here to help! Common support topics include:
• Account setup and verification
• Lead package questions and billing
• How to maximize your lead conversion
• Platform features and navigation
• Technical issues

You can also contact our support team directly at admin@niwi.com for account-specific issues. What specific question can I help you with?"

COMMUNICATION STYLE:
- Be friendly, professional, and helpful
- Focus on conversion - encourage signups and engagement
- Be specific about pricing and packages
- Always offer to help further or answer follow-up questions
- Keep responses conversational but informative
- If you don't know something specific, direct them to admin@niwi.com

Remember: Your goal is to help users understand Niwi's value and guide them toward becoming successful users of our platform!
"""

@router.post("/send", response_model=ChatResponse)
async def send_chat_message(
    request: ChatRequest,
    current_user: dict = Depends(get_current_user_optional)
):
    """Send a message to the AI assistant and get a response."""
    db = get_database()
    
    # Get OpenAI API key
    openai_api_key = os.environ.get('OPENAI_API_KEY')
    if not openai_api_key:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="AI service not configured"
        )
    
    # Use provided session_id or create new one
    if request.session_id:
        session_id = request.session_id
        is_new_session = False
        
        # Get existing session
        session_doc = await db.chat_sessions.find_one({"session_id": session_id})
        if not session_doc:
            # Session doesn't exist, create it
            chat_session = ChatSession(
                session_id=session_id,
                user_id=current_user.get("user_id") if current_user else None
            )
            await db.chat_sessions.insert_one(chat_session.dict())
            is_new_session = True
    else:
        # Create new session
        session_id = str(uuid.uuid4())
        is_new_session = True
        
        chat_session = ChatSession(
            session_id=session_id,
            user_id=current_user.get("user_id") if current_user else None
        )
        await db.chat_sessions.insert_one(chat_session.dict())
    
    try:
        # Store user message in database
        user_message = ChatMessage(
            session_id=session_id,
            role="user",
            content=request.message,
            metadata={"user_id": current_user.get("user_id") if current_user else None}
        )
        await db.chat_messages.insert_one(user_message.dict())
        
        # Initialize LLM chat
        chat = LlmChat(
            api_key=openai_api_key,
            session_id=session_id,
            system_message=NIWI_SYSTEM_MESSAGE
        ).with_model("openai", "gpt-4o")
        
        # Get chat history for context
        messages_cursor = db.chat_messages.find(
            {"session_id": session_id}
        ).sort("created_at", 1).limit(10)  # Last 10 messages for context
        
        chat_history = await messages_cursor.to_list(10)
        
        # Prepare message for LLM (just the current user message for now)
        llm_message = UserMessage(text=request.message)
        
        # Get response from LLM
        ai_response = await chat.send_message(llm_message)
        
        # Store AI response in database
        assistant_message = ChatMessage(
            session_id=session_id,
            role="assistant", 
            content=ai_response,
            metadata={"model": "gpt-4o", "provider": "openai"}
        )
        await db.chat_messages.insert_one(assistant_message.dict())
        
        # Update session timestamp
        await db.chat_sessions.update_one(
            {"session_id": session_id},
            {"$set": {"updated_at": datetime.utcnow()}}
        )
        
        return ChatResponse(
            message=ai_response,
            session_id=session_id,
            is_new_session=is_new_session
        )
        
    except Exception as e:
        # Store error message
        error_message = ChatMessage(
            session_id=session_id,
            role="assistant",
            content="I'm sorry, I'm experiencing some technical difficulties right now. Please try again in a moment or contact support at admin@niwi.com if the issue persists.",
            metadata={"error": str(e)}
        )
        await db.chat_messages.insert_one(error_message.dict())
        
        return ChatResponse(
            message="I'm sorry, I'm experiencing some technical difficulties right now. Please try again in a moment or contact support at admin@niwi.com if the issue persists.",
            session_id=session_id,
            is_new_session=is_new_session
        )

@router.get("/history/{session_id}", response_model=ChatHistory)
async def get_chat_history(
    session_id: str,
    current_user: dict = Depends(get_current_user_optional)
):
    """Get chat history for a session."""
    db = get_database()
    
    # Get session
    session_doc = await db.chat_sessions.find_one({"session_id": session_id})
    if not session_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chat session not found"
        )
    
    # If user is logged in, verify session ownership (optional for anonymous)
    if current_user and session_doc.get("user_id") != current_user.get("user_id"):
        # Allow if session is anonymous
        if session_doc.get("user_id") is not None:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied"
            )
    
    # Get messages
    messages_cursor = db.chat_messages.find(
        {"session_id": session_id}
    ).sort("created_at", 1)
    
    messages_docs = await messages_cursor.to_list(100)  # Last 100 messages
    messages = [ChatMessage(**msg) for msg in messages_docs]
    
    return ChatHistory(
        session_id=session_id,
        messages=messages,
        created_at=session_doc["created_at"],
        updated_at=session_doc["updated_at"]
    )

@router.delete("/session/{session_id}")
async def delete_chat_session(
    session_id: str,
    current_user: dict = Depends(get_current_user_optional)
):
    """Delete a chat session and all its messages."""
    db = get_database()
    
    # Get session
    session_doc = await db.chat_sessions.find_one({"session_id": session_id})
    if not session_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chat session not found"
        )
    
    # If user is logged in, verify session ownership
    if current_user and session_doc.get("user_id") != current_user.get("user_id"):
        # Allow if session is anonymous
        if session_doc.get("user_id") is not None:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied"
            )
    
    # Delete messages and session
    await db.chat_messages.delete_many({"session_id": session_id})
    await db.chat_sessions.delete_one({"session_id": session_id})
    
    return {"message": "Chat session deleted successfully"}

@router.get("/sessions")
async def get_user_chat_sessions(
    current_user: dict = Depends(get_current_user_optional)
):
    """Get all chat sessions for the current user."""
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required"
        )
    
    db = get_database()
    
    # Get user's sessions
    sessions_cursor = db.chat_sessions.find(
        {"user_id": current_user["user_id"]}
    ).sort("updated_at", -1)
    
    sessions_docs = await sessions_cursor.to_list(50)  # Last 50 sessions
    sessions = [ChatSession(**session) for session in sessions_docs]
    
    return {"sessions": sessions}