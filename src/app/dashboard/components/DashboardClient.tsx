'use client';
import React, { useState } from 'react';
import { Monitor, Wifi } from 'lucide-react';
import { INITIAL_EVENT_STATE, DEMO_VOTING_STATE, type EventState } from '@/lib/eventStore';
import PhasePill from '@/components/ui/PhasePill';
import DashboardLobby from './DashboardLobby';
import DashboardVoting from './DashboardVoting';
import DashboardResults from './DashboardResults';
import DashboardWinner from './DashboardWinner';

export default function DashboardClient() {
  // Backend integration point: subscribe to real-time event state from database
  const [event, setEvent] = useState<EventState>(INITIAL_EVENT_STATE);
  const [demoPhase, setDemoPhase] = useState<'lobby' | 'voting' | 'results' | 'finished'>('lobby');

  const switchDemoPhase = (phase: typeof demoPhase) => {
    setDemoPhase(phase);
    if (phase === 'voting') {
      setEvent({ ...DEMO_VOTING_STATE, phase: 'voting', nodes: DEMO_VOTING_STATE.nodes.map(n =>
        n.parentId === null ? { ...n, votes: 0 } : n
      )});
    } else if (phase === 'results') {
      setEvent({ ...DEMO_VOTING_STATE, phase: 'results' });
    } else if (phase === 'finished') {
      setEvent({
        ...DEMO_VOTING_STATE,
        phase: 'finished',
        winnerPath: ['cat-thriller'],
      });
    } else {
      setEvent({ ...INITIAL_EVENT_STATE, phase: 'lobby' });
    }
  };

  const currentLevelNodes = event.nodes.filter(n => n.parentId === event.currentParentId);
  const votesCastThisRound = currentLevelNodes.reduce((s, n) => s + (n.votes || 0), 0);
  const breadcrumbParts = event.winnerPath.map(id =>
    event.nodes.find(n => n.id === id)?.name || '?'
  );
  const winnerId = event.winnerPath[event.winnerPath.length - 1];
  const winnerNode = winnerId ? event.nodes.find(n => n.id === winnerId) : null;

  return (
    <div className="max-w-screen-2xl mx-auto fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Monitor size={15} style={{ color: 'var(--primary)' }} />
            <span
              className="text-xs uppercase tracking-widest font-medium"
              style={{ color: 'var(--muted-foreground)' }}
            >
              Dashboard — Big Screen View
            </span>
          </div>
          <h1
            className="font-display text-3xl uppercase tracking-wide"
            style={{ color: 'var(--foreground)' }}
          >
            Live Event
          </h1>
          {breadcrumbParts.length > 0 && (
            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
              <span className="text-xs font-mono-data" style={{ color: 'var(--primary)' }}>Round 1</span>
              {breadcrumbParts.map((part, i) => (
                <React.Fragment key={`dash-breadcrumb-${i}`}>
                  <span style={{ color: 'var(--muted-foreground)' }}>›</span>
                  <span className="text-xs font-mono-data" style={{ color: 'var(--primary)' }}>{part}</span>
                </React.Fragment>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Demo Phase Switcher */}
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-xl border"
            style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
          >
            <Wifi size={12} style={{ color: 'var(--muted-foreground)' }} />
            <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Demo:</span>
            {(['lobby', 'voting', 'results', 'finished'] as const).map(phase => (
              <button
                key={`dash-phase-${phase}`}
                onClick={() => switchDemoPhase(phase)}
                className="px-2.5 py-1 rounded-lg text-xs font-medium capitalize transition-all-150 scale-press"
                style={{
                  backgroundColor: demoPhase === phase ? 'rgba(245,179,1,0.15)' : 'transparent',
                  color: demoPhase === phase ? 'var(--primary)' : 'var(--muted-foreground)',
                }}
              >
                {phase}
              </button>
            ))}
          </div>
          <PhasePill phase={event.phase} />
        </div>
      </div>

      {/* Phase-Aware Main Content */}
      {event.phase === 'lobby' && (
        <DashboardLobby
          participants={event.participants}
          votesCast={votesCastThisRound}
        />
      )}
      {event.phase === 'voting' && (
        <DashboardVoting
          nodes={currentLevelNodes}
          participantCount={event.participants.length}
          votesCast={votesCastThisRound}
        />
      )}
      {event.phase === 'results' && (
        <DashboardResults
          nodes={currentLevelNodes}
          participantCount={event.participants.length}
          votesCast={votesCastThisRound}
        />
      )}
      {event.phase === 'finished' && winnerNode && (
        <DashboardWinner
          winnerName={winnerNode.name}
          breadcrumb={breadcrumbParts}
        />
      )}
    </div>
  );
}