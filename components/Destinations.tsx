import Link from "next/link";
import { Reveal } from "./motion";
import FieldMap from "./FieldMap";

/** The field map: a live map of Sri Lanka with the places where the photographs are made. */
export default function Destinations() {
  return (
    <section className="px-3 py-20 md:px-6 md:py-28" aria-labelledby="field-map">
      <div className="mx-auto max-w-7xl px-3 md:px-6">
        <div className="mb-12 grid gap-6 md:grid-cols-[1.3fr_1fr] md:items-end">
          <Reveal>
            <p className="eyebrow mb-5">Field map</p>
            <h2 id="field-map" className="font-display text-[clamp(2.2rem,5vw,4.2rem)]">
              Where the photographs are made
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="max-w-md text-mute">
              Seven years in the parks and tank beds of Sri Lanka. Select a place to see it on the map, or{" "}
              <Link href="/gallery" className="link-underline pb-0.5 font-medium text-accent">browse the gallery</Link>.
            </p>
          </Reveal>
        </div>
        <Reveal>
          <FieldMap />
        </Reveal>
      </div>
    </section>
  );
}
