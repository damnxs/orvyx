"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { shared } from "@/lib/state";
import type { Tier } from "@/lib/theme";

const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

// 3D simplex noise (Ashima/Gustavson) + fbm + crack ridge function.
const NOISE_GLSL = /* glsl */ `
vec3 mod289(vec3 x){return x - floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x - floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0,0.5,1.0,2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
    i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)), 0.0);
  m = m*m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
float fbm(vec3 p){ float f=0.0; float a=0.5; for(int i=0;i<5;i++){ f+=a*snoise(p); p*=2.02; a*=0.5; } return f; }
float cracks(vec3 p, float t){
  vec3 q = p + vec3(0.0, 0.0, t*0.04);
  float n = fbm(q*2.2);
  float r = 1.0 - abs(n);
  r = pow(r, 6.0);
  float flow = fbm(p*4.0 + t*0.12);
  return r * (0.55 + 0.45*flow);
}
`;

// Black-mirror PBR + emissive crack veins + fresnel rim, injected into
// MeshStandardMaterial so we keep real env reflections & lighting for free.
function useObsidianMaterial() {
  const uniforms = useRef<{ uTime: THREE.IUniform; uCrack: THREE.IUniform; uOpen: THREE.IUniform } | null>(null);

  const material = useMemo(() => {
    const m = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#0a0a12"),
      metalness: 0.6,
      roughness: 0.32,
      envMapIntensity: 2.0,
      transparent: true,
      dithering: true,
    });
    m.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = { value: 0 };
      shader.uniforms.uCrack = { value: 0.25 };
      shader.uniforms.uOpen = { value: 0 };
      uniforms.current = shader.uniforms as {
        uTime: THREE.IUniform;
        uCrack: THREE.IUniform;
        uOpen: THREE.IUniform;
      };

      shader.vertexShader = shader.vertexShader
        .replace("#include <common>", `#include <common>\nvarying vec3 vLocalPos;`)
        .replace("#include <begin_vertex>", `#include <begin_vertex>\nvLocalPos = position;`);

      shader.fragmentShader = shader.fragmentShader
        .replace(
          "#include <common>",
          `#include <common>\nuniform float uTime; uniform float uCrack; uniform float uOpen; varying vec3 vLocalPos;\n${NOISE_GLSL}`
        )
        .replace(
          "#include <emissivemap_fragment>",
          `#include <emissivemap_fragment>
          {
            vec3 vdn = normalize(vNormal);
            vec3 vdv = normalize(vViewPosition);
            float ndv = max(dot(vdn, vdv), 0.0);
            float fres = pow(1.0 - ndv, 2.0);
            float fresTight = pow(1.0 - ndv, 5.0);
            float ck = cracks(vLocalPos, uTime);
            float ckBoost = 0.7 + uCrack * 2.4 + uOpen * 1.3;
            // faint body lift so form is never pure void
            totalEmissiveRadiance += vec3(0.03, 0.04, 0.0);
            // glowing crack veins
            totalEmissiveRadiance += vec3(0.800, 1.0, 0.0) * ck * ckBoost;
            // broad bright rim — guarantees the silhouette reads
            totalEmissiveRadiance += vec3(0.839, 1.0, 0.40) * fres * (1.2 + uCrack * 0.8);
            // cyan-white edge spark at the very silhouette
            totalEmissiveRadiance += vec3(0.7, 0.95, 1.0) * fresTight * 1.4 * (0.5 + uCrack);
          }`
        );
    };
    m.customProgramCacheKey = () => "obsidian-v1";
    return m;
  }, []);

  return { material, uniforms };
}

function useGalaxy(tier: Tier) {
  return useMemo(() => {
    const N = tier === "mobile" ? 1600 : 3600;
    const pos = new Float32Array(N * 3);
    const col = new Float32Array(N * 3);
    const inner = new THREE.Color("#D6FF66");
    const outer = new THREE.Color("#CCFF00");
    const white = new THREE.Color("#ffffff");
    for (let i = 0; i < N; i++) {
      const r = Math.pow(Math.random(), 1.7) * 1.15;
      const branch = ((i % 3) / 3) * Math.PI * 2;
      const spin = r * 2.3;
      const a = branch + spin + (Math.random() - 0.5) * 0.5;
      pos[i * 3] = Math.cos(a) * r + (Math.random() - 0.5) * 0.08;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.12 * Math.pow(r + 0.2, 0.5);
      pos[i * 3 + 2] = Math.sin(a) * r + (Math.random() - 0.5) * 0.08;
      const c = inner.clone().lerp(outer, Math.min(r / 1.15, 1));
      if (Math.random() > 0.9) c.lerp(white, 0.5);
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("color", new THREE.BufferAttribute(col, 3));
    return g;
  }, [tier]);
}

function OracleEye() {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        depthTest: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uReveal: { value: 0 },
          uBlink: { value: 1 },
          uLook: { value: new THREE.Vector2(0, 0) },
        },
        vertexShader: /* glsl */ `
          varying vec2 vUv;
          void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
        `,
        fragmentShader: /* glsl */ `
          uniform float uTime; uniform float uReveal; uniform float uBlink; uniform vec2 uLook;
          varying vec2 vUv;
          void main(){
            vec2 p = vUv * 2.0 - 1.0;
            p.y /= max(uBlink, 0.04);
            float d = length(p);
            if (d > 0.62) discard;
            vec2 pp = p - uLook * 0.10;
            float pd = length(pp);
            float ring = smoothstep(0.50, 0.46, d) * (1.0 - smoothstep(0.46, 0.42, d));
            vec3 col = mix(vec3(0.800,1.0,0.0), vec3(0.839,1.0,0.40), smoothstep(0.5,0.2,d));
            col = mix(col, vec3(0.0), smoothstep(0.17,0.10,pd));
            float ang = atan(pp.y, pp.x);
            float fib = 0.5 + 0.5 * sin(ang * 46.0 + uTime * 0.6);
            col *= 0.75 + 0.25 * fib * smoothstep(0.5, 0.18, d);
            col += vec3(0.612, 0.957, 1.0) * ring * 0.9;
            float alpha = (1.0 - smoothstep(0.55, 0.62, d)) * uReveal;
            gl_FragColor = vec4(col, alpha);
          }
        `,
      }),
    []
  );

  const group = useRef<THREE.Group>(null);
  const blink = useRef({ active: false, start: 0, next: 9 + Math.random() * 6 });

  useFrame(({ clock }, dt) => {
    const t = clock.elapsedTime;
    const p = shared.progress;
    const reveal = smoothstep(0.78, 0.97, p);
    mat.uniforms.uTime.value += dt;
    mat.uniforms.uReveal.value += (reveal - mat.uniforms.uReveal.value) * 0.05;
    mat.uniforms.uLook.value.set(shared.mouse.x, shared.mouse.y);

    const b = blink.current;
    let val = 1;
    if (b.active) {
      const e = t - b.start;
      const dur = 0.32;
      if (e > dur) {
        b.active = false;
        b.next = t + 20 + Math.random() * 10;
      } else {
        const k = e / dur;
        val = k < 0.5 ? 1 - (k / 0.5) * 0.96 : 0.04 + ((k - 0.5) / 0.5) * 0.96;
      }
    } else if (t > b.next && reveal > 0.5) {
      b.active = true;
      b.start = t;
    }
    mat.uniforms.uBlink.value = val;

    if (group.current) {
      const s = 0.85 + reveal * 0.15;
      group.current.scale.setScalar(s);
      group.current.rotation.y += (shared.mouse.x * 0.12 - group.current.rotation.y) * 0.05;
      group.current.rotation.x += (-shared.mouse.y * 0.08 - group.current.rotation.x) * 0.05;
    }
  });

  return (
    <group ref={group}>
      <mesh position={[0, 0, 1.46]} material={mat} renderOrder={3}>
        <circleGeometry args={[0.5, 64]} />
      </mesh>
    </group>
  );
}

export default function ObsidianObject({ tier }: { tier: Tier }) {
  const sphere = useRef<THREE.Mesh>(null);
  const galaxyGroup = useRef<THREE.Group>(null);
  const spin = useRef(0);
  const { material, uniforms } = useObsidianMaterial();
  const galaxyGeo = useGalaxy(tier);

  const galaxyMaterial = useMemo(
    () =>
      new THREE.PointsMaterial({
        size: tier === "mobile" ? 0.05 : 0.038,
        sizeAttenuation: true,
        vertexColors: true,
        transparent: true,
        depthWrite: false,
        depthTest: false,
        blending: THREE.AdditiveBlending,
        opacity: 0,
      }),
    [tier]
  );

  useFrame((_, dt) => {
    const p = shared.progress;
    spin.current += dt * 0.02;

    // Sphere: slow spin + mouse rotation + fade translucent as it opens.
    if (sphere.current) {
      sphere.current.rotation.y = spin.current + shared.mouse.x * 0.12;
      sphere.current.rotation.x = -shared.mouse.y * 0.06 + Math.sin(p * 3) * 0.02;
    }

    const open = smoothstep(0.35, 0.6, p);
    const crack = smoothstep(0.05, 0.5, p);
    if (uniforms.current) {
      uniforms.current.uTime.value += dt;
      uniforms.current.uCrack.value += (0.22 + crack * 0.95 - (uniforms.current.uCrack.value as number)) * 0.05;
      uniforms.current.uOpen.value += (open - (uniforms.current.uOpen.value as number)) * 0.05;
    }
    // opacity 1 -> 0.4 as it opens; only write depth while mostly opaque.
    const targetOpacity = 1 - open * 0.6;
    material.opacity += (targetOpacity - material.opacity) * 0.05;
    material.depthWrite = material.opacity > 0.9;

    // Galaxy fades in with the open.
    galaxyMaterial.opacity += (open - galaxyMaterial.opacity) * 0.05;
    if (galaxyGroup.current) {
      galaxyGroup.current.rotation.y += dt * 0.05;
      galaxyGroup.current.rotation.x = 0.5;
    }
  });

  const detail = tier === "mobile" ? 96 : 192;

  return (
    <group>
      <mesh ref={sphere} material={material} renderOrder={2}>
        <sphereGeometry args={[1.5, detail, detail]} />
      </mesh>

      <group ref={galaxyGroup}>
        <points geometry={galaxyGeo} material={galaxyMaterial} renderOrder={1} />
      </group>

      <OracleEye />
    </group>
  );
}
