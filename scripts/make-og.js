// Builds the 1200×630 social-sharing image (public/og.jpg) from a landing photograph.
// Usage: node scripts/make-og.js   (run after build-assets.js)
const sharp = require("sharp");
const path = require("path");

const src = path.resolve(__dirname, "../public/img/landing/5.webp");
const out = path.resolve(__dirname, "../public/og.jpg");

const overlay = Buffer.from(`
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0.35" stop-color="#0b1410" stop-opacity="0"/>
      <stop offset="1" stop-color="#0b1410" stop-opacity="0.88"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <text x="64" y="500" font-family="Georgia, 'Times New Roman', serif" font-style="italic" font-size="96" fill="#f6f1e7">Wildy Dots</text>
  <circle cx="478" cy="494" r="9" fill="#f6cfa6"/>
  <text x="68" y="558" font-family="Arial, Helvetica, sans-serif" font-size="30" fill="#f6f1e7" opacity="0.92">Fine-art wildlife photography · Sri Lanka</text>
</svg>`);

sharp(src)
  .resize(1200, 630, { fit: "cover", position: "centre" })
  .composite([{ input: overlay }])
  .jpeg({ quality: 86 })
  .toFile(out)
  .then(() => console.log("wrote", out));
