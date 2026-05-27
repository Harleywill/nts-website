'use client';

import { MdNotifications } from 'react-icons/md';
import { CommandPalette } from '@/components/admin/palette/CommandPalette';

export function TopBar() {
  return (
    <header className="h-14 bg-adm-app border-b border-adm-border flex items-center px-6 gap-4">
      {/* Command Palette Search */}
      <CommandPalette />

      {/* Spacer */}
      <div className="flex-1" />

      {/* Notifications (placeholder - no unread notifications currently) */}
      <button className="p-2 text-adm-textMut hover:text-adm-textBody hover:bg-adm-panel rounded-lg transition-colors" title="Notifications">
        <MdNotifications size={18} />
      </button>
    </header>
  );
}
