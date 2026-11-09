"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { allPhotos, author, getCategory, landing, logos, type Img } from "@/lib/data";
import { MaskLines, Parallax, Reveal } from "./motion";

const EASE = [0.2, 0.7, 0.2, 1] as const;

/** A photograph from a collection, picked by position so it is stable between builds. */
const shot = (slug: string, f: number): Img | undefined => {
  const c = getCategory(slug);
  if (!c) return undefined;
  const p = allPhotos(c);
  return p[Math.floor(p.length * f) % p.length];
};

/* Every fact below comes from the author's own write-up. */
const CHAPTERS = [
  {
    when: "Childhood",
    title: "Close to nature",
    text: "Being very close to nature from childhood, wildlife became a lifelong hobby — one that has lasted more than two decades.",
    img: shot("natures-moments", 0.3),
  },
  {
    when: "25 years",
    title: "A career in banking",
    text: "A banker by profession: Seylan Bank PLC and Union Bank PLC in Sri Lanka, then Barclays Bank PLC, Middle East & Africa. After banking came an IT company in Singapore.",
    img: shot("ultimate-wild", 0.4),
  },
  {
    when: "2014",
    title: "Home, with a camera",
    text: "On returning to Sri Lanka, photography took the hobby a step further. Once or twice every month, alone, to the national parks of the island.",
    img: shot("beauties-of-the-skies", 0.55),
  },
  {
    when: "The last five years",
    title: "Wilpattu, a second home",
    text: "Wilpattu National Park in the North Central Province — more than five to six days there, every month.",
    img: shot("shadows-in-the-darkness", 0.2),
  },
  {
    when: "Six years, 20,000+ clicks",
    title: "Wildy Dots",
    text: "The dream made real: a gallery to share a glimpse of the enormous natural beauty of this extraordinary island with the rest of the world.",
    img: shot("majestic-wild", 0.65),
  },
];

const NUMBERS = [
  { v: "25", u: "years", l: "in banking, in Sri Lanka and abroad" },
  { v: "20+", u: "years", l: "of wildlife as a lifelong hobby" },
  { v: "5–6", u: "days", l: "in Wilpattu, every month" },
  { v: "20,000+", u: "clicks", l: "before choosing what to share" },
];

export default function AboutStory() {
  return (
    <>
      <PortraitHero />
      <TwoLives />
      <Journal />
      <Numbers />
      <SecondHome />
      <Pledge />
    </>
  );
}

/* ───────── 1 · portrait opening: the name sits behind the photographer ───────── */
function PortraitHero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const nameX = useTransform(scrollYProgress, [0, 1], ["0%", "-18%"]);
  const manY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <section ref={ref} className="relative h-[100svh] min-h-[680px] overflow-hidden bg-[#0c0e0d] text-white">
      <motion.div className="absolute inset-0" style={{ y: bgY }}>
        <Image src={landing[0].src} alt="" fill priority unoptimized={!process.env.NEXT_PUBLIC_BASE_PATH} sizes="100vw" className="object-cover opacity-40" />
        <div className="absolute inset-0" style={{ background: "#b08a52", mixBlendMode: "color", opacity: 0.35 }} />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-r from-[#0f1110] via-[#0f1110]/70 to-[#0f1110]/30" />
      <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-[#0f1110] to-transparent" />
      <div className="film-grain pointer-events-none absolute inset-0" aria-hidden />

      {/* giant name, behind the portrait */}
      <motion.p
        aria-hidden
        className="font-display pointer-events-none absolute left-0 top-[24%] select-none whitespace-nowrap pl-[4vw] text-[clamp(6rem,19vw,19rem)] !leading-[0.85] text-white/[0.09]"
        style={{ x: nameX }}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.4, ease: EASE }}
      >
        Adheesha
      </motion.p>

      {/* the photographer */}
      <motion.div
        className="absolute bottom-0 right-[2vw] h-[86%] w-[min(52vw,620px)]"
        style={{ y: manY }}
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.2, delay: 0.2, ease: EASE }}
      >
        <Image
          src={author.src}
          alt="Adheesha Salpitikorala with his camera and long lens"
          fill
          priority
          sizes="(min-width:768px) 52vw, 90vw"
          className="object-contain object-bottom drop-shadow-[0_40px_60px_rgba(0,0,0,0.6)]"
        />
      </motion.div>

      <div className="relative z-10 mx-auto flex h-full max-w-[1500px] items-end px-6 pb-20 md:px-12 md:pb-24">
        <div className="max-w-xl">
          <Reveal>
            <p className="eyebrow mb-5">About the photographer</p>
          </Reveal>
          <MaskLines as="h1" lines={["Adheesha", "Salpitikorala"]} className="font-display text-[clamp(2.8rem,6.4vw,6rem)] !leading-[0.98]" delay={0.3} />
          <Reveal delay={0.6}>
            <p className="mt-6 text-[1.08rem] leading-relaxed text-white/80">
              Banker, director, and — for more than twenty years — a man most at home in the wilderness. Founder of Wildy Dots.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#journal" className="hm-btn hm-btn-primary">Read the story ↓</a>
              <Link href="/gallery" className="hm-btn hm-btn-ghost">See the photographs</Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ───────── 2 · two lives ───────── */
function TwoLives() {
  return (
    <section className="mx-auto max-w-[1500px] px-6 py-24 md:px-12 md:py-32" aria-labelledby="two-lives">
      <Reveal>
        <p className="eyebrow mb-5">In his own words</p>
        <h2 id="two-lives" className="font-display max-w-4xl text-[clamp(2rem,4.4vw,3.8rem)]">
          “I founded Wildy Dots with the intention of exhibiting the true beauty of the pearl of the Indian Ocean.”
        </h2>
      </Reveal>

      <div className="mt-16 grid gap-5 md:grid-cols-2">
        <Reveal>
          <div className="soft h-full rounded-[2rem] p-8 md:p-10">
            <p className="text-[0.75rem] font-semibold uppercase tracking-[0.26em] text-mute">By profession</p>
            <ul className="mt-6 space-y-4 text-[1.02rem]">
              <li><span className="font-semibold">25 years in banking</span><span className="text-mute"> — Seylan Bank PLC, Union Bank PLC, and Barclays Bank PLC, Middle East &amp; Africa.</span></li>
              <li><span className="font-semibold">Founder</span><span className="text-mute"> of an IT company in Singapore.</span></li>
              <li><span className="font-semibold">Managing Director</span><span className="text-mute">, Serendib International Cricket Academy.</span></li>
              <li><span className="font-semibold">Commercial Director</span><span className="text-mute">, Earrow Pvt Ltd, a software provider.</span></li>
            </ul>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="relative h-full min-h-[340px] overflow-hidden rounded-[2rem] text-white">
            <Image src={landing[2].src} alt="" fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover" />
            <div className="absolute inset-0" style={{ background: "#b8924e", mixBlendMode: "color", opacity: 0.4 }} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
            <div className="relative flex h-full flex-col justify-end p-8 md:p-10">
              <p className="text-[0.75rem] font-semibold uppercase tracking-[0.26em] text-white/70">By heart</p>
              <p className="font-display mt-4 text-[clamp(1.6rem,2.6vw,2.3rem)]">
                Alone, once or twice a month, in the national parks of Sri Lanka — enjoying the wilderness and capturing its unique moments.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ───────── 3 · field journal: a timeline that draws itself ───────── */
function Journal() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 60%"] });
  const line = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <section ref={ref} id="journal" className="relative mx-auto max-w-[1300px] scroll-mt-24 px-6 py-16 md:px-12 md:py-24" aria-labelledby="journal-title">
      <Reveal>
        <p className="eyebrow mb-5">Field journal</p>
        <h2 id="journal-title" className="font-display text-[clamp(2.4rem,5vw,4.6rem)]">The road to Wildy Dots</h2>
      </Reveal>

      <div className="relative mt-16">
        {/* the line */}
        <div className="absolute bottom-0 left-[15px] top-0 w-px bg-white/10 md:left-1/2" aria-hidden />
        <motion.div className="absolute left-[15px] top-0 w-px origin-top bg-[#c6ebc4] md:left-1/2" style={{ scaleY: line, height: "100%" }} aria-hidden />

        <ol className="space-y-20 md:space-y-28">
          {CHAPTERS.map((c, i) => {
            const flip = i % 2 === 1;
            return (
              <li key={c.title} className="relative grid gap-8 pl-12 md:grid-cols-2 md:gap-20 md:pl-0">
                {/* node */}
                <span className="absolute left-[9px] top-2 h-[13px] w-[13px] rounded-full border-2 border-[#c6ebc4] bg-[#0f1110] md:left-1/2 md:-ml-[6.5px]" aria-hidden />

                <Reveal className={flip ? "md:order-2" : ""}>
                  <div className={flip ? "md:pl-4" : "md:pr-4 md:text-right"}>
                    <p className="text-[0.75rem] font-semibold uppercase tracking-[0.26em] text-[#c6ebc4]">{c.when}</p>
                    <h3 className="font-display mt-3 text-[clamp(1.8rem,3vw,2.6rem)]">{c.title}</h3>
                    <p className={`mt-4 max-w-md text-[1.02rem] leading-relaxed text-mute ${flip ? "" : "md:ml-auto"}`}>{c.text}</p>
                  </div>
                </Reveal>

                {c.img && (
                  <Reveal delay={0.1} className={flip ? "md:order-1" : ""}>
                    <motion.div
                      className="relative aspect-[4/3] overflow-hidden rounded-2xl ring-1 ring-white/10"
                      initial={{ rotate: flip ? -2.5 : 2.5 }}
                      whileInView={{ rotate: flip ? -1 : 1 }}
                      whileHover={{ rotate: 0, scale: 1.02 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, ease: EASE }}
                    >
                      <Image src={c.img.src} alt="" fill sizes="(min-width:768px) 40vw, 90vw" placeholder={c.img.blur ? "blur" : "empty"} blurDataURL={c.img.blur} className="object-cover" />
                    </motion.div>
                  </Reveal>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

/* ───────── 4 · numbers ───────── */
function Numbers() {
  return (
    <section className="mx-auto max-w-[1500px] px-6 py-16 md:px-12 md:py-24" aria-label="In numbers">
      <dl className="grid grid-cols-2 border-y border-line md:grid-cols-4">
        {NUMBERS.map((n, i) => (
          <Reveal key={n.l} delay={i * 0.06}>
            <div className={`h-full py-10 pr-6 ${i > 0 ? "md:border-l md:border-line md:pl-8" : ""} ${i % 2 === 1 ? "border-l border-line pl-6" : ""} ${i > 1 ? "border-t border-line md:border-t-0" : ""}`}>
              <dt className="font-display text-[clamp(2.2rem,3.6vw,3.4rem)] leading-none">
                {n.v}
                <span className="ml-2 inline-block text-[0.4em] font-medium text-mute">{n.u}</span>
              </dt>
              <dd className="mt-3 max-w-[14rem] text-[0.92rem] leading-snug text-mute">{n.l}</dd>
            </div>
          </Reveal>
        ))}
      </dl>
    </section>
  );
}

/* ───────── 5 · Wilpattu ───────── */
function SecondHome() {
  return (
    <section className="relative flex min-h-[80svh] items-center overflow-hidden text-white">
      <Parallax className="absolute inset-0">
        <Image src={landing[4].src} alt="A leopard moving through the grass" fill sizes="100vw" className="object-cover" />
      </Parallax>
      <div className="absolute inset-0" style={{ background: "#b8893a", mixBlendMode: "color", opacity: 0.35 }} />
      <div className="absolute inset-0 bg-black/45" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#0f1110] to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0f1110] to-transparent" />
      <div className="film-grain pointer-events-none absolute inset-0" aria-hidden />
      <div className="relative mx-auto max-w-5xl px-6 text-center">
        <p className="eyebrow mb-6">Wilpattu National Park</p>
        <MaskLines lines={["“Wilpattu has been", "my second home.”"]} className="font-display text-[clamp(2.6rem,7vw,6.4rem)] !leading-[1]" />
      </div>
    </section>
  );
}

/* ───────── 6 · pledge, thanks, next step ───────── */
function Pledge() {
  return (
    <section className="mx-auto max-w-[1500px] px-6 py-24 md:px-12" aria-labelledby="pledge">
      <div className="grid gap-5 md:grid-cols-[1.3fr_1fr]">
        <Reveal>
          <div className="soft flex h-full flex-col gap-6 rounded-[2rem] p-8 md:flex-row md:items-center md:p-10">
            <div className="w-fit shrink-0 rounded-2xl bg-cream p-3">
              <Image src={logos.mark.src} alt="Human Elephant Conflict Conservation Foundation" width={96} height={96} className="h-16 w-auto" />
            </div>
            <div>
              <h2 id="pledge" className="font-display text-[clamp(1.6rem,2.6vw,2.3rem)]">5% of every photo sale</h2>
              <p className="mt-3 text-mute">
                goes to the Human Elephant Conflict Conservation Fund, to strengthen the people affected by elephant confrontations in Sri Lanka.
              </p>
              <Link href="/foundation" className="link-underline mt-4 inline-block pb-0.5 font-semibold text-accent">About Project Kalawewa →</Link>
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="soft flex h-full flex-col justify-between rounded-[2rem] p-8 md:p-10">
            <p className="text-[0.95rem] leading-relaxed text-mute">
              Special thanks to Mr Damitha Ramanayaka and the directors of the Damro Group of Companies for the showroom space at Marino Mall, Colombo 03.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/gallery" className="hm-btn hm-btn-primary">Browse the collections</Link>
              <Link href="/showrooms" className="hm-btn hm-btn-ghost">Visit the showroom</Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
