import type { ReactNode } from "react";

/** A legal page: the title, then the text. No banner. */
export function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="bg-white pb-20 pt-[calc(var(--header-h)+56px)] md:pb-28">
      <div className="container-x">
        <div className="mx-auto max-w-3xl">
          <h1 className="display text-[clamp(2.2rem,4.6vw,3.6rem)]">{title}</h1>
          <div className="prose-islate mt-10">{children}</div>
        </div>
      </div>
    </section>
  );
}
