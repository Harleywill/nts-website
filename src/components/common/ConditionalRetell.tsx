'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ConditionalRetell() {
  const pathname = usePathname();
  const [enabled, setEnabled] = useState(false);

  // Read the on/off state from site settings (toggled in the admin panel).
  useEffect(() => {
    let cancelled = false;
    fetch(`/api/settings?t=${Date.now()}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled || !data) return;
        const settings = data.settings ?? data;
        setEnabled(settings.chatWidgetEnabled === true);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    // Don't load the widget when disabled or on admin pages.
    if (!enabled || pathname?.startsWith('/admin')) {
      return;
    }

    // Avoid injecting twice.
    if (document.getElementById('retell-widget')) {
      return;
    }

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
  }, [enabled, pathname]);

  return null;
}
