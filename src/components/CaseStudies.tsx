"use client";

import React from "react";
import { TrendingUp, Award, MapPin, CheckCircle, ArrowRight } from "lucide-react";

export function CaseStudies() {
  const stories = [
    {
      title: "Walker Bay Eco-Retreat & Sanctuary",
      location: "Hermanus, Overberg",
      category: "Luxury Hospitality & Tourism",
      challenge: "Legacy slow website losing high-value seasonal tourists and international whale-watching travelers to OTA booking fees.",
      result: "+340% direct bookings within 90 days. Top 3 Google Local Pack ranking for 'luxury eco lodge hermanus'.",
      metric: "+340%",
      metricLabel: "Direct Organic Bookings",
      tags: ["Next.js App", "Local SEO", "Booking Integration"]
    },
    {
      title: "Hemel-en-Aarde Valley Wine Cellars",
      location: "Upper Hemel-en-Aarde, Western Cape",
      category: "Boutique Wine & Export",
      challenge: "Lack of localized search visibility for international wine tourists and export tasting room reservations.",
      result: "Engineered localized SEO landing architecture with instant multilingual schema markup and TBC Nexus content syndication.",
      metric: "Top 1",
      metricLabel: "Google Local Ranking",
      tags: ["Semantic Schema", "Brand Positioning", "Mobile Speed"]
    },
    {
      title: "Overberg Specialized Legal Practice",
      location: "Caledon & Hermanus",
      category: "Professional Services",
      challenge: "High client acquisition costs and manual triage of inbound property conveyancing and commercial inquiries.",
      result: "Deployed automated TBC Nexus lead intake webhook routing leads to attorney calendars within 45 seconds.",
      metric: "45s",
      metricLabel: "Lead Response Time",
      tags: ["BullMQ Routing", "Automated Triage", "CRM Webhooks"]
    }
  ];

  return (
    <section id="case-studies" className="py-24 relative z-10 bg-slate-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-300 mb-4">
            <Award className="w-3.5 h-3.5" />
            <span>PROVEN OVERBERG RESULTS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight mb-4">
            Local Heritage. <br />
            <span className="text-gradient">World-Class Execution.</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Grounded in the heart of the Western Cape. We help South African businesses capture regional market share and attract high-value international clientele.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stories.map((s, idx) => (
            <div
              key={idx}
              className="glass-panel glass-panel-hover rounded-2xl p-8 flex flex-col justify-between border border-slate-800"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-4">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <MapPin className="w-3.5 h-3.5" /> {s.location}
                  </span>
                  <span>{s.category}</span>
                </div>

                <h3 className="text-xl font-bold text-white mb-4">{s.title}</h3>

                <div className="mb-6 p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                  <p className="text-3xl font-extrabold text-gradient-emerald">{s.metric}</p>
                  <p className="text-xs font-mono text-slate-400">{s.metricLabel}</p>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed mb-6">
                  {s.result}
                </p>
              </div>

              <div>
                <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-800/80">
                  {s.tags.map((t, tIdx) => (
                    <span key={tIdx} className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-slate-800/80 text-slate-300">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

