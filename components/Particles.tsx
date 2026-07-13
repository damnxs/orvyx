"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Floating dust + orbiting field + distant stars, one additive point cloud.
// Cheap sin-based drift (no per-point simplex) so 120k stays 60fps-friendly.
export default function Particles({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null);

  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: { uTime: { value: 0 } },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexShader: /* glsl */ `
          uniform float uTime;
          attribute float aScale;
          varying float vAlpha;
          void main() {
            vec3 p = position;
            float t = uTime * 0.05;
            p.x += sin(p.y * 0.5 + t) * 0.18;
            p.y += cos(p.z * 0.4 + t * 1.1) * 0.18;
            p.z += sin(p.x * 0.3 + t * 0.9) * 0.18;
            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            gl_PointSize = aScale * (300.0 / max(-mv.z, 0.1));
            gl_Position = projectionMatrix * mv;
            vAlpha = clamp(1.0 - length(position) / 14.0, 0.0, 1.0);
          }
        `,
        fragmentShader: /* glsl */ `
          varying float vAlpha;
          void main() {
            float d = length(gl_PointCoord - 0.5);
            if (d > 0.5) discard;
            float a = smoothstep(0.5, 0.0, d);
            vec3 col = mix(vec3(0.49, 0.40, 0.95), vec3(0.92, 0.88, 1.0), 0.55);
            gl_FragColor = vec4(col, a * vAlpha * 0.85);
          }
        `,
      }),
    []
  );

  const geo = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const scl = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const r = 2.4 + Math.pow(Math.random(), 0.6) * 11.0;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.7;
      pos[i * 3 + 2] = r * Math.cos(phi);
      scl[i] = 0.4 + Math.random() * 1.3;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aScale", new THREE.BufferAttribute(scl, 1));
    return g;
  }, [count]);

  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.008;
    mat.uniforms.uTime.value += dt;
  });

  return <points ref={ref} geometry={geo} material={mat} frustumCulled={false} />;
}
