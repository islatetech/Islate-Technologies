"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useCan3d } from "../hero/can3d";
import type { ProductView } from "./AudienceScene";

const AudienceScene = dynamic(() => import("./AudienceScene"), { ssr: false });

/**
 * One kind of buyer, shown with the iSLate product that suits them, in 3D. Scroll swings it side to
 * side, hover turns it a full 360. Without WebGL it is a plain dark tile.
 */
export function AudienceCard({
  name,
  note,
  product,
  view,
  index,
}: {
  name: string;
  note: string;
  product: string;
  view: ProductView;
  index: number;
}) {
  const mode = useCan3d();
  const box = useRef<HTMLDivElement>(null);
  const over = useRef(false);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setLive(e.isIntersecting), { rootMargin: "150px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const getScroll = useCallback(() => {
    const el = box.current;
    if (!el) return 0.5;
    const r = el.getBoundingClientRect();
    return (window.innerHeight - r.top) / (window.innerHeight + r.height);
  }, []);

  const hovering = useCallback(() => over.current, []);

  return (
    <Link href="/contact" className="group block">
      <div
        ref={box}
        onPointerEnter={() => (over.current = true)}
        onPointerLeave={() => (over.current = false)}
        className={`relative aspect-[4/3] overflow-hidden rounded-2xl bg-mist ${mode === true ? "cursor-ew-resize" : ""}`}
      >
        {mode === true && (
          <div className="absolute inset-0">
            <AudienceScene view={view} getScroll={getScroll} hovering={hovering} active={live} phase={index * 1.7} />
          </div>
        )}
        {mode === false && <div className="absolute inset-0 grid place-items-center bg-graphite text-[13px] text-white/40">iSLate screen</div>}
        <span className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-white/80 px-3 py-1 text-[11px] font-medium text-ink/60 opacity-0 backdrop-blur transition-opacity duration-300 group-hover:opacity-100">
          Move across to turn
        </span>
      </div>
      <p className="mt-4 text-[12px] uppercase tracking-[0.12em] text-white/45">{product}</p>
      <p className="mt-1 text-[18px] font-semibold tracking-tight text-white">{name}</p>
      <p className="mt-1 text-[14px] leading-snug text-white/50">{note}</p>
    </Link>
  );
}
