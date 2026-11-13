"use client";

import { usePathname } from "next/navigation";
import { site } from "@/lib/site";

/** Floating WhatsApp shortcut. Hidden where it would sit on top of a buy bar. */
export function WhatsAppButton() {
  const pathname = usePathname();
  const hideOnMobile = pathname.startsWith("/product/") || pathname === "/checkout";
  const text = encodeURIComponent("Hello iSLate, I would like to know more about your smart boards.");

  return (
    <a
      href={`https://wa.me/${site.whatsapp}?text=${text}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with us on WhatsApp"
      className={`fixed bottom-5 right-5 z-40 items-center gap-2.5 rounded-full bg-[#1f2a24] py-3 pl-3.5 pr-3.5 text-sm sm:pr-5 font-semibold text-white shadow-[0_12px_30px_-8px_rgba(0,0,0,0.5)] transition-transform hover:-translate-y-0.5 ${
        hideOnMobile ? "hidden lg:flex" : "flex"
      }`}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="text-[#4ade80]">
        <path d="M12.04 2a9.9 9.9 0 0 0-8.5 14.9L2 22l5.25-1.5A9.9 9.9 0 1 0 12.04 2Zm0 18.1c-1.5 0-2.9-.4-4.1-1.1l-.3-.2-3.1.9.9-3-.2-.3a8.1 8.1 0 1 1 6.8 3.7Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.6.8-.8 1-.3.2-.6.1a6.6 6.6 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2c0 1.3.9 2.5 1 2.7s1.8 2.8 4.4 3.9c1.6.7 2.3.7 3.1.6.5-.1 1.5-.6 1.7-1.2s.2-1.1.2-1.2-.2-.2-.5-.3Z" />
      </svg>
      <span className="hidden sm:inline">Chat with us</span>
    </a>
  );
}
