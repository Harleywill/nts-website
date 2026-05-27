'use client';

export function CornerBrackets({
  position = 'top-left',
  size = 'md'
}: {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  size?: 'sm' | 'md' | 'lg';
}) {
  const sizeMap = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  };

  const positionMap = {
    'top-left': 'top-0 left-0 border-t border-l',
    'top-right': 'top-0 right-0 border-t border-r',
    'bottom-left': 'bottom-0 left-0 border-b border-l',
    'bottom-right': 'bottom-0 right-0 border-b border-r',
  };

  return (
    <div
      className={`absolute ${sizeMap[size]} ${positionMap[position]} border-adm-borderStrong pointer-events-none`}
    />
  );
}
