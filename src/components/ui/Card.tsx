// ============================================================================
// MES Plastico — Card Component
// ============================================================================

import React from 'react';
import { cn } from '../../utils/helpers';
import type { MachineStatus } from '../../types';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  status?: MachineStatus;
  hoverable?: boolean;
  onClick?: () => void;
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

const statusBorderColors: Record<MachineStatus, string> = {
  producing: 'border-l-andon-green',
  setup: 'border-l-andon-yellow',
  stopped: 'border-l-andon-red',
  support: 'border-l-andon-blue',
  idle: 'border-l-surface-600',
};

export function Card({ children, className, status, hoverable = false, onClick }: CardProps) {
  const isClickable = Boolean(onClick);

  return (
    <div
      className={cn(
        'rounded-lg bg-surface-800 border border-surface-700 animate-fadeIn',
        status && `border-l-4 ${statusBorderColors[status]}`,
        hoverable && 'transition-transform duration-200 ease-out hover:-translate-y-0.5',
        isClickable && 'cursor-pointer transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-surface-600',
        className
      )}
      onClick={onClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={
        isClickable
          ? (e: React.KeyboardEvent) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <div className={cn('px-4 py-3 border-b border-surface-700', className)}>
      {children}
    </div>
  );
}

export function CardBody({ children, className }: CardBodyProps) {
  return <div className={cn('px-4 py-4', className)}>{children}</div>;
}

export function CardFooter({ children, className }: CardFooterProps) {
  return (
    <div className={cn('px-4 py-3 border-t border-surface-700', className)}>
      {children}
    </div>
  );
}

export default Card;
