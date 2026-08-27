'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { User, ArrowRight, AlertCircle } from 'lucide-react';

interface VoterJoinFormProps {
  onJoin: (name: string) => void;
}

interface FormValues {
  name: string;
}

export default function VoterJoinForm({ onJoin }: VoterJoinFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  const onSubmit = (data: FormValues) => {
    onJoin(data.name);
  };

  return (
    <div className="fade-in">
      <div className="text-center mb-8">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{ backgroundColor: 'rgba(245,179,1,0.12)', border: '1px solid rgba(245,179,1,0.25)' }}
        >
          <User size={28} style={{ color: 'var(--primary)' }} />
        </div>
        <h1
          className="font-display text-3xl uppercase tracking-wide mb-2"
          style={{ color: 'var(--foreground)' }}
        >
          Join the Vote
        </h1>
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
          Enter your name so the host can see you&apos;ve joined. You&apos;ll vote once per round.
        </p>
      </div>

      <div
        className="rounded-2xl border p-6"
        style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
      >
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="mb-5">
            <label
              htmlFor="voter-name"
              className="block text-xs uppercase tracking-widest font-medium mb-2"
              style={{ color: 'var(--muted-foreground)' }}
            >
              Your Name
            </label>
            <p className="text-xs mb-3" style={{ color: 'var(--muted-foreground)' }}>
              This is how you&apos;ll appear on the host&apos;s admin panel and the big screen.
            </p>
            <input
              id="voter-name"
              type="text"
              autoComplete="given-name"
              placeholder="e.g. Maren, Theo, Yuki"
              className="w-full rounded-xl px-4 py-3 text-sm border outline-none focus:ring-1 transition-all-150"
              style={{
                backgroundColor: 'var(--muted)',
                color: 'var(--foreground)',
                borderColor: errors.name ? 'var(--accent)' : 'var(--border-strong)',
              }}
              {...register('name', {
                required: 'Enter a name to join the event',
                minLength: { value: 2, message: 'Name must be at least 2 characters' },
                maxLength: { value: 24, message: 'Name must be 24 characters or fewer' },
              })}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'name-error' : undefined}
            />
            {errors.name && (
              <p
                id="name-error"
                className="flex items-center gap-1.5 text-xs mt-2"
                style={{ color: 'var(--accent)' }}
              >
                <AlertCircle size={12} />
                {errors.name.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-display text-sm uppercase tracking-widest scale-press transition-all-150 disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
          >
            {isSubmitting ? (
              <span className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--primary-foreground)', borderTopColor: 'transparent' }} />
            ) : (
              <>
                Join the Event
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
