"use client";

import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/types";
import { discountPercent, formatPrice } from "@/lib/format";
import { lowestPrice, toCartLine } from "@/lib/cartline";
import { useStore } from "./StoreProvider";
import { HeartIcon, Plus } from "./Icons";

/**
 * A product standing on a shelf. No card, no tile: just the product, its name
 * and its price. On hover the product lifts off the shelf.
 */
export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const first = product.variants?.[0];
  const price = first?.price ?? product.price;
  const compareAt = first?.compareAt ?? product.compareAt;
  const off = discountPercent(price, compareAt);
  const liked = wishlist.includes(product.id);
  const image = product.images[0];

  return (
    <article className="group relative">
      <Link
        href={`/product/${product.slug}`}
        aria-label={product.name}
        className="relative block h-[250px] sm:h-[290px]"
      >
        <div className="absolute inset-x-0 bottom-[14px] top-0">
          {image.fit === "cutout" ? (
            <Image
              src={image.src}
              alt={image.alt}
              fill
              priority={priority}
              sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
              className="pop object-contain object-bottom px-6 pt-4"
            />
          ) : (
            <Image
              src={image.src}
              alt={image.alt}
              fill
              priority={priority}
              sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
              className="rounded-xl object-cover"
            />
          )}
        </div>
        <div className="shelf" aria-hidden="true" />
      </Link>

      <button
        onClick={() => toggleWishlist(product.id)}
        aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
        aria-pressed={liked}
        className="absolute right-0 top-1 grid h-9 w-9 place-items-center rounded-full text-ink/60 transition-colors hover:bg-white hover:text-ink"
      >
        <HeartIcon size={19} filled={liked} />
      </button>

      <div className="mt-5 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <Link href={`/product/${product.slug}`} className="block text-[16px] font-semibold leading-snug tracking-tight">
            {product.name}
          </Link>
          <p className="mt-1 text-[14px] text-muted">
            {product.variants ? "From " : ""}
            {formatPrice(lowestPrice(product))}
            {compareAt && compareAt > price && (
              <span className="ml-2 text-[13px] text-muted/70 line-through">{formatPrice(compareAt)}</span>
            )}
            {off > 0 && <span className="ml-2 text-[12px] font-semibold text-ink">{off}% off</span>}
          </p>
        </div>
        <button
          onClick={() => addToCart(toCartLine(product))}
          aria-label={`Add ${product.name} to cart`}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-ink/15 bg-white text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white"
        >
          <Plus size={16} />
        </button>
      </div>
    </article>
  );
}
