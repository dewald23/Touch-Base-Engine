"use client";

import React from "react";
import Link from "next/link";
import { Terminal, Activity, Layers, ShieldCheck, Database, ArrowLeft } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900/80 border-b md:border-b-0 md:border-r border-slate-800 p-5 flex flex-col justify-between">
        <div>
          {/* Brand */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center">
              <Terminal className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
                TBC Nexus <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono">V9.0</span>
              </h1>
              <p className="text-[11px] text-slate-400 font-mono">AGENCY RUNTIME</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 font-mono text-xs">
            <Link
              href="/"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-slate-400" />
              <span>Back to Public Site</span>
            </Link>

            <Link
              href="/dashboard"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Fleet Operations</span>
            </Link>

            <Link
              href="/campaigns"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Campaign Threads & HITL</span>
            </Link>
          </nav>
        </div>

        {/* System Pill Footer */}
        <div className="pt-6 border-t border-slate-800/80 text-[11px] font-mono text-slate-400 space-y-2">
          <div className="flex items-center justify-between">
            <span>LangGraph Engine:</span>
            <span className="text-emerald-400 font-semibold">Active</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Checkpointer:</span>
            <span className="text-cyan-400">PostgresSaver</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Security Gate:</span>
            <span className="text-amber-400">HMAC-SHA256</span>
          </div>
        </div>
      </aside>

      {/* Main Administrative Content Area */}
      <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
        <header className="h-16 border-b border-slate-800 bg-slate-900/40 px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span>Sovereign-Nexus V9.0</span>
            <span>/</span>
            <span className="text-white">Protected Client Portal</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-[11px] font-mono text-emerald-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Node Fleet: 5 Sectors Online</span>
            </span>
          </div>
        </header>

        <main className="p-6 md:p-8 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
