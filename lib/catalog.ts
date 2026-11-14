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
      { label: "Resolution", value: "3840 x 2160 (UHD)" },
      { label: "Aspect ratio", value: "16:9" },
      { label: "Contrast ratio", value: "1200:1 / 4000:1" },
      { label: "Colours", value: "1.07 billion" },
      { label: "Brightness", value: "450 cd/m²" },
      { label: "Viewing angle", value: "178°" },
      { label: "Screen surface", value: "4 mm anti-glare glass" },
      { label: "Eye care", value: "Yes (TUV Flicker Free, TUV Low Blue Light)" },
    ],
  },
  {
    title: "Touch and audio",
    rows: [
      { label: "Touch technology", value: "IR touch" },
      { label: "Audio", value: "2.2 channel HD audio, 20 W dual-channel speaker" },
    ],
  },
  {
    title: "Built-in system",
    rows: [
      { label: "Android version", value: "Android 16" },
      { label: "Certification", value: "Google EDLA certified" },
      { label: "RAM", value: "8 GB" },
      { label: "ROM", value: "128 GB" },
      { label: "CPU", value: "Octa-core 64-bit processor (quad-core Cortex-A53 + quad-core Cortex-A72, up to 2.2 GHz)" },
      { label: "GPU", value: "Mali-G52 MC3 @ 1 GHz" },
    ],
  },
  {
    title: "Connectivity",
    rows: [
      { label: "Network", value: "WiFi 6 + BT 5.4, 1000 Mbps network adapter" },
      { label: "Hotspot", value: "Yes" },
      { label: "Type-C", value: "Up to 65 W charging" },
      { label: "Camera and mic", value: "48 MP camera and 8 array mic (optional)" },
    ],
  },
];

const products: Product[] = [
  {
    id: "3921",
    slug: "islate-interactive-flat-panel",
    name: "iSLate Interactive Flat Panel",
    tagline: "India's first brand to launch an Android 16 and octa-core interactive flat panel.",
    summary:
      "Intelligent touchscreen technology, an octa-core processor and Android 16 in one EDLA certified panel, built to enhance the immersive learning journey.",
    description: [
      "Harness the power of advanced technology to enhance educational experiences, transform teaching methodologies and enable the next generation of smart, connected classrooms.",
      "Powered by intelligent touchscreen technology, the iSLate enables effortless writing, annotation and note-taking with precision using a stylus, so no valuable insight gets lost. Its powerful processing keeps every lesson smooth and lag-free, and the versatile Type-C port connects webcams, microphones, speakers, USB flash drives and wired networks with a single cable, with up to 65 W of charging.",
    ],
    highlights: [
      "Android 16 with octa-core processor, Google EDLA certified",
      "4K UHD display, 450 cd/m² brightness, 178° viewing angle",
      "Intelligent IR touch with stylus writing and annotation",
      "8 GB RAM and 128 GB ROM",
      "Gigabit (1000 Mbps) network adapter, WiFi 6 and Bluetooth 5.4",
      "Type-C port with up to 65 W charging",
      "Compatible with Windows, Mac, Linux and Chrome OS",
      "TUV Flicker Free and Low Blue Light eye protection",
      "Antibacterial screen surface certified by SGS, SIAA ISO22196 (KOHKIN) and TUV",
      "High-power dual-channel speaker for the whole classroom",
      "Centralised device management for IT administrators",
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
      "4K display with IR touch",
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
          { label: "Resolution", value: "3840 x 2160 (UHD)" },
          { label: "Touch technology", value: "IR touch" },
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
      "4K display with IR touch",
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
          { label: "Touch technology", value: "IR touch" },
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
