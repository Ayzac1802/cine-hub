'use client';
import React from 'react';
import { Play, Square, ChevronRight, RotateCcw, Trophy, ArrowLeft } from 'lucide-react';
import type { Phase, EventNode } from '@/lib/eventStore';

interface AdminPhaseControlsProps {
  phase: Phase;
  votesCast: number;
  participantCount: number;
  winnerNode: EventNode | null;
  onStartVoting: () => void;
  onCloseVoting: () => void;
  onNextRound: () => void;
  onReopenLobby: () => void;
  onResetEvent: () => void;
}

export default function AdminPhaseControls({
  phase,
  votesCast,
  participantCount,
  winnerNode,
  onStartVoting,
  onCloseVoting,
  onNextRound,
  onReopenLobby,
  onResetEvent,
}: AdminPhaseControlsProps) {
  return (
    <div
      className="rounded-2xl border p-5 mb-6"
      style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
    >
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div>
          <div
            className="text-xs uppercase tracking-widest font-medium mb-0.5"
            style={{ color: 'var(--muted-foreground)' }}
          >
            Round Controls
          </div>
          {phase === 'voting' && (
            <div className="text-sm" style={{ color: 'var(--foreground)' }}>
              <span className="font-mono-data" style={{ color: 'var(--primary)' }}>{votesCast}</span>
              <span style={{ color: 'var(--muted-foreground)' }}>
                {' '}of{' '}
              </span>
              <span className="font-mono-data">{participantCount}</span>
              <span style={{ color: 'var(--muted-foreground)' }}> participants have voted</span>
            </div>
          )}
          {phase === 'results' && (
            <div className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
              {votesCast} vote{votesCast !== 1 ? 's' : ''} cast — ready to advance
            </div>
          )}
          {phase === 'lobby' && (
            <div className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
              Waiting for participants to join
            </div>
          )}
          {phase === 'finished' && winnerNode && (
            <div className="flex items-center gap-2 text-sm">
              <Trophy size={14} style={{ color: 'var(--primary)' }} />
              <span style={{ color: 'var(--foreground)' }}>
                Winner:{' '}
                <strong style={{ color: 'var(--primary)' }}>{winnerNode.name}</strong>
              </span>
            </div>
          )}
        </div>

        {/* Voting progress bar */}
        {phase === 'voting' && participantCount > 0 && (
          <div className="flex items-center gap-3">
            <div
              className="w-32 h-2 rounded-full overflow-hidden"
              style={{ backgroundColor: 'var(--muted)' }}
            >
              <div
                className="h-full rounded-full vote-bar-fill"
                style={{
                  width: `${Math.round((votesCast / participantCount) * 100)}%`,
                  backgroundColor: votesCast === participantCount ? 'var(--green)' : 'var(--primary)',
                }}
              />
            </div>
            <span
              className="text-xs font-mono-data"
              style={{ color: 'var(--muted-foreground)' }}
            >
              {Math.round((votesCast / participantCount) * 100)}%
            </span>
          </div>
        )}
      </div>

      <div className="flex gap-3 flex-wrap">
        {phase === 'lobby' && (
          <button
            onClick={onStartVoting}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-display text-sm uppercase tracking-widest scale-press transition-all-150"
            style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
          >
            <Play size={14} />
            Start Voting
          </button>
        )}

        {phase === 'voting' && (
          <button
            onClick={onCloseVoting}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-display text-sm uppercase tracking-widest scale-press transition-all-150"
            style={{ backgroundColor: 'rgba(255,92,92,0.15)', color: 'var(--accent)', border: '1px solid rgba(255,92,92,0.3)' }}
          >
            <Square size={14} />
            Close Voting
          </button>
        )}

        {phase === 'results' && (
          <button
            onClick={onNextRound}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-display text-sm uppercase tracking-widest scale-press transition-all-150"
            style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
          >
            <ChevronRight size={14} />
            Advance to Next Round
          </button>
        )}

        {phase !== 'lobby' && (
          <button
            onClick={onReopenLobby}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium scale-press transition-all-150 hover:bg-muted"
            style={{ borderColor: 'var(--border-strong)', color: 'var(--muted-foreground)' }}
          >
            <ArrowLeft size={14} />
            Back to Lobby
          </button>
        )}

        <button
          onClick={onResetEvent}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium scale-press transition-all-150 hover:bg-muted ml-auto"
          style={{ borderColor: 'rgba(255,92,92,0.25)', color: 'var(--accent)' }}
        >
          <RotateCcw size={14} />
          Reset Event
        </button>
      </div>
    </div>
  );
}