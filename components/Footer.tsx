import Link from "next/link";

const COLS: { title: string; links: { label: string; href: string; soon?: boolean }[] }[] = [
  {
    title: "Protocol",
    links: [
      { label: "About", href: "/about" },
      { label: "Documentation", href: "/docs" },
      { label: "Whitepaper", href: "/whitepaper" },
      { label: "Prophecies", href: "/prophecies", soon: true },
    ],
  },
  {
    title: "Network",
    links: [
      { label: "Launch App", href: "#" },
      { label: "X", href: "https://x.com" },
      { label: "Mirror", href: "#" },
      { label: "Governance", href: "#", soon: true },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/8 px-6 pb-14 pt-24 md:px-10">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-col justify-between gap-14 md:flex-row">
          <div className="max-w-sm">
            <div className="temple text-2xl text-white">ORVYX</div>
            <p className="mt-5 text-sm leading-relaxed text-ash">
              The future isn&apos;t predicted. It is remembered.
            </p>
          </div>
          <div className="flex gap-20">
            {COLS.map((c) => (
              <div key={c.title}>
                <div className="eyebrow mb-6">{c.title}</div>
                <ul className="space-y-3.5">
                  {c.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        href={l.href}
                        className="inline-flex items-center gap-2 text-sm text-ash transition-colors duration-300 hover:text-white"
                      >
                        {l.label}
                        {l.soon && <span className="text-[9px] tracking-widest text-obsidian/70">SOON</span>}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-20 flex flex-col items-start justify-between gap-4 border-t border-white/5 pt-8 text-xs text-ash md:flex-row md:items-center">
          <span>ORVYX · MMXXVI — All signals reserved.</span>
          <span className="tracking-[0.3em] uppercase">Classified // Authorized observers only</span>
        </div>
      </div>
    </footer>
  );
}
