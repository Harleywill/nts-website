'use client';

import { IconRail } from './IconRail';
import { TopBar } from './TopBar';
import { StatusBar } from './StatusBar';
import { BlueprintBg } from '@/components/admin/ui/BlueprintBg';

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-adm-app">
      {/* Icon Rail (fixed left sidebar) */}
      <IconRail />

      {/* Main column */}
      <div className="flex-1 flex flex-col ml-16">
        {/* Top bar */}
        <TopBar />

        {/* Main content area with blueprint background */}
        <main className="flex-1 overflow-auto relative">
          <BlueprintBg />
          <div className="relative z-10 h-full">
            {children}
          </div>
        </main>

        {/* Status bar (fixed bottom) */}
        <StatusBar />
      </div>
    </div>
  );
}
