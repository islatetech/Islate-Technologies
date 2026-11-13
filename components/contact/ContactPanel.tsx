"use client";

import { useState } from "react";
import { WaveEdge } from "./WaveEdge";
import { ArrowUpRight, Check, Mail, Phone, Pin } from "../Icons";
import { site } from "@/lib/site";

const field =
  "h-12 w-full rounded-xl border border-white/12 bg-white/[0.06] px-4 text-[15px] text-white outline-none transition-colors placeholder:text-white/35 focus:border-white/80 focus:bg-white/[0.09] focus:shadow-[0_0_0_3px_rgba(255,255,255,0.08)]";

/** The contact panel: a short form on one side, direct ways to reach us on the other. */
export function ContactPanel() {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const d = Object.fromEntries(new FormData(form)) as Record<string, string>;
    const contact = (d.contact ?? "").trim();
    const isEmail = /^\S+@\S+\.\S+$/.test(contact);
    setState("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: d.name,
          email: isEmail ? contact : "",
          phone: isEmail ? "" : contact,
          message: d.message,
        }),
      });
      if (!res.ok) throw new Error();
      form.reset();
      setState("sent");
    } catch {
      setState("error");
    }
  };

  const ways = [
    { label: "Call us", value: site.phone, href: site.phoneHref, icon: <Phone size={20} />, external: false },
    {
      label: "WhatsApp",
      value: "Chat with our team",
      href: `https://wa.me/${site.whatsapp}`,
      external: true,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12.04 2a9.9 9.9 0 0 0-8.5 14.9L2 22l5.25-1.5A9.9 9.9 0 1 0 12.04 2Zm0 18.1c-1.5 0-2.9-.4-4.1-1.1l-.3-.2-3.1.9.9-3-.2-.3a8.1 8.1 0 1 1 6.8 3.7Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.6.8-.8 1-.3.2-.6.1a6.6 6.6 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2c0 1.3.9 2.5 1 2.7s1.8 2.8 4.4 3.9c1.6.7 2.3.7 3.1.6.5-.1 1.5-.6 1.7-1.2s.2-1.1.2-1.2-.2-.2-.5-.3Z" />
        </svg>
      ),
    },
    { label: "Email us", value: site.email, href: `mailto:${site.email}`, icon: <Mail size={20} />, external: false },
    { label: "Visit us", value: site.address, href: site.mapHref, icon: <Pin size={20} />, external: true },
  ];

  return (
    <div className="relative overflow-hidden rounded-3xl bg-[#232428] text-white shadow-[0_50px_100px_-40px_rgba(0,0,0,0.9)]">
      <div aria-hidden="true" className="absolute inset-0" style={{ background: "linear-gradient(180deg, #2a2b30 0%, #202125 100%)" }} />
      <WaveEdge background="#0a0a0b" />

      <div className="relative px-6 pb-10 pt-[150px] sm:px-10 md:px-14 md:pb-14 md:pt-[175px]">
        <div className="grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          {/* the form */}
          <div>
            <h2 className="text-[clamp(1.6rem,2.6vw,2.2rem)] font-semibold tracking-tight">Talk to us</h2>
            <p className="mt-2 max-w-sm text-[15px] leading-relaxed text-white/50">
              Buying for several rooms? Mention it and we will send a bulk quote.
            </p>

            {state === "sent" ? (
              <div className="mt-8 flex items-start gap-4 rounded-2xl border border-white/12 bg-white/[0.06] p-6 text-[15px] leading-relaxed">
                <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white text-ink">
                  <Check size={18} />
                </span>
                <span>
                  Thank you. We will get back to you as soon as possible.
                  <button onClick={() => setState("idle")} className="mt-3 block text-white/55 underline underline-offset-4 hover:text-white">
                    Send another message
                  </button>
                </span>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="mt-8 grid gap-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="sr-only" htmlFor="cp-name">
                      Your name
                    </label>
                    <input id="cp-name" name="name" required autoComplete="name" placeholder="Your name" className={field} />
                  </div>
                  <div>
                    <label className="sr-only" htmlFor="cp-contact">
                      Phone number or email
                    </label>
                    <input id="cp-contact" name="contact" required autoComplete="tel" placeholder="Phone number or email" className={field} />
                  </div>
                </div>
                <label className="sr-only" htmlFor="cp-message">
                  Your message
                </label>
                <textarea
                  id="cp-message"
                  name="message"
                  required
                  rows={4}
                  placeholder="Tell us about your classroom"
                  className={`${field} h-auto resize-none py-3.5`}
                />
                {state === "error" && (
                  <p role="alert" className="text-[14px] text-[#ff9b9b]">
                    Something went wrong. Please try again or call us.
                  </p>
                )}
                <button
                  className="mt-1 h-12 rounded-xl bg-white text-[15px] font-semibold text-ink transition-colors hover:bg-silver disabled:opacity-60 sm:w-fit sm:px-10"
                  disabled={state === "sending"}
                >
                  {state === "sending" ? "Sending" : "Send message"}
                </button>
              </form>
            )}
          </div>

          {/* direct ways to reach us */}
          <div>
            <h2 className="text-[clamp(1.6rem,2.6vw,2.2rem)] font-semibold tracking-tight">Or reach us directly</h2>
            <ul className="mt-8 divide-y divide-white/10 border-y border-white/10">
              {ways.map((w) => (
                <li key={w.label}>
                  <a
                    href={w.href}
                    target={w.external ? "_blank" : undefined}
                    rel={w.external ? "noreferrer" : undefined}
                    className="group flex items-center gap-5 py-5 transition-colors hover:bg-white/[0.03]"
                  >
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/15 text-white/80 transition-colors group-hover:border-white group-hover:bg-white group-hover:text-ink">
                      {w.icon}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[12px] uppercase tracking-[0.14em] text-white/40">{w.label}</span>
                      <span className="mt-1 block text-[16px] font-medium leading-snug">{w.value}</span>
                    </span>
                    <ArrowUpRight size={18} className="shrink-0 text-white/35 transition-all duration-300 group-hover:rotate-45 group-hover:text-white" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
