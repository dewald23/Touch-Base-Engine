"use client";

import React, { useState } from "react";
import { HitlApprovalCard } from "@/components/dashboard/HitlApprovalCard";
import { useCampaignStream } from "@/hooks/useCampaignStream";
import { Layers, ShieldCheck, Activity, Terminal, RefreshCw, CheckCircle2, ArrowRight } from "lucide-react";

export default function CampaignsBoardPage() {
  const [threadId, setThreadId] = useState<string>("thread_demo_overberg");
  const [activeTab, setActiveTab] = useState<"artifacts" | "telemetry" | "approval">("approval");
  const { events, isConnected } = useCampaignStream(threadId);

  // Sample active campaign checkpoint state for demonstration
  const [campaignState, setCampaignState] = useState({
    threadId: "thread_demo_overberg",
    campaignId: "campaign_overberg_q4",
    currentSector: "HitlGate",
    requiresHitlApproval: true,
    stateHash: "c4a922e4fcc6148f5bc1aa51809cf284d40e042af2a757a0c3923d330bb726de",
    approverEmail: "lead-operator@touchbaseconsulting.co.za",
    brandCopySnippet: "# Walker Bay Luxury Whale Retreat\n\nExperience uncompromised luxury embedded in Hermanus' untamed coastline.",
    seoKeywords: ["luxury eco lodge hermanus", "walker bay whale watching accommodation", "western cape boutique wine tour"],
    architecturePlan: { component: "HermanusEcoRetreatLanding", filesCount: 6, theme: "emerald/slate" }
  });

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Campaign State & Asset Creation Boards</h2>
          <p className="text-sm text-slate-400 font-mono mt-1">Live Checkpointed Threads • LangGraph State Machine</p>
        </div>

        {/* Thread Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400">Thread:</span>
          <input
            type="text"
            value={threadId}
            onChange={(e) => setThreadId(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 font-mono text-xs text-white focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* State Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
          <p className="text-xs font-mono text-slate-400 mb-1">ACTIVE SECTOR</p>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <p className="text-xl font-bold text-amber-400">{campaignState.currentSector}</p>
          </div>
          <p className="text-xs text-slate-400 mt-2 font-mono">Status: Paused at HITL Gate</p>
        </div>

        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
          <p className="text-xs font-mono text-slate-400 mb-1">TELEMETRY STREAM</p>
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${isConnected ? "bg-emerald-400" : "bg-slate-500"}`} />
            <p className="text-xl font-bold text-white">{isConnected ? "Connected" : "Idle"}</p>
          </div>
          <p className="text-xs text-slate-400 mt-2 font-mono">{events.length} Live Stream Events</p>
        </div>

        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
          <p className="text-xs font-mono text-slate-400 mb-1">STATE INTEGRITY</p>
          <p className="text-xl font-bold text-emerald-400">Deterministic</p>
          <p className="text-[11px] text-slate-400 mt-2 font-mono truncate">SHA-256: {campaignState.stateHash.slice(0, 16)}...</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 font-mono text-xs">
        <button
          onClick={() => setActiveTab("approval")}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === "approval" ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" : "text-slate-400 hover:text-white"
          }`}
        >
          🛡️ HITL Security Sign-off
        </button>

        <button
          onClick={() => setActiveTab("artifacts")}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === "artifacts" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "text-slate-400 hover:text-white"
          }`}
        >
          📦 Generated Campaign Artifacts
        </button>

        <button
          onClick={() => setActiveTab("telemetry")}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === "telemetry" ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30" : "text-slate-400 hover:text-white"
          }`}
        >
          📡 Replayable Telemetry Matrix
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === "approval" && (
        <div className="space-y-6">
          <HitlApprovalCard
            threadId={campaignState.threadId}
            stateHash={campaignState.stateHash}
            approverEmail={campaignState.approverEmail}
            onDecided={(action) => {
              if (action === "approve") {
                setCampaignState((prev) => ({
                  ...prev,
                  currentSector: "Completed",
                  requiresHitlApproval: false
                }));
              }
            }}
          />
        </div>
      )}

      {activeTab === "artifacts" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 rounded-xl bg-slate-900 border border-slate-800">
            <h4 className="text-sm font-bold text-white mb-2 font-mono">brandCopy.md (Pillar 1)</h4>
            <div className="p-4 rounded-lg bg-slate-950 font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
              {campaignState.brandCopySnippet}
            </div>
          </div>

          <div className="p-6 rounded-xl bg-slate-900 border border-slate-800">
            <h4 className="text-sm font-bold text-white mb-2 font-mono">seoMap.json (Pillar 2)</h4>
            <pre className="p-4 rounded-lg bg-slate-950 font-mono text-xs text-emerald-300 overflow-x-auto">
              {JSON.stringify({ primaryKeywords: campaignState.seoKeywords }, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {activeTab === "telemetry" && (
        <div className="p-6 rounded-xl bg-slate-900 border border-slate-800">
          <h4 className="text-sm font-bold text-white mb-4 font-mono">Redis Telemetry Stream Replay</h4>
          {events.length === 0 ? (
            <p className="text-xs text-slate-400 font-mono">No live stream events recorded for this cursor.</p>
          ) : (
            <div className="space-y-2">
              {events.map((ev, i) => (
                <div key={i} className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono flex items-center justify-between">
                  <span className="text-emerald-400">{ev.sector}</span>
                  <span className="text-white">{ev.event}</span>
                  <span className="text-slate-400">{new Date(ev.timestamp).toLocaleTimeString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

