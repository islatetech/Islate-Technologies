import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Refund policy" };

export default function RefundPage() {
  return (
    <LegalPage title="Refund policy">
      <h2>Returns</h2>
      <p>
        Our policy lasts 30 days from delivery. If 30 days have passed since your purchase, we cannot offer a refund or
        exchange.
      </p>
      <p>
        To be eligible for a return, your item must be unused and in the same condition that you received it, in its
        original packaging. A receipt or proof of purchase is required.
      </p>
      <h2>Partial refunds</h2>
      <ul>
        <li>Any item not in its original condition, damaged or missing parts for reasons not due to our error.</li>
        <li>Any item returned more than 30 days after delivery.</li>
      </ul>
      <h2>Refunds</h2>
      <p>
        Once your return is received and inspected, we will email you to confirm and tell you whether the refund is
        approved. If approved, it is processed and credited to your original method of payment within a few working
        days.
      </p>
      <h2>Late or missing refunds</h2>
      <p>
        If you have not received a refund yet, check your bank account again, then contact your card company or bank, as
        it can take time for a refund to post. If you have done this and still have not received it, contact us at{" "}
        <a href={`mailto:${site.email}`}>{site.email}</a>.
      </p>
      <h2>Sale items</h2>
      <p>Only regular priced items may be refunded. Sale items cannot be refunded.</p>
      <h2>Exchanges</h2>
      <p>
        We only replace items if they are defective or damaged. To exchange an item, email{" "}
        <a href={`mailto:${site.email}`}>{site.email}</a> and send it to {site.address}.
      </p>
      <h2>Shipping returns</h2>
      <p>
        You are responsible for return shipping costs, which are non-refundable. For expensive items, consider a
        trackable shipping service or shipping insurance.
      </p>
      <h2>Need help?</h2>
      <p>
        Call {site.phone} or email <a href={`mailto:${site.email}`}>{site.email}</a>.
      </p>
    </LegalPage>
  );
}
