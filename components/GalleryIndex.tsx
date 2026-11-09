"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { allPhotos, categories, coverOf, type Img } from "@/lib/data";
import { Reveal } from "./motion";

const EASE = [0.2, 0.7, 0.2, 1] as const;
const pad = (n: number) => String(n).padStart(2, "0");

const ITEMS = categories.map((c, i) => {
  const photos = allPhotos(c);
  const pick = (f: number) => photos[Math.floor(photos.length * f) % photos.length];
  return {
    c,
    cover: coverOf(c, i),
    count: photos.length,
    stack: photos.length ? [pick(0.15), pick(0.45), pick(0.75)] : [],
    wall: photos.length ? [pick(0.05), pick(0.38), pick(0.7)] : [],
  };
});
const TOTAL = ITEMS.reduce((n, x) => n + x.count, 0);

/** The fanned preview cards: position offset, height offset and tilt for each. */
const FAN = [
  { x: -150, y: 34, r: -9, z: 1 },
  { x: 0, y: -16, r: 0, z: 3 },
  { x: 150, y: 40, r: 8, z: 2 },
];

export default function GalleryIndex() {
  return (
    <>
      <Index />
      <Wall />
      <Closing />
    </>
  );
}

/* ───────── 1 · hover-to-preview index ───────── */
function Index() {
  const [a, setA] = useState(0);
  const it = ITEMS[a];

  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-[#0c0e0d] text-white">
      {/* background follows the highlighted collection */}
      <AnimatePresence initial={false}>
        <motion.div key={a} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.9 }}>
          <motion.div className="absolute inset-0" initial={{ scale: 1.12 }} animate={{ scale: 1.04 }} transition={{ duration: 6, ease: "easeOut" }}>
            <Image
              src={it.cover.src}
              alt=""
              fill
              priority={a === 0}
              sizes="100vw"
              placeholder={it.cover.blur ? "blur" : "empty"}
              blurDataURL={it.cover.blur}
              className="object-cover blur-[2px]"
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(90deg, rgba(14,16,15,0.96) 0%, rgba(14,16,15,0.8) 46%, rgba(14,16,15,0.5) 100%)" }}
      />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/60 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0f1110] to-transparent" />
      <div className="film-grain pointer-events-none absolute inset-0" aria-hidden />

      <div className="relative z-10 mx-auto grid max-w-[1500px] gap-12 px-6 pb-20 pt-32 md:px-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-start">
        <div>
          <Reveal>
            <p className="eyebrow mb-5">Photo categories</p>
            <h1 className="font-display text-[clamp(2.4rem,4.6vw,4rem)]">The collections</h1>
            <p className="mt-3 text-white/65">
              {ITEMS.length} collections · {TOTAL.toLocaleString("en-US")} photographs. Point at a title to preview it.
            </p>
          </Reveal>

          <ul className="mt-10 border-t border-white/10">
            {ITEMS.map((x, i) => {
              const on = i === a;
              return (
                <li key={x.c.slug} className="border-b border-white/10">
                  <Link
                    href={`/gallery/${x.c.slug}`}
                    onMouseEnter={() => setA(i)}
                    onFocus={() => setA(i)}
                    className="group flex items-baseline gap-4 py-2.5 md:gap-6 md:py-3"
                  >
                    <span className={`w-7 shrink-0 text-[0.75rem] font-semibold tabular-nums transition-colors ${on ? "text-[#c6ebc4]" : "text-white/30"}`}>
                      {pad(i + 1)}
                    </span>
                    <span
                      className={`font-display flex-1 text-[clamp(1.3rem,2.2vw,2rem)] !leading-[1.12] transition-all duration-500 ${
                        on ? "translate-x-2 text-white" : "text-white/40 group-hover:text-white/70"
                      }`}
                    >
                      {x.c.title}
                    </span>
                    <span className={`hidden text-[0.85rem] transition-colors sm:block ${on ? "text-white/85" : "text-white/30"}`}>
                      {x.count ? `${x.count} photographs` : "By appointment"}
                    </span>
                    <span aria-hidden className={`hidden transition-all duration-500 md:block ${on ? "translate-x-0 text-white opacity-100" : "-translate-x-2 opacity-0"}`}>
                      →
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* fanned preview of the highlighted collection */}
        <div className="relative hidden h-[560px] lg:sticky lg:top-24 lg:mt-16 lg:block" aria-hidden>
          <AnimatePresence mode="wait">
            <motion.div key={a} className="absolute inset-0" exit={{ opacity: 0, transition: { duration: 0.2 } }}>
              {it.stack.length ? (
                it.stack.map((p, k) => (
                  <motion.div
                    key={k}
                    className="absolute h-[310px] w-[232px] overflow-hidden rounded-2xl shadow-[0_40px_80px_-30px_rgba(0,0,0,0.95)] ring-1 ring-white/15"
                    style={{ left: `calc(50% - 116px + ${FAN[k].x}px)`, top: `calc(44% - 155px + ${FAN[k].y}px)`, zIndex: FAN[k].z }}
                    initial={{ opacity: 0, y: 50, rotate: 0, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, rotate: FAN[k].r, scale: 1 }}
                    transition={{ duration: 0.7, delay: k * 0.08, ease: EASE }}
                  >
                    <Image src={p.src} alt="" fill sizes="232px" placeholder={p.blur ? "blur" : "empty"} blurDataURL={p.blur} className="object-cover" />
                  </motion.div>
                ))
              ) : (
                <motion.div
                  className="absolute left-1/2 top-[44%] flex h-[310px] w-[232px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl border border-white/15 bg-white/5 p-6 text-center text-white/70 backdrop-blur"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  A private collection, shown by appointment.
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="absolute inset-x-6 bottom-0 flex items-end justify-between gap-6">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={a} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-[#c6ebc4]">
                  {pad(a + 1)} · {it.c.sub}
                </p>
                <p className="font-display mt-2 text-[1.8rem]">{it.c.title}</p>
              </motion.div>
            </AnimatePresence>
            <Link href={`/gallery/${it.c.slug}`} className="hm-btn hm-btn-primary shrink-0" tabIndex={-1}>
              Open <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────── 2 · wall of frames, columns drifting at different speeds ───────── */
function Wall() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y0 = useTransform(scrollYProgress, [0, 1], [60, -140]);
  const y1 = useTransform(scrollYProgress, [0, 1], [-40, 120]);
  const y2 = useTransform(scrollYProgress, [0, 1], [110, -190]);
  const y3 = useTransform(scrollYProgress, [0, 1], [-60, 90]);
  const ys = [y0, y1, y2, y3];

  const cols: { p: Img; x: (typeof ITEMS)[number] }[][] = [[], [], [], []];
  let n = 0;
  ITEMS.forEach((x) =>
    x.wall.forEach((p) => {
      cols[n % 4].push({ p, x });
      n++;
    }),
  );

  return (
    <section ref={ref} className="relative overflow-hidden py-24 md:py-32" aria-labelledby="wall">
      <div className="mx-auto max-w-[1500px] px-6 md:px-12">
        <Reveal>
          <p className="eyebrow mb-5">From every collection</p>
          <h2 id="wall" className="font-display text-[clamp(2.4rem,5vw,4.6rem)]">A wall of frames</h2>
          <p className="mt-5 max-w-xl text-mute">A sample from all of the collections. Select any photograph to open the collection it belongs to.</p>
        </Reveal>
      </div>

      <div className="mx-auto mt-16 grid max-w-[1500px] grid-cols-2 gap-4 px-4 md:grid-cols-4 md:gap-5 md:px-12">
        {cols.map((col, ci) => (
          <motion.ul key={ci} style={{ y: ys[ci] }} className={`flex flex-col gap-4 md:gap-5 ${ci > 1 ? "hidden md:flex" : ""}`}>
            {col.map(({ p, x }, k) => (
              <li key={p.src + k}>
                <Link
                  href={`/gallery/${x.c.slug}`}
                  aria-label={`${x.c.title} — open collection`}
                  className="group relative block overflow-hidden rounded-2xl bg-ink-3 ring-1 ring-white/10"
                  style={{ aspectRatio: `${p.w} / ${p.h}` }}
                >
                  <Image
                    src={p.src}
                    alt=""
                    fill
                    sizes="(min-width:768px) 25vw, 50vw"
                    placeholder={p.blur ? "blur" : "empty"}
                    blurDataURL={p.blur}
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/0 to-black/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <span className="absolute inset-x-4 bottom-4 translate-y-2 text-white opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    <span className="block text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-white/70">{x.c.sub}</span>
                    <span className="mt-1 block font-semibold leading-tight">{x.c.title}</span>
                  </span>
                </Link>
              </li>
            ))}
          </motion.ul>
        ))}
      </div>
    </section>
  );
}

/* ───────── 3 · closing prompt ───────── */
function Closing() {
  return (
    <section className="px-6 pb-24 md:px-12" aria-labelledby="found-one">
      <Reveal>
        <div className="soft mx-auto flex max-w-[1500px] flex-col items-start justify-between gap-8 rounded-[2rem] p-8 md:flex-row md:items-center md:p-12">
          <div>
            <h2 id="found-one" className="font-display text-[clamp(1.8rem,3.4vw,3rem)]">Found the one?</h2>
            <p className="mt-3 max-w-lg text-mute">Every photograph is available as a framed print, in five sizes with black or brown frames.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/framing" className="hm-btn hm-btn-primary">Framing &amp; pricing</Link>
            <Link href="/contact" className="hm-btn hm-btn-ghost">Make an enquiry</Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
