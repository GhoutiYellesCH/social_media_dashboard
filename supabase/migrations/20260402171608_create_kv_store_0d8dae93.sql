create table if not exists public.kv_store_0d8dae93 (
	key text primary key,
	value jsonb not null
);

alter table public.kv_store_0d8dae93 replica identity full;

create index if not exists idx_kv_store_0d8dae93_key_prefix
	on public.kv_store_0d8dae93 (key);
