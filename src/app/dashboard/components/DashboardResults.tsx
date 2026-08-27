'use client';
import React from 'react';
import { Trophy, BarChart2 } from 'lucide-react';
import type { EventNode } from '@/lib/eventStore';
import VoteBarChart from './VoteBarChart';

interface DashboardResultsProps {
  nodes: EventNode[];
  participantCount: number;
  votesCast: number;
}

export default function DashboardResults({ nodes, participantCount, votesCast }: DashboardResultsProps) {
  const ranked = [...nodes].sort((a, b) => (b.votes || 0) - (a.votes || 0));
  const maxVotes = Math.max(...ranked.map(n => n.votes || 0), 1);
  const turnoutPct = participantCount > 0 ? Math.round((votesCast / participantCount) * 100) : 0;

  return (
    <div className="fade-in">
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div
          className="rounded-2xl border p-5"
          style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
        >
          <div className="text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--muted-foreground)' }}>
            Total Votes
          </div>
          <div className="font-display text-4xl" style={{ color: 'var(--primary)' }}>
            {votesCast}
          </div>
        </div>
        <div
          className="rounded-2xl border p-5"
          style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
        >
          <div className="text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--muted-foreground)' }}>
            Turnout
          </div>
          <div className="font-display text-4xl" style={{ color: 'var(--green)' }}>
            {turnoutPct}%
          </div>
        </div>
        <div
          className="rounded-2xl border p-5"
          style={{ backgroundColor: 'var(--card)', borderColor: 'rgba(245,179,1,0.3)' }}
        >
          <div className="text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--muted-foreground)' }}>
            Winner
          </div>
          <div
            className="font-display text-xl truncate"
            style={{ color: 'var(--primary)' }}
          >
            {ranked[0]?.votes ? ranked[0].name : '—'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ranked List */}
        <div
          className="rounded-2xl border p-6"
          style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
        >
          <div className="flex items-center gap-2 mb-5">
            <Trophy size={14} style={{ color: 'var(--primary)' }} />
            <span
              className="text-xs uppercase tracking-widest font-medium"
              style={{ color: 'var(--muted-foreground)' }}
            >
              Final Rankings
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {ranked.map((node, i) => (
              <div
                key={`result-row-${node.id}`}
                className="flex items-center gap-4 rounded-xl px-4 py-3"
                style={{
                  backgroundColor: i === 0 && node.votes > 0 ? 'var(--gold-dim)' : 'var(--muted)',
                  border: `1px solid ${i === 0 && node.votes > 0 ? 'rgba(245,179,1,0.3)' : 'var(--border)'}`,
                }}
              >
                <div
                  className="font-display text-xl w-8 text-center flex-shrink-0"
                  style={{ color: i === 0 && node.votes > 0 ? 'var(--primary)' : 'var(--muted-foreground)' }}
                >
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className="font-medium text-sm truncate mb-1.5"
                    style={{ color: i === 0 && node.votes > 0 ? 'var(--primary)' : 'var(--foreground)' }}
                  >
                    {node.name}
                  </div>
                  <div
                    className="h-1.5 rounded-full overflow-hidden"
                    style={{ backgroundColor: 'var(--background)' }}
                  >
                    <div
                      className="h-full rounded-full vote-bar-fill"
                      style={{
                        width: `${Math.round(((node.votes || 0) / maxVotes) * 100)}%`,
                        backgroundColor: i === 0 && node.votes > 0 ? 'var(--primary)' : 'var(--muted-foreground)',
                      }}
                    />
                  </div>
                </div>
                <div
                  className="font-mono-data font-bold text-xl w-12 text-right flex-shrink-0"
                  style={{ color: i === 0 && node.votes > 0 ? 'var(--primary)' : 'var(--foreground)' }}
                >
                  {String(node.votes || 0).padStart(3, '0')}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div
          className="rounded-2xl border p-6"
          style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
        >
          <div className="flex items-center gap-2 mb-5">
            <BarChart2 size={14} style={{ color: 'var(--muted-foreground)' }} />
            <span
              className="text-xs uppercase tracking-widest font-medium"
              style={{ color: 'var(--muted-foreground)' }}
            >
              Vote Distribution
            </span>
          </div>
          <div className="h-64">
            <VoteBarChart nodes={nodes} />
          </div>
        </div>
      </div>
    </div>
  );
}