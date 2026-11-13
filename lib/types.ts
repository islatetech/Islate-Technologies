export type CategorySlug =
  | "flat-panel"
  | "digital-podium"
  | "floor-stand"
  | "ptz-camera"
  | "studio-setup";

export interface Category {
  slug: CategorySlug;
  name: string;
  tagline: string;
  image: string;
  fit?: "cover" | "cutout";
}

export interface ProductVariant {
  id: string;
  label: string;
  /** Price in rupees (whole numbers). */
  price: number;
  compareAt?: number;
}

export interface SpecGroup {
  title: string;
  rows: { label: string; value: string }[];
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  summary: string;
  description: string[];
  highlights: string[];
  categories: CategorySlug[];
  /** Base price in rupees. Variants override it. */
  price: number;
  compareAt?: number;
  variants?: ProductVariant[];
  images: { src: string; alt: string; fit?: "cover" | "cutout" }[];
  specs: SpecGroup[];
  inStock: boolean;
  featured?: boolean;
  bestSeller?: boolean;
  isNew?: boolean;
  /** Which products the original catalogue lists vs additions for the demo. */
  source: "islate.in" | "demo";
}

export interface CartLine {
  /** product id + optional variant id */
  key: string;
  productId: string;
  variantId?: string;
  slug: string;
  name: string;
  variantLabel?: string;
  image: string;
  price: number;
  compareAt?: number;
  qty: number;
}

export interface Address {
  fullName: string;
  email: string;
  phone: string;
  organisation?: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  gstin?: string;
}

export type PaymentMethod = "upi" | "card" | "netbanking" | "bank-transfer" | "cod";

export interface Order {
  id: string;
  placedAt: string;
  lines: CartLine[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  coupon?: string;
  address: Address;
  payment: PaymentMethod;
  status: "confirmed" | "processing" | "shipped" | "delivered";
}
