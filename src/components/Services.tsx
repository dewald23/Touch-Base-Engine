"use client";

import React from "react";
import { Layout, Globe2, Cpu, Workflow, Check, Sparkles, Layers, ArrowUpRight } from "lucide-react";

export function Services() {
  const services = [
    {
      icon: Layout,
      title: "Bespoke Web Application Development",
      description: "Engineered from the ground up on modern Next.js and React. Flawless responsive design, lightning-fast Core Web Vitals, and conversion-optimized sales funnels.",
      features: [
        "Sub-second load times with static & dynamic caching",
        "Tailwind CSS custom design systems & mobile perfection",
        "E-Commerce, booking engines & client portals",
        "Zero-compromise accessibility & security"
      ],
      badge: "Core Architecture"
    },
    {
      icon: Globe2,
      title: "Local & Regional SEO Domination",
      description: "Capture high-intent searches in Hermanus, the Overberg, Cape Town, and nationally. Structured data, local pack optimization, and high-converting keyword mapping.",
      features: [
        "Google Business Profile (GBP) optimization & rank tracking",
        "Localized landing pages with rich schema markup (JSON-LD)",
        "Competitor gap analysis & intent-driven keyword clusters",
        "High-authority regional citation architecture"
      ],
      badge: "Organic Growth"
    },
    {
      icon: Cpu,
      title: "TBC Nexus Autonomous AI Agents",
      description: "Harness our multi-agent LangGraph engine to automatically generate campaign copy, conduct real-time SEO audits, and draft UI component plans in seconds.",
      features: [
        "Autonomous Brand Strategist & Growth Hacker nodes",
        "Gemini 3.5 & text-embedding vector models",
        "pgvector semantic memory for institutional knowledge",
        "Cryptographic state hashing & human approval gate"
      ],
      badge: "Proprietary Tech"
    },
    {
      icon: Workflow,
      title: "Workflow Automation & Lead Routing",
      description: "Automate your sales pipeline from inbound click to booked call. Instant notifications, CRM synchronization, and event-driven BullMQ background jobs.",
      features: [
        "HMAC-secured inbound webhook architecture",
        "Real-time Server-Sent Events (SSE) telemetry feeds",
        "Automated client notifications via Resend",
        "Upstash Redis queues with 99.99% fault tolerance"
      ],
      badge: "Operations"
    }
  ];

  return (
    <section id="services" className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono text-cyan-300 mb-4">
            <Layers className="w-3.5 h-3.5" />
            <span>SOLUTIONS & EXPERTISE</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight mb-4">
            High-Performance Digital Presence. <br />
            <span className="text-gradient">Engineered to Convert.</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Whether launching a luxury hospitality brand in Hermanus or automating a nationwide service business, we build the digital foundation your company needs to scale.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="glass-panel glass-panel-hover rounded-2xl p-8 sm:p-10 flex flex-col justify-between relative group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700/80 flex items-center justify-center text-emerald-400 group-hover:scale-110 group-hover:border-emerald-500/50 transition-all">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-mono px-3 py-1 rounded-full bg-slate-800/80 text-slate-300 border border-slate-700">
                      {s.badge}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-3 flex items-center justify-between">
                    {s.title}
                  </h3>
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 font-normal">
                    {s.description}
                  </p>

                  <ul className="space-y-3 mb-8">
                    {s.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5 text-sm text-slate-300">
                        <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>TOUCH BASE CONSULTING</span>
                  <a href="#audit" className="text-emerald-400 hover:text-emerald-300 font-medium inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Inquire Now <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

