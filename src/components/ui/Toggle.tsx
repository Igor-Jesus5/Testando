// ============================================================================
// MES Plastico — Toggle Component
// ============================================================================

import React from 'react';
import { cn } from '../../utils/helpers';

interface ToggleProps {
  enabled?: boolean;
  checked?: boolean;
  onChange: (enabled: boolean) => void;
  labelOn?: string;
  labelOff?: string;
  labelRight?: string;
  labelLeft?: string;
  activeColor?: string;
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
}

export function Toggle({
  enabled,
  checked,
  onChange,
  labelOn,
  labelOff,
  labelRight,
  labelLeft,
  activeColor = 'bg-andon-green',
  disabled = false,
  className,
  ariaLabel,
}: ToggleProps) {
  const isChecked = Boolean(checked ?? enabled);
  const textOn = labelRight || labelOn || 'Dupla';
  const textOff = labelLeft || labelOff || 'Simples';

  const handleToggle = () => {
    if (!disabled) {
      onChange(!isChecked);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggle();
    }
  };

  return (
    <div className={cn('inline-flex items-center gap-3', className)}>
      <span
        className={cn(
          'text-sm font-medium transition-colors duration-200',
          !isChecked ? 'text-white' : 'text-slate-500'
        )}
      >
        {textOff}
      </span>

      <button
        type="button"
        role="switch"
        aria-checked={isChecked}
        aria-label={ariaLabel || `${textOff} / ${textOn}`}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className={cn(
          'relative inline-flex h-8 w-16 min-w-16 shrink-0 cursor-pointer items-center rounded-full',
          'transition-colors duration-200 ease-out',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-andon-blue focus-visible:ring-offset-2 focus-visible:ring-offset-surface-900',
          isChecked ? activeColor : 'bg-surface-600',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <span
          className={cn(
            'pointer-events-none inline-block h-6 w-6 rounded-full bg-white shadow-md',
            'transition-transform duration-200 ease-out',
            isChecked ? 'translate-x-9' : 'translate-x-1'
          )}
          aria-hidden="true"
        />
      </button>

      <span
        className={cn(
          'text-sm font-medium transition-colors duration-200',
          isChecked ? 'text-white' : 'text-slate-500'
        )}
      >
        {textOn}
      </span>
    </div>
  );
}

export default Toggle;
