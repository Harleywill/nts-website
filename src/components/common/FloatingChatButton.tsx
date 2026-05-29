'use client';

import { useEffect, useState } from 'react';
import { RetellWebClient } from 'retell-client-js-sdk';
import ChatbotDemo from './ChatbotDemo';

interface RegisterCallResponse {
  access_token: string;
}

export default function FloatingChatButton() {
  const [isLoaded, setIsLoaded] = useState(true);
  const [showDemo, setShowDemo] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [retellWebClient] = useState(new RetellWebClient());

  useEffect(() => {
    // Set up Retell client event listeners
    retellWebClient.on('call_started', () => {
      console.log('✅ Retell call started');
    });

    retellWebClient.on('call_ended', () => {
      console.log('✅ Retell call ended');
      setIsCalling(false);
    });

    retellWebClient.on('error', (error) => {
      console.error('❌ Retell error:', error);
      setIsCalling(false);
      setShowDemo(true);
    });

    retellWebClient.on('agent_start_talking', () => {
      console.log('Agent is talking');
    });

    retellWebClient.on('agent_stop_talking', () => {
      console.log('Agent stopped talking');
    });
  }, [retellWebClient]);

  const registerCall = async (agentId: string): Promise<RegisterCallResponse> => {
    try {
      console.log('🔄 Registering call with agent:', agentId);
      const response = await fetch('/api/retell/access-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agent_id: agentId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data: RegisterCallResponse = await response.json();
      console.log('✅ Call registered, got access token');
      return data;
    } catch (error) {
      console.error('❌ Failed to register call:', error);
      throw error;
    }
  };

  const handleStartChat = async () => {
    if (isCalling) {
      retellWebClient.stopCall();
      setIsCalling(false);
    } else {
      try {
        setIsCalling(true);
        const agentId = 'agent_269f6e63f78cc9bea28409ad64';
        const registerResponse = await registerCall(agentId);

        if (registerResponse.access_token) {
          console.log('🟢 Starting Retell conversation...');
          await retellWebClient.startCall({
            accessToken: registerResponse.access_token,
          });
        }
      } catch (error) {
        console.error('Error starting chat:', error);
        console.log('📱 Falling back to ChatbotDemo');
        setShowDemo(true);
        setIsCalling(false);
      }
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
          title={isCalling ? 'Stop chat' : 'Chat with Natasha'}
        >
          <svg
            className={`w-6 h-6 ${isCalling ? 'animate-pulse' : ''}`}
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
