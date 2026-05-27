'use client';

import { MdSearch, MdNotifications } from 'react-icons/md';

export function TopBar() {
  return (
    <header className="h-14 bg-adm-app border-b border-adm-border flex items-center px-6 gap-4">
      {/* Search trigger */}
      <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-adm-textMut bg-adm-panel border border-adm-border rounded-lg hover:text-adm-textBody transition-colors">
        <MdSearch size={16} />
        <span className="hidden sm:inline">Search...</span>
        <span className="ml-auto text-xs text-adm-textFnt">⌘K</span>
      </button>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Notifications */}
      <button className="p-2 text-adm-textMut hover:text-adm-textBody hover:bg-adm-panel rounded-lg transition-colors relative">
        <MdNotifications size={18} />
        <span className="absolute top-0 right-0 w-2 h-2 bg-nts-danger rounded-full" />
      </button>
    </header>
  );
}
