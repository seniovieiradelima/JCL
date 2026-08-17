-- MIGRAÇÃO: execute este script no Supabase (SQL Editor > New query > colar e rodar)
-- Ele cria uma tabela NOVA (sgm_records) sem apagar a tabela antiga (sgm_storage) — nada é perdido.

create table if not exists sgm_records (
  collection text not null,
  id text not null,
  data jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (collection, id)
);

alter table sgm_records enable row level security;

create policy "authenticated read records" on sgm_records
  for select using (auth.role() = 'authenticated');

create policy "authenticated insert records" on sgm_records
  for insert with check (auth.role() = 'authenticated');

create policy "authenticated update records" on sgm_records
  for update using (auth.role() = 'authenticated');

create policy "authenticated delete records" on sgm_records
  for delete using (auth.role() = 'authenticated');

create or replace function sgm_records_set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger sgm_records_updated_at
  before update on sgm_records
  for each row execute function sgm_records_set_updated_at();

-- Índice pra buscar rápido por coleção (estoque, vendas, clientes, etc.)
create index if not exists sgm_records_collection_idx on sgm_records (collection);
