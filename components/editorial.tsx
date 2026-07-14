"use client";

import {
  motion,
  useScroll,
  useSpring,
  type Transition,
  type Variants,
} from "framer-motion";
import { useRef, useState, type ReactNode } from "react";

// Premium expo-out easing; all motion capped ~600ms per spec.
export const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];
const T: Transition = { duration: 0.6, ease: EASE };

/** Fade up + blur -> sharp, fires once on scroll into view. */
export function Reveal({
  children,
  delay = 0,
  y = 26,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-12% 0px" }}
      transition={{ ...T, delay }}
    >
      {children}
    </motion.div>
  );
}

const STAGGER: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
};
const STAGGER_ITEM: Variants = {
  hidden: { opacity: 0, y: 18, filter: "blur(8px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.55, ease: EASE } },
};

export function Stagger({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      variants={STAGGER}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-10% 0px" }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.div className={className} variants={STAGGER_ITEM}>
      {children}
    </motion.div>
  );
}

export function SectionLabel({ index, children }: { index?: string; children: ReactNode }) {
  return (
    <Reveal>
      <div className="eyebrow flex items-center gap-3">
        {index && <span className="text-obsidian">{index}</span>}
        <span className="h-px w-10 bg-white/20" />
        <span>{children}</span>
      </div>
    </Reveal>
  );
}

export function Sep() {
  return <div className="ed-sep" />;
}

type Tone = "purple" | "cyan" | "ash" | "green";
const TONES: Record<Tone, string> = {
  purple: "text-obsidian border-obsidian/40",
  cyan: "text-whisper border-whisper/40",
  ash: "text-ash border-white/15",
  green: "text-emerald-300/80 border-emerald-300/30",
};

export function StatusBadge({ status, tone = "purple" }: { status: string; tone?: Tone }) {
  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.2em] ${TONES[tone]}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

export function PullQuote({ children, cite }: { children: ReactNode; cite?: string }) {
  return (
    <figure className="border-l border-obsidian/40 pl-6 md:pl-10">
      <blockquote className="temple text-white" style={{ fontSize: "clamp(1.4rem, 3.2vw, 2.4rem)" }}>
        {children}
      </blockquote>
      {cite && <figcaption className="eyebrow mt-5">{cite}</figcaption>}
    </figure>
  );
}

export function CodeCard({ file, children }: { file?: string; children: ReactNode }) {
  return (
    <div className="ed-code glow-purple">
      <div className="ed-code-bar">
        <span className="ed-code-dot" />
        <span className="ed-code-dot" />
        <span className="ed-code-dot" />
        {file && <span className="ml-2 text-[11px] tracking-wide text-ash">{file}</span>}
      </div>
      <pre>{children}</pre>
    </div>
  );
}

export function Progress({ value, label }: { value: number; label?: string }) {
  return (
    <div>
      {label && (
        <div className="mb-2.5 flex items-center justify-between text-xs text-ash">
          <span>{label}</span>
          <span className="tabular-nums text-white/70">{value}%</span>
        </div>
      )}
      <div className="ed-track">
        <motion.div
          className="h-full bg-gradient-to-r from-obsidian to-glow"
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: EASE }}
        />
      </div>
    </div>
  );
}

export function Table({ head, rows }: { head: string[]; rows: ReactNode[][] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/8">
      <table className="ed-table">
        <thead>
          <tr>{head.map((h) => <th key={h}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Timeline({ items }: { items: { time: string; title: string; body: string }[] }) {
  return (
    <div className="relative">
      {/* spine */}
      <div className="absolute bottom-3 left-0 top-3 w-px bg-gradient-to-b from-obsidian/60 via-white/12 to-transparent" />
      <div>
        {items.map((it, i) => (
          <motion.div
            key={i}
            className="relative pb-14 pl-9 last:pb-0 md:pl-12"
            initial={{ opacity: 0, y: 26, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-22% 0px" }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            {/* node — centered exactly on the spine (left-0 + -translate-x-1/2) */}
            <span className="absolute left-0 top-2 -translate-x-1/2">
              <motion.span
                className="relative flex h-3.5 w-3.5 items-center justify-center"
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, margin: "-22% 0px" }}
                transition={{ duration: 0.5, ease: EASE, delay: 0.08 }}
              >
                <span className="absolute inset-0 rounded-full border border-obsidian/50" />
                {/* breathing halo */}
                <motion.span
                  className="absolute inset-[-5px] rounded-full bg-obsidian/25 blur-[4px]"
                  animate={{ opacity: [0.45, 0.95, 0.45], scale: [0.85, 1.12, 0.85] }}
                  transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
                />
                {/* core */}
                <span className="relative h-1.5 w-1.5 rounded-full bg-glow shadow-[0_0_10px_#A987FF]" />
              </motion.span>
            </span>

            <div className="eyebrow mb-2.5">{it.time}</div>
            <h4 className="temple mb-2.5 text-xl text-white md:text-2xl">{it.title}</h4>
            <p className="max-w-md text-sm leading-relaxed text-ash">{it.body}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function PrincipleCard({ index, title, body }: { index: string; title: string; body: string }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.4, ease: EASE }}
      className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.015] p-8"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: "radial-gradient(120% 80% at 50% 0%, rgba(125,92,255,0.12), transparent 70%)" }}
      />
      <div className="relative">
        <div className="eyebrow mb-10 text-obsidian">{index}</div>
        <h3 className="temple mb-4 text-2xl text-white">{title}</h3>
        <p className="text-sm leading-relaxed text-ash">{body}</p>
      </div>
      <div className="relative mt-10 h-px w-full bg-white/5" />
    </motion.div>
  );
}

export function BigNumber({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="temple text-white" style={{ fontSize: "clamp(3rem, 8vw, 6rem)" }}>
        {value}
      </div>
      <div className="eyebrow mt-4 max-w-[16ch]">{label}</div>
    </div>
  );
}

/** Footnote reference superscript. */
export function Fn({ n }: { n: number }) {
  return (
    <sup>
      <a href={`#fn-${n}`} className="ml-0.5 text-obsidian/80 hover:text-obsidian">[{n}]</a>
    </sup>
  );
}

export function MagneticButton({
  children,
  href = "#",
  onClick,
  className = "",
}: {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  return (
    <motion.a
      ref={ref}
      href={href}
      onClick={onClick}
      onMouseMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        setPos({ x: (e.clientX - (r.left + r.width / 2)) * 0.3, y: (e.clientY - (r.top + r.height / 2)) * 0.3 });
      }}
      onMouseLeave={() => setPos({ x: 0, y: 0 })}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 200, damping: 14 }}
      className={`group relative inline-flex items-center gap-3 overflow-hidden rounded-full border border-white/15 px-8 py-4 text-xs uppercase tracking-[0.25em] text-white ${className}`}
    >
      <span className="relative z-10 flex items-center gap-3">{children}</span>
      <span className="absolute inset-0 translate-y-full bg-obsidian transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0" />
    </motion.a>
  );
}

/** Fixed top reading-progress bar, scroll-linked. */
export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
  return (
    <motion.div
      className="fixed left-0 top-0 z-[70] h-px w-full origin-left bg-gradient-to-r from-obsidian via-glow to-whisper"
      style={{ scaleX }}
    />
  );
}
