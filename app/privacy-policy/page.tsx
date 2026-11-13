import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Privacy policy" };

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy policy">
      <p>
        {site.legalName} (&ldquo;we&rdquo;, &ldquo;us&rdquo;) respects your privacy. This policy explains what
        information we collect when you use this website, how we use it and the choices you have.
      </p>
      <h2>Information we collect</h2>
      <ul>
        <li>
          Details you give us when you place an order or contact us, such as your name, email, phone number, delivery
          address and GSTIN.
        </li>
        <li>Basic technical data such as browser type and pages visited, collected through cookies and similar tools.</li>
        <li>Your cart and wishlist, which on this site are stored in your own browser.</li>
      </ul>
      <h2>How we use it</h2>
      <ul>
        <li>To process, deliver and support your orders.</li>
        <li>To reply to your enquiries and arrange installation.</li>
        <li>To improve our products, our website and our service.</li>
      </ul>
      <h2>Sharing your data</h2>
      <p>
        We share information only with partners who help us fulfil your order, such as logistics and payment providers,
        and where the law requires it. We do not sell your personal data.
      </p>
      <h2>Cookies</h2>
      <p>
        We use cookies and local storage to keep your cart, remember your preferences and understand how the site is
        used. You can clear or block them in your browser settings, though parts of the store may stop working.
      </p>
      <h2>Your rights</h2>
      <p>
        You can ask us to access, correct or delete the personal data we hold about you. Write to{" "}
        <a href={`mailto:${site.email}`}>{site.email}</a> and we will respond as soon as possible.
      </p>
      <h2>Contact</h2>
      <p>
        {site.legalName}, {site.address}. Phone {site.phone}.
      </p>
    </LegalPage>
  );
}
