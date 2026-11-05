// ============================================================================
// MES Plastico — Button Component
// ============================================================================

import React from 'react';
import { cn } from '../../utils/helpers';

type ButtonVariant = 'primary' | 'danger' | 'warning' | 'info' | 'ghost' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  children?: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-andon-green text-white hover:bg-andon-green/90 focus-visible:ring-andon-green/50',
  danger:
    'bg-andon-red text-white hover:bg-andon-red/90 focus-visible:ring-andon-red/50',
  warning:
    'bg-andon-yellow text-surface-900 hover:bg-andon-yellow/90 focus-visible:ring-andon-yellow/50',
  info:
    'bg-andon-blue text-white hover:bg-andon-blue/90 focus-visible:ring-andon-blue/50',
  ghost:
    'bg-transparent text-slate-300 hover:bg-surface-700 hover:text-white focus-visible:ring-surface-600',
  outline:
    'bg-transparent border border-surface-600 text-slate-300 hover:bg-surface-700 hover:text-white focus-visible:ring-surface-600',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm min-h-8',
  md: 'px-4 py-2 text-sm min-h-10',
  lg: 'px-6 py-3 text-base min-h-12',
  xl: 'px-8 py-4 text-lg min-h-16 min-w-16',
};

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  iconLeft,
  iconRight,
  disabled,
  className,
  children,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium',
        'transition-all duration-200 ease-out',
        'active:scale-95',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-900',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        isDisabled && 'opacity-50 cursor-not-allowed active:scale-100',
        className
      )}
      disabled={isDisabled}
      aria-busy={loading}
      {...rest}
    >
      {loading ? <Spinner /> : iconLeft}
      {children}
      {!loading && iconRight}
    </button>
  );
}

export default Button;
