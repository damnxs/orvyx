import * as THREE from "three";

// Module-level mutable shared state. Read/written inside useFrame and event
// handlers — avoids React re-renders for per-frame values (progress, pointer).
export const shared = {
  progress: 0, // master scroll progress 0..1
  mouseTarget: new THREE.Vector2(0, 0), // normalized pointer -1..1
  mouse: new THREE.Vector2(0, 0), // lerped pointer -1..1
  reduced: false, // prefers-reduced-motion
  tier: "desktop" as "desktop" | "mobile",
  ready: false, // scene mounted + first frame drawn
};
