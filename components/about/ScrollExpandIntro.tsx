"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * The opening of the About page. A small framed photo of a modern classroom sits
 * over the old one; as you scroll it opens out to fill the whole screen, the title
 * splits apart to make room, and the line that follows fades in over the photo.
 */
export function ScrollExpandIntro() {
  const section = useRef<HTMLElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const photo = useRef<HTMLDivElement>(null);
  const bg = useRef<HTMLDivElement>(null);
  const left = useRef<HTMLSpanElement>(null);
  const right = useRef<HTMLSpanElement>(null);
  const title = useRef<HTMLDivElement>(null);
  const caption = useRef<HTMLDivElement>(null);
  const shade = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = section.current;
    if (!root) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;

    const update = () => {
      raf = 0;
      const r = root.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      const raw = total > 0 ? clamp01(-r.top / total) : 1;
      const p = reduce ? 1 : raw;
      const e = smooth(0, 0.78, p); // the opening-out
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const small = vw < 768;

      const w0 = small ? Math.min(vw * 0.64, 280) : Math.min(vw * 0.26, 380);
      const h0 = small ? w0 * 1.3 : w0 * 1.22;

      if (frame.current) {
        frame.current.style.width = `${lerp(w0, vw, e)}px`;
        frame.current.style.height = `${lerp(h0, vh, e)}px`;
        frame.current.style.borderRadius = `${lerp(28, 0, e)}px`;
        frame.current.style.boxShadow = `0 ${lerp(40, 0, e)}px ${lerp(90, 0, e)}px rgba(0,0,0,${lerp(0.6, 0, e)})`;
      }
      // the photo settles from a slight zoom as it opens
      if (photo.current) photo.current.style.transform = `scale(${lerp(1.25, 1, e)})`;
      if (bg.current) {
        bg.current.style.opacity = String(1 - smooth(0.25, 0.8, p));
        bg.current.style.transform = `scale(${lerp(1, 1.12, p)})`;
      }
      const spread = e * (small ? 46 : 38);
      if (left.current) left.current.style.transform = `translate3d(${-spread}vw,0,0)`;
      if (right.current) right.current.style.transform = `translate3d(${spread}vw,0,0)`;
      if (title.current) title.current.style.opacity = String(1 - smooth(0.45, 0.78, p));
      if (shade.current) shade.current.style.opacity = String(smooth(0.55, 1, p));
      if (caption.current) {
        const c = smooth(0.72, 0.96, p);
        caption.current.style.opacity = String(c);
        caption.current.style.transform = `translate3d(0,${(1 - c) * 30}px,0)`;
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={section} className="on-dark relative bg-ink text-white" style={{ height: "280vh" }} aria-label="iSLate Technologies">
      <div className="sticky top-0 grid h-[100svh] place-items-center overflow-hidden">
        {/* the old classroom, dimmed, behind everything */}
        <div ref={bg} aria-hidden="true" className="absolute inset-0 will-change-transform">
          <Image src="/images/photos/before.webp" alt="" fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-[radial-gradient(70%_70%_at_50%_50%,rgba(10,10,11,0.55),rgba(10,10,11,0.92))]" />
        </div>

        {/* the new classroom, in a frame that opens out */}
        <div
          ref={frame}
          className="relative z-[1] overflow-hidden will-change-[width,height]"
          style={{ width: 340, height: 410, borderRadius: 28 }}
        >
          <div ref={photo} className="absolute inset-0 will-change-transform" style={{ transform: "scale(1.25)" }}>
            <Image src="/images/photos/after.webp" alt="A classroom with an iSLate interactive panel" fill priority sizes="100vw" className="object-cover" />
          </div>
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/15" />
          <div
            ref={shade}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,11,0.35)_0%,rgba(10,10,11,0.1)_40%,rgba(10,10,11,0.82)_100%)]"
            style={{ opacity: 0 }}
          />
        </div>

        {/* title that splits either side of the frame */}
        <div ref={title} className="pointer-events-none absolute inset-x-0 top-1/2 z-[2] -translate-y-1/2 text-center">
          <h1 className="flex items-center justify-center gap-[0.25em] text-[clamp(2.8rem,10vw,9rem)] font-bold leading-none tracking-[-0.045em] mix-blend-difference">
            <span ref={left} className="will-change-transform">iSLate</span>
            <span ref={right} className="will-change-transform text-white/80">Technologies</span>
          </h1>
        </div>

        {/* line that arrives once the photo fills the screen */}
        <div
          ref={caption}
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] px-[max(1.25rem,4vw)] pb-[10svh] text-center"
          style={{ opacity: 0 }}
        >
          <p className="mx-auto max-w-3xl text-[clamp(1.8rem,4.4vw,3.6rem)] font-bold leading-[1.08] tracking-[-0.035em]">
            Smart classrooms, made simple.
          </p>
        </div>

        {/* bleeds into the next section */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-24 bg-gradient-to-b from-transparent to-ink" />
      </div>
    </section>
  );
}
