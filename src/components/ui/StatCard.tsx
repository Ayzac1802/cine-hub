import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  highlight?: boolean;
}

export default function StatCard({ label, value, sub, highlight }: StatCardProps) {
  return (
    <div
      className="rounded-xl p-4 border transition-all-150"
      style={{
        backgroundColor: 'var(--muted)',
        borderColor: highlight ? 'rgba(245,179,1,0.3)' : 'var(--border)',
      }}
    >
      <div
        className="text-xs uppercase tracking-widest font-medium mb-1"
        style={{ color: 'var(--muted-foreground)' }}
      >
        {label}
      </div>
      <div
        className="font-display text-2xl"
        style={{ color: highlight ? 'var(--primary)' : 'var(--foreground)' }}
      >
        {value}
      </div>
      {sub && (
        <div className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>
          {sub}
        </div>
      )}
    </div>
  );
}