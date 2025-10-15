import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import ToastContainer from './ToastContainer.tsx';
import type { ToastItem, ToastType } from './Toast.tsx';

interface ToastContextType {
  addToast: (type: ToastType, title: string, message?: string, duration?: number) => string;
  removeToast: (id: string) => void;
  clearAllToasts: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

export function ToastProvider({ children, position = 'top-right' }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((
    type: ToastType,
    title: string,
    message?: string,
    duration = 5000
  ): string => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const newToast: ToastItem = {
      id,
      type,
      title,
      message,
      duration,
    };

    setToasts(prevToasts => [...prevToasts, newToast]);

    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const contextValue: ToastContextType = {
    addToast,
    removeToast,
    clearAllToasts,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer
        toasts={toasts}
        onRemove={removeToast}
        position={position}
      />
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextType {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

// Convenience hooks for different toast types
export function useToastSuccess() {
  const { addToast } = useToast();
  return useCallback((title: string, message?: string, duration?: number) =>
    addToast('success', title, message, duration), [addToast]);
}

export function useToastError() {
  const { addToast } = useToast();
  return useCallback((title: string, message?: string, duration?: number) =>
    addToast('error', title, message, duration), [addToast]);
}

export function useToastWarning() {
  const { addToast } = useToast();
  return useCallback((title: string, message?: string, duration?: number) =>
    addToast('warning', title, message, duration), [addToast]);
}

export function useToastInfo() {
  const { addToast } = useToast();
  return useCallback((title: string, message?: string, duration?: number) =>
    addToast('info', title, message, duration), [addToast]);
}
