'use client';

import { useState } from 'react';

interface ConversationStep {
  role: 'agent' | 'user';
  message: string;
}

interface ChatbotDemoProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function ChatbotDemo({ isOpen = false, onClose }: ChatbotDemoProps) {
  const [localIsOpen, setLocalIsOpen] = useState(isOpen);
  const [step, setStep] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [conversation, setConversation] = useState<ConversationStep[]>([
    {
      role: 'agent',
      message: "Hello! I'm Natasha, NTS's AI assistant. How can I help you with your heating, cooling, or ventilation needs today?",
    },
  ]);
  const [extractedData, setExtractedData] = useState<Record<string, string>>({});

  const conversationFlow = [
    {
      agent: "Hello! I'm Natasha, NTS's AI assistant. How can I help you with your heating, cooling, or ventilation needs today?",
      userOptions: [
        { text: "I need a service", nextStep: 1 },
        { text: "What services do you offer?", nextStep: 'faq' },
      ],
    },
    {
      agent: 'What type of service do you need?',
      userOptions: [
        { text: 'Domestic Servicing', data: { serviceType: 'Domestic Servicing' }, nextStep: 2 },
        { text: 'Heating Installation', data: { serviceType: 'Heating Installation' }, nextStep: 2 },
        { text: 'Air Conditioning', data: { serviceType: 'Air Conditioning' }, nextStep: 2 },
      ],
    },
    {
      agent: 'Can you describe the issue or what you need?',
      userOptions: [
        { text: 'Boiler needs annual checkup', data: { description: 'Boiler needs annual checkup' }, nextStep: 3 },
        { text: 'AC not cooling properly', data: { description: 'AC not cooling properly' }, nextStep: 3 },
        { text: 'Just need maintenance', data: { description: 'Regular maintenance required' }, nextStep: 3 },
      ],
    },
    {
      agent: 'How urgent is this request?',
      userOptions: [
        { text: 'Routine', data: { urgency: 'Routine' }, nextStep: 4 },
        { text: 'Urgent', data: { urgency: 'Urgent' }, nextStep: 4 },
        { text: 'Emergency', data: { urgency: 'Emergency' }, nextStep: 4 },
      ],
    },
    {
      agent: "What's your name?",
      userOptions: [
        { text: 'John Smith', data: { customerName: 'John Smith' }, nextStep: 5 },
        { text: 'Sarah Johnson', data: { customerName: 'Sarah Johnson' }, nextStep: 5 },
      ],
    },
    {
      agent: "What's your email address?",
      userOptions: [
        { text: 'customer@example.com', data: { customerEmail: 'customer@example.com' }, nextStep: 6 },
      ],
    },
    {
      agent: "What's your phone number?",
      userOptions: [
        { text: '01482 838080', data: { customerPhone: '01482 838080' }, nextStep: 'end' },
      ],
    },
  ];

  const handleUserResponse = (option: any) => {
    const userMessage = option.text;
    const newConversation = [...conversation, { role: 'user' as const, message: userMessage }];

    if (option.data) {
      setExtractedData({ ...extractedData, ...option.data });
    }

    if (option.nextStep === 'faq') {
      newConversation.push({
        role: 'agent',
        message: 'We offer: Plumbing & Heating, Ventilation, Domestic & Commercial Servicing, Air Conditioning, and Commissioning. Would you like to schedule a service?',
      });
      setConversation(newConversation);
      setStep(0);
    } else if (option.nextStep === 'end') {
      newConversation.push({
        role: 'agent',
        message: '✓ Thank you! Your information has been submitted. Our team will be in touch soon to confirm your service request.',
      });
      setConversation(newConversation);
      setStep(-1);
    } else {
      const nextConversationStep = conversationFlow[option.nextStep];
      if (nextConversationStep) {
        newConversation.push({
          role: 'agent',
          message: nextConversationStep.agent,
        });
        setStep(option.nextStep);
      }
      setConversation(newConversation);
    }
    setInputValue('');
  };

  const handleTextInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      const trimmedInput = inputValue.trim();
      
      // Add user message
      const newConversation = [...conversation, { role: 'user' as const, message: trimmedInput }];
      setConversation(newConversation);

      // Try to match with existing options or create custom response
      const currentStep = conversationFlow[step];
      if (currentStep) {
        const matchedOption = currentStep.userOptions.find(opt => 
          opt.text.toLowerCase().includes(trimmedInput.toLowerCase()) ||
          trimmedInput.toLowerCase().includes(opt.text.toLowerCase())
        );

        if (matchedOption) {
          handleUserResponse(matchedOption);
        } else {
          // Store as custom data
          const customData: Record<string, string> = {};
          
          // Determine what field based on current step
          if (step === 0) customData.intent = trimmedInput;
          else if (step === 1) customData.serviceType = trimmedInput;
          else if (step === 2) customData.description = trimmedInput;
          else if (step === 3) customData.urgency = trimmedInput;
          else if (step === 4) customData.customerName = trimmedInput;
          else if (step === 5) customData.customerEmail = trimmedInput;
          else if (step === 6) customData.customerPhone = trimmedInput;

          setExtractedData({ ...extractedData, ...customData });

          // Move to next step
          if (step < conversationFlow.length - 1) {
            const nextStep = step + 1;
            const nextConversationStep = conversationFlow[nextStep];
            if (nextConversationStep) {
              newConversation.push({
                role: 'agent',
                message: nextConversationStep.agent,
              });
              setStep(nextStep);
            }
          } else if (step === conversationFlow.length - 1) {
            newConversation.push({
              role: 'agent',
              message: '✓ Thank you! Your information has been submitted. Our team will be in touch soon to confirm your service request.',
            });
            setStep(-1);
          }
          setConversation(newConversation);
        }
      }
      setInputValue('');
    }
  };

  const isOpenFinal = isOpen !== undefined ? isOpen : localIsOpen;

  if (!isOpenFinal) {
    return null;
  }

  const handleClose = () => {
    setStep(0);
    setConversation([
      {
        role: 'agent',
        message: conversationFlow[0].agent,
      },
    ]);
    setExtractedData({});
    setLocalIsOpen(false);
    setInputValue('');
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        {/* Chat Widget */}
        <div className="w-96 bg-white rounded-lg shadow-2xl flex flex-col border border-gray-200" style={{ height: '600px', maxHeight: '90vh' }}>
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 rounded-t-lg flex justify-between items-center flex-shrink-0">
            <div>
              <h3 className="font-bold text-lg">Natasha</h3>
              <p className="text-xs text-green-100">NTS Support Assistant</p>
            </div>
            <button
              onClick={handleClose}
              className="text-white hover:bg-green-700 p-2 rounded"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4 min-h-0">
            {conversation.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-green-600 text-white rounded-br-none'
                      : 'bg-gray-200 text-gray-900 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm">{msg.message}</p>
                </div>
              </div>
            ))}

            {/* Extracted Data Display - Only show at end */}
            {Object.keys(extractedData).length > 0 && step === -1 && (
              <div className="bg-blue-50 border border-blue-200 rounded p-3 mt-4">
                <p className="text-xs font-semibold text-blue-900 mb-2">📊 Extracted Data:</p>
                <div className="text-xs space-y-1">
                  {Object.entries(extractedData).map(([key, value]) => (
                    <div key={key} className="text-blue-800">
                      <strong>{key}:</strong> {value}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Options Buttons */}
          {step !== -1 && conversationFlow[step] && (
            <div className="border-t border-gray-200 p-4 space-y-2 flex-shrink-0 max-h-32 overflow-y-auto">
              {conversationFlow[step].userOptions.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleUserResponse(option)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white text-sm py-2 px-3 rounded transition"
                >
                  {option.text}
                </button>
              ))}
            </div>
          )}

          {/* Text Input */}
          {step !== -1 && (
            <div className="border-t border-gray-200 p-3 flex-shrink-0 bg-white rounded-b-lg">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleTextInput}
                placeholder="Type your response..."
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
              />
              <p className="text-xs text-gray-500 mt-1">Press Enter to send</p>
            </div>
          )}

          {/* End State */}
          {step === -1 && (
            <div className="border-t border-gray-200 p-4 text-center flex-shrink-0">
              <p className="text-sm text-gray-600 mb-3">Conversation ended</p>
              <button
                onClick={() => {
                  setStep(0);
                  setConversation([
                    {
                      role: 'agent',
                      message: conversationFlow[0].agent,
                    },
                  ]);
                  setExtractedData({});
                  setInputValue('');
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-3 rounded transition mb-2"
              >
                Start New Conversation
              </button>
              <button
                onClick={handleClose}
                className="w-full bg-gray-400 hover:bg-gray-500 text-white text-sm py-2 px-3 rounded transition"
              >
                Close Chat
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
