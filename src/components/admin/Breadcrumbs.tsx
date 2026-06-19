'use client';

import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';

export default function Breadcrumbs() {
  const pathname = usePathname();

  const parts = pathname.split('/').filter((p) => p && p !== 'admin');
  const breadcrumbs = [{ label: 'NTS', href: '/' }];
  let path = '/admin';

  for (let i = 0; i < parts.length; i++) {
    path += '/' + parts[i];
    const label = parts[i]
      .replace(/-/g, ' ')
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    breadcrumbs.push({ label, href: path });
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      letterSpacing: '.06em',
      color: 'var(--slate-500)',
    }}>
      {breadcrumbs.map((crumb, idx) => (
        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {idx > 0 && <ChevronRight size={14} style={{ color: 'var(--slate-300)' }} />}
          <span style={{
            color: idx === 0 ? 'var(--navy-700)' : idx === breadcrumbs.length - 1 ? 'var(--slate-700)' : 'var(--slate-500)'
          }}>
            {crumb.label}
          </span>
        </div>
      ))}
    </div>
  );
}
