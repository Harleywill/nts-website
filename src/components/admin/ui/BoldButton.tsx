'use client';

import { ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

const variants = {
  primary: 'bg-nts-green text-white hover:bg-green-600 active:bg-green-700',
  secondary: 'bg-adm-panel border border-adm-border text-adm-textBody hover:bg-adm-panelAlt hover:text-adm-textPri',
  danger: 'bg-nts-danger text-white hover:bg-red-600 active:bg-red-700',
  ghost: 'text-adm-textBody hover:text-adm-textPri hover:bg-adm-panel/50',
};

const sizes = {
  sm: 'px-2 py-1 text-xs h-7',
  md: 'px-3 py-2 text-sm h-9',
  lg: 'px-4 py-2.5 text-base h-11',
};

export function BoldButton({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  ...props
}: {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  disabled?: boolean;
  [key: string]: any;
}) {
  return (
    <button
      disabled={disabled}
      className={`
        font-mono font-semibold rounded-lg transition-all
        flex items-center justify-center gap-2
        focus:outline-none focus:ring-2 focus:ring-nts-green focus:ring-offset-2 focus:ring-offset-adm-app
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}
