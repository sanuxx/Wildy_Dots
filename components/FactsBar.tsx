import { allPhotos, categories } from "@/lib/data";
import { Reveal } from "./motion";

/** A calm strip of verifiable facts under the hero. */
export default function FactsBar() {
  const total = categories.reduce((n, c) => n + allPhotos(c).length, 0);
  const facts = [
    { v: "7 years", l: "photographing Sri Lanka’s national parks" },
    { v: "20,000+", l: "frames captured; the finest are offered as prints" },
    { v: total.toLocaleString("en-US"), l: `photographs online across ${categories.length} collections` },
    { v: "5%", l: "of every sale supports the Human Elephant Conflict Conservation Fund" },
  ];
  return (
    <section className="mx-auto max-w-[1500px] px-6 md:px-12" aria-label="At a glance">
      <Reveal>
        <dl className="grid grid-cols-2 border-y border-line md:grid-cols-4">
          {facts.map((f, i) => (
            <div
              key={f.v}
              className={`py-8 pr-6 md:py-10 ${i > 0 ? "md:border-l md:border-line md:pl-8" : ""} ${i % 2 === 1 ? "border-l border-line pl-6" : ""} ${i > 1 ? "border-t border-line md:border-t-0" : ""}`}
            >
              <dt className="font-display text-[clamp(2rem,3.4vw,3.1rem)] leading-none">{f.v}</dt>
              <dd className="mt-3 max-w-[15rem] text-[0.9rem] leading-snug text-mute">{f.l}</dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </section>
  );
}
