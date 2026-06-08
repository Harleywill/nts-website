'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CommandPalette } from '@/components/admin/palette/CommandPalette';
import { NotificationPanel } from '@/components/admin/NotificationPanel';

export function TopBar() {
  return (
    <header className="h-14 bg-adm-app border-b border-adm-border flex items-center px-6 gap-4">
      {/* Command Palette Search */}
      <CommandPalette />

      {/* Spacer */}
      <div className="flex-1" />

      {/* Notifications */}
      <NotificationPanel />
    </header>
  );
}
