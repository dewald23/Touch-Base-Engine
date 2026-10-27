-- 1. Enable the pgvector extension for vector similarity search
create extension if not exists vector;

-- 2. Create the agency knowledge embeddings vector store table
create table if not exists agency_knowledge_embeddings (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  metadata jsonb default '{}'::jsonb,
  embedding vector(1536), -- 1536 dimensions for Gemini / OpenAI embedding models
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Compatibility view for agency_knowledge
create or replace view agency_knowledge as
select id, title, content, metadata, embedding, created_at
from agency_knowledge_embeddings;

-- 4. Create an HNSW index for approximate nearest neighbor vector search
create index if not exists agency_knowledge_embeddings_hnsw_idx 
on agency_knowledge_embeddings 
using hnsw (embedding vector_cosine_ops);

-- 5. Create the match_agency_knowledge RPC function
create or replace function match_agency_knowledge (
  query_embedding vector(1536),
  match_threshold double precision default 0.5,
  match_count integer default 5
)
returns table (
  id uuid,
  title text,
  content text,
  metadata jsonb,
  similarity double precision
)
language plpgsql
as $$
begin
  return query
  select
    agency_knowledge_embeddings.id,
    agency_knowledge_embeddings.title,
    agency_knowledge_embeddings.content,
    agency_knowledge_embeddings.metadata,
    1 - (agency_knowledge_embeddings.embedding <=> query_embedding) as similarity
  from agency_knowledge_embeddings
  where 1 - (agency_knowledge_embeddings.embedding <=> query_embedding) > match_threshold
  order by agency_knowledge_embeddings.embedding <=> query_embedding asc
  limit match_count;
end;
$$;
