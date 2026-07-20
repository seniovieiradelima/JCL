-- Execute este script no Supabase: Project > SQL Editor > New query > colar e rodar (Run)

create table if not exists sgm_storage (
  key text primary key,
  value jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

alter table sgm_storage enable row level security;

-- Qualquer usuário autenticado (login da equipe) pode ler e escrever
create policy "authenticated read" on sgm_storage
  for select using (auth.role() = 'authenticated');

create policy "authenticated write" on sgm_storage
  for insert with check (auth.role() = 'authenticated');

create policy "authenticated update" on sgm_storage
  for update using (auth.role() = 'authenticated');

-- Garante que updated_at é atualizado automaticamente
create or replace function sgm_set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger sgm_storage_updated_at
  before update on sgm_storage
  for each row execute function sgm_set_updated_at();
