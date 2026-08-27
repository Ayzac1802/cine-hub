'use client';
import { Toaster } from 'sonner';

export default function ToastProvider() {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        style: {
          background: 'var(--card)',
          border: '1px solid var(--border-strong)',
          color: 'var(--foreground)',
          fontFamily: 'var(--font-sans)',
          fontSize: '13px',
          fontWeight: '600',
          borderRadius: '12px',
        },
      }}
    />
  );
}