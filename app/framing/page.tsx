import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import FramePicker from "@/components/FramePicker";
import { Reveal } from "@/components/motion";
import { frameSizes, rs, SITE } from "@/lib/data";

export const metadata: Metadata = {
  title: "Framing & Pricing",
  description:
    "Framed wildlife prints in black or brown frames with non-reflective or normal glass, in five sizes from 13 × 18 to 25 × 35 inch — from Rs 7,490. Custom sizes on pre-order.",
  alternates: { canonical: "/framing" },
};

const FAQ = [
  {
    q: "Which frame colours and glass are available?",
    a: "Frames come in black or brown. Each can be fitted with non-reflective glass or normal glass; non-reflective glass reduces glare and is priced slightly higher.",
  },
  {
    q: "Can I order a custom frame or size?",
    a: "Yes. Custom-made frames and sizes are available on a pre-order basis — contact us with the photograph and the size you have in mind.",
  },
  {
    q: "Does the price list apply to every photograph?",
    a: "The pricing excludes the photographs in “Wildy Dots Exclusive” and the “Rhythms of Tranquillity – Themes” collection. Please enquire for these.",
  },
  {
    q: "How do I order?",
    a: `Choose a photograph, then send an enquiry or call ${SITE.phone}. We will confirm availability and price and arrange your order.`,
  },
];

export default function Framing() {
  return (
    <>
      <PageHeader
        eyebrow="Framing & pricing"
        lines={["Framed and", "ready to hang"]}
        intro="Pick a photograph, try it on a wall at true scale, and see its price as you choose."
        bg={3}
      />
      <section className="mx-auto max-w-7xl px-6 py-20 md:px-12 md:py-24">
        <FramePicker />
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-16 md:px-12" aria-labelledby="price-list">
        <Reveal>
          <p className="eyebrow mb-5">Price list</p>
          <h2 id="price-list" className="font-display mb-8 text-[clamp(2rem,4vw,3.2rem)]">Framed print prices</h2>
        </Reveal>
        <Reveal>
          <div className="soft overflow-x-auto rounded-[2rem] p-3 md:p-5">
            <table className="w-full min-w-[30rem] text-left">
              <caption className="sr-only">Framed print prices in Sri Lankan rupees by size and glass type</caption>
              <thead>
                <tr className="border-b border-line text-[0.82rem] text-mute">
                  <th scope="col" className="px-4 py-4 font-medium">Frame size</th>
                  <th scope="col" className="px-4 py-4 text-right font-medium">Non-reflective glass</th>
                  <th scope="col" className="px-4 py-4 text-right font-medium">Normal glass</th>
                </tr>
              </thead>
              <tbody>
                {frameSizes.map((f) => (
                  <tr key={f.size} className="border-b border-line last:border-0">
                    <th scope="row" className="font-display px-4 py-5 text-left text-2xl">{f.size} inch</th>
                    <td className="px-4 py-5 text-right tabular-nums">{rs(f.nonReflective)}</td>
                    <td className="px-4 py-5 text-right tabular-nums">{rs(f.normal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
        <p className="mt-6 text-[0.9rem] leading-relaxed text-mute">
          Pricing excludes the photographs of “Wildy Dots Exclusive” and “Rhythms of Tranquillity – Themes”. Custom-made frames and sizes are available on a pre-order basis.
        </p>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-28 md:px-12" aria-labelledby="faq">
        <Reveal>
          <p className="eyebrow mb-5">Questions</p>
          <h2 id="faq" className="font-display mb-8 text-[clamp(2rem,4vw,3.2rem)]">Framing FAQ</h2>
        </Reveal>
        <div className="space-y-4">
          {FAQ.map((f) => (
            <Reveal key={f.q}>
              <details className="soft-sm group rounded-[1.5rem] px-6 py-5 open:soft-inset">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
                  {f.q}
                  <span aria-hidden className="text-accent transition-transform duration-300 group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 max-w-2xl text-[0.95rem] leading-relaxed text-mute">{f.a}</p>
              </details>
            </Reveal>
          ))}
        </div>
        <p className="mt-10 text-[0.95rem] text-mute">
          Still unsure? <Link href="/contact" className="link-underline pb-0.5 font-medium text-accent">Send us a message</Link> and we will help you choose.
        </p>
      </section>
    </>
  );
}
