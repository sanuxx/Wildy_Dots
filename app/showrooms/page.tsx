import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { Reveal } from "@/components/motion";
import { landing, SITE } from "@/lib/data";

export const metadata: Metadata = {
  title: "Showrooms",
  description: "Visit the Wildy Dots showroom at Marino Mall, Colombo 03 to see the prints and frames in person.",
  alternates: { canonical: "/showrooms" },
};

export default function Showrooms() {
  return (
    <>
      <PageHeader
        eyebrow="Showrooms"
        lines={["Visit our", "showroom"]}
        intro="See the prints at full scale, look at the frames, and talk to us about the right photograph for your wall."
        bg={5}
      />
      <section className="mx-auto max-w-7xl px-6 py-20 md:px-12 md:py-24">
        <div className="grid items-stretch gap-5 md:grid-cols-2">
          <Reveal>
            <div className="group relative h-full min-h-[460px] overflow-hidden rounded-[2rem]">
              <Image src={landing[1].src} alt="" fill sizes="50vw" className="object-cover transition-transform duration-[1600ms] group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="glass flex h-full flex-col justify-center rounded-[2rem] p-10 md:p-14">
              <p className="eyebrow mb-4">Colombo 03</p>
              <h2 className="font-display text-5xl leading-tight">Marino Mall</h2>
              <address className="mt-4 not-italic leading-relaxed text-mute">Wildy Dots Showroom, Marino Mall, Colombo 03, Sri Lanka</address>
              <p className="mt-5 leading-relaxed text-mute">
                The showroom is hosted at Marino Mall thanks to the generous support of Mr Damitha Ramanayaka and the directors of the Damro Group of Companies.
              </p>
              <a href={SITE.phoneHref} className="link-underline mt-7 self-start pb-0.5 text-xl font-medium">{SITE.phone}</a>
              <div className="mt-9 flex flex-wrap gap-3">
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Marino+Mall+Colombo+03"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-copper px-7 py-3.5 text-[0.92rem] font-semibold"
                >
                  Get directions
                </a>
                <Link href="/contact" className="soft-sm rounded-full px-7 py-3.5 text-[0.92rem] font-medium">Make an enquiry</Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
