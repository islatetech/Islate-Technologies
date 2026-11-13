"use client";

import { useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, RoundedBox, useTexture } from "@react-three/drei";

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

/** Scroll positions where the board rests in each scene. */
const STOPS = [0.0, 0.16, 0.28, 0.44, 0.56, 0.72, 0.84, 1.0];

/**
 * The board, pinned for the whole story. It rests in four poses, one per
 * scene, and glides between them as you scroll. Pose = [x, y, rotY, rotX, width],
 * with x and y as fractions of half the view, and width as a fraction of the view.
 */
function Board({ getProgress }: { getProgress: () => number }) {
  const group = useRef<THREE.Group>(null);
  const { viewport, pointer } = useThree();
  const st = useRef({ p: 0 });
  const logoMat = useRef<THREE.MeshBasicMaterial>(null);
  const [withLogo, clean] = useTexture(["/images/screen.webp", "/images/screen-clean.webp"], (list) => {
    (Array.isArray(list) ? list : [list]).forEach((tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 8;
    });
  });

  useFrame((s, dt) => {
    const g = group.current;
    if (!g) return;
    const state = st.current;
    state.p = THREE.MathUtils.damp(state.p, getProgress(), 4.2, dt);
    const p = state.p;

    const wide = viewport.aspect > 1.1;
    type Pose = [number, number, number, number, number];
    const poses: Pose[] = wide
      ? [
          [0.34, 0.0, -0.45, 0.08, 0.44], // right of the opening text, close to it
          [0.0, 0.5, 0.15, 0.05, 0.27], // small, top centre
          [0.5, 0.0, -0.35, 0.06, 0.44], // right of the list, fully in view
          [0.0, 0.0, 0.0, 0.0, 0.72], // centred behind the closing text
        ]
      : [
          [0.0, 0.42, -0.3, 0.1, 0.86],
          [0.0, 0.58, 0.12, 0.05, 0.58],
          [0.0, 0.46, -0.25, 0.08, 0.86],
          [0.0, 0.0, 0.0, 0.0, 1.0],
        ];
    const keys = [poses[0], poses[0], poses[1], poses[1], poses[2], poses[2], poses[3], poses[3]];

    let i = 0;
    while (i < STOPS.length - 2 && p > STOPS[i + 1]) i++;
    const t = smooth(STOPS[i], STOPS[i + 1], p);
    const a = keys[i];
    const b = keys[i + 1];

    const time = s.clock.elapsedTime;
    const x = lerp(a[0], b[0], t) * (viewport.width / 2);
    const y = lerp(a[1], b[1], t) * (viewport.height / 2) + Math.sin(time * 0.8) * 0.03;
    g.position.set(x, y, 0);
    g.rotation.set(lerp(a[3], b[3], t) - pointer.y * 0.03, lerp(a[2], b[2], t) + pointer.x * 0.05, 0);
    g.scale.setScalar((lerp(a[4], b[4], t) * viewport.width) / W);

    // the logo leaves the screen before the closing text arrives over it
    if (logoMat.current) logoMat.current.opacity = 1 - smooth(0.72, 0.84, p);
  });

  return (
    <group ref={group}>
      <RoundedBox args={[W, H, D]} radius={0.05} smoothness={5}>
        <meshPhysicalMaterial color="#141517" metalness={0.92} roughness={0.3} envMapIntensity={1.35} clearcoat={0.3} />
      </RoundedBox>
      <mesh position={[0, 0, -D / 2 - 0.03]}>
        <boxGeometry args={[W * 0.55, H * 0.45, 0.06]} />
        <meshStandardMaterial color="#0c0c0e" metalness={0.8} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0, D / 2 + 0.002]}>
        <planeGeometry args={[W - BEZEL * 2, H - BEZEL * 2]} />
        <meshBasicMaterial map={clean} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0, D / 2 + 0.004]}>
        <planeGeometry args={[W - BEZEL * 2, H - BEZEL * 2]} />
        <meshBasicMaterial ref={logoMat} map={withLogo} toneMapped={false} transparent depthWrite={false} />
      </mesh>
      <mesh position={[0, 0, D / 2 + 0.006]}>
        <planeGeometry args={[W - BEZEL * 2, H - BEZEL * 2]} />
        <meshPhysicalMaterial transparent opacity={0.1} roughness={0.04} clearcoat={1} clearcoatRoughness={0.04} envMapIntensity={2.2} depthWrite={false} />
      </mesh>
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

export default function StoryScene({ getProgress, active }: { getProgress: () => number; active: boolean }) {
  return (
    <Canvas
      dpr={[1, 2]}
      frameloop={active ? "always" : "never"}
      camera={{ position: [0, 0, 7.5], fov: 32, near: 0.1, far: 50 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.18} />
      <Environment resolution={256} frames={1} background={false}>
        <Lightformer form="rect" intensity={3.2} position={[0, 5, -1]} scale={[12, 2.2, 1]} color="#ffffff" />
        <Lightformer form="rect" intensity={1.6} position={[-6, 0.5, 2]} rotation-y={Math.PI / 2.4} scale={[8, 2, 1]} color="#dfe6f2" />
        <Lightformer form="rect" intensity={1.1} position={[6, -1, 2]} rotation-y={-Math.PI / 2.4} scale={[6, 1.4, 1]} color="#ffffff" />
      </Environment>
      <Board getProgress={getProgress} />
    </Canvas>
  );
}
