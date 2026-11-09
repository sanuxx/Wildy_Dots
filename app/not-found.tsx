import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[70svh] max-w-3xl flex-col items-center justify-center px-6 pb-16 pt-32 text-center">
      <p className="eyebrow mb-6">Error 404</p>
      <h1 className="font-display text-[clamp(2.6rem,6vw,5rem)]">We couldn’t find that page</h1>
      <p className="mt-5 max-w-md text-mute">
        The link may be out of date, or the page may have moved. You can head back to the home page or browse the photograph collections.
      </p>
      <div className="mt-9 flex flex-wrap justify-center gap-3">
        <Link href="/" className="bg-copper px-8 py-3.5 text-[0.95rem] font-semibold">Back to home</Link>
        <Link href="/gallery" className="soft-sm rounded-full px-8 py-3.5 text-[0.95rem] font-medium">Browse the collections</Link>
      </div>
    </section>
  );
}
