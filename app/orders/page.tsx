import { Suspense } from "react";
import type { Metadata } from "next";
import { AccountView } from "@/components/AccountView";
import { getProducts } from "@/lib/catalog";

export const metadata: Metadata = { title: "My account" };

export default async function OrdersPage() {
  const products = await getProducts();
  return (
    <Suspense>
      <AccountView products={products} />
    </Suspense>
  );
}
