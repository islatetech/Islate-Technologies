"use client";

import { useState } from "react";

/**
 * Dark two column FAQ. One answer open at a time, and the answer slides open
 * and closed instead of jumping.
 */
export function Faq({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-white/10 border-y border-white/10">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q}>
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`faq-${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
                className="group flex w-full items-center justify-between gap-6 py-5 text-left text-[17px] font-medium tracking-tight text-white/90 transition-colors hover:text-white"
              >
                <span className="underline-offset-[6px] group-hover:underline">{item.q}</span>
                <svg
                  className={`shrink-0 text-white/50 transition-transform duration-500 ${isOpen ? "rotate-180" : ""}`}
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
            </h3>
            <div
              id={`faq-${i}`}
              role="region"
              className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[var(--ease-out-expo)] ${
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p className="max-w-2xl pb-6 text-[15px] leading-relaxed text-white/55">{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
