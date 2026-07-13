"use client";

import { useEffect, useRef, useState } from "react";

export type Metric = {
  label: string;
  value: number;
  drift: number; // max wobble magnitude
  format: (v: number) => string;
  unit?: string;
};

export default function HoloPanel({ metric }: { metric: Metric }) {
  const [display, setDisplay] = useState(metric.value);
  const target = useRef(metric.value);

  useEffect(() => {
    let raf = 0;
    let last = 0;
    const tick = (t: number) => {
      if (t - last > 2200) {
        target.current = metric.value + (Math.random() - 0.5) * metric.drift * 2;
        last = t;
      }
      setDisplay((v) => v + (target.current - v) * 0.045);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [metric]);

  return (
    <div className="group relative px-6 py-7 md:px-7 md:py-9">
      <div className="pointer-events-none absolute inset-0 border border-white/10 transition-colors duration-700 group-hover:border-obsidian/40" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-obsidian/[0.04] to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
      {/* corner ticks */}
      <span className="pointer-events-none absolute left-0 top-0 h-2.5 w-2.5 border-l border-t border-obsidian/70" />
      <span className="pointer-events-none absolute right-0 top-0 h-2.5 w-2.5 border-r border-t border-obsidian/70" />
      <span className="pointer-events-none absolute bottom-0 left-0 h-2.5 w-2.5 border-b border-l border-obsidian/70" />
      <span className="pointer-events-none absolute bottom-0 right-0 h-2.5 w-2.5 border-b border-r border-obsidian/70" />

      <div className="eyebrow mb-7">{metric.label}</div>
      <div className="temple text-3xl text-white tabular-nums md:text-4xl">{metric.format(display)}</div>
      {metric.unit ? <div className="mt-3 text-[0.65rem] uppercase tracking-[0.3em] text-ash">{metric.unit}</div> : null}
    </div>
  );
}
