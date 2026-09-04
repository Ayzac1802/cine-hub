import React from 'react';
import { Users, QrCode } from 'lucide-react';
import type { Participant } from '@/lib/eventStore';

interface DashboardLobbyProps {
  participants: Participant[];
  votesCast: number;
}

export default function DashboardLobby({ participants }: DashboardLobbyProps) {
  const voterUrl = 'https://cinehub.app/voter-screen?event=${Lobby}';
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&color=F4F2EC&bgcolor=171B31&data=${encodeURIComponent(voterUrl)}`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 fade-in">
      {/* QR Code Card */}
      <div
        className="xl:col-span-1 rounded-2xl border p-5 sm:p-8 flex flex-col items-center justify-center text-center"
        style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
      >
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <QrCode size={14} style={{ color: 'var(--muted-foreground)' }} />
          <span className="text-xs uppercase tracking-widest" style={{ color: 'var(--muted-foreground)' }}>
            Scan to Join
          </span>
        </div>

        <div className="rounded-2xl p-3 sm:p-5 mb-3 sm:mb-4" style={{ backgroundColor: 'var(--secondary)' }}>
          <img
            src={qrUrl}
            alt="QR code linking to the voter screen — scan to join the event"
            className="rounded-xl block"
            style={{ width: 'clamp(160px, 50vw, 220px)', height: 'auto' }}
          />
        </div>

        <div className="font-display text-base sm:text-lg uppercase tracking-widest mb-1" style={{ color: 'var(--foreground)' }}>
          Scan to Vote
        </div>
        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
          cinehub.app/voter-screen
        </p>

        <div className="flex items-center gap-2 mt-4 sm:mt-5 px-3 sm:px-4 py-2 rounded-full" style={{ backgroundColor: 'var(--muted)' }}>
          <span className="w-2 h-2 rounded-full pulse-dot" style={{ backgroundColor: 'var(--accent)' }} />
          <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Lobby open — waiting for host</span>
        </div>
      </div>

      {/* Participants Card */}
      <div
        className="lg:col-span-1 xl:col-span-2 rounded-2xl border p-4 sm:p-6"
        style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
      >
        <div className="flex items-center justify-between mb-4 sm:mb-5">
          <div className="flex items-center gap-2">
            <Users size={14} style={{ color: 'var(--primary)' }} />
            <span className="text-xs uppercase tracking-widest font-medium" style={{ color: 'var(--muted-foreground)' }}>
              Participants Joined
            </span>
          </div>
          <div className="font-display text-2xl sm:text-3xl" style={{ color: 'var(--primary)' }}>
            {participants.length}
          </div>
        </div>

        {participants.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 sm:py-12">
            <Users size={32} className="mb-3" style={{ color: 'var(--muted-foreground)' }} />
            <p className="text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>Nobody has joined yet</p>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Audience members scan the QR code to appear here</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {participants.map(p => (
              <span
                key={`dash-participant-${p.id}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs sm:text-sm font-medium fade-in"
                style={{ backgroundColor: 'var(--muted)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
              >
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--green)' }} />
                {p.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}