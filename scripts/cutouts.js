// Generates transparent subject cut-outs of the landing photos (used to place the hero title BEHIND the animal).
// Usage: node scripts/cutouts.js   (run after build-assets.js)
//
// Runs as three separate processes because @imgly/background-removal-node bundles its own
// (older) sharp/libvips, which crashes if loaded in the same process as the project's sharp.
const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");

const dir = path.resolve(__dirname, "../public/img/landing");
const tmp = path.join(os.tmpdir(), "wildy-cutouts");
const files = () => fs.readdirSync(dir).filter((f) => /^\d+\.webp$/.test(f));
const stage = process.argv[2];

(async () => {
  if (!stage) {
    fs.mkdirSync(tmp, { recursive: true });
    for (const s of ["prep", "cut", "pack"]) {
      const r = spawnSync(process.execPath, [__filename, s], { stdio: "inherit" });
      if (r.status !== 0) process.exit(r.status || 1);
    }
    return;
  }
  if (stage === "prep") {
    const sharp = require("sharp");
    for (const f of files())
      await sharp(path.join(dir, f)).resize({ width: 1800 }).png().toFile(path.join(tmp, f.replace(".webp", ".png")));
  }
  if (stage === "cut") {
    const { removeBackground } = require("@imgly/background-removal-node");
    for (const f of files()) {
      const src = path.join(tmp, f.replace(".webp", ".png"));
      const blob = await removeBackground(new Blob([fs.readFileSync(src)], { type: "image/png" }), {
        model: "medium",
        output: { format: "image/png" },
      });
      fs.writeFileSync(path.join(tmp, f.replace(".webp", "-cut.png")), Buffer.from(await blob.arrayBuffer()));
      console.log("cut", f);
    }
  }
  if (stage === "pack") {
    const sharp = require("sharp");
    for (const f of files())
      await sharp(path.join(tmp, f.replace(".webp", "-cut.png")))
        .webp({ quality: 82, alphaQuality: 90 })
        .toFile(path.join(dir, f.replace(".webp", "-cut.webp")));
  }
})();
