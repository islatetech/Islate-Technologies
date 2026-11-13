import { Suspense } from "react";
import type { Metadata, Viewport } from "next";
import { Schibsted_Grotesk } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/components/StoreProvider";
import { Header, type SearchItem } from "@/components/Header";
import { SiteFooter } from "@/components/SiteFooter";
import { CartDrawer } from "@/components/CartDrawer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { SmoothScroll } from "@/components/SmoothScroll";
import { getCategories, getProducts } from "@/lib/catalog";

const grotesk = Schibsted_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://islate.in"),
  title: {
    default: "iSLate Technologies | Smart boards for teachers",
    template: "%s | iSLate Technologies",
  },
  description:
    "Interactive flat panels, digital podiums, PTZ cameras and studio setups for teachers, coaching centres, schools and corporates.",
  icons: { icon: "/brand/logo.png" },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);
  const items: SearchItem[] = products.map((p) => ({
    slug: p.slug,
    name: p.name,
    price: p.price,
    image: p.images[0].src,
    fit: p.images[0].fit,
    categories: p.categories,
  }));

  return (
    <html lang="en" className={grotesk.variable}>
      <body className="min-h-screen antialiased">
        <StoreProvider>
          <SmoothScroll>
          <Suspense fallback={<div className="fixed inset-x-0 top-0 z-50 h-[108px] bg-white" />}>
            <Header categories={categories} items={items} />
          </Suspense>
          <CartDrawer />
          <Suspense fallback={null}>
            <WhatsAppButton />
          </Suspense>
          <SiteFooter>
            <main>{children}</main>
          </SiteFooter>
        </SmoothScroll>
        </StoreProvider>
      </body>
    </html>
  );
}
