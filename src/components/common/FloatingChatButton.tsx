'use client';

import { useEffect, useState } from 'react';
import ChatbotDemo from './ChatbotDemo';

export default function FloatingChatButton() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

  useEffect(() => {
    // Load Retell web chat widget script
    const script = document.createElement('script');
    script.src = 'https://cdn.retellai.com/v2/widget-bundle.js';
    script.async = true;
    script.onload = () => {
      console.log('✅ Retell web chat widget loaded');
      setIsLoaded(true);
    };
    script.onerror = () => {
      console.warn('⚠️ Failed to load Retell widget, using fallback');
      setIsLoaded(true); // Still set loaded to show demo
    };
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const handleStartChat = () => {
    try {
      // Check if Retell widget is available
      if (typeof window !== 'undefined' && (window as any).Retell) {
        console.log('🟢 Starting Retell web chat widget with agent');
        (window as any).Retell.openChat({
          agentId: 'agent_269f6e63f78cc9bea28409ad64',
        });
      } else {
        console.log('📱 Retell widget not available, using ChatbotDemo fallback');
        setShowDemo(true);
      }
    } catch (error) {
      console.error('Error opening Retell chat:', error);
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
          className="flex items-center justify-center w-14 h-14 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-110 bg-green-600 hover:bg-green-700"
          aria-label="Open chat with NTS support"
          title="Chat with Natasha"
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
    </>
  );
}
