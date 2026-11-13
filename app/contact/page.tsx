import type { Metadata } from "next";
import { ContactPanel } from "@/components/contact/ContactPanel";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Contact us",
  description: "Call, email or visit iSLate Technologies in Sector 64, Noida.",
};

export default function ContactPage() {
  return (
    <section className="on-dark relative isolate min-h-[100svh] overflow-hidden bg-ink pb-16 pt-[calc(var(--header-h)+56px)] text-white">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{ background: "radial-gradient(60% 50% at 50% 0%, rgba(255,255,255,0.07), transparent 70%)" }}
      />
      <div className="container-x">
        <div className="text-center">
          <h1
            className="display rise mx-auto max-w-4xl text-[clamp(2.2rem,5vw,4.2rem)]"
            style={{ ["--d" as string]: "100ms" }}
          >
            Let us help you choose the <span className="chrome-text">right setup.</span>
          </h1>
        </div>
        <Reveal delay={150} className="mt-12">
          <ContactPanel />
        </Reveal>
      </div>
    </section>
  );
}
