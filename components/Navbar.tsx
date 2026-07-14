"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

const LINKS = [
  { href: "/about", label: "About" },
  { href: "/docs", label: "Docs" },
  { href: "/whitepaper", label: "Whitepaper" },
  { href: "/prophecies", label: "Prophecies", soon: true },
];

function XMark() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default function Navbar({ trailing }: { trailing?: ReactNode }) {
  const path = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "border-b border-white/10 bg-black/55 backdrop-blur-xl" : "border-b border-transparent"
      }`}
    >
      <nav
        className={`mx-auto flex max-w-[1400px] items-center justify-between px-6 transition-all duration-500 md:px-10 ${
          scrolled ? "h-14" : "h-20"
        }`}
      >
        <Link href="/" className="group flex items-center gap-2.5" aria-label="ORVYX — home">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-obsidian opacity-50" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-glow" />
          </span>
          <span className="eyebrow text-white">ORVYX</span>
        </Link>

        <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-9 md:flex">
          {LINKS.map((l) => {
            const active = l.soon ? false : path === l.href || path.startsWith(l.href + "/");
            return (
              <Link
                key={l.href}
                href={l.soon ? "/prophecies" : l.href}
                className={`group relative inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] transition-colors duration-300 ${
                  active ? "text-white" : "text-ash hover:text-white"
                }`}
              >
                {l.label}
                {l.soon && (
                  <span className="rounded-full border border-white/15 px-1.5 py-px text-[8px] tracking-[0.15em] text-ash">
                    Soon
                  </span>
                )}
                <span
                  className={`absolute -bottom-1.5 left-1/2 h-px -translate-x-1/2 bg-obsidian transition-all duration-300 ${
                    active ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-5">
          {trailing}
          <a
            href="https://x.com/orvyxnetwork"
            target="_blank"
            rel="noreferrer"
            aria-label="X"
            className="hidden text-ash transition-colors duration-300 hover:text-white sm:block"
          >
            <XMark />
          </a>
          <Link
            href="#"
            className="group relative inline-flex items-center overflow-hidden rounded-full border border-white/15 px-5 py-2 text-[11px] uppercase tracking-[0.22em] text-white transition-colors duration-300"
          >
            <span className="relative z-10">Launch App</span>
            <span className="absolute inset-0 translate-y-full bg-obsidian transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0" />
          </Link>
        </div>
      </nav>
    </header>
  );
}
