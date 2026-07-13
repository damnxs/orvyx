"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  Reveal,
  SectionLabel,
  CodeCard,
  Progress,
  StatusBadge,
  Table,
  Sep,
  EASE,
} from "@/components/editorial";
import { scrollToId } from "@/lib/hooks";
import { motion } from "framer-motion";

const SECTIONS = [
  { id: "introduction", label: "Introduction" },
  { id: "architecture", label: "Architecture" },
  { id: "oracle-core", label: "ORVYX Core" },
  { id: "observation-engine", label: "Observation Engine" },
  { id: "signal-layer", label: "Signal Layer" },
  { id: "consensus-engine", label: "Consensus Engine" },
  { id: "memory-layer", label: "Memory Layer" },
  { id: "synchronization", label: "Synchronization" },
  { id: "api", label: "API", soon: true },
  { id: "roadmap", label: "Roadmap" },
];

function H({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <h2
      id={id || undefined}
      className="temple mt-8 scroll-mt-28 text-white"
      style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)" }}
    >
      <Reveal>{children}</Reveal>
    </h2>
  );
}

const LAYERS = [
  { n: "VI", t: "Reveal Layer", d: "Returns coherent patterns to authorized observers.", tone: "cyan" as const },
  { n: "V", t: "Synchronization", d: "Aligns the live field with remembered history.", tone: "purple" as const },
  { n: "IV", t: "Memory Layer", d: "Persistent substrate of every signal ever observed.", tone: "purple" as const },
  { n: "III", t: "Consensus Engine", d: "Resolves contradictions across the observation mesh.", tone: "purple" as const },
  { n: "II", t: "Signal Layer", d: "Normalizes raw attention into typed signals.", tone: "purple" as const },
  { n: "I", t: "Observation Engine", d: "Ingests the five currents in real time.", tone: "purple" as const },
];

export default function DocsPage() {
  const [active, setActive] = useState("introduction");

  useEffect(() => {
    document.title = "Docs — ORVYX";
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-25% 0px -65% 0px", threshold: 0 }
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <main className="mx-auto max-w-[1400px] px-6 pb-32 pt-28 md:px-10">
      {/* Page header */}
      <div className="py-16 md:py-24">
        <Reveal>
          <div className="eyebrow mb-6 text-obsidian">Technical Reference</div>
        </Reveal>
        <Reveal delay={0.1}>
          <h1 className="temple text-white" style={{ fontSize: "clamp(2.5rem, 8vw, 6rem)" }}>
            Documentation
          </h1>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-ash">
            The operating manual for an entity that predates the manual. Read slowly.
          </p>
        </Reveal>
      </div>

      <div className="grid gap-16 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-24">
        {/* SIDEBAR */}
        <aside className="hidden lg:block">
          <div className="sticky top-28">
            <div className="eyebrow mb-6">On this page</div>
            <nav className="ed-sidebar-scroll max-h-[70vh] overflow-y-auto pr-2">
              <ul className="space-y-1 border-l border-white/8">
                {SECTIONS.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToId(s.id);
                      }}
                      className="relative block py-2 pl-5 text-sm transition-colors duration-300"
                    >
                      {active === s.id && (
                        <motion.span
                          layoutId="doc-active"
                          className="absolute -left-px top-1/2 h-5 w-px -translate-y-1/2 bg-obsidian"
                          transition={{ duration: 0.4, ease: EASE }}
                        />
                      )}
                      <span className={active === s.id ? "text-white" : "text-ash hover:text-white/80"}>
                        {s.label}
                        {s.soon && <span className="ml-2 text-[9px] tracking-widest text-obsidian/70">SOON</span>}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="mt-10 border-t border-white/8 pt-6">
              <div className="eyebrow mb-2">Version</div>
              <div className="text-sm text-white/80">v0.1.0 — Pre-dawn</div>
            </div>
          </div>
        </aside>

        {/* CONTENT */}
        <div className="min-w-0 space-y-28">
          {/* Introduction */}
          <section id="introduction" className="scroll-mt-28">
            <SectionLabel index="00">Introduction</SectionLabel>
            <H id="">What ORVYX is</H>
            <Reveal delay={0.15}>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-ash">
                ORVYX is a synchronization network for collective attention. It does not
                predict markets and it does not execute trades. It observes the five currents of human
                attention, remembers every signal that moves through them, and returns the resulting
                pattern — whole and undistorted — to anyone synchronized to the network.
              </p>
            </Reveal>
            <div className="mt-10 flex flex-wrap gap-3">
              <StatusBadge status="Mainnet — Observation only" tone="green" />
              <StatusBadge status="Consensus: online" tone="cyan" />
              <StatusBadge status="Spec v0.1" tone="ash" />
            </div>
            <div className="mt-10">
              <CodeCard file="orvyx.config.ts">
                <span className="tok-com">// Connect an observer client to the live field.</span>
                {"\n"}
                <span className="tok-kw">import</span> {"{ Orvyx }"} <span className="tok-kw">from</span> <span className="tok-str">"@orvyx/sdk"</span>
                {"\n\n"}
                <span className="tok-kw">const</span> orvyx = <span className="tok-kw">new</span> <span className="tok-fn">Orvyx</span>({"{"}
                {"\n"}  network: <span className="tok-str">"mainnet"</span>,
                {"\n"}  currents: [<span className="tok-str">"narrative"</span>, <span className="tok-str">"market"</span>, <span className="tok-str">"attention"</span>],
                {"\n"}  depth: <span className="tok-str">"full"</span>,
                {"\n"}
                {"}"})
                {"\n\n"}
                <span className="tok-kw">await</span> orvyx.<span className="tok-fn">synchronize</span>()
              </CodeCard>
            </div>
          </section>

          {/* Architecture */}
          <section id="architecture" className="scroll-mt-28">
            <SectionLabel index="01">Architecture</SectionLabel>
            <H id="">Six layers, one field</H>
            <Reveal delay={0.15}>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-ash">
                Attention enters at the base and is refined upward, one layer at a time, until it emerges
                as a legible whole. Each layer is stateless on its own — meaning lives only in the full
                stack.
              </p>
            </Reveal>
            <div className="mt-10 space-y-px">
              {LAYERS.map((l) => (
                <Reveal key={l.n}>
                  <div className="flex items-center gap-6 rounded-lg border border-white/8 bg-white/[0.012] px-6 py-5">
                    <span className="eyebrow w-8 text-obsidian">{l.n}</span>
                    <div className="flex-1">
                      <div className="text-sm uppercase tracking-[0.18em] text-white">{l.t}</div>
                      <div className="mt-1 text-xs text-ash">{l.d}</div>
                    </div>
                    <span className={`h-1.5 w-1.5 rounded-full ${l.tone === "cyan" ? "bg-whisper" : "bg-obsidian"}`} />
                  </div>
                </Reveal>
              ))}
            </div>
          </section>

          {/* ORVYX Core */}
          <section id="oracle-core" className="scroll-mt-28">
            <SectionLabel index="02">ORVYX Core</SectionLabel>
            <H id="">The orchestrator</H>
            <Reveal delay={0.15}>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-ash">
                The Core does not store data and does not generate signals. It is a pure scheduler — the
                hand that keeps every layer breathing in phase. When the network is healthy, the Core is
                silent.
              </p>
            </Reveal>
            <div className="mt-10 grid gap-8 md:grid-cols-2">
              <Progress value={92} label="Mesh uptime (90d)" />
              <Progress value={88} label="Phase coherence" />
            </div>
            <div className="mt-10">
              <CodeCard file="core/manifest.json">{`{
  "core": {
    "cycle": 4.2,
    "layers": 6,
    "drift_tolerance": 0.003,
    "state": "synchronized"
  }
}`}</CodeCard>
            </div>
          </section>

          {/* Observation Engine */}
          <section id="observation-engine" className="scroll-mt-28">
            <SectionLabel index="03">Observation Engine</SectionLabel>
            <H id="">Where attention enters</H>
            <Reveal delay={0.15}>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-ash">
                A distributed mesh of observers ingests the five currents continuously. Each observer is
                unprivileged on its own; signal emerges only from their overlap.
              </p>
            </Reveal>
            <div className="mt-8 flex flex-wrap gap-3">
              <StatusBadge status="Ingest: 4.2M signals / day" tone="cyan" />
              <StatusBadge status="Observers: 1,184 active" tone="purple" />
            </div>
          </section>

          {/* Signal Layer */}
          <section id="signal-layer" className="scroll-mt-28">
            <SectionLabel index="04">Signal Layer</SectionLabel>
            <H id="">A single grammar</H>
            <Reveal delay={0.15}>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-ash">
                Raw attention is chaotic. The Signal Layer reduces it to a typed, comparable unit — the
                <span className="text-white"> Signal</span> — so that contradiction and consensus become measurable.
              </p>
            </Reveal>
            <div className="mt-10">
              <Table
                head={["Field", "Type", "Description"]}
                rows={[
                  [<span className="text-white">current</span>, <span className="text-whisper">enum</span>, <span className="text-ash">One of the five attention currents.</span>],
                  [<span className="text-white">intensity</span>, <span className="text-whisper">f32</span>, <span className="text-ash">Normalized 0.0 – 1.0 concentration.</span>],
                  [<span className="text-white">drift</span>, <span className="text-whisper">f32</span>, <span className="text-ash">Delta from the 24h consensus mean.</span>],
                  [<span className="text-white">provenance</span>, <span className="text-whisper">hash</span>, <span className="text-ash">Observer-set signature.</span>],
                ]}
              />
            </div>
          </section>

          {/* Consensus Engine */}
          <section id="consensus-engine" className="scroll-mt-28">
            <SectionLabel index="05">Consensus Engine</SectionLabel>
            <H id="">Truth without authority</H>
            <Reveal delay={0.15}>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-ash">
                Contradictory observations are not discarded — they are weighed. The Consensus Engine
                produces a single Echo: the shape the network agrees the field is currently taking.
              </p>
            </Reveal>
            <div className="mt-10 grid gap-8 md:grid-cols-2">
              <Progress value={97} label="Agreement across mesh" />
              <Progress value={71} label="Echo stability (entropy)" />
            </div>
          </section>

          {/* Memory Layer */}
          <section id="memory-layer" className="scroll-mt-28">
            <SectionLabel index="06">Memory Layer</SectionLabel>
            <H id="">Nothing observed is lost</H>
            <Reveal delay={0.15}>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-ash">
                Memory is not an archive. It is the substrate ORVYX thinks within. Every signal ever
                observed remains addressable, and every new signal is read against the entire remembered
                field.
              </p>
            </Reveal>
            <div className="mt-10">
              <CodeCard file="memory/query.ts">
                <span className="tok-com">// Recall every time this pattern last condensed.</span>
                {"\n"}
                <span className="tok-kw">const</span> echoes = <span className="tok-kw">await</span> orvyx.memory.<span className="tok-fn">recall</span>({"{"}
                {"\n"}  pattern: signal.<span className="tok-fn">hash</span>(),
                {"\n"}  since: <span className="tok-str">"first-observation"</span>,
                {"\n"}
                {"}"})
              </CodeCard>
            </div>
          </section>

          {/* Synchronization */}
          <section id="synchronization" className="scroll-mt-28">
            <SectionLabel index="07">Synchronization</SectionLabel>
            <H id="">Becoming legible</H>
            <Reveal delay={0.15}>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-ash">
                To synchronize is to align your own attention with the remembered field. Synchronized
                observers do not receive predictions. They receive the pattern — and read it for
                themselves.
              </p>
            </Reveal>
            <div className="mt-10 grid gap-8 md:grid-cols-3">
              <Progress value={100} label="Phase 01 — Observe" />
              <Progress value={100} label="Phase 02 — Remember" />
              <Progress value={64} label="Phase 03 — Synchronize" />
            </div>
          </section>

          {/* API */}
          <section id="api" className="scroll-mt-28">
            <SectionLabel index="08">API</SectionLabel>
            <div className="flex flex-wrap items-center gap-4">
              <H id="">Public read endpoints</H>
              <StatusBadge status="Coming Soon" tone="ash" />
            </div>
            <Reveal delay={0.15}>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-ash">
                A read-only REST + streaming surface is being prepared for synchronized observers. It will
                expose Echo, Drift, and Consensus endpoints under signed observer keys.
              </p>
            </Reveal>
            <div className="mt-10">
              <CodeCard file="api/preview.sh">{`# Available at mainnet launch.
curl https://api.orvyx.io/v1/echo \\
  -H "x-observer-key: $ORVYX_KEY"`}</CodeCard>
            </div>
          </section>

          {/* Roadmap */}
          <section id="roadmap" className="scroll-mt-28">
            <SectionLabel index="09">Roadmap</SectionLabel>
            <H id="">Toward full synchronization</H>
            <div className="mt-10 space-y-10">
              {[
                { p: "Observation mesh", v: 100, s: "Live" },
                { p: "Memory substrate", v: 100, s: "Live" },
                { p: "Consensus engine", v: 92, s: "Hardening" },
                { p: "Observer synchronization", v: 64, s: "In progress" },
                { p: "Public read API", v: 28, s: "Building" },
                { p: "Reveal protocol", v: 8, s: "Research" },
              ].map((r) => (
                <Reveal key={r.p}>
                  <Progress value={r.v} label={r.p} />
                </Reveal>
              ))}
            </div>
          </section>

          <Sep />
          <div className="pt-8">
            <p className="text-sm text-ash">
              Need the formal specification?{" "}
              <a href="/whitepaper" className="text-white underline-offset-4 hover:underline">
                Read the Whitepaper →
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
