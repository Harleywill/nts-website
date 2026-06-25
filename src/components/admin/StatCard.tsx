'use client';

interface StatCardProps {
  value: number;
  label: string;
  icon?: React.ReactNode;
  tone?: 'navy' | 'amber' | 'green' | 'slate';
  hover?: boolean;
}

export default function StatCard({ value, label, icon, tone = 'navy', hover = true }: StatCardProps) {
  const toneColors = {
    navy: 'var(--navy-700)',
    amber: 'var(--warning)',
    green: 'var(--green-600)',
    slate: 'var(--slate-500)',
  };

  const color = toneColors[tone];

  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '22px',
        boxShadow: 'var(--shadow-xs)',
        cursor: hover ? 'pointer' : 'default',
        transition: 'box-shadow var(--dur-med), transform var(--dur-med)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
      onMouseEnter={(e) => {
        if (hover) {
          (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-lg)';
          (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
        }
      }}
      onMouseLeave={(e) => {
        if (hover) {
          (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-xs)';
          (e.currentTarget as HTMLElement).style.transform = 'none';
        }
      }}
    >
      {/* Icon and Arrow Row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: '16px',
        }}
      >
        {icon && (
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: 'var(--radius-md)',
              background: color + '14',
              color: color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </div>
        )}
        <svg
          width="17"
          height="17"
          viewBox="0 0 17 17"
          fill="none"
          style={{ color: 'var(--slate-300)' }}
        >
          <path
            d="M3 14L14 3M14 3H6M14 3V11"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Value */}
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          fontSize: '40px',
          letterSpacing: '-.02em',
          color: 'var(--navy-800)',
          marginTop: '0px',
          lineHeight: 1,
          marginBottom: '8px',
        }}
      >
        {value}
      </div>

      {/* Label */}
      <div
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '13.5px',
          color: 'var(--slate-600)',
        }}
      >
        {label}
      </div>
    </div>
  );
}
