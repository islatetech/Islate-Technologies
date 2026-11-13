# iSLate Technologies storefront

Premium e-commerce site for iSLate Technologies (smart boards for teachers). Built with Next.js (App Router), TypeScript and Tailwind CSS.

Content (logo, company details, the flagship panel, specs, policies, coupon) was taken from https://islate.in. Extra products are demo data.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## What is in the store

- Home, Shop (filter, sort, search), Product detail (variants, gallery, specs, pincode check)
- Cart drawer and cart page, coupon (`CODE5OFF`, 5% off, from the original site)
- Checkout with validation, order confirmation, order history and wishlist (`/orders`)
- About, Contact, Privacy, Terms, Refund pages, custom 404

## The 3D hero

`components/hero/Hero3D.tsx` is a 430vh scroll story. The sticky stage holds a three.js scene (`Scene.tsx`): a procedurally modelled iSLate smart screen that tilts beside the headline, turns flat and fills the view while its specs appear, then swings to the other side. The lesson on its display is drawn to a canvas texture and revealed by the scroll position. Lenis (`SmoothScroll.tsx`) smooths the wheel and the scene follows the scroll with damping. Without WebGL, or with reduced motion, it falls back to a still product image.

To use a real model, replace the meshes in `Panel` with a `useGLTF` model of the panel.

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
- `public/images/products/*` are background-removed cut-outs of the iSLate range from the brand banner. The product card only lifts the cut-out on hover, the tile stays still.
- `public/images/photos/*` are free Unsplash photographs used for the hero, audience tiles and before/after slider. Swap in the client's own photography before launch.
