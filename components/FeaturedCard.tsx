import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/types";
import { discountPercent, formatPrice } from "@/lib/format";
import { lowestPrice } from "@/lib/cartline";

/** Dark showcase card: product, name, one line, price and the saving. */
export function FeaturedCard({ product }: { product: Product }) {
  const first = product.variants?.[0];
  const price = first?.price ?? product.price;
  const compareAt = first?.compareAt ?? product.compareAt;
  const off = discountPercent(price, compareAt);
  const image = product.images[0];

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-center transition-colors duration-500 hover:border-white/25 hover:bg-white/[0.07]"
    >
      <div className="relative h-44 sm:h-52">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(min-width: 1024px) 22vw, 45vw"
          className="pop object-contain"
          style={{ filter: "drop-shadow(0 18px 18px rgba(0,0,0,0.5))" }}
        />
      </div>
      <p className="mt-5 text-[15px] font-semibold leading-snug text-white">{product.name}</p>
      <p className="mt-1 line-clamp-1 text-[13px] text-white/45">{product.tagline}</p>
      <p className="mt-auto pt-5 text-[22px] font-semibold tracking-tight text-white">
        {product.variants ? <span className="mr-1.5 text-[13px] font-normal text-white/45">From</span> : null}
        {formatPrice(lowestPrice(product))}
      </p>
      <p className="mt-2 flex items-center justify-center gap-2 text-[12px]">
        {compareAt && compareAt > price && <span className="text-white/35 line-through">{formatPrice(compareAt)}</span>}
        {off > 0 && <span className="rounded-md bg-white/10 px-2 py-0.5 font-medium text-white/80">{off}% off</span>}
      </p>
    </Link>
  );
}
