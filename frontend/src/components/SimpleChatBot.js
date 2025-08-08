import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || window.location.origin;

const SimpleChatBot = () => {
  const { user, getAuthHeaders } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Debug logging
  console.log('SimpleChatBot render, isOpen:', isOpen);

  const quickActions = [
    { id: 'pricing', label: 'Pricing Info', message: 'What are your lead packages and pricing?' },
    { id: 'signup', label: 'How to Sign Up', message: 'How do I sign up as a professional?' },
    { id: 'howItWorks', label: 'How It Works', message: 'How does Niwi work?' },
    { id: 'support', label: 'Support', message: 'I need help with my account' }
  ];

  const sendMessage = async (messageText) => {
    if (!messageText.trim()) return;

    const userMessage = { role: 'user', content: messageText, id: Date.now() };
    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsLoading(true);

    try {
      const headers = user ? getAuthHeaders() : {};
      const response = await axios.post(`${BACKEND_URL}/api/chat/send`, {
        message: messageText,
        user_id: user?.user_id || null
      }, { headers });

      if (response.data && response.data.message) {
        const aiMessage = { role: 'assistant', content: response.data.message, id: Date.now() + 1 };
        setMessages(prev => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = { 
        role: 'assistant', 
        content: 'Sorry, I had trouble processing that. Please try again or contact support at admin@niwi.com',
        id: Date.now() + 1 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (action) => {
    sendMessage(action.message);
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 group"
        >
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
          </svg>
          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
            !
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white p-4 rounded-t-2xl flex justify-between items-center">
        <div>
          <h3 className="font-semibold">Niwi Assistant</h3>
          <p className="text-xs opacity-90">Here to help!</p>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Quick Actions */}
      {messages.length === 0 && (
        <div className="p-4 border-b">
          <p className="text-sm text-gray-600 mb-3">Quick questions:</p>
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map(action => (
              <button
                key={action.id}
                onClick={() => handleQuickAction(action)}
                className="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-3 py-2 rounded-lg border border-emerald-200 hover:border-emerald-300 transition"
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="h-64 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 text-sm">
            👋 Hi! I'm here to help you with Niwi. Ask me about pricing, signing up, or how our platform works!
          </div>
        )}
        
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                msg.role === 'user'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 px-3 py-2 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage(currentMessage)}
            placeholder="Type your message..."
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
            disabled={isLoading}
          />
          <button
            onClick={() => sendMessage(currentMessage)}
            disabled={isLoading || !currentMessage.trim()}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg text-sm transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimpleChatBot;