// ============================================================================
// MES Plastico — Page Container Component
// ============================================================================

import React from 'react';
import { cn } from '../../utils/helpers';
import { SkeletonCard } from '../feedback/Skeleton';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  isLoading?: boolean;
  maxWidth?: 'full' | '7xl' | '6xl';
}

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  className,
  isLoading = false,
  maxWidth = 'full',
}) => {
  const maxWidthClasses = {
    full: 'max-w-full',
    '7xl': 'max-w-7xl mx-auto',
    '6xl': 'max-w-6xl mx-auto',
  };

  if (isLoading) {
    return (
      <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-surface-900 animate-fadeIn">
        <div className={cn('space-y-4', maxWidthClasses[maxWidth])}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <SkeletonCard />
            </div>
            <div>
              <SkeletonCard />
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main
      className={cn(
        'flex-1 overflow-y-auto p-4 md:p-6 bg-surface-900 transition-all duration-200 animate-fadeIn',
        className
      )}
    >
      <div className={maxWidthClasses[maxWidth]}>
        {children}
      </div>
    </main>
  );
};

export default PageContainer;
