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
2. Explaining lead packages and pricing (we have 6 packages from Tester Pack with 3 leads for $150 to Enterprise Deluxe with 200 leads for $13,250)  
3. General customer support questions about how the platform works
4. Payment and billing inquiries
5. Helping users navigate the platform features

Key information about Niwi:
- We connect service professionals (contractors, electricians, plumbers, real estate agents, etc.) with customers needing services
- Professionals buy lead packages to access customer contact details
- Leads are verified and exclusive (not shared with many professionals)
- We serve all of Canada
- Professional signup is free, they only pay for leads they want to pursue
- Customers can post requests for free

Be helpful, professional, and encouraging. Guide users toward signing up and using the platform effectively. If asked about specific technical issues or account problems, suggest they contact support at admin@niwi.com.

Always be concise but thorough in your responses. Focus on conversion and helping users get value from the platform.
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