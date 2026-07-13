// Central palette + perf knobs. Colors per spec.
export const COLORS = {
  void: "#050505",
  coal: "#0B0B0B",
  text: "#FFFFFF",
  ash: "#8E8E93",
  obsidian: "#7D5CFF",
  glow: "#A987FF",
  whisper: "#9CF4FF",
} as const;

export type Tier = "desktop" | "mobile";

export function particleCount(tier: Tier): number {
  return tier === "mobile" ? 25000 : 120000;
}
