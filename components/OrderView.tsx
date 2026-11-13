"use client";

import Link from "next/link";
import Image from "next/image";
import { useStore } from "./StoreProvider";
import { Check } from "./Icons";
import { formatDate, formatPrice } from "@/lib/format";
import { Summary } from "./OrderSummary";
import type { Order } from "@/lib/types";

const steps: { id: Order["status"]; label: string }[] = [
  { id: "confirmed", label: "Order confirmed" },
  { id: "processing", label: "Packed" },
  { id: "shipped", label: "Shipped" },
  { id: "delivered", label: "Delivered" },
];

const paymentLabel: Record<Order["payment"], string> = {
  upi: "UPI",
  card: "Card",
  netbanking: "Net banking",
  "bank-transfer": "Bank transfer",
  cod: "Cash on delivery",
};

export function OrderView({ id }: { id: string }) {
  const { orders, hydrated } = useStore();
  const order = orders.find((o) => o.id === id);

  if (!hydrated) return <div className="min-h-[70vh] bg-white" />;

  if (!order) {
    return (
      <section className="grid min-h-[70vh] place-items-center bg-white px-6 pt-[var(--header-h)] text-center">
        <div>
          <p className="text-3xl font-bold">We could not find that order</p>
          <p className="mt-2 text-muted">Orders in this demo are saved in the browser they were placed from.</p>
          <Link href="/shop" className="btn btn-dark mt-8">
            Continue shopping
          </Link>
        </div>
      </section>
    );
  }

  const current = steps.findIndex((s) => s.id === order.status);

  return (
    <section className="bg-white pb-16 pt-[calc(var(--header-h)+28px)]">
      <div className="container-x max-w-5xl">
        <div className="text-center">
          <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-ok text-white">
            <Check size={38} />
          </span>
          <h1 className="display mt-8 text-[clamp(2.2rem,4.4vw,3.6rem)]">Thank you, {order.address.fullName.split(" ")[0]}.</h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted">
            Your order <strong className="text-ink">{order.id}</strong> is confirmed. We have sent the details to{" "}
            {order.address.email} and our team will call to schedule delivery.
          </p>
        </div>

        <ol className="mx-auto mt-14 grid max-w-3xl grid-cols-4 gap-2">
          {steps.map((s, i) => (
            <li key={s.id} className="text-center">
              <div className="relative">
                <div
                  className={`mx-auto grid h-10 w-10 place-items-center rounded-full text-sm font-bold ${
                    i <= current ? "bg-ink text-white" : "bg-mist text-muted"
                  }`}
                >
                  {i <= current ? <Check size={18} /> : i + 1}
                </div>
                {i < steps.length - 1 && (
                  <span className={`absolute left-[calc(50%+28px)] right-[calc(-50%+28px)] top-5 h-0.5 ${i < current ? "bg-ink" : "bg-line"}`} />
                )}
              </div>
              <p className={`mt-3 text-[13px] font-bold ${i <= current ? "text-ink" : "text-muted"}`}>{s.label}</p>
            </li>
          ))}
        </ol>

        <div className="mt-16 grid gap-8 lg:grid-cols-[1.3fr_1fr]">
          <div className="h-fit rounded-2xl border border-line p-7 md:p-9">
            <h2 className="text-xl font-bold">Items</h2>
            <ul className="mt-4 divide-y divide-line">
              {order.lines.map((l) => (
                <li key={l.key} className="flex items-center gap-5 py-5">
                  <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-mist">
                    <Image src={l.image} alt="" fill sizes="96px" className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link href={`/product/${l.slug}`} className="font-bold">
                      {l.name}
                    </Link>
                    <p className="text-sm text-muted">
                      {l.variantLabel ? `Size ${l.variantLabel}, ` : ""}Qty {l.qty}
                    </p>
                  </div>
                  <p className="font-bold">{formatPrice(l.price * l.qty)}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl bg-mist p-7 md:p-9">
              <h2 className="text-xl font-bold">Summary</h2>
              <div className="mt-5">
                <Summary
                  lines={order.lines}
                  totals={{
                    subtotal: order.subtotal,
                    discount: order.discount,
                    shipping: order.shipping,
                    total: order.total,
                    savings: 0,
                  }}
                />
              </div>
            </div>
            <div className="rounded-2xl border border-line p-7 text-[15px] leading-relaxed md:p-9">
              <p className="text-sm font-bold uppercase tracking-[0.12em] text-muted">Delivering to</p>
              <p className="mt-3 font-bold">{order.address.fullName}</p>
              {order.address.organisation && <p>{order.address.organisation}</p>}
              <p>{order.address.line1}</p>
              {order.address.line2 && <p>{order.address.line2}</p>}
              <p>
                {order.address.city}, {order.address.state} {order.address.pincode}
              </p>
              <p className="mt-5 text-sm font-bold uppercase tracking-[0.12em] text-muted">Payment</p>
              <p className="mt-2">{paymentLabel[order.payment]}</p>
              <p className="mt-5 text-sm text-muted">Placed on {formatDate(order.placedAt)}</p>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-wrap justify-center gap-3">
          <Link href="/shop" className="btn btn-dark">
            Continue shopping
          </Link>
          <Link href="/orders" className="btn btn-outline">
            View all orders
          </Link>
        </div>
      </div>
    </section>
  );
}
