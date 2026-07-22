'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function ConditionalRetell() {
  const pathname = usePathname();
  
  useEffect(() => {
    // Chat widget is hidden unless explicitly enabled. To bring it back,
    // set NEXT_PUBLIC_ENABLE_CHAT_WIDGET=true in the environment and rebuild.
    if (process.env.NEXT_PUBLIC_ENABLE_CHAT_WIDGET !== 'true') {
      return;
    }

    // Don't load Retell on admin pages
    if (pathname?.startsWith('/admin')) {
      return;
    }

    // Load Retell script
    const script = document.createElement('script');
    script.id = 'retell-widget';
    script.src = 'https://dashboard.retellai.com/retell-widget-v2.js';
    script.type = 'module';
    script.async = true;
    script.setAttribute('data-public-key', 'public_key_e4108cc94298bc2363fed');
    script.setAttribute('data-agent-id', 'agent_269f6e63f78cc9bea28409ad64');
    script.setAttribute('data-title', 'Chat with Natasha');
    script.setAttribute('data-color', '#4caf50');
    script.setAttribute('data-fab-text', 'Need help?');
    script.setAttribute('data-bot-name', 'Natasha');
    
    document.head.appendChild(script);

    return () => {
      const existingScript = document.getElementById('retell-widget');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [pathname]);

  return null;
}
