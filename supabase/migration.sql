

create table if not exists public.prompts (
  id bigserial primary key,
  content text not null check (char_length(content) > 0),
  created_at timestamptz default now() not null
);

-- Row Level Security (RLS) aktif et
alter table public.prompts enable row level security;

-- Sadece service_role key ile erişim (backend üzerinden)
-- Anon key ile direkt erişim kapalı
create policy "Service role full access"
  on public.prompts
  for all
  using (auth.role() = 'service_role');
