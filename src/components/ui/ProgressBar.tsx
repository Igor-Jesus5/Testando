// ============================================================================
// MES Plastico — ProgressBar Component
// ============================================================================

import { useEffect, useState } from 'react';
import { cn, formatNumber } from '../../utils/helpers';

interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
  showPercentage?: boolean;
  showValues?: boolean;
  unit?: string;
  className?: string;
  animated?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

function getProgressColor(percentage: number): string {
  if (percentage > 80) return 'bg-andon-green';
  if (percentage > 50) return 'bg-andon-yellow';
  return 'bg-andon-red';
}

function getProgressTextColor(percentage: number): string {
  if (percentage > 80) return 'text-andon-green';
  if (percentage > 50) return 'text-andon-yellow';
  return 'text-andon-red';
}

const sizeClasses = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
};

export function ProgressBar({
  current,
  total,
  label,
  showPercentage = true,
  showValues = true,
  unit = '',
  className,
  animated = true,
  size = 'md',
}: ProgressBarProps) {
  const [width, setWidth] = useState(0);
  const percentage = total > 0 ? Math.min(Math.round((current / total) * 100), 100) : 0;

  useEffect(() => {
    if (animated) {
      const timer = requestAnimationFrame(() => setWidth(percentage));
      return () => cancelAnimationFrame(timer);
    }
    setWidth(percentage);
  }, [percentage, animated]);

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {/* Labels row */}
      {(label || showPercentage || showValues) && (
        <div className="flex items-center justify-between text-sm">
          {label && <span className="text-slate-300 font-medium">{label}</span>}
          <div className="flex items-center gap-2 ml-auto">
            {showValues && (
              <span className="text-slate-400">
                {formatNumber(current)} / {formatNumber(total)}
                {unit && ` ${unit}`}
              </span>
            )}
            {showPercentage && (
              <span className={cn('font-semibold', getProgressTextColor(percentage))}>
                {percentage}%
              </span>
            )}
          </div>
        </div>
      )}

      {/* Bar */}
      <div
        className={cn(
          'w-full rounded-full bg-surface-700 overflow-hidden',
          sizeClasses[size]
        )}
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label || `Progresso: ${percentage}%`}
      >
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500 ease-out',
            getProgressColor(percentage)
          )}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;
