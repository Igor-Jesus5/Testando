// ============================================================================
// MES Plastico — Skeleton Components
// ============================================================================

import { cn } from '../../utils/helpers';

interface SkeletonLineProps {
  width?: string;
  height?: string;
  className?: string;
}

export function SkeletonLine({
  width = '100%',
  height = '1rem',
  className,
}: SkeletonLineProps) {
  return (
    <div
      className={cn('skeleton-loader rounded', className)}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}

interface SkeletonCircleProps {
  size?: string;
  className?: string;
}

export function SkeletonCircle({ size = '2.5rem', className }: SkeletonCircleProps) {
  return (
    <div
      className={cn('skeleton-loader rounded-full shrink-0', className)}
      style={{ width: size, height: size }}
      aria-hidden="true"
    />
  );
}

interface SkeletonCardProps {
  lines?: number;
  showAvatar?: boolean;
  className?: string;
}

export function SkeletonCard({
  lines = 3,
  showAvatar = false,
  className,
}: SkeletonCardProps) {
  return (
    <div
      className={cn(
        'rounded-lg bg-surface-800 border border-surface-700 p-4',
        className
      )}
      role="status"
      aria-label="Carregando..."
    >
      {showAvatar && (
        <div className="flex items-center gap-3 mb-4">
          <SkeletonCircle size="2.5rem" />
          <div className="flex-1 space-y-2">
            <SkeletonLine width="60%" height="0.875rem" />
            <SkeletonLine width="40%" height="0.75rem" />
          </div>
        </div>
      )}
      <div className="space-y-2.5">
        {Array.from({ length: lines }).map((_, i) => (
          <SkeletonLine
            key={i}
            width={i === lines - 1 ? '65%' : '100%'}
            height="0.875rem"
          />
        ))}
      </div>
    </div>
  );
}

interface SkeletonTableProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export function SkeletonTable({
  rows = 5,
  columns = 4,
  className,
}: SkeletonTableProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-surface-700 overflow-hidden',
        className
      )}
      role="status"
      aria-label="Carregando tabela..."
    >
      {/* Header */}
      <div className="flex gap-4 bg-surface-800 px-4 py-3 border-b border-surface-700">
        {Array.from({ length: columns }).map((_, i) => (
          <SkeletonLine
            key={`h-${i}`}
            width={`${Math.floor(100 / columns)}%`}
            height="0.75rem"
          />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div
          key={`r-${rowIdx}`}
          className="flex gap-4 px-4 py-3 border-b border-surface-700/50"
        >
          {Array.from({ length: columns }).map((_, colIdx) => (
            <SkeletonLine
              key={`r-${rowIdx}-c-${colIdx}`}
              width={`${Math.floor(100 / columns)}%`}
              height="0.875rem"
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default SkeletonCard;
