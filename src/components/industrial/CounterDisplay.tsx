// ============================================================================
// MES Plastico — Counter Display Component
// ============================================================================

import React, { useState, useRef, useCallback } from 'react';
import { cn, formatNumber } from '../../utils/helpers';
import type { TrackMode } from '../../types';
import { Plus, Minus } from 'lucide-react';

interface CounterDisplayProps {
  count: number;
  target: number;
  trackMode: TrackMode;
  onIncrement: () => void;
  onDecrement?: () => void;
  unit?: string;
  className?: string;
}

export function CounterDisplay({
  count,
  target,
  trackMode,
  onIncrement,
  onDecrement,
  unit = 'Pacotes',
  className,
}: CounterDisplayProps) {
  const [pulseActive, setPulseActive] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const percentage = target > 0 ? Math.min(Math.round((count / target) * 100), 100) : 0;

  const handleIncrement = useCallback(() => {
    onIncrement();
    setPulseActive(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setPulseActive(false), 300);
  }, [onIncrement]);

  return (
    <div
      className={cn(
        'rounded-xl bg-surface-800 border border-surface-700 p-6 animate-fadeIn',
        className
      )}
    >
      {/* Track Mode Indicator */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
          Contagem de Produção
        </span>
        <span
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium',
            trackMode === 'double'
              ? 'bg-andon-blue/15 text-andon-blue border border-andon-blue/30'
              : 'bg-surface-700 text-slate-400 border border-surface-600'
          )}
        >
          <span
            className={cn(
              'h-1.5 w-1.5 rounded-full',
              trackMode === 'double' ? 'bg-andon-blue' : 'bg-slate-400'
            )}
          />
          Pista {trackMode === 'double' ? 'Dupla' : 'Simples'}
        </span>
      </div>

      {/* Counter Number */}
      <div className="text-center mb-4">
        <div
          className={cn(
            'text-6xl font-bold text-white tabular-nums tracking-tight transition-transform duration-150',
            pulseActive && 'scale-105'
          )}
        >
          {formatNumber(count)}
        </div>
        <div className="text-sm text-slate-500 mt-1">
          de {formatNumber(target)} {unit}
        </div>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-slate-500">Progresso</span>
          <span
            className={cn(
              'font-semibold',
              percentage > 80
                ? 'text-andon-green'
                : percentage > 50
                  ? 'text-andon-yellow'
                  : 'text-andon-red'
            )}
          >
            {percentage}%
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-surface-700 overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-500 ease-out',
              percentage > 80
                ? 'bg-andon-green'
                : percentage > 50
                  ? 'bg-andon-yellow'
                  : 'bg-andon-red'
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        {onDecrement && (
          <button
            onClick={onDecrement}
            disabled={count <= 0}
            className={cn(
              'flex items-center justify-center rounded-xl bg-surface-700 text-slate-300',
              'min-h-16 min-w-16 p-4',
              'transition-all duration-150 ease-out active:scale-95',
              'hover:bg-surface-600',
              'disabled:opacity-30 disabled:cursor-not-allowed disabled:active:scale-100',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-andon-blue'
            )}
            aria-label="Remover 1 pacote"
          >
            <Minus className="h-6 w-6" />
          </button>
        )}

        <button
          onClick={handleIncrement}
          className={cn(
            'flex-1 flex items-center justify-center gap-3 rounded-xl',
            'bg-andon-green text-white font-bold text-lg',
            'min-h-16 p-4',
            'transition-all duration-150 ease-out active:scale-95',
            'hover:bg-andon-green/90',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-andon-green focus-visible:ring-offset-2 focus-visible:ring-offset-surface-800',
            pulseActive && 'ring-4 ring-andon-green/40'
          )}
          aria-label="Adicionar 1 pacote"
        >
          <Plus className="h-6 w-6" />
          +1 Pacote
        </button>
      </div>
    </div>
  );
}

export default CounterDisplay;
