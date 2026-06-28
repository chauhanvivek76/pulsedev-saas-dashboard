import { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle2, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { cn } from '../../utils/cn';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  const success = useCallback((msg, dur) => showToast(msg, 'success', dur), [showToast]);
  const error = useCallback((msg, dur) => showToast(msg, 'error', dur), [showToast]);
  const warn = useCallback((msg, dur) => showToast(msg, 'warning', dur), [showToast]);
  const info = useCallback((msg, dur) => showToast(msg, 'info', dur), [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, success, error, warn, info, toasts, removeToast }}>
      {children}
      
      {/* Toast container floating in bottom-right corner */}
      <div 
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm px-4 pointer-events-none"
        role="live"
        aria-live="assertive"
      >
        {toasts.map((toast) => {
          const icons = {
            success: <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />,
            warning: <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />,
            error: <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />,
            info: <Info className="h-5 w-5 text-blue-500 shrink-0" />
          };

          const styles = {
            success: 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-800/40 text-emerald-900 dark:text-emerald-350',
            warning: 'bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800/40 text-amber-900 dark:text-amber-350',
            error: 'bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800/40 text-red-900 dark:text-red-350',
            info: 'bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800/40 text-blue-900 dark:text-blue-350'
          };

          return (
            <div
              key={toast.id}
              className={cn(
                'pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-lg bg-white dark:bg-slate-900 animate-slide-in transition-all duration-200',
                styles[toast.type]
              )}
            >
              {icons[toast.type]}
              
              <div className="flex-1 text-sm font-medium leading-5 select-none">
                {toast.message}
              </div>
              
              <button
                onClick={() => removeToast(toast.id)}
                className="shrink-0 p-0.5 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-350 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Close notification"
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
