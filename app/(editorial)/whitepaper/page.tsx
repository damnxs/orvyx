"use client";

import { useEffect, type ReactNode } from "react";
import {
  Reveal,
  SectionLabel,
  Sep,
  PullQuote,
  BigNumber,
  Table,
  Timeline,
  Fn,
  StatusBadge,
  MagneticButton,
  ReadingProgress,
  Stagger,
  StaggerItem,
  EASE,
} from "@/components/editorial";
import { motion } from "framer-motion";

const PROTOCOL = [
  { n: "01", t: "Observe", d: "An observer joins the mesh and begins streaming attention." },
  { n: "02", t: "Attest", d: "Observations are signed and committed to the current cycle." },
  { n: "03", t: "Resolve", d: "Consensus weighs contradiction into a single Echo." },
  { n: "04", t: "Reveal", d: "The pattern is returned, undistorted, to synchronized observers." },
];

function Footnote({ n, children }: { n: number; children: ReactNode }) {
  return (
    <li id={`fn-${n}`} className="flex gap-3 text-xs leading-relaxed text-ash">
      <span className="text-obsidian/80">[{n}]</span>
      <span>{children}</span>
    </li>
  );
}

export default function WhitepaperPage() {
  useEffect(() => {
    document.title = "Whitepaper · ORVYX";
  }, []);

  return (
    <>
      <ReadingProgress />
      <main className="mx-auto max-w-[1400px] px-6 md:px-10">
        {/* HERO / COVER */}
        <section className="flex min-h-[92vh] flex-col justify-center pt-28">
          <Reveal>
            <div className="eyebrow mb-12 text-obsidian">Classified Document · Authorized Observers Only</div>
          </Reveal>
          <h1
            className="temple text-white"
            style={{ fontSize: "clamp(3rem, 13vw, 12rem)", textShadow: "0 0 80px rgba(125,92,255,0.16)" }}
          >
            <Reveal>Whitepaper</Reveal>
          </h1>
          <Reveal delay={0.15}>
            <p
              className="mt-12 max-w-2xl text-xl font-light leading-relaxed text-white/90 md:text-3xl"
              style={{ fontFamily: "var(--font-display), serif" }}
            >
              A formal account of the entity known as ORVYX, its origin, its architecture,
              and the protocol by which it remembers what has not yet happened.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="mt-16 flex flex-wrap items-center gap-x-10 gap-y-4 border-y border-white/8 py-6 text-xs uppercase tracking-[0.22em] text-ash">
              <span>Version <span className="text-white">0.1</span></span>
              <span>Drafted <span className="text-white">MMXXVI</span></span>
              <span>~ <span className="text-white">14 min</span> read</span>
              <span className="text-obsidian">Peer review · open</span>
            </div>
          </Reveal>
          <Reveal delay={0.4} className="mt-10">
            <MagneticButton href="#">
              Download PDF
              <span aria-hidden="true">↓</span>
            </MagneticButton>
          </Reveal>
        </section>

        <Sep />

        {/* ABSTRACT */}
        <section className="py-28 md:py-40">
          <div className="grid gap-12 md:grid-cols-[0.5fr_1fr] md:gap-24">
            <div className="md:sticky md:top-32 md:self-start">
              <SectionLabel index="§">Abstract</SectionLabel>
            </div>
            <div className="max-w-2xl space-y-6">
              <Reveal>
                <p
                  className="text-2xl font-light leading-relaxed text-white md:text-3xl"
                  style={{ fontFamily: "var(--font-display), serif", letterSpacing: "0.01em" }}
                >
                  We describe a synchronization network that observes collective attention across five
                  currents, retains every observed signal indefinitely, and returns the emergent pattern
                  to any observer able to read it.
                </p>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="text-base leading-relaxed text-ash">
                  ORVYX is not a forecasting machine. It makes no claims about the future and executes
                  no transactions. Its sole output is coherence: the shape that attention takes when
                  contradiction has been resolved and the whole remembered field is held in a single frame.
                  This document specifies the observation problem that motivates the system, the physics of
                  narrative it rests upon, the architecture that implements it, and the protocol by which
                  an observer becomes synchronized.<Fn n={1} />
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        <Sep />

        {/* THE OBSERVATION PROBLEM */}
        <section className="py-28 md:py-40">
          <div className="max-w-3xl">
            <SectionLabel index="I">The Observation Problem</SectionLabel>
            <Reveal delay={0.1}>
              <h2 className="temple mt-8 text-white" style={{ fontSize: "clamp(2rem, 5.5vw, 4rem)" }}>
                No single mind holds the field.
              </h2>
            </Reveal>
          </div>
          <div className="mt-16 grid gap-12 md:grid-cols-3">
            <Reveal>
              <BigNumber value="5" label="Currents of attention no instrument has unified until now." />
            </Reveal>
            <Reveal delay={0.1}>
              <BigNumber value="∞" label="Signals retained, nothing observed is ever discarded." />
            </Reveal>
            <Reveal delay={0.2}>
              <BigNumber value="0" label="Predictions issued. ORVYX remembers; it does not guess." />
            </Reveal>
          </div>
          <div className="mt-16 max-w-2xl">
            <Reveal>
              <p className="text-base leading-relaxed text-ash">
                Collective attention is the most concentrated force a civilization produces, yet it has
                never been held in a single coherent frame. Markets measure its shadow. Platforms harvest
                its exhaust. Narratives distort it the moment it forms. The observation problem is the
                absence of an instrument precise enough to resolve attention as it actually moves, without
                flattening it into a price or a metric.
              </p>
            </Reveal>
          </div>
        </section>

        <Sep />

        {/* ATTENTION ECONOMY */}
        <section className="py-28 md:py-40">
          <div className="grid gap-12 md:grid-cols-[0.5fr_1fr] md:gap-24">
            <div className="md:sticky md:top-32 md:self-start">
              <SectionLabel index="II">Attention Economy</SectionLabel>
            </div>
            <div className="max-w-2xl space-y-8">
              <Reveal>
                <h2 className="temple text-white" style={{ fontSize: "clamp(1.8rem, 4.5vw, 3rem)" }}>
                  The rarest material is where everyone is looking.
                </h2>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="text-base leading-relaxed text-ash">
                  Attention is finite, directional, and conserved. Where it gathers, the future condenses
                  before it arrives. An economy built on attention has so far been an economy of capture,
                  extracting focus and returning noise. ORVYX inverts the trade: it returns the
                  pattern of attention itself, intact, and lets the observer decide what to do with it.<Fn n={2} />
                </p>
              </Reveal>
              <Reveal delay={0.2}>
                <PullQuote cite="Field note 0042">
                  Attention does not flow toward value. Value crystallizes where attention has already gathered.
                </PullQuote>
              </Reveal>
            </div>
          </div>
        </section>

        <Sep />

        {/* NARRATIVE PHYSICS */}
        <section className="py-28 md:py-40">
          <div className="max-w-3xl">
            <SectionLabel index="III">Narrative Physics</SectionLabel>
            <Reveal delay={0.1}>
              <h2 className="temple mt-8 text-white" style={{ fontSize: "clamp(2rem, 5.5vw, 4rem)" }}>
                Stories obey forces.
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-8 text-base leading-relaxed text-ash">
                A narrative is not an opinion shared by many. It is a field state, a configuration of
                collective attention with measurable drift, momentum, and entropy. ORVYX treats
                narratives the way a physicist treats weather: not as something to believe, but as
                something with structure that can be observed, remembered, and compared across time.
              </p>
            </Reveal>
          </div>
          <div className="mt-14 overflow-hidden rounded-xl border border-white/8">
            <Table
              head={["Property", "Symbol", "What it measures"]}
              rows={[
                [<span className="text-white">Intensity</span>, <span className="text-whisper">I</span>, <span className="text-ash">Concentration of attention on one node.</span>],
                [<span className="text-white">Drift</span>, <span className="text-whisper">Δ</span>, <span className="text-ash">Velocity of the narrative away from consensus.</span>],
                [<span className="text-white">Echo</span>, <span className="text-whisper">Ω</span>, <span className="text-ash">How strongly the field reproduces the pattern.</span>],
                [<span className="text-white">Entropy</span>, <span className="text-whisper">S</span>, <span className="text-ash">Disorder remaining after consensus resolves.</span>],
              ]}
            />
          </div>
        </section>

        <Sep />

        {/* ORVYX ARCHITECTURE + PROTOCOL DIAGRAM */}
        <section className="py-28 md:py-40">
          <div className="max-w-3xl">
            <SectionLabel index="IV">ORVYX Architecture</SectionLabel>
            <Reveal delay={0.1}>
              <h2 className="temple mt-8 text-white" style={{ fontSize: "clamp(2rem, 5.5vw, 4rem)" }}>
                Six layers, observed upward.
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-8 max-w-2xl text-base leading-relaxed text-ash">
                Attention enters the mesh at the base and is refined layer by layer until it emerges as a
                legible whole. The system is fully specified in the technical documentation; what follows
                is the synchronization protocol by which an observer joins it.
              </p>
            </Reveal>
          </div>

          {/* Animated protocol diagram */}
          <div className="mt-16">
            <Stagger className="relative grid grid-cols-2 gap-6 md:grid-cols-4">
              {PROTOCOL.map((p, i) => (
                <StaggerItem key={p.n}>
                  <div className="relative h-full rounded-xl border border-white/8 bg-white/[0.012] p-6">
                    <div className="eyebrow text-obsidian">{p.n}</div>
                    <div className="temple mt-6 text-lg text-white">{p.t}</div>
                    <p className="mt-3 text-xs leading-relaxed text-ash">{p.d}</p>
                  </div>
                </StaggerItem>
              ))}
              <motion.div
                className="pointer-events-none absolute left-0 top-[58px] hidden h-px bg-gradient-to-r from-obsidian/60 via-glow/50 to-transparent md:block"
                style={{ width: "100%" }}
                initial={{ scaleX: 0, transformOrigin: "left" }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.1, ease: EASE }}
              />
            </Stagger>
          </div>
        </section>

        <Sep />

        {/* SYNC PROTOCOL / TOKEN UTILITY */}
        <section className="py-28 md:py-40">
          <div className="grid gap-12 md:grid-cols-[0.5fr_1fr] md:gap-24">
            <div className="md:sticky md:top-32 md:self-start">
              <SectionLabel index="V">Synchronization Protocol</SectionLabel>
            </div>
            <div className="max-w-2xl space-y-8">
              <Reveal>
                <h2 className="temple text-white" style={{ fontSize: "clamp(1.8rem, 4.5vw, 3rem)" }}>
                  Token Utility
                </h2>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="text-base leading-relaxed text-ash">
                  The ORVYX token does not grant predictions, yield, or governance over outcomes. It
                  grants one thing: the right to synchronize, to align an observer with the remembered
                  field and receive the pattern it produces. Supply is fixed; synchronization capacity is
                  not.<Fn n={3} />
                </p>
              </Reveal>
              <Reveal delay={0.2}>
                <Table
                  head={["Role", "Requirement"]}
                  rows={[
                    [<span className="text-white">Observe</span>, <span className="text-ash">Open, any node may stream attention.</span>],
                    [<span className="text-white">Synchronize</span>, <span className="text-ash">Bond OBSIDIAN to an observer key.</span>],
                    [<span className="text-white">Recall memory</span>, <span className="text-ash">Synchronized observers only.</span>],
                    [<span className="text-white">Attest to Echo</span>, <span className="text-ash">Synchronized + reputation threshold.</span>],
                  ]}
                />
              </Reveal>
            </div>
          </div>
        </section>

        <Sep />

        {/* FUTURE EXPANSION */}
        <section className="py-28 md:py-40">
          <div className="max-w-3xl">
            <SectionLabel index="VI">Future Expansion</SectionLabel>
            <Reveal delay={0.1}>
              <h2 className="temple mt-8 text-white" style={{ fontSize: "clamp(2rem, 5.5vw, 4rem)" }}>
                Toward a civilization that remembers itself.
              </h2>
            </Reveal>
          </div>
          <div className="mt-16">
            <Timeline
              items={[
                { time: "Phase 01", title: "Full observation mesh", body: "All five currents resolved in real time across a global observer set." },
                { time: "Phase 02", title: "Open synchronization", body: "Any observer may bond and align with the remembered field." },
                { time: "Phase 03", title: "Reveal protocol", body: "A standard for returning patterns to downstream systems without distortion." },
                { time: "Phase 04", title: "Inherited memory", body: "Cross-generational recall, a civilization able to read its own attention." },
              ]}
            />
          </div>
        </section>

        <Sep />

        {/* RISK */}
        <section className="py-28 md:py-40">
          <div className="grid gap-12 md:grid-cols-[0.5fr_1fr] md:gap-24">
            <div className="md:sticky md:top-32 md:self-start">
              <SectionLabel index="VII">Risk</SectionLabel>
            </div>
            <div className="max-w-2xl space-y-6">
              <Reveal>
                <p className="text-base leading-relaxed text-ash">
                  ORVYX returns a pattern, not a prescription. Acting on that pattern is the sole
                  responsibility of the observer. Observed risks include the following.
                </p>
              </Reveal>
              <div className="overflow-hidden rounded-xl border border-white/8">
                <Table
                  head={["Risk", "Posture"]}
                  rows={[
                    [<span className="text-white">Misreading the pattern</span>, <span className="text-ash">ORVYX offers coherence, not certainty.</span>],
                    [<span className="text-white">Observer capture</span>, <span className="text-ash">Decentralized mesh; no single party controls consensus.</span>],
                    [<span className="text-white">Memory integrity</span>, <span className="text-ash">Attested and replicated; finality is probabilistic.</span>],
                    [<span className="text-white">Early-stage protocol</span>, <StatusBadge status="v0.1" tone="ash" />],
                  ]}
                />
              </div>
            </div>
          </div>
        </section>

        <Sep />

        {/* DISCLAIMER + FOOTNOTES */}
        <section className="py-28 md:py-40">
          <div className="max-w-2xl space-y-12">
            <div>
              <SectionLabel index="VIII">Disclaimer</SectionLabel>
              <Reveal delay={0.1}>
                <p className="mt-8 text-sm leading-relaxed text-ash">
                  This document is a conceptual specification of a fictional protocol. It is not financial
                  advice, an offer to sell, or a guarantee of any outcome. Nothing observed, remembered, or
                  revealed by ORVYX constitutes a prediction of markets or events. Synchronization
                  grants access to a pattern, never to certainty.
                </p>
              </Reveal>
            </div>
            <div>
              <div className="eyebrow mb-6">Footnotes</div>
              <ol className="space-y-4">
                <Footnote n={1}>
                  The term &ldquo;synchronized&rdquo; is used in the systems-theoretic sense: phase-aligned with the
                  remembered field, not merely subscribed to a feed.
                </Footnote>
                <Footnote n={2}>
                  Capture-based attention economies are treated here as a degenerate case, not the
                  reference model.
                </Footnote>
                <Footnote n={3}>
                  Token mechanics are summarized; the full emission and bonding schedule appears in a
                  separate technical annex.
                </Footnote>
              </ol>
            </div>
            <Sep />
            <Reveal>
              <div className="flex flex-wrap items-center justify-between gap-6 pt-4">
                <span className="text-xs uppercase tracking-[0.3em] text-ash">End of document</span>
                <MagneticButton href="#">
                  Begin synchronization
                  <span aria-hidden="true">→</span>
                </MagneticButton>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
    </>
  );
}
