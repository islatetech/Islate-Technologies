"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "./StoreProvider";
import { CouponBox, Summary } from "./OrderSummary";
import { Check, Shield } from "./Icons";
import { Select } from "./Select";
import type { Address, Order, PaymentMethod } from "@/lib/types";

const states = [
  "Andhra Pradesh", "Assam", "Bihar", "Chandigarh", "Chhattisgarh", "Delhi", "Goa", "Gujarat", "Haryana",
  "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra",
  "Odisha", "Punjab", "Rajasthan", "Tamil Nadu", "Telangana", "Uttar Pradesh", "Uttarakhand", "West Bengal",
];

const methods: { id: PaymentMethod; label: string; note: string }[] = [
  { id: "upi", label: "UPI", note: "Pay with any UPI app" },
  { id: "card", label: "Credit or debit card", note: "No cost EMI up to 12 months" },
  { id: "netbanking", label: "Net banking", note: "All major banks" },
  { id: "bank-transfer", label: "Bank transfer", note: "For institutions and purchase orders" },
  { id: "cod", label: "Cash on delivery", note: "Pay when the panel arrives" },
];

type Errors = Partial<Record<keyof Address, string>>;

export function CheckoutView() {
  const router = useRouter();
  const { lines, totals, coupon, hydrated, saveOrder } = useStore();
  const [payment, setPayment] = useState<PaymentMethod>("upi");
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const validate = (a: Address): Errors => {
    const e: Errors = {};
    if (a.fullName.trim().length < 2) e.fullName = "Enter your full name";
    if (!/^\S+@\S+\.\S+$/.test(a.email)) e.email = "Enter a valid email";
    if (!/^[6-9]\d{9}$/.test(a.phone.replace(/\s|-|^\+91/g, ""))) e.phone = "Enter a 10 digit mobile number";
    if (a.line1.trim().length < 4) e.line1 = "Enter your address";
    if (a.city.trim().length < 2) e.city = "Enter your city";
    if (!a.state) e.state = "Select a state";
    if (!/^[1-9]\d{5}$/.test(a.pincode)) e.pincode = "Enter a 6 digit pincode";
    if (a.gstin && !/^\d{2}[A-Z]{5}\d{4}[A-Z][A-Z\d]Z[A-Z\d]$/i.test(a.gstin)) e.gstin = "Enter a valid GSTIN";
    return e;
  };

  const onSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const fd = new FormData(ev.currentTarget);
    const get = (k: string) => String(fd.get(k) ?? "").trim();
    const address: Address = {
      fullName: get("fullName"),
      email: get("email"),
      phone: get("phone"),
      organisation: get("organisation") || undefined,
      line1: get("line1"),
      line2: get("line2") || undefined,
      city: get("city"),
      state: get("state"),
      pincode: get("pincode"),
      gstin: get("gstin") || undefined,
    };
    const found = validate(address);
    setErrors(found);
    if (Object.keys(found).length) {
      document.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
      return;
    }

    setSubmitting(true);
    setServerError("");
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lines: lines.map((l) => ({ productId: l.productId, variantId: l.variantId, qty: l.qty })),
          address,
          payment,
          coupon,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not place the order");
      const order: Order = data.order;
      saveOrder(order);
      router.push(`/order/${order.id}`);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  const err = (k: keyof Address) => errors[k];
  const input = (k: keyof Address, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}, optional = false) => (
    <div>
      <label htmlFor={k} className="label">
        {label} {optional && <span className="font-medium text-muted">(optional)</span>}
      </label>
      <input
        id={k}
        name={k}
        className="field"
        aria-invalid={!!err(k)}
        aria-describedby={err(k) ? `${k}-err` : undefined}
        {...props}
      />
      {err(k) && (
        <p id={`${k}-err`} className="mt-1.5 text-sm font-semibold text-[#d33]">
          {err(k)}
        </p>
      )}
    </div>
  );

  if (hydrated && lines.length === 0) {
    return (
      <section className="grid min-h-[70vh] place-items-center bg-white px-6 pt-[var(--header-h)] text-center">
        <div>
          <p className="text-3xl font-bold">Nothing to check out yet</p>
          <p className="mt-2 text-muted">Add a product to your cart first.</p>
          <Link href="/shop" className="btn btn-dark mt-8">
            Browse products
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white pb-16 pt-[calc(var(--header-h)+28px)]">
      <div className="container-x">
        <h1 className="display text-[clamp(2.2rem,4.4vw,3.6rem)]">Checkout</h1>
        <p className="mt-3 flex items-center gap-2 text-muted">
          <Shield size={18} /> This is a demo store. No payment is taken and no real order is placed.
        </p>

        <form onSubmit={onSubmit} noValidate className="mt-12 grid gap-14 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-12">
            <fieldset>
              <legend className="text-2xl font-bold tracking-tight">Contact and delivery</legend>
              <div className="mt-7 grid gap-5 sm:grid-cols-2">
                {input("fullName", "Full name", { autoComplete: "name" })}
                {input("organisation", "School or organisation", { autoComplete: "organization" }, true)}
                {input("email", "Email", { type: "email", autoComplete: "email" })}
                {input("phone", "Mobile number", { type: "tel", inputMode: "tel", autoComplete: "tel" })}
                <div className="sm:col-span-2">{input("line1", "Address", { autoComplete: "address-line1" })}</div>
                <div className="sm:col-span-2">
                  {input("line2", "Landmark or area", { autoComplete: "address-line2" }, true)}
                </div>
                {input("city", "City", { autoComplete: "address-level2" })}
                <div>
                  <label htmlFor="state" className="label">
                    State
                  </label>
                  <Select
                    id="state"
                    name="state"
                    placeholder="Select state"
                    invalid={!!err("state")}
                    options={states.map((s) => ({ value: s, label: s }))}
                  />
                  {err("state") && <p className="mt-1.5 text-sm font-semibold text-[#d33]">{err("state")}</p>}
                </div>
                {input("pincode", "Pincode", { inputMode: "numeric", maxLength: 6, autoComplete: "postal-code" })}
                {input("gstin", "GSTIN", { placeholder: "For a tax invoice", className: "field uppercase" }, true)}
              </div>
            </fieldset>

            <fieldset>
              <legend className="text-2xl font-bold tracking-tight">Payment</legend>
              <div className="mt-7 grid gap-3">
                {methods.map((m) => (
                  <label
                    key={m.id}
                    className={`flex cursor-pointer items-center gap-4 rounded-2xl border-2 p-5 transition-colors ${
                      payment === m.id ? "border-ink bg-mist" : "border-line hover:border-[#c5ccdb]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={m.id}
                      checked={payment === m.id}
                      onChange={() => setPayment(m.id)}
                      className="sr-only"
                    />
                    <span
                      className={`grid h-6 w-6 place-items-center rounded-full border-2 ${
                        payment === m.id ? "border-ink bg-ink text-white" : "border-[#b9c1d1]"
                      }`}
                    >
                      {payment === m.id && <Check size={14} />}
                    </span>
                    <span>
                      <span className="block font-bold">{m.label}</span>
                      <span className="text-sm text-muted">{m.note}</span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
          </div>

          <aside className="h-fit rounded-2xl bg-mist p-7 md:p-9 lg:sticky lg:top-[calc(var(--nav-h)+24px)]">
            <h2 className="text-xl font-bold">Order summary</h2>
            <div className="mt-6">
              <Summary lines={lines} totals={totals} showLines />
            </div>
            <div className="mt-6">
              <CouponBox />
            </div>
            {serverError && (
              <p role="alert" className="mt-5 rounded-xl bg-[#fde8e8] px-4 py-3 text-sm font-semibold text-[#b42323]">
                {serverError}
              </p>
            )}
            <button className="btn btn-primary mt-7 w-full" disabled={submitting || !hydrated}>
              {submitting ? "Placing order" : "Place order"}
            </button>
            <p className="mt-4 text-center text-xs leading-relaxed text-muted">
              By placing this order you agree to our{" "}
              <Link href="/terms" className="underline">
                terms
              </Link>{" "}
              and{" "}
              <Link href="/refund-policy" className="underline">
                refund policy
              </Link>
              .
            </p>
          </aside>
        </form>
      </div>
    </section>
  );
}
