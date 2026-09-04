create table if not exists public.events (
  id text primary key,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create index if not exists events_updated_at_idx on public.events (updated_at desc);

alter table public.events enable row level security;

create policy "Allow public read access" on public.events
  for select using (true);

create policy "Allow public insert access" on public.events
  for insert with check (true);

create policy "Allow public update access" on public.events
  for update using (true) with check (true);

create policy "Allow public delete access" on public.events
  for delete using (true);
