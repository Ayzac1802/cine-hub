import React from 'react';
import { Trophy, Star } from 'lucide-react';

interface VoterWinnerRevealProps {
  winnerName: string;
  voterName: string;
}

export default function VoterWinnerReveal({ winnerName, voterName }: VoterWinnerRevealProps) {
  return (
    <div className="fade-in">
      <div className="text-center mb-6">
        <h1
          className="font-display text-3xl uppercase tracking-wide mb-2"
          style={{ color: 'var(--foreground)' }}
        >
          Voting Complete
        </h1>
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
          Thanks for voting, {voterName}. The group has chosen!
        </p>
      </div>

      <div
        className="rounded-2xl border p-8 text-center winner-glow"
        style={{ backgroundColor: 'var(--card)', borderColor: 'var(--primary)' }}
      >
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
          style={{ background: 'linear-gradient(135deg, #E09A00 0%, #F5B301 50%, #FFD04D 100%)' }}
        >
          <Trophy size={28} style={{ color: 'var(--primary-foreground)' }} />
        </div>

        <div
          className="text-xs uppercase tracking-widest font-medium mb-3"
          style={{ color: 'var(--primary)' }}
        >
          Tonight&apos;s Pick
        </div>

        <div
          className="font-display text-winner-xl uppercase tracking-wide leading-tight mb-4"
          style={{ color: 'var(--primary)' }}
        >
          {winnerName || 'Parasite'}
        </div>

        <div className="flex items-center justify-center gap-1.5">
          {[0, 1, 2, 3, 4].map(i => (
            <Star
              key={`star-${i}`}
              size={16}
              fill="var(--primary)"
              style={{ color: 'var(--primary)' }}
            />
          ))}
        </div>
      </div>

      <p className="text-center text-sm mt-4" style={{ color: 'var(--muted-foreground)' }}>
        Grab the popcorn — movie time!
      </p>
    </div>
  );
}