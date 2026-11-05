// ============================================================================
// MES Plastico — Input Component
// ============================================================================

import React, { forwardRef } from 'react';
import { cn } from '../../utils/helpers';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  iconPrefix?: React.ReactNode;
  iconSuffix?: React.ReactNode;
  inputSize?: 'sm' | 'md' | 'lg';
}

const inputSizeClasses = {
  sm: 'h-8 text-sm px-3',
  md: 'h-10 text-sm px-3',
  lg: 'h-12 text-base px-4',
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    error,
    iconPrefix,
    iconSuffix,
    inputSize = 'md',
    disabled,
    readOnly,
    className,
    id,
    ...rest
  },
  ref
) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-slate-300"
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {iconPrefix && (
          <span className="absolute left-3 text-slate-400 pointer-events-none" aria-hidden="true">
            {iconPrefix}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          readOnly={readOnly}
          className={cn(
            'w-full rounded-lg bg-surface-700 border border-surface-600 text-white placeholder-slate-500',
            'transition-all duration-200 ease-out',
            'focus:outline-none focus:ring-2 focus:ring-andon-blue focus:border-andon-blue',
            inputSizeClasses[inputSize],
            iconPrefix && 'pl-10',
            iconSuffix && 'pr-10',
            disabled && 'opacity-50 cursor-not-allowed',
            readOnly && 'bg-surface-800 cursor-default',
            error && 'border-andon-red focus:ring-andon-red focus:border-andon-red',
            className
          )}
          aria-invalid={error ? true : undefined}
          aria-describedby={error && inputId ? `${inputId}-error` : undefined}
          {...rest}
        />
        {iconSuffix && (
          <span className="absolute right-3 text-slate-400 pointer-events-none" aria-hidden="true">
            {iconSuffix}
          </span>
        )}
      </div>
      {error && (
        <p
          id={inputId ? `${inputId}-error` : undefined}
          className="text-xs text-andon-red"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
});

export default Input;
