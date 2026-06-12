import Link from "next/link";
import {
  ArrowUpRight, GithubLogo, LinkedinLogo,
  Envelope,
} from "@/components/ClientIcons";
import { Nav } from "@/components/Nav";
import { ShaderCanvas } from "@/components/ShaderCanvas";
import { TiltCard } from "@/components/TiltCard";
import { Typewriter } from "@/components/Typewriter";
import { DemoPlayer } from "@/components/DemoPlayer";
import { DOSSIERS } from "@/lib/projects";

// ─── DATA ────────────────────────────────────────────────────────────────────

const SKILLS_ROW1 = Array(4).fill(["Python","LangGraph","FastAPI","QdrantDB","Redis","Ollama"]).flat();
const SKILLS_ROW2 = Array(4).fill(["RAG Systems","Prompt Engineering","ComfyUI","Hugging Face","FFmpeg","NumPy"]).flat();

const PLAYER_STATS = [
  { label: "RAG SYSTEMS", value: 92 },
  { label: "AGENTIC PIPELINES", value: 88 },
  { label: "PROMPT ENGINEERING", value: 90 },
  { label: "BACKEND INFRA", value: 78 },
];

const ACHIEVEMENTS = [
  { value: "−70%", label: "INFERENCE COST", sub: "prompt engineering + token budgeting" },
  { value: "−50%", label: "PIPELINE LATENCY", sub: "production GenAI optimization" },
  { value: "+40%", label: "RETRIEVAL COVERAGE", sub: "hybrid RRF + reranking" },
  { value: "−60%", label: "DEBUG TIME", sub: "modular LangGraph rebuild" },
];

const CAREER_LOG = [
  {
    role: "GenAI Engineer Intern",
    company: "Astroraaga",
    period: "APR 2026 — PRESENT",
    status: "ACTIVE",
    bullets: [
      "Restructured LangGraph pipeline into modular architecture — −60% debug time, +40% dev velocity.",
      "Optimized production GenAI pipeline via prompt engineering & token budgeting — −50% latency, −70% cost.",
      "Backend infra, optimisation, and US-timezone production operations.",
    ],
    tags: ["LangGraph","RAG","Prompt Eng"],
  },
  {
    role: "Python Developer Intern",
    company: "SovereigntLabs (web3)",
    period: "OCT 2024 — FEB 2025",
    status: "COMPLETE",
    bullets: [
      "Led team building an AI face-auth system with DeepFace, owning core architecture.",
      "Facial encoding → unique text-based codes for secure login — first end-to-end production system.",
    ],
    tags: ["Python","DeepFace","AI Auth"],
  },
];

const TRANSMISSIONS = [
  {
    tag: "#0to100Xengineer",
    excerpt: "Built a production hybrid RAG pipeline this week — BM25 sparse + dense QdrantDB vectors. CrossEncoder reranking alone cut irrelevant chunks by 60%...",
    likes: "142", comments: "18",
  },
  {
    tag: "PROMPT ENGINEERING",
    excerpt: "Reduced LLM inference cost by 70% without touching the model. Token budgeting + response trimming + model switching. The exact playbook...",
    likes: "208", comments: "31",
  },
  {
    tag: "COMFYUI + FLUX",
    excerpt: "Trained a custom LoRA on FLUX for a client project on Hugging Face. The quality jump over SDXL base is insane. Training config breakdown...",
    likes: "176", comments: "22",
  },
];

const LINKEDIN = "https://www.linkedin.com/in/dev-sharma-a33214256/";
const SHADERS: Record<string, "liquid" | "digital" | "stealth" | "neural"> = {
  "d-rag": "liquid",
  "deadcrypt": "digital",
};

// ─── SECTIONS ────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section id="about" className="relative w-full max-w-7xl mx-auto px-6" style={{ minHeight: "100vh", display: "flex", alignItems: "center", paddingTop: "7rem", paddingBottom: "4rem" }}>
      <div className="grid grid-cols-12 gap-8 w-full items-center">
        {/* left: headline */}
        <div className="col-span-12 md:col-span-8">
          <p className="hud-label hero-sub" style={{ marginBottom: "1.6rem" }}>PLAYER ONE // GENAI ENGINEER</p>
          <h1 className="font-display" style={{ fontSize: "var(--text-hero)", fontWeight: 900, lineHeight: 1.04, marginBottom: "1.4rem" }}>
            <span className="hero-word block" style={{ color: "var(--text)" }}>I BUILD SYSTEMS</span>
            <span className="hero-word block">
              <span style={{ color: "var(--text)" }}>THAT </span>
              <span className="neon glitch" data-text="THINK.">THINK.</span>
            </span>
          </h1>
          <p className="hero-sub" style={{ color: "var(--text-dim)", fontSize: "1.05rem", maxWidth: "34rem", lineHeight: 1.7, marginBottom: "0.9rem" }}>
            Agentic pipelines, RAG systems and production GenAI workflows —
            currently running live ops at <strong style={{ color: "var(--primary)" }}>Astroraaga</strong>.
          </p>
          <div className="hero-sub" style={{ minHeight: "1.7rem", marginBottom: "2.6rem" }}>
            <Typewriter />
          </div>
          <div className="hero-ctas flex flex-wrap gap-4">
            <a href="#missions" className="btn-grid">▸ VIEW MISSIONS</a>
            <a href="#demo" className="btn-grid-ghost">WATCH DEMO</a>
            <a href="https://github.com/dev2180" target="_blank" rel="noopener noreferrer" className="btn-grid-dim">
              GITHUB <ArrowUpRight size={12} weight="bold" />
            </a>
          </div>
        </div>

        {/* right: player card */}
        <div className="col-span-12 md:col-span-4 hero-sub">
          <div className="hud-panel hud-corners p-6" style={{ position: "relative" }}>
            <span className="hud-c" />
            <div className="flex items-center justify-between" style={{ marginBottom: "1.3rem" }}>
              <span className="font-mono" style={{ fontSize: "0.62rem", letterSpacing: "0.3em", color: "var(--text-mute)" }}>PLAYER STATS</span>
              <span className="font-mono" style={{ fontSize: "0.62rem", letterSpacing: "0.2em", color: "var(--green)" }}>● ONLINE</span>
            </div>
            <div className="flex items-center gap-4" style={{ marginBottom: "1.5rem" }}>
              <div className="flex items-center justify-center font-display neon" style={{ width: 54, height: 54, border: "1px solid rgba(255,115,32,0.5)", fontSize: "1.3rem", fontWeight: 800 }}>
                DS
              </div>
              <div>
                <p className="font-display" style={{ fontSize: "0.95rem", fontWeight: 700, letterSpacing: "0.08em" }}>DEV SHARMA</p>
                <p className="font-mono" style={{ fontSize: "0.6rem", letterSpacing: "0.24em", color: "var(--cyan)" }}>CLASS: GENAI ENGINEER</p>
              </div>
            </div>
            {PLAYER_STATS.map((s) => (
              <div key={s.label} style={{ marginBottom: "0.9rem" }}>
                <div className="flex justify-between font-mono" style={{ fontSize: "0.58rem", letterSpacing: "0.22em", color: "var(--text-dim)", marginBottom: 5 }}>
                  <span>{s.label}</span>
                  <span style={{ color: "var(--primary)" }}>{s.value}</span>
                </div>
                <div className="stat-bar-track">
                  <div className="stat-bar-fill stat-anim" data-value={s.value} />
                </div>
              </div>
            ))}
            <div className="flex justify-between font-mono" style={{ fontSize: "0.58rem", letterSpacing: "0.22em", color: "var(--text-mute)", marginTop: "1.2rem", paddingTop: "1rem", borderTop: "1px solid var(--line-dim)" }}>
              <span>LVL 21</span>
              <span>XP: SHIPPING WEEKLY</span>
            </div>
          </div>
        </div>
      </div>

      {/* scroll hint */}
      <div className="absolute font-mono" style={{ bottom: "1.8rem", left: "50%", transform: "translateX(-50%)", fontSize: "0.58rem", letterSpacing: "0.4em", color: "var(--text-mute)" }}>
        ▼ SCROLL TO DESCEND
      </div>
    </section>
  );
}

function Achievements() {
  return (
    <section className="w-full max-w-7xl mx-auto px-6" style={{ paddingBottom: "5rem" }}>
      <div className="reveal grid grid-cols-12" style={{ border: "1px solid var(--line)", background: "var(--bg-panel)" }}>
        {ACHIEVEMENTS.map((a, i) => (
          <div key={a.label} className="col-span-12 md:col-span-3 p-6" style={{ borderRight: i < 3 ? "1px solid var(--line-dim)" : "none" }}>
            <p className="font-display neon" style={{ fontSize: "clamp(1.6rem, 2.4vw, 2.2rem)", fontWeight: 800 }}>{a.value}</p>
            <p className="font-display" style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", marginTop: 6 }}>{a.label}</p>
            <p className="font-mono" style={{ fontSize: "0.6rem", color: "var(--text-mute)", letterSpacing: "0.08em", marginTop: 4, textTransform: "uppercase" }}>{a.sub}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Marquee() {
  return (
    <section className="w-full py-16" style={{ overflow: "hidden", borderTop: "1px solid var(--line-dim)", borderBottom: "1px solid var(--line-dim)", background: "rgba(4,6,10,0.5)" }}>
      <div style={{ overflow: "hidden", marginBottom: "0.9rem" }}>
        <div className="marquee-track-left">
          {SKILLS_ROW1.map((s, i) => <span key={i} className="chip">{s}</span>)}
        </div>
      </div>
      <div style={{ overflow: "hidden" }}>
        <div className="marquee-track-right">
          {SKILLS_ROW2.map((s, i) => <span key={i} className="chip">{s}</span>)}
        </div>
      </div>
    </section>
  );
}

function Demo() {
  return (
    <section id="demo" className="w-full max-w-5xl mx-auto px-6 py-32">
      <p className="reveal hud-label" style={{ marginBottom: "1.1rem" }}>MISSION CAPTURE // LIVE FOOTAGE</p>
      <h2 className="reveal font-display" style={{ fontSize: "var(--text-section)", fontWeight: 800, marginBottom: "0.9rem" }}>
        WATCH THE ENGINE <span className="neon">RUN.</span>
      </h2>
      <p className="reveal" style={{ color: "var(--text-dim)", maxWidth: "36rem", lineHeight: 1.7, marginBottom: "2.5rem" }}>
        A captured session of D-RAG answering a question against real PDFs —
        query expansion, hybrid retrieval, reranking, compression and a grounded,
        cited answer. Press play.
      </p>
      <div className="reveal">
        <DemoPlayer />
      </div>
    </section>
  );
}

function Missions() {
  return (
    <section id="missions" className="w-full max-w-7xl mx-auto px-6 py-32">
      <p className="reveal hud-label" style={{ marginBottom: "1.1rem" }}>MISSION SELECT</p>
      <h2 className="reveal font-display" style={{ fontSize: "var(--text-section)", fontWeight: 800, marginBottom: "2.5rem" }}>
        CHOOSE YOUR <span className="neon">MISSION.</span>
      </h2>

      <div className="grid grid-cols-12 gap-5">
        {DOSSIERS.map((d) => (
          <div key={d.slug} className="col-span-12 md:col-span-6">
            <TiltCard>
              <Link href={`/projects/${d.slug}`} className="mission-card">
                <div className="hud-panel hud-corners" style={{ position: "relative", overflow: "hidden" }}>
                  <span className="hud-c" />
                  <div style={{ position: "relative", height: 170, overflow: "hidden", borderBottom: "1px solid var(--line)" }}>
                    <ShaderCanvas type={SHADERS[d.slug]} />
                    <span className="font-mono" style={{ position: "absolute", top: 12, left: 14, fontSize: "0.6rem", letterSpacing: "0.3em", color: "var(--primary)", zIndex: 5 }}>
                      {d.codename}
                    </span>
                    <span className="font-mono" style={{ position: "absolute", top: 12, right: 14, fontSize: "0.6rem", letterSpacing: "0.2em", color: "var(--green)", zIndex: 5 }}>
                      ◉ {d.status}
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="font-display" style={{ fontSize: "1.35rem", fontWeight: 800, letterSpacing: "0.08em", marginBottom: 4 }}>{d.title}</h3>
                    <p className="font-mono" style={{ fontSize: "0.6rem", letterSpacing: "0.26em", color: "var(--cyan)", marginBottom: 12 }}>{d.classification}</p>
                    <p style={{ color: "var(--text-dim)", fontSize: "0.95rem", lineHeight: 1.65, marginBottom: 18 }}>{d.tagline}</p>
                    <div className="flex flex-wrap gap-2" style={{ marginBottom: 18 }}>
                      {d.stack.slice(0, 4).map((s) => (
                        <span key={s.tech} className="chip" style={{ fontSize: "0.58rem", padding: "0.3rem 0.7rem" }}>{s.tech}</span>
                      ))}
                    </div>
                    <span className="font-mono flex items-center gap-2" style={{ fontSize: "0.66rem", letterSpacing: "0.28em", color: "var(--primary)" }}>
                      OPEN DOSSIER <ArrowUpRight size={11} weight="bold" />
                    </span>
                  </div>
                </div>
              </Link>
            </TiltCard>
          </div>
        ))}

        {/* side quests */}
        <div className="col-span-12 md:col-span-6">
          <TiltCard>
            <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" className="mission-card">
              <div className="hud-panel hud-corners p-6" style={{ position: "relative" }}>
                <span className="hud-c" />
                <span className="font-mono" style={{ fontSize: "0.6rem", letterSpacing: "0.3em", color: "var(--cyan)" }}>SIDE QUEST</span>
                <h3 className="font-display" style={{ fontSize: "1.1rem", fontWeight: 800, letterSpacing: "0.08em", margin: "10px 0 6px" }}>100XENGINEERS COHORT</h3>
                <p style={{ color: "var(--text-dim)", fontSize: "0.92rem", lineHeight: 1.6 }}>
                  ComfyUI · SDXL · FLUX · LoRA training on Hugging Face. Weekly AI engineering learnings shared publicly.
                </p>
              </div>
            </a>
          </TiltCard>
        </div>
        <div className="col-span-12 md:col-span-6">
          <TiltCard>
            <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" className="mission-card">
              <div className="hud-panel hud-corners p-6" style={{ position: "relative" }}>
                <span className="hud-c" />
                <span className="font-mono" style={{ fontSize: "0.6rem", letterSpacing: "0.3em", color: "var(--red)" }}>CLASSIFIED</span>
                <h3 className="font-display" style={{ fontSize: "1.1rem", fontWeight: 800, letterSpacing: "0.08em", margin: "10px 0 6px" }}>NEXT MISSION — STEALTH</h3>
                <p style={{ color: "var(--text-dim)", fontSize: "0.92rem", lineHeight: 1.6 }}>
                  In development. Intel drops on LinkedIn → #0to100Xengineer.
                </p>
              </div>
            </a>
          </TiltCard>
        </div>
      </div>
    </section>
  );
}

function CareerLog() {
  return (
    <section id="log" className="w-full max-w-5xl mx-auto px-6 py-32">
      <p className="reveal hud-label" style={{ marginBottom: "1.1rem" }}>CAREER LOG</p>
      <h2 className="reveal font-display" style={{ fontSize: "var(--text-section)", fontWeight: 800, marginBottom: "2.5rem" }}>
        WHERE I&apos;VE <span className="neon">DEPLOYED.</span>
      </h2>

      <div className="flex flex-col gap-5">
        {CAREER_LOG.map((e, i) => (
          <details key={i} className="log-entry reveal" open={i === 0}>
            <summary className="flex items-center justify-between p-6" style={{ cursor: "none", listStyle: "none" }}>
              <div className="flex items-center gap-5">
                <span className="font-mono" style={{ fontSize: "0.62rem", color: "var(--text-mute)" }}>{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <p className="font-display" style={{ fontSize: "1.05rem", fontWeight: 700, letterSpacing: "0.06em" }}>{e.role}</p>
                  <p className="font-mono" style={{ fontSize: "0.62rem", letterSpacing: "0.18em", color: "var(--text-dim)", marginTop: 3 }}>
                    {e.company} · {e.period}
                  </p>
                </div>
              </div>
              <span className="font-mono" style={{ fontSize: "0.6rem", letterSpacing: "0.22em", color: e.status === "ACTIVE" ? "var(--green)" : "var(--text-mute)" }}>
                ◉ {e.status}
              </span>
            </summary>
            <div className="p-6" style={{ paddingTop: 0 }}>
              <ul style={{ listStyle: "none", marginBottom: "1.1rem" }}>
                {e.bullets.map((b, j) => (
                  <li key={j} className="flex gap-3" style={{ color: "var(--text-dim)", fontSize: "0.95rem", lineHeight: 1.7, marginBottom: 6 }}>
                    <span style={{ color: "var(--primary)" }}>▸</span>{b}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-2">
                {e.tags.map((t) => <span key={t} className="chip" style={{ fontSize: "0.58rem", padding: "0.3rem 0.7rem" }}>{t}</span>)}
              </div>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

function Transmissions() {
  return (
    <section className="w-full max-w-5xl mx-auto px-6 py-32">
      <p className="reveal hud-label" style={{ marginBottom: "1.1rem" }}>OUTBOUND TRANSMISSIONS</p>
      <h2 className="reveal font-display" style={{ fontSize: "var(--text-section)", fontWeight: 800, marginBottom: "0.9rem" }}>
        WHAT I BROADCAST.<br />
        <span className="neon">REAL NUMBERS.</span> REAL BUILDS.
      </h2>
      <p className="reveal" style={{ color: "var(--text-dim)", marginBottom: "2.5rem", maxWidth: "36rem", lineHeight: 1.7 }}>
        Weekly AI engineering learnings on LinkedIn — every post backed by something
        actually shipped that week.
      </p>

      {/* stat strip — benchmark style */}
      <div className="reveal bench-strip">
        <div className="bench-strip-cell"><p className="v">208</p><p className="l">PEAK REACTIONS</p></div>
        <div className="bench-strip-cell"><p className="v">526</p><p className="l">TOTAL REACTIONS</p></div>
        <div className="bench-strip-cell"><p className="v">71</p><p className="l">COMMENTS</p></div>
        <div className="bench-strip-cell"><p className="v">1×</p><p className="l">WEEKLY DROPS</p></div>
      </div>

      {/* row table — highlighted hot row, big number column */}
      <div className="reveal bench-table">
        {TRANSMISSIONS.map((p, i) => (
          <a
            key={i}
            href={LINKEDIN}
            target="_blank" rel="noopener noreferrer"
            className={`bench-row ${p.likes === "208" ? "hot" : ""}`}
          >
            <div className="cell-label">
              <span className="cell-icon">{["◈", "▲", "✦"][i % 3]}</span>
              <div>
                <p className="font-mono" style={{ fontSize: "0.56rem", letterSpacing: "0.22em", color: "var(--cyan)" }}>TX-{String(i + 1).padStart(3, "0")}</p>
                <p className="font-display" style={{ fontSize: "0.74rem", fontWeight: 700, letterSpacing: "0.08em", marginTop: 3, textTransform: "uppercase" }}>{p.tag}</p>
              </div>
            </div>
            <div className="cell-body">{p.excerpt}</div>
            <div className="cell-num">{p.likes}</div>
          </a>
        ))}
      </div>

      {/* centered CTA + mono sublinks — benchmark style */}
      <div className="reveal bench-footer">
        <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" className="btn-grid">
          FOLLOW THE BROADCAST →
        </a>
        <p className="bench-footer-links">#0TO100XENGINEER · WEEKLY DROPS · LINKEDIN</p>
      </div>
    </section>
  );
}

function Comms() {
  return (
    <footer id="comms" className="w-full max-w-5xl mx-auto px-6 py-32 text-center">
      <p className="reveal hud-label mx-auto" style={{ marginBottom: "1.1rem", justifyContent: "center" }}>OPEN CHANNEL</p>
      <h2 className="reveal font-display" style={{ fontSize: "var(--text-section)", fontWeight: 800, marginBottom: "2.5rem" }}>
        LET&apos;S BUILD SOMETHING<br /><span className="neon">THAT THINKS.</span>
      </h2>
      <div className="reveal flex flex-wrap gap-4 justify-center" style={{ marginBottom: "4rem" }}>
        <a href="mailto:dev.sra2180@gmail.com" className="btn-grid">
          <Envelope size={14} weight="bold" /> TRANSMIT MESSAGE
        </a>
        <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" className="btn-grid-ghost">
          <LinkedinLogo size={14} weight="fill" /> LINKEDIN
        </a>
        <a href="https://github.com/dev2180" target="_blank" rel="noopener noreferrer" className="btn-grid-dim">
          <GithubLogo size={14} weight="fill" /> GITHUB
        </a>
      </div>
      <p className="font-mono" style={{ fontSize: "0.6rem", letterSpacing: "0.24em", color: "var(--text-mute)" }}>
        © 2026 DEV SHARMA · GRID OS · NEXT.JS + GSAP + WEB AUDIO
      </p>
    </footer>
  );
}

// ─── PAGE ────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <main className="overflow-x-hidden w-full">
      <Nav />
      <Hero />
      <Achievements />
      <Marquee />
      <Missions />
      <Demo />
      <CareerLog />
      <Transmissions />
      <Comms />
    </main>
  );
}
