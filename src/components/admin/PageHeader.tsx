'use client';

import { ExternalLink } from 'lucide-react';
import Breadcrumbs from './Breadcrumbs';

export default function PageHeader() {
  return (
    <header style={{
      flex: 'none',
      height: 64,
      background: 'rgba(255,255,255,.92)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 36px',
      position: 'sticky',
      top: 0,
      zIndex: 40,
    }}>
      <Breadcrumbs />

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontFamily: 'var(--font-body)',
            fontSize: 13,
            fontWeight: 500,
            color: 'var(--navy-700)',
            textDecoration: 'none',
            padding: '6px 12px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid #e5e7eb',
            background: '#fff',
            cursor: 'pointer',
            transition: 'all var(--dur-fast)',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'var(--navy-50)';
            (e.currentTarget as HTMLElement).style.borderColor = 'var(--navy-300)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = '#fff';
            (e.currentTarget as HTMLElement).style.borderColor = '#e5e7eb';
          }}
        >
          <ExternalLink size={14} />
          View live site
        </a>
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 7,
          fontFamily: 'var(--font-mono)',
          fontSize: '11.5px',
          letterSpacing: '.04em',
          color: 'var(--green-700)',
          background: 'var(--green-50)',
          padding: '6px 12px',
          borderRadius: 999,
        }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#68B830' }}></span>
          SAVED LOCALLY
        </span>
      </div>
    </header>
  );
}
