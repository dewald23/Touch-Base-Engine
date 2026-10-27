-- 1. Idempotency records table for /api/ingest
create table if not exists public.idempotency_records (
  idempotency_key uuid primary key default gen_random_uuid(),
  campaign_id text not null,
  created_at timestamptz not null default now()
);

-- 2. Client semantic memory table (supports 768 and 1536 dim vectors)
create table if not exists public.brand_embeddings (
  id uuid primary key default gen_random_uuid(),
  client_id text not null,
  content text not null,
  embedding vector(1536),
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_brand_embeddings_client_id on public.brand_embeddings(client_id);

alter table if exists public.idempotency_records enable row level security;
alter table if exists public.brand_embeddings enable row level security;

