import type { CartLine, Product, ProductVariant } from "./types";

export function toCartLine(product: Product, variant?: ProductVariant): Omit<CartLine, "qty"> {
  const v = variant ?? product.variants?.[0];
  return {
    key: v ? `${product.id}:${v.id}` : product.id,
    productId: product.id,
    variantId: v?.id,
    slug: product.slug,
    name: product.name,
    variantLabel: v?.label,
    image: product.images[0].src,
    price: v?.price ?? product.price,
    compareAt: v?.compareAt ?? product.compareAt,
  };
}

export function lowestPrice(product: Product) {
  if (!product.variants?.length) return product.price;
  return Math.min(...product.variants.map((v) => v.price));
}
