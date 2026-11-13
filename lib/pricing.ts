import type { CartLine } from "./types";
import { site } from "./site";

export interface Totals {
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  savings: number;
}

const coupons: Record<string, { percent: number; label: string }> = {
  [site.firstOrderCoupon.code]: {
    percent: site.firstOrderCoupon.percent,
    label: `${site.firstOrderCoupon.percent}% off your first order`,
  },
};

export function validateCoupon(code: string) {
  return coupons[code.trim().toUpperCase()];
}

export function computeTotals(lines: CartLine[], couponCode?: string): Totals {
  const subtotal = lines.reduce((sum, l) => sum + l.price * l.qty, 0);
  const listTotal = lines.reduce((sum, l) => sum + (l.compareAt ?? l.price) * l.qty, 0);
  const coupon = couponCode ? validateCoupon(couponCode) : undefined;
  const discount = coupon ? Math.round((subtotal * coupon.percent) / 100) : 0;
  const shipping = 0;
  const total = subtotal - discount + shipping;
  return { subtotal, discount, shipping, total, savings: listTotal - subtotal + discount };
}
