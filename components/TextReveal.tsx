"use client";

import { useEffect, useRef, type ElementType } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Props = {
  text: string;
  as?: ElementType;
  className?: string;
  delay?: number;
  stagger?: number;
  start?: string;
  end?: string;
  scrub?: boolean | number;
};

// Letter-by-letter reveal: opacity + y-translate + blur -> sharp, scrubbed to scroll.
export default function TextReveal({
  text,
  as: Tag = "span",
  className = "",
  delay = 0,
  stagger = 0.018,
  start = "top 85%",
  end = "top 45%",
  scrub = 1,
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const chars = el.querySelectorAll<HTMLElement>(".rl");
    const ctx = gsap.context(() => {
      gsap.fromTo(
        chars,
        { opacity: 0, y: "0.6em", filter: "blur(10px)" },
        {
          opacity: 1,
          y: "0em",
          filter: "blur(0px)",
          ease: "none",
          delay,
          stagger,
          scrollTrigger: {
            trigger: el,
            start,
            end,
            scrub: scrub === true ? 1 : scrub,
          },
        }
      );
    }, el);
    return () => ctx.revert();
  }, [text, delay, stagger, start, end, scrub]);

  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {text.split("").map((ch, i) => (
        <span key={i} className="rl" aria-hidden="true">
          {ch === " " ? " " : ch}
        </span>
      ))}
    </Tag>
  );
}
