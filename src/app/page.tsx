import React from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { NexusShowcase } from "@/components/NexusShowcase";
import { TechStack } from "@/components/TechStack";
import { CaseStudies } from "@/components/CaseStudies";
import { AuditForm } from "@/components/AuditForm";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "Touch Base Consulting | Bespoke Web Platforms & Autonomous AI Engine",
  description: "Touch Base Consulting crafts ultra-fast web applications, dominant local SEO foundations, and automated multi-agent operational workflows in Hermanus, the Overberg, and South Africa.",
  keywords: "web development hermanus, local seo western cape, autonomous ai agents, next.js agency south africa, touch base consulting",
};

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-slate-950">
      <Navbar />
      <main>
        <Hero />
        <Services />
        <NexusShowcase />
        <TechStack />
        <CaseStudies />
        <AuditForm />
      </main>
      <Footer />
    </div>
  );
}

