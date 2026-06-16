import Link from "next/link";
import { notFound } from "next/navigation";
import { Nav } from "@/components/Nav";
import { NoiseCanvas } from "@/components/NoiseCanvas";
import { ShaderCanvas } from "@/components/ShaderCanvas";
import { ArrowUpRight, GithubLogo } from "@/components/ClientIcons";
import { DOSSIERS, getDossier } from "@/lib/projects";
import { asset } from "@/lib/basePath";

export function generateStaticParams() {
  return DOSSIERS.map((d) => ({ slug: d.slug }));
}

export default async function DossierPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const d = getDossier(slug);
  if (!d) notFound();

  return (
    <main className="overflow-x-hidden w-full">
      <Nav />

      {/* ── DOSSIER HERO ─────────────────────────────────────── */}
      <section className="w-full max-w-7xl mx-auto px-6" style={{ paddingTop: "8rem", paddingBottom: "4rem" }}>
        <Link href="/#missions" className="font-mono flex items-center gap-2" style={{ fontSize: "0.64rem", letterSpacing: "0.28em", color: "var(--text-mute)", textDecoration: "none", marginBottom: "2.5rem" }}>
          ◂ RETURN TO MISSION SELECT
        </Link>

        <div className="hud-panel hud-corners" style={{ position: "relative", overflow: "hidden" }}>
          <span className="hud-c" />

          {/* visual banner */}
          <div style={{ position: "relative", height: 230, overflow: "hidden", borderBottom: "1px solid var(--line)" }}>
            {d.slug === "deadcrypt" ? (
              <NoiseCanvas height={230} />
            ) : (
              <ShaderCanvas type="liquid" />
            )}
            <div className="flex items-center justify-between" style={{ position: "absolute", top: 14, left: 16, right: 16, zIndex: 5 }}>
              <span className="font-mono" style={{ fontSize: "0.62rem", letterSpacing: "0.3em", color: "var(--primary)" }}>{d.codename} · DOSSIER</span>
              <span className="font-mono" style={{ fontSize: "0.62rem", letterSpacing: "0.2em", color: "var(--green)" }}>◉ {d.status}</span>
            </div>
          </div>

          <div className="p-8">
            <p className="font-mono" style={{ fontSize: "0.64rem", letterSpacing: "0.3em", color: "var(--cyan)", marginBottom: 10 }}>{d.classification}</p>
            <h1 className="font-display neon" style={{ fontSize: "clamp(2.2rem, 5vw, 3.6rem)", fontWeight: 900, letterSpacing: "0.06em", marginBottom: 10 }}>
              {d.title}
            </h1>
            <p className="font-display" style={{ fontSize: "1.1rem", color: "var(--text)", marginBottom: 16, letterSpacing: "0.04em" }}>{d.tagline}</p>
            <p style={{ color: "var(--text-dim)", maxWidth: "46rem", lineHeight: 1.75, marginBottom: "1.8rem" }}>{d.description}</p>
            <div className="flex flex-wrap gap-4">
              <a href={d.repo} target="_blank" rel="noopener noreferrer" className="btn-grid">
                <GithubLogo size={14} weight="fill" /> VIEW SOURCE
              </a>
              <Link href="/#comms" className="btn-grid-ghost">REQUEST BRIEFING</Link>
            </div>
          </div>

          {/* metric strip */}
          <div className="grid grid-cols-12" style={{ borderTop: "1px solid var(--line)" }}>
            {d.metrics.map((m, i) => (
              <div key={m.label} className="col-span-12 md:col-span-3 p-6" style={{ borderRight: i < d.metrics.length - 1 ? "1px solid var(--line-dim)" : "none" }}>
                <p className="font-display neon" style={{ fontSize: "1.7rem", fontWeight: 800 }}>{m.value}</p>
                <p className="font-mono" style={{ fontSize: "0.58rem", letterSpacing: "0.24em", color: "var(--text-mute)", marginTop: 4 }}>{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FIELD CAPTURE (DeadCrypt only) ───────────────────── */}
      {d.slug === "deadcrypt" && (
        <section className="w-full max-w-5xl mx-auto px-6 py-12">
          <p className="reveal hud-label" style={{ marginBottom: "1.1rem" }}>FIELD CAPTURE // REAL ENCODE</p>
          <h2 className="reveal font-display" style={{ fontSize: "var(--text-section)", fontWeight: 800, marginBottom: "0.9rem" }}>
            FILE IN. <span className="neon">STATIC OUT.</span>
          </h2>
          <p className="reveal" style={{ color: "var(--text-dim)", maxWidth: "40rem", lineHeight: 1.7, marginBottom: "2rem" }}>
            A real run of <code>deadcrypt encode</code> — the frames on the right are the
            actual bytes the encoder writes, played back as lossless TV static.
            Decode reverses every step, byte-for-byte.
          </p>
          <div className="reveal terminal hud-corners" style={{ position: "relative", overflow: "hidden" }}>
            <span className="hud-c" />
            <div className="terminal-titlebar">
              <span className="terminal-dot" style={{ background: "var(--red)" }} />
              <span className="terminal-dot" style={{ background: "var(--primary)" }} />
              <span className="terminal-dot" style={{ background: "var(--green)" }} />
              <span style={{ marginLeft: 6 }}>deadcrypt — field capture</span>
              <span style={{ marginLeft: "auto", color: "var(--primary)" }}>● REC</span>
            </div>
            <video
              src={asset("/deadcrypt-demo.mp4")}
              poster={asset("/deadcrypt-demo-poster.png")}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              style={{ display: "block", width: "100%", height: "auto", aspectRatio: "860 / 470", background: "var(--bg)" }}
            />
          </div>
        </section>
      )}

      {/* ── PIPELINE ─────────────────────────────────────────── */}
      <section className="w-full max-w-7xl mx-auto px-6 py-24">
        <p className="reveal hud-label" style={{ marginBottom: "1.1rem" }}>SYSTEM TOPOLOGY</p>
        <h2 className="reveal font-display" style={{ fontSize: "var(--text-section)", fontWeight: 800, marginBottom: "2.5rem" }}>
          THE <span className="neon">PIPELINE.</span>
        </h2>

        <div className="reveal flex flex-wrap items-stretch" style={{ gap: 0, rowGap: "1.5rem" }}>
          {d.pipeline.map((stage, i) => (
            <div key={stage.id} className="flex items-center" style={{ flex: "1 1 240px", minWidth: 0 }}>
              <div className="hud-panel hud-corners p-6" style={{ position: "relative", flex: 1, minHeight: 130 }}>
                <span className="hud-c" />
                <p className="font-mono" style={{ fontSize: "0.56rem", letterSpacing: "0.26em", color: "var(--text-mute)", marginBottom: 8 }}>
                  STAGE {String(i + 1).padStart(2, "0")}
                </p>
                <p className="font-display" style={{ fontSize: "0.85rem", fontWeight: 800, letterSpacing: "0.1em", color: "var(--primary)", marginBottom: 8 }}>
                  {stage.name}
                </p>
                <p style={{ fontSize: "0.82rem", color: "var(--text-dim)", lineHeight: 1.55 }}>{stage.detail}</p>
              </div>
              {i < d.pipeline.length - 1 && (
                <svg width="34" height="20" style={{ flexShrink: 0 }}>
                  <line x1="0" y1="10" x2="34" y2="10" className="pipe-flow" />
                </svg>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── CAPABILITIES ─────────────────────────────────────── */}
      <section className="w-full max-w-7xl mx-auto px-6 py-24">
        <p className="reveal hud-label" style={{ marginBottom: "1.1rem" }}>CAPABILITY MATRIX</p>
        <h2 className="reveal font-display" style={{ fontSize: "var(--text-section)", fontWeight: 800, marginBottom: "2.5rem" }}>
          WHAT IT <span className="neon">DOES.</span>
        </h2>
        <div className="grid grid-cols-12 gap-5">
          {d.features.map((f, i) => (
            <div key={f.title} className="col-span-12 md:col-span-6 reveal">
              <div className="log-entry p-6" style={{ height: "100%" }}>
                <p className="font-mono" style={{ fontSize: "0.56rem", letterSpacing: "0.26em", color: "var(--cyan)", marginBottom: 8 }}>
                  CAP-{String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="font-display" style={{ fontSize: "0.95rem", fontWeight: 700, letterSpacing: "0.08em", marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontSize: "0.92rem", color: "var(--text-dim)", lineHeight: 1.7 }}>{f.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── LOADOUT + STRUCTURE ──────────────────────────────── */}
      <section className="w-full max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 md:col-span-6">
            <p className="reveal hud-label" style={{ marginBottom: "1.1rem" }}>LOADOUT</p>
            <h2 className="reveal font-display" style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "1.8rem" }}>
              TECH <span className="neon">STACK.</span>
            </h2>
            <div className="reveal hud-panel" style={{ overflow: "hidden" }}>
              {d.stack.map((s, i) => (
                <div key={s.tech} className="flex items-center justify-between p-6" style={{ padding: "0.95rem 1.4rem", borderBottom: i < d.stack.length - 1 ? "1px solid var(--line-dim)" : "none" }}>
                  <span className="font-display" style={{ fontSize: "0.82rem", fontWeight: 700, letterSpacing: "0.08em", color: "var(--primary)" }}>{s.tech}</span>
                  <span className="font-mono text-left" style={{ fontSize: "0.66rem", color: "var(--text-dim)", letterSpacing: "0.04em", maxWidth: "55%" }}>{s.role}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-12 md:col-span-6">
            <p className="reveal hud-label" style={{ marginBottom: "1.1rem" }}>BLUEPRINT</p>
            <h2 className="reveal font-display" style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "1.8rem" }}>
              MODULE <span className="neon">MAP.</span>
            </h2>
            <div className="reveal terminal hud-corners" style={{ position: "relative" }}>
              <span className="hud-c" />
              <div className="terminal-titlebar">
                <span className="terminal-dot" style={{ background: "var(--red)" }} />
                <span className="terminal-dot" style={{ background: "var(--primary)" }} />
                <span className="terminal-dot" style={{ background: "var(--green)" }} />
                <span style={{ marginLeft: 6 }}>tree --modules</span>
              </div>
              <div style={{ padding: "1rem 1.25rem" }}>
                {d.fileTree.map((l, i) => (
                  <p key={i} style={{ whiteSpace: "pre", color: l.startsWith("├") || l.startsWith("└") ? "var(--text-dim)" : "var(--cyan)", fontSize: "0.76rem", lineHeight: 1.8 }}>{l}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── EXECUTION SEQUENCE ───────────────────────────────── */}
      <section className="w-full max-w-5xl mx-auto px-6 py-24">
        <p className="reveal hud-label" style={{ marginBottom: "1.1rem" }}>EXECUTION SEQUENCE</p>
        <h2 className="reveal font-display" style={{ fontSize: "var(--text-section)", fontWeight: 800, marginBottom: "2.5rem" }}>
          HOW A RUN <span className="neon">FLOWS.</span>
        </h2>
        <div className="flex flex-col" style={{ gap: 0 }}>
          {d.sequence.map((s, i) => (
            <div key={i} className="reveal flex items-start gap-5" style={{ position: "relative", paddingBottom: i < d.sequence.length - 1 ? "1.6rem" : 0 }}>
              {i < d.sequence.length - 1 && (
                <span style={{ position: "absolute", left: 17, top: 36, bottom: 0, width: 1, background: "linear-gradient(to bottom, rgba(255,115,32,0.5), rgba(255,115,32,0.08))" }} />
              )}
              <span className="font-mono flex items-center justify-center" style={{ width: 35, height: 35, flexShrink: 0, border: "1px solid rgba(255,115,32,0.45)", color: "var(--primary)", fontSize: "0.66rem", background: "var(--bg-panel)" }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <p style={{ color: "var(--text-dim)", lineHeight: 1.7, paddingTop: 6 }}>{s}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── NEXT MISSION ─────────────────────────────────────── */}
      <section className="w-full max-w-5xl mx-auto px-6 py-24 text-center" style={{ paddingBottom: "8rem" }}>
        <div className="reveal hud-panel hud-corners p-8" style={{ position: "relative" }}>
          <span className="hud-c" />
          <p className="font-mono" style={{ fontSize: "0.62rem", letterSpacing: "0.3em", color: "var(--text-mute)", marginBottom: 14 }}>MISSION COMPLETE</p>
          <h2 className="font-display" style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: 22 }}>
            CONTINUE TO NEXT <span className="neon">OBJECTIVE?</span>
          </h2>
          <div className="flex flex-wrap gap-4 justify-center">
            {DOSSIERS.filter((x) => x.slug !== d.slug).map((x) => (
              <Link key={x.slug} href={`/projects/${x.slug}`} className="btn-grid">
                ▸ {x.title}
              </Link>
            ))}
            <a href={d.repo} target="_blank" rel="noopener noreferrer" className="btn-grid-dim">
              SOURCE CODE <ArrowUpRight size={12} weight="bold" />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
