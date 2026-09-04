'use client';
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { INITIAL_EVENT_STATE, type EventState, type PersonalState } from '@/lib/eventStore';
import { loadLiveEvent, saveLiveEvent, subscribeToLiveEvent } from '@/lib/liveEvent';
import PhasePill from '@/components/ui/PhasePill';
import VoterJoinForm from './VoterJoinForm';
import VoterBallot from './VoterBallot';
import VoterLobbyWait from './VoterLobbyWait';
import VoterResultsWait from './VoterResultsWait';
import VoterWinnerReveal from './VoterWinnerReveal';

function uid() {
  return 'voter-' + Math.random().toString(36).slice(2, 9);
}

const VOTER_ID = typeof window !== 'undefined' ? (localStorage.getItem('cinehub-voter-id') || (() => {
    const id = uid();
    localStorage.setItem('cinehub-voter-id', id);
    return id;
  })())
  : uid();

export default function VoterScreenClient({ token, tokenValid, tokenPayload }: { token?: string; tokenValid?: boolean; tokenPayload?: any }) {
  const [event, setEvent] = useState<EventState>(INITIAL_EVENT_STATE);
  const [personal, setPersonal] = useState<PersonalState>({ name: null, votes: {} });

  useEffect(() => {
    let cancelled = false;

    void loadLiveEvent().then((next) => {
      if (!cancelled) setEvent(next);
    }).catch(() => undefined);

    const unsubscribe = subscribeToLiveEvent((next) => {
      if (!cancelled) setEvent(next);
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  const joined = !!personal.name && !!event.participants.find(p => p.id === VOTER_ID);

  const currentLevelNodes = event.nodes.filter(n => n.parentId === event.currentParentId);
  const roundKey = event.currentParentId === null ? 'root' : event.currentParentId;
  const votedNodeId = personal.votes[roundKey];

  const breadcrumbParts = event.winnerPath.map(id =>
    event.nodes.find(n => n.id === id)?.name || '?'
  );

  const handleJoin = (name: string) => {
    if (token && !tokenValid) {
      toast.error('This link is invalid or expired — request a new link from the host');
      return;
    }
    if (!name.trim()) {
      toast.error('Enter a name to join');
      return;
    }
    const newParticipant = { id: VOTER_ID, name: name.trim(), joinedAt: new Date().toISOString() };
    setEvent(prev => {
      const next = {
        ...prev,
        participants: [...prev.participants.filter(p => p.id !== VOTER_ID), newParticipant],
      };
      void saveLiveEvent(next);
      return next;
    });
    setPersonal(prev => ({ ...prev, name: name.trim() }));
    toast.success(`Welcome, ${name.trim()}! You're in the queue.`);
  };

  const handleVote = (nodeId: string) => {
    if (token && !tokenValid) {
      toast.error('This link is invalid or expired — request a new link from the host');
      return;
    }
    if (event.phase !== 'voting') return;
    if (votedNodeId) {
      toast.error("You've already voted this round — one vote per round");
      return;
    }
    const node = event.nodes.find(n => n.id === nodeId);
    if (!node) return;

    setEvent(prev => {
      const next = {
        ...prev,
        nodes: prev.nodes.map(n =>
          n.id === nodeId ? { ...n, votes: (n.votes || 0) + 1 } : n
        ),
      };
      void saveLiveEvent(next);
      return next;
    });
    setPersonal(prev => ({
      ...prev,
      votes: { ...prev.votes, [roundKey]: nodeId },
    }));
    toast.success(`Vote locked in for "${node.name}"`);
  };

  const winnerId = event.winnerPath[event.winnerPath.length - 1];
  const winnerNode = winnerId ? event.nodes.find(n => n.id === winnerId) : null;

  return (
    <div className="max-w-lg mx-auto fade-in px-1">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        {personal.name ? (
          <span className="text-xs sm:text-sm" style={{ color: 'var(--muted-foreground)' }}>
            Voting as{' '}
            <strong style={{ color: 'var(--foreground)' }}>{personal.name}</strong>
          </span>
        ) : (
          <span className="text-xs sm:text-sm" style={{ color: 'var(--muted-foreground)' }}>Voter</span>
        )}
        {event.eventName && (
          <span className="text-xs font-mono-data truncate max-w-[120px] sm:max-w-none" style={{ color: 'var(--primary)' }}>
            {event.eventName}
          </span>
        )}
        <PhasePill phase={event.phase} />
      </div>

      {/* Token banner */}
      {token && !tokenValid && (
        <div className="mb-3 p-3 rounded-md" style={{ backgroundColor: '#FFFBEB', color: '#92400E' }}>
          This link looks invalid or has expired. Contact the host to generate a new voter link.
        </div>
      )}

      {/* Breadcrumb */}
      {breadcrumbParts.length > 0 && (
        <div className="flex items-center gap-1 mb-3 flex-wrap">
          <span className="text-xs font-mono-data" style={{ color: 'var(--primary)' }}>Round 1</span>
          {breadcrumbParts.map((part, i) => (
            <React.Fragment key={`voter-breadcrumb-${i}`}>
              <span style={{ color: 'var(--muted-foreground)' }}>›</span>
              <span className="text-xs font-mono-data" style={{ color: 'var(--primary)' }}>{part}</span>
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Phase-Aware Content */}
      {!joined && <VoterJoinForm onJoin={handleJoin} />}
      {joined && event.phase === 'lobby' && (
        <VoterLobbyWait name={personal.name!} participantCount={event.participants.length} />
      )}
      {joined && event.phase === 'voting' && (
        <VoterBallot nodes={currentLevelNodes} votedNodeId={votedNodeId} onVote={handleVote} />
      )}
      {joined && event.phase === 'results' && <VoterResultsWait />}
      {joined && event.phase === 'finished' && (
        <VoterWinnerReveal winnerName={winnerNode?.name || ''} voterName={personal.name!} />
      )}
    </div>
  );
}