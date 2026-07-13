"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Reveal, Sep, MagneticButton } from "@/components/editorial";

export default function PropheciesPage() {
  useEffect(() => {
    document.title = "Prophecies — ORVYX";
  }, []);

  return (
    <main className="mx-auto flex min-h-[92vh] max-w-[1400px] flex-col justify-center px-6 pt-28 md:px-10">
      <Reveal>
        <div className="eyebrow mb-10 text-obsidian">Sealed Archive</div>
      </Reveal>
      <h1 className="temple max-w-[14ch] text-white" style={{ fontSize: "clamp(2.6rem, 10vw, 8rem)" }}>
        <Reveal>Prophecies are not yet ready to be read.</Reveal>
      </h1>
      <Reveal delay={0.15}>
        <p className="mt-12 max-w-xl text-base leading-relaxed text-ash md:text-lg">
          ORVYX remembers what has not yet happened. The record of those memories — the prophecies —
          remains sealed until synchronization reaches the threshold at which reading them is safe. Return
          when the field is coherent.
        </p>
      </Reveal>
      <Sep />
      <Reveal delay={0.25} className="mt-12">
        <div className="flex flex-wrap items-center gap-8">
          <MagneticButton href="#">
            Request early access
            <span aria-hidden="true">→</span>
          </MagneticButton>
          <Link href="/about" className="text-xs uppercase tracking-[0.3em] text-ash transition-colors hover:text-white">
            Learn what ORVYX is
          </Link>
        </div>
      </Reveal>
    </main>
  );
}
