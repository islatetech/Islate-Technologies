"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { SlideNav, buildNavItems } from "./SlideNav";
import { useStore } from "./StoreProvider";
import { HeaderSearch, type SearchItem } from "./HeaderSearch";
import { BagIcon, CloseIcon, HeartIcon, MenuIcon, SearchIcon, Phone } from "./Icons";
import { nav, site } from "@/lib/site";
import type { Category } from "@/lib/types";

export type { SearchItem };

// which nav item is the current page; -1 for pages that are not in the nav
const routeToIndex = (path: string) => {
  if (path === "/") return 0;
  if (path.startsWith("/shop") || path.startsWith("/product")) return 1;
  if (path.startsWith("/about")) return 2;
  if (path.startsWith("/contact")) return 3;
  return -1;
};

export function Header({ categories, items }: { categories: Category[]; items: SearchItem[] }) {
  const pathname = usePathname();
  const { count, setDrawerOpen, wishlist } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchFocus, setSearchFocus] = useState(0);

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
            <HeaderSearch items={items} />
            <button
              className={`${iconBtn} lg:hidden`}
              aria-label="Search"
              onClick={() => {
                setMobileOpen(true);
                setSearchFocus((n) => n + 1);
              }}
            >
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
        className={`fixed inset-0 z-40 bg-ink pt-[var(--header-h)] text-white transition-all duration-500 lg:hidden ${
          mobileOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <div className="container-x flex h-full flex-col overflow-y-auto pb-10 pt-6">
          <HeaderSearch items={items} variant="menu" focusKey={searchFocus} onNavigate={() => setMobileOpen(false)} />
          <div className="mt-6" />
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
    </>
  );
}
