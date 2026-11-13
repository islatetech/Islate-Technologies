import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Terms and conditions" };

export default function TermsPage() {
  return (
    <LegalPage title="Terms and conditions">
      <p>
        By using this website and buying from {site.legalName} you agree to the terms below. Please read them before
        placing an order.
      </p>
      <h2>Products and pricing</h2>
      <p>
        We make every effort to show accurate descriptions, images and prices. Prices are in Indian rupees and include
        applicable taxes unless stated. We may correct errors and update prices without notice before an order is
        confirmed.
      </p>
      <h2>Orders and payment</h2>
      <p>
        An order is accepted once we confirm it by email or phone. We may cancel an order if a product is unavailable or
        we cannot verify your details, in which case any payment will be refunded.
      </p>
      <h2>Delivery and installation</h2>
      <p>
        Delivery timelines are estimates and may vary by location. Our team will contact you to schedule delivery and
        installation support.
      </p>
      <h2>Returns and refunds</h2>
      <p>Returns and refunds are governed by our refund policy.</p>
      <h2>Warranty</h2>
      <p>
        Products carry the manufacturer or service warranty described on the product page or invoice. Warranty does not
        cover damage caused by misuse, unauthorised repair or accidents.
      </p>
      <h2>Limitation of liability</h2>
      <p>
        To the extent the law allows, we are not liable for indirect or consequential losses arising from the use of our
        products or this website.
      </p>
      <h2>Contact</h2>
      <p>
        Questions about these terms? Write to <a href={`mailto:${site.email}`}>{site.email}</a>.
      </p>
    </LegalPage>
  );
}
