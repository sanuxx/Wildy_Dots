"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { allPhotos, categories, coverOf } from "@/lib/data";
import { Reveal } from "./motion";

/** All eleven collections as a horizontal row of tall photo cards (native scroll + arrow buttons). */
export default function Collections() {
  const row = useRef<HTMLUListElement>(null);
  const scroll = (d: number) => row.current?.scrollBy({ left: d * row.current.clientWidth * 0.8, behavior: "smooth" });

  return (
    <section className="py-20 md:py-28" aria-labelledby="collections">
      <div className="mx-auto mb-10 flex max-w-[1500px] flex-col justify-between gap-6 px-6 md:flex-row md:items-end md:px-12">
        <Reveal>
          <p className="eyebrow mb-5">Photo categories</p>
          <h2 id="collections" className="font-display text-[clamp(2.4rem,5vw,4.6rem)]">
            Explore the collections
          </h2>
          <p className="mt-5 max-w-xl text-mute">
            Eleven collections of Sri Lankan wildlife — from the elephants of Kalawewa to the leopards of Wilpattu.
          </p>
        </Reveal>
        <div className="flex gap-3">
          <button onClick={() => scroll(-1)} aria-label="Scroll collections left" className="hm-round">←</button>
          <button onClick={() => scroll(1)} aria-label="Scroll collections right" className="hm-round">→</button>
        </div>
      </div>

      <ul ref={row} className="noscroll flex snap-x snap-mandatory scroll-px-6 gap-5 overflow-x-auto px-6 pb-4 md:scroll-px-12 md:px-12">
        {categories.map((c, i) => {
          const cover = coverOf(c, i);
          const count = allPhotos(c).length;
          return (
            <li key={c.slug} className="w-[74vw] shrink-0 snap-start sm:w-[300px] md:w-[320px]">
              <Link
                href={`/gallery/${c.slug}`}
                className="group relative block h-[440px] overflow-hidden rounded-2xl bg-ink-3 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.9)] ring-1 ring-white/10"
              >
                <Image
                  src={cover.src}
                  alt={`${c.title} — ${c.sub}`}
                  fill
                  sizes="320px"
                  placeholder={cover.blur ? "blur" : "empty"}
                  blurDataURL={cover.blur}
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/10" />
                <span className="absolute left-4 top-4 rounded-full bg-black/35 px-3 py-1 text-[0.75rem] font-medium text-white backdrop-blur-md">
                  {count ? `${count} photographs` : "By enquiry"}
                </span>
                <span className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-colors group-hover:bg-white group-hover:text-black">
                  ↗
                </span>
                <span className="absolute inset-x-5 bottom-5 text-white">
                  <span className="block text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-white/65">
                    {String(i + 1).padStart(2, "0")} · {c.sub}
                  </span>
                  <span className="mt-2 block text-[1.6rem] font-semibold leading-[1.08] tracking-[-0.02em]">{c.title}</span>
                </span>
              </Link>
            </li>
          );
        })}
        <li className="w-[60vw] shrink-0 snap-start sm:w-[260px]">
          <Link
            href="/gallery"
            className="soft-card flex h-[440px] flex-col items-start justify-end rounded-2xl p-6"
          >
            <span className="hm-round mb-5">→</span>
            <span className="text-[1.5rem] font-semibold leading-tight tracking-[-0.02em]">View all collections</span>
            <span className="mt-2 text-[0.9rem] text-mute">Browse every photograph</span>
          </Link>
        </li>
      </ul>
    </section>
  );
}
