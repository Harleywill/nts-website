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

      {/* Notifications */}
      <button className="p-2 text-adm-textMut hover:text-adm-textBody hover:bg-adm-panel rounded-lg transition-colors relative" title="Notifications">
        <MdNotifications size={18} />
        <span className="absolute top-0 right-0 w-2 h-2 bg-nts-danger rounded-full" />
      </button>
    </header>
  );
}
