import { Suspense } from "react";
import type { Metadata } from "next";
import { OrderView } from "@/components/OrderView";

export const metadata: Metadata = { title: "Order confirmed" };

async function Order({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <OrderView id={id} />;
}

export default function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<div className="min-h-[70vh] bg-white" />}>
      <Order params={params} />
    </Suspense>
  );
}
