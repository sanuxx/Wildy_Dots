"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import type { Img } from "@/lib/data";

const PAGE = 36;

export default function PhotoGrid({ photos }: { photos: Img[] }) {
  const [shown, setShown] = useState(PAGE);
  const [open, setOpen] = useState<number | null>(null);
  const sentinel = useRef<HTMLDivElement>(null);

  useEffect(() => setShown(PAGE), [photos]);

  useEffect(() => {
    const el = sentinel.current;
    if (!el || shown >= photos.length) return;
    const io = new IntersectionObserver(
      (e) => e[0].isIntersecting && setShown((s) => Math.min(s + PAGE, photos.length)),
      { rootMargin: "1200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [shown, photos.length]);

  return (
    <>
      <div className="columns-2 gap-3 md:columns-3 md:gap-5 xl:columns-4">
        {photos.slice(0, shown).map((p, i) => (
          <motion.button
            key={p.src}
            onClick={() => setOpen(i)}
            className="group relative mb-3 block w-full overflow-hidden rounded-2xl bg-ink-3 ring-1 ring-black/5 md:mb-5"
            style={{ aspectRatio: `${p.w} / ${p.h}` }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -8% 0px" }}
            transition={{ duration: 0.9, ease: [0.2, 0.7, 0.2, 1] }}
            aria-label={`View larger: ${p.title ?? "photograph"}`}
          >
            <Image
              src={p.src}
              alt={p.title ? `${p.title} — wildlife photograph by Adheesha Salpitikorala` : "Wildlife photograph"}
              fill
              sizes="(min-width:1280px) 25vw, (min-width:768px) 33vw, 50vw"
              placeholder={p.blur ? "blur" : "empty"}
              blurDataURL={p.blur}
              className="object-cover transition-all duration-[1200ms] ease-out group-hover:scale-[1.07] group-hover:brightness-110"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </motion.button>
        ))}
      </div>
      <div ref={sentinel} className="h-10" />
      {shown < photos.length && (
        <p className="py-8 text-center text-sm text-mute" role="status">Loading more photographs…</p>
      )}
      <Lightbox photos={photos} index={open} setIndex={setOpen} />
    </>
  );
}

function Lightbox({ photos, index, setIndex }: { photos: Img[]; index: number | null; setIndex: (i: number | null) => void }) {
  const go = useCallback(
    (d: number) => setIndex(index === null ? null : (index + d + photos.length) % photos.length),
    [index, photos.length, setIndex],
  );

  const closeRef = useRef<HTMLButtonElement>(null);
  const opened = index !== null;

  // lock page scroll, support the keyboard, and return focus to where the visitor was
  useEffect(() => {
    if (!opened) return;
    const before = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      before?.focus?.();
    };
  }, [opened]);

  useEffect(() => {
    if (!opened) return;
    const k = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIndex(null);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [opened, go, setIndex]);

  const p = index === null ? null : photos[index];
  return (
    <AnimatePresence>
      {p && index !== null && (
        <motion.div
          className="fixed inset-0 z-[85] flex flex-col bg-ink/95 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          role="dialog"
          aria-modal="true"
          aria-label={`Photograph ${index + 1} of ${photos.length}`}
        >
          <div className="flex items-center justify-between px-6 py-5 text-sm text-mute md:px-10">
            <span className="tabular-nums">
              <span className="font-semibold text-bone">{index + 1}</span> of {photos.length}
            </span>
            <button ref={closeRef} onClick={() => setIndex(null)} className="soft-sm rounded-full px-5 py-2 font-medium text-bone">
              Close
            </button>
          </div>

          <div className="relative flex-1" onClick={() => setIndex(null)}>
            <AnimatePresence mode="wait">
              <motion.div
                key={p.src}
                className="absolute inset-0 px-4 md:px-24"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.35 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.25}
                onDragEnd={(_, i) => {
                  if (i.offset.x < -80) go(1);
                  else if (i.offset.x > 80) go(-1);
                }}
              >
                <Image src={p.src} alt={p.title ?? ""} fill sizes="100vw" className="select-none rounded-3xl object-contain" priority draggable={false} />
              </motion.div>
            </AnimatePresence>
            <button aria-label="Previous photograph" onClick={(e) => { e.stopPropagation(); go(-1); }} className="soft-sm absolute left-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full text-xl text-bone md:left-6">←</button>
            <button aria-label="Next photograph" onClick={(e) => { e.stopPropagation(); go(1); }} className="soft-sm absolute right-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full text-xl text-bone md:right-6">→</button>
          </div>

          <div className="flex flex-col items-start justify-between gap-3 px-6 py-5 md:flex-row md:items-center md:px-10">
            <p className="font-display text-2xl text-bone">{p.title}</p>
            <Link
              href={`/contact?photo=${encodeURIComponent(p.title ?? "")}`}
              className="bg-copper px-6 py-3 text-[0.88rem] font-semibold"
            >
              Enquire about this print
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
