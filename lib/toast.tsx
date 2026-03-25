"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "info";

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastCtx {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastCtx>({ toast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

function SingleToast({
  item,
  onDismiss,
}: {
  item: ToastItem;
  onDismiss: (id: string) => void;
}) {
  useEffect(() => {
    const t = setTimeout(() => onDismiss(item.id), 3500);
    return () => clearTimeout(t);
  }, [item.id, onDismiss]);

  const icons = {
    success: <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />,
    error: <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />,
    info: <Info className="w-4 h-4 text-indigo-500 flex-shrink-0" />,
  };

  return (
    <div className="flex items-center gap-3 bg-white border border-gray-200 shadow-lg rounded-xl px-4 py-3 min-w-[260px] max-w-sm animate-in slide-in-from-right-4 fade-in duration-200">
      {icons[item.type]}
      <span className="text-sm text-gray-800 flex-1">{item.message}</span>
      <button
        onClick={() => onDismiss(item.id)}
        className="text-gray-400 hover:text-gray-600"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((message: string, type: ToastType = "success") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Toast stack */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2">
        {toasts.map((t) => (
          <SingleToast key={t.id} item={t} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
