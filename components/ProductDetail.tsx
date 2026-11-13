"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/types";
import { discountPercent, emiPerMonth, formatPrice } from "@/lib/format";
import { toCartLine } from "@/lib/cartline";
import { useStore } from "./StoreProvider";
import { categories } from "@/lib/categories";
import { ProductStage } from "./ProductStage";
import { Check, HeartIcon, Minus, Plus } from "./Icons";

function Accordion({ title, defaultOpen = false, children }: { title: string; defaultOpen?: boolean; children: ReactNode }) {
  return (
    <details className="acc border-b border-ink/10 py-1" open={defaultOpen}>
      <summary className="flex items-center justify-between gap-4 py-4 text-[16px] font-semibold">
        {title}
        <svg
          className="acc-icon shrink-0 transition-transform duration-300"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </summary>
      <div className="pb-5 text-[15px] leading-relaxed text-[#3d4048]">{children}</div>
    </details>
  );
}

export function ProductDetail({ product }: { product: Product }) {
  const router = useRouter();
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const [variantId, setVariantId] = useState(product.variants?.[0]?.id);
  const [qty, setQty] = useState(1);
  const [pin, setPin] = useState("");
  const [pinMsg, setPinMsg] = useState<string>();
  const [added, setAdded] = useState(false);

  const variant = product.variants?.find((v) => v.id === variantId);
  const price = variant?.price ?? product.price;
  const compareAt = variant?.compareAt ?? product.compareAt;
  const off = discountPercent(price, compareAt);
  const liked = wishlist.includes(product.id);
  const cat = categories.find((c) => c.slug === product.categories[0]);

  const add = (open = true) => {
    addToCart(toCartLine(product, variant), qty, open);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const checkPin = (e: React.FormEvent) => {
    e.preventDefault();
    setPinMsg(
      /^[1-9][0-9]{5}$/.test(pin)
        ? `Free delivery to ${pin} in 5 to 7 working days.`
        : "Enter a valid 6 digit pincode.",
    );
  };

  return (
    <>
      <section className="bg-shelf pb-16 pt-[calc(var(--header-h)+28px)]">
        <div className="container-x grid gap-10 lg:grid-cols-2 lg:gap-20">
          {/* The product, on its shelf */}
          <div className="lg:sticky lg:top-[calc(var(--nav-h)+32px)] lg:self-start lg:pt-10">
            <ProductStage product={product} />
          </div>

          {/* Details */}
          <div className="lg:max-w-[34rem] lg:pt-6">
            <Link
              href={cat ? `/shop?category=${cat.slug}` : "/shop"}
              className="inline-flex items-center gap-1.5 text-[14px] text-muted transition-colors hover:text-ink"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m15 6-6 6 6 6" />
              </svg>
              {cat ? cat.name : "Shop"}
            </Link>

            <h1 className="display mt-6 text-[clamp(2.1rem,4vw,3.4rem)]">{product.name}</h1>
            <p className="mt-3 text-[17px] text-muted">{product.tagline}</p>

            <div className="mt-7 flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <p className="text-[28px] font-semibold tracking-tight">{formatPrice(price)}</p>
              {compareAt && compareAt > price && (
                <>
                  <p className="text-[17px] text-muted line-through">{formatPrice(compareAt)}</p>
                  <p className="text-[14px] font-semibold">{off}% off</p>
                </>
              )}
            </div>
            <p className="mt-1 text-[13px] text-muted">
              Inclusive of taxes. Or {formatPrice(emiPerMonth(price))} a month for 12 months with no cost EMI.
            </p>

            <p className="mt-6 text-[15px] leading-relaxed text-[#3d4048]">{product.summary}</p>

            {product.variants && (
              <div className="mt-8">
                <p className="text-[14px] font-semibold">Size</p>
                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setVariantId(v.id)}
                      aria-pressed={v.id === variantId}
                      className={`flex items-center justify-between rounded-xl border-[1.5px] bg-white/50 px-4 py-3.5 text-left transition-colors ${
                        v.id === variantId ? "border-ink bg-white" : "border-ink/12 hover:border-ink/40"
                      }`}
                    >
                      <span className="text-[15px] font-semibold">{v.label}</span>
                      <span className="text-[12px] text-muted">{formatPrice(v.price)}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 flex items-stretch gap-3">
              <div className="flex h-[52px] items-center rounded-xl border-[1.5px] border-ink/12 bg-white/50">
                <button className="grid h-[52px] w-11 place-items-center text-muted hover:text-ink" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">
                  <Minus size={16} />
                </button>
                <span className="w-7 text-center text-[15px] font-semibold" aria-live="polite">
                  {qty}
                </span>
                <button className="grid h-[52px] w-11 place-items-center text-muted hover:text-ink" onClick={() => setQty((q) => Math.min(99, q + 1))} aria-label="Increase quantity">
                  <Plus size={16} />
                </button>
              </div>
              <button onClick={() => add()} className="flex h-[52px] flex-1 items-center justify-center gap-2 rounded-xl bg-ink text-[15px] font-semibold text-white transition-colors hover:bg-steel">
                {added ? (
                  <>
                    <Check size={18} /> Added to cart
                  </>
                ) : (
                  "Add to cart"
                )}
              </button>
              <button
                onClick={() => toggleWishlist(product.id)}
                aria-pressed={liked}
                aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
                className="grid h-[52px] w-[52px] place-items-center rounded-xl border-[1.5px] border-ink/12 bg-white/50 transition-colors hover:border-ink"
              >
                <HeartIcon filled={liked} size={20} />
              </button>
            </div>
            <button
              onClick={() => {
                add(false);
                router.push("/checkout");
              }}
              className="mt-3 h-[48px] w-full rounded-xl border-[1.5px] border-ink text-[15px] font-semibold transition-colors hover:bg-ink hover:text-white"
            >
              Buy now
            </button>

            <dl className="mt-6 space-y-1.5 text-[14px]">
              <div className="flex gap-2">
                <dt className="font-semibold">Delivery:</dt>
                <dd className="text-muted">Free, arrives in 5 to 7 working days</dd>
              </div>
              <div className="flex gap-2">
                <dt className="font-semibold">Installation:</dt>
                <dd className="text-muted">Our team calls to schedule setup</dd>
              </div>
            </dl>
            <form onSubmit={checkPin} className="mt-3 flex max-w-sm items-center gap-2">
              <input
                aria-label="Check delivery pincode"
                inputMode="numeric"
                maxLength={6}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                placeholder="Check your pincode"
                className="field !h-11 flex-1 !text-[14px]"
              />
              <button className="h-11 rounded-xl border-[1.5px] border-ink px-5 text-[14px] font-semibold transition-colors hover:bg-ink hover:text-white">Check</button>
            </form>
            {pinMsg && <p className="mt-2 text-[13px] font-medium">{pinMsg}</p>}

            <div className="mt-9 border-t border-ink/10">
              <Accordion title="Details" defaultOpen>
                <div className="space-y-3">
                  {product.description.map((d) => (
                    <p key={d}>{d}</p>
                  ))}
                </div>
                <ul className="mt-4 space-y-1.5">
                  {product.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2.5">
                      <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-ink" />
                      {h}
                    </li>
                  ))}
                </ul>
              </Accordion>
              <Accordion title="Specifications">
                <div className="space-y-6">
                  {product.specs.map((g) => (
                    <div key={g.title}>
                      <p className="text-[13px] font-semibold uppercase tracking-[0.1em] text-muted">{g.title}</p>
                      <dl className="mt-2 divide-y divide-ink/10">
                        {g.rows.map((r) => (
                          <div key={r.label} className="grid grid-cols-[0.8fr_1.2fr] gap-4 py-2.5">
                            <dt className="text-muted">{r.label}</dt>
                            <dd className="font-medium text-ink">{r.value}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  ))}
                </div>
              </Accordion>
              <Accordion title="Delivery and returns">
                <p>
                  We deliver to schools, coaching centres and offices across India at no extra cost, and our team calls
                  to schedule installation. Returns are accepted within 30 days of delivery for products in their
                  original condition and packaging. Read the full{" "}
                  <Link href="/refund-policy" className="font-semibold underline underline-offset-4">
                    refund policy
                  </Link>
                  .
                </p>
              </Accordion>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile sticky bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-3 border-t border-ink/10 bg-shelf/95 px-5 py-3 backdrop-blur-xl lg:hidden">
        <div className="min-w-0">
          <p className="truncate text-xs text-muted">{product.name}</p>
          <p className="text-lg font-semibold">{formatPrice(price)}</p>
        </div>
        <button onClick={() => add()} className="ml-auto h-12 max-w-[220px] flex-1 rounded-xl bg-ink text-[15px] font-semibold text-white">
          Add to cart
        </button>
      </div>
    </>
  );
}
