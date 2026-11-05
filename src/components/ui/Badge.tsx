// ============================================================================
// MES Plastico — Badge Component
// ============================================================================

import { cn } from '../../utils/helpers';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';
type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  pulse?: boolean;
  pulsingDot?: boolean;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  success: 'bg-andon-green/15 text-andon-green border-andon-green/30',
  warning: 'bg-andon-yellow/15 text-andon-yellow border-andon-yellow/30',
  danger: 'bg-andon-red/15 text-andon-red border-andon-red/30',
  info: 'bg-andon-blue/15 text-andon-blue border-andon-blue/30',
  neutral: 'bg-surface-700/50 text-slate-400 border-surface-600',
};

const dotColors: Record<BadgeVariant, string> = {
  success: 'bg-andon-green',
  warning: 'bg-andon-yellow',
  danger: 'bg-andon-red',
  info: 'bg-andon-blue',
  neutral: 'bg-slate-400',
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
};

export function Badge({
  variant = 'neutral',
  size = 'sm',
  pulse = false,
  pulsingDot = false,
  children,
  className,
}: BadgeProps) {
  const showPulse = pulse || pulsingDot;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-medium',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {showPulse && (
        <span className="relative flex h-2 w-2" aria-hidden="true">
          <span
            className={cn(
              'absolute inline-flex h-full w-full animate-ping rounded-full opacity-75',
              dotColors[variant]
            )}
          />
          <span
            className={cn(
              'relative inline-flex h-2 w-2 rounded-full',
              dotColors[variant]
            )}
          />
        </span>
      )}
      {children}
    </span>
  );
}

export default Badge;
