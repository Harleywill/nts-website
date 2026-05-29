'use client';

import { useEffect, useState } from 'react';
import ChatbotDemo from './ChatbotDemo';

declare global {
  interface Window {
    RetellWidget: any;
  }
}

export default function FloatingChatButton() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

  useEffect(() => {
    // Initialize Retell on mount
    const initializeRetell = async () => {
      try {
        // Dynamically import the Retell SDK
        const RetellSDK = await import('retell-client-js-sdk');

        console.log('✅ Retell SDK imported successfully');

        // Store the SDK on window for later use
        window.RetellWidget = RetellSDK;
        setIsLoaded(true);
      } catch (error) {
        console.error('❌ Failed to load Retell SDK:', error);
        console.log('📱 Falling back to ChatbotDemo');
        setIsLoaded(true);
      }
    };

    initializeRetell();
  }, []);

  const handleStartChat = async () => {
    try {
      // Check if Retell is available
      if (!window.RetellWidget) {
        console.log('📱 Retell not available, using ChatbotDemo');
        setShowDemo(true);
        return;
      }

      console.log('🔄 Requesting web call access token...');

      // Get access token from our backend
      const tokenResponse = await fetch('/api/retell/access-token', {
        method: 'POST',
      });

      if (!tokenResponse.ok) {
        throw new Error('Failed to get access token');
      }

      const { access_token, call_id } = await tokenResponse.json();
      console.log('✅ Access token received, starting Retell conversation');

      // Use the Retell SDK to start the web call
      const { RetellWebClient } = window.RetellWidget;
      const client = new RetellWebClient();

      // Start the call
      await client.startCall({
        accessToken: access_token,
      });

      console.log('🟢 Retell conversation started successfully');
    } catch (error) {
      console.error('Error starting Retell conversation:', error);
      console.log('📱 Falling back to ChatbotDemo');
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
