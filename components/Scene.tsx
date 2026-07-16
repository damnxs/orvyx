"use client";

import { Suspense, useMemo, useRef, useState, type ReactElement } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Noise,
  Vignette,
  DepthOfField,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import ObsidianObject from "./ObsidianObject";
import Particles from "./Particles";
import { shared } from "@/lib/state";
import { particleCount, type Tier } from "@/lib/theme";

function CameraRig({ onReady }: { onReady: () => void }) {
  const { camera, clock } = useThree();
  const fired = useRef(false);
  const base = useMemo(() => new THREE.Vector3(0, 0, 6), []);

  useFrame(() => {
    // Single lerp of the shared pointer.
    shared.mouse.x += (shared.mouseTarget.x - shared.mouse.x) * 0.045;
    shared.mouse.y += (shared.mouseTarget.y - shared.mouse.y) * 0.045;

    const t = clock.elapsedTime;
    const p = shared.progress;
    const dolly = THREE.MathUtils.lerp(base.z, 3.3, Math.min(1, p / 0.45)); // approach the orb
    const breath = shared.reduced ? 0 : Math.sin(t * 0.4) * 0.06;
    const shake = shared.reduced ? 0 : Math.sin(t * 1.3) * 0.004 + Math.sin(t * 2.7) * 0.003;
    const par = shared.reduced ? 0 : 1;
    const tx = shared.mouse.x * 0.6 * par + Math.sin(t * 0.2) * 0.02;
    const ty = shared.mouse.y * 0.6 * par + breath;

    camera.position.x += (tx - camera.position.x) * 0.05;
    camera.position.y += (ty - camera.position.y) * 0.05;
    camera.position.z += (dolly + shake - camera.position.z) * 0.05;
    camera.lookAt(0, 0, 0);

    if (!fired.current) {
      fired.current = true;
      shared.ready = true;
      onReady();
    }
  });
  return null;
}

function Lights() {
  const key = useRef<THREE.DirectionalLight>(null);
  useFrame(() => {
    if (key.current) {
      key.current.position.x = 2 + shared.mouse.x * 1.2;
      key.current.position.y = 4 + shared.mouse.y * 0.8;
    }
  });
  return (
    <>
      <hemisphereLight args={["#CCFF00", "#050505", 0.25]} />
      <ambientLight intensity={0.12} />
      <directionalLight ref={key} position={[2.5, 4, 3]} intensity={2.6} color="#ffffff" />
      <pointLight position={[-3.5, -1, 3]} intensity={22} color="#CCFF00" distance={26} decay={2} />
      <pointLight position={[3.5, 1.5, -1.5]} intensity={14} color="#9CF4FF" distance={26} decay={2} />
      <pointLight position={[0, 0, 6]} intensity={10} color="#ffffff" distance={24} decay={2} />
    </>
  );
}

export default function Scene({ onReady }: { onReady: () => void }) {
  const [tier] = useState<Tier>(() =>
    typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches ? "mobile" : "desktop"
  );
  const desktop = tier === "desktop";

  const caOffset = useMemo(() => new THREE.Vector2(0.0006, 0.0006), []);

  const effects = useMemo<ReactElement[]>(() => {
    const arr: ReactElement[] = [
      <DepthOfField
        key="dof"
        target={[0, 0, 0]}
        focalLength={0.04}
        bokehScale={desktop ? 2.6 : 1.4}
        height={desktop ? 480 : 320}
      />,
      <Bloom key="bloom" intensity={0.7} luminanceThreshold={0.22} luminanceSmoothing={0.9} mipmapBlur radius={0.7} />,
    ];
    // ponytail: ambient occlusion dropped — n8ao ships a raw pass, not the React
    // component; depth read comes from vignette + bloom + the dark-mirror material.
    arr.push(
      <ChromaticAberration
        key="ca"
        offset={caOffset}
        radialModulation={false}
        modulationOffset={0}
        blendFunction={BlendFunction.NORMAL}
      />,
      <Noise key="noise" opacity={0.045} premultiply blendFunction={BlendFunction.SCREEN} />,
      <Vignette key="vig" offset={0.28} darkness={0.92} eskil={false} />
    );
    return arr;
  }, [desktop, caOffset]);

  return (
    <Canvas
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}
      dpr={[1, desktop ? 2 : 1.5]}
      gl={{
        antialias: false,
        alpha: false,
        powerPreference: "high-performance",
        toneMappingExposure: 1.12,
      }}
      camera={{ position: [0, 0, 6], fov: 35, near: 0.1, far: 100 }}
    >
      <color attach="background" args={["#050505"]} />
      <fog attach="fog" args={["#050505", 9, 26]} />

      <Suspense fallback={null}>
        <Environment resolution={256}>
          <Lightformer form="rect" intensity={3} color="#CCFF00" position={[-3, 1, 3]} scale={[4, 6, 1]} />
          <Lightformer form="rect" intensity={2.2} color="#9CF4FF" position={[3, -1, 2]} scale={[3, 3, 1]} />
          <Lightformer form="rect" intensity={1.4} color="#ffffff" position={[0, 4, -2]} scale={[6, 2, 1]} />
          <Lightformer form="ring" intensity={2.2} color="#D6FF66" position={[0, 0, 5]} scale={3} />
        </Environment>

        <Lights />
        <ObsidianObject tier={tier} />
        <Particles count={particleCount(tier)} />
      </Suspense>

      <CameraRig onReady={onReady} />

      <EffectComposer enableNormalPass={desktop} multisampling={desktop ? 2 : 0}>
        {effects}
      </EffectComposer>
    </Canvas>
  );
}
