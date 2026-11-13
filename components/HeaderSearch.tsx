"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { SearchIcon } from "./Icons";
import { formatPrice } from "@/lib/format";

export interface SearchItem {
  slug: string;
  name: string;
  price: number;
  image: string;
  fit?: "cover" | "cutout";
  categories: string[];
}

const popular = ["Flat Panel", "PTZ Camera", "Studio Setup", "Digital Podium"];

/**
 * The search field that lives in the navbar. A dark pill with a soft band of
 * coloured light drifting along its lower edge, which brightens while you type.
 * Results open right under it. Enter opens the highlighted product, or the
 * shop filtered by what you typed.
 */
export function HeaderSearch({
  items,
  variant = "bar",
  focusKey = 0,
  onNavigate,
}: {
  items: SearchItem[];
  variant?: "bar" | "menu";
  /** change this number to move the cursor into the field */
  focusKey?: number;
  onNavigate?: () => void;
}) {
  const router = useRouter();
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);

  const query = q.trim().toLowerCase();
  const results = useMemo(
    () =>
      query
        ? items.filter((i) => (i.name + " " + i.categories.join(" ")).toLowerCase().includes(query)).slice(0, 5)
        : [],
    [items, query],
  );

  // wait a moment so the menu is on screen before the cursor goes in
  useEffect(() => {
    if (focusKey <= 0) return;
    const t = setTimeout(() => input.current?.focus(), 120);
    return () => clearTimeout(t);
  }, [focusKey]);

  // close when you click anywhere else
  useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", away);
    return () => document.removeEventListener("pointerdown", away);
  }, [open]);

  const done = () => {
    setOpen(false);
    setQ("");
    setActive(-1);
    input.current?.blur();
    onNavigate?.();
  };

  const openProduct = (slug: string) => {
    router.push(`/product/${slug}`);
    done();
  };

  const submit = () => {
    if (active >= 0 && results[active]) return openProduct(results[active].slug);
    if (!q.trim()) return;
    router.push(`/shop?q=${encodeURIComponent(q.trim())}`);
    done();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((a) => Math.min(results.length - 1, a + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(-1, a - 1));
    } else if (e.key === "Escape") {
      setOpen(false);
      input.current?.blur();
    } else if (e.key === "Enter") {
      e.preventDefault();
      submit();
    }
  };

  const bar = variant === "bar";
  const showPanel = open;

  return (
    <div ref={root} className={`relative ${bar ? "hidden lg:block" : "block"}`}>
      <div
        className={`search-pill group relative flex items-center gap-2.5 overflow-hidden rounded-full border bg-white/[0.07] px-4 transition-all duration-500 ease-[var(--ease-out-expo)] ${
          bar ? "h-10 w-[160px] xl:w-[210px]" : "h-12 w-full"
        } ${open ? `border-white/25 bg-white/[0.1] ${bar ? "!w-[190px] xl:!w-[290px]" : ""}` : "border-white/10 hover:border-white/20"}`}
      >
        <SearchIcon size={17} className="shrink-0 text-white/45" />
        <input
          ref={input}
          id={`${id}-search`}
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setActive(-1);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="Search"
          autoComplete="off"
          role="combobox"
          aria-expanded={showPanel}
          aria-controls={`${id}-results`}
          aria-label="Search products"
          className="min-w-0 flex-1 bg-transparent text-[14px] text-white outline-none placeholder:text-white/40"
        />
        {/* the band of light along the lower edge */}
        <span aria-hidden="true" className={`search-glow ${open ? "is-on" : ""}`} />
      </div>

      <div
        id={`${id}-results`}
        role="listbox"
        className={`z-50 rounded-2xl border border-white/10 bg-[#0f0f11] p-1.5 text-white transition-all duration-300 ease-[var(--ease-out-expo)] ${
          bar ? "absolute right-0 top-full mt-3 w-[360px]" : "mt-3"
        } ${showPanel ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0"}`}
      >
        {query ? (
          results.length ? (
            results.map((r, i) => (
              <button
                key={r.slug}
                type="button"
                role="option"
                aria-selected={active === i}
                onMouseEnter={() => setActive(i)}
                onClick={() => openProduct(r.slug)}
                tabIndex={showPanel ? 0 : -1}
                className={`flex w-full items-center gap-3.5 rounded-xl p-2.5 text-left transition-colors ${
                  active === i ? "bg-white/[0.08]" : ""
                }`}
              >
                <span className="relative h-12 w-14 shrink-0 overflow-hidden rounded-lg bg-white/[0.06]">
                  <Image src={r.image} alt="" fill sizes="56px" className={r.fit === "cutout" ? "object-contain p-1" : "object-cover"} />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[14px] font-semibold">{r.name}</span>
                  <span className="text-[12.5px] text-white/50">From {formatPrice(r.price)}</span>
                </span>
              </button>
            ))
          ) : (
            <p className="px-3 py-4 text-[14px] text-white/50">No products match &ldquo;{q}&rdquo;.</p>
          )
        ) : (
          <div className="p-2.5">
            <p className="text-[12px] uppercase tracking-[0.14em] text-white/40">Popular</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {popular.map((p) => (
                <button
                  key={p}
                  type="button"
                  tabIndex={showPanel ? 0 : -1}
                  onClick={() => {
                    setQ(p);
                    input.current?.focus();
                  }}
                  className="rounded-full border border-white/12 px-3.5 py-1.5 text-[13px] text-white/75 transition-colors hover:border-white/40 hover:text-white"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
