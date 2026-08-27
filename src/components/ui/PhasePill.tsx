import React from 'react';

type Phase = 'lobby' | 'voting' | 'results' | 'finished';

interface PhasePillProps {
  phase: Phase;
}

const phaseConfig: Record<Phase, { label: string; dotClass: string; dotColor: string }> = {
  lobby: { label: 'Lobby Open', dotClass: '', dotColor: 'var(--muted-foreground)' },
  voting: { label: 'Voting Live', dotClass: 'pulse-dot', dotColor: 'var(--accent)' },
  results: { label: 'Results In', dotClass: 'pulse-gold', dotColor: 'var(--primary)' },
  finished: { label: 'Event Finished', dotClass: '', dotColor: 'var(--green)' },
};

export default function PhasePill({ phase }: PhasePillProps) {
  const config = phaseConfig[phase];
  return (
    <div
      className="inline-flex items-center gap-2 text-xs tracking-widest uppercase px-3 py-1.5 rounded-full border"
      style={{ color: 'var(--muted-foreground)', borderColor: 'var(--border)', backgroundColor: 'var(--muted)' }}
    >
      <span
        className={`w-2 h-2 rounded-full flex-shrink-0 ${config.dotClass}`}
        style={{ backgroundColor: config.dotColor }}
      />
      {config.label}
    </div>
  );
}