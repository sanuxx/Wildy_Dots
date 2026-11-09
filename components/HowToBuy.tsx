import Link from "next/link";
import { Reveal } from "./motion";
import { SITE } from "@/lib/data";

const STEPS = [
  {
    n: "01",
    t: "Choose a photograph",
    d: "Browse the eleven collections and note the title of the print you would like to bring home.",
    href: "/gallery",
    cta: "Browse collections",
  },
  {
    n: "02",
    t: "Select size and frame",
    d: "Five standard sizes in a black or brown frame, with non-reflective or normal glass. Custom sizes are available on pre-order.",
    href: "/framing",
    cta: "Framing & pricing",
  },
  {
    n: "03",
    t: "Enquire to order",
    d: "Send us a message or call. We confirm availability and price, then arrange your order.",
    href: "/contact",
    cta: "Make an enquiry",
  },
];

export default function HowToBuy() {
  return (
    <section className="px-3 py-20 md:px-6 md:py-28" aria-labelledby="how-to-buy">
      <div className="mx-auto max-w-7xl px-3 md:px-6">
        <div className="mb-12 max-w-2xl">
          <Reveal>
            <p className="eyebrow mb-5">Buying a print</p>
            <h2 id="how-to-buy" className="font-display text-[clamp(2.2rem,5vw,4.2rem)]">
              Three simple steps
            </h2>
            <p className="mt-5 text-mute">
              Every photograph is available as a framed print. Prices are shown in Sri Lankan rupees; call {SITE.phone} if you would like to talk it through.
            </p>
          </Reveal>
        </div>
        <ol className="grid gap-6 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <li key={s.n} className="h-full">
              <Reveal delay={i * 0.08} className="h-full">
                <div className="soft-card flex h-full flex-col rounded-[2rem] p-8">
                  <span className="soft-inset flex h-11 w-11 items-center justify-center rounded-full text-[0.85rem] font-semibold tabular-nums text-accent">{s.n}</span>
                  <h3 className="font-display mt-7 text-[1.7rem]">{s.t}</h3>
                  <p className="mt-3 flex-1 text-[0.95rem] leading-relaxed text-mute">{s.d}</p>
                  <Link href={s.href} className="link-underline mt-7 self-start pb-0.5 text-[0.92rem] font-semibold text-accent">
                    {s.cta} →
                  </Link>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
