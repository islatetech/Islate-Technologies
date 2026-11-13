# iSLate Technologies

E-commerce site for iSLate Technologies (smart boards for teachers). Built with Next.js (App Router), TypeScript and Tailwind CSS.

Content (logo, company details, the flagship panel, specifications, policies, coupon) was taken from https://islate.in. The other products are demo data.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## What is in the store

- Home, Shop (category filter and sort), Product detail (sizes, gallery, specifications, pincode check)
- Cart drawer and cart page, coupon (`CODE5OFF`, 5% off, from the original site)
- Checkout with validation, order confirmation, order history and wishlist (`/orders`)
- About, Contact, Privacy policy, Terms, Refund policy, custom 404

## Motion and 3D

Three.js scenes (`@react-three/fiber`) draw a modelled iSLate smart screen. Lenis smooths the scroll for the whole site (`components/SmoothScroll.tsx`). Every scene falls back to a still image without WebGL, and everything stops for visitors who ask for reduced motion.

- `components/hero/` is the home hero. The screen follows the scroll and turns 360 degrees when you move across it.
- `components/range/` is the curved track of products on the home page.
- `components/audience/` is the four 3D products in "Made for the people who stand at the front of the room".
- `components/about/` is the About page story. One screen moves between four scenes as you scroll.

## Architecture and how to scale it

| Concern | Where | Going live |
| --- | --- | --- |
| Product data | `lib/catalog.ts` (async functions) | Replace the function bodies with WooCommerce, Shopify, a CMS or a database. Pages do not change. |
| Categories | `lib/categories.ts` | Same, or fetch from the backend. |
| Pricing and coupons | `lib/pricing.ts` | Move coupon rules to the backend. |
| Orders | `app/api/orders/route.ts` | Re-prices from the catalogue on the server. Add a database write and a payment gateway here. |
| Contact form | `app/api/contact/route.ts` | Connect email or CRM. |
| Cart, wishlist, order history | `components/StoreProvider.tsx` | Stored in the browser for the demo. Swap for user accounts and server persistence. |
| Company details | `lib/site.ts` | Single source for phone, email, address, nav and footer links. |

To add a product, append an object to the `products` array in `lib/catalog.ts` and drop its images in `public/images/products`.

## Assets

- `public/brand/logo.*` is the official logo from islate.in. The palette (graphite, silver, white) is taken from it.
- `public/images/products/*` are background-removed cut-outs of the iSLate range, made from the images on islate.in, and angled views made from them.
- `public/images/hero-screen.webp` is the wallpaper from the iSLate panel photo. `screen.webp` and `screen-clean.webp` are the graphite screens used on the About page.
- `public/images/photos/before.webp` and `after.webp` are free Unsplash photographs for the before and after slider on the home page. Swap in the client's own photographs before launch.
