"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { Product } from "@/lib/types";

/**
 * The product on its shelf. Drag it left or right and it turns on the spot,
 * then eases back. Until you touch it, it sways gently. Photographs in the
 * gallery show as plain images.
 */
export function ProductStage({ product }: { product: Product }) {
  const [index, setIndex] = useState(0);
  const [rot, setRot] = useState(0);
  const [tilt, setTilt] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [touched, setTouched] = useState(false);
  const start = useRef({ x: 0, y: 0, rot: 0, tilt: 0 });

  const img = product.images[index];
  const isCutout = img.fit === "cutout";

  return (
    <div>
      <div
        className={`relative h-[min(54svh,520px)] select-none ${isCutout ? "cursor-grab touch-pan-y active:cursor-grabbing" : ""}`}
        style={{ perspective: 1400 }}
        onPointerDown={(e) => {
          if (!isCutout) return;
          e.currentTarget.setPointerCapture(e.pointerId);
          start.current = { x: e.clientX, y: e.clientY, rot, tilt };
          setDragging(true);
          setTouched(true);
        }}
        onPointerMove={(e) => {
          if (!dragging) return;
          const dx = e.clientX - start.current.x;
          const dy = e.clientY - start.current.y;
          setRot(Math.max(-62, Math.min(62, start.current.rot + dx * 0.32)));
          setTilt(Math.max(-10, Math.min(10, start.current.tilt - dy * 0.08)));
        }}
        onPointerUp={() => {
          setDragging(false);
          setRot(0);
          setTilt(0);
        }}
        onPointerCancel={() => {
          setDragging(false);
          setRot(0);
          setTilt(0);
        }}
      >
        <div className="absolute inset-x-0 bottom-[14px] top-0">
          {isCutout ? (
            <div
              className="absolute inset-0"
              style={{
                transformStyle: "preserve-3d",
                transform: touched ? `rotateY(${rot}deg) rotateX(${tilt}deg)` : undefined,
                transition: dragging ? "none" : "transform 0.9s cubic-bezier(0.2, 0.9, 0.25, 1.15)",
                animation: touched ? undefined : "sway 7s ease-in-out infinite",
              }}
            >
              <Image
                key={img.src}
                src={img.src}
                alt={img.alt}
                fill
                priority
                draggable={false}
                sizes="(min-width: 1024px) 48vw, 94vw"
                className="rise object-contain object-bottom px-4"
                style={{ filter: "drop-shadow(0 26px 24px rgba(10,10,11,0.16))" }}
              />
            </div>
          ) : (
            <Image key={img.src} src={img.src} alt={img.alt} fill priority sizes="(min-width: 1024px) 48vw, 94vw" className="rise rounded-2xl object-cover" />
          )}
        </div>
        <div className="shelf" aria-hidden="true" />
      </div>

      <p className="mt-4 text-center text-[13px] text-muted">{isCutout ? "Drag to turn" : " "}</p>

      {product.images.length > 1 && (
        <div className="mt-5 flex justify-center gap-3">
          {product.images.map((im, i) => (
            <button
              key={im.src}
              onClick={() => {
                setIndex(i);
                setRot(0);
                setTilt(0);
              }}
              aria-label={`Show image ${i + 1}`}
              aria-current={i === index}
              className={`relative h-16 w-20 overflow-hidden rounded-xl bg-white transition-all ${
                i === index ? "ring-2 ring-ink ring-offset-2 ring-offset-shelf" : "opacity-60 hover:opacity-100"
              }`}
            >
              <Image src={im.src} alt="" fill sizes="80px" className={im.fit === "cutout" ? "object-contain p-1.5" : "object-cover"} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
