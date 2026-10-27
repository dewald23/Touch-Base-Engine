-- 1. Enable the pgvector extension for vector similarity search
create extension if not exists vector;

-- 2. Create the agency knowledge and agent memory vector store table
create table if not exists agency_knowledge (
  id uuid primary key default gen_random_uuid(),
  content text not null,
  metadata jsonb default '{}'::jsonb,
  embedding vector(768), -- Optimized for Gemini text-embedding models (768 dimensions)
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Create an HNSW index for ultra-fast approximate nearest neighbor vector search
create index if not exists agency_knowledge_embedding_hnsw_idx 
on agency_knowledge 
using hnsw (embedding vector_cosine_ops);

-- 4. Create an RPC function for semantic similarity matching
create or replace function match_agency_knowledge (
  query_embedding vector(768),
  match_threshold float default 0.75,
  match_count int default 5
)
returns table (
  id uuid,
  content text,
  metadata jsonb,
  similarity float
)
language sql stable
as $$
  select
    agency_knowledge.id,
    agency_knowledge.content,
    agency_knowledge.metadata,
    1 - (agency_knowledge.embedding <=> query_embedding) as similarity
  from agency_knowledge
  where 1 - (agency_knowledge.embedding <=> query_embedding) > match_threshold
  order by agency_knowledge.embedding <=> query_embedding asc
  limit match_count;
$$;

