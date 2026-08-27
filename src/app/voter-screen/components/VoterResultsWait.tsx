import React from 'react';
import { Clock, Monitor } from 'lucide-react';

export default function VoterResultsWait() {
  return (
    <div className="fade-in">
      <div
        className="rounded-2xl border p-8 text-center"
        style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
      >
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
          style={{ backgroundColor: 'rgba(245,179,1,0.1)', border: '1px solid rgba(245,179,1,0.2)' }}
        >
          <Clock size={28} style={{ color: 'var(--primary)' }} />
        </div>

        <h1
          className="font-display text-2xl uppercase tracking-wide mb-2"
          style={{ color: 'var(--foreground)' }}
        >
          Round Closed
        </h1>
        <p className="text-sm mb-6" style={{ color: 'var(--muted-foreground)' }}>
          Votes are in. The host is reviewing the results now.
        </p>

        <div
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border"
          style={{ backgroundColor: 'var(--muted)', borderColor: 'var(--border)' }}
        >
          <Monitor size={14} style={{ color: 'var(--primary)' }} />
          <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
            Check the big screen for the live rankings
          </span>
        </div>

        <div className="flex items-center justify-center gap-2 mt-4">
          <span className="w-2 h-2 rounded-full pulse-gold" style={{ backgroundColor: 'var(--primary)' }} />
          <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
            Waiting for the host to advance the round
          </span>
        </div>
      </div>
    </div>
  );
}