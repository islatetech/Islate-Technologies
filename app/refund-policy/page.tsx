import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { refundPolicy } from "@/lib/legal";

export const metadata: Metadata = { title: "Refund policy" };

export default function RefundPage() {
  return <LegalPage title="Refund policy" blocks={refundPolicy} />;
}
