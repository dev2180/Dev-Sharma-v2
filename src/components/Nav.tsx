import Link from "next/link";
import { GithubLogo, LinkedinLogo } from "@/components/ClientIcons";

const LINKEDIN = "https://www.linkedin.com/in/dev-sharma-a33214256/";

export function Nav() {
  return (
    <nav className="navbar-grid">
      <Link href="/" className="font-display flex items-center gap-2" style={{ textDecoration: "none", color: "var(--text)", fontSize: "0.95rem", fontWeight: 800, letterSpacing: "0.14em" }}>
        <span className="neon" style={{ fontSize: "0.8rem" }}>◢◤</span>
        DEV//SHARMA
      </Link>
      <div className="flex items-center" style={{ gap: "0.25rem" }}>
        {[["MISSIONS","/#missions"],["DEMO","/#demo"],["LOG","/#log"],["COMMS","/#comms"]].map(([l, h]) => (
          <Link key={l} href={h} className="nav-link-grid">{l}</Link>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <a href="https://github.com/dev2180" target="_blank" rel="noopener noreferrer" aria-label="GitHub"
          className="flex items-center justify-center"
          style={{ width: 32, height: 32, border: "1px solid var(--line-dim)", color: "var(--text-dim)", background: "rgba(255,255,255,0.02)" }}>
          <GithubLogo size={14} weight="fill" />
        </a>
        <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
          className="flex items-center justify-center"
          style={{ width: 32, height: 32, border: "1px solid var(--line-dim)", color: "var(--text-dim)", background: "rgba(255,255,255,0.02)" }}>
          <LinkedinLogo size={14} weight="fill" />
        </a>
        <a
          href="https://docs.google.com/document/d/18qKvb34XjSTxdSJBjIRYYcfWa9R1MZS5/edit?usp=sharing&ouid=101310281811549086582&rtpof=true&sd=true"
          target="_blank" rel="noopener noreferrer" className="btn-grid" style={{ padding: "0.5rem 1.1rem", fontSize: "0.66rem" }}>
          RESUME
        </a>
      </div>
    </nav>
  );
}
