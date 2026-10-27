"use client";

import React, { useState } from "react";
import { Sparkles, Terminal, Menu, X, ArrowRight, ShieldCheck } from "lucide-react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Terminal className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                Touch Base <span className="text-emerald-400 font-medium text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">Nexus</span>
              </span>
              <span className="text-[11px] text-slate-400 font-mono tracking-wider">CONSULTING.CO.ZA</span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#services" className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors">
              Services
            </a>
            <a href="#nexus-engine" className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Nexus AI Engine
            </a>
            <a href="#case-studies" className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors">
              Overberg Showcase
            </a>
            <a href="#technology" className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors">
              Architecture
            </a>
            <a href="/dashboard" className="text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1 font-mono text-xs px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              Portal
            </a>
          </div>

          {/* Right Actions & Status Pill */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-xs font-mono text-emerald-300">
              <span className="pulse-dot" />
              <span>Engine Status: Active</span>
            </div>

            <a
              href="#audit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm text-slate-950 bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02]"
            >
              Get Free Audit
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-400 hover:text-white p-2 rounded-lg"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-slate-800 px-4 pt-3 pb-6 space-y-3 bg-slate-950/95">
          <a
            href="#services"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-300 hover:text-emerald-400"
          >
            Services
          </a>
          <a
            href="#nexus-engine"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-300 hover:text-emerald-400"
          >
            Nexus AI Engine
          </a>
          <a
            href="#case-studies"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-300 hover:text-emerald-400"
          >
            Overberg Showcase
          </a>
          <a
            href="#technology"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-300 hover:text-emerald-400"
          >
            Architecture
          </a>
          <div className="pt-2">
            <a
              href="#audit"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-medium text-sm text-slate-950 bg-gradient-to-r from-emerald-400 to-cyan-400 shadow-md"
            >
              Request Free Digital Audit
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}

