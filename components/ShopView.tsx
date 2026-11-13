"use client";

import { useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Category, Product } from "@/lib/types";
import { ProductCard } from "./ProductCard";
import { lowestPrice } from "@/lib/cartline";
import { ChevronDown, CloseIcon } from "./Icons";

const sorts = [
  { id: "featured", label: "Featured" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
  { id: "new", label: "Newest" },
];

export function ShopView({ products, categories }: { products: Product[]; categories: Category[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const category = params.get("category") ?? "all";
  const sort = params.get("sort") ?? "featured";
  const q = (params.get("q") ?? "").trim().toLowerCase();

  const setParam = (key: string, value?: string) => {
    const next = new URLSearchParams(params.toString());
    if (value && value !== "all" && value !== "featured") next.set(key, value);
    else next.delete(key);
    router.replace(`${pathname}${next.toString() ? `?${next}` : ""}`, { scroll: false });
  };

  const list = useMemo(() => {
    let out = products.filter((p) => category === "all" || p.categories.includes(category as never));
    if (q) {
      out = out.filter((p) =>
        [p.name, p.tagline, p.summary, ...p.categories].join(" ").toLowerCase().includes(q),
      );
    }
    switch (sort) {
      case "price-asc":
        out = [...out].sort((a, b) => lowestPrice(a) - lowestPrice(b));
        break;
      case "price-desc":
        out = [...out].sort((a, b) => lowestPrice(b) - lowestPrice(a));
        break;
      case "new":
        out = [...out].sort((a, b) => Number(!!b.isNew) - Number(!!a.isNew));
        break;
    }
    return out;
  }, [products, category, sort, q]);

  const active = categories.find((c) => c.slug === category);

  return (
    <section className="min-h-screen bg-shelf pb-24 pt-[calc(var(--header-h)+36px)]">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h1 className="display text-[clamp(2rem,4vw,3.2rem)]">{active ? active.name : "The shelf"}</h1>
            <p className="mt-2 text-[15px] text-muted">
              {active ? active.tagline : "Everything iSLate makes for the front of the room."}
              <span className="ml-3 text-muted/70">
                {list.length} {list.length === 1 ? "product" : "products"}
              </span>
            </p>
          </div>
          <label className="flex shrink-0 items-center gap-3 text-sm">
            <span className="font-medium text-muted">Sort by</span>
            <span className="relative">
              <select
                value={sort}
                onChange={(e) => setParam("sort", e.target.value)}
                className="h-11 cursor-pointer appearance-none rounded-full border border-ink/10 bg-white pl-5 pr-11 font-medium outline-none transition-colors hover:border-ink focus:border-ink"
              >
                {sorts.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
              <ChevronDown size={18} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2" />
            </span>
          </label>
        </div>

        <div className="no-scrollbar mt-7 flex gap-2 overflow-x-auto" role="tablist" aria-label="Categories">
          {[{ slug: "all", name: "All" }, ...categories].map((c) => (
            <button
              key={c.slug}
              role="tab"
              aria-selected={category === c.slug}
              onClick={() => setParam("category", c.slug)}
              className={`shrink-0 rounded-full px-5 py-2.5 text-[14px] font-medium transition-colors ${
                category === c.slug ? "bg-ink text-white" : "bg-white text-ink hover:bg-white/60"
              }`}
            >
              {c.name}
            </button>
          ))}
          {q && (
            <button
              onClick={() => setParam("q")}
              className="flex shrink-0 items-center gap-2 rounded-full border border-ink/15 px-4 py-2.5 text-[14px] font-medium"
            >
              Search: {q} <CloseIcon size={16} />
            </button>
          )}
        </div>

        {list.length ? (
          <div className="mt-14 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((p, i) => (
              <ProductCard key={p.id} product={p} priority={i < 3} />
            ))}
          </div>
        ) : (
          <div className="grid place-items-center py-28 text-center">
            <p className="text-2xl font-bold">Nothing matches that yet</p>
            <p className="mt-2 text-muted">Try another category or clear your search.</p>
            <Link href="/shop" className="btn btn-dark mt-8">
              Reset filters
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
