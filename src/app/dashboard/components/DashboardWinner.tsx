import React from 'react';
import { Trophy, Star, Film } from 'lucide-react';

interface DashboardWinnerProps {
  winnerName: string;
  breadcrumb: string[];
}

export default function DashboardWinner({ winnerName, breadcrumb }: DashboardWinnerProps) {
  return (
    <div className="flex items-center justify-center min-h-[60vh] fade-in">
      <div className="text-center max-w-2xl mx-auto px-4">
        {/* Trophy Icon */}
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8"
          style={{
            background: 'linear-gradient(135deg, #E09A00 0%, #F5B301 50%, #FFD04D 100%)',
            boxShadow: '0 0 60px rgba(245,179,1,0.35)',
          }}
        >
          <Trophy size={40} style={{ color: 'var(--primary-foreground)' }} />
        </div>

        <div
          className="text-xs uppercase tracking-widest font-medium mb-3"
          style={{ color: 'var(--primary)' }}
        >
          Tonight&apos;s Pick
        </div>

        {/* Winner Name */}
        <div
          className="font-display text-winner-xl uppercase tracking-wide leading-tight mb-6 winner-glow"
          style={{ color: 'var(--primary)' }}
        >
          {winnerName || 'Parasite'}
        </div>

        {/* Stars */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[0, 1, 2, 3, 4].map(i => (
            <Star
              key={`winner-star-${i}`}
              size={24}
              fill="var(--primary)"
              style={{ color: 'var(--primary)' }}
            />
          ))}
        </div>

        {/* Breadcrumb */}
        {breadcrumb.length > 0 && (
          <div className="flex items-center justify-center gap-2 flex-wrap mb-6">
            <span className="text-sm font-mono-data" style={{ color: 'var(--muted-foreground)' }}>
              Round 1
            </span>
            {breadcrumb.map((part, i) => (
              <React.Fragment key={`winner-breadcrumb-${i}`}>
                <span style={{ color: 'var(--muted-foreground)' }}>›</span>
                <span className="text-sm font-mono-data" style={{ color: 'var(--primary)' }}>{part}</span>
              </React.Fragment>
            ))}
          </div>
        )}

        <div className="flex items-center justify-center gap-2">
          <Film size={16} style={{ color: 'var(--muted-foreground)' }} />
          <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
            The group has voted — grab the popcorn
          </span>
        </div>
      </div>
    </div>
  );
}