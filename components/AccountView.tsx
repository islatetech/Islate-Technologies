"use client";

import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { Order, Product } from "@/lib/types";
import { useStore } from "./StoreProvider";
import { ProductCard } from "./ProductCard";
import { ArrowRight, BagIcon, HeartIcon } from "./Icons";
import { formatDate, formatPrice } from "@/lib/format";

const statusTone: Record<Order["status"], string> = {
  confirmed: "bg-ink text-white",
  processing: "bg-white text-ink",
  shipped: "bg-white text-ink",
  delivered: "bg-white text-ink",
};

export function AccountView({ products }: { products: Product[] }) {
  const params = useSearchParams();
  const router = useRouter();
  const { orders, wishlist, hydrated } = useStore();
  const tab = params.get("tab") === "wishlist" ? "wishlist" : "orders";
  const saved = products.filter((p) => wishlist.includes(p.id));
  // something to look at when there is nothing saved or ordered yet
  const suggestions = products.filter((p) => !wishlist.includes(p.id)).slice(0, 3);

  const setTab = (t: string) => router.replace(`/orders?tab=${t}`, { scroll: false });

  const tabs = [
    { id: "orders", label: "Orders", count: orders.length },
    { id: "wishlist", label: "Wishlist", count: saved.length },
  ] as const;

  const heading = tab === "wishlist" ? "Your wishlist" : "Your orders";
  const sub =
    tab === "wishlist"
      ? "Everything you have saved for later."
      : "Every order you have placed with us.";

  return (
    <section className="min-h-screen bg-shelf pb-24 pt-[calc(var(--header-h)+36px)]">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h1 className="display text-[clamp(2rem,4vw,3.2rem)]">{heading}</h1>
            <p className="mt-2 text-[15px] text-muted">{sub}</p>
          </div>

          <div role="tablist" aria-label="Account" className="flex gap-2">
            {tabs.map((t) => (
              <button
                key={t.id}
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2.5 rounded-full px-5 py-2.5 text-[14px] font-medium transition-colors ${
                  tab === t.id ? "bg-ink text-white" : "bg-white text-ink hover:bg-white/60"
                }`}
              >
                {t.label}
                {hydrated && (
                  <span
                    className={`grid h-5 min-w-5 place-items-center rounded-full px-1.5 text-[11px] font-semibold ${
                      tab === t.id ? "bg-white/20" : "bg-ink/[0.07]"
                    }`}
                  >
                    {t.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {!hydrated ? (
          <div className="mt-12 h-64 animate-pulse rounded-3xl bg-white/60" />
        ) : tab === "orders" ? (
          orders.length === 0 ? (
            <Empty
              icon={<BagIcon size={30} />}
              title="No orders yet"
              text="When you place an order, it will show up here with its status."
              suggestions={suggestions}
            />
          ) : (
            <ul className="mt-12 space-y-4">
              {orders.map((o) => (
                <OrderRow key={o.id} order={o} />
              ))}
            </ul>
          )
        ) : saved.length === 0 ? (
          <Empty
            icon={<HeartIcon size={30} />}
            title="Your wishlist is empty"
            text="Tap the heart on any product to save it here for later."
            suggestions={suggestions}
          />
        ) : (
          <div className="mt-14 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {saved.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function OrderRow({ order }: { order: Order }) {
  const items = order.lines.reduce((n, l) => n + l.qty, 0);
  const first = order.lines[0];
  const more = order.lines.length - 1;

  return (
    <li>
      <Link
        href={`/order/${order.id}`}
        className="group flex flex-col gap-5 rounded-2xl bg-white p-5 transition-shadow duration-300 hover:ring-1 hover:ring-ink/15 sm:flex-row sm:items-center sm:gap-7 sm:p-6"
      >
        <div className="flex shrink-0 -space-x-6">
          {order.lines.slice(0, 3).map((l) => (
            <div key={l.key} className="relative h-20 w-24 overflow-hidden rounded-xl border-2 border-white bg-stone">
              <Image src={l.image} alt="" fill sizes="96px" className="object-contain p-2" />
            </div>
          ))}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-[17px] font-semibold tracking-tight">
            {first.name}
            {more > 0 && <span className="font-normal text-muted"> and {more} more</span>}
          </p>
          <p className="mt-1 text-[14px] text-muted">
            {order.id} &nbsp;·&nbsp; {formatDate(order.placedAt)} &nbsp;·&nbsp; {items} {items === 1 ? "item" : "items"}
          </p>
        </div>

        <div className="flex items-center justify-between gap-6 sm:justify-end">
          <span className={`rounded-full border border-ink/10 px-3.5 py-1.5 text-[13px] font-semibold capitalize ${statusTone[order.status]}`}>
            {order.status}
          </span>
          <p className="min-w-[92px] text-right text-[18px] font-semibold tracking-tight">{formatPrice(order.total)}</p>
          <ArrowRight size={18} className="hidden shrink-0 text-muted transition-transform duration-300 group-hover:translate-x-1 sm:block" />
        </div>
      </Link>
    </li>
  );
}

function Empty({
  icon,
  title,
  text,
  suggestions,
}: {
  icon: ReactNode;
  title: string;
  text: string;
  suggestions: Product[];
}) {
  return (
    <div className="mt-14">
      <div className="mx-auto max-w-md text-center">
        <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-white text-ink">{icon}</span>
        <h2 className="mt-7 text-[clamp(1.5rem,2.4vw,1.9rem)] font-semibold tracking-tight">{title}</h2>
        <p className="mt-2 text-[15px] leading-relaxed text-muted">{text}</p>
        <Link href="/shop" className="btn btn-dark mt-8">
          Browse products <ArrowRight size={18} />
        </Link>
      </div>

      {suggestions.length > 0 && (
        <div className="mt-24 border-t border-ink/10 pt-12">
          <h3 className="text-[clamp(1.2rem,2vw,1.5rem)] font-semibold tracking-tight">You may like</h3>
          <div className="mt-10 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {suggestions.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
