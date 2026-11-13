import { Suspense } from "react";
import type { Metadata } from "next";
import { ShopView } from "@/components/ShopView";
import { getCategories, getProducts } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Shop",
  description: "Interactive flat panels, digital podiums, floor stands, PTZ cameras and studio setups from iSLate.",
};

export default async function ShopPage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);
  return (
    <Suspense>
      <ShopView products={products} categories={categories} />
    </Suspense>
  );
}
