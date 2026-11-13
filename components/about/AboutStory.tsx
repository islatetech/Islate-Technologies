"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "../Icons";
import { useCan3d } from "../hero/can3d";

const StoryScene = dynamic(() => import("./StoryScene"), { ssr: false });

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
/** 0 before a, rises to 1 by b, holds until c, falls to 0 by d. */
const win = (p: number, a: number, b: number, c: number, d: number) => smooth(a, b, p) * (1 - smooth(c, d, p));

const scenes = [
  { id: "mission", label: "Mission", win: [-1, -0.5, 0.12, 0.22] as [number, number, number, number] },
  { id: "classrooms", label: "Classrooms", win: [0.24, 0.31, 0.42, 0.5] as [number, number, number, number] },
  { id: "range", label: "The range", win: [0.52, 0.6, 0.7, 0.78] as [number, number, number, number] },
  { id: "plan", label: "Plan", win: [0.8, 0.88, 2, 3] as [number, number, number, number] },
];
const points = [
  { t: "4K and 50 point touch", d: "A display that is sharp from the last bench, and room for a whole group to write at once." },
  { t: "Android 13 built in", d: "Runs the teaching apps you already use, with no separate computer to buy or maintain." },
  { t: "Wall, trolley or stand", d: "Choose 65, 75 or 86 inch, mounted on the wall or rolling between rooms." },
];

/**
 * One board, four scenes. The section pins to the screen, the 3D board glides
 * between four poses as you scroll, and the words change with it.
 */
export function AboutStory({ phone, whatsapp }: { phone: string; whatsapp: string }) {
  const mode = useCan3d();
  const section = useRef<HTMLElement>(null);
  const left = useRef<HTMLDivElement>(null);
  const full = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(true);

  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setLive(e.isIntersecting), { rootMargin: "200px" });
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

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const p = getProgress();
      const w = scenes.map((s) => win(p, ...s.win));
      const root = section.current;
      root?.querySelectorAll<HTMLElement>("[data-layer]").forEach((el) => {
        const o = w[Number(el.dataset.layer)];
        el.style.opacity = String(o);
        el.style.transform = `translate3d(0, ${(1 - o) * 26}px, 0)`;
        el.style.pointerEvents = o > 0.5 ? "auto" : "none";
        el.style.visibility = o < 0.01 ? "hidden" : "visible";
      });
      if (left.current) left.current.style.opacity = String(Math.max(w[0], w[2]) * 0.9);
      if (full.current) full.current.style.opacity = String(w[3] * 0.62);
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
  }, [getProgress]);

  return (
    <section ref={section} className="on-dark relative bg-ink text-white" style={{ height: "640vh" }} aria-label="About iSLate">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ background: "radial-gradient(60% 60% at 70% 40%, rgba(255,255,255,0.05), transparent 70%), #0a0a0b" }}
        />

        <div className="absolute inset-0">
          {mode === true && <StoryScene getProgress={getProgress} active={live} />}
          {mode === false && (
            <div className="absolute inset-y-0 right-0 w-full md:w-1/2">
              <Image src="/images/products/wall-panel.webp" alt="iSLate interactive flat panel" fill sizes="50vw" className="object-contain p-10 opacity-70" />
            </div>
          )}
        </div>

        {/* keeps the words readable over the board */}
        <div ref={left} aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,#0a0a0b_0%,rgba(10,10,11,0.78)_34%,rgba(10,10,11,0)_62%)] max-md:bg-[linear-gradient(180deg,rgba(10,10,11,0)_30%,rgba(10,10,11,0.85)_62%)]" style={{ opacity: 0.9 }} />
        <div ref={full} aria-hidden="true" className="pointer-events-none absolute inset-0 bg-ink" style={{ opacity: 0 }} />

        {/* 1 · who we are (the islate.in text) */}
        <div data-layer="0" className="absolute inset-0 z-10 flex items-end px-[max(1.25rem,4vw)] pb-[12svh] md:items-center md:pb-0 md:pt-[var(--header-h)]">
          <div className="max-w-xl">
            <h1 className="text-[clamp(2.6rem,6vw,5.4rem)] font-bold leading-[1.02] tracking-[-0.04em]">Who we are</h1>
            {/* Word for word from https://islate.in/elm-about-us/ */}
            <p className="mt-6 max-w-xl text-[clamp(1.05rem,1.35vw,1.2rem)] leading-[1.65] text-white/75">
              &quot;At Islate Technologies Pvt Ltd, our mission is to transform teaching styles by providing smart
              education solutions to teachers, coaching centers, schools, and corporates, revolutionizing the education
              equipment supply industry.&quot;
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/shop" className="btn btn-light">
                Explore the range <ArrowRight size={18} />
              </Link>
              <Link href="/contact" className="btn btn-outline-light">
                Talk to our team
              </Link>
            </div>
          </div>
        </div>

        {/* 2 · classrooms */}
        <div data-layer="1" className="absolute inset-0 z-10 flex items-end justify-center px-6 pb-[11svh] text-center md:items-start md:pb-0 md:pt-[44svh]">
          <div className="max-w-2xl">
            <h2 className="text-[clamp(2.2rem,5vw,4rem)] font-bold leading-[1.05] tracking-[-0.035em]">Made for real classrooms.</h2>
            <p className="mx-auto mt-4 max-w-xl text-[16px] leading-relaxed text-white/60">
              The iSLate range is derived from authentic classroom environments. Every panel, podium and camera is
              chosen to make teaching simpler, so the teacher can give their attention to the people in the room.
            </p>
          </div>
        </div>

        {/* 3 · the range */}
        <div data-layer="2" className="absolute inset-0 z-10 flex items-end px-[max(1.25rem,4vw)] pb-[6svh] md:items-center md:pb-0 md:pt-[var(--header-h)]">
          <div className="w-full max-w-xl">
            <h2 className="text-[clamp(2rem,4.6vw,3.8rem)] font-bold leading-[1.04] tracking-[-0.035em]">Every room, every size.</h2>
            <ul className="mt-6 space-y-3">
              {points.map((x) => (
                <li key={x.t} className="rounded-xl border border-white/10 bg-white/[0.05] px-5 py-4 backdrop-blur">
                  <p className="flex items-center gap-2.5 text-[15px] font-semibold">
                    <span className="h-1.5 w-1.5 rounded-full bg-white" /> {x.t}
                  </p>
                  <p className="mt-1 pl-4 text-[13.5px] leading-snug text-white/55">{x.d}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 4 · plan */}
        <div data-layer="3" className="absolute inset-0 z-10 grid place-items-center px-6 text-center">
          <div className="max-w-2xl">
            <h2 className="text-[clamp(2.4rem,5.6vw,4.6rem)] font-bold leading-[1.04] tracking-[-0.04em]">Let us plan your classroom.</h2>
            <p className="mx-auto mt-5 max-w-md text-[16px] leading-relaxed text-white/65">
              Our team will walk you through the range and help you choose the right setup for your institution.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/contact" className="btn btn-light">
                Get in touch <ArrowRight size={18} />
              </Link>
              <Link href="/shop" className="btn btn-outline-light">
                Browse products
              </Link>
            </div>
            <p className="mt-6 text-[14px] text-white/45">
              {phone} &nbsp;·&nbsp;{" "}
              <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer" className="underline underline-offset-4 hover:text-white">
                WhatsApp
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
