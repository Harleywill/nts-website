'use client';

import { IconRail } from './IconRail';
import { BlueprintBg } from '@/components/admin/ui/BlueprintBg';

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen" style={{ background: 'var(--slate-50)' }}>
      {/* Icon Rail (fixed left sidebar) */}
      <IconRail />

      {/* Main column */}
      <div className="flex-1 flex flex-col" style={{ marginLeft: '256px' }}>
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
