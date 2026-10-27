import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Touch Base Consulting | Intelligent Web Architecture & Autonomous AI Agency",
  description: "Touch Base Consulting (Hermanus & Western Cape) develops ultra-performant web applications, high-converting digital branding, and automated marketing workflows powered by the TBC Nexus engine.",
  keywords: [
    "Touch Base Consulting",
    "web development Hermanus",
    "SEO agency Overberg",
    "AI consulting South Africa",
    "autonomous marketing engine",
    "Next.js web apps",
    "TBC Nexus"
  ],
  authors: [{ name: "Touch Base Consulting", url: "https://touchbaseconsulting.co.za" }],
  openGraph: {
    title: "Touch Base Consulting | Intelligent Web & AI Agency",
    description: "Empowering businesses with AI-assisted web architecture, local SEO dominance, and autonomous multi-agent pipelines.",
    url: "https://touchbaseconsulting.co.za",
    siteName: "Touch Base Consulting",
    locale: "en_ZA",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://touchbaseconsulting.co.za" />
      </head>
      <body>{children}</body>
    </html>
  );
}

