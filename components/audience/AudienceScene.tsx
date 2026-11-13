"use client";

import { useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, RoundedBox, useTexture } from "@react-three/drei";

export type ProductView = "wall" | "trolley" | "aframe" | "podium";

const D = 0.14;
const BEZEL = 0.07;
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** Overall size of each model, in scene units, used to fit it to the card. */
const DIMS: Record<ProductView, { w: number; h: number; y: number }> = {
  wall: { w: 4.8, h: 3.0, y: 0 },
  trolley: { w: 4.8, h: 5.0, y: 0.1 },
  aframe: { w: 4.8, h: 5.0, y: 0.1 },
  podium: { w: 2.2, h: 4.1, y: 0.1 },
};

const metal = { color: "#1a1b1e", metalness: 0.85, roughness: 0.4, envMapIntensity: 1.2 } as const;

/** A flat bar between two points in the XY plane. */
function Bar({ from, to, t = 0.1, z = 0 }: { from: [number, number]; to: [number, number]; t?: number; z?: number }) {
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  const len = Math.hypot(dx, dy);
  return (
    <mesh position={[(from[0] + to[0]) / 2, (from[1] + to[1]) / 2, z]} rotation={[0, 0, Math.atan2(dy, dx)]}>
      <boxGeometry args={[len, t, t]} />
      <meshStandardMaterial {...metal} />
    </mesh>
  );
}

/** The display itself: aluminium body, the wallpaper, glass and optional camera bar. */
function Display({ w, h, camera = true }: { w: number; h: number; camera?: boolean }) {
  const texture = useTexture("/images/hero-screen.webp", (t) => {
    const tex = Array.isArray(t) ? t[0] : t;
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
  });
  return (
    <group>
      <RoundedBox args={[w, h, D]} radius={Math.min(0.05, h / 20)} smoothness={4}>
        <meshPhysicalMaterial color="#141517" metalness={0.92} roughness={0.3} envMapIntensity={1.35} clearcoat={0.3} />
      </RoundedBox>
      <mesh position={[0, 0, D / 2 + 0.002]}>
        <planeGeometry args={[w - BEZEL * 2, h - BEZEL * 2]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0, D / 2 + 0.006]}>
        <planeGeometry args={[w - BEZEL * 2, h - BEZEL * 2]} />
        <meshPhysicalMaterial transparent opacity={0.1} roughness={0.04} clearcoat={1} clearcoatRoughness={0.04} envMapIntensity={2.2} depthWrite={false} />
      </mesh>
      {camera && (
        <>
          <RoundedBox args={[0.9, 0.09, 0.14]} radius={0.03} smoothness={3} position={[0, h / 2 + 0.045, 0.01]}>
            <meshStandardMaterial color="#0b0b0d" metalness={0.7} roughness={0.35} />
          </RoundedBox>
          <mesh position={[0, h / 2 + 0.045, 0.085]}>
            <circleGeometry args={[0.022, 24]} />
            <meshBasicMaterial color="#2b3a52" />
          </mesh>
        </>
      )}
    </group>
  );
}

function Wall() {
  return (
    <group>
      <Display w={4.8} h={2.7} />
      <mesh position={[0, 0, -D / 2 - 0.03]}>
        <boxGeometry args={[4.8 * 0.55, 2.7 * 0.45, 0.06]} />
        <meshStandardMaterial color="#0c0c0e" metalness={0.8} roughness={0.5} />
      </mesh>
    </group>
  );
}

function Trolley() {
  const castors: [number, number][] = [[-1.45, 0.6], [1.45, 0.6], [-1.45, -0.6], [1.45, -0.6]];
  return (
    <group>
      <group position={[0, 1.2, 0]}>
        <Display w={4.8} h={2.7} />
      </group>
      {/* two posts rising from the base to the back of the screen */}
      {[-0.95, 0.95].map((x) => (
        <mesh key={x} position={[x, -0.55, -0.2]}>
          <boxGeometry args={[0.16, 3.4, 0.16]} />
          <meshStandardMaterial {...metal} />
        </mesh>
      ))}
      <mesh position={[0, 0.0, -0.2]}>
        <boxGeometry args={[2.2, 0.12, 0.12]} />
        <meshStandardMaterial {...metal} />
      </mesh>
      {/* shelf and base */}
      <mesh position={[0, -1.15, 0.1]}>
        <boxGeometry args={[2.6, 0.07, 0.9]} />
        <meshStandardMaterial {...metal} />
      </mesh>
      <mesh position={[0, -2.25, 0]}>
        <boxGeometry args={[3.4, 0.14, 1.4]} />
        <meshStandardMaterial {...metal} />
      </mesh>
      {castors.map(([x, z]) => (
        <mesh key={`${x}${z}`} position={[x, -2.45, z]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color="#0b0b0d" metalness={0.5} roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
}

function AFrame() {
  return (
    <group>
      <group position={[0, 1.2, 0]}>
        <Display w={4.8} h={2.7} />
      </group>
      {/* a bar across the back of the screen carries the two A shaped legs */}
      <mesh position={[0, 0.9, -0.2]}>
        <boxGeometry args={[3.6, 0.12, 0.12]} />
        <meshStandardMaterial {...metal} />
      </mesh>
      {[-1.5, 1.5].map((x) => (
        <group key={x}>
          <Bar from={[x, 1.0]} to={[x - 0.55, -2.4]} z={-0.25} />
          <Bar from={[x, 1.0]} to={[x + 0.55, -2.4]} z={-0.25} />
          <Bar from={[x - 0.3, -1.1]} to={[x + 0.3, -1.1]} t={0.07} z={-0.25} />
          {[-0.55, 0.55].map((dx) => (
            <mesh key={dx} position={[x + dx, -2.46, -0.25]}>
              <sphereGeometry args={[0.1, 16, 16]} />
              <meshStandardMaterial color="#0b0b0d" metalness={0.5} roughness={0.6} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

function Podium() {
  return (
    <group>
      {/* the tower */}
      <RoundedBox args={[1.7, 2.3, 0.95]} radius={0.04} smoothness={3} position={[0, -0.95, 0]}>
        <meshStandardMaterial color="#e6e7ea" metalness={0.15} roughness={0.5} envMapIntensity={0.8} />
      </RoundedBox>
      <RoundedBox args={[1.9, 0.14, 1.1]} radius={0.04} smoothness={3} position={[0, -2.2, 0]}>
        <meshStandardMaterial {...metal} />
      </RoundedBox>
      {/* the sloped top with its touch display */}
      <group position={[0, 0.3, 0.05]} rotation={[0.95, 0, 0]}>
        <RoundedBox args={[1.9, 0.12, 1.25]} radius={0.03} smoothness={3} position={[0, -0.07, 0]}>
          <meshStandardMaterial {...metal} />
        </RoundedBox>
        <group rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.0, 0.05]}>
          <Display w={1.55} h={0.95} camera={false} />
        </group>
      </group>
      {/* gooseneck microphone */}
      <mesh position={[-0.72, 0.85, -0.2]}>
        <cylinderGeometry args={[0.018, 0.018, 1.2, 10]} />
        <meshStandardMaterial {...metal} />
      </mesh>
      <mesh position={[-0.6, 1.5, -0.1]} rotation={[0, 0, -0.5]}>
        <capsuleGeometry args={[0.04, 0.16, 6, 10]} />
        <meshStandardMaterial {...metal} />
      </mesh>
    </group>
  );
}

function Model({ view, getScroll, hovering, phase }: { view: ProductView; getScroll: () => number; hovering: () => boolean; phase: number }) {
  const group = useRef<THREE.Group>(null);
  const { pointer, viewport } = useThree();
  const state = useRef({ spin: 0 });
  const dim = DIMS[view];

  useFrame((s, dt) => {
    const g = group.current;
    if (!g) return;
    const st = state.current;
    const p = clamp01(getScroll());
    // scrolling swings the product gently from one side to the other
    const base = (0.5 - p) * 0.95;
    // hovering the card turns it a full 360 as the pointer crosses it
    const over = hovering();
    const target = over ? pointer.x * Math.PI : 0;
    st.spin = THREE.MathUtils.damp(st.spin, target, over ? 5 : 3, dt);
    const t = s.clock.elapsedTime + phase;
    g.rotation.set(0.06 + Math.sin(t * 0.7) * 0.012, base + st.spin, 0);
    g.position.y = Math.sin(t * 0.8) * 0.03;
    g.scale.setScalar(Math.min((viewport.width * 0.8) / dim.w, (viewport.height * 0.86) / dim.h));
  });

  return (
    <group ref={group}>
      <group position={[0, dim.y, 0]}>
        {view === "wall" && <Wall />}
        {view === "trolley" && <Trolley />}
        {view === "aframe" && <AFrame />}
        {view === "podium" && <Podium />}
      </group>
    </group>
  );
}

export default function AudienceScene({
  view,
  getScroll,
  hovering,
  active,
  phase,
}: {
  view: ProductView;
  getScroll: () => number;
  hovering: () => boolean;
  active: boolean;
  phase: number;
}) {
  return (
    <Canvas
      dpr={[1, 2]}
      frameloop={active ? "always" : "never"}
      camera={{ position: [0, 0, 7.5], fov: 32, near: 0.1, far: 50 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.2} />
      <Environment resolution={256} frames={1} background={false}>
        <Lightformer form="rect" intensity={3.2} position={[0, 5, -1]} scale={[12, 2.2, 1]} color="#ffffff" />
        <Lightformer form="rect" intensity={1.6} position={[-6, 0.5, 2]} rotation-y={Math.PI / 2.4} scale={[8, 2, 1]} color="#dfe6f2" />
        <Lightformer form="rect" intensity={1.1} position={[6, -1, 2]} rotation-y={-Math.PI / 2.4} scale={[6, 1.4, 1]} color="#ffffff" />
      </Environment>
      <Model view={view} getScroll={getScroll} hovering={hovering} phase={phase} />
    </Canvas>
  );
}
