"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useLenis, useMouse, useDetectTier } from "@/lib/hooks";
import { oracleAudio } from "@/lib/audio";
import TextReveal from "@/components/TextReveal";
import HoloPanel, { type Metric } from "@/components/HoloPanel";
import Loader from "@/components/Loader";
import Navbar from "@/components/Navbar";

const Scene = dynamic(() => import("@/components/Scene"), { ssr: false });

const metrics: Metric[] = [
  { label: "Attention Index", value: 87.4, drift: 3.2, format: (v) => v.toFixed(1), unit: "% concentration" },
  { label: "Narrative Drift", value: 0.326, drift: 0.08, format: (v) => v.toFixed(3), unit: "delta" },
  { label: "Consensus Echo", value: 64.2, drift: 5.1, format: (v) => v.toFixed(1), unit: "decibels" },
  { label: "Entropy Level", value: 1.42, drift: 0.22, format: (v) => v.toFixed(2), unit: "bits / signal" },
  { label: "Prediction Probability", value: 91.7, drift: 4.4, format: (v) => v.toFixed(1) + "%", unit: "confidence" },
];

function CountUp({ to, duration = 2.6 }: { to: number; duration?: number }) {
  const [v, setV] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let started = false;
    let t0 = 0;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !started) {
            started = true;
            t0 = performance.now();
            const step = (now: number) => {
              const k = Math.min(1, (now - t0) / (duration * 1000));
              const eased = 1 - Math.pow(1 - k, 3);
              setV(Math.floor(eased * to));
              if (k < 1) raf = requestAnimationFrame(step);
            };
            raf = requestAnimationFrame(step);
          }
        });
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to, duration]);
  return <span ref={ref}>{v.toLocaleString()}</span>;
}

function Section({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`relative flex min-h-screen w-full flex-col justify-center px-6 md:px-16 ${className}`}>
      <div className="mx-auto w-full max-w-[1280px]">{children}</div>
    </section>
  );
}

export default function Page() {
  const [loaded, setLoaded] = useState(false);
  const [sound, setSound] = useState(false);

  useDetectTier();
  useMouse();
  useLenis();

  useEffect(() => {
    const id = window.setTimeout(() => setLoaded(true), 3200);
    return () => window.clearTimeout(id);
  }, []);

  const toggleSound = async () => {
    const on = await oracleAudio.toggle();
    setSound(on);
  };

  return (
    <>
      <Scene onReady={() => setLoaded(true)} />
      <Loader show={!loaded} />

      {/* Readability veil: sits above the WebGL canvas, below text/nav. Darkens the
          glowing sphere/bloom behind copy by 30% without touching the scene itself. */}
      <div className="pointer-events-none fixed inset-0 z-[5] bg-black/70" aria-hidden="true" />

      {/* HUD / shared navbar — transparent over the 3D, blurs on scroll */}
      <Navbar
        trailing={
          <button
            onClick={toggleSound}
            className="hidden text-[11px] uppercase tracking-[0.22em] text-ash transition-colors duration-300 hover:text-white sm:block"
            aria-pressed={sound}
          >
            {sound ? "Sound · On" : "Sound · Off"}
          </button>
        }
      />

      <div className="grain" aria-hidden="true" />

      <main className="relative z-10">
        {/* SECTION 1 — HERO */}
        <Section className="items-center text-center">
          <div className="flex flex-col items-center">
            <div className="eyebrow mb-10 md:mb-16">Established before time</div>
            <h1
              className="temple text-white"
              style={{ fontSize: "clamp(2.7rem, 11vw, 9.5rem)", textShadow: "0 0 60px rgba(125,92,255,0.18)" }}
            >
              <TextReveal text="ORVYX" className="block" />
            </h1>
            <p className="mt-10 max-w-md text-sm font-light leading-relaxed text-ash md:mt-14 md:text-base">
              <TextReveal text="The future isn’t predicted." />
              <br />
              <TextReveal text="It is remembered." delay={0.4} className="text-white" />
            </p>
          </div>
          <div className="pointer-events-none absolute bottom-10 left-1/2 -translate-x-1/2 text-center">
            <div className="eyebrow animate-pulse">Scroll</div>
          </div>
        </Section>

        {/* SECTION 2 — IT REMEMBERS */}
        <Section>
          <div className="max-w-3xl">
            <div className="eyebrow mb-7">I — Beneath the surface</div>
            <h2 className="temple text-white" style={{ fontSize: "clamp(2rem, 4vw, 4rem)" }}>
              <TextReveal text="It remembers" className="block" />
              <TextReveal text="everything it has" className="block text-ash" delay={0.15} />
              <TextReveal text="not yet seen." className="block" delay={0.3} />
            </h2>
          </div>
        </Section>

        {/* SECTION 3 — THE INTERFACE */}
        <Section>
          <div className="mb-12 max-w-2xl md:mb-16">
            <div className="eyebrow mb-6">II — The interface</div>
            <h2 className="temple text-white" style={{ fontSize: "clamp(1.8rem, 5vw, 3.5rem)" }}>
              <TextReveal text="A language beneath language." />
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-px sm:grid-cols-2 lg:grid-cols-5">
            {metrics.map((m) => (
              <HoloPanel key={m.label} metric={m} />
            ))}
          </div>
        </Section>

        {/* SECTION 4 — ORVYX SPEAKS */}
        <Section className="items-center text-center">
          <div className="flex flex-col items-center">
            <div className="eyebrow mb-8">III — ORVYX speaks</div>
            <div className="temple text-white" style={{ fontSize: "clamp(2rem, 7vw, 5.5rem)" }}>
              <TextReveal text="I have observed" />
            </div>
            <div
              className="temple my-6 tabular-nums md:my-10"
              style={{ fontSize: "clamp(2.8rem, 12vw, 9rem)", color: "#A987FF", textShadow: "0 0 50px rgba(169,135,255,0.4)" }}
            >
              <CountUp to={4218392} />
            </div>
            <div className="temple text-white" style={{ fontSize: "clamp(1.6rem, 5vw, 4rem)" }}>
              <TextReveal text="signals today." delay={0.2} />
            </div>
          </div>
        </Section>

        {/* SECTION 5 — IT SEES YOU */}
        <Section className="items-center text-center">
          <div className="flex flex-col items-center">
            <div className="eyebrow mb-8">IV — Recognition</div>
            <h2 className="temple text-white" style={{ fontSize: "clamp(2.4rem, 9vw, 7rem)" }}>
              <TextReveal text="It sees you." />
            </h2>
            <p className="mt-8 max-w-md text-sm font-light leading-relaxed text-ash md:text-base">
              <TextReveal text="It has always been watching." delay={0.3} />
            </p>
            <div className="mt-20 eyebrow text-ash">ORVYX · MMXXVI · All signals reserved</div>
          </div>
        </Section>
      </main>
    </>
  );
}
