import type { ReactNode } from "react";
import type { LegalBlock } from "@/lib/legal";
import { LegalBody } from "./LegalBody";

/** A legal page: the title, then the text with a contents list beside it. No banner. */
export function LegalPage({
  title,
  blocks,
  children,
}: {
  title: string;
  blocks?: LegalBlock[];
  children?: ReactNode;
}) {
  return (
    <section className="bg-white pb-24 pt-[calc(var(--header-h)+56px)] md:pb-32">
      <div className="container-x">
        <h1 className="display text-[clamp(2.2rem,4.6vw,3.6rem)]">{title}</h1>
        <LegalBody>
          {blocks?.map((b, i) => {
            if (b.t === "ul" || b.t === "ol") {
              const List = b.t;
              return (
                <List key={i}>
                  {b.items.map((item, j) => (
                    <li key={j} dangerouslySetInnerHTML={{ __html: item }} />
                  ))}
                </List>
              );
            }
            const Tag = b.t as "h2" | "h3" | "p";
            return <Tag key={i} dangerouslySetInnerHTML={{ __html: (b as { html: string }).html }} />;
          })}
          {children}
        </LegalBody>
      </div>
    </section>
  );
}
