'use client';

import { useEffect, useState } from 'react';
import ChatbotDemo from './ChatbotDemo';

declare global {
  interface Window {
    Retell?: {
      startConversation: (config: {
        agentId: string;
        displayOverlayMessages?: boolean;
      }) => void;
    };
  }
}

export default function FloatingChatButton() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [useRealRetell, setUseRealRetell] = useState(false);

  useEffect(() => {
    // Check if Retell SDK is available
    const checkRetell = () => {
      if (typeof window !== 'undefined' && window.Retell) {
        console.log('✅ Retell SDK loaded - using real integration');
        setUseRealRetell(true);
        setIsLoaded(true);
        return true;
      }
      return false;
    };

    // Initial check
    if (checkRetell()) {
      return;
    }

    // Wait for SDK to load
    let attempts = 0;
    const checkInterval = setInterval(() => {
      attempts++;
      if (checkRetell()) {
        clearInterval(checkInterval);
      }
      if (attempts > 50) {
        // 5 seconds timeout - fall back to demo
        clearInterval(checkInterval);
        console.log('⚠️ Retell SDK not available - using ChatbotDemo fallback');
        setIsLoaded(true);
      }
    }, 100);

    // Listen for Retell SDK load event
    if (typeof window !== 'undefined') {
      const handleSDKLoad = () => {
        console.log('✅ Retell SDK loaded via event');
        setUseRealRetell(true);
        setIsLoaded(true);
      };
      
      window.addEventListener('retellLoaded', handleSDKLoad);
      
      return () => {
        clearInterval(checkInterval);
        window.removeEventListener('retellLoaded', handleSDKLoad);
      };
    }
  }, []);

  const handleStartChat = () => {
    if (useRealRetell && typeof window !== 'undefined' && window.Retell) {
      console.log('🟢 Starting Retell conversation with agent_269f6e63f78cc9bea28409ad64');
      window.Retell.startConversation({
        agentId: 'agent_269f6e63f78cc9bea28409ad64',
        displayOverlayMessages: true,
      });
    } else {
      console.log('📱 Using ChatbotDemo fallback');
      setShowDemo(true);
    }
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <>
      {showDemo && <ChatbotDemo isOpen={true} onClose={() => setShowDemo(false)} />}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={handleStartChat}
          className={`flex items-center justify-center w-14 h-14 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-110 ${
            useRealRetell
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
          aria-label="Open chat with NTS support"
          title={useRealRetell ? 'Chat with Natasha' : 'Chat widget (demo mode)'}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </button>
        {!useRealRetell && (
          <div className="absolute bottom-20 right-0 bg-blue-50 border border-blue-200 rounded-lg p-2 text-xs text-blue-700 whitespace-nowrap">
            Demo mode
          </div>
        )}
      </div>
    </>
  );
}
