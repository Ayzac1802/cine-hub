'use client';
import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  danger?: boolean;
}

export default function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  onConfirm,
  onCancel,
  danger = false,
}: ConfirmModalProps) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(14,17,32,0.85)', backdropFilter: 'blur(4px)' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="w-full max-w-sm rounded-2xl border p-6 fade-in"
        style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border-strong)' }}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: danger ? 'rgba(255,92,92,0.15)' : 'var(--muted)' }}
            >
              <AlertTriangle size={18} style={{ color: danger ? 'var(--accent)' : 'var(--primary)' }} />
            </div>
            <h3
              id="modal-title"
              className="font-display text-base uppercase tracking-wide"
              style={{ color: 'var(--foreground)' }}
            >
              {title}
            </h3>
          </div>
          <button
            onClick={onCancel}
            className="p-1 rounded-lg hover:bg-muted transition-all-150"
            aria-label="Close modal"
          >
            <X size={16} style={{ color: 'var(--muted-foreground)' }} />
          </button>
        </div>
        <p className="text-sm mb-6" style={{ color: 'var(--muted-foreground)' }}>
          {description}
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 px-4 rounded-lg border text-sm font-semibold transition-all-150 hover:bg-muted scale-press"
            style={{ borderColor: 'var(--border-strong)', color: 'var(--muted-foreground)' }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all-150 scale-press"
            style={{
              backgroundColor: danger ? 'rgba(255,92,92,0.2)' : 'var(--primary)',
              color: danger ? 'var(--accent)' : 'var(--primary-foreground)',
              border: danger ? '1px solid rgba(255,92,92,0.4)' : 'none',
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}