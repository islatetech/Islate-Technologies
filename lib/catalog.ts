import type { Category, Product } from "./types";
import { categories } from "./categories";

/**
 * Catalogue data layer.
 *
 * Every page reads products through the async functions at the bottom of this
 * file. To move to a real backend (WooCommerce, Shopify, a database, a CMS)
 * replace the body of those functions and nothing else needs to change.
 */

const flatPanelSpecs = [
  {
    title: "Display",
    rows: [
      { label: "Resolution", value: "3840 x 2160 (4K UHD)" },
      { label: "Panel type", value: "VA" },
      { label: "Brightness", value: "450 nits (65 inch), 500 nits (75 and 86 inch)" },
      { label: "Colour depth", value: "1.07B (10 bit)" },
      { label: "Colour gamut", value: "72% NTSC (typical)" },
      { label: "Colour accuracy", value: "Delta E 1.5 or lower" },
      { label: "Eye care", value: "TUV Flicker Free, TUV Low Blue Light" },
      { label: "Response time", value: "6.5 ms" },
      { label: "Backlight", value: "DLED, 50,000 hours or more (typical)" },
    ],
  },
  {
    title: "Built-in system",
    rows: [
      { label: "Operating system", value: "Android 13.0" },
      { label: "Certification", value: "Google EDLA certified" },
      { label: "Memory", value: "8 GB RAM, 128 GB ROM" },
      { label: "CPU", value: "A76 x 4 + A55 x 4 octa-core" },
      { label: "GPU", value: "Mali-G610 MP4" },
      { label: "NPU", value: "6 TOPS" },
    ],
  },
  {
    title: "Touch and audio",
    rows: [
      { label: "Touch technology", value: "Infrared recognition" },
      { label: "Touch points", value: "50 point touch" },
      { label: "Speakers", value: "2 x 8W + 2 x 18W outputs, 2 x 12W + 2 x 25W maximum" },
    ],
  },
];

const products: Product[] = [
  {
    id: "3921",
    slug: "islate-interactive-flat-panel",
    name: "iSLate Interactive Flat Panel",
    tagline: "Expand the horizons of education with a new perspective.",
    summary:
      "Derived from an authentic classroom environment, the iSLate whiteboard is crafted to enhance the immersive learning journey.",
    description: [
      "This premier educational board redefines the teaching and learning journey, empowering both educators and learners to unlock boundless knowledge.",
      "Built on a 4K display with 50 point touch and Android 13, it replaces the chalkboard, the projector and the laptop cart with a single surface that is ready the moment the teacher walks in.",
    ],
    highlights: [
      "Enhanced interaction with touch technology",
      "4K display",
      "Multi-touch support",
      "Versatile connectivity options",
      "Built-in annotation tools",
      "Intuitive user interface",
      "Compatibility with educational software",
      "Durability and longevity",
      "Energy efficiency",
      "Integration with collaboration tools",
      "Fostering creativity in an immersive environment",
    ],
    categories: ["flat-panel", "studio-setup"],
    price: 79999,
    compareAt: 99999,
    variants: [
      { id: "65", label: '65"', price: 79999, compareAt: 99999 },
      { id: "75", label: '75"', price: 109999, compareAt: 134999 },
      { id: "86", label: '86"', price: 159999, compareAt: 189999 },
    ],
    images: [
      { src: "/images/products/wall-panel.webp", alt: "iSLate Interactive Flat Panel, front view", fit: "cutout" },
      { src: "/images/products/wall-panel-left.webp", alt: "iSLate Interactive Flat Panel, angled from the left", fit: "cutout" },
      { src: "/images/products/wall-panel-right.webp", alt: "iSLate Interactive Flat Panel, angled from the right", fit: "cutout" },
    ],
    specs: flatPanelSpecs,
    inStock: true,
  },
  {
    id: "d-1002",
    slug: "islate-mobile-trolley-panel",
    name: "iSLate Panel with Mobile Trolley",
    tagline: "One board, shared across classrooms.",
    summary:
      "An interactive panel on a height adjustable trolley with a shelf, so one board can serve several rooms.",
    description: [
      "The trolley locks in place on four castors and carries a shelf for a laptop, a document camera or a set of markers.",
      "Roll it between rooms, plug in once and start teaching.",
    ],
    highlights: [
      "Height adjustable trolley",
      "Lockable castors",
      "Equipment shelf",
      "4K display with multi-touch",
    ],
    categories: ["floor-stand", "flat-panel"],
    price: 89999,
    compareAt: 109999,
    variants: [
      { id: "65", label: '65"', price: 89999, compareAt: 109999 },
      { id: "75", label: '75"', price: 119999, compareAt: 144999 },
      { id: "86", label: '86"', price: 169999, compareAt: 199999 },
    ],
    images: [
      { src: "/images/products/trolley-panel.webp", alt: "iSLate panel on a mobile trolley, front view", fit: "cutout" },
      { src: "/images/products/trolley-panel-left.webp", alt: "iSLate panel on a mobile trolley, angled from the left", fit: "cutout" },
      { src: "/images/products/trolley-panel-right.webp", alt: "iSLate panel on a mobile trolley, angled from the right", fit: "cutout" },
    ],
    specs: [
      {
        title: "Display",
        rows: [
          { label: "Resolution", value: "3840 x 2160 (4K UHD)" },
          { label: "Touch points", value: "50 point touch" },
        ],
      },
      {
        title: "Stand",
        rows: [
          { label: "Type", value: "Mobile trolley with shelf" },
          { label: "Castors", value: "4 lockable castors" },
          { label: "Height", value: "Adjustable" },
        ],
      },
    ],
    inStock: true,
  },
  {
    id: "d-1003",
    slug: "islate-a-frame-stand-panel",
    name: "iSLate A-Frame Stand Panel",
    tagline: "Stable on any floor, light to move.",
    summary:
      "An interactive panel on a wide A-frame stand, designed for open halls, coaching centres and training rooms.",
    description: [
      "The wide base keeps the panel steady while students write on it, and the stand folds flat for transport.",
    ],
    highlights: [
      "Wide A-frame base",
      "Folds flat for transport",
      "Smooth rolling castors",
      "4K display with multi-touch",
    ],
    categories: ["floor-stand", "flat-panel"],
    price: 99999,
    compareAt: 119999,
    variants: [
      { id: "75", label: '75"', price: 99999, compareAt: 119999 },
      { id: "86", label: '86"', price: 149999, compareAt: 174999 },
    ],
    images: [
      { src: "/images/products/aframe-panel.webp", alt: "iSLate panel on an A-frame stand, front view", fit: "cutout" },
      { src: "/images/products/aframe-panel-left.webp", alt: "iSLate panel on an A-frame stand, angled from the left", fit: "cutout" },
      { src: "/images/products/aframe-panel-right.webp", alt: "iSLate panel on an A-frame stand, angled from the right", fit: "cutout" },
    ],
    specs: [
      {
        title: "Display",
        rows: [
          { label: "Resolution", value: "3840 x 2160 (4K UHD)" },
          { label: "Touch points", value: "50 point touch" },
        ],
      },
      {
        title: "Stand",
        rows: [
          { label: "Type", value: "A-frame mobile stand" },
          { label: "Castors", value: "Lockable" },
        ],
      },
    ],
    inStock: true,
    isNew: true,
  },
  {
    id: "d-1004",
    slug: "islate-smart-digital-podium",
    name: "iSLate Smart Digital Podium",
    tagline: "The front of the room, upgraded.",
    summary:
      "A smart podium with an angled touch display, gooseneck microphone and built-in speaker.",
    description: [
      "Teachers control the board, the presentation and the audio from one surface, without turning their back to the class.",
      "The angled display doubles as a preview screen, and the built-in speaker fills a hall without a separate PA system.",
    ],
    highlights: [
      "Angled touch display",
      "Gooseneck microphone",
      "Built-in speaker",
      "Cable management inside the base",
    ],
    categories: ["digital-podium"],
    price: 64999,
    compareAt: 79999,
    images: [
      { src: "/images/products/podium.webp", alt: "iSLate smart digital podium, front view", fit: "cutout" },
      { src: "/images/products/podium-left.webp", alt: "iSLate smart digital podium, angled from the left", fit: "cutout" },
      { src: "/images/products/podium-right.webp", alt: "iSLate smart digital podium, angled from the right", fit: "cutout" },
    ],
    specs: [
      {
        title: "Podium",
        rows: [
          { label: "Display", value: "Angled touch screen" },
          { label: "Microphone", value: "Gooseneck" },
          { label: "Audio", value: "Built-in speaker" },
          { label: "Finish", value: "Black and silver" },
        ],
      },
    ],
    inStock: true,
  },
  {
    id: "d-1005",
    slug: "islate-ptz-conference-camera",
    name: "iSLate PTZ Conference Camera",
    tagline: "Follow the lesson, not the lens.",
    summary:
      "A pan, tilt and zoom camera that frames the teacher and the board for recording and live streaming.",
    description: [
      "Smooth motorised movement and optical zoom keep the teacher in frame, whether they stand at the board or walk the aisle.",
      "Connects over USB and works with the common meeting and streaming apps.",
    ],
    highlights: [
      "Pan, tilt and optical zoom",
      "1080p video",
      "USB plug and play",
      "Remote control included",
    ],
    categories: ["ptz-camera", "studio-setup"],
    price: 24999,
    compareAt: 29999,
    images: [
      { src: "/images/products/ptz-camera.webp", alt: "iSLate PTZ conference camera, front view", fit: "cutout" },
      { src: "/images/products/ptz-camera-left.webp", alt: "iSLate PTZ conference camera, close up of the lens and head", fit: "cutout" },
      { src: "/images/products/ptz-camera-right.webp", alt: "iSLate PTZ conference camera, angled from the right", fit: "cutout" },
    ],
    specs: [
      {
        title: "Camera",
        rows: [
          { label: "Video", value: "1080p, 30 fps" },
          { label: "Movement", value: "Pan, tilt and zoom" },
          { label: "Connection", value: "USB" },
          { label: "Control", value: "Remote control included" },
        ],
      },
    ],
    inStock: true,
  },
  {
    id: "d-1006",
    slug: "islate-studio-setup-kit",
    name: "iSLate Studio Setup Kit",
    tagline: "Everything to record from day one.",
    summary:
      "A complete recording classroom: interactive panel, PTZ camera and digital podium, supplied and installed together.",
    description: [
      "Built for coaching centres and course creators who want to record polished lessons without sourcing equipment from three vendors.",
      "Includes an interactive panel on a trolley, a PTZ camera and a digital podium, configured to work together.",
    ],
    highlights: [
      "Interactive panel on a trolley",
      "PTZ camera",
      "Smart digital podium",
      "Configured as one system",
    ],
    categories: ["studio-setup"],
    price: 199999,
    compareAt: 239999,
    images: [
      { src: "/images/products/studio-kit.webp", alt: "iSLate studio kit, front view", fit: "cutout" },
      { src: "/images/products/studio-kit-left.webp", alt: "iSLate studio kit, angled from the left", fit: "cutout" },
      { src: "/images/products/studio-kit-right.webp", alt: "iSLate studio kit, angled from the right", fit: "cutout" },
    ],
    specs: [
      {
        title: "Included",
        rows: [
          { label: "Panel", value: "Interactive flat panel on a mobile trolley" },
          { label: "Camera", value: "PTZ conference camera" },
          { label: "Podium", value: "Smart digital podium" },
        ],
      },
    ],
    inStock: true,
    isNew: true,
  },
];

/* ------------------------------------------------------------------ */
/* Data access. Swap these for API or database calls when going live.  */
/* ------------------------------------------------------------------ */

export async function getCategories(): Promise<Category[]> {
  return categories;
}

export async function getProducts(): Promise<Product[]> {
  return products;
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  return products.find((p) => p.slug === slug);
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  return products
    .filter((p) => p.id !== product.id && p.categories.some((c) => product.categories.includes(c)))
    .slice(0, limit);
}
