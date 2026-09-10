import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((type, message, title) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, type, message, title }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = {
    success: (msg, title) => addToast('success', msg, title),
    error: (msg, title) => addToast('error', msg, title),
    info: (msg, title) => addToast('info', msg, title),
    warning: (msg, title) => addToast('warning', msg, title),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Toast Notification Container */}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col space-y-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        {toasts.map((t) => {
          const isSuccess = t.type === 'success';
          const isError = t.type === 'error';
          const isWarning = t.type === 'warning';

          const bgClass = isSuccess
            ? 'bg-white dark:bg-slate-900 border-emerald-500/30 text-emerald-950 dark:text-emerald-100'
            : isError
            ? 'bg-white dark:bg-slate-900 border-rose-500/30 text-rose-950 dark:text-rose-100'
            : isWarning
            ? 'bg-white dark:bg-slate-900 border-amber-500/30 text-amber-950 dark:text-amber-100'
            : 'bg-white dark:bg-slate-900 border-primary-500/30 text-slate-900 dark:text-slate-100';

          return (
            <div
              key={t.id}
              className={`pointer-events-auto flex items-start space-x-3 p-4 rounded-2xl shadow-xl border backdrop-blur-md transition-all duration-300 ${bgClass}`}
            >
              <div className="flex-shrink-0 mt-0.5">
                {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                {isError && <AlertCircle className="w-5 h-5 text-rose-500" />}
                {isWarning && <AlertTriangle className="w-5 h-5 text-amber-500" />}
                {!isSuccess && !isError && !isWarning && <Info className="w-5 h-5 text-primary-500" />}
              </div>
              <div className="flex-1 min-w-0 pr-2">
                {t.title && <h4 className="text-xs font-bold leading-tight mb-0.5">{t.title}</h4>}
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">{t.message}</p>
              </div>
              <button
                onClick={() => removeToast(t.id)}
                className="flex-shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded-lg transition-colors"
                aria-label="Close toast"
              >
                <X className="w-4 h-4" />
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
    return {
      success: console.log,
      error: console.error,
      info: console.info,
      warning: console.warn,
    };
  }
  return context;
};
