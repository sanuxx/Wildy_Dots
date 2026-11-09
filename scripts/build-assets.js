// Converts the raw "Wildy Dots" asset folder into optimised web assets + a manifest.
// Usage: node scripts/build-assets.js
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const SRC = path.resolve(__dirname, "../../Wildy Dots");
const OUT = path.resolve(__dirname, "../public/img");
const DATA = path.resolve(__dirname, "../data");

const CATS = [
  { slug: "majestic-wild", dir: "Majestic Wild", title: "Majestic Wild", sub: "Elephants" },
  { slug: "shadows-in-the-darkness", dir: "Shaows in the darkness - Lopard", title: "Shadows in the Darkness", sub: "Leopards" },
  { slug: "beauties-of-the-skies", dir: "Beauties of the Skies - Birds", title: "Beauties of the Skies", sub: "Birds" },
  { slug: "growls-of-the-wilderness", dir: "Growls in the Wilderness", title: "Growls of the Wilderness", sub: "Bears" },
  { slug: "innocence-of-the-grasslands", dir: "Innosence of the Grasslands - Deer", title: "Innocence of the Grasslands", sub: "Deer" },
  { slug: "acrobats-of-the-canopies", dir: "Acrobats of the Canapies - Monkeys", title: "Acrobats of the Canopies", sub: "Monkeys" },
  { slug: "creepiest-among-bushes", dir: "Creepiest among bushes - Reptiles", title: "Creepiest among Bushes", sub: "Reptiles" },
  { slug: "ultimate-wild", dir: "Ultimat Wild", title: "Ultimate Wild", sub: "The finest of the wild" },
  { slug: "natures-moments", dir: "Natures moments", title: "Natures' Moments", sub: "Fleeting stories" },
  { slug: "wildy-dots-exclusive", dir: null, title: "Wildy Dots Exclusive", sub: "Limited editions" },
  { slug: "rhythms-of-tranquility", dir: "Rythems of Tranquility", title: "Rhythms of Tranquility", sub: "Themes" },
];

const THEME_TITLES = {
  "Bears Love": "Bears Love",
  "Beauties of the skys": "Beauties of the Skies",
  "Floating Beauties": "Floating Beauties",
  "Little Fishing Cat": "Little Fishing Cat",
  "Lovers of the Paraise": "Lovers of the Paradise",
  "Mighty Charging": "Mighty Charging",
  "Morning Yourn": "Morning Yawn",
  "My Fair Lady": "My Fair Lady",
  "Romance in the Canapy": "Romance in the Canopy",
};

const natural = (a, b) => a.localeCompare(b, undefined, { numeric: true });
const ls = (d) => fs.readdirSync(d, { withFileTypes: true });
const imgs = (d) =>
  ls(d).filter((e) => e.isFile() && /\.(jpe?g|png)$/i.test(e.name)).map((e) => e.name).sort(natural);

async function conv(file, outFile, opts = {}) {
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  let img = sharp(file, { limitInputPixels: false }).rotate();
  if (opts.width || opts.height)
    img = img.resize({ width: opts.width, height: opts.height, fit: "inside", withoutEnlargement: true });
  const info = await img.webp({ quality: opts.q ?? 80 }).toFile(outFile);
  const blur = opts.blur
    ? "data:image/webp;base64," +
      (await sharp(outFile).resize(16).webp({ quality: 40 }).toBuffer()).toString("base64")
    : undefined;
  return { w: info.width, h: info.height, blur };
}
const rel = (p) => "/img/" + path.relative(OUT, p).replace(/\\/g, "/");

(async () => {
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(DATA, { recursive: true });
  const manifest = {};

  // Landing
  const landingDir = path.join(SRC, "Landing Page Photos");
  const landing = [];
  let n = 1;
  for (const f of imgs(landingDir)) {
    if (f === "_DSC1535 V 1.jpg") continue; // near duplicate of _DSC1535
    const o = path.join(OUT, "landing", `${n++}.webp`);
    const r = await conv(path.join(landingDir, f), o, { width: 2400, q: 78, blur: true });
    landing.push({ src: rel(o), ...r });
  }
  manifest.landing = landing;

  // Author cut-out + foundation logos
  const author = path.join(OUT, "author", "cutout.webp");
  manifest.author = { src: rel(author), ...(await conv(path.join(SRC, "Personal Photos/PNG 1.png"), author, { height: 1800, q: 85 })) };
  const lg = (name, i, w) => conv(path.join(SRC, `Human Elephant Conflict Conservation Foundation Logs/logo ${i}.png`), path.join(OUT, "foundation", name), { width: w, q: 90 });
  manifest.logos = {
    mark: { src: "/img/foundation/mark.webp", ...(await lg("mark.webp", 5, 700)) },
    full: { src: "/img/foundation/full.webp", ...(await lg("full.webp", 6, 1000)) },
  };

  // Foundation project photos
  const pDir = path.join(SRC, "Human Elephant Conflict Conservation Foundation Logs/Project Photos");
  const projects = [];
  for (const e of ls(pDir).filter((e) => e.isDirectory()).sort((a, b) => natural(a.name, b.name))) {
    const photos = [];
    let i = 1;
    for (const f of imgs(path.join(pDir, e.name))) {
      const slug = e.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const o = path.join(OUT, "foundation", slug, `${i++}.webp`);
      photos.push({ src: rel(o), ...(await conv(path.join(pDir, e.name, f), o, { width: 1400, q: 76, blur: true })) });
    }
    projects.push({ name: e.name, photos });
  }
  manifest.projects = projects;

  // Gallery
  const gRoot = path.join(SRC, "Photos with the watermark");
  const cats = [];
  for (const c of CATS) {
    const cat = { slug: c.slug, title: c.title, sub: c.sub, photos: [], themes: [] };
    if (c.dir) {
      const dir = path.join(gRoot, c.dir);
      const add = async (files, base, target, label, srcSub = "") => {
        let i = 1;
        for (const f of files) {
          const o = path.join(OUT, "gallery", c.slug, base, `${i}.webp`);
          const r = await conv(path.join(dir, srcSub, f), o, { width: 900, q: 78, blur: true });
          target.push({ src: rel(o), ...r, title: `${label} No. ${String(i).padStart(2, "0")}` });
          i++;
        }
      };
      if (c.slug === "rhythms-of-tranquility") {
        for (const t of ls(dir).filter((e) => e.isDirectory()).sort((a, b) => natural(a.name, b.name))) {
          const theme = { name: THEME_TITLES[t.name] || t.name, photos: [] };
          await add(imgs(path.join(dir, t.name)), t.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"), theme.photos, theme.name, t.name);
          cat.themes.push(theme);
        }
      } else {
        await add(imgs(dir), "", cat.photos, c.title);
      }
    }
    cats.push(cat);
    console.log(c.title, cat.photos.length || cat.themes.reduce((a, t) => a + t.photos.length, 0));
  }
  manifest.categories = cats;

  // Framing mock-ups
  manifest.framing = [];
  const fDir = path.join(SRC, "Framing &Pricing");
  for (const f of imgs(fDir)) {
    const color = /^black/i.test(f) ? "Black" : "Brown";
    const o = path.join(OUT, "framing", f.toLowerCase().replace(/[^a-z0-9.]+/g, "-").replace(/\.jpg$/, ".webp"));
    manifest.framing.push({ src: rel(o), color, ...(await conv(path.join(fDir, f), o, { width: 1200, q: 82, blur: true })) });
  }

  fs.writeFileSync(path.join(DATA, "manifest.json"), JSON.stringify(manifest));
  console.log("done");
})();
