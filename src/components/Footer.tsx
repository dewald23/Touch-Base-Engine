"use client";

import React from "react";
import { Terminal, MapPin, Mail, ArrowUpRight, ShieldCheck, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/90 pt-16 pb-12 relative z-10 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Col 1: Brand Info */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center">
                <Terminal className="w-4 h-4 text-slate-950 stroke-[2.5]" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Touch Base Consulting
              </span>
            </div>
            <p className="text-sm text-slate-300 max-w-md leading-relaxed mb-6 font-normal">
              High-performance web applications, dominant localized SEO architecture, and autonomous agency automation powered by the TBC Nexus platform.
            </p>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center gap-2 text-slate-300">
                <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Hermanus & Overberg, Western Cape, South Africa</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Mail className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>hello@touchbaseconsulting.co.za</span>
              </div>
            </div>
          </div>

          {/* Col 2: Services */}
          <div>
            <h4 className="text-xs font-mono text-white tracking-wider mb-4 uppercase">Capabilities</h4>
            <ul className="space-y-2 text-sm text-slate-300 font-normal">
              <li><a href="#services" className="hover:text-emerald-400 transition-colors">Bespoke Next.js Apps</a></li>
              <li><a href="#services" className="hover:text-emerald-400 transition-colors">Hermanus & Overberg SEO</a></li>
              <li><a href="#nexus-engine" className="hover:text-emerald-400 transition-colors">TBC Nexus Multi-Agent OS</a></li>
              <li><a href="#services" className="hover:text-emerald-400 transition-colors">Workflow & CRM Automation</a></li>
              <li><a href="#audit" className="hover:text-emerald-400 transition-colors">Conversion Audits</a></li>
            </ul>
          </div>

          {/* Col 3: Legal & Infrastructure */}
          <div>
            <h4 className="text-xs font-mono text-white tracking-wider mb-4 uppercase">Nexus Engine</h4>
            <ul className="space-y-2 text-sm text-slate-300 font-normal">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>LangGraph StateGraph</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span>Supabase pgvector 1536</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Upstash Redis Telemetry</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span>Gemini 3.5 Flash Model</span>
              </li>
              <li className="pt-2 text-xs text-slate-400 font-mono">
                System Version 1.0.0-prod
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 font-mono gap-4">
          <p>© {new Date().getFullYear()} Touch Base Consulting (Pty) Ltd. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Engineered with pride in Hermanus, South Africa
          </p>
        </div>
      </div>
    </footer>
  );
}

