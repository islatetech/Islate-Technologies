"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Logo } from "./Logo";
import { SlideNav, buildNavItems } from "./SlideNav";
import { useStore } from "./StoreProvider";
import { BagIcon, CloseIcon, HeartIcon, MenuIcon, SearchIcon, Phone } from "./Icons";
import { nav, site } from "@/lib/site";
import { formatPrice } from "@/lib/format";
import type { Category } from "@/lib/types";

export interface SearchItem {
  slug: string;
  name: string;
  price: number;
  image: string;
  fit?: "cover" | "cutout";
  categories: string[];
}

const routeToIndex = (path: string) => {
  if (path === "/") return 0;
  if (path.startsWith("/about")) return 2;
  if (path.startsWith("/contact")) return 3;
  return 1; // shop, product, cart, checkout, orders
};

export function Header({ categories, items }: { categories: Category[]; items: SearchItem[] }) {
  const pathname = usePathname();
  const { count, setDrawerOpen, searchOpen, setSearchOpen, wishlist } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  const [prevPath, setPrevPath] = useState(pathname);
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setMobileOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
  }, [mobileOpen]);

  const iconBtn =
    "relative grid h-11 w-11 place-items-center rounded-full transition-colors hover:bg-white/10";

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-50 bg-ink text-white shadow-[0_1px_0_rgba(255,255,255,0.08)]"
      >
        {/* Announcement bar, collapses once the page is scrolled */}
        <div
          className={`overflow-hidden border-b border-white/[0.07] bg-ink text-[13px] text-white/85 transition-[max-height] duration-500 ${
            scrolled ? "max-h-0" : "max-h-9"
          }`}
        >
          <div className="container-x flex h-9 items-center justify-between gap-6">
            <p className="truncate">
              First order? Use <strong className="font-semibold text-white">{site.firstOrderCoupon.code}</strong> for{" "}
              {site.firstOrderCoupon.percent}% off. Free delivery on every panel.
            </p>
            <a href={site.phoneHref} className="hidden shrink-0 items-center gap-2 hover:text-white sm:flex">
              <Phone size={14} /> {site.phone}
            </a>
          </div>
        </div>

        <div className="container-x relative flex items-center justify-between gap-6" style={{ height: "var(--nav-h)" }}>
          <Logo tone="dark" height={52} />

          {/* Text navigation (desktop) */}
          <div className="absolute left-1/2 hidden -translate-x-1/2 lg:block">
            <SlideNav items={buildNavItems(categories)} activeIndex={routeToIndex(pathname)} tone="dark" />
          </div>

          <div className="flex items-center gap-1">
            <button className={iconBtn} aria-label="Search" onClick={() => setSearchOpen(true)}>
              <SearchIcon />
            </button>
            <Link href="/orders?tab=wishlist" className={`${iconBtn} hidden sm:grid`} aria-label="Wishlist">
              <HeartIcon />
              {wishlist.length > 0 && (
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-white" />
              )}
            </Link>
            <button className={iconBtn} aria-label={`Cart, ${count} items`} onClick={() => setDrawerOpen(true)}>
              <BagIcon />
              {count > 0 && (
                <span className="absolute right-0.5 top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-white px-1 text-[11px] font-bold text-ink">
                  {count}
                </span>
              )}
            </button>
            <button
              className={`${iconBtn} lg:hidden`}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-40 bg-ink pt-[var(--nav-h)] text-white transition-all duration-500 lg:hidden ${
          mobileOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <div className="container-x flex h-full flex-col overflow-y-auto pb-10 pt-6">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="border-b border-white/10 py-4 text-2xl font-semibold tracking-tight">
              {item.label}
            </Link>
          ))}
          <p className="eyebrow mt-8">Shop by category</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {categories.map((c) => (
              <Link key={c.slug} href={`/shop?category=${c.slug}`} className="rounded-xl bg-white/10 px-4 py-4 text-[15px] font-semibold">
                {c.name}
              </Link>
            ))}
          </div>
          <a href={site.phoneHref} className="btn btn-light mt-8">
            <Phone size={18} /> Call {site.phone}
          </a>
        </div>
      </div>

      <SearchOverlay items={items} open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

function SearchOverlay({ items, open, onClose }: { items: SearchItem[]; open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const close = () => {
    setQ("");
    onClose();
  };

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 60);
    } else {
      document.body.style.overflow = "";
    }
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const query = q.trim().toLowerCase();
  const results = query ? items.filter((i) => (i.name + " " + i.categories.join(" ")).toLowerCase().includes(query)) : [];
  const popular = ["Flat Panel", "PTZ Camera", "Studio Setup", "Digital Podium"];

  return (
    <div
      className={`fixed inset-0 z-[60] transition-all duration-300 ${open ? "visible opacity-100" : "invisible opacity-0"}`}
      role="dialog"
      aria-modal="true"
      aria-label="Search"
    >
      <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm" onClick={close} />
      <div
        className={`relative bg-white shadow-2xl transition-transform duration-500 ease-[var(--ease-out-expo)] ${
          open ? "translate-y-0" : "-translate-y-8"
        }`}
      >
        <div className="container-x py-6 md:py-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              close();
              router.push(`/shop?q=${encodeURIComponent(q)}`);
            }}
            className="flex items-center gap-4"
          >
            <SearchIcon size={26} className="text-muted" />
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search panels, podiums, cameras"
              className="h-14 flex-1 bg-transparent text-xl font-semibold outline-none placeholder:text-[#a0a3aa] md:text-3xl"
              aria-label="Search products"
            />
            <button type="button" onClick={close} className="grid h-11 w-11 place-items-center rounded-full hover:bg-mist" aria-label="Close search">
              <CloseIcon />
            </button>
          </form>

          <div className="mt-6 max-h-[60vh] overflow-y-auto pb-2">
            {query ? (
              results.length ? (
                <ul className="grid gap-2 md:grid-cols-2">
                  {results.map((r) => (
                    <li key={r.slug}>
                      <Link
                        href={`/product/${r.slug}`}
                        onClick={close}
                        className="group flex items-center gap-4 rounded-2xl p-3 transition-colors hover:bg-mist"
                      >
                        <span className="relative h-16 w-20 shrink-0 overflow-hidden rounded-xl bg-mist">
                          <Image src={r.image} alt="" fill sizes="80px" className={r.fit === "cutout" ? "object-contain p-1.5" : "object-cover"} />
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-[15px] font-semibold">{r.name}</span>
                          <span className="text-sm text-muted">From {formatPrice(r.price)}</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="py-6 text-muted">No products match &ldquo;{q}&rdquo;. Try another word.</p>
              )
            ) : (
              <div>
                <p className="text-sm font-semibold text-muted">Popular searches</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {popular.map((p) => (
                    <button
                      key={p}
                      onClick={() => setQ(p)}
                      className="rounded-full border border-line px-5 py-2.5 text-[15px] font-medium transition-colors hover:border-ink hover:bg-ink hover:text-white"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
