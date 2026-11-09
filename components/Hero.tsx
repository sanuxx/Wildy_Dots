"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { allPhotos, categories, getCategory, landing } from "@/lib/data";

/**
 * Home showcase, modelled on a "destination" layout: a full-screen photograph per featured
 * collection, the collection name large on the left (previous / next faint above and below),
 * and a row of tall photo cards from that collection on the right.
 *
 * Only collections with a large original photograph are featured, so the background stays sharp.
 * `tint` adds a soft colour mood over the photograph (the originals are black & white);
 * `mood` is the colour of the shade that keeps the text readable.
 */
const FEATURED = [
  { slug: "shadows-in-the-darkness", bg: 4, mood: "26,20,12", tint: "#b8893a", line: "The island’s most elusive cat, waiting in the half-light." },
  { slug: "majestic-wild", bg: 3, mood: "34,26,18", tint: "#a8794a", line: "Tuskers and herds of Sri Lanka’s dry zone, followed for seven years." },
  { slug: "beauties-of-the-skies", bg: 5, mood: "14,24,34", tint: "#4f86b0", line: "Wings over the island’s lakes, forests and open sky." },
  { slug: "innocence-of-the-grasslands", bg: 2, mood: "30,24,14", tint: "#b8924e", line: "Spotted deer in the long grass at first and last light." },
  { slug: "acrobats-of-the-canopies", bg: 0, mood: "24,20,14", tint: "#9a7a52", line: "Life in the treetops, one curious glance at a time." },
];

const SLIDES = FEATURED.flatMap((f) => {
  const cat = getCategory(f.slug);
  const bgImg = landing[f.bg];
  if (!cat || !bgImg) return [];
  const photos = allPhotos(cat);
  const cards = [2, 5, 8].map((k) => ({ p: photos[k % photos.length], n: (k % photos.length) + 1 }));
  return [{ ...f, cat, bgImg, count: photos.length, cards }];
});

const INTERVAL = 7000;
const EASE = [0.2, 0.7, 0.2, 1] as const;
const pad = (n: number) => String(n).padStart(2, "0");

export default function Hero() {
  const N = SLIDES.length;
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);

  const go = useCallback(
    (d: number) => {
      setDir(d);
      setI((n) => (n + d + N) % N);
    },
    [N],
  );
  const to = (k: number) => {
    setDir(k > i ? 1 : -1);
    setI(k);
  };

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  // advance automatically — never while the visitor is interacting, or if they prefer reduced motion
  useEffect(() => {
    if (paused || reduced) return;
    const t = setTimeout(() => go(1), INTERVAL);
    return () => clearTimeout(t);
  }, [i, go, paused, reduced]);

  // load the next background in good time
  useEffect(() => {
    const nx = SLIDES[(i + 1) % N];
    const id = window.setTimeout(() => {
      new window.Image().src = nx.bgImg.src;
    }, 1200);
    return () => window.clearTimeout(id);
  }, [i, N]);

  const s = SLIDES[i];
  const prev = SLIDES[(i - 1 + N) % N];
  const next = SLIDES[(i + 1) % N];

  return (
    <section
      className="relative h-[100svh] min-h-[700px] w-full overflow-hidden bg-[#0c0e0d] text-white"
      aria-roledescription="carousel"
      aria-label="Featured collections"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <h1 className="sr-only">Wildy Dots — fine-art wildlife photography from Sri Lanka</h1>

      {/* background */}
      <AnimatePresence initial={false}>
        <motion.div
          key={i}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.3, ease: "easeInOut" }}
        >
          <motion.div className="absolute inset-0" initial={{ scale: 1.12 }} animate={{ scale: 1.02 }} transition={{ duration: 9, ease: "easeOut" }}>
            <Image
              src={s.bgImg.src}
              alt=""
              fill
              priority={i === 0}
              unoptimized={!process.env.NEXT_PUBLIC_BASE_PATH}
              sizes="100vw"
              placeholder={s.bgImg.blur ? "blur" : "empty"}
              blurDataURL={s.bgImg.blur}
              className="object-cover"
            />
          </motion.div>
          <div className="absolute inset-0" style={{ background: s.tint, mixBlendMode: "color", opacity: 0.42 }} />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(90deg, rgba(${s.mood},0.94) 0%, rgba(${s.mood},0.72) 36%, rgba(${s.mood},0.18) 72%, rgba(${s.mood},0.4) 100%)`,
            }}
          />
        </motion.div>
      </AnimatePresence>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/60 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-[#0f1110] to-transparent" />
      <div className="film-grain pointer-events-none absolute inset-0" aria-hidden />
      <motion.div
        className="pointer-events-none absolute inset-0 z-30 bg-black"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 1.4, ease: "easeOut" }}
        aria-hidden
      />

      {/* content */}
      <div className="relative z-10 mx-auto grid h-full max-w-[1500px] items-center gap-10 px-6 pb-32 pt-28 md:px-12 lg:grid-cols-[minmax(0,1fr)_auto]">
        <div className="max-w-2xl">
          <p className="text-[0.75rem] font-semibold uppercase tracking-[0.3em] text-white/70" aria-live="polite">
            Collection {pad(i + 1)} <span className="text-white/35">/ {pad(N)}</span> · {s.cat.sub}
          </p>

          <button
            onClick={() => go(-1)}
            className="mt-7 block text-left text-[clamp(1.05rem,1.7vw,1.5rem)] font-semibold tracking-[-0.02em] text-white/30 transition-colors hover:text-white/60"
          >
            {prev.cat.title}
          </button>
          <div className="relative overflow-hidden py-2">
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={i}
                className="font-display text-[clamp(2.8rem,6.2vw,6.4rem)] !leading-[0.95] text-white"
                initial={{ y: dir * 70, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -dir * 70, opacity: 0 }}
                transition={{ duration: 0.65, ease: EASE }}
              >
                {s.cat.title}
              </motion.p>
            </AnimatePresence>
          </div>
          <button
            onClick={() => go(1)}
            className="block text-left text-[clamp(1.05rem,1.7vw,1.5rem)] font-semibold tracking-[-0.02em] text-white/30 transition-colors hover:text-white/60"
          >
            {next.cat.title}
          </button>

          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={i}
              className="mt-7 max-w-md text-[1.02rem] leading-relaxed text-white/80"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              {s.line} <span className="text-white/55">{s.count} photographs.</span>
            </motion.p>
          </AnimatePresence>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={`/gallery/${s.cat.slug}`} className="hm-btn hm-btn-primary">
              Explore <span aria-hidden>→</span>
            </Link>
            <Link href="/gallery" className="hm-btn hm-btn-ghost">
              All {categories.length} collections
            </Link>
          </div>
        </div>

        {/* photo cards from the active collection */}
        <div className="hidden lg:block">
          <AnimatePresence mode="wait" initial={false}>
            <motion.ul key={i} className="flex gap-4" exit={{ opacity: 0, x: -30, transition: { duration: 0.35 } }}>
              {s.cards.map((c, k) => (
                <motion.li
                  key={k}
                  initial={{ opacity: 0, x: 80 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.1 + 0.12 * k, ease: EASE }}
                >
                  <Link
                    href={`/gallery/${s.cat.slug}`}
                    aria-label={`${s.cat.title}, photograph ${c.n}`}
                    className="group relative block h-[300px] w-[200px] overflow-hidden rounded-2xl shadow-[0_30px_60px_-30px_rgba(0,0,0,0.9)] ring-1 ring-white/10 xl:h-[340px] xl:w-[230px]"
                  >
                    <Image
                      src={c.p.src}
                      alt=""
                      fill
                      sizes="230px"
                      placeholder={c.p.blur ? "blur" : "empty"}
                      blurDataURL={c.p.blur}
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <span className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
                    <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-sm backdrop-blur-md transition-colors group-hover:bg-white group-hover:text-black">
                      ↗
                    </span>
                    <span className="absolute inset-x-4 bottom-4">
                      <span className="block text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-white/60">{s.cat.sub}</span>
                      <span className="mt-1 block text-[1.05rem] font-semibold leading-tight">No. {pad(c.n)}</span>
                    </span>
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
          </AnimatePresence>
        </div>
      </div>

      {/* controls */}
      <div className="absolute inset-x-0 bottom-0 z-20 mx-auto flex max-w-[1500px] items-end justify-between gap-6 px-6 pb-8 md:px-12 md:pb-10">
        <div className="flex items-center gap-2">
          {SLIDES.map((sl, k) => (
            <button key={sl.slug} onClick={() => to(k)} aria-label={`Show ${sl.cat.title}`} aria-current={k === i ? "true" : undefined} className="group py-3">
              <span className={`block h-[2px] rounded-full transition-all duration-500 ${k === i ? "w-14 bg-white" : "w-7 bg-white/30 group-hover:bg-white/60"}`} />
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => go(-1)} aria-label="Previous collection" className="hm-round">
            ←
          </button>
          <button onClick={() => go(1)} aria-label="Next collection" className="hm-round">
            →
          </button>
          <span className="ml-3 hidden text-5xl font-semibold tabular-nums tracking-[-0.04em] text-white/90 sm:block md:text-6xl" aria-hidden>
            {pad(i + 1)}
          </span>
        </div>
      </div>
    </section>
  );
}
