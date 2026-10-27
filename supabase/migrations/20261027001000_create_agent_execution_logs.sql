-- Create agent_execution_logs table for multi-agent execution logging and audit
create table if not exists agent_execution_logs (
  id uuid primary key default gen_random_uuid(),
  thread_id text not null,
  query text not null,
  output text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_agent_execution_logs_thread_id on agent_execution_logs(thread_id);

alter table if exists agent_execution_logs enable row level security;

