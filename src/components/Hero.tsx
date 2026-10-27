"use client";

import React from "react";
import { ArrowRight, Sparkles, CheckCircle2, Shield, Zap, Search, Database } from "lucide-react";

export function Hero() {
  return (
    <section className="relative pt-36 pb-20 md:pt-44 md:pb-28 overflow-hidden">
      {/* Background glow effects */}
      <div className="radial-glow top-1/4 -left-48" />
      <div className="radial-glow top-1/3 -right-48" style={{ background: "radial-gradient(circle, rgba(6, 182, 212, 0.12) 0%, transparent 70%)" }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full glass-panel border border-emerald-500/30 text-xs md:text-sm font-medium text-emerald-300 mb-8 shadow-inner shadow-emerald-500/10">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Hermanus & Western Cape’s Next-Gen Digital Architecture Studio</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1] mb-6">
            Bespoke Web Platforms. <br className="hidden sm:inline" />
            <span className="text-gradient">Autonomous AI Execution.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            Touch Base Consulting crafts ultra-fast web applications, dominant local SEO foundations, and automated multi-agent operational workflows powered by our proprietary <strong className="text-emerald-400 font-semibold">TBC Nexus OS</strong>.
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <a
              href="#audit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-base font-semibold text-slate-950 bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 shadow-xl shadow-emerald-500/25 transition-all hover:scale-105"
            >
              Request Free Growth Audit
              <ArrowRight className="w-5 h-5" />
            </a>

            <a
              href="#nexus-engine"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-base font-medium text-slate-200 glass-panel hover:bg-slate-800/60 border border-slate-700/80 transition-all hover:border-slate-500"
            >
              Explore TBC Nexus Engine
            </a>
          </div>

          {/* Value Props Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-6 border-t border-slate-800/80">
            <div className="flex items-center gap-3 justify-center text-left py-2">
              <Zap className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <div>
                <p className="text-xs text-slate-400">Page Experience</p>
                <p className="text-sm font-semibold text-white">99+ Google Lighthouse</p>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-center text-left py-2">
              <Search className="w-5 h-5 text-cyan-400 flex-shrink-0" />
              <div>
                <p className="text-xs text-slate-400">Search Strategy</p>
                <p className="text-sm font-semibold text-white">Local 3-Pack Dominance</p>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-center text-left py-2">
              <Database className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <div>
                <p className="text-xs text-slate-400">AI Architecture</p>
                <p className="text-sm font-semibold text-white">pgvector Semantic Memory</p>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-center text-left py-2">
              <Shield className="w-5 h-5 text-cyan-400 flex-shrink-0" />
              <div>
                <p className="text-xs text-slate-400">Governance</p>
                <p className="text-sm font-semibold text-white">Cryptographic HITL Gate</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

