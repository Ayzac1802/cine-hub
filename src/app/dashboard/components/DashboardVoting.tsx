'use client';
import React from 'react';
import { Zap, Users } from 'lucide-react';
import type { EventNode } from '@/lib/eventStore';
import VoteBarChart from './VoteBarChart';

interface DashboardVotingProps {
  nodes: EventNode[];
  participantCount: number;
  votesCast: number;
}

export default function DashboardVoting({ nodes, participantCount, votesCast }: DashboardVotingProps) {
  const turnoutPct = participantCount > 0 ? Math.round((votesCast / participantCount) * 100) : 0;

  return (
    <div className="fade-in">
      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div
          className="rounded-2xl border p-5"
          style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
        >
          <div className="text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--muted-foreground)' }}>
            Votes Cast
          </div>
          <div className="font-display text-4xl" style={{ color: 'var(--primary)' }}>
            {votesCast}
          </div>
          <div className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>
            of {participantCount} participants
          </div>
        </div>

        <div
          className="rounded-2xl border p-5"
          style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
        >
          <div className="text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--muted-foreground)' }}>
            Turnout
          </div>
          <div
            className="font-display text-4xl"
            style={{ color: turnoutPct >= 80 ? 'var(--green)' : 'var(--foreground)' }}
          >
            {turnoutPct}%
          </div>
          <div
            className="h-1.5 rounded-full mt-2 overflow-hidden"
            style={{ backgroundColor: 'var(--muted)' }}
          >
            <div
              className="h-full rounded-full vote-bar-fill"
              style={{
                width: `${turnoutPct}%`,
                backgroundColor: turnoutPct >= 80 ? 'var(--green)' : 'var(--primary)',
              }}
            />
          </div>
        </div>

        <div
          className="hidden md:flex rounded-2xl border p-5 items-center gap-3"
          style={{ backgroundColor: 'var(--card)', borderColor: 'rgba(245,179,1,0.3)' }}
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: 'rgba(245,179,1,0.15)' }}
          >
            <Zap size={18} style={{ color: 'var(--primary)' }} />
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest mb-0.5" style={{ color: 'var(--muted-foreground)' }}>
              Status
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full pulse-dot" style={{ backgroundColor: 'var(--accent)' }} />
              <span className="font-medium text-sm" style={{ color: 'var(--foreground)' }}>Voting Live</span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Vote Bars */}
      <div
        className="rounded-2xl border p-6"
        style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Users size={14} style={{ color: 'var(--muted-foreground)' }} />
            <span
              className="text-xs uppercase tracking-widest font-medium"
              style={{ color: 'var(--muted-foreground)' }}
            >
              Live Vote Count
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full pulse-dot" style={{ backgroundColor: 'var(--accent)' }} />
            <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Updating live</span>
          </div>
        </div>

        {nodes.length === 0 ? (
          <div className="text-center py-10" style={{ color: 'var(--muted-foreground)' }}>
            No items in this round yet
          </div>
        ) : (
          <div className="h-64">
            <VoteBarChart nodes={nodes} />
          </div>
        )}
      </div>
    </div>
  );
}