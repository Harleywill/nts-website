'use client';

import { useEffect, useState } from 'react';

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
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if Retell SDK is loaded
    const checkRetellLoaded = () => {
      if (typeof window !== 'undefined' && window.Retell) {
        setIsLoaded(true);
      }
    };

    // Initial check
    checkRetellLoaded();

    // Listen for Retell load event
    if (typeof window !== 'undefined') {
      window.addEventListener('retellLoaded', checkRetellLoaded);

      // Fallback: check after a short delay
      const timer = setTimeout(checkRetellLoaded, 2000);

      return () => {
        window.removeEventListener('retellLoaded', checkRetellLoaded);
        clearTimeout(timer);
      };
    }
  }, []);

  const handleStartChat = () => {
    if (typeof window !== 'undefined' && window.Retell) {
      window.Retell.startConversation({
        agentId: 'agent_269f6e63f78cc9bea28409ad64',
        displayOverlayMessages: true,
      });
      setIsOpen(true);
    } else {
      console.error('Retell SDK not loaded');
    }
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={handleStartChat}
        className="flex items-center justify-center w-14 h-14 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-110"
        aria-label="Open chat with NTS support"
        title="Chat with us"
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
    </div>
  );
}
