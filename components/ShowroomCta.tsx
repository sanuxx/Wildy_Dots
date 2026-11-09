import Link from "next/link";
import Image from "next/image";
import { Reveal } from "./motion";
import { landing, SITE } from "@/lib/data";

/** Closing call to action: see the prints in person. */
export default function ShowroomCta() {
  return (
    <section className="px-3 pb-20 md:px-6 md:pb-28" aria-labelledby="visit">
      <Reveal>
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#171a18] md:rounded-[3rem]">
          <Image src={landing[1].src} alt="" fill sizes="100vw" className="object-cover opacity-45" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/20" />
          <div className="relative grid gap-8 p-8 md:grid-cols-[1.4fr_1fr] md:items-end md:p-14">
            <div>
              <p className="eyebrow mb-5">Showroom</p>
              <h2 id="visit" className="font-display text-[clamp(2.2rem,5vw,4.2rem)] text-cream">
                See the prints in person
              </h2>
              <p className="mt-4 max-w-lg text-cream/85">
                Wildy Dots Showroom, Marino Mall, Colombo 03 — hosted with the generous support of the Damro Group of Companies.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row md:flex-col md:items-stretch">
              <a href={SITE.phoneHref} className="bg-copper px-7 py-4 text-center text-[0.95rem] font-semibold">
                Call {SITE.phone}
              </a>
              <Link href="/showrooms" className="rounded-full bg-white/15 px-7 py-4 text-center text-[0.95rem] font-medium text-cream backdrop-blur-md transition-colors hover:bg-white/25">
                Showroom details
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
