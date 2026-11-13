"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowRight, Mail, Phone, Pin } from "./Icons";
import { Logo } from "./Logo";
import { footerLinks, site } from "@/lib/site";

const pills = footerLinks.filter((l) => !["Home", "Our products"].includes(l.label));

/**
 * Reveal footer. The page sits on top of a fixed footer and slides up to
 * uncover it, so the footer is "already there" when you reach the end.
 * If the footer is taller than the screen it falls back to a normal footer.
 */
export function SiteFooter({ children }: { children: ReactNode }) {
  const footer = useRef<HTMLElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const [pinned, setPinned] = useState(true);

  const measure = useCallback(() => {
    const el = footer.current;
    if (!el) return;
    const h = el.offsetHeight;
    setHeight(h);
    setPinned(h <= window.innerHeight);
  }, []);

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (footer.current) ro.observe(footer.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  // the footer's content rises and fades in as it is uncovered
  useEffect(() => {
    if (!pinned || !height) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const doc = document.documentElement;
      const left = doc.scrollHeight - (window.scrollY + window.innerHeight);
      const r = Math.min(1, Math.max(0, 1 - left / height));
      const el = inner.current;
      if (el) {
        el.style.opacity = String(0.25 + 0.75 * r);
        el.style.transform = `translate3d(0, ${(1 - r) * -56}px, 0)`;
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [pinned, height]);

  return (
    <>
      <div className="relative z-10 bg-white" style={{ marginBottom: pinned ? height : 0 }}>
        {children}
      </div>

      <footer
        ref={footer}
        className={`on-dark flex min-h-[100svh] flex-col overflow-hidden bg-ink text-white ${pinned ? "fixed inset-x-0 bottom-0 z-0" : "relative z-10"}`}
      >
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px" style={{ background: "var(--chrome)", opacity: 0.35 }} />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ background: "radial-gradient(60% 70% at 50% 0%, rgba(255,255,255,0.06), transparent 70%)" }}
        />

        <div ref={inner} className="container-x relative flex flex-1 flex-col will-change-transform">
          <div className="flex flex-1 flex-col items-center justify-center pb-8 pt-[calc(var(--header-h)+8px)] text-center">
            <Logo tone="dark" height={34} />
            <h2 className="display mt-8 max-w-3xl text-[clamp(2.2rem,5.2vw,4.4rem)]">Ready to upgrade your classroom?</h2>
            <p className="mt-4 max-w-md text-[16px] leading-relaxed text-white/55">
              Teachers, coaching centres, schools and corporates, one range of smart education equipment.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/shop" className="btn btn-light">
                Shop panels <ArrowRight size={18} />
              </Link>
              <a href={site.phoneHref} className="btn btn-outline-light">
                <Phone size={18} /> {site.phone}
              </a>
            </div>

            <nav aria-label="Footer" className="mt-12 flex flex-wrap justify-center gap-2.5">
              {pills.map((l) => (
                <Link
                  key={l.href + l.label}
                  href={l.href}
                  className="rounded-full border border-white/12 bg-white/[0.04] px-5 py-2.5 text-[14px] text-white/70 transition-colors hover:border-white/40 hover:bg-white/10 hover:text-white"
                >
                  {l.label}
                </Link>
              ))}
            </nav>

            <ul className="mt-9 flex flex-col items-center gap-3 text-[14px] text-white/50 md:flex-row md:gap-8">
              <li>
                <a href={`mailto:${site.email}`} className="flex items-center gap-2 hover:text-white">
                  <Mail size={16} /> {site.email}
                </a>
              </li>
              <li>
                <a href={site.mapHref} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-white">
                  <Pin size={16} /> {site.address}
                </a>
              </li>
            </ul>
          </div>

          <div className="relative flex items-center border-t border-white/10 py-5 text-[12px] uppercase tracking-[0.12em] text-white/40">
            <p>
              &copy; {site.year} {site.name}. All rights reserved.
            </p>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              aria-label="Back to top"
              className="absolute left-1/2 grid h-10 w-10 -translate-x-1/2 place-items-center rounded-full border border-white/15 bg-ink/60 text-white/70 transition-colors hover:bg-white hover:text-ink"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 19V5M6 11l6-6 6 6" />
              </svg>
            </button>
          </div>
        </div>
      </footer>
    </>
  );
}
