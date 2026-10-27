# Touch-Base Agency OS — Sovereign-Nexus Engine V9.0

**Sovereign-Nexus Engine V9.0** is an autonomous agency runtime built for localized SEO intelligence, high-throughput digital marketing workflows, zero-disk code synthesis, and human-in-the-loop (HITL) compliance validation.

The system combines **Next.js 15 API Gateways & Protected Client Portals**, **LangGraph multi-agent state machines**, **BullMQ + Upstash Redis queue orchestration**, **Supabase PostgreSQL + pgvector checkpointing and semantic memory**, and **Model Context Protocol (MCP)** tool servers powered by the **Google Gemini API (`@google/genai`)**.

---

## Architecture Overview

```text
[ Incoming Webhook / Client Event ]
                 │
                 ▼
┌──────────────────────────────┐
│    Vercel Edge / API Gateway │
│      (/api/ingest - HTTP 202)│
└──────────────┬───────────────┘
               │
Enqueue Task   │ Writes Audit Record
(BullMQ)       │
               │              ▼
               │     ┌────────────────────────┐
               │     │  Supabase PostgreSQL   │
               │     │   (idempotency_records)│
               ▼     └────────────────────────┘
┌─────────────────────────────────┐
│    Upstash Redis Queue Cluster  │
└────────────────┬────────────────┘
                 │
                 │ Job Dequeue
                 ▼
┌─────────────────────────────────┐
│    Long-Running BullMQ Worker   │
│       (src/queue/worker.ts)     │
└────────────────┬────────────────┘
                 │
                 ▼
┌─────────────────────────────────┐
│     LangGraph State Machine     │
│  (Checkpointed via Postgres)    │
└────────────────┬────────────────┘
                 │
  ┌──────────────┴────┬─────────────────────┬───────────────────┐
  ▼                   ▼                     ▼                   ▼
┌─────────────┐   ┌─────────────┐       ┌─────────────┐     ┌─────────────┐
│ 1. Brand    │──▶│ 2. Growth   │──────▶│ 3. Architect│────▶│ 4. Auditor  │
│  Strategist │   │   Hacker    │       │  (Git Tree) │     │  (SHA-256)  │
└─────────────┘   └─────────────┘       └─────────────┘     └──────┬──────┘
                                                                   │
                                                                   ▼
                                                            ┌─────────────┐
                                                            │ 5. HITL Gate│ ──▶ [ State Interrupted ]
                                                            └──────┬──────┘
                                                                   │
Manual Approval                                                    │
POST /api/approve                                                  ▼
────────────────────────────────────────────────────────────▶ Resume Execution
```

---

## The 5 Synthetic Node Pillars

1. **Brand Strategist (`src/graph/nodes/brandStrategist.ts`)**:
   - Ingests incoming task directives and retrieves semantic client history using `pgvector` embeddings via `supabaseServer`.
   - Generates brand-aligned content strategies, value propositions, and tone guidelines.

2. **Growth Hacker (`src/graph/nodes/growthHacker.ts`)**:
   - Performs competitive analysis and localized SEO query discovery.
   - Generates keyword targeting strategies, search intent clusters, and conversion triggers.

3. **Architect (`src/graph/nodes/architect.ts`)**:
   - Operates zero-disk Git tree synthesis using `githubServer`.
   - Builds production-ready React/TypeScript landing assets, structured schemas, and deployment configurations directly via the GitHub Git Data API without local disk I/O.

4. **Auditor (`src/graph/nodes/auditor.ts`)**:
   - Validates code compliance, checks brand safety constraints, and computes a deterministic SHA-256 cryptographic state hash of the generated payload.
   - Formulates the state bundle for non-repudiation logging.

5. **Human-in-the-Loop Gate (`src/graph/nodes/hitl.ts`)**:
   - Triggers a LangGraph `interrupt()` barrier.
   - Commits state to Supabase `checkpoints` and sends transactional review alerts via Resend.
   - Execution is resumed via signed approval requests to `/api/approve`.

---

## Infrastructure & Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | Next.js 15 (App Router, TypeScript) | API Gateways, Telemetry Endpoints, Protected Client Portal |
| **State Engine** | LangGraph (`@langchain/langgraph`) | Multi-agent state machine, interrupts, and checkpointing |
| **Queue & Cache** | BullMQ + Upstash Redis | Distributed task queueing and atomic Lua locking |
| **Database** | Supabase Postgres (`eu-north-1`) | State checkpoints, `pgvector` embeddings, and audit logs |
| **LLM Engine** | Google Gemini API (`@google/genai`) | Model inference for hero synthesis nodes |
| **Notifications** | Resend | Transactional HITL review alerts |
| **Deployment** | Vercel (Gateways) / Render (Node Worker) | Low-latency API gateways and persistent background runner |

---

## Directory Structure

```text
touch-base-engine/
├── .github/
│   └── workflows/
│       ├── ci.yml                    # 🎯 Quality Bureau: Automated CI/CD checks
│       └── deploy-worker.yml         # 🚀 Barracks: CI/CD pipeline to Render
├── src/
│   ├── app/
│   │   ├── (dashboard)/              # 🔐 Protected Client Portal (Private Administrative Routes)
│   │   │   ├── layout.tsx            # Global state monitoring wrapper & workspace contexts
│   │   │   ├── dashboard/page.tsx    # Main operations dashboard displaying real-time fleet telemetry
│   │   │   └── campaigns/page.tsx    # Live state, asset creation boards, and logs per campaign
│   │   ├── api/
│   │   │   ├── ingest/route.ts       # 📡 Radio Tower: Non-blocking webhook ingestion (202 Accepted)
│   │   │   ├── approve/route.ts      # 🛑 HITL Hook: Human-in-the-Loop decision & graph resumption
│   │   │   ├── streaming/route.ts    # 🔍 Investigation Rooms: Timeline replay & telemetry cursor stream
│   │   │   └── agents/run/route.ts   # ⚡ Direct Multi-Agent Orchestration Gateway
│   │   └── layout.tsx                # Root theme and authorization shells
│   ├── components/                   # 🎨 Studio UI Assets
│   │   └── dashboard/
│   │       └── HitlApprovalCard.tsx  # Client HITL component with state hash verification
│   ├── graph/                        # 🧠 Multi-Agent Orchestration Matrix
│   │   ├── index.ts                  # The Core: Master LangGraph workflow compilation & edges
│   │   ├── state.ts                  # 🏰 Chief's Room: Reference-based campaign state annotations & types
│   │   ├── checkpointer.ts           # 💾 State Vault: PostgresSaver wrapper (Supavisor pooler integration)
│   │   └── nodes/                    # Specialized Runtime Node Frameworks
│   │       ├── brandStrategist.ts    # Pillar 1: Briefing, RAG memory retrieval & voice
│   │       ├── growthHacker.ts       # Pillar 2: Competitive research & SERP analysis
│   │       ├── architect.ts          # Pillar 3: Git-tree synthesis & micro-page landing assets
│   │       ├── auditor.ts            # Pillar 4: Cryptographic state SHA-256 hash & guardrails
│   │       └── hitl.ts               # Pillar 5: HITL interrupt pause barrier
│   ├── hooks/
│   │   └── useCampaignStream.ts      # Client Supabase realtime broadcast telemetry hook
│   ├── lib/                          # ⚙️ Infrastructure & Connection Adapters
│   │   ├── redis.ts                  # Upstash Redis / ioredis connection client
│   │   ├── resend.ts                 # Transactional email notification triggers
│   │   ├── schemas.ts                # HMAC constant-time validation & strict Zod schemas
│   │   ├── supabase.ts               # Supabase server & client service instances
│   │   └── telemetryStream.ts        # Broadcast state emitter & audit event logger
│   ├── mcp/                          # 🔌 Model Context Protocol (MCP) Infrastructure
│   │   ├── client.ts                 # Bulkhead circuit breakers & role-scoped gates
│   │   ├── redisCircuitBreaker.ts    # Distributed Redis Lua circuit breaker synchronization
│   │   └── servers/
│   │       ├── githubServer.ts       # Zero-disk GitHub Git tree, commit & PR integration
│   │       └── supabaseServer.ts     # Semantic retrieval & pgvector embeddings query tool
│   └── queue/                        # ⚔️ Barracks Execution Core
│       ├── jobs.ts                   # BullMQ job payload signatures & queue definitions
│       └── worker.ts                 # Persistent worker daemon with auto-recovery
├── .env.example
├── .gitignore
├── next.config.js
├── package.json
├── README.md
├── render.yaml
├── tsconfig.json
└── vercel.json
```

---

## Getting Started

### 1. Prerequisites
- **Node.js** `>= 20.x`
- **Supabase Project** (`eu-north-1` recommended) with the `vector` extension enabled
- **Upstash Redis** instance (TLS enabled)
- **Google Gemini API Key** (`@google/genai`)
- **GitHub Personal Access Token / App** (with `repo` and `contents:write` permissions for zero-disk synthesis)
- **Resend API Key** for transactional HITL alerts

### 2. Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/your-org/touch-base-engine.git
cd touch-base-engine
npm install
```

### 3. Environment Configuration

Copy the `.env.example` file to `.env.local` and configure the required credentials:

```bash
cp .env.example .env.local
```

### 4. Database Setup

Run the following SQL initialization in your Supabase SQL Editor to enable semantic memory and idempotency tracking:

```sql
-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Idempotency records table for /api/ingest
CREATE TABLE IF NOT EXISTS public.idempotency_records (
  idempotency_key UUID PRIMARY KEY,
  campaign_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Client semantic memory table
CREATE TABLE IF NOT EXISTS public.brand_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id TEXT NOT NULL,
  content TEXT NOT NULL,
  embedding VECTOR(1536),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

> **Note:** LangGraph's `PostgresSaver` (`src/graph/checkpointer.ts`) automatically provisions the checkpoint tables when `await checkpointer.setup()` runs on worker startup.

### 5. Running Locally

Start both the Next.js gateway server and the persistent BullMQ background worker in separate terminal sessions:

```bash
# Terminal 1: Start the Next.js App Router, Protected Dashboard & API Gateways
npm run dev

# Terminal 2: Start the Barracks BullMQ Worker Daemon
npm run worker:dev
```

---

## API Gateways & Client Portal

### 1. Radio Tower: Ingest Campaign Task (`POST /api/ingest`)
Non-blocking webhook receiver. Validates the constant-time HMAC signature, writes an idempotency record to Supabase, enqueues the job in BullMQ, and immediately returns `HTTP 202 Accepted`.

### 2. HITL Hook: Approve / Resume Graph (`POST /api/approve`)
Verifies the operator's HMAC signature and cryptographic state hash (`SHA-256`) before resuming execution on the checkpointed thread.

### 3. Direct Multi-Agent Orchestration (`POST /api/agents/run`)
Direct synchronous execution gateway for real-time SEO, content strategy, and architectural audit outputs persisted to `agent_execution_logs`.

### 4. Investigation Rooms: Telemetry Stream (`GET /api/streaming?campaignId=<id>`)
Provides timeline replay and cursor streaming for active campaign threads, complementing the client-side hook (`useCampaignStream.ts`).

### 5. Protected Client Portal (`src/app/(dashboard)/`)
- **Operations Dashboard (`/dashboard`):** Displays real-time fleet telemetry across active worker nodes and queues.
- **Campaign Boards (`/campaigns`):** Renders live state transitions, generated asset previews, audit logs, and the interactive `HitlApprovalCard.tsx` component per campaign.

