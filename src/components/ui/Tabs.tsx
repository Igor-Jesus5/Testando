// ============================================================================
// MES Plastico — Tabs Component
// ============================================================================

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '../../utils/helpers';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  color?: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  fullWidth?: boolean;
  variant?: 'default' | 'sector';
  className?: string;
}

export function Tabs({
  tabs,
  activeTab,
  onChange,
  fullWidth = false,
  variant = 'default',
  className,
}: TabsProps) {
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const containerRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  const updateIndicator = useCallback(() => {
    const activeEl = tabRefs.current.get(activeTab);
    const container = containerRef.current;
    if (activeEl && container) {
      const containerRect = container.getBoundingClientRect();
      const tabRect = activeEl.getBoundingClientRect();
      setIndicator({
        left: tabRect.left - containerRect.left,
        width: tabRect.width,
      });
    }
  }, [activeTab]);

  useEffect(() => {
    updateIndicator();
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [updateIndicator]);

  const setTabRef = (id: string) => (el: HTMLButtonElement | null) => {
    if (el) {
      tabRefs.current.set(id, el);
    } else {
      tabRefs.current.delete(id);
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative flex border-b border-surface-700',
        fullWidth && 'w-full',
        className
      )}
      role="tablist"
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const activeTextColor =
          variant === 'sector' && tab.color ? tab.color : 'text-white';

        return (
          <button
            key={tab.id}
            ref={setTabRef(tab.id)}
            role="tab"
            aria-selected={isActive}
            aria-controls={`tabpanel-${tab.id}`}
            onClick={() => onChange(tab.id)}
            className={cn(
              'relative flex items-center gap-2 px-4 py-3 text-sm font-medium',
              'transition-colors duration-200 ease-out',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-andon-blue focus-visible:ring-inset',
              fullWidth && 'flex-1 justify-center',
              isActive ? activeTextColor : 'text-slate-500 hover:text-slate-300'
            )}
          >
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            {tab.label}
          </button>
        );
      })}

      {/* Animated Underline Indicator */}
      <span
        className={cn(
          'absolute bottom-0 h-0.5 transition-all duration-200 ease-out rounded-full',
          variant === 'sector' ? 'bg-current' : 'bg-andon-blue'
        )}
        style={{
          left: indicator.left,
          width: indicator.width,
        }}
        aria-hidden="true"
      />
    </div>
  );
}

interface TabPanelProps {
  id: string;
  activeTab: string;
  children: React.ReactNode;
  className?: string;
}

export function TabPanel({ id, activeTab, children, className }: TabPanelProps) {
  if (id !== activeTab) return null;

  return (
    <div
      id={`tabpanel-${id}`}
      role="tabpanel"
      aria-labelledby={id}
      className={cn('animate-fadeIn', className)}
    >
      {children}
    </div>
  );
}

export default Tabs;
