"use client";

import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import type { Product } from "@/lib/types";
import { useStore } from "./StoreProvider";
import { ProductCard } from "./ProductCard";
import { formatDate, formatPrice } from "@/lib/format";

export function AccountView({ products }: { products: Product[] }) {
  const params = useSearchParams();
  const router = useRouter();
  const { orders, wishlist, hydrated } = useStore();
  const tab = params.get("tab") === "wishlist" ? "wishlist" : "orders";
  const saved = products.filter((p) => wishlist.includes(p.id));

  const setTab = (t: string) => router.replace(`/orders?tab=${t}`, { scroll: false });

  return (
    <section className="min-h-[70vh] bg-white pb-16 pt-[calc(var(--header-h)+28px)]">
      <div className="container-x">
        <h1 className="display text-[clamp(2.2rem,4.4vw,3.6rem)]">My account</h1>

        <div role="tablist" className="mt-10 flex gap-8 border-b border-line">
          {(
            [
              ["orders", `Orders${hydrated ? ` (${orders.length})` : ""}`],
              ["wishlist", `Wishlist${hydrated ? ` (${saved.length})` : ""}`],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              role="tab"
              aria-selected={tab === id}
              onClick={() => setTab(id)}
              className={`-mb-px border-b-2 pb-4 text-[16px] font-bold transition-colors ${
                tab === id ? "border-ink" : "border-transparent text-muted hover:text-ink"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {!hydrated ? (
          <div className="mt-10 h-48 animate-pulse rounded-3xl bg-mist" />
        ) : tab === "orders" ? (
          orders.length === 0 ? (
            <Empty title="No orders yet" text="Orders you place will show up here." />
          ) : (
            <ul className="mt-10 space-y-5">
              {orders.map((o) => (
                <li key={o.id}>
                  <Link
                    href={`/order/${o.id}`}
                    className="flex flex-col gap-5 rounded-2xl border border-line p-6 transition-colors hover:border-ink sm:flex-row sm:items-center"
                  >
                    <div className="flex -space-x-5">
                      {o.lines.slice(0, 3).map((l) => (
                        <div key={l.key} className="relative h-20 w-24 overflow-hidden rounded-xl border-2 border-white bg-mist">
                          <Image src={l.image} alt="" fill sizes="96px" className="object-cover" />
                        </div>
                      ))}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold">{o.id}</p>
                      <p className="text-sm text-muted">
                        {formatDate(o.placedAt)} · {o.lines.reduce((n, l) => n + l.qty, 0)} items
                      </p>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="rounded-full bg-mist px-4 py-1.5 text-sm font-bold capitalize text-ink">
                        {o.status}
                      </span>
                      <p className="text-lg font-bold">{formatPrice(o.total)}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )
        ) : saved.length === 0 ? (
          <Empty title="Your wishlist is empty" text="Tap the heart on any product to save it for later." />
        ) : (
          <div className="mt-10 grid gap-x-7 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {saved.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function Empty({ title, text }: { title: string; text: string }) {
  return (
    <div className="mt-10 grid place-items-center rounded-2xl bg-mist px-6 py-24 text-center">
      <p className="text-2xl font-bold">{title}</p>
      <p className="mt-2 text-muted">{text}</p>
      <Link href="/shop" className="btn btn-dark mt-8">
        Browse products
      </Link>
    </div>
  );
}
