// Static export has no image optimiser, so serve files as-is, prefixed with the GitHub Pages base path.
const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function imageLoader({ src }: { src: string }) {
  return src.startsWith("/") ? `${base}${src}` : src;
}
