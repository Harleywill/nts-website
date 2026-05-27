'use client';

import { CornerBrackets } from './CornerBrackets';

export function BoldPanel({
  title,
  children,
  className = '',
  cornerBrackets = false,
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
  cornerBrackets?: boolean;
}) {
  return (
    <div className={`relative bg-adm-panel border border-adm-border rounded-lg p-4 ${className}`}>
      {cornerBrackets && (
        <>
          <CornerBrackets position="top-left" />
          <CornerBrackets position="top-right" />
          <CornerBrackets position="bottom-left" />
          <CornerBrackets position="bottom-right" />
        </>
      )}

      {title && (
        <h3 className="font-mono text-sm font-semibold text-adm-textPri mb-4 uppercase tracking-wide">
          {title}
        </h3>
      )}

      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
