import { NextResponse } from "next/server";
import { getProducts } from "@/lib/catalog";
import { computeTotals, validateCoupon } from "@/lib/pricing";
import type { Address, CartLine, Order, PaymentMethod } from "@/lib/types";

/**
 * Demo order endpoint. It re-prices every line from the catalogue on the
 * server so the client can never set its own prices, then returns the order.
 * Replace the final block with a database write and a payment gateway call
 * when the store goes live.
 */

const payments: PaymentMethod[] = ["upi", "card", "netbanking", "bank-transfer", "cod"];

function orderId() {
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `IS-${stamp}${rand}`;
}

export async function POST(req: Request) {
  let body: {
    lines?: { productId: string; variantId?: string; qty: number }[];
    address?: Address;
    payment?: PaymentMethod;
    coupon?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { lines, address, payment, coupon } = body;
  if (!lines?.length || !address || !payment || !payments.includes(payment)) {
    return NextResponse.json({ error: "Missing order details" }, { status: 400 });
  }
  if (!address.fullName || !address.phone || !address.line1 || !address.city || !address.state || !address.pincode) {
    return NextResponse.json({ error: "Missing address details" }, { status: 400 });
  }

  const catalogue = await getProducts();
  const priced: CartLine[] = [];
  for (const l of lines) {
    const product = catalogue.find((p) => p.id === l.productId);
    if (!product || !product.inStock) {
      return NextResponse.json({ error: "A product in your cart is unavailable" }, { status: 409 });
    }
    const variant = product.variants?.find((v) => v.id === l.variantId);
    const qty = Math.min(Math.max(Math.floor(l.qty), 1), 99);
    priced.push({
      key: variant ? `${product.id}:${variant.id}` : product.id,
      productId: product.id,
      variantId: variant?.id,
      slug: product.slug,
      name: product.name,
      variantLabel: variant?.label,
      image: product.images[0].src,
      price: variant?.price ?? product.price,
      compareAt: variant?.compareAt ?? product.compareAt,
      qty,
    });
  }

  const code = coupon && validateCoupon(coupon) ? coupon.trim().toUpperCase() : undefined;
  const totals = computeTotals(priced, code);

  const order: Order = {
    id: orderId(),
    placedAt: new Date().toISOString(),
    lines: priced,
    subtotal: totals.subtotal,
    discount: totals.discount,
    shipping: totals.shipping,
    total: totals.total,
    coupon: code,
    address,
    payment,
    status: "confirmed",
  };

  return NextResponse.json({ order }, { status: 201 });
}
