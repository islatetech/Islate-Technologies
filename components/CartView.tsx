"use client";

import Link from "next/link";
import Image from "next/image";
import { useStore } from "./StoreProvider";
import { ArrowRight, BagIcon, Minus, Plus, Trash } from "./Icons";
import { formatPrice } from "@/lib/format";
import { CouponBox, Summary } from "./OrderSummary";

export function CartView() {
  const { lines, totals, setQty, removeLine, hydrated, count } = useStore();

  return (
    <section className="min-h-[70vh] bg-white pb-16 pt-[calc(var(--header-h)+28px)]">
      <div className="container-x">
        <h1 className="display text-[clamp(2.2rem,4.4vw,3.6rem)]">
          Your cart {hydrated && count > 0 && <span className="text-muted">({count})</span>}
        </h1>

        {!hydrated ? (
          <div className="mt-12 h-64 animate-pulse rounded-2xl bg-mist" />
        ) : lines.length === 0 ? (
          <div className="mt-16 grid place-items-center rounded-2xl bg-mist px-6 py-24 text-center">
            <span className="grid h-20 w-20 place-items-center rounded-full bg-white">
              <BagIcon size={34} />
            </span>
            <p className="mt-7 text-2xl font-bold">Your cart is empty</p>
            <p className="mt-2 text-muted">Browse our panels, podiums and cameras to get started.</p>
            <Link href="/shop" className="btn btn-dark mt-9">
              Continue shopping
            </Link>
          </div>
        ) : (
          <div className="mt-12 grid gap-12 lg:grid-cols-[1.6fr_1fr]">
            <ul className="divide-y divide-line border-y border-line">
              {lines.map((l) => (
                <li key={l.key} className="flex gap-5 py-7">
                  <Link
                    href={`/product/${l.slug}`}
                    className="relative h-28 w-36 shrink-0 overflow-hidden rounded-2xl bg-mist sm:h-32 sm:w-44"
                  >
                    <Image src={l.image} alt={l.name} fill sizes="176px" className="object-cover" />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <Link href={`/product/${l.slug}`} className="text-lg font-bold leading-snug">
                          {l.name}
                        </Link>
                        {l.variantLabel && <p className="mt-1 text-sm text-muted">Size {l.variantLabel}</p>}
                        <p className="mt-1 text-sm text-muted">{formatPrice(l.price)} each</p>
                      </div>
                      <p className="shrink-0 text-lg font-bold">{formatPrice(l.price * l.qty)}</p>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-4">
                      <div className="flex h-11 items-center rounded-full border-[1.5px] border-line">
                        <button className="grid h-11 w-11 place-items-center" onClick={() => setQty(l.key, l.qty - 1)} aria-label="Decrease quantity">
                          <Minus size={16} />
                        </button>
                        <span className="w-7 text-center font-bold">{l.qty}</span>
                        <button className="grid h-11 w-11 place-items-center" onClick={() => setQty(l.key, l.qty + 1)} aria-label="Increase quantity">
                          <Plus size={16} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeLine(l.key)}
                        className="flex items-center gap-2 text-sm font-bold text-muted hover:text-ink"
                      >
                        <Trash size={18} /> Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <aside className="h-fit rounded-2xl bg-mist p-7 lg:sticky lg:top-[calc(var(--nav-h)+24px)] md:p-9">
              <h2 className="text-xl font-bold">Order summary</h2>
              <div className="mt-6">
                <CouponBox />
              </div>
              <div className="mt-7">
                <Summary lines={lines} totals={totals} />
              </div>
              <Link href="/checkout" className="btn btn-primary mt-8 w-full">
                Checkout <ArrowRight size={18} />
              </Link>
              <Link href="/shop" className="mt-3 block text-center text-sm font-bold text-muted hover:text-ink">
                Continue shopping
              </Link>
            </aside>
          </div>
        )}
      </div>
    </section>
  );
}
