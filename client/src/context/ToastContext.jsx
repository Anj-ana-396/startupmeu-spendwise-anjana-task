import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiCheckCircle,
  HiExclamationCircle,
  HiExclamationTriangle,
  HiInformationCircle,
  HiXMark,
} from 'react-icons/hi2';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback(
    ({ type = 'info', title, message, duration = 4000 }) => {
      const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const newToast = { id, type, title, message };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
      return id;
    },
    [removeToast]
  );

  const toast = {
    success: (message, title = 'Success') => addToast({ type: 'success', title, message }),
    error: (message, title = 'Error') => addToast({ type: 'error', title, message }),
    warning: (message, title = 'Warning') => addToast({ type: 'warning', title, message }),
    info: (message, title = 'Info') => addToast({ type: 'info', title, message }),
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <HiCheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />;
      case 'error':
        return <HiExclamationCircle className="w-5 h-5 text-rose-500 shrink-0" />;
      case 'warning':
        return <HiExclamationTriangle className="w-5 h-5 text-amber-500 shrink-0" />;
      case 'info':
      default:
        return <HiInformationCircle className="w-5 h-5 text-brand-500 shrink-0" />;
    }
  };

  const getBorderColor = (type) => {
    switch (type) {
      case 'success':
        return 'border-emerald-200/80 bg-white/95 shadow-emerald-500/5';
      case 'error':
        return 'border-rose-200/80 bg-white/95 shadow-rose-500/5';
      case 'warning':
        return 'border-amber-200/80 bg-white/95 shadow-amber-500/5';
      default:
        return 'border-brand-200/80 bg-white/95 shadow-brand-500/5';
    }
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Toast Render Portal */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-md ${getBorderColor(
                t.type
              )}`}
            >
              {getIcon(t.type)}
              <div className="flex-1 min-w-0">
                {t.title && (
                  <p className="text-sm font-semibold text-slate-900 tracking-tight leading-tight">
                    {t.title}
                  </p>
                )}
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed break-words">
                  {t.message}
                </p>
              </div>
              <button
                onClick={() => removeToast(t.id)}
                className="text-slate-400 hover:text-slate-600 p-0.5 rounded-lg transition-colors shrink-0"
                aria-label="Close notification"
              >
                <HiXMark className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
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

export default ToastContext;
