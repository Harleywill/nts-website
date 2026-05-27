'use client';

import { useEffect, useState } from 'react';

export function StatusBar() {
  const [time, setTime] = useState<string>('');
  const [synced, setSynced] = useState<string>('now');

  useEffect(() => {
    // Update time every second
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      setTime(`${hours}:${minutes}:${seconds}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone.replace(/_/g, ' ');
  const version = 'v1.0.0';

  return (
    <footer className="h-7 bg-adm-rail border-t border-adm-border flex items-center px-4 text-xs font-mono text-adm-textMut gap-4">
      {/* Left: Connection status */}
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-nts-green rounded-full animate-pulse" />
        <span>CONNECTED</span>
      </div>

      {/* Separator */}
      <div className="w-px h-3 bg-adm-border" />

      {/* Admins online */}
      <span>1 ADMIN ONLINE</span>

      {/* Separator */}
      <div className="w-px h-3 bg-adm-border" />

      {/* Last sync */}
      <span>LAST SYNC {synced}</span>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right: Timezone, version, time */}
      <div className="flex items-center gap-4">
        <span>{timezone}</span>
        <span>{version}</span>
        <span>{time || '--:--:--'}</span>
      </div>
    </footer>
  );
}
