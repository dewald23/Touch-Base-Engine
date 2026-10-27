"use client";

import React, { useState } from "react";
import { Sparkles, Terminal, ShieldCheck, CheckCircle2, ChevronRight, Cpu, ArrowRight, Lock, Database, Code2 } from "lucide-react";

export function NexusShowcase() {
  const [activeTab, setActiveTab] = useState(0);

  const nodes = [
    {
      id: "BrandStrategist",
      role: "Brand Strategist Hero",
      status: "Verified",
      icon: Sparkles,
      color: "from-emerald-400 to-teal-500",
      summary: "Autonomous creative positioning, messaging architecture & value proposition generation.",
      sampleOutput: {
        headline: "Unwind in Untamed Luxury: Hermanus Cool-Climate Retreat",
        uvp: "South Africa's premier eco-conscious wine sanctuary blending biodiversity conservation with 5-star ocean-view wellness.",
        artifactKey: "brandCopy.md",
        storageUri: "supabase://campaigns/thread_482/brand-copy.md"
      }
    },
    {
      id: "GrowthHacker",
      role: "SEO & Growth Hero",
      status: "Verified",
      icon: Terminal,
      color: "from-cyan-400 to-blue-500",
      summary: "Keyword density synthesis, regional local pack targets, and conversion rate optimization tags.",
      sampleOutput: {
        primaryKeyword: "eco retreat hermanus western cape",
        secondaryKeywords: ["luxury whale watching accommodation", "walker bay organic wine tour", "overberg nature getaway"],
        metaTitle: "Luxury Eco Retreat in Hermanus | Walker Bay Wine & Ocean Views",
        metaDescription: "Experience whale watching and biodynamic wine tastings at Hermanus' top-rated boutique eco-resort. Book your Overberg sanctuary today.",
        artifactKey: "seoMap.json"
      }
    },
    {
      id: "Architect",
      role: "Front-End Architect",
      status: "Verified",
      icon: Code2,
      color: "from-blue-400 to-indigo-500",
      summary: "Component hierarchy modeling, Tailwind theme tokens, and dynamic layout architecture.",
      sampleOutput: {
        componentName: "EcoResortLandingPage",
        sections: ["HeroWithVideoBanner", "BiodiversityPillars", "SuiteBookingGrid", "LocalExperienceMap", "LeadCaptureDrawer"],
        themeConfig: { primary: "#059669", accent: "#0284c7" },
        artifactKey: "architecturePlan.json"
      }
    },
    {
      id: "Auditor",
      role: "Cryptographic Auditor",
      status: "Active Guard",
      icon: ShieldCheck,
      color: "from-amber-400 to-orange-500",
      summary: "Canonical SHA-256 state hashing, policy rule validation, and state immutability enforcement.",
      sampleOutput: {
        canonicalHash: "c4a922e4fcc6148f5bc1aa51809cf284d40e042af2a757a0c3923d330bb726de",
        requiresHitlApproval: true,
        hashAlgorithm: "SHA-256",
        validationStatus: "PASS"
      }
    },
    {
      id: "HitlGate",
      role: "HITL Operator Gate",
      status: "Supervisor",
      icon: Lock,
      color: "from-rose-400 to-purple-500",
      summary: "Mandatory human sign-off verifying operator credentials, HMAC signature, and final dispatch.",
      sampleOutput: {
        operatorEmail: "operator@touchbaseconsulting.co.za",
        signatureVerification: "HMAC_SHA256_VALIDATED",
        graphAction: "Resume past checkpoint to final production deployment",
        finalSector: "Completed"
      }
    }
  ];

  const activeNode = nodes[activeTab];

  return (
    <section id="nexus-engine" className="py-24 relative overflow-hidden bg-slate-950/60 border-y border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-300 mb-4">
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            <span>PROPRIETARY MULTI-AGENT ARCHITECTURE</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight mb-4">
            Inside the <span className="text-gradient">TBC Nexus OS</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Our multi-agent pipeline orchestrates specialized AI agents to generate brand assets, optimize search rankings, and design digital systems—all guarded by human approval.
          </p>
        </div>

        {/* Pipeline Navigation Steps */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-10">
          {nodes.map((node, index) => {
            const Icon = node.icon;
            const isActive = activeTab === index;
            return (
              <button
                key={node.id}
                onClick={() => setActiveTab(index)}
                className={`p-4 rounded-xl text-left transition-all border ${
                  isActive
                    ? "bg-slate-900 border-emerald-500/60 shadow-lg shadow-emerald-500/10 scale-[1.02]"
                    : "glass-panel border-slate-800/80 hover:border-slate-700 text-slate-400 hover:text-slate-200"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-slate-400">STAGE 0{index + 1}</span>
                  <span className={`w-2 h-2 rounded-full ${isActive ? "bg-emerald-400" : "bg-slate-600"}`} />
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <Icon className={`w-4 h-4 ${isActive ? "text-emerald-400" : "text-slate-400"}`} />
                  <p className="text-sm font-bold text-white truncate">{node.id}</p>
                </div>
                <p className="text-xs text-slate-400 truncate">{node.role}</p>
              </button>
            );
          })}
        </div>

        {/* Live Node Console Simulation */}
        <div className="glass-panel rounded-2xl border border-slate-700/80 overflow-hidden shadow-2xl">
          {/* Console Header */}
          <div className="bg-slate-900/90 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-xs font-mono text-slate-400">
                nexus-kernel // {activeNode.id}.ts [Sector ID: 0{activeTab + 1}]
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full">
              <span className="pulse-dot" />
              <span>State: Intercepted & Checkpointed</span>
            </div>
          </div>

          {/* Console Body */}
          <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono text-cyan-400 tracking-wider">HERO AGENT RESPONSIBILITY</span>
                <h3 className="text-2xl font-bold text-white mt-1 mb-3">{activeNode.role}</h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  {activeNode.summary}
                </p>

                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400">Underlying Model:</span>
                    <span className="text-white">Gemini 3.5 Flash / embedding-001</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400">Memory Matrix:</span>
                    <span className="text-emerald-400">Supabase pgvector (1536 dims)</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400">Event Stream:</span>
                    <span className="text-cyan-400">Upstash Redis Stream</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-800/80">
                <a
                  href="#audit"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium text-xs sm:text-sm text-slate-950 bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 transition-transform"
                >
                  Test This Engine on Your Brand
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* JSON Output Viewer */}
            <div className="lg:col-span-7 bg-slate-950/90 rounded-xl p-5 border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto shadow-inner">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80 text-[11px] text-slate-400">
                <span>// REAL-TIME GRAPH NODE PAYLOAD PREVIEW</span>
                <span className="text-emerald-400 font-medium">JSON VALIDATED</span>
              </div>
              <pre className="text-emerald-300 leading-relaxed overflow-x-auto">
                {JSON.stringify(activeNode.sampleOutput, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

