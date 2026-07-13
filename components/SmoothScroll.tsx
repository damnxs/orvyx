"use client";

import { useSmoothScroll } from "@/lib/hooks";

/** Mounts once per editorial layout to enable Lenis smooth scrolling. */
export default function SmoothScroll() {
  useSmoothScroll();
  return null;
}
