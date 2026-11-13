import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProductDetail } from "@/components/ProductDetail";
import { ProductCard } from "@/components/ProductCard";
import { getProduct, getProducts, getRelatedProducts } from "@/lib/catalog";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.summary,
    openGraph: { images: [product.images[0].src] },
  };
}

async function ProductContent({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();
  const related = await getRelatedProducts(product, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.summary,
    image: product.images.map((i) => i.src),
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: product.price,
      availability: product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ProductDetail product={product} />
      {related.length > 0 && (
        <section className="section-tight border-t border-ink/10 bg-shelf pb-16">
          <div className="container-x">
            <h2 className="text-[clamp(1.4rem,2.4vw,1.9rem)] font-semibold tracking-tight">You may also need</h2>
            <div className="mt-10 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

export default function ProductPage({ params }: Props) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-shelf" />}>
      <ProductContent params={params} />
    </Suspense>
  );
}
