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
  const [isDevelopment, setIsDevelopment] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

  useEffect(() => {
    // Function to check if SDK is loaded
    const checkSDK = () => {
      if (typeof window !== 'undefined' && window.Retell) {
        setIsLoaded(true);
        setIsDevelopment(false);
        console.log('✅ Retell SDK loaded successfully');
        return true;
      }
      return false;
    };

    // Initial check
    if (checkSDK()) {
      return;
    }

    // Set up multiple checks for SDK loading
    const timers: NodeJS.Timeout[] = [];

    // Check every 100ms for up to 10 seconds
    for (let i = 0; i < 100; i++) {
      const timer = setTimeout(() => {
        if (checkSDK()) {
          // Clear remaining timers once SDK is found
          timers.forEach(t => clearTimeout(t));
        }
      }, (i + 1) * 100);
      timers.push(timer);
    }

    // After 3 seconds, if SDK hasn't loaded, show button anyway (fallback to demo)
    const devCheckTimer = setTimeout(() => {
      if (typeof window !== 'undefined' && !window.Retell) {
        const isLocalhost = window.location.hostname === 'localhost' ||
                           window.location.hostname === '127.0.0.1';
        setIsLoaded(true);
        if (isLocalhost) {
          setIsDevelopment(true);
          console.log('🟡 Running in development mode - Retell SDK unavailable. Click button to see ChatbotDemo.');
        } else {
          // Production: SDK not loaded, will use ChatbotDemo as fallback
          console.log('🟠 Production mode - Retell SDK not loaded, using ChatbotDemo fallback');
          setIsDevelopment(true); // Use demo fallback on production too
        }
      }
    }, 3000);

    // Also listen for a custom event if the SDK fires one
    const handleSDKLoad = () => {
      setIsLoaded(true);
      setIsDevelopment(false);
      console.log('✅ Retell SDK loaded via event listener');
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('retellLoaded', handleSDKLoad);
    }

    return () => {
      timers.forEach(t => clearTimeout(t));
      clearTimeout(devCheckTimer);
      if (typeof window !== 'undefined') {
        window.removeEventListener('retellLoaded', handleSDKLoad);
      }
    };
  }, []);

  const handleStartChat = () => {
    if (isDevelopment) {
      // In development/fallback mode, show the ChatbotDemo instead
      setShowDemo(true);
      console.log('📱 Opening ChatbotDemo (demo mode)');
      return;
    }

    if (typeof window !== 'undefined' && window.Retell) {
      console.log('🟢 Starting Retell conversation');
      window.Retell.startConversation({
        agentId: 'agent_269f6e63f78cc9bea28409ad64',
        displayOverlayMessages: true,
      });
    } else {
      console.log('⚠️ Retell SDK not available - falling back to demo');
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
            isDevelopment
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-green-600 hover:bg-green-700'
          }`}
          aria-label="Open chat with NTS support"
          title={isDevelopment ? 'Chat widget (demo mode)' : 'Chat with us'}
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
        {isDevelopment && (
          <div className="absolute bottom-20 right-0 bg-blue-50 border border-blue-200 rounded-lg p-2 text-xs text-blue-700 whitespace-nowrap">
            Demo mode
          </div>
        )}
      </div>
    </>
  );
}
