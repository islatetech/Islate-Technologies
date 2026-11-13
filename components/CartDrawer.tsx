"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import { useStore } from "./StoreProvider";
import { CloseIcon, Minus, Plus, Trash, ArrowRight, BagIcon } from "./Icons";
import { formatPrice } from "@/lib/format";

export function CartDrawer() {
  const { drawerOpen, setDrawerOpen, lines, totals, setQty, removeLine, count } = useStore();

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setDrawerOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawerOpen, setDrawerOpen]);

  return (
    <div
      className={`fixed inset-0 z-[70] transition-all duration-300 ${drawerOpen ? "visible" : "invisible"}`}
      role="dialog"
      aria-modal="true"
      aria-label="Shopping cart"
    >
      <div
        className={`absolute inset-0 bg-ink/50 backdrop-blur-sm transition-opacity duration-300 ${drawerOpen ? "opacity-100" : "opacity-0"}`}
        onClick={() => setDrawerOpen(false)}
      />
      <aside
        className={`absolute right-0 top-0 flex h-full w-full max-w-[460px] flex-col bg-white shadow-2xl transition-transform duration-500 ease-[var(--ease-out-expo)] ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-[72px] items-center justify-between border-b border-line px-6">
          <h2 className="text-lg font-bold">
            Your cart <span className="ml-1 text-muted">({count})</span>
          </h2>
          <button
            onClick={() => setDrawerOpen(false)}
            className="grid h-10 w-10 place-items-center rounded-full hover:bg-mist"
            aria-label="Close cart"
          >
            <CloseIcon />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="grid flex-1 place-items-center px-8 text-center">
            <div>
              <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-mist">
                <BagIcon size={28} />
              </span>
              <p className="mt-6 text-xl font-bold">Your cart is empty</p>
              <p className="mt-2 text-muted">Add a panel, a podium or a camera to get started.</p>
              <Link href="/shop" onClick={() => setDrawerOpen(false)} className="btn btn-dark mt-8">
                Browse products
              </Link>
            </div>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-line overflow-y-auto px-6">
              {lines.map((l) => (
                <li key={l.key} className="flex gap-4 py-5">
                  <Link
                    href={`/product/${l.slug}`}
                    onClick={() => setDrawerOpen(false)}
                    className="relative h-24 w-28 shrink-0 overflow-hidden rounded-xl bg-mist"
                  >
                    <Image src={l.image} alt={l.name} fill sizes="112px" className="object-cover" />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[15px] font-bold leading-snug">{l.name}</p>
                        {l.variantLabel && <p className="mt-0.5 text-sm text-muted">Size {l.variantLabel}</p>}
                      </div>
                      <button
                        onClick={() => removeLine(l.key)}
                        className="-mr-1 grid h-8 w-8 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-mist hover:text-ink"
                        aria-label={`Remove ${l.name}`}
                      >
                        <Trash size={18} />
                      </button>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <div className="flex h-10 items-center rounded-full border border-line">
                        <button
                          className="grid h-10 w-10 place-items-center"
                          onClick={() => setQty(l.key, l.qty - 1)}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-6 text-center text-sm font-bold" aria-live="polite">
                          {l.qty}
                        </span>
                        <button
                          className="grid h-10 w-10 place-items-center"
                          onClick={() => setQty(l.key, l.qty + 1)}
                          aria-label="Increase quantity"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <p className="font-bold">{formatPrice(l.price * l.qty)}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-line bg-white px-6 pb-6 pt-5">
              <div className="flex items-center justify-between text-[15px]">
                <span className="text-muted">Subtotal</span>
                <span className="text-lg font-bold">{formatPrice(totals.subtotal)}</span>
              </div>
              <p className="mt-1 text-sm text-muted">Delivery is free. Taxes included. Coupons apply at checkout.</p>
              <div className="mt-5 grid gap-3">
                <Link href="/checkout" onClick={() => setDrawerOpen(false)} className="btn btn-primary">
                  Checkout <ArrowRight size={18} />
                </Link>
                <Link href="/cart" onClick={() => setDrawerOpen(false)} className="btn btn-outline">
                  View cart
                </Link>
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
