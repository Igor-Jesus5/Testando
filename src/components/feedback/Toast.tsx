// ============================================================================
// MES Plastico — Toast Notification System
// ============================================================================

import React, {
  createContext,
  useContext,
  useCallback,
  useState,
  useEffect,
  useRef,
} from 'react';
import { cn } from '../../utils/helpers';
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextValue {
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return ctx;
}

let toastCounter = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = `toast-${++toastCounter}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      {/* Toast Container */}
      <div
        className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none"
        aria-live="polite"
        aria-label="Notificações"
      >
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// ----- Toast Item -----

interface ToastItemProps {
  toast: Toast;
  onDismiss: (id: string) => void;
}

const typeConfig: Record<
  ToastType,
  { icon: React.ReactNode; borderColor: string; iconColor: string }
> = {
  success: {
    icon: <CheckCircle className="h-5 w-5" />,
    borderColor: 'border-l-andon-green',
    iconColor: 'text-andon-green',
  },
  error: {
    icon: <AlertCircle className="h-5 w-5" />,
    borderColor: 'border-l-andon-red',
    iconColor: 'text-andon-red',
  },
  warning: {
    icon: <AlertTriangle className="h-5 w-5" />,
    borderColor: 'border-l-andon-yellow',
    iconColor: 'text-andon-yellow',
  },
  info: {
    icon: <Info className="h-5 w-5" />,
    borderColor: 'border-l-andon-blue',
    iconColor: 'text-andon-blue',
  },
};

const progressColors: Record<ToastType, string> = {
  success: 'bg-andon-green',
  error: 'bg-andon-red',
  warning: 'bg-andon-yellow',
  info: 'bg-andon-blue',
};

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const duration = toast.duration ?? 4000;
  const [progress, setProgress] = useState(100);
  const startTime = useRef(Date.now());
  const animRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (duration <= 0) return;

    const animate = () => {
      const elapsed = Date.now() - startTime.current;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);
      if (remaining > 0) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        onDismiss(toast.id);
      }
    };
    animRef.current = requestAnimationFrame(animate);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [duration, toast.id, onDismiss]);

  const config = typeConfig[toast.type];

  return (
    <div
      className={cn(
        'pointer-events-auto rounded-lg bg-surface-800 border border-surface-700 border-l-4 shadow-xl',
        'animate-slideInRight',
        config.borderColor
      )}
      role="alert"
    >
      <div className="flex items-start gap-3 p-4">
        <span className={cn('shrink-0 mt-0.5', config.iconColor)}>{config.icon}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white">{toast.title}</p>
          {toast.message && (
            <p className="mt-0.5 text-xs text-slate-400">{toast.message}</p>
          )}
        </div>
        <button
          onClick={() => onDismiss(toast.id)}
          className="shrink-0 rounded p-1 text-slate-500 hover:text-white transition-colors duration-200"
          aria-label="Fechar notificação"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Progress bar */}
      {duration > 0 && (
        <div className="h-0.5 w-full bg-surface-700 rounded-b-lg overflow-hidden">
          <div
            className={cn('h-full transition-none', progressColors[toast.type])}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}

export default ToastProvider;
