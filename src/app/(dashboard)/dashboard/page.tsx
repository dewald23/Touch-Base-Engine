"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Activity, Cpu, ShieldCheck, Database, Layers, ArrowUpRight, Zap, RefreshCw } from "lucide-react";

export default function FleetDashboardPage() {
  const [timestamp, setTimestamp] = useState<string>("");

  useEffect(() => {
    setTimestamp(new Date().toLocaleTimeString());
  }, []);

  const fleetNodes = [
    { name: "BrandStrategist", role: "Briefing & Semantic RAG", status: "ONLINE", latency: "142ms", sector: "Sector 01" },
    { name: "GrowthHacker", role: "Local SEO & Competitor SERP", status: "ONLINE", latency: "185ms", sector: "Sector 02" },
    { name: "Architect", role: "Zero-Disk Git Tree Synthesis", status: "ONLINE", latency: "210ms", sector: "Sector 03" },
    { name: "Auditor", role: "Cryptographic SHA-256 Hashing", status: "ONLINE", latency: "15ms", sector: "Sector 04" },
    { name: "HitlGate", role: "Human-in-the-Loop Barrier", status: "INTERCEPT READY", latency: "1ms", sector: "Sector 05" }
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Fleet Operations & Node Telemetry</h2>
          <p className="text-sm text-slate-400 font-mono mt-1">Sovereign-Nexus V9.0 • Active Cluster Runtime</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/campaigns"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/10"
          >
            <span>Open Campaign Boards</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-3">
            <span>QUEUE STATUS</span>
            <Zap className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-white">BullMQ Active</p>
          <p className="text-xs text-slate-400 mt-1 font-mono">Upstash Redis Cluster</p>
        </div>

        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-3">
            <span>STATE VAULT</span>
            <Database className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-bold text-white">PostgresSaver</p>
          <p className="text-xs text-slate-400 mt-1 font-mono">Supabase Direct Pooler</p>
        </div>

        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-3">
            <span>MEMORY MATRIX</span>
            <Cpu className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-white">pgvector 1536</p>
          <p className="text-xs text-slate-400 mt-1 font-mono">Gemini embedding-001</p>
        </div>

        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-3">
            <span>GOVERNANCE GATE</span>
            <ShieldCheck className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-white">HITL Enabled</p>
          <p className="text-xs text-slate-400 mt-1 font-mono">HMAC SHA-256 Verified</p>
        </div>
      </div>

      {/* Fleet Nodes Grid */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
        <h3 className="text-base font-bold text-white mb-4 flex items-center justify-between">
          <span>Synthetic Hero Node Matrix</span>
          <span className="text-xs font-mono text-emerald-400">All 5 Sectors Initialized</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 pb-2">
                <th className="py-3 px-4">SECTOR</th>
                <th className="py-3 px-4">NODE IDENTITY</th>
                <th className="py-3 px-4">MISSION SCOPE</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4">LATENCY</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {fleetNodes.map((node, i) => (
                <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4 text-slate-400">{node.sector}</td>
                  <td className="py-3 px-4 text-white font-bold">{node.name}</td>
                  <td className="py-3 px-4 text-slate-300 font-sans text-xs">{node.role}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      {node.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400">{node.latency}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

