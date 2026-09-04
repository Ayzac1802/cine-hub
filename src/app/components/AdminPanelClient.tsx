'use client';
import React, { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { Shield, ChevronRight, Users, Vote, Lock, AlertCircle, ChevronDown, Eye, Clapperboard } from 'lucide-react';
import { INITIAL_EVENT_STATE, type EventState, type EventNode } from '@/lib/eventStore';
import { loadLiveEvent, saveLiveEvent, subscribeToLiveEvent } from '@/lib/liveEvent';
import StatCard from '@/components/ui/StatCard';
import PhasePill from '@/components/ui/PhasePill';
import ConfirmModal from '@/components/ui/ConfirmModal';
import AdminNodeTree from './AdminNodeTree';
import AdminPhaseControls from './AdminPhaseControls';
import AdminQRCard from './AdminQRCard';
import EventSetupScreen from './EventSetupScreen';

const ADMIN_CODE = '2468';

function uid() {
  return 'node-' + Math.random().toString(36).slice(2, 9);
}

export default function AdminPanelClient() {
  // Step 1: event setup, Step 2: admin unlock, Step 3: panel
  const [setupDone, setSetupDone] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [codeInput, setCodeInput] = useState('');
  const [codeError, setCodeError] = useState(false);

  const [event, setEvent] = useState<EventState>(INITIAL_EVENT_STATE);
  const [resetModalOpen, setResetModalOpen] = useState(false);

  const syncEvent = useCallback((next: EventState) => {
    setEvent(next);
    void saveLiveEvent(next);
  }, []);

  useEffect(() => {
    let cancelled = false;

    void loadLiveEvent().then((next) => {
      if (!cancelled) setEvent(next);
    }).catch(() => undefined);

    const unsubscribe = subscribeToLiveEvent((next) => {
      if (!cancelled) {
        setEvent(next);
      }
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  const handleSetupComplete = (config: { eventName: string; passcode: string; qrSize: number }) => {
    const next = {
      ...event,
      eventName: config.eventName,
      passcode: config.passcode,
      qrSize: config.qrSize,
    };
    syncEvent(next);
    setSetupDone(true);
    toast.success(`Event "${config.eventName}" created`);
  };

  const handleUnlock = () => {
    if (codeInput === ADMIN_CODE) {
      setUnlocked(true);
      setCodeError(false);
      toast.success('Admin access granted');
    } else {
      setCodeError(true);
      toast.error('Incorrect admin code');
    }
  };

  const childrenOf = useCallback((parentId: string | null) =>
    event.nodes.filter(n => n.parentId === parentId), [event.nodes]);

  const currentLevelNodes = useCallback(() =>
    childrenOf(event.currentParentId), [childrenOf, event.currentParentId]);

  const nodeById = useCallback((id: string) =>
    event.nodes.find(n => n.id === id), [event.nodes]);

  const roundKey = event.currentParentId === null ? 'root' : event.currentParentId;
  const votesCastThisRound = currentLevelNodes().reduce((s, n) => s + (n.votes || 0), 0);
  const breadcrumbParts = event.winnerPath.map(id => nodeById(id)?.name || '?');

  const handleStartVoting = () => {
    if (!currentLevelNodes().length) {
      toast.error('Add items to this round before starting voting');
      return;
    }
    const updated = { ...event };
    updated.nodes = updated.nodes.map(n =>
      currentLevelNodes().find(c => c.id === n.id) ? { ...n, votes: 0 } : n
    );
    updated.phase = 'voting';
    syncEvent(updated);
    toast.success('Voting started — voters can now cast their picks');
  };

  const handleCloseVoting = () => {
    const next = { ...event, phase: 'results' as const };
    syncEvent(next);
    toast.success('Voting closed — results are now visible');
  };

  const handleNextRound = () => {
    const ranked = [...currentLevelNodes()].sort((a, b) => (b.votes || 0) - (a.votes || 0));
    if (!ranked.length || !ranked[0].votes) {
      toast.error('No votes recorded this round — cannot advance');
      return;
    }
    const winner = ranked[0];
    const kids = childrenOf(winner.id);
    const next = {
      ...event,
      winnerPath: [...event.winnerPath, winner.id],
      currentParentId: winner.id,
      phase: kids.length ? 'voting' as const : 'finished' as const,
      nodes: kids.length ? event.nodes.map(n =>
        kids.find(k => k.id === n.id) ? { ...n, votes: 0 } : n
      ) : event.nodes,
    };
    syncEvent(next);
    toast.success(`"${winner.name}" advances to the next round`);
  };

  const handleReopenLobby = () => {
    const next = { ...event, phase: 'lobby' as const };
    syncEvent(next);
    toast.info('Event returned to lobby');
  };

  const handleReset = () => {
    const next = {
      ...event,
      phase: 'lobby' as const,
      currentParentId: null,
      winnerPath: [],
      participants: [],
      nodes: event.nodes.map(n => ({ ...n, votes: 0 })),
    };
    syncEvent(next);
    setResetModalOpen(false);
    toast.success('Event reset — ready for a new session');
  };

  const handleAddNode = (parentId: string | null, name: string) => {
    if (!name.trim()) return;
    const newNode: EventNode = { id: uid(), parentId, name: name.trim(), votes: 0 };
    const next = { ...event, nodes: [...event.nodes, newNode] };
    syncEvent(next);
    toast.success(`"${name.trim()}" added`);
  };

  const handleDeleteNode = (id: string) => {
    const toRemove = new Set([id]);
    let changed = true;
    while (changed) {
      changed = false;
      event.nodes.forEach(n => {
        if (n.parentId && toRemove.has(n.parentId) && !toRemove.has(n.id)) {
          toRemove.add(n.id);
          changed = true;
        }
      });
    }
    const next = { ...event, nodes: event.nodes.filter(n => !toRemove.has(n.id)) };
    syncEvent(next);
    toast.success('Item removed');
  };

  const handleUpdateNode = (id: string, updates: Partial<EventNode>) => {
    const next = { ...event, nodes: event.nodes.map(n => n.id === id ? { ...n, ...updates } : n) };
    syncEvent(next);
    toast.success('Item updated');
  };

  // Step 1: Event Setup
  if (!setupDone) {
    return <EventSetupScreen onComplete={handleSetupComplete} />;
  }

  // Step 2: Admin Lock Gate
  if (!unlocked) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] px-4">
        <div className="w-full max-w-sm fade-in">
          <div className="text-center mb-6">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: 'rgba(245,179,1,0.15)', border: '1px solid rgba(245,179,1,0.3)' }}
            >
              <Lock size={24} style={{ color: 'var(--primary)' }} />
            </div>
            <div className="flex items-center justify-center gap-2 mb-1">
              <Clapperboard size={14} style={{ color: 'var(--primary)' }} />
              <span className="text-xs font-mono-data" style={{ color: 'var(--primary)' }}>
                {event.eventName}
              </span>
            </div>
            <h1 className="font-display text-2xl uppercase tracking-wider mb-2" style={{ color: 'var(--foreground)' }}>
              Admin Access
            </h1>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
              Enter the admin code to control the event.
            </p>
          </div>

          <div className="rounded-2xl border p-5 sm:p-6" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <label
              className="block text-xs uppercase tracking-widest font-medium mb-2"
              style={{ color: 'var(--muted-foreground)' }}
              htmlFor="admin-code-input"
            >
              Admin Code
            </label>
            <input
              id="admin-code-input"
              type="password"
              value={codeInput}
              onChange={e => { setCodeInput(e.target.value); setCodeError(false); }}
              onKeyDown={e => e.key === 'Enter' && handleUnlock()}
              placeholder="Enter code"
              className="w-full rounded-xl px-4 py-3 text-center text-xl tracking-[0.5em] font-mono-data border mb-1 outline-none focus:ring-2 transition-all-150"
              style={{
                backgroundColor: 'var(--muted)',
                color: 'var(--foreground)',
                borderColor: codeError ? 'var(--accent)' : 'var(--border-strong)',
              }}
              aria-invalid={codeError}
            />
            {codeError && (
              <p className="text-xs flex items-center gap-1 mb-3" style={{ color: 'var(--accent)' }}>
                <AlertCircle size={12} />
                Incorrect code — try again
              </p>
            )}
            {!codeError && <div className="mb-3" />}
            <button
              onClick={handleUnlock}
              className="w-full py-3 rounded-xl font-display text-sm uppercase tracking-widest scale-press transition-all-150"
              style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
            >
              Unlock Admin Panel
            </button>
            <p className="text-xs text-center mt-3" style={{ color: 'var(--muted-foreground)' }}>
              Demo code: <span className="font-mono-data" style={{ color: 'var(--primary)' }}>2468</span>
            </p>
          </div>

          <button
            onClick={() => setSetupDone(false)}
            className="w-full text-center text-xs mt-4 underline"
            style={{ color: 'var(--muted-foreground)' }}
          >
            ← Back to event setup
          </button>
        </div>
      </div>
    );
  }

  const winnerId = event.winnerPath[event.winnerPath.length - 1];
  const winnerNode = winnerId ? nodeById(winnerId) : null;

  return (
    <div className="max-w-4xl mx-auto fade-in px-0 sm:px-0">
      {/* Header Row */}
      <div className="flex items-start justify-between mb-4 sm:mb-6 flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield size={14} style={{ color: 'var(--primary)' }} />
            <span className="text-xs uppercase tracking-widest font-medium" style={{ color: 'var(--muted-foreground)' }}>
              Admin Panel
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl uppercase tracking-wide" style={{ color: 'var(--foreground)' }}>
            {event.eventName || 'Run the Event'}
          </h1>
          {breadcrumbParts.length > 0 && (
            <div className="flex items-center gap-1.5 mt-2 flex-wrap">
              <span className="text-xs font-mono-data" style={{ color: 'var(--primary)' }}>Round 1</span>
              {breadcrumbParts.map((part, i) => (
                <React.Fragment key={`breadcrumb-${i}`}>
                  <ChevronRight size={12} style={{ color: 'var(--muted-foreground)' }} />
                  <span className="text-xs font-mono-data" style={{ color: 'var(--primary)' }}>{part}</span>
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
        <PhasePill phase={event.phase} />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6">
        <StatCard label="Participants" value={event.participants.length} sub="joined this session" />
        <StatCard
          label="Votes Cast"
          value={`${votesCastThisRound}/${event.participants.length}`}
          sub="this round"
          highlight={votesCastThisRound === event.participants.length && event.participants.length > 0}
        />
        <StatCard label="Round Depth" value={event.winnerPath.length + 1} sub="bracket level" />
        <StatCard label="Total Items" value={event.nodes.length} sub="in bracket tree" />
      </div>

      {/* Phase Controls */}
      <AdminPhaseControls
        phase={event.phase}
        votesCast={votesCastThisRound}
        participantCount={event.participants.length}
        winnerNode={winnerNode || null}
        onStartVoting={handleStartVoting}
        onCloseVoting={handleCloseVoting}
        onNextRound={handleNextRound}
        onReopenLobby={handleReopenLobby}
        onResetEvent={() => setResetModalOpen(true)}
      />

      {/* Participants List */}
      <div className="mb-4 sm:mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Users size={14} style={{ color: 'var(--muted-foreground)' }} />
          <span className="text-xs uppercase tracking-widest font-medium" style={{ color: 'var(--muted-foreground)' }}>
            Joined ({event.participants.length})
          </span>
        </div>
        {event.participants.length === 0 ? (
          <div className="rounded-xl border px-4 py-3 text-sm" style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>
            No participants yet. Share the QR code below.
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {event.participants.map(p => (
              <span
                key={`participant-${p.id}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm"
                style={{ backgroundColor: 'var(--muted)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--green)' }} />
                {p.name}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Node Tree */}
      <div className="mb-4 sm:mb-6">
        <div className="flex items-center gap-2 mb-3">
          <ChevronDown size={14} style={{ color: 'var(--muted-foreground)' }} />
          <span className="text-xs uppercase tracking-widest font-medium" style={{ color: 'var(--muted-foreground)' }}>
            Categories & Items
          </span>
        </div>
        <p className="text-xs sm:text-sm mb-3" style={{ color: 'var(--muted-foreground)' }}>
          Add categories, then nest movies under each. Use the image icon on items to add a cover photo and synopsis.
        </p>
        <AdminNodeTree
          nodes={event.nodes}
          winnerPath={event.winnerPath}
          currentParentId={event.currentParentId}
          onAddNode={handleAddNode}
          onDeleteNode={handleDeleteNode}
          onUpdateNode={handleUpdateNode}
        />
      </div>

      {/* QR Code */}
      <AdminQRCard />

      {/* Quick Links */}
      <div className="flex gap-2 sm:gap-3 mt-4 sm:mt-6 flex-wrap">
        <a
          href="/dashboard"
          className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border text-xs sm:text-sm font-medium transition-all-150 hover:bg-muted scale-press"
          style={{ borderColor: 'var(--border-strong)', color: 'var(--muted-foreground)' }}
        >
          <Eye size={13} />
          Dashboard View
        </a>
        <a
          href="/voter-screen"
          className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border text-xs sm:text-sm font-medium transition-all-150 hover:bg-muted scale-press"
          style={{ borderColor: 'var(--border-strong)', color: 'var(--muted-foreground)' }}
        >
          <Vote size={13} />
          Voter Screen
        </a>
        <button
          onClick={() => { setSetupDone(false); setUnlocked(false); }}
          className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border text-xs sm:text-sm font-medium transition-all-150 hover:bg-muted scale-press"
          style={{ borderColor: 'var(--border-strong)', color: 'var(--muted-foreground)' }}
        >
          <Clapperboard size={13} />
          New Event
        </button>
      </div>

      <ConfirmModal
        open={resetModalOpen}
        title="Reset Entire Event"
        description="This will clear all votes, remove all participants, and return to the lobby. Category and item structure will be preserved. This cannot be undone."
        confirmLabel="Reset Event"
        onConfirm={handleReset}
        onCancel={() => setResetModalOpen(false)}
        danger
      />
    </div>
  );
}