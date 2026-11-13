"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "../Icons";
import { useCan3d } from "./can3d";

const Scene = dynamic(() => import("./Scene"), { ssr: false });

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const window3 = (p: number, a: number, b: number) => smooth(a, a + 0.04, p) * (1 - smooth(b - 0.04, b, p));

const captions = [
  { range: [0.32, 0.46] as const, big: "4K", small: "UHD display, sharp from the last bench" },
  { range: [0.46, 0.6] as const, big: "50", small: "touch points, so a whole group can write at once" },
  { range: [0.6, 0.76] as const, big: "Android 13", small: "built in, with 8 GB RAM and 128 GB storage" },
];


/**
 * Landing hero. The iSLate smart screen is a real 3D model that follows the
 * scroll: it starts tilted beside the headline, turns flat and fills the view
 * while its specs appear, then swings away to the other side.
 * Falls back to a still product image without WebGL or with reduced motion.
 */
export function Hero3D() {
  const section = useRef<HTMLElement>(null);
  const intro = useRef<HTMLDivElement>(null);
  const outro = useRef<HTMLDivElement>(null);
  const hint = useRef<HTMLDivElement>(null);
  const caps = useRef<(HTMLDivElement | null)[]>([]);
  const mode = useCan3d();
  const is3d = mode !== false;
  const [active, setActive] = useState(true);

  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { rootMargin: "200px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const getProgress = useCallback(() => {
    const el = section.current;
    if (!el) return 0;
    const r = el.getBoundingClientRect();
    const total = r.height - window.innerHeight;
    return total > 0 ? clamp01(-r.top / total) : 0;
  }, []);

  const onProgress = useCallback((p: number) => {
    if (intro.current) {
      const o = 1 - smooth(0.04, 0.24, p);
      intro.current.style.opacity = String(o);
      intro.current.style.transform = `translate3d(0, ${-smooth(0.04, 0.24, p) * 36}px, 0)`;
    }
    if (hint.current) hint.current.style.opacity = String(1 - smooth(0.0, 0.06, p));
    captions.forEach((c, i) => {
      const el = caps.current[i];
      if (!el) return;
      const o = window3(p, c.range[0], c.range[1]);
      el.style.opacity = String(o);
      el.style.transform = `translate3d(0, ${(1 - o) * 18}px, 0)`;
    });
    if (outro.current) {
      const o = smooth(0.8, 0.94, p);
      outro.current.style.opacity = String(o);
      outro.current.style.transform = `translate3d(0, ${(1 - o) * 28}px, 0)`;
      outro.current.style.pointerEvents = o > 0.5 ? "auto" : "none";
    }
  }, []);

  return (
    <section
      id="hero3d"
      data-mode={mode === false ? "static" : "3d"}
      ref={section}
      className="on-dark relative bg-ink text-white"
      style={{ height: is3d ? "430vh" : undefined }}
      aria-label="iSLate smart screen"
    >
      <div className={`${is3d ? "sticky top-0 h-[100svh]" : "min-h-[100svh]"} overflow-hidden`}>
        {/* soft studio floor light */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 55% at 50% 48%, rgba(255,255,255,0.07), transparent 70%), linear-gradient(180deg, #0a0a0b 0%, #0d0d0f 100%)",
          }}
        />

        {mode === true ? (
          <div className="absolute inset-0">
            <Scene getProgress={getProgress} onProgress={onProgress} active={active} />
          </div>
        ) : mode === false ? (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 top-[44%] md:inset-y-0 md:left-[48%]">
            <Image
              src="/images/products/wall-panel.webp"
              alt="iSLate interactive flat panel"
              fill
              priority
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-contain p-8 drop-shadow-[0_40px_50px_rgba(0,0,0,0.6)]"
            />
          </div>
        ) : null}

        {/* 1 · headline */}
        <div
          ref={intro}
          className="container-x pointer-events-none absolute inset-x-0 top-[calc(var(--header-h)+24px)] z-10 md:top-1/2 md:-translate-y-1/2"
          style={is3d ? undefined : { position: "relative", top: "auto", paddingTop: "calc(var(--header-h) + 40px)", transform: "none" }}
        >
          <div className="pointer-events-auto max-w-[34rem]">
            <h1 className="display text-[clamp(2.4rem,4.4vw,4.2rem)]">
              A smarter board <br className="hidden md:block" />
              for every teacher.
            </h1>
            <p className="mt-5 max-w-md text-[17px] leading-relaxed text-white/65">
              Interactive flat panels, digital podiums and cameras for teachers, coaching centres, schools and
              corporates.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/shop" className="btn btn-light">
                Shop panels <ArrowRight size={18} />
              </Link>
              <Link href="/contact" className="btn btn-outline-light">
                Talk to our team
              </Link>
            </div>
          </div>
        </div>

        {/* 2 · specs that surface as the screen fills the view */}
        {is3d && (
          <div className="pointer-events-none absolute inset-x-0 bottom-[3.5svh] z-10 grid place-items-center text-center">
            <div className="relative h-24 w-full max-w-xl">
              {captions.map((c, i) => (
                <div
                  key={c.big}
                  ref={(el) => {
                    caps.current[i] = el;
                  }}
                  className="absolute inset-0 grid place-items-center opacity-0"
                >
                  <p className="text-[clamp(2.4rem,5vw,4rem)] font-bold leading-none tracking-tight">{c.big}</p>
                  <p className="mt-2 px-6 text-[15px] text-white/60">{c.small}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3 · closing line, once the screen has swung to the other side */}
        {is3d && (
          <div
            ref={outro}
            className="container-x pointer-events-none absolute inset-x-0 top-[calc(var(--header-h)+24px)] z-10 opacity-0 md:top-1/2 md:-translate-y-1/2"
          >
            <div className="max-w-md md:ml-auto">
              <h2 className="display text-[clamp(1.8rem,4vw,3.4rem)]">The whole lesson, in one place.</h2>
              <p className="mt-4 hidden max-w-sm text-[16px] leading-relaxed text-white/60 md:block">
                Write, present, record and share without switching devices.
              </p>
              <Link href="/shop" className="btn btn-light mt-7">
                Explore the range <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        )}

        {is3d && (
          <div ref={hint} className="pointer-events-none absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-center text-[12px] uppercase tracking-[0.18em] text-white/45">
            Scroll
            <span className="mx-auto mt-2 block h-8 w-px bg-gradient-to-b from-white/50 to-transparent" />
          </div>
        )}
      </div>
    </section>
  );
}
