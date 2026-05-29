'use client';

import { useEffect, useState } from 'react';
import ChatbotDemo from './ChatbotDemo';

export default function FloatingChatButton() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);

  useEffect(() => {
    // SDK is available via npm import, so we're ready immediately
    console.log('✅ Retell SDK (npm) loaded - ready to use');
    setIsLoaded(true);
  }, []);

  const handleStartChat = async () => {
    if (isInitializing) return;
    setIsInitializing(true);

    try {
      // Get access token from backend
      console.log('🔄 Requesting access token from backend...');
      const tokenResponse = await fetch('/api/retell/access-token', {
        method: 'POST',
      });

      if (!tokenResponse.ok) {
        throw new Error('Failed to get access token');
      }

      const { accessToken } = await tokenResponse.json();
      console.log('✅ Access token received');

      // Dynamically import the Retell SDK
      const { RetellWebClient } = await import('retell-client-js-sdk');

      console.log('🟢 Starting Retell conversation...');

      // Create a new instance of RetellWebClient
      const client = new RetellWebClient();

      // Start the call with the access token
      await client.startCall({
        accessToken: accessToken,
      });

      console.log('✅ Retell conversation started successfully');
    } catch (error) {
      console.error('Error starting Retell conversation:', error);
      console.log('📱 Falling back to ChatbotDemo');
      setShowDemo(true);
    } finally {
      setIsInitializing(false);
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
          disabled={isInitializing}
          className="flex items-center justify-center w-14 h-14 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-110 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Open chat with NTS support"
          title={isInitializing ? 'Initializing...' : 'Chat with Natasha'}
        >
          <svg
            className={`w-6 h-6 ${isInitializing ? 'animate-spin' : ''}`}
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
