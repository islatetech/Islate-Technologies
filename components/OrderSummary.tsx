"use client";

import { useState } from "react";
import Image from "next/image";
import type { CartLine } from "@/lib/types";
import type { Totals } from "@/lib/pricing";
import { formatPrice } from "@/lib/format";
import { useStore } from "./StoreProvider";
import { Check } from "./Icons";

export function CouponBox() {
  const { coupon, applyCoupon, removeCoupon } = useStore();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const apply = () => {
    if (applyCoupon(code)) {
      setError("");
      setCode("");
    } else setError("That code is not valid.");
  };

  if (coupon) {
    return (
      <div className="flex items-center justify-between rounded-2xl bg-[#e7f7f0] px-4 py-3.5 text-[15px]">
        <span className="flex items-center gap-2 font-bold text-ok">
          <Check size={18} /> {coupon} applied
        </span>
        <button type="button" onClick={removeCoupon} className="text-sm font-bold text-ink underline underline-offset-4">
          Remove
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex gap-2">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              apply();
            }
          }}
          placeholder="Coupon code"
          aria-label="Coupon code"
          className="field !h-12 flex-1 uppercase placeholder:normal-case"
        />
        <button type="button" onClick={apply} className="btn btn-dark btn-sm !h-12" disabled={!code.trim()}>
          Apply
        </button>
      </div>
      {error && <p className="mt-2 text-sm font-semibold text-[#d33]">{error}</p>}
    </div>
  );
}

export function Summary({
  lines,
  totals,
  showLines = false,
}: {
  lines: CartLine[];
  totals: Totals;
  showLines?: boolean;
}) {
  return (
    <div>
      {showLines && (
        <ul className="mb-6 divide-y divide-line">
          {lines.map((l) => (
            <li key={l.key} className="flex items-center gap-4 py-4">
              <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-xl bg-mist">
                <Image src={l.image} alt="" fill sizes="80px" className="object-cover" />
                <span className="absolute -right-0 -top-0 grid h-6 min-w-6 place-items-center rounded-bl-xl bg-ink px-1.5 text-xs font-bold text-white">
                  {l.qty}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-bold">{l.name}</p>
                {l.variantLabel && <p className="text-sm text-muted">Size {l.variantLabel}</p>}
              </div>
              <p className="text-[15px] font-bold">{formatPrice(l.price * l.qty)}</p>
            </li>
          ))}
        </ul>
      )}
      <dl className="space-y-3 text-[15px]">
        <div className="flex justify-between">
          <dt className="text-muted">Subtotal</dt>
          <dd className="font-semibold">{formatPrice(totals.subtotal)}</dd>
        </div>
        {totals.discount > 0 && (
          <div className="flex justify-between text-ok">
            <dt>Coupon discount</dt>
            <dd className="font-semibold">-{formatPrice(totals.discount)}</dd>
          </div>
        )}
        <div className="flex justify-between">
          <dt className="text-muted">Delivery</dt>
          <dd className="font-semibold">Free</dd>
        </div>
        <div className="flex items-end justify-between border-t border-line pt-4">
          <dt className="text-base font-bold">Total</dt>
          <dd className="text-3xl font-bold tracking-tight">{formatPrice(totals.total)}</dd>
        </div>
      </dl>
      {totals.savings > 0 && (
        <p className="mt-3 text-sm font-semibold text-ok">You save {formatPrice(totals.savings)} on this order.</p>
      )}
    </div>
  );
}
