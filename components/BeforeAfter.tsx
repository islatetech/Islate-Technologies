"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Drag (or use the arrow keys) to compare two photographs. The "before" is
 * shown in black and white. When it first scrolls into view the handle sweeps
 * across once so people see that it moves.
 */
export function BeforeAfter({
  before,
  after,
  beforeAlt,
  afterAlt,
}: {
  before: string;
  after: string;
  beforeAlt: string;
  afterAlt: string;
}) {
  const [pos, setPos] = useState(8);
  const box = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const sweep = useRef(0);

  const stopSweep = () => cancelAnimationFrame(sweep.current);

  const move = useCallback((clientX: number) => {
    const r = box.current?.getBoundingClientRect();
    if (!r) return;
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  }, []);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      sweep.current = requestAnimationFrame(() => setPos(50));
      return () => cancelAnimationFrame(sweep.current);
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const run = (now: number) => {
          const t = Math.min(1, (now - t0) / 2600);
          const smooth = (v: number) => v * v * (3 - 2 * v);
          // out to the far side, then back to the middle
          setPos(t < 0.6 ? 8 + 84 * smooth(t / 0.6) : 92 - 42 * smooth((t - 0.6) / 0.4));
          if (t < 1) sweep.current = requestAnimationFrame(run);
        };
        sweep.current = requestAnimationFrame(run);
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(sweep.current);
    };
  }, []);

  return (
    <div
      ref={box}
      className="relative h-full w-full touch-pan-y select-none overflow-hidden rounded-2xl bg-graphite has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-4 has-[:focus-visible]:outline-white"
      onPointerDown={(e) => {
        stopSweep();
        dragging.current = true;
        e.currentTarget.setPointerCapture(e.pointerId);
        move(e.clientX);
      }}
      onPointerMove={(e) => dragging.current && move(e.clientX)}
      onPointerUp={() => (dragging.current = false)}
      onPointerCancel={() => (dragging.current = false)}
    >
      <Image src={after} alt={afterAlt} fill sizes="(min-width: 1024px) 1000px, 94vw" className="object-cover" draggable={false} />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <Image src={before} alt={beforeAlt} fill sizes="(min-width: 1024px) 1000px, 94vw" className="object-cover grayscale" draggable={false} />
      </div>

      <span className="pointer-events-none absolute left-4 top-4 rounded-full bg-ink/85 px-3.5 py-1.5 text-xs font-semibold text-white">
        Before
      </span>
      <span className="pointer-events-none absolute right-4 top-4 rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-ink">
        After
      </span>

      <div className="pointer-events-none absolute inset-y-0 w-px bg-white/90" style={{ left: `${pos}%` }}>
        <span className="absolute left-1/2 top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize place-items-center rounded-full bg-white/95 text-ink shadow-[0_8px_24px_rgba(0,0,0,0.35)]">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <circle cx="9" cy="7" r="1.4" /><circle cx="15" cy="7" r="1.4" />
            <circle cx="9" cy="12" r="1.4" /><circle cx="15" cy="12" r="1.4" />
            <circle cx="9" cy="17" r="1.4" /><circle cx="15" cy="17" r="1.4" />
          </svg>
        </span>
      </div>

      <input
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => {
          stopSweep();
          setPos(Number(e.target.value));
        }}
        aria-label="Compare the classroom before and after"
        className="sr-only"
      />
    </div>
  );
}
