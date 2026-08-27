import React from 'react';
import { Users, Popcorn } from 'lucide-react';

interface VoterLobbyWaitProps {
  name: string;
  participantCount: number;
}

export default function VoterLobbyWait({ name, participantCount }: VoterLobbyWaitProps) {
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
          <Popcorn size={28} style={{ color: 'var(--primary)' }} />
        </div>

        <h1
          className="font-display text-2xl uppercase tracking-wide mb-2"
          style={{ color: 'var(--foreground)' }}
        >
          You&apos;re In, {name}
        </h1>
        <p className="text-sm mb-6" style={{ color: 'var(--muted-foreground)' }}>
          Waiting for the host to kick off the first round. Sit tight.
        </p>

        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="w-2.5 h-2.5 rounded-full pulse-dot" style={{ backgroundColor: 'var(--accent)' }} />
          <span className="text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>
            Lobby is open
          </span>
        </div>

        <div
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl"
          style={{ backgroundColor: 'var(--muted)' }}
        >
          <Users size={14} style={{ color: 'var(--muted-foreground)' }} />
          <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
            <span className="font-mono-data font-bold" style={{ color: 'var(--foreground)' }}>
              {participantCount}
            </span>
            {' '}participant{participantCount !== 1 ? 's' : ''} joined so far
          </span>
        </div>
      </div>
    </div>
  );
}