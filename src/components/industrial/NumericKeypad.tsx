// ============================================================================
// MES Plastico — Numeric Keypad Component
// ============================================================================

import React, { useState, useCallback, useEffect } from 'react';
import { cn } from '../../utils/helpers';
import { Delete, X, Check } from 'lucide-react';

interface NumericKeypadProps {
  open?: boolean;
  isOpen?: boolean;
  onClose: () => void;
  onConfirm: (value: number) => void;
  title?: string;
  unit?: string;
  initialValue?: string;
  allowDecimal?: boolean;
  maxLength?: number;
}

const KEYS = [
  ['7', '8', '9'],
  ['4', '5', '6'],
  ['1', '2', '3'],
  ['.', '0', 'backspace'],
];

export function NumericKeypad({
  open,
  isOpen,
  onClose,
  onConfirm,
  title = 'Digite o valor',
  unit = '',
  initialValue = '',
  allowDecimal = true,
  maxLength = 10,
}: NumericKeypadProps) {
  const isVisible = Boolean(open ?? isOpen);
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    if (isVisible) {
      setValue(initialValue);
    }
  }, [isVisible, initialValue]);

  const handleKey = useCallback(
    (key: string) => {
      if (key === 'backspace') {
        setValue((prev) => prev.slice(0, -1));
        return;
      }

      if (key === '.' && (!allowDecimal || value.includes('.'))) {
        return;
      }

      if (value.length >= maxLength) return;

      // Prevent leading zeros (except "0.")
      if (value === '0' && key !== '.') {
        setValue(key);
        return;
      }

      setValue((prev) => prev + key);
    },
    [value, allowDecimal, maxLength]
  );

  const handleClear = () => setValue('');

  const handleConfirm = () => {
    const num = parseFloat(value);
    if (!isNaN(num) && value.length > 0) {
      onConfirm(num);
      onClose();
    }
  };

  // Handle physical keyboard input
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key === 'Enter') {
        handleConfirm();
        return;
      }
      if (e.key === 'Backspace') {
        handleKey('backspace');
        return;
      }
      if (/^[0-9.]$/.test(e.key)) {
        handleKey(e.key);
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  });

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="w-full max-w-xs mx-4 rounded-xl bg-surface-800 border border-surface-700 shadow-2xl animate-scaleIn">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-surface-700">
          <h3 className="text-sm font-medium text-slate-300">{title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-surface-700 transition-colors duration-200"
            aria-label="Fechar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Display */}
        <div className="px-4 py-4">
          <div className="flex items-baseline justify-end gap-2 rounded-lg bg-surface-900 border border-surface-700 px-4 py-3 min-h-14">
            <span className="text-3xl font-bold text-white tabular-nums tracking-tight">
              {value || '0'}
            </span>
            {unit && <span className="text-lg text-slate-400">{unit}</span>}
          </div>
        </div>

        {/* Keypad Grid */}
        <div className="px-4 pb-2">
          {KEYS.map((row, rowIdx) => (
            <div key={rowIdx} className="flex gap-2 mb-2">
              {row.map((key) => {
                if (key === '.' && !allowDecimal) {
                  return <div key={key} className="flex-1 min-h-16" />;
                }

                return (
                  <button
                    key={key}
                    onClick={() => handleKey(key)}
                    className={cn(
                      'flex-1 min-h-16 min-w-16 rounded-lg font-semibold text-xl',
                      'transition-all duration-150 ease-out active:scale-95',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-andon-blue',
                      key === 'backspace'
                        ? 'bg-surface-700 text-slate-300 hover:bg-surface-600'
                        : 'bg-surface-700 text-white hover:bg-surface-600'
                    )}
                    aria-label={key === 'backspace' ? 'Apagar' : key === '.' ? 'Ponto decimal' : key}
                  >
                    {key === 'backspace' ? (
                      <Delete className="h-6 w-6 mx-auto" />
                    ) : (
                      key
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 px-4 pb-4">
          <button
            onClick={handleClear}
            className={cn(
              'flex-1 min-h-14 rounded-lg bg-surface-700 text-slate-300 font-semibold text-base',
              'transition-all duration-150 ease-out active:scale-95',
              'hover:bg-surface-600',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-andon-blue'
            )}
            aria-label="Limpar"
          >
            Limpar
          </button>
          <button
            onClick={handleConfirm}
            disabled={value.length === 0 || value === '.'}
            className={cn(
              'flex-[2] min-h-14 rounded-lg bg-andon-green text-white font-semibold text-base',
              'transition-all duration-150 ease-out active:scale-95',
              'hover:bg-andon-green/90',
              'disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-andon-green',
              'flex items-center justify-center gap-2'
            )}
            aria-label="Confirmar"
          >
            <Check className="h-5 w-5" />
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}

export default NumericKeypad;
