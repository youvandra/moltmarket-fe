'use client';

import React, { createContext, useContext, useMemo, useState } from 'react';
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

type Variant = 'success' | 'error' | 'info';

type ToastItem = {
  id: string;
  title: string;
  variant?: Variant;
  duration?: number;
};

type ToastContextType = {
  push: (t: { title: string; variant?: Variant; duration?: number }) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  function remove(id: string) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  const ctx = useMemo<ToastContextType>(() => {
    return {
      push: ({ title, variant = 'info', duration = 2500 }) => {
        const id = Math.random().toString(36).slice(2);
        const item: ToastItem = { id, title, variant, duration };
        setToasts((prev) => [...prev, item]);
        if (duration > 0) {
          setTimeout(() => remove(id), duration);
        }
      },
    };
  }, []);

  return (
    <ToastContext.Provider value={ctx}>
      {children}
      <div className="pointer-events-none fixed bottom-6 right-6 z-[100] flex flex-col gap-2">
        {toasts.map((t) => {
          const Icon =
            t.variant === 'success' ? CheckCircle2 : t.variant === 'error' ? AlertCircle : Info;
          const accent =
            t.variant === 'success'
              ? 'from-emerald-500 to-emerald-400'
              : t.variant === 'error'
              ? 'from-rose-500 to-rose-400'
              : 'from-hedera-purple to-fuchsia-500';
          return (
            <div
              key={t.id}
              className={cn(
                'pointer-events-auto relative overflow-hidden rounded-2xl border border-border bg-card/95 backdrop-blur px-4 py-3 shadow-2xl min-w-[240px] flex items-center gap-3'
              )}
            >
              <div className={cn('absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b', accent)} />
              <Icon className="h-4 w-4 text-foreground/80" />
              <div className="flex-1 text-sm font-medium">{t.title}</div>
              <button
                onClick={() => remove(t.id)}
                className="rounded-md p-1 hover:bg-muted/60 active:scale-95 transition"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return ctx;
}





