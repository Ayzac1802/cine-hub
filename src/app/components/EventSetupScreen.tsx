'use client';
import React, { useState } from 'react';
import { Clapperboard, Lock, QrCode, ArrowRight, Sparkles } from 'lucide-react';

interface EventSetupScreenProps {
  onComplete: (config: { eventName: string; passcode: string; qrSize: number }) => void;
}

export default function EventSetupScreen({ onComplete }: EventSetupScreenProps) {
  const [eventName, setEventName] = useState('');
  const [passcode, setPasscode] = useState('');
  const [qrSize, setQrSize] = useState(200);
  const [nameError, setNameError] = useState(false);

  const handleStart = () => {
    if (!eventName.trim()) {
      setNameError(true);
      return;
    }
    onComplete({ eventName: eventName.trim(), passcode: passcode.trim(), qrSize });
  };

  const qrSizeOptions = [
    { label: 'Small', value: 160, desc: 'Compact display' },
    { label: 'Medium', value: 200, desc: 'Standard screen' },
    { label: 'Large', value: 260, desc: 'Projector / big screen' },
  ];

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <div className="w-full max-w-sm fade-in">
        {/* Icon */}
        <div className="text-center mb-6">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: 'rgba(245,179,1,0.15)', border: '1px solid rgba(245,179,1,0.3)' }}
          >
            <Clapperboard size={24} style={{ color: 'var(--primary)' }} />
          </div>
          <h1
            className="font-display text-2xl uppercase tracking-wider mb-1"
            style={{ color: 'var(--foreground)' }}
          >
            New Event
          </h1>
          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
            Set up your voting event before unlocking admin controls.
          </p>
        </div>

        <div
          className="rounded-2xl border p-5 space-y-4"
          style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
        >
          {/* Event Name */}
          <div>
            <label
              className="block text-xs uppercase tracking-widest font-medium mb-1.5"
              style={{ color: 'var(--muted-foreground)' }}
              htmlFor="event-name-input"
            >
              Event Name <span style={{ color: 'var(--accent)' }}>*</span>
            </label>
            <input
              id="event-name-input"
              type="text"
              value={eventName}
              onChange={e => { setEventName(e.target.value); setNameError(false); }}
              onKeyDown={e => e.key === 'Enter' && handleStart()}
              placeholder="e.g. Friday Movie Night"
              className="w-full rounded-xl px-4 py-2.5 text-sm border outline-none focus:ring-1 transition-all-150"
              style={{
                backgroundColor: 'var(--muted)',
                color: 'var(--foreground)',
                borderColor: nameError ? 'var(--accent)' : 'var(--border-strong)',
              }}
              aria-invalid={nameError}
            />
            {nameError && (
              <p className="text-xs mt-1" style={{ color: 'var(--accent)' }}>
                Event name is required
              </p>
            )}
          </div>

          {/* QR Code Size */}
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <QrCode size={12} style={{ color: 'var(--muted-foreground)' }} />
              <label
                className="text-xs uppercase tracking-widest font-medium"
                style={{ color: 'var(--muted-foreground)' }}
              >
                QR Code Size
              </label>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {qrSizeOptions.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setQrSize(opt.value)}
                  className="rounded-xl border py-2.5 px-2 text-center transition-all-150 scale-press"
                  style={{
                    backgroundColor: qrSize === opt.value ? 'rgba(245,179,1,0.12)' : 'var(--muted)',
                    borderColor: qrSize === opt.value ? 'var(--primary)' : 'var(--border-strong)',
                    color: qrSize === opt.value ? 'var(--primary)' : 'var(--muted-foreground)',
                  }}
                >
                  <div className="text-xs font-semibold">{opt.label}</div>
                  <div className="text-xs opacity-70 mt-0.5" style={{ fontSize: '10px' }}>{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Optional Passcode */}
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <Lock size={12} style={{ color: 'var(--muted-foreground)' }} />
              <label
                className="text-xs uppercase tracking-widest font-medium"
                style={{ color: 'var(--muted-foreground)' }}
                htmlFor="event-passcode-input"
              >
                Voter Passcode <span className="normal-case" style={{ color: 'var(--muted-foreground)', fontSize: '10px' }}>(optional)</span>
              </label>
            </div>
            <input
              id="event-passcode-input"
              type="text"
              value={passcode}
              onChange={e => setPasscode(e.target.value)}
              placeholder="Leave blank for open access"
              className="w-full rounded-xl px-4 py-2.5 text-sm border outline-none focus:ring-1 transition-all-150"
              style={{
                backgroundColor: 'var(--muted)',
                color: 'var(--foreground)',
                borderColor: 'var(--border-strong)',
              }}
            />
            <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>
              If set, voters must enter this code to join.
            </p>
          </div>

          {/* Submit */}
          <button
            onClick={handleStart}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-display text-sm uppercase tracking-widest scale-press transition-all-150"
            style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
          >
            <Sparkles size={14} />
            Create Event
            <ArrowRight size={14} />
          </button>
        </div>

        <p className="text-xs text-center mt-4" style={{ color: 'var(--muted-foreground)' }}>
          You can manage multiple events by refreshing and creating a new one.
        </p>
      </div>
    </div>
  );
}
