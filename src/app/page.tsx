import React from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { NexusShowcase } from "@/components/NexusShowcase";
import { TechStack } from "@/components/TechStack";
import { CaseStudies } from "@/components/CaseStudies";
import { AuditForm } from "@/components/AuditForm";
import { Footer } from "@/components/Footer";

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

