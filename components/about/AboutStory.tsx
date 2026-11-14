import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "../Icons";

const points = [
  { t: "4K and intelligent touch", d: "A display that is sharp from the last bench, with stylus writing and annotation that keeps up with your hand." },
  { t: "Android 16, octa-core", d: "EDLA certified, with 8 GB RAM and 128 GB storage. Runs the teaching apps you already use, with no separate computer to buy." },
  { t: "Wall, trolley or stand", d: "Choose 65, 75 or 86 inch, mounted on the wall or rolling between rooms." },
];

/** The About page body: plain sections that scroll normally. */
export function AboutStory({ phone, whatsapp }: { phone: string; whatsapp: string }) {
  return (
    <div className="on-dark bg-ink text-white" aria-label="About iSLate">
      {/* who we are */}
      <section className="container-x grid items-center gap-12 py-24 md:grid-cols-2 md:py-32">
        <div>
          <h1 className="text-[clamp(2.6rem,6vw,5.4rem)] font-bold leading-[1.02] tracking-[-0.04em]">Who we are</h1>
          {/* About us, from the iSLate Interactive Flat Panel catalogue */}
          <p className="mt-6 max-w-xl text-[clamp(1.05rem,1.35vw,1.2rem)] leading-[1.65] text-white/75">
            iSLate Technologies Private Limited delivers advanced digital display and interactive solutions for
            education and corporate environments. Focused on innovation, performance and reliability, iSLate designs
            technology that enhances collaboration, communication and productivity in modern spaces.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/shop" className="btn btn-light">
              Explore the range <ArrowRight size={18} />
            </Link>
            <Link href="/contact" className="btn btn-outline-light">
              Talk to our team
            </Link>
          </div>
        </div>
        <div className="relative aspect-[1400/852] w-full">
          <Image src="/images/products/wall-panel.webp" alt="iSLate interactive flat panel" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-contain" />
        </div>
      </section>

      {/* classrooms */}
      <section className="container-x border-t border-white/10 py-24 text-center md:py-32">
        <h2 className="mx-auto max-w-2xl text-[clamp(2.2rem,5vw,4rem)] font-bold leading-[1.05] tracking-[-0.035em]">Made for real classrooms.</h2>
        <p className="mx-auto mt-5 max-w-xl text-[16px] leading-relaxed text-white/60">
          The iSLate range is derived from authentic classroom environments. Every panel, podium and camera is chosen
          to make teaching simpler, so the teacher can give their attention to the people in the room.
        </p>
      </section>

      {/* the range */}
      <section className="container-x grid items-center gap-12 border-t border-white/10 py-24 md:grid-cols-2 md:py-32">
        <div className="relative order-2 aspect-[1400/852] w-full md:order-1">
          <Image src="/images/products/trolley-panel.webp" alt="iSLate trolley panel" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-contain" />
        </div>
        <div className="order-1 md:order-2">
          <h2 className="text-[clamp(2rem,4.6vw,3.8rem)] font-bold leading-[1.04] tracking-[-0.035em]">Every room, every size.</h2>
          <ul className="mt-6 space-y-3">
            {points.map((x) => (
              <li key={x.t} className="rounded-xl border border-white/10 bg-white/[0.05] px-5 py-4">
                <p className="flex items-center gap-2.5 text-[15px] font-semibold">
                  <span className="h-1.5 w-1.5 rounded-full bg-white" /> {x.t}
                </p>
                <p className="mt-1 pl-4 text-[13.5px] leading-snug text-white/55">{x.d}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* plan */}
      <section className="container-x border-t border-white/10 py-24 text-center md:py-32">
        <h2 className="mx-auto max-w-2xl text-[clamp(2.4rem,5.6vw,4.6rem)] font-bold leading-[1.04] tracking-[-0.04em]">Let us plan your classroom.</h2>
        <p className="mx-auto mt-5 max-w-md text-[16px] leading-relaxed text-white/65">
          Our team will walk you through the range and help you choose the right setup for your institution.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/contact" className="btn btn-light">
            Get in touch <ArrowRight size={18} />
          </Link>
          <Link href="/shop" className="btn btn-outline-light">
            Browse products
          </Link>
        </div>
        <p className="mt-6 text-[14px] text-white/45">
          {phone} &nbsp;·&nbsp;{" "}
          <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer" className="underline underline-offset-4 hover:text-white">
            WhatsApp
          </a>
        </p>
      </section>
    </div>
  );
}
