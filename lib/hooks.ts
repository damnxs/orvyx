"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { shared } from "./state";

// Lenis smooth scroll wired into GSAP's ticker, + a master ScrollTrigger scrub
// timeline that writes progress into shared.progress for the whole experience.
export function useLenis() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.25,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
    });

    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Master progress: full document scroll -> 0..1.
    const proxy = { p: 0 };
    const tl = gsap.to(proxy, {
      p: 1,
      ease: "none",
      scrollTrigger: {
        trigger: document.documentElement,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.8,
      },
      onUpdate: () => {
        shared.progress = proxy.p;
      },
    });

    const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 400);

    return () => {
      window.clearTimeout(refresh);
      gsap.ticker.remove(tick);
      tl.kill();
      lenis.destroy();
      ScrollTrigger.getAll().forEach((s) => s.kill());
    };
  }, []);
}

// Pointer -> normalized target. Lerping happens once per frame in the scene.
export function useMouse() {
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      shared.mouseTarget.x = (e.clientX / window.innerWidth) * 2 - 1;
      shared.mouseTarget.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);
}

// Lenis smooth scroll only (no 3D progress timeline). Registers ScrollTrigger
// for editorial reveals and exposes the instance for anchor navigation.
export function useSmoothScroll() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true, wheelMultiplier: 1, touchMultiplier: 1.5 });
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 400);
    return () => {
      window.clearTimeout(refresh);
      gsap.ticker.remove(tick);
      lenis.destroy();
      (window as unknown as { __lenis?: Lenis }).__lenis = undefined;
    };
  }, []);
}

// Smooth-scroll to an element id via the shared Lenis instance.
export function scrollToId(id: string) {
  const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
  if (lenis) lenis.scrollTo(`#${id}`, { offset: -90 });
  else document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

// Detect mobile + reduced-motion into shared state.
export function useDetectTier() {
  useEffect(() => {
    const mqMobile = window.matchMedia("(max-width: 768px)");
    const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      shared.tier = mqMobile.matches ? "mobile" : "desktop";
      shared.reduced = mqReduce.matches;
    };
    apply();
    mqMobile.addEventListener("change", apply);
    mqReduce.addEventListener("change", apply);
    return () => {
      mqMobile.removeEventListener("change", apply);
      mqReduce.removeEventListener("change", apply);
    };
  }, []);
}
