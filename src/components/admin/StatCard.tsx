'use client';

interface StatCardProps {
  value: number;
  label: string;
  icon?: React.ReactNode;
}

export default function StatCard({ value, label, icon }: StatCardProps) {
  return (
    <div style={{
      padding: '24px',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid #e5e7eb',
      background: '#fff',
      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: '16px',
      }}>
        <div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: '28px',
            color: 'var(--navy-800)',
            margin: 0,
          }}>
            {value}
          </div>
        </div>
        {icon && (
          <div style={{
            width: 40,
            height: 40,
            borderRadius: 'var(--radius-md)',
            background: 'var(--navy-50)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--navy-700)',
            flex: 'none',
          }}>
            {icon}
          </div>
        )}
      </div>
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        letterSpacing: '.04em',
        textTransform: 'uppercase',
        color: 'var(--slate-500)',
      }}>
        {label}
      </div>
    </div>
  );
}
