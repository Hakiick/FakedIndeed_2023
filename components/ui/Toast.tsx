'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaExclamationTriangle, FaInfoCircle, FaTimes } from 'react-icons/fa';

interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

interface ToastContextValue {
  addToast: (message: string, type: ToastItem['type']) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const toastStyles: Record<ToastItem['type'], string> = {
  success: 'bg-green-50 border-green-400 text-green-800',
  error: 'bg-red-50 border-red-400 text-red-800',
  warning: 'bg-amber-50 border-amber-400 text-amber-800',
  info: 'bg-blue-50 border-blue-400 text-blue-800',
};

const toastIcons: Record<ToastItem['type'], React.ReactNode> = {
  success: <FaCheckCircle className="text-green-500" aria-hidden="true" />,
  error: <FaExclamationCircle className="text-red-500" aria-hidden="true" />,
  warning: <FaExclamationTriangle className="text-amber-500" aria-hidden="true" />,
  info: <FaInfoCircle className="text-blue-500" aria-hidden="true" />,
};

interface SingleToastProps {
  toast: ToastItem;
  onRemove: (id: string) => void;
}

function SingleToast({ toast, onRemove }: SingleToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id);
    }, 3000);

    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={[
        'flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg',
        'animate-[toastSlideUp_0.25s_ease-out]',
        toastStyles[toast.type],
      ].join(' ')}
    >
      <span className="flex-shrink-0 text-lg">{toastIcons[toast.type]}</span>
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      <button
        onClick={() => onRemove(toast.id)}
        aria-label="Dismiss notification"
        className="flex-shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-md hover:bg-black/10 transition-colors"
      >
        <FaTimes size={14} aria-hidden="true" />
      </button>
    </div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((message: string, type: ToastItem['type']) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div
        aria-label="Notifications"
        className="fixed bottom-4 left-1/2 -translate-x-1/2 md:left-auto md:right-4 md:translate-x-0 z-50 flex flex-col gap-2 w-[calc(100vw-2rem)] max-w-sm"
      >
        {toasts.map((toast) => (
          <SingleToast key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used inside <ToastProvider>');
  }
  return context;
}
