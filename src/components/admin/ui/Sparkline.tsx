'use client';

export function Sparkline({
  data,
  color = 'text-nts-green',
  height = 40,
  className = '',
}: {
  data: number[];
  color?: 'text-nts-green' | 'text-nts-info' | 'text-nts-warn' | 'text-nts-danger' | 'text-nts-purple';
  height?: number;
  className?: string;
}) {
  if (data.length === 0) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1 || 1)) * 100;
      const y = 100 - ((value - min) / range) * 100;
      return `${x},${y}`;
    })
    .join(' ');

  const colorMap = {
    'text-nts-green': '#4caf50',
    'text-nts-info': '#7dd3fc',
    'text-nts-warn': '#fbbf24',
    'text-nts-danger': '#f87171',
    'text-nts-purple': '#c4b5fd',
  };

  return (
    <svg
      viewBox={`0 0 100 ${height}`}
      preserveAspectRatio="none"
      className={`w-full ${className}`}
      style={{ height: `${height}px` }}
    >
      <polyline
        points={points}
        fill="none"
        stroke={colorMap[color]}
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
