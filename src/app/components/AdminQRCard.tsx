'use client';
import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { QrCode, Copy, Check, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminQRCard() {
  const [copied, setCopied] = useState(false);
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSigned = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/qr', { method: 'POST' });
      if (!res.ok) throw new Error('Failed to create signed link');
      const data = await res.json();
      setSignedUrl(data.url || null);
    } catch (err) {
      setError('Could not generate signed link — falling back to public link');
      setSignedUrl(typeof window !== 'undefined' ? `${window.location.origin}/voter-screen` : 'https://cinehub.app/voter-screen');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => { fetchSigned(); }, []);

  const displayUrl = signedUrl || (typeof window !== 'undefined' ? `${window.location.origin}/voter-screen` : 'https://cinehub.app/voter-screen');
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    if (!displayUrl) {
      setQrDataUrl(null);
      return;
    }
    QRCode.toDataURL(displayUrl, { margin: 1, color: { dark: '#F4F2EC', light: '#171B31' } })
      .then((dataUrl) => {
        if (mounted) setQrDataUrl(dataUrl);
      })
      .catch(() => {
        if (mounted) setQrDataUrl(null);
      });
    return () => { mounted = false; };
  }, [displayUrl]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(displayUrl);
      setCopied(true);
      toast.success('Voter link copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Could not copy — please copy the link manually');
    }
  };

  return (
    <div className="rounded-2xl border p-4 sm:p-6" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
      <div className="flex items-center gap-2 mb-4">
        <QrCode size={14} style={{ color: 'var(--muted-foreground)' }} />
        <span className="text-xs uppercase tracking-widest font-medium" style={{ color: 'var(--muted-foreground)' }}>
          Voter QR Code
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
        <div className="rounded-2xl p-3 sm:p-4 flex-shrink-0" style={{ backgroundColor: 'var(--secondary)' }}>
          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              width={140}
              height={140}
              alt="QR code linking to the voter screen for this event"
              className="rounded-lg block"
              style={{ width: 'clamp(120px, 30vw, 160px)', height: 'auto' }}
            />
          ) : (
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&color=F4F2EC&bgcolor=171B31&data=${encodeURIComponent(displayUrl)}`}
              width={140}
              height={140}
              alt="QR code linking to the voter screen for this event"
              className="rounded-lg block"
              style={{ width: 'clamp(120px, 30vw, 160px)', height: 'auto' }}
            />
          )}
        </div>

        <div className="flex-1 min-w-0 text-center sm:text-left w-full">
          <p className="text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
            Share with your audience
          </p>
          <p className="text-xs mb-3" style={{ color: 'var(--muted-foreground)' }}>
            Voters scan this QR code or visit the link to join and cast their picks.
          </p>

          <div
            className="flex items-center gap-2 px-3 py-2 rounded-xl border mb-3 font-mono-data text-xs overflow-hidden"
            style={{ backgroundColor: 'var(--muted)', borderColor: 'var(--border-strong)', color: 'var(--muted-foreground)' }}
          >
            <span className="truncate">{displayUrl}</span>
          </div>

          <div className="flex gap-2 justify-center sm:justify-start flex-wrap">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs sm:text-sm font-medium scale-press transition-all-150 hover:bg-muted"
              style={{ borderColor: 'var(--border-strong)', color: copied ? 'var(--green)' : 'var(--muted-foreground)' }}
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
            <a
              href={displayUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs sm:text-sm font-medium scale-press transition-all-150 hover:bg-muted"
              style={{ borderColor: 'var(--border-strong)', color: 'var(--muted-foreground)' }}
            >
              <ExternalLink size={12} />
              Open Voter Screen
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}