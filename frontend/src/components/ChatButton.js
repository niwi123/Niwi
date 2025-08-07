import React, { useState } from 'react';
import ChatBot from './ChatBot';

const ChatButton = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  if (isChatOpen) {
    return <ChatBot onClose={() => setIsChatOpen(false)} />;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsChatOpen(true)}
        className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-2xl transition-all duration-300 transform hover:scale-110 group"
        title="Chat with Niwi Assistant"
      >
        <svg className="w-8 h-8 transition-transform group-hover:scale-110" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
        </svg>
        
        {/* Pulsing ring animation */}
        <div className="absolute inset-0 rounded-full bg-emerald-400 opacity-75 animate-ping"></div>
        <div className="absolute inset-0 rounded-full bg-emerald-400 opacity-50 animate-pulse"></div>
      </button>
      
      {/* Tooltip */}
      <div className="absolute bottom-20 right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="bg-gray-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap">
          Need help? Chat with us!
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      </div>
    </div>
  );
};

export default ChatButton;