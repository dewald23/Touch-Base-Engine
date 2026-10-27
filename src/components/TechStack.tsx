"use client";

import React from "react";
import { Layers, Database, Cpu, Zap, Shield, Mail, Server, Code } from "lucide-react";

export function TechStack() {
  const stack = [
    {
      name: "Next.js 16 + React 19",
      role: "App Router & Turbopack",
      description: "Static and dynamic hybrid rendering delivering sub-second initial server responses and instant client navigation.",
      icon: Code,
      badge: "Core Framework"
    },
    {
      name: "LangGraph Multi-Agent OS",
      role: "Autonomous StateGraph",
      description: "Stateful agent execution with PostgresSaver persistent checkpointing and human-in-the-loop interruption gates.",
      icon: Cpu,
      badge: "Orchestration"
    },
    {
      name: "Supabase pgvector",
      role: "1536-dim Vector Store",
      description: "Hardware-accelerated HNSW cosine indexing for rapid brand knowledge recall and real-time semantic retrieval.",
      icon: Database,
      badge: "Vector Database"
    },
    {
      name: "Upstash Redis",
      role: "BullMQ & Event Streams",
      description: "Low-latency distributed message queues and replayable telemetry streams for real-time campaign execution.",
      icon: Zap,
      badge: "Queues & Streams"
    },
    {
      name: "Google Gemini AI",
      role: "Multi-Modal Intelligence",
      description: "Gemini 3.5 Flash and Gemini Embedding models generating high-converting copy and comprehensive SEO strategies.",
      icon: Layers,
      badge: "LLM & Embeddings"
    },
    {
      name: "Resend & Webhooks",
      role: "Transactional Delivery",
      description: "HMAC-secured perimeter ingress with automated multi-channel client dispatch and transactional email alerts.",
      icon: Mail,
      badge: "Messaging"
    }
  ];

  return (
    <section id="technology" className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-mono text-blue-300 mb-4">
            <Server className="w-3.5 h-3.5" />
            <span>ENTERPRISE-GRADE STACK</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight mb-4">
            Built on Battle-Tested <br />
            <span className="text-gradient">Modern Infrastructure</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            No fragile WordPress plugins. No sluggish template bloat. We build on the exact same high-concurrency cloud stack used by world-class software engineering teams.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stack.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="glass-panel glass-panel-hover rounded-xl p-6 border border-slate-800 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-700/80 flex items-center justify-center text-cyan-400">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-1">{item.name}</h3>
                  <p className="text-xs font-mono text-emerald-400 mb-3">{item.role}</p>
                  <p className="text-slate-300 text-sm leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

