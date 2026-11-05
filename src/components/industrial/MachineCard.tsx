// ============================================================================
// MES Plastico — Machine Card Component
// ============================================================================

import React from 'react';
import { cn, getStatusLabel, formatNumber } from '../../utils/helpers';
import type { Machine, MachineStatus } from '../../types';
import { AndonStatus } from './AndonStatus';
import { Badge } from '../ui/Badge';
import { Activity, User, Package } from 'lucide-react';

interface MachineCardProps {
  machine: Machine;
  compact?: boolean;
  onClick?: (machine: Machine) => void;
  onSelect?: (machine: Machine) => void;
  className?: string;
}

const topBorderColors: Record<MachineStatus, string> = {
  producing: 'border-t-andon-green',
  setup: 'border-t-andon-yellow',
  stopped: 'border-t-andon-red',
  support: 'border-t-andon-blue',
  idle: 'border-t-surface-600',
};

const badgeVariant: Record<MachineStatus, 'success' | 'warning' | 'danger' | 'info' | 'neutral'> = {
  producing: 'success',
  setup: 'warning',
  stopped: 'danger',
  support: 'info',
  idle: 'neutral',
};

export function MachineCard({
  machine,
  compact = false,
  onClick,
  onSelect,
  className,
}: MachineCardProps) {
  const isClickable = Boolean(onClick || onSelect);

  const handleClick = () => {
    onClick?.(machine);
    onSelect?.(machine);
  };

  if (compact) {
    return (
      <div
        className={cn(
          'rounded-lg bg-surface-800 border border-surface-700 border-t-2 p-3',
          'animate-fadeIn',
          topBorderColors[machine.status],
          isClickable &&
            'cursor-pointer transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-surface-600',
          className
        )}
        onClick={isClickable ? handleClick : undefined}
        role={isClickable ? 'button' : undefined}
        tabIndex={isClickable ? 0 : undefined}
        onKeyDown={
          isClickable
            ? (e: React.KeyboardEvent) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onClick?.(machine);
                }
              }
            : undefined
        }
        aria-label={`Máquina ${machine.code} - ${getStatusLabel(machine.status)}`}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <AndonStatus status={machine.status} size="sm" showLabel={false} showElapsed={false} />
            <div className="min-w-0">
              <p className="text-sm font-bold text-white truncate">{machine.code}</p>
              <p className="text-xs text-slate-500 truncate">{machine.name}</p>
            </div>
          </div>
          <Badge variant={badgeVariant[machine.status]} pulse={machine.status === 'producing'}>
            {getStatusLabel(machine.status)}
          </Badge>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'rounded-lg bg-surface-800 border border-surface-700 border-t-2 overflow-hidden',
        'animate-fadeIn',
        topBorderColors[machine.status],
        isClickable &&
          'cursor-pointer transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-surface-600',
        className
      )}
      onClick={isClickable ? handleClick : undefined}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={
        isClickable
          ? (e: React.KeyboardEvent) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick?.(machine);
              }
            }
          : undefined
      }
      aria-label={`Máquina ${machine.code} - ${getStatusLabel(machine.status)}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-surface-700">
        <div className="flex items-center gap-3">
          <AndonStatus status={machine.status} size="sm" showLabel={false} showElapsed={false} />
          <div>
            <h3 className="text-base font-bold text-white">{machine.code}</h3>
            <p className="text-xs text-slate-500">{machine.name}</p>
          </div>
        </div>
        <Badge variant={badgeVariant[machine.status]} pulse={machine.status === 'producing'}>
          {getStatusLabel(machine.status)}
        </Badge>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        {/* Current OP */}
        {machine.currentOP && (
          <div className="flex items-center gap-2 text-sm">
            <Package className="h-4 w-4 text-slate-500 shrink-0" />
            <span className="text-slate-400">OP:</span>
            <span className="text-white font-medium truncate">{machine.currentOP.number}</span>
          </div>
        )}

        {/* Operator */}
        {machine.currentOperator && (
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-slate-500 shrink-0" />
            <span className="text-slate-400">Operador:</span>
            <span className="text-white truncate">{machine.currentOperator.name}</span>
          </div>
        )}

        {/* Metrics */}
        {machine.metrics && (
          <div className="flex items-center gap-2 text-sm">
            <Activity className="h-4 w-4 text-slate-500 shrink-0" />
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              {machine.metrics.kgPerHour != null && (
                <span className="text-slate-300">
                  <span className="text-white font-semibold">
                    {formatNumber(machine.metrics.kgPerHour, 1)}
                  </span>{' '}
                  Kg/h
                </span>
              )}
              {machine.metrics.metersPerMinute != null && (
                <span className="text-slate-300">
                  <span className="text-white font-semibold">
                    {formatNumber(machine.metrics.metersPerMinute, 0)}
                  </span>{' '}
                  m/min
                </span>
              )}
              {machine.metrics.bagsPerMinute != null && (
                <span className="text-slate-300">
                  <span className="text-white font-semibold">
                    {formatNumber(machine.metrics.bagsPerMinute, 0)}
                  </span>{' '}
                  sacos/min
                </span>
              )}
              {machine.metrics.scrapPercent != null && (
                <span className="text-slate-300">
                  Refugo{' '}
                  <span className={cn(
                    'font-semibold',
                    machine.metrics.scrapPercent > 5 ? 'text-andon-red' : 'text-andon-green'
                  )}>
                    {formatNumber(machine.metrics.scrapPercent, 1)}%
                  </span>
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MachineCard;
