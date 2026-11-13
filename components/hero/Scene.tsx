"use client";

import { useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, RoundedBox, useTexture } from "@react-three/drei";

/** Panel size in scene units (16:9). */
const W = 4.8;
const H = 2.7;
const D = 0.14;
const BEZEL = 0.07;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/* ------------------------------------------------------------------ */
/* The panel                                                           */
/* ------------------------------------------------------------------ */
function Panel({ getProgress, onProgress }: { getProgress: () => number; onProgress: (p: number) => void }) {
  const group = useRef<THREE.Group>(null);
  const { viewport, pointer } = useThree();
  const state = useRef({ p: 0, spin: 0, hover: false });
  const texture = useTexture("/images/hero-screen.webp", (t) => {
    const tex = Array.isArray(t) ? t[0] : t;
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
  });

  // The render loop mutates three.js objects imperatively, which is how R3F is meant to be used.
  useFrame((s, dt) => {
    const st = state.current;
    const target = getProgress();
    // damped follow: the scene glides to wherever the scroll is, never snaps
    st.p = THREE.MathUtils.damp(st.p, target, 4.2, dt);
    const p = st.p;
    onProgress(p);

    const wide = viewport.aspect > 1.1;
    const vw = viewport.width;
    const vh = viewport.height;
    const sSide = wide ? (0.46 * vw) / W : (0.9 * vw) / W;
    const sFill = Math.min((wide ? 0.8 : 0.96) * vw, 0.66 * vh * (16 / 9)) / W;

    // keyframes: [progress, x, y, rotX, rotY, scale]
    const sideX = wide ? vw * 0.215 : 0;
    const sideY = wide ? 0 : -vh * 0.27;
    const keys: [number, number, number, number, number, number][] = [
      [0.0, sideX, sideY, 0.12, -0.55, sSide],
      [0.3, 0, 0, 0.0, 0.0, sFill * 0.94],
      [0.62, 0, 0, 0.0, 0.0, sFill],
      [0.8, 0, 0, -0.06, 0.2, sFill * 0.82],
      [1.0, -sideX, sideY, 0.12, 0.55, sSide],
    ];
    const found = keys.findIndex((k, idx) => idx < keys.length - 1 && p <= keys[idx + 1][0]);
    const i = found < 0 ? keys.length - 2 : found;
    const a = keys[i], b = keys[i + 1];
    const t = smooth(a[0], b[0], p);
    const flat = 1 - Math.min(1, Math.abs(lerp(a[3], b[3], t)) * 6 + Math.abs(lerp(a[4], b[4], t)));

    const time = s.clock.elapsedTime;
    const g = group.current!;
    const px = pointer.x * 0.05 * (1 - flat * 0.6);
    const py = pointer.y * 0.035 * (1 - flat * 0.6);

    // Hover the screen in the opening view and it turns a full 360 as the
    // pointer moves across it. The footprint is measured on the resting pose so
    // the hit area does not move while it spins.
    const rest = keys[0];
    const halfW = (W * rest[5]) / 2 / (vw / 2);
    const halfH = (H * rest[5]) / 2 / (vh / 2);
    const cx = rest[1] / (vw / 2);
    const cy = rest[2] / (vh / 2);
    const open = 1 - smooth(0.04, 0.14, p);
    const over = open > 0.5 && Math.abs(pointer.x - cx) < halfW && Math.abs(pointer.y - cy) < halfH;
    const spinTarget = over ? ((pointer.x - cx) / halfW) * Math.PI : 0;
    st.spin = THREE.MathUtils.damp(st.spin, spinTarget * open, over ? 5 : 3, dt);
    if (over !== st.hover) {
      st.hover = over;
      document.body.style.cursor = over ? "ew-resize" : "";
    }
    g.position.set(lerp(a[1], b[1], t), lerp(a[2], b[2], t) + Math.sin(time * 0.8) * 0.035 * (1 - flat), 0);
    g.rotation.set(lerp(a[3], b[3], t) - py, lerp(a[4], b[4], t) + px + st.spin, Math.sin(time * 0.5) * 0.008 * (1 - flat));
    const sc = lerp(a[5], b[5], t);
    g.scale.setScalar(sc);
  });

  return (
    <group ref={group}>
      {/* aluminium body */}
      <RoundedBox args={[W, H, D]} radius={0.05} smoothness={5} castShadow>
        <meshPhysicalMaterial color="#141517" metalness={0.92} roughness={0.3} envMapIntensity={1.35} clearcoat={0.3} />
      </RoundedBox>
      {/* wall mount plate on the back */}
      <mesh position={[0, 0, -D / 2 - 0.03]}>
        <boxGeometry args={[W * 0.55, H * 0.45, 0.06]} />
        <meshStandardMaterial color="#0c0c0e" metalness={0.8} roughness={0.5} />
      </mesh>
      {/* the display */}
      <mesh position={[0, 0, D / 2 + 0.002]}>
        <planeGeometry args={[W - BEZEL * 2, H - BEZEL * 2]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
      {/* glass over the display, catches the studio lights */}
      <mesh position={[0, 0, D / 2 + 0.006]}>
        <planeGeometry args={[W - BEZEL * 2, H - BEZEL * 2]} />
        <meshPhysicalMaterial
          transparent
          opacity={0.1}
          roughness={0.04}
          metalness={0}
          clearcoat={1}
          clearcoatRoughness={0.04}
          envMapIntensity={2.2}
          depthWrite={false}
        />
      </mesh>
      {/* camera bar on top */}
      <RoundedBox args={[0.9, 0.09, 0.14]} radius={0.03} smoothness={3} position={[0, H / 2 + 0.045, 0.01]}>
        <meshStandardMaterial color="#0b0b0d" metalness={0.7} roughness={0.35} />
      </RoundedBox>
      <mesh position={[0, H / 2 + 0.045, 0.085]}>
        <circleGeometry args={[0.022, 24]} />
        <meshBasicMaterial color="#2b3a52" />
      </mesh>
    </group>
  );
}

function Studio() {
  return (
    <>
      <ambientLight intensity={0.15} />
      <Environment resolution={256} frames={1} background={false}>
        <Lightformer form="rect" intensity={3.2} position={[0, 5, -1]} scale={[12, 2.2, 1]} color="#ffffff" />
        <Lightformer form="rect" intensity={1.6} position={[-6, 0.5, 2]} rotation-y={Math.PI / 2.4} scale={[8, 2, 1]} color="#dfe6f2" />
        <Lightformer form="rect" intensity={1.1} position={[6, -1, 2]} rotation-y={-Math.PI / 2.4} scale={[6, 1.4, 1]} color="#ffffff" />
        <Lightformer form="ring" intensity={0.8} position={[0, -3, 3]} scale={5} color="#ffffff" />
      </Environment>
    </>
  );
}

export default function Scene({ getProgress, onProgress, active }: { getProgress: () => number; onProgress: (p: number) => void; active: boolean }) {
  return (
    <Canvas
      dpr={[1, 2]}
      frameloop={active ? "always" : "never"}
      camera={{ position: [0, 0, 7.5], fov: 32, near: 0.1, far: 50 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      <Studio />
      <Panel getProgress={getProgress} onProgress={onProgress} />
    </Canvas>
  );
}
