import type { Metadata } from "next";
import { Orbitron, Rajdhani, Share_Tech_Mono } from "next/font/google";
import "./globals.css";
import { SmoothScroller } from "@/components/SmoothScroller";
import { GsapController } from "@/components/GsapController";
import { RevealController } from "@/components/RevealController";
import { GridBackground } from "@/components/GridBackground";
import { SpaceCursor } from "@/components/SpaceCursor";
import { SoundSystem } from "@/components/SoundSystem";
import { BootLoader } from "@/components/BootLoader";
import { asset } from "@/lib/basePath";

const orbitron = Orbitron({
  weight: ["500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-display",
});

const rajdhani = Rajdhani({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-body",
});

const shareTechMono = Share_Tech_Mono({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Dev Sharma — GenAI Engineer",
  description:
    "GenAI Engineer specialising in agentic pipelines, RAG systems and LangGraph — grounded retrieval, optimized inference and production GenAI systems built to ship.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Warm the DeadCrypt demo into cache during the boot screen, so the
            project page plays instantly when opened (low-priority prefetch). */}
        <link rel="prefetch" href={asset("/deadcrypt-demo.mp4")} as="video" />
        <link rel="prefetch" href={asset("/deadcrypt-demo-poster.png")} as="image" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
              var r = sessionStorage.getItem('redirect');
              if (r) { sessionStorage.removeItem('redirect'); window.history.replaceState(null, '', r); }
              })();
              // Auto-recover from chunk load/network errors
              window.addEventListener('error', function(e) {
                try {
                  if (e.message && (e.message.indexOf('ChunkLoadError') !== -1 || e.message.indexOf('Loading chunk') !== -1)) {
                    var now = Date.now();
                    var urlParams = new URLSearchParams(window.location.search);
                    var lastReload = urlParams.get('r');
                    if (!lastReload) {
                      try { lastReload = window.sessionStorage ? window.sessionStorage.getItem('last_chunk_reload') : null; } catch (err) {}
                    }
                    if (!lastReload || (now - parseInt(lastReload, 10)) > 10000) {
                      try { if (window.sessionStorage) window.sessionStorage.setItem('last_chunk_reload', now.toString()); } catch (err) {}
                      var newSearch = new URLSearchParams(window.location.search);
                      newSearch.set('r', now.toString());
                      window.location.search = newSearch.toString();
                    }
                  }
                } catch (handlerErr) {}
              });
            `,
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className={`${orbitron.variable} ${rajdhani.variable} ${shareTechMono.variable} font-body antialiased`}
      >
        <SpaceCursor />
        <BootLoader />
        <SoundSystem />
        <GridBackground />
        <SmoothScroller />
        <GsapController />
        <RevealController />
        {children}
        {/* CRT atmosphere */}
        <div className="scanlines" />
        <div className="crt-vignette" />
      </body>
    </html>
  );
}
