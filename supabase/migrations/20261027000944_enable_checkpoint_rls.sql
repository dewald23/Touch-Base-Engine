-- Enable Row Level Security (RLS) on LangGraph PostgresSaver checkpoint tables
alter table if exists checkpoints enable row level security;
alter table if exists checkpoint_blobs enable row level security;
alter table if exists checkpoint_writes enable row level security;
alter table if exists checkpoint_migrations enable row level security;

