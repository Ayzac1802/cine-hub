import { INITIAL_EVENT_STATE, type EventState } from '@/lib/eventStore';
import { supabase } from '@/lib/supabase';

const SESSION_ID = process.env.NEXT_PUBLIC_EVENT_SESSION_ID || 'default-event-session';

function normalizeEvent(payload?: Partial<EventState> | null): EventState {
  if (!payload) return INITIAL_EVENT_STATE;

  return {
    ...INITIAL_EVENT_STATE,
    ...payload,
    nodes: payload.nodes ?? INITIAL_EVENT_STATE.nodes,
    participants: payload.participants ?? INITIAL_EVENT_STATE.participants,
    winnerPath: payload.winnerPath ?? INITIAL_EVENT_STATE.winnerPath,
    currentParentId: payload.currentParentId ?? INITIAL_EVENT_STATE.currentParentId,
    phase: payload.phase ?? INITIAL_EVENT_STATE.phase,
  };
}

export async function loadLiveEvent(): Promise<EventState> {
  if (!supabase) return INITIAL_EVENT_STATE;

  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', SESSION_ID)
    .maybeSingle();

  if (error && error.code !== 'PGRST116') {
    console.error('Failed to load live event', error);
    return INITIAL_EVENT_STATE;
  }

  if (data?.payload) {
    return normalizeEvent(data.payload as Partial<EventState>);
  }

  const seed = normalizeEvent(INITIAL_EVENT_STATE);
  const { error: upsertError } = await supabase
    .from('events')
    .upsert({ id: SESSION_ID, payload: seed, updated_at: new Date().toISOString() }, { onConflict: 'id' });

  if (upsertError) {
    console.error('Failed to seed live event', upsertError);
  }

  return seed;
}

export async function saveLiveEvent(event: EventState): Promise<void> {
  if (!supabase) return;

  const { error } = await supabase
    .from('events')
    .upsert({
      id: SESSION_ID,
      payload: event,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'id' });

  if (error) {
    console.error('Failed to save live event', error);
  }
}

export function subscribeToLiveEvent(onChange: (event: EventState) => void): () => void {
  if (!supabase) return () => {};

  const channel = supabase
    .channel(`event:${SESSION_ID}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'events',
        filter: `id=eq.${SESSION_ID}`,
      },
      (payload) => {
        const next = normalizeEvent((payload.new ?? payload.old)?.payload as Partial<EventState> | undefined);
        onChange(next);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
