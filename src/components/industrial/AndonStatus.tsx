// ============================================================================
// MES Plastico — Andon Status Indicator Component
// ============================================================================

import React, { useState, useEffect } from 'react';
import { cn, getStatusLabel, formatElapsedTime, minutesSince } from '../../utils/helpers';
import type { MachineStatus } from '../../types';

interface AndonStatusProps {
  status: MachineStatus;
  since?: string;
  onClick?: (currentStatus: MachineStatus) => void;
  onStatusChange?: (newStatus: MachineStatus) => void;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  showElapsed?: boolean;
  className?: string;
}

const statusColors: Record<MachineStatus, string> = {
  producing: 'bg-andon-green',
  setup: 'bg-andon-yellow',
  stopped: 'bg-andon-red',
  support: 'bg-andon-blue',
  idle: 'bg-surface-600',
};

const statusRingColors: Record<MachineStatus, string> = {
  producing: 'ring-andon-green/30',
  setup: 'ring-andon-yellow/30',
  stopped: 'ring-andon-red/30',
  support: 'ring-andon-blue/30',
  idle: 'ring-surface-600/30',
};

const statusTextColors: Record<MachineStatus, string> = {
  producing: 'text-andon-green',
  setup: 'text-andon-yellow',
  stopped: 'text-andon-red',
  support: 'text-andon-blue',
  idle: 'text-slate-400',
};

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-12 w-12',
  lg: 'h-20 w-20',
};

const ringSize = {
  sm: 'ring-2',
  md: 'ring-4',
  lg: 'ring-[6px]',
};

export function AndonStatus({
  status,
  since,
  onClick,
  onStatusChange,
  size = 'md',
  showLabel = true,
  showElapsed = true,
  className,
}: AndonStatusProps) {
  const [elapsed, setElapsed] = useState('');
  const isActive = status === 'producing';
  const isClickable = Boolean(onClick || onStatusChange);

  const handleClick = () => {
    onClick?.(status);
    onStatusChange?.(status);
  };

  // Update elapsed time every minute
  useEffect(() => {
    if (!since || !showElapsed || status === 'producing') {
      setElapsed('');
      return;
    }

    const update = () => {
      setElapsed(formatElapsedTime(minutesSince(since)));
    };

    update();
    const interval = setInterval(update, 60_000);
    return () => clearInterval(interval);
  }, [since, showElapsed, status]);

  return (
    <div
      className={cn(
        'inline-flex flex-col items-center gap-2',
        isClickable && 'cursor-pointer',
        className
      )}
      onClick={isClickable ? handleClick : undefined}
      role={isClickable ? 'button' : 'status'}
      aria-label={`Status: ${getStatusLabel(status)}${elapsed ? ` há ${elapsed}` : ''}`}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={
        isClickable
          ? (e: React.KeyboardEvent) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick?.(status);
              }
            }
          : undefined
      }
    >
      {/* Status Circle */}
      <div
        className={cn(
          'rounded-full',
          sizeClasses[size],
          statusColors[status],
          ringSize[size],
          statusRingColors[status],
          isActive && 'animate-pulseGlow',
          isClickable &&
            'transition-transform duration-200 ease-out hover:scale-110 active:scale-95'
        )}
      />

      {/* Label */}
      {showLabel && (
        <span
          className={cn(
            'text-sm font-semibold',
            statusTextColors[status]
          )}
        >
          {getStatusLabel(status)}
        </span>
      )}

      {/* Elapsed Time */}
      {showElapsed && elapsed && status !== 'producing' && (
        <span className="text-xs text-slate-500">{elapsed}</span>
      )}
    </div>
  );
}

export default AndonStatus;
