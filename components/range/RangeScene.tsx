"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";

export type RangeItem = { slug: string; name: string; image: string };

const CARD_W = 3.1;
const CARD_H = 2.5;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Studio tile with rounded corners, drawn once to a texture. */
function makeTile() {
  const c = document.createElement("canvas");
  c.width = 640;
  c.height = Math.round((640 * CARD_H) / CARD_W);
  const ctx = c.getContext("2d")!;
  const r = 52;
  ctx.beginPath();
  ctx.moveTo(r, 0);
  ctx.arcTo(c.width, 0, c.width, c.height, r);
  ctx.arcTo(c.width, c.height, 0, c.height, r);
  ctx.arcTo(0, c.height, 0, 0, r);
  ctx.arcTo(0, 0, c.width, 0, r);
  ctx.closePath();
  ctx.clip();
  const g = ctx.createRadialGradient(c.width / 2, c.height * 0.25, 0, c.width / 2, c.height * 0.25, c.width * 0.85);
  g.addColorStop(0, "#fbfbfb");
  g.addColorStop(0.6, "#ececed");
  g.addColorStop(1, "#d9dadd");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, c.width, c.height);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

type Slot = { group: THREE.Group; tile: THREE.MeshBasicMaterial; img: THREE.MeshBasicMaterial };

function Track({
  items,
  getProgress,
  onActive,
  onSelect,
}: {
  items: RangeItem[];
  getProgress: () => number;
  onActive: (i: number, offset: number) => void;
  onSelect: (slug: string) => void;
}) {
  const { viewport } = useThree();
  const textures = useTexture(items.map((i) => i.image));
  const tile = useMemo(() => makeTile(), []);
  useEffect(() => () => tile.dispose(), [tile]);

  const slots = useRef<(Slot | null)[]>([]);
  const state = useRef({ off: 0, active: -1 });
  const N = items.length;

  // Each product fits inside the tile, keeping its own proportions.
  const sizes = useMemo(
    () =>
      textures.map((t) => {
        const img = t.image as { width: number; height: number };
        const a = img.width / img.height;
        const maxW = CARD_W * 0.8;
        const maxH = CARD_H * 0.72;
        return a > maxW / maxH ? ([maxW, maxW / a] as const) : ([maxH * a, maxH] as const);
      }),
    [textures],
  );

  useFrame((_, dt) => {
    const st = state.current;
    const target = getProgress() * (N - 1);
    st.off = THREE.MathUtils.damp(st.off, target, 4, dt);

    const wide = viewport.aspect > 1.1;
    const R = wide ? 6.4 : 5.2;
    const step = wide ? 0.47 : 0.62;
    const k = wide ? 1 : Math.min(1, (viewport.width * 0.8) / (CARD_W * 0.84));

    const nearest = Math.round(st.off);
    if (nearest !== st.active) {
      st.active = nearest;
      onActive(nearest, st.off);
    }

    for (let i = 0; i < N; i++) {
      const s = slots.current[i];
      if (!s) continue;
      const u = i - st.off;
      const a = Math.abs(u);
      const th = u * step;
      const vis = 1 - smooth(1.6, 2.9, a);
      s.group.visible = vis > 0.01;
      if (!s.group.visible) continue;
      // concave arc: the cards close to the edges lean in toward the viewer
      s.group.position.set(R * Math.sin(th), 0, R * (1 - Math.cos(th)) * 0.9 - 0.4);
      s.group.rotation.y = -th * 0.95;
      s.group.scale.setScalar(k * lerp(0.84, 0.7, smooth(0, 1.4, a)));
      s.tile.opacity = vis;
      s.img.opacity = vis;
    }
  });

  return (
    <group>
      {items.map((item, i) => (
        <group
          key={item.slug}
          ref={(g) => {
            if (!g) return;
            const [tileMesh, imgMesh] = g.children as THREE.Mesh[];
            slots.current[i] = {
              group: g,
              tile: tileMesh.material as THREE.MeshBasicMaterial,
              img: imgMesh.material as THREE.MeshBasicMaterial,
            };
          }}
        >
          <mesh
            onClick={(e) => {
              e.stopPropagation();
              onSelect(item.slug);
            }}
            onPointerOver={() => (document.body.style.cursor = "pointer")}
            onPointerOut={() => (document.body.style.cursor = "")}
          >
            <planeGeometry args={[CARD_W, CARD_H]} />
            <meshBasicMaterial map={tile} transparent toneMapped={false} depthWrite={false} />
          </mesh>
          <mesh position={[0, -0.02, 0.01]}>
            <planeGeometry args={[sizes[i][0], sizes[i][1]]} />
            <meshBasicMaterial map={textures[i]} transparent toneMapped={false} depthWrite={false} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export default function RangeScene(props: {
  items: RangeItem[];
  getProgress: () => number;
  onActive: (i: number, offset: number) => void;
  onSelect: (slug: string) => void;
  active: boolean;
}) {
  const { active, ...rest } = props;
  return (
    <Canvas
      dpr={[1, 2]}
      frameloop={active ? "always" : "never"}
      camera={{ position: [0, 0, 9], fov: 30, near: 0.1, far: 60 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <Track {...rest} />
    </Canvas>
  );
}
