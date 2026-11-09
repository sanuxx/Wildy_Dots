import manifest from "@/data/manifest.json";

export type Img = { src: string; w: number; h: number; blur?: string; title?: string };
export type Theme = { name: string; photos: Img[] };
export type Category = {
  slug: string;
  title: string;
  sub: string;
  photos: Img[];
  themes: Theme[];
};

export const landing = manifest.landing as Img[];
export const author = manifest.author as Img;
export const logos = manifest.logos as { mark: Img; full: Img };
export const projects = manifest.projects as { name: string; photos: Img[] }[];
export const categories = manifest.categories as Category[];
export const framingShots = manifest.framing as (Img & { color: "Black" | "Brown" })[];

export const allPhotos = (c: Category): Img[] =>
  c.themes.length ? c.themes.flatMap((t) => t.photos) : c.photos;

export const coverOf = (c: Category, i = 0): Img =>
  allPhotos(c)[0] ?? landing[(i + 1) % landing.length];

export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);

/** Soft pastel per chapter: [paper tint, deeper ink colour]. Used for the "print" cards and number chips. */
const PASTEL: Record<string, [string, string]> = {
  "majestic-wild": ["#f5dcc3", "#c4733a"],
  "shadows-in-the-darkness": ["#dcd7ec", "#6f5fae"],
  "beauties-of-the-skies": ["#d3e5ee", "#437f9c"],
  "growls-of-the-wilderness": ["#efd3c9", "#b65a40"],
  "innocence-of-the-grasslands": ["#dbe8d3", "#55883f"],
  "acrobats-of-the-canopies": ["#f1d6dc", "#b8566f"],
  "creepiest-among-bushes": ["#d2e7dc", "#36876a"],
  "ultimate-wild": ["#f0e4c3", "#a97d1f"],
  "natures-moments": ["#d7e0ea", "#506f98"],
  "wildy-dots-exclusive": ["#eed8e4", "#a14d79"],
  "rhythms-of-tranquility": ["#d3e6e4", "#37857f"],
};
export const pastelOf = (slug: string): [string, string] => PASTEL[slug] ?? ["#e3ded3", "#a8792c"];

/** One site-wide accent (sunlit yellow). The slug argument is kept so per-chapter colours can return later. */
const ACCENT: [string, string] = ["#a8792c", "#8a6322"];
export const colorsOf = (_slug?: string): [string, string] => ACCENT;
export const gradOf = (_slug?: string) => `linear-gradient(110deg, ${ACCENT[0]}, ${ACCENT[1]})`;

export const SITE = {
  name: "Wildy Dots",
  /** Set NEXT_PUBLIC_SITE_URL in production (e.g. https://www.wildydots.com) so canonical links, the sitemap and social previews are correct. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  tagline: "Connecting the dots of the unseen wilderness",
  phone: "+94 77 7121446",
  phoneHref: "tel:+94777121446",
  whatsapp: "94777121446",
  pledge: "5% of every purchase you make goes towards the Human Elephant Conflict Conservation Fund",
};

export const stats = [
  { value: 7, suffix: "", label: "Years of hard & memorable efforts" },
  { value: 5000, suffix: "+", label: "Photography hours" },
  { value: 20000, suffix: "+", label: "Clicks" },
];

export const frameSizes = [
  { size: "13 × 18", w: 13, h: 18, nonReflective: 8790, normal: 7490 },
  { size: "15 × 21", w: 15, h: 21, nonReflective: 10590, normal: 8890 },
  { size: "20 × 28", w: 20, h: 28, nonReflective: 16890, normal: 13890 },
  { size: "25 × 29", w: 25, h: 29, nonReflective: 19990, normal: 17390 },
  { size: "25 × 35", w: 25, h: 35, nonReflective: 24290, normal: 21590 },
];

export const nav = [
  { href: "/", label: "Home", short: "Home" },
  { href: "/about", label: "About Us", short: "About" },
  { href: "/gallery", label: "Photo Categories", short: "Gallery" },
  { href: "/framing", label: "Framing & Pricing", short: "Framing" },
  { href: "/showrooms", label: "Showrooms", short: "Showrooms" },
  { href: "/foundation", label: "Conservation Foundation", short: "Foundation" },
  { href: "/contact", label: "Contact Us", short: "Contact" },
];

export const rs = (n: number) => "Rs " + n.toLocaleString("en-LK") + ".00";
