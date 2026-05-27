'use client';

type Status = 'NEW' | 'REVIEWING' | 'INTERVIEW' | 'OFFER' | 'HIRED' | 'REJECTED' | 'DRAFT' | 'PUBLISHED' | 'CLOSED';

const statusColors: Record<Status, { bg: string; text: string }> = {
  NEW: { bg: 'bg-green-100', text: 'text-green-900' },
  REVIEWING: { bg: 'bg-yellow-100', text: 'text-yellow-900' },
  INTERVIEW: { bg: 'bg-blue-100', text: 'text-blue-900' },
  OFFER: { bg: 'bg-purple-100', text: 'text-purple-900' },
  HIRED: { bg: 'bg-emerald-100', text: 'text-emerald-900' },
  REJECTED: { bg: 'bg-gray-100', text: 'text-gray-700' },
  DRAFT: { bg: 'bg-gray-100', text: 'text-gray-700' },
  PUBLISHED: { bg: 'bg-green-100', text: 'text-green-900' },
  CLOSED: { bg: 'bg-red-100', text: 'text-red-900' },
};

export function StatusPill({
  status,
  className = '',
}: {
  status: Status;
  className?: string;
}) {
  const colors = statusColors[status];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold ${colors.bg} ${colors.text} ${className}`}
    >
      {status}
    </span>
  );
}
