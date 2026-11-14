import Link from "next/link";
import { Hero3D } from "@/components/hero/Hero3D";
import { RangeCarousel } from "@/components/range/RangeCarousel";
import { Reveal } from "@/components/Reveal";
import { BeforeAfter } from "@/components/BeforeAfter";
import { Faq } from "@/components/Faq";
import { AudienceCard } from "@/components/audience/AudienceCard";
import { FeaturedCard } from "@/components/FeaturedCard";
import { ArrowRight } from "@/components/Icons";
import { getProducts } from "@/lib/catalog";

const audiences = [
  { name: "Teachers", note: "Write, annotate and teach from one surface.", product: "Wall mounted flat panel", view: "wall" },
  { name: "Coaching centres", note: "Packed batches, recorded lectures, hybrid classes.", product: "Panel on mobile trolley", view: "trolley" },
  { name: "Schools", note: "From a single room to a whole campus.", product: "Panel on A-frame stand", view: "aframe" },
  { name: "Corporates", note: "Training rooms, workshops and boardrooms.", product: "Smart digital podium", view: "podium" },
] as const;

const faqs = [
  {
    q: "Which screen size should I choose?",
    a: "65 inch suits small rooms and small batches. 75 inch is the usual choice for a standard classroom. 86 inch is for large rooms and halls where the back rows need a bigger picture.",
  },
  {
    q: "Does the panel come with a stand or a wall mount?",
    a: "The base panel is wall mounted. If you would rather move one board between rooms, choose the trolley or A-frame stand versions, which ship ready to roll.",
  },
  {
    q: "Which apps does it run?",
    a: "The panel runs Google EDLA certified Android 16 on an octa-core processor with 8 GB RAM and 128 GB storage, so the education and meeting apps you already use can be installed on it directly.",
  },
  {
    q: "Do you help with installation?",
    a: "Yes. Our team will call you after you order to schedule delivery and guide the setup.",
  },
  {
    q: "Can I get a GST invoice?",
    a: "Add your GSTIN at checkout and the invoice is issued in your institution's name.",
  },
  {
    q: "How can I pay?",
    a: "UPI, cards, net banking, bank transfer for purchase orders, and cash on delivery. Cards support no cost EMI.",
  },
];

export default async function Home() {
  const products = await getProducts();
  const flagship = products[0];

  return (
    <>
      <Hero3D />

      <RangeCarousel products={products} />

      {/* BEFORE / AFTER */}
      <section className="on-dark flex min-h-[100svh] flex-col justify-center bg-ink pb-8 pt-[calc(var(--nav-h)+20px)] text-white">
        <div className="container-x">
          <Reveal className="text-center">
            <h2 className="h2">See the transformation</h2>
            <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-white/50">
              Drag the slider to compare a classroom before and after an iSLate panel.
            </p>
          </Reveal>
          <Reveal delay={100} className="mx-auto mt-6 h-[clamp(240px,50svh,620px)] max-w-5xl">
            <BeforeAfter
              before="/images/photos/before.webp"
              after="/images/photos/after.webp"
              beforeAlt="A classroom with a chalkboard and wooden benches"
              afterAlt="A modern classroom with a large wall mounted display"
            />
          </Reveal>
          <div className="mt-6 text-center">
            <Link href={`/product/${flagship.slug}`} className="btn btn-light">
              Explore the flat panel <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* PRODUCT CARDS */}
      <section className="on-dark section bg-ink text-white">
        <div className="container-x">
          <Reveal className="text-center">
            <h2 className="h2">Pick your panel</h2>
            <p className="mx-auto mt-3 max-w-md text-[15px] text-white/50">Four ways to bring a smart screen into your room.</p>
          </Reveal>
          <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {products.slice(0, 4).map((p, i) => (
              <Reveal key={p.id} delay={i * 70} className="h-full">
                <FeaturedCard product={p} />
              </Reveal>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/shop" className="btn btn-outline-light">
              View all products <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* WHO IT IS FOR */}
      <section className="on-dark section border-t border-white/10 bg-ink text-white">
        <div className="container-x">
          <Reveal>
            <h2 className="h2 max-w-xl">Made for the people who stand at the front of the room.</h2>
          </Reveal>
          <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
            {audiences.map((a, i) => (
              <Reveal key={a.name} delay={i * 70}>
                <AudienceCard name={a.name} note={a.note} product={a.product} view={a.view} index={i} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="on-dark section bg-ink text-white">
        <div className="container-x grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
          <Reveal>
            <h2 className="h2">Frequently asked questions</h2>
            <p className="mt-4 max-w-xs text-[15px] leading-relaxed text-white/50">
              Answers to the questions we hear most. Cannot find what you are looking for? Reach out.
            </p>
            <p className="mt-6 text-[14px] text-white/50">
              Still have questions?{" "}
              <Link href="/contact" className="text-white underline underline-offset-4">
                Contact us
              </Link>
            </p>
          </Reveal>
          <Reveal delay={100}>
            <Faq items={faqs} />
          </Reveal>
        </div>
      </section>
    </>
  );
}
