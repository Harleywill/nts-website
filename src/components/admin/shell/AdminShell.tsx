'use client';

import { useState, useEffect } from 'react';
import { IconRail, RAIL_WIDTH, RAIL_WIDTH_COLLAPSED } from './IconRail';

const COLLAPSED_KEY = 'nts-admin-sidebar-collapsed';

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  // Remember the sidebar state per browser. Storage can throw (private mode,
  // blocked site data); the sidebar just starts expanded then.
  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem(COLLAPSED_KEY) === '1');
    } catch { /* ignore */ }
  }, []);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(COLLAPSED_KEY, next ? '1' : '0');
      } catch { /* ignore */ }
      return next;
    });
  };

  return (
    <div className="flex h-screen" style={{ background: 'var(--slate-50)' }}>
      {/* Sidebar (fixed left) */}
      <IconRail collapsed={collapsed} onToggle={toggleCollapsed} />

      {/* Main column */}
      <div
        className="flex-1 flex flex-col min-w-0"
        style={{
          marginLeft: `${collapsed ? RAIL_WIDTH_COLLAPSED : RAIL_WIDTH}px`,
          transition: 'margin-left 200ms ease',
        }}
      >
        {/* Main content area with light background */}
        <main className="flex-1 overflow-auto relative" style={{ background: 'var(--slate-50)' }}>
          <div className="relative z-10 h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
