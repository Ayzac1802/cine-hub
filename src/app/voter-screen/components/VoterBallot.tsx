'use client';
import React, { useState } from 'react';
import { CheckCircle2, Lock, Film, ChevronDown, ChevronUp } from 'lucide-react';
import type { EventNode } from '@/lib/eventStore';

interface VoterBallotProps {
  nodes: EventNode[];
  votedNodeId: string | undefined;
  onVote: (nodeId: string) => void;
}

function BallotCard({
  node,
  isVoted,
  isLocked,
  hasVoted,
  onVote,
}: {
  node: EventNode;
  isVoted: boolean;
  isLocked: boolean;
  hasVoted: boolean;
  onVote: (id: string) => void;
}) {
  const [synopsisOpen, setSynopsisOpen] = useState(false);
  const hasCover = !!node.coverImage;
  const hasSynopsis = !!node.synopsis;

  return (
    <div
      className="rounded-2xl border overflow-hidden transition-all-300"
      style={{
        backgroundColor: isVoted ? 'var(--gold-dim)' : isLocked ? 'rgba(31,36,64,0.5)' : 'var(--card)',
        borderColor: isVoted ? 'var(--primary)' : isLocked ? 'var(--border)' : 'var(--border-strong)',
        opacity: isLocked ? 0.55 : 1,
      }}
    >
      {/* Cover Image */}
      {hasCover && (
        <div className="relative w-full overflow-hidden" style={{ height: '140px' }}>
          <img
            src={node.coverImage}
            alt={`${node.name} movie poster`}
            className="w-full h-full object-cover"
            style={{ objectPosition: 'center top' }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
          {isVoted && (
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ backgroundColor: 'rgba(245,179,1,0.35)' }}
            >
              <CheckCircle2 size={40} style={{ color: 'var(--primary)' }} />
            </div>
          )}
        </div>
      )}

      {/* Card Body */}
      <div className="px-4 py-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            {!hasCover && (
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: isVoted ? 'var(--primary)' : 'var(--muted)' }}
              >
                {isVoted ? (
                  <CheckCircle2 size={16} style={{ color: 'var(--primary-foreground)' }} />
                ) : (
                  <Film size={14} style={{ color: 'var(--muted-foreground)' }} />
                )}
              </div>
            )}
            <span
              className="font-semibold text-sm leading-tight"
              style={{ color: isVoted ? 'var(--primary)' : 'var(--foreground)' }}
            >
              {node.name}
            </span>
          </div>

          <div className="flex-shrink-0 flex items-center gap-1.5">
            {hasSynopsis && (
              <button
                onClick={(e) => { e.stopPropagation(); setSynopsisOpen(o => !o); }}
                className="p-1 rounded-lg transition-all-150"
                style={{ color: 'var(--muted-foreground)' }}
                aria-label={synopsisOpen ? 'Hide synopsis' : 'Show synopsis'}
              >
                {synopsisOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            )}
            {isVoted && (
              <span
                className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full"
                style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
              >
                <CheckCircle2 size={10} />
                Voted
              </span>
            )}
            {isLocked && <Lock size={13} style={{ color: 'var(--muted-foreground)' }} />}
            {!hasVoted && (
              <button
                onClick={() => onVote(node.id)}
                className="text-xs font-medium px-3 py-1.5 rounded-full border transition-all-150 scale-press"
                style={{ borderColor: 'var(--primary)', color: 'var(--primary)', backgroundColor: 'transparent' }}
                aria-label={`Vote for ${node.name}`}
              >
                Vote
              </button>
            )}
          </div>
        </div>

        {/* Synopsis */}
        {hasSynopsis && synopsisOpen && (
          <div
            className="mt-2 pt-2 text-xs leading-relaxed fade-in"
            style={{ color: 'var(--muted-foreground)', borderTop: '1px solid var(--border)' }}
          >
            {node.synopsis}
          </div>
        )}
      </div>
    </div>
  );
}

export default function VoterBallot({ nodes, votedNodeId, onVote }: VoterBallotProps) {
  const hasVoted = !!votedNodeId;

  return (
    <div className="fade-in">
      <div className="mb-4">
        <h1
          className="font-display text-2xl uppercase tracking-wide mb-1"
          style={{ color: 'var(--foreground)' }}
        >
          {hasVoted ? 'Vote Locked In' : 'Cast Your Vote'}
        </h1>
        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
          {hasVoted
            ? 'Your pick is recorded. Check the big screen for live results.'
            : 'Pick one — you get one vote per round.'}
        </p>
      </div>

      {nodes.length === 0 ? (
        <div
          className="rounded-2xl border p-8 text-center"
          style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}
        >
          <Film size={28} className="mx-auto mb-3" style={{ color: 'var(--muted-foreground)' }} />
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
            No items in this round yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2.5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))' }}>
          {nodes.map(node => {
            const isVoted = votedNodeId === node.id;
            const isLocked = hasVoted && !isVoted;
            return (
              <BallotCard
                key={`ballot-${node.id}`}
                node={node}
                isVoted={isVoted}
                isLocked={isLocked}
                hasVoted={hasVoted}
                onVote={onVote}
              />
            );
          })}
        </div>
      )}

      {hasVoted && (
        <div
          className="mt-4 rounded-xl border px-3 py-2.5 flex items-center gap-2.5 fade-in"
          style={{ backgroundColor: 'rgba(76,195,138,0.08)', borderColor: 'rgba(76,195,138,0.25)' }}
        >
          <CheckCircle2 size={14} style={{ color: 'var(--green)' }} />
          <p className="text-xs" style={{ color: 'var(--green)' }}>
            Vote locked. Waiting for host to close this round.
          </p>
        </div>
      )}
    </div>
  );
}