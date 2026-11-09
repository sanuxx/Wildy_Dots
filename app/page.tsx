import Image from "next/image";
import Link from "next/link";
import Hero from "@/components/Hero";
import FactsBar from "@/components/FactsBar";
import Collections from "@/components/Collections";
import Destinations from "@/components/Destinations";
import HowToBuy from "@/components/HowToBuy";
import ShowroomCta from "@/components/ShowroomCta";
import { Parallax, Reveal } from "@/components/motion";
import { landing, logos, SITE } from "@/lib/data";

export default function Home() {
  return (
    <>
      <Hero />
      <FactsBar />
      <Collections />
      <Destinations />

      {/* giving back — a full-bleed photographic band, in the same language as the hero */}
      <section className="relative mt-10 flex min-h-[85svh] items-center overflow-hidden" aria-labelledby="giving-back">
        <Parallax className="absolute inset-0">
          <Image src={landing[3].src} alt="Two young elephants playing" fill sizes="100vw" className="object-cover" />
        </Parallax>
        <div className="absolute inset-0" style={{ background: "#a8794a", mixBlendMode: "color", opacity: 0.35 }} />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(90deg, rgba(14,16,15,0.96) 0%, rgba(14,16,15,0.8) 40%, rgba(14,16,15,0.15) 100%)" }}
        />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#0f1110] to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0f1110] to-transparent" />
        <div className="film-grain pointer-events-none absolute inset-0" aria-hidden />

        <div className="relative mx-auto w-full max-w-[1500px] px-6 py-24 md:px-12">
          <Reveal className="max-w-xl text-white">
            <div className="mb-8 flex w-fit rounded-2xl bg-cream p-3">
              <Image src={logos.mark.src} alt="Human Elephant Conflict Conservation Foundation" width={120} height={120} className="h-14 w-auto" />
            </div>
            <p className="eyebrow mb-5">Giving back</p>
            <h2 id="giving-back" className="font-display text-[clamp(2.4rem,5vw,4.6rem)]">
              5% of every purchase supports people and elephants
            </h2>
            <p className="mt-6 text-[1.02rem] leading-relaxed text-white/75">
              Kalawewa&apos;s tuskers and its villagers share a shrinking landscape. {SITE.pledge}, building homes, funding scholarships and supporting medical care for affected families.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/foundation" className="hm-btn hm-btn-primary">
                About Project Kalawewa <span aria-hidden>→</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <HowToBuy />
      <ShowroomCta />
    </>
  );
}
