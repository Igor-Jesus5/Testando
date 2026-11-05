// ============================================================================
// MES Plastico — Modal Component
// ============================================================================

import React, { useEffect, useCallback, useRef } from 'react';
import { cn } from '../../utils/helpers';
import { X } from 'lucide-react';

type ModalSize = 'sm' | 'md' | 'lg' | 'fullscreen';

interface ModalProps {
  open?: boolean;
  isOpen?: boolean;
  onClose: () => void;
  title?: string;
  size?: ModalSize;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  children: React.ReactNode;
  className?: string;
}

const sizeClasses: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-3xl',
  fullscreen: 'max-w-none m-0 w-screen h-screen rounded-none',
};

export function Modal({
  open,
  isOpen,
  onClose,
  title,
  size = 'md',
  closeOnBackdrop = true,
  closeOnEscape = true,
  children,
  className,
}: ModalProps) {
  const isVisible = Boolean(open ?? isOpen);
  const overlayRef = useRef<HTMLDivElement>(null);

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (closeOnEscape && e.key === 'Escape') {
        onClose();
      }
    },
    [closeOnEscape, onClose]
  );

  useEffect(() => {
    if (isVisible) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isVisible, handleEscape]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (closeOnBackdrop && e.target === overlayRef.current) {
      onClose();
    }
  };

  if (!isVisible) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label={title || 'Modal'}
    >
      <div
        className={cn(
          'w-full mx-4 rounded-lg bg-surface-800 border border-surface-700 shadow-2xl',
          'animate-slideUp',
          sizeClasses[size],
          size === 'fullscreen' && 'mx-0 flex flex-col',
          className
        )}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-5 py-4 border-b border-surface-700">
            <h2 className="text-lg font-semibold text-white">{title}</h2>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-slate-400 hover:text-white hover:bg-surface-700 transition-colors duration-200"
              aria-label="Fechar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Body */}
        <div className={cn('p-5', size === 'fullscreen' && 'flex-1 overflow-auto')}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;
