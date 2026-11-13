"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { lowestPrice } from "@/lib/cartline";
import { ProductCard } from "../ProductCard";
import { ArrowRight } from "../Icons";
import { useCan3d } from "../hero/can3d";

const RangeScene = dynamic(() => import("./RangeScene"), { ssr: false });

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/**
 * The range, turning on a curved track. Pinned while you scroll: each product
 * curves in from one edge, sits flat in the centre, then curves away round the
 * other. Without WebGL it becomes a plain product grid.
 */
export function RangeCarousel({ products }: { products: Product[] }) {
  const router = useRouter();
  const section = useRef<HTMLElement>(null);
  const is3d = useCan3d();
  const [live, setLive] = useState(true);
  const [index, setIndex] = useState(0);

  const items = useMemo(
    () => products.map((p) => ({ slug: p.slug, name: p.name, image: p.images[0].src })),
    [products],
  );

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

  const onActive = useCallback((i: number) => setIndex(i), []);
  const onSelect = useCallback((slug: string) => router.push(`/product/${slug}`), [router]);

  const current = products[Math.min(index, products.length - 1)];

  if (is3d === false) {
    return (
      <section ref={section} className="section">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <h2 className="h2">The range</h2>
            <Link href="/shop" className="flex items-center gap-2 text-[15px] font-semibold underline underline-offset-4">
              View all products <ArrowRight size={18} />
            </Link>
          </div>
          <div className="mt-8 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={section}
      id="range"
      className="on-dark relative bg-ink text-white"
      style={{ height: `${100 + (products.length - 1) * 70}vh` }}
      aria-label="The iSLate range"
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ background: "radial-gradient(70% 60% at 50% 45%, rgba(255,255,255,0.06), transparent 70%), #0a0a0b" }}
        />

        <div className="absolute inset-x-0 top-[calc(var(--nav-h)+2svh)] z-10 text-center">
          <h2 className="display text-[clamp(1.9rem,3.6vw,3rem)]">The complete iSLate range.</h2>
        </div>

        <div className="absolute inset-0">
          {is3d === true && (
            <RangeScene items={items} getProgress={getProgress} onActive={onActive} onSelect={onSelect} active={live} />
          )}
        </div>

        {/* the product in focus */}
        <div className="absolute inset-x-0 bottom-[5svh] z-10 px-6 text-center">
          <div key={current.id} className="rise mx-auto max-w-md">
            <p className="text-[13px] tracking-[0.14em] text-white/45">
              {String(index + 1).padStart(2, "0")} / {String(products.length).padStart(2, "0")}
            </p>
            <p className="mt-2 text-[clamp(1.3rem,2.4vw,1.8rem)] font-semibold tracking-tight">{current.name}</p>
            <p className="mt-1 text-[14px] text-white/55">{current.tagline}</p>
            <div className="mt-4 flex items-center justify-center gap-4">
              <p className="text-[17px] font-semibold">
                {current.variants ? "From " : ""}
                {formatPrice(lowestPrice(current))}
              </p>
              <Link href={`/product/${current.slug}`} className="btn btn-light btn-sm">
                View product <ArrowRight size={16} />
              </Link>
            </div>
            <Link href="/shop" className="mt-4 inline-block text-[13px] text-white/50 underline underline-offset-4 hover:text-white">
              View all products
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
