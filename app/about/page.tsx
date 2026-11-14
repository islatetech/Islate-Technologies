import type { Metadata } from "next";
import { AboutStory } from "@/components/about/AboutStory";
import { ScrollExpandIntro } from "@/components/about/ScrollExpandIntro";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About us",
  description:
    "iSLate Technologies provides smart education solutions to teachers, coaching centres, schools and corporates.",
};

export default function AboutPage() {
  return (
    <>
      <ScrollExpandIntro />
      <AboutStory phone={site.phone} whatsapp={site.whatsapp} />
    </>
  );
}
