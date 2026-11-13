"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface Entry {
  id: string;
  text: string;
}

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/**
 * The text of a legal page with a contents list beside it. The list is built
 * from the page's own headings, follows the scroll to show where you are, and
 * jumps to a section when clicked. On small screens it is left out.
 */
export function LegalBody({ children }: { children: ReactNode }) {
  const body = useRef<HTMLDivElement>(null);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [active, setActive] = useState(0);

  // read the headings once the page text is on screen
  useEffect(() => {
    const heads = Array.from(body.current?.querySelectorAll("h2") ?? []);
    const list = heads.map((h, i) => {
      const id = `${slug(h.textContent ?? "section")}-${i + 1}`;
      h.id = id;
      return { id, text: h.textContent ?? "" };
    });
    setEntries(list);
  }, []);

  // follow the scroll: the active section is the last heading above the reading line
  useEffect(() => {
    if (!entries.length) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const line = window.innerHeight * 0.28;
      let current = 0;
      entries.forEach((e, i) => {
        const el = document.getElementById(e.id);
        if (el && el.getBoundingClientRect().top <= line) current = i;
      });
      const atEnd = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8;
      setActive(atEnd ? entries.length - 1 : current);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [entries]);

  const go = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 150;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <div className="mt-12 grid gap-12 lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-16">
      <aside className="hidden lg:block">
        <nav aria-label="On this page" className="sticky top-[calc(var(--header-h)+40px)]">
          <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-muted">On this page</p>
          <ol className="border-l border-line">
            {entries.map((e, i) => (
              <li key={e.id}>
                <button
                  type="button"
                  onClick={() => go(e.id)}
                  aria-current={i === active ? "true" : undefined}
                  className={`-ml-px block w-full border-l-2 py-2 pl-4 pr-2 text-left text-[13.5px] leading-snug transition-colors ${
                    i === active
                      ? "border-ink font-semibold text-ink"
                      : "border-transparent text-muted hover:text-ink"
                  }`}
                >
                  <span className="mr-1.5 tabular-nums">{i + 1}.</span>
                  {e.text}
                </button>
              </li>
            ))}
          </ol>
        </nav>
      </aside>

      <div ref={body} className="prose-islate max-w-3xl">
        {children}
      </div>
    </div>
  );
}
