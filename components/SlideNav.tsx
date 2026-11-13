"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Category } from "@/lib/types";

export interface SlideNavItem {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}

/**
 * Plain text navigation. A soft highlight follows the cursor from item to item
 * and an underline slides under it. Items with children open a small list.
 * At rest the underline sits under the page you are on.
 */
export function SlideNav({
  items,
  activeIndex,
  tone,
}: {
  items: SlideNavItem[];
  activeIndex: number;
  tone: "light" | "dark";
}) {
  const wrap = useRef<HTMLElement>(null);
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const hl = useRef<HTMLSpanElement>(null);
  const ul = useRef<HTMLSpanElement>(null);
  const [hover, setHover] = useState<number | null>(null);

  // Place the highlight and the underline directly on the DOM, so moving the
  // cursor never re-renders the nav.
  const place = useCallback((i: number, showHighlight: boolean) => {
    const el = refs.current[i];
    if (!el) return;
    const left = el.offsetLeft;
    const width = el.offsetWidth;
    if (hl.current) {
      hl.current.style.left = left + "px";
      hl.current.style.width = width + "px";
      hl.current.style.opacity = showHighlight ? "1" : "0";
    }
    if (ul.current) {
      ul.current.style.left = left + 14 + "px";
      ul.current.style.width = Math.max(0, width - 28) + "px";
      ul.current.style.opacity = "1";
    }
  }, []);

  useEffect(() => {
    place(activeIndex, false);
    const onResize = () => place(activeIndex, false);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [activeIndex, place]);

  const enter = (i: number) => {
    place(i, true);
    setHover(i);
  };

  const leave = () => {
    place(activeIndex, false);
    setHover(null);
  };

  const dark = tone === "dark";

  return (
    <nav
      ref={wrap}
      aria-label="Primary"
      className="relative flex items-center"
      onMouseLeave={leave}
      onBlur={(e) => {
        if (!wrap.current?.contains(e.relatedTarget as Node)) leave();
      }}
    >
      {/* the highlight that follows the cursor */}
      <span
        ref={hl}
        aria-hidden="true"
        className={`pointer-events-none absolute top-0 h-full rounded-lg opacity-0 transition-[left,width,opacity] duration-300 ease-[var(--ease-out-expo)] ${
          dark ? "bg-white/10" : "bg-ink/[0.06]"
        }`}
      />
      {/* the underline */}
      <span
        ref={ul}
        aria-hidden="true"
        className={`pointer-events-none absolute -bottom-0.5 h-[2px] rounded-full opacity-0 transition-[left,width,opacity] duration-300 ease-[var(--ease-out-expo)] ${
          dark ? "bg-white" : "bg-ink"
        }`}
      />

      {items.map((item, i) => (
        <div
          key={item.href}
          ref={(el) => {
            refs.current[i] = el;
          }}
          className="relative"
          onMouseEnter={() => enter(i)}
          onFocus={() => enter(i)}
        >
          <Link
            href={item.href}
            aria-current={i === activeIndex ? "page" : undefined}
            className={`relative flex h-10 items-center px-3.5 text-[15px] font-medium transition-opacity ${
              i === activeIndex || hover === i ? "opacity-100" : "opacity-70"
            }`}
          >
            {item.label}
          </Link>

          {item.children && (
            <div
              className={`absolute left-0 top-full pt-3 transition-all duration-300 ease-[var(--ease-out-expo)] ${
                hover === i ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0"
              }`}
            >
              <ul
                className={`min-w-[210px] rounded-xl border p-1.5 shadow-[0_24px_50px_-20px_rgba(0,0,0,0.45)] ${
                  dark ? "border-white/10 bg-[#101012] text-white" : "border-ink/10 bg-white text-ink"
                }`}
              >
                {item.children.map((c) => (
                  <li key={c.href}>
                    <Link
                      href={c.href}
                      tabIndex={hover === i ? 0 : -1}
                      className={`block rounded-lg px-3.5 py-2.5 text-[14px] transition-colors ${
                        dark ? "text-white/75 hover:bg-white/10 hover:text-white" : "text-ink/75 hover:bg-ink/[0.06] hover:text-ink"
                      }`}
                    >
                      {c.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </nav>
  );
}

export function buildNavItems(categories: Category[]): SlideNavItem[] {
  return [
    { label: "Home", href: "/" },
    {
      label: "Shop",
      href: "/shop",
      children: [
        { label: "All products", href: "/shop" },
        ...categories.map((c) => ({ label: c.name, href: `/shop?category=${c.slug}` })),
      ],
    },
    { label: "About us", href: "/about" },
    { label: "Contact us", href: "/contact" },
  ];
}
